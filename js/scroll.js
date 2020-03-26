let button = document.querySelector('.scroll');
button.addEventListener('click', goToTop);

window.onscroll = function() {
    showTopButton()
};

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function showTopButton() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.querySelector(".scroll").style.display = "block";
    } else {
        document.querySelector(".scroll").style.display = "none";
    }
}
