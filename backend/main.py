from fastapi import FastAPI, Body, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import json

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class SudokuPayload(BaseModel):
    board: list[list[int]]

class ConnectionManager:
    def __init__ (self):
        self.active_connections: list[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    async def send_board(self, board: str, websocket: WebSocket):
        await websocket.send_text(board)
    async def broadcast(self, board: str):
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(board)
            except Exception as e:
                print(f"Failed to send to connection: {e}")
                dead_connections.append(connection)
        
        # Remove dead connections
        for dead in dead_connections:
            self.disconnect(dead)

manager = ConnectionManager()

@app.post('/get_sudoku_board')

async def get_sudoku_board(payload: SudokuPayload):
    board = payload.board
    #print("Received JSON:", board)
    input_board = "\n".join(" ".join(str(x) for x in row)for row in board) #have spaces in input, might need fixing later on 

    #run cpp solver
    result = subprocess.run(["./sudoku_solver_backend"], #with .exe when running locally and on windows / without exe for render and linux
                            input=input_board,
                            text=True,
                            capture_output=True)
    
    nums = list(map(int, result.stdout.split()))
    solved = [nums[i*9:(i+1)*9] for i in range(9)]

    return {"solved": solved}

@app.get('/generate_board')
async def generate_board():
    result = subprocess.run(["./sudoku_generate_board"],
                            text=True,
                            capture_output=True,
                            timeout=15)
    
    nums = list(map(int, result.stdout.split()))
    board = [nums[i*9:(i+1)*9] for i in range(9)]
    
    return {"board": board}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            string = json.loads(data)
            board = string['board']
            colors = string['colors']
            await manager.broadcast(json.dumps({"type": "board-update", "board": board, "colors": colors}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)