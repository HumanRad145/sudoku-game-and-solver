document.addEventListener('DOMContentLoaded', function() {
    const savedBoard = sessionStorage.getItem('board');
    if (savedBoard){
        const board = JSON.parse(savedBoard);
        console.log('Here');
        console.log('board', board);
        updateReturnSudoku(board);
        console.log('After updating')
        
    }
});

document.querySelectorAll("#sudoku td").forEach((cell) => {
    cell.addEventListener("click", () => {
        selectCell(cell);
        //makeCellEditable(cell);
    });
});

document.addEventListener('click', function(event){
    const table = document.getElementById('sudoku');
    const buttons = document.getElementById('sudoku-controls');

    if(!table.contains(event.target) && !buttons.contains(event.target)){
        const allCells = document.querySelectorAll("#sudoku td");
        allCells.forEach(cell => cell.style.backgroundColor = "");
    }
})

function selectCell(cell){
    const rows = document.querySelectorAll("#sudoku tr");
    for (let i=0; i < rows.length; i++){
        const cells = rows[i].querySelectorAll("td");
        for (let j=0; j < cells.length; j++){
            cells[j].style.backgroundColor = "";
        }
    }

    cell.style.backgroundColor = "lightblue"; 

}

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

function updateReturnSudoku(solved){
    const rows = document.querySelectorAll("#sudoku tr");
    for (let i=0; i<9; i++){
        const cells = rows[i].querySelectorAll("td");
        for (let j=0; j<9; j++){
            if (solved[i][j] == 0){
                cells[j].innerHTML = ' ';
            } else { cells[j].innerHTML = solved[i][j];}
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

const number_btns = document.querySelectorAll('.ctrl-btn');

number_btns.forEach(button => {
    button.addEventListener('click', (e) => {
        const number = e.target.innerText;
        const allCells = document.querySelectorAll("#sudoku td");
        allCells.forEach(cell => {
            if (cell.style.backgroundColor == "lightblue" || cell.style.backgroundColor == "rgb(173, 216, 230)"){
                console.log("Is selected");
                cell.textContent = number;
            } else {
                console.log("not selected");
            }
        });
    })
})

