for (let i = 1; i <= 10; i++) {
    let row = "";
    for (let j = 1; j <= 10; j++) {
        row += formatCell(i * j);
    }
    console.log(row);
    row = "";
}

function formatCell(number) {
    if (number < 10) {
        return `   ${number}`;
    } else if (number < 100) {
        return `  ${number}`;
    } else {
        return ` ${number}`
    }
};