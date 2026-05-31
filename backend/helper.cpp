#include "helper.h"
#include <random>

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

int numberGenerate(int min, int max){
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_int_distribution<int> distrib(min, max);
    return distrib(gen);
}

bool randomBoard(int grid[][9], int r, int c){
    if (r == 9){
        return true;
    }
    if (c == 9){
        return randomBoard(grid, r+1, 0);
    }
    if (grid[r][c] == 0){ //check if it's an empty cell
        int numbers[9] = {1,2,3,4,5,6,7,8,9};

        for (int i = 8; i > 0; --i){
            int j = numberGenerate(0, i);
            std::swap(numbers[i], numbers[j]);
        }
        
        // Try each number
        for (int i = 0; i < 9; ++i){
            grid[r][c] = numbers[i];
            if (safe(grid) && randomBoard(grid, r, c + 1)){
                return true;
            }
        }
        grid[r][c] = 0;
        return false;
    } 
    else {
        return randomBoard(grid, r, c+1);
    }
    
}



int solutionCount(int grid[][9], int r, int c, int maxCount){
    if (r == 9){ //Base case where it is finished
        return 1;
    }
    if (c == 9){
        return solutionCount(grid, r+1, 0, maxCount);
    }
    if (grid[r][c] == 0){ //check if it's an empty cell
        int count = 0;
        for (int i = 1; i <= 9; ++i){ //loop from 1 to 9 (to try the numbers)
            grid[r][c] = i;
            if (safe(grid)){
                count += solutionCount(grid, r, c+1, maxCount);
                if (count >= maxCount) break;
            }
            grid[r][c] = 0;
        }
        return count;
    }
    else { //already filled cell
        return solutionCount(grid, r, c+1, maxCount);
    }
}
