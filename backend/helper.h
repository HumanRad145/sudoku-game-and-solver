#ifndef __HELPER__H__
#define __HELPER__H__

#include <iostream>
using namespace std;

bool safe(int grid[][9]);
bool solve(int grid[][9], int r, int c);
int solutionCount(int grid[][9], int r, int c);
bool randomBoard(int grid[][9], int r, int c);


#endif