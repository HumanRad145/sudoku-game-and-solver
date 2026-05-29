#include <iostream>
#include <cstring>
using namespace std;

bool safe(int grid[][9]){
    for (int row = 0; row < 8; ++row){
        for (int col = 0; col < 8; ++col){
            //check if have duplicates in the 9 boxes
            
            for (int j = col+1; j < 9; j++){
                if (grid[row][col] != 0 && grid[row][j] != 0)
                    if (grid[row][col] == grid[row][j])  //check if have duplicates across horizontal
                        return false;
                if (grid[col][row] != 0 && grid[j][row] != 0)
                    if (grid[col][row] == grid[j][row]) //check if have duplicates across vertical
                        return false;
            }

        }
    }
    for (int row = 0; row < 9; row++){
        for (int col = 0; col < 9; col++){
            for (int i = row - row % 3; i < (row - row%3)+3; i++){
                for (int j = col - col % 3; j < (col - col%3)+3; j++){
                    if (i == row && j == col)
                    continue;
                    if (grid[row][col] != 0){
                        if (grid[row][col] == grid[i][j]){
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

bool solve(int grid[][9], int r, int c){
    
    if (r == 9){ //Base case where it is finished
        return true;
    }
    if (c == 9){
        return solve(grid, r+1, 0);
    }
    if (grid[r][c] == 0){ //check if it's an empty cell
        for (int i = 1; i <= 9; ++i){ //loop from 1 to 9 (to try the numbers)
            grid[r][c] = i;
            if (safe(grid) && solve(grid, r, c + 1))
                return true;
        }
    }
    else {
        return solve(grid, r, c+1);
    }
    grid[r][c] = 0;
    return false;
}

int main(){
    //initializing board
    int board[9][9];
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            cin >> board[i][j];
        }
    }

    if (!safe(board)){
        return 1;
    }

    bool solved;
    solved = solve(board, 0,0);
    if (solved == true){
        for (int i = 0; i < 9; i++){
            for (int j = 0; j < 9; j++){
    
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
    }
    //thinking whether should I do else and print "Impossible to solve"
    return 0;
}

