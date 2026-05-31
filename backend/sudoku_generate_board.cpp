#include <iostream>
#include <cstring>
#include <algorithm>
#include "helper.h"
using namespace std;

int main(){
    srand(time(0));
    int board[9][9] = {};
    randomBoard(board, 0, 0);
    int count = 50, removed = 0, attempts = 0, maxAttempts = 200;
    while (removed < 50 && attempts < maxAttempts){
        attempts++;
        int row = numberGenerate(0, 8);
        int col = numberGenerate(0, 8);
        if (board[row][col] == 0) continue;
        int temp = board[row][col];
        board[row][col] = 0;

        if (solutionCount(board, 0, 0, 2) == 1){
            removed++;
        } else {
            board[row][col] = temp;
        }
    }


    for (int i = 0; i < 9; i++){
        for (int j = 0; j < 9; j++){

            cout << board[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}