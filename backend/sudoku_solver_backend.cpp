#include <iostream>
#include <cstring>
#include "helper.h"
using namespace std;

int main(){
    //initializing board
    int board[9][9];
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            cin >> board[i][j];
        }
    }

    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            int num = board[i][j];
            if (!safe(board, i, j, num)){
                return 1;
            }
        }
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

