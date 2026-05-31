document.querySelectorAll("#sudoku td").forEach((cell) => {
    cell.addEventListener("click", () => {
        selectCell(cell);
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
    if (!activeCell || activeCell.style.color == 'black'){ return; }
    if (event.key >= '1' && event.key <= 9){
        activeCell.textContent = event.key;
        activeCell.style.color = "rgb(20, 78, 133)";
    } else if (event.key == 'Backspace' || event.key == 'Delete' || event.key === ' '){
        activeCell.textContent = "";
        activeCell.style.color = "black";

    }
    send_board();

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

function scrapeColorFromPage(){
    const colors = [];
    document.querySelectorAll("#sudoku td").forEach((cell) => {
        colors.push(window.getComputedStyle(cell).color);
    });
    return colors;
}

function updateSudoku(board, colors=null){
    const rows = document.querySelectorAll("#sudoku tr");
    for (let i=0; i<9; i++){
        const cells = rows[i].querySelectorAll("td");
        for (let j=0; j<9; j++){
            if (board[i][j] == 0){
                cells[j].textContent = ' ';
            } else { 
                cells[j].textContent = board[i][j];
            }
            if (colors){
                cells[j].style.color = colors[i*9+j];
            } else {
                cells[j].style.color = "black";
            }
        }
    }

}

const link = document.getElementById("go-back-to-solver");

link.addEventListener('click', function(event) {
    event.preventDefault();

    const board = scrapeSudokuFromPage();
    sessionStorage.setItem('board', JSON.stringify(board));

    window.location.href = event.target.href;
})

const number_btns = document.querySelectorAll('.ctrl-btn');

number_btns.forEach(button => {
    button.addEventListener('click', (e) => {
        const number = e.target.innerText;
        const allCells = document.querySelectorAll("#sudoku td");
        allCells.forEach(cell => {
            if (cell.style.color == "black"){
                return;
            }
            if (cell.style.backgroundColor == "lightblue" || cell.style.backgroundColor == "rgb(173, 216, 230)"){
                cell.textContent = number;
                cell.style.color = "rgb(20, 78, 133)";
                console.log(cell, cell.style.color);
                send_board();
            }
        });
    })
})

var ws = new WebSocket("ws://sudoku-game-and-solver.onrender.com/ws");
ws.onmessage = function(event){
    const data = JSON.parse(event.data);
    updateSudoku(data.board, data.colors);
}

function send_board(){
    const board = scrapeSudokuFromPage();
    const colors = scrapeColorFromPage();
    if (ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({ board: board, colors: colors}));
    }
}

const diff_btns = document.querySelectorAll(".diff-btn");

diff_btns.forEach(button => {
    button.addEventListener('click', getGeneratedBoard);
});

async function getGeneratedBoard(){
    const response = await fetch("https://sudoku-game-and-solver.onrender.com/generate_board");
    const data = await response.json();
    const colors = new Array(81).fill("black");
    updateSudoku(data.board, colors);
}