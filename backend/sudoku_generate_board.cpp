#include <iostream>
#include <cstring>
#include "helper.h"
using namespace std;

int main(){
    int board[9][9] = {};
    randomBoard(board, 0, 0);
    for (int i = 0; i < 9; i++){
        for (int j = 0; j < 9; j++){

            cout << board[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}