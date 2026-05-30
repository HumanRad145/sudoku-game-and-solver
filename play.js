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
                console.log("Is selected");
                cell.textContent = number;
            } else {
                console.log("not selected");
            }
        });
    })
})