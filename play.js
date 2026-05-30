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
    if (!activeCell){ return; }
    if (event.key >= '1' && event.key <= 9){
        activeCell.textContent = event.key;
    } else if (event.key == 'Backspace' || event.key == 'Delete' || event.key == 'Space'){
        activeCell.textContent = event.key;
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

function updateSudoku(solved){
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
            if (cell.style.backgroundColor == "lightblue" || cell.style.backgroundColor == "rgb(173, 216, 230)"){
                cell.textContent = number;
                send_board();
            }
        });
    })
})

var ws = new WebSocket("ws://sudoku-game-and-solver.onrender.com/ws");
ws.onmessage = function(event){
    const data = JSON.parse(event.data);
    updateSudoku(data.board);
}

function send_board(){
    const board = scrapeSudokuFromPage();
    if (ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify({ board: board}));
    }
}