let progress = document.querySelector('.progress');
let error = document.querySelector('.error');

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let questionNumber = document.querySelector('.questionNumber');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average');

let preQuestions;
let index = 0;
let points = 0;

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        progress.style.display = 'none';
        list.style.display = 'block';
        setQuestion(index);
        activateAnswers();
    }).catch((e) => {
    progress.style.display = 'none';
    error.style.display = 'block';
});

next.addEventListener('click', function () {
    if (next.innerHTML === "Save") {
        saveUserResultToStorage();
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;
        average.innerHTML = localStorage.getItem('averageResultKey');
        return;
    }

    if (index < preQuestions.length - 1) {
        index++;

        if (isLastQuestion(index)) {
            next.innerHTML = "Save";
        }

        setQuestion(index);
        activateAnswers();
    }
});

function isLastQuestion(index) {
    return preQuestions.length === index + 1;
}

previous.addEventListener('click', function () {
    if (index > 0) {
        index--;
        next.innerHTML = "Next";
        setQuestion(index);
        activateAnswers();
    }
});

function setQuestion(index) {
    clearClass();
    questionNumber.innerHTML = `${index + 1} / ${preQuestions.length}`;
    question.innerHTML = preQuestions[index].question;

    const answersCount = preQuestions[index].answers.length;

    for (let i = 0; i < 4; i++) {
        if (i < answersCount) {
            answers[i].innerHTML = preQuestions[index].answers[i];
            answers[i].style.display = 'block';
        } else {
            answers[i].style.display = 'none';
        }
    }
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function clearClass() {
    answers.forEach(answer => {
        answer.classList.remove('correct');
        answer.classList.remove('incorrect');
    });
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function saveUserResultToStorage() {
    const savedUserResult = localStorage.getItem('averageResultKey');
    const savedGamesCount = localStorage.getItem('gamesCountKey');

    if (savedUserResult === null) {
        localStorage.setItem('averageResultKey', points);
        localStorage.setItem('gamesCountKey', 1);
    } else {
        const averageResult = calculateAverageResult(savedUserResult, savedGamesCount, points);
        localStorage.setItem('averageResultKey', averageResult);
        localStorage.setItem('gamesCountKey', parseInt(savedGamesCount) + 1);
    }
}

function calculateAverageResult(savedResult, savedGamesCount, currentResult) {
    const sumFromSavedGames = parseFloat(savedResult) * parseInt(savedGamesCount);
    return (sumFromSavedGames + currentResult) / (parseInt(savedGamesCount) + 1);
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    next.innerHTML = "Next";
    list.style.display = 'block';
    results.style.display = 'none';
});