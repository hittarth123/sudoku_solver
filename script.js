const arr = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(`cell-${i * 9 + j}`);
    }
}

let board = Array.from({ length: 9 }, () => Array(9).fill(0));

function fillBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j].innerText = board[i][j] !== 0 ? board[i][j] : '';
        }
    }
}

document.getElementById('GetPuzzle').onclick = function () {
    const xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        const response = JSON.parse(xhrRequest.response);
        board = response.board;
        fillBoard(board);
    };
    xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
    xhrRequest.send();
};

document.getElementById('SolvePuzzle').onclick = () => {
    sudokuSolver(board, 0, 0, 9);
};

function isSafe(board, row, col, val, n) {
    for (let i = 0; i < n; i++) {
        if (board[row][i] === val || board[i][col] === val) return false;
    }
    const rn = Math.sqrt(n);
    const si = row - row % rn;
    const sj = col - col % rn;
    for (let x = si; x < si + rn; x++) {
        for (let y = sj; y < sj + rn; y++) {
            if (board[x][y] === val) return false;
        }
    }
    return true;
}

function sudokuSolver(board, row, col, n) {
    if (row === n) {
        fillBoard(board);
        return true;
    }
    if (col === n) return sudokuSolver(board, row + 1, 0, n);
    if (board[row][col] !== 0) return sudokuSolver(board, row, col + 1, n);

    for (let val = 1; val <= 9; val++) {
        if (isSafe(board, row, col, val, n)) {
            board[row][col] = val;
            if (sudokuSolver(board, row, col + 1, n)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}
