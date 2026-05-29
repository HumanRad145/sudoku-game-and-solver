document.querySelectorAll("#sudoku td").forEach((cell) => {
    cell.addEventListener("click", () => {
        makeCellEditable(cell);
    });
});

function makeCellEditable(cell){
    const oldValue = cell.textContent.trim();
    const input = document.createElement("input");

    input.type = "text";
    input.value = oldValue;   // ← this is the important part
    input.maxLength = 1;
    input.style.width = "20px";
    input.style.textAlign = "center";
    input.style.border = "none";
    input.style.outline = "none";


    cell.innerHTML = "";
    cell.appendChild(input);

    input.focus();

    input.addEventListener("blur", () => {
        commitCellValue(cell, input.value);
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            input.blur();
        }
    });

}

function commitCellValue(cell, inputValue){
    inputValue = inputValue.trim()
    if (inputValue >= 1 && inputValue <= 9 || inputValue == ""){
        cell.textContent = inputValue;
    } else {
        cell.textContent = "";
        alert("Invalid number");
    }
}

function alerting(){
    alert("Button Clicked");
}
function scrapeSudokuFromPage(){
    const board = [];
    const rows = document.querySelectorAll("#sudoku tr");

    for (let i=0; i < rows.length; i++){
        const row = [];
        const cells = rows[i].querySelectorAll("td");
        
        for (let j=0; j < cells.length; j++){
            const text = cells[j].textContent.trim();
            row.push(text === ""? 0 : Number(text));
        }

        board.push(row);
    }
    //scraping logic and filling the board

    return board;
}

function updateSudokuOnPage(solved){
    if (solved.length !== 9 || solved[0].length !== 9) {
        console.log("Invalid solved board");
        alert("Unsolvable board");
        play_video();
        return;
    }
    const rows = document.querySelectorAll("#sudoku tr");
    for (let i=0; i<9; i++){
        const cells = rows[i].querySelectorAll("td");
        for (let j=0; j<9; j++){
            if (cells[j].textContent != solved[i][j]){
                cells[j].innerHTML = `<span style="color: blue">${solved[i][j]}</span>`;
            }
        }
    }

}

async function solveSoduku(){
    const board = scrapeSudokuFromPage();

    const response = await fetch("https://sudoku-game-and-solver.onrender.com/get_sudoku_board", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({board})
    });

    const data = await response.json();
    updateSudokuOnPage(data.solved);
}

function clearBoard(){
    const rows = document.querySelectorAll("#sudoku tr");
    for (let i=0; i<9; i++){
        const cells = rows[i].querySelectorAll("td");
        for (let j=0; j<9; j++){
            cells[j].textContent = '';
        }
    }

}

function undoSolve(){
    const rows = document.querySelectorAll("#sudoku tr");
    for (let i=0; i<9; i++){
        const cells = rows[i].querySelectorAll("td");
        for (let j=0; j<9; j++){
            const span = cells[j].querySelector("span");
            if (span && span.style.color === "blue"){
                cells[j].innerHTML = `<span style="color: black">${""}</span>`;
            }
        }
    }

}

const board = scrapeSudokuFromPage();
console.log("JS loaded:", window.alerting);
