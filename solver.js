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

document.addEventListener('keydown', function(event){
    const allCells = document.querySelectorAll("#sudoku td");
    let activeCell = null;
    allCells.forEach(cell => {
        if (cell.style.backgroundColor == "lightblue" || cell.style.backgroundColor == "rgb(173, 216, 230)"){
            activeCell = cell;
        }
    });
    if (!activeCell){ return; }
    if (event.key >= '1' && event.key <= 9){
        activeCell.textContent = event.key;
    } else if (event.key == 'Backspace' || event.key == 'Delete' || event.key === ' '){
        activeCell.textContent = "";
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
                cell.textContent = number;
            }
        });
    })
})

async function checkDone() {
    const board = scrapeSudokuFromPage();

    const response = await fetch("https://sudoku-game-and-solver.onrender.com/get_sudoku_board", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({board})
    });

    const data = await response.json();
    if (board === data){
        return true;
    } else { 
        return false; 
    }
    
}
