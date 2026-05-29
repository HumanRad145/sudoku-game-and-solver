from fastapi import FastAPI, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class SudokuPayload(BaseModel):
    board: list[list[int]]

@app.post('/get_sudoku_board')

async def get_sudoku_board(payload: SudokuPayload):
    board = payload.board
    #print("Received JSON:", board)
    input_board = "\n".join(" ".join(str(x) for x in row)for row in board) #have spaces in input, might need fixing later on 

    #run cpp solver
    result = subprocess.run(["./sudoku_solver_backend.exe"],
                            input=input_board,
                            text=True,
                            capture_output=True)
    
    nums = list(map(int, result.stdout.split()))
    solved = [nums[i*9:(i+1)*9] for i in range(9)]

    return {"solved": solved}
   