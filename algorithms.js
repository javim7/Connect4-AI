function movement(board, player) {
    console.log('\x1b[33m\nPlayer \x1b[0m' + player + "\x1b[33m's turn\x1b[0m");
    const depth = 5;
    const maximizingPlayer = true;
    const alpha = -Infinity;
    const beta = Infinity;
  
    let bestScore = -Infinity;
    let bestMove = null;
  
    const possibleMoves = getPossibleMoves(board);
    // console.log(possibleMoves);
  
    for (const move of possibleMoves) {
      const newBoard = makeMove(board, move, player);
      let score = minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
       if (move == 3) {
            score += 750
          } else if(move == 2 || move == 4) {
           score += 100 
          }
      // console.log('Move: ' + move + ' Score: ' + score);
  
      // Check if the move leads to an opponent's winning position
      if (score < 0 && isWinningMove(newBoard, getOpponent(player))) {
        console.log('Move ' + move + ' leads to opponent win, skipping');
        continue;
      } 
      // if ((score > 0 && isWinningMove(newBoard, player))){
      //   console.log('Move ' + move + ' leads to player win blocked, skipping');
      //   continue;
      // }
  
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      if (bestMove === null) {
        bestMove = possibleMoves[0]
      }

      if(score === -Infinity) {
        bestMove = possibleMoves[0]
      }
    }
  
    console.log('\x1b[33mBest Score: \x1b[0m' + bestScore + '\x1b[33m. Best Move: \x1b[0m' + bestMove);
    return bestMove;
  }
  

function calculateHeuristic(board, player) {
    let score = 0;
    let maxScore = 10000;
    let minScore = -10000;
    let opponent = player === 1 ? 2 : 1;
    
    // Winning move
    if (checkWin(board, player)) {
    return maxScore;
    } else if (checkWin(board, opponent)) {
    return minScore;
    }

    // Evaluate horizontal combinations
    for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
        let window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
        if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
            score += evaluateWindow(window, player);
            if (score === maxScore || score === minScore) {
                return score;
            }
            }
        }
    }
    }

    // Evaluate vertical combinations
    for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
        let window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
        if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
            score += evaluateWindow(window, player);
            if (score === maxScore || score === minScore) {
                return score;
            }
            }
        }
    }
    }

    // Evaluate diagonal combinations (top left to bottom right)
    for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 3; row++) {
        let window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
        if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
            score += evaluateWindow(window, player);
                if (score === maxScore || score === minScore) {
                    return score;
                }
            }
        }
    }
    }

    // Evaluate diagonal combinations (bottom left to top right)
    for (let col = 0; col < 4; col++) {
    for (let row = 3; row < 6; row++) {
        let window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
        if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
            score += evaluateWindow(window, player);
                if (score === maxScore || score === minScore) {
                    return score;
                }
            }
        }
    }
    }

    return score;
}      


function evaluateWindow(window, player) {
    let score = 0;
    let maxScore = 10000;
    let minScore = -10000;
    let opponent = player === 1 ? 2 : 1;
    // console.log('window', window)

    let countPlayer = window.filter((cell) => cell === player).length;
    let countOpponent = window.filter((cell) => cell === opponent).length;
    // console.log('countPlayer', countPlayer, 'countOpponent', countOpponent)
    let countEmpty = window.filter((cell) => cell === 0).length;

    // Asignar las puntuaciones basadas en el número de piezas del jugador en la ventana
    if (countPlayer === 4) {
    return maxScore; // Player wins
    } else if (countPlayer === 3 && countEmpty === 1) {
    score += 1000; // Favorable position for the player
    } else if (countPlayer === 2 && countEmpty === 2) {
    score += 100; // Minor advantage for the player
    }

    // Asignar las puntuaciones basadas en el número de piezas del oponente en la ventana
    if (countOpponent === 4) {
    return minScore // Opponent wins
    } else if (countOpponent === 3 && countEmpty === 1) {
    score -= 1000; // Favorable position for the opponent
    } else if (countOpponent === 2 && countEmpty === 2) {
    score -= 100; // Minor advantage for the opponent
    }

    return score;
}

function minimax(board, depth, maximizingPlayer, alpha, beta, player) {
    // Check if the game has ended or reached the maximum depth
    if (depth === 0 || isGameOver(board)) {
    return calculateHeuristic(board, player);
    }

    if (maximizingPlayer) {
    let maxScore = -Infinity;

    // Iterate through all possible moves
    for (let move of getPossibleMoves(board)) {
        let newBoard = makeMove(board, move, player);
        let score = minimax(newBoard, depth - 1, false, alpha, beta, player);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, maxScore);
        
        if (beta <= alpha) {
        break; // Beta pruning
        }
    }

    return maxScore;
    } else {
    let minScore = Infinity;

    // Iterate through all possible moves
    for (let move of getPossibleMoves(board)) {
        let newBoard = makeMove(board, move, getOpponent(player));
        let score = minimax(newBoard, depth - 1, true, alpha, beta, player);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, minScore);

        if (beta <= alpha) {
        break; // Alpha prunin
        }
    }

    return minScore;
    }
}

function getOpponent(player) {
    // Returns the opponent player
    return player === 1 ? 2 : 1;
}

function getPossibleMoves(board) {
    // Returns an array of column numbers that represent the possible moves
    const possibleMoves = [];
    for (let col = 0; col < board[0].length; col++) {
    if (board[0][col] === 0) {
        possibleMoves.push(col);
    }
    }
    return possibleMoves;
}          

function makeMove(board, move, player) {
    // Returns a new board with the specified move made by the player
    const newBoard = JSON.parse(JSON.stringify(board)); // Create a deep copy of the board
    for (let row = board.length - 1; row >= 0; row--) {
    if (newBoard[row][move] === 0) {
        newBoard[row][move] = player;
        break;
    }
    }
    return newBoard;
}     

function isWinningMove(board, player) {
    // Create a copy of the board
    const newBoard = JSON.parse(JSON.stringify(board));

    // Make the move for the specified player
    const possibleMoves = getPossibleMoves(newBoard);
    const winningMove = possibleMoves.find(move => {
    const updatedBoard = makeMove(newBoard, move, player);
    return isGameOver(updatedBoard);
    });

    return !!winningMove;
}


function isWindowWinner(window) {

    // Returns true if the window contains a winning combination, false otherwise
    const [a, b, c, d] = window;
    return a !== 0 && a === b && a === c && a === d;
}

function isGameOver(board) {
    // Returns true if the game is over (either a player has won or the board is full), false otherwise
    
    // Check for horizontal wins
    for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length - 3; col++) {
        let window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
        if (isWindowWinner(window)) {
        return true;
        }
    }
    }
    
    // Check for vertical wins
    for (let col = 0; col < board[0].length; col++) {
    for (let row = 0; row < board.length - 3; row++) {
        let window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
        if (isWindowWinner(window)) {
        return true;
        }
    }
    }
    
    // Check for diagonal (descending) wins
    for (let col = 0; col < board[0].length - 3; col++) {
    for (let row = 0; row < board.length - 3; row++) {
        let window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
        if (isWindowWinner(window)) {
        return true;
        }
    }
    }
    
    // Check for diagonal (ascending) wins
    for (let col = 0; col < board[0].length - 3; col++) {
    for (let row = 3; row < board.length; row++) {
        let window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
        if (isWindowWinner(window)) {
        return true;
        }
    }
    }
    
    // Check if the board is full
    for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
        return false;
        }
    }
    }
    
    return true; // No winner, and the board is full
}

function checkWin(row, column) {
    const directions = [
      [1, 0], // Horizontal
      [0, 1], // Vertical
      [1, 1], // Diagonal (top left to bottom right)
      [-1, 1], // Diagonal (bottom left to top right)
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      // Check in one direction
      for (let i = 1; i <= 3; i++) {
        const newRow = row + i * dy;
        const newColumn = column + i * dx;

        if (
          newRow >= 0 &&
          newRow < 6 &&
          newColumn >= 0 &&
          newColumn < 7 &&
          row[newRow][newColumn] === column
        ) {
          count++;
        } else {
          break;
        }
      }

      // Check in the opposite direction
      for (let i = 1; i <= 3; i++) {
        const newRow = row - i * dy;
        const newColumn = column - i * dx;

        if (
          newRow >= 0 &&
          newRow < 6 &&
          newColumn >= 0 &&
          newColumn < 7 &&
          row[newRow][newColumn] === column
        ) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 4) {
        return true;
      }
    }

    return false;
  }

module.exports = {
    movement: movement
};