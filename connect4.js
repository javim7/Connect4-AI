// 6 listas de 7 elementos
class Connect4 {
    constructor() {
      this.board = [];
      this.currentPlayer = 'x'; // 'x' starts the game
      this.winner = null;
      this.moves = 0;
      this.gameOn = true;
  
      // Initialize the board with empty cells
      for (let i = 0; i < 7; i++) {
        this.board[i] = [];
        for (let j = 0; j < 6; j++) {
          this.board[i][j] = 0;
        }
      }
    }
  
    play(column) {
      if (this.winner) {
        console.log('Game over. ' + this.winner + ' has won!');
        this.gameOn = false;
        return;
      }
  
      if (column < 0 || column >= 7) {
        console.log('Invalid column. Please choose a column between 0 and 6.');
        return;
      }
  
      for (let row = 5; row >= 0; row--) {
        if (!this.board[column][row]) {
          this.board[column][row] = this.currentPlayer;
          this.moves++;
  
          if (this.checkWin(column, row)) {
            this.winner = this.currentPlayer;
            console.log('Player ' + this.winner + ' wins!');
          } else if (this.moves === 42) {
            console.log('It\'s a draw! The board is full.');
            this.gameOn = false;
          }
  
          this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
          return;
        }
      }
  
      console.log('Column ' + column + ' is full. Please choose another column.');
    }
  
    checkWin(column, row) {
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
          const x = column + i * dx;
          const y = row + i * dy;
  
          if (
            x >= 0 &&
            x < 7 &&
            y >= 0 &&
            y < 6 &&
            this.board[x][y] === this.currentPlayer
          ) {
            count++;
          } else {
            break;
          }
        }
  
        // Check in the opposite direction
        for (let i = 1; i <= 3; i++) {
          const x = column - i * dx;
          const y = row - i * dy;
  
          if (
            x >= 0 &&
            x < 7 &&
            y >= 0 &&
            y < 6 &&
            this.board[x][y] === this.currentPlayer
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
    
    // movement(board, player) {
    //   console.log(`Player ${player}'s turn`)
    //   // console.log(board)
      
    //   var movement = Math.floor(Math.random() * board.length);
    //   // let score = this.calculateHeuristic(board, player);
    //   // console.log(score);
    //   let scoreMove = this.minimax(board, 5, true, -Infinity, Infinity, player);
    //   console.log(scoreMove);

    //   return movement
    // }

    movement(board, player) {
      console.log('Player ' + player + 's turn');
      console.log(board);
      const depth = 5;
      const maximizingPlayer = true;
      const alpha = -Infinity;
      const beta = Infinity;
    
      const possibleMoves = this.getPossibleMoves(board);
      // console.log(possibleMoves);
    
      let bestMove = null;
      let bestScore = -Infinity;
    
      // Evaluate the score of the current board
      const initialScore = this.calculateHeuristic(board, player);
      // console.log('Initial score: ' + initialScore)
    
      if (initialScore >= 0) {
        // Player's favorable situation, find the best move
        for (const move of possibleMoves) {
          const newBoard = this.makeMove(board, move, player);
          const score = this.minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
          // console.log(newBoard)
          // console.log('move: ' + move + ' score: ' + score);
    
          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
    
        console.log('score: ' + bestScore + ' move: ' + bestMove);
        return bestMove;
      } else {
        // Opponent's favorable situation, block their best move
        const opponent = this.getOpponent(player);
        let opponentBestMove = null;
        let opponentBestScore = -Infinity;
    
        for (const move of possibleMoves) {
          const newBoard = this.makeMove(board, move, player);
          const score = this.minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
          console.log(newBoard)
          console.log('move: ' + move + ' score: ' + score);
    
          if (score > opponentBestScore) {
            opponentBestScore = score;
            opponentBestMove = move;
          }
        }
    
        console.log('Blocking opponent move: ' + opponentBestMove);
        return opponentBestMove;
      }
    }

    calculateHeuristic(board, player) {
      let score = 0;
      let maxScore = 100;
      let minScore = -100;
      let opponent = player === 'x' ? 'o' : 'x';
    
      // Evaluar combinaciones horizontales
      for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {
          let window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
          if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
              score += this.evaluateWindow(window, player);
              if (score === maxScore || score === minScore) {
                return score;
              }
            }
          }
        }
      }
    
      // Evaluar combinaciones verticales
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 6; row++) {
          let window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
          if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
              score += this.evaluateWindow(window, player);
              if (score === maxScore || score === minScore) {
                return score;
              }
            }
          }
        }
      }
    
      // Evaluar combinaciones diagonales descendentes
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
          let window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
          if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
              score += this.evaluateWindow(window, player);
              if (score === maxScore || score === minScore) {
                return score;
              }
            }
          }
        }
      }
    
      // Evaluar combinaciones diagonales ascendentes
      for (let col = 0; col < 4; col++) {
        for (let row = 3; row < 6; row++) {
          let window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
          if (window.some(cell => cell === player) || window.some(cell => cell === opponent)) {
            if (window.every((cell) => cell !== undefined)) {
              score += this.evaluateWindow(window, player);
              if (score === maxScore || score === minScore) {
                return score;
              }
            }
          }
        }
      }
      
      return score;
    }
    
    
    evaluateWindow(window, player) {
      let score = 0;
      let maxScore = 100;
      let minScore = -100;
      let opponent = player === 'x' ? 'o' : 'x';
      // console.log('window', window)
    
      let countPlayer = window.filter((cell) => cell === player).length;
      let countOpponent = window.filter((cell) => cell === opponent).length;
      // console.log('countPlayer', countPlayer, 'countOpponent', countOpponent)
      let countEmpty = window.filter((cell) => cell === 0).length;
    
      // Asignar las puntuaciones basadas en el número de piezas del jugador en la ventana
      if (countPlayer === 4) {
        return maxScore; // Player wins
      } else if (countPlayer === 3 && countEmpty === 1) {
        score += 10; // Favorable position for the player
      } else if (countPlayer === 2 && countEmpty === 2) {
        score += 5; // Minor advantage for the player
      }
    
      // Asignar las puntuaciones basadas en el número de piezas del oponente en la ventana
      if (countOpponent === 4) {
        return minScore // Opponent wins
      } else if (countOpponent === 3 && countEmpty === 1) {
        score -= 10; // Favorable position for the opponent
      } else if (countOpponent === 2 && countEmpty === 2) {
        score -= 5; // Minor advantage for the opponent
      }
    
      return score;
    }

    minimax(board, depth, maximizingPlayer, alpha, beta, player) {
      // Check if the game has ended or reached the maximum depth
      if (depth === 0 || this.isGameOver(board)) {
        return this.calculateHeuristic(board, player);
      }
    
      if (maximizingPlayer) {
        let maxScore = -Infinity;
    
        // Iterate through all possible moves
        for (let move of this.getPossibleMoves(board)) {
          let newBoard = this.makeMove(board, move, player);
          let score = this.minimax(newBoard, depth - 1, false, alpha, beta, player);
          maxScore = Math.max(maxScore, score);
          alpha = Math.max(alpha, maxScore);
          
          if (beta <= alpha) {
            break; // Beta cutoff
          }
        }
    
        return maxScore;
      } else {
        let minScore = Infinity;
    
        // Iterate through all possible moves
        for (let move of this.getPossibleMoves(board)) {
          let newBoard = this.makeMove(board, move, this.getOpponent(player));
          let score = this.minimax(newBoard, depth - 1, true, alpha, beta, player);
          minScore = Math.min(minScore, score);
          beta = Math.min(beta, minScore);
    
          if (beta <= alpha) {
            break; // Alpha cutoff
          }
        }
    
        return minScore;
      }
    }

    getOpponent(player) {
      // Returns the opponent player
      return player === 'x' ? 'o' : 'x';
    }

    getPossibleMoves(board) {
      // Returns an array of column numbers that represent the possible moves
      const possibleMoves = [];
      for (let col = 0; col < board.length; col++) {
        if (board[col][0] === 0) {
          possibleMoves.push(col);
        }
      }
      return possibleMoves;
    }

    makeMove(board, move, player) {
      const newBoard = JSON.parse(JSON.stringify(board));
      for (let row = 5; row >= 0; row--) {
        if (newBoard[move][row] === 0) {
          newBoard[move][row] = player;
          break;
        }
      }
      return newBoard;
    }          

    isWindowWinner(window) {
 
      // Returns true if the window contains a winning combination, false otherwise
      const [a, b, c, d] = window;
      return a !== 0 && a === b && a === c && a === d;
    }

    isGameOver(board) {
      // Returns true if the game is over (either a player has won or the board is full), false otherwise
      
      // Check for horizontal wins
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
          let window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
          if (this.isWindowWinner(window)) {
            return true;
          }
        }
      }
      
      // Check for vertical wins
      for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 3; row++) {
          let window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
          if (this.isWindowWinner(window)) {
            return true;
          }
        }
      }
      
      // Check for diagonal (descending) wins
      for (let col = 0; col < board[0].length - 3; col++) {
        for (let row = 0; row < board.length - 3; row++) {
          let window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
          if (this.isWindowWinner(window)) {
            return true;
          }
        }
      }
      
      // Check for diagonal (ascending) wins
      for (let col = 0; col < board[0].length - 3; col++) {
        for (let row = 3; row < board.length; row++) {
          let window = [board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]];
          if (this.isWindowWinner(window)) {
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

    printBoard() {
      for (let row = 0; row < 6; row++) {
        let line = '|';
        for (let col = 0; col < 7; col++) {
          line += ' ' + (this.board[col][row] || ' ') + ' |';
        }
        console.log(line);
      }
      console.log('-----------------------------');
    }
  }
  
// Example usage:

const game = new Connect4();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getInput(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, input => {
      resolve(input);
    });
  });
}

function parseInput(input) {
  const number = parseInt(input);
  return isNaN(number) ? null : number;
}

async function gameLoop() {
  while (game.gameOn) {
    
    if (!game.gameOn) {
      break;
    }

    // const userEnter = await getInput('Press Enter: ');
    game.play(game.movement(game.board, game.currentPlayer));
    game.printBoard();

    if (!game.gameOn) {
      break;
    }

    const userInput = await getInput('Enter an integer: ');
    const number = parseInput(userInput);

    if (number !== null) {
      game.play(number);
      game.printBoard();
    } else {
      console.log('Invalid input. Please enter a valid integer.');
    }

    if (!game.gameOn) {
      break;
    }
  }

  rl.close();
}

gameLoop();



// game.play(2);
// game.play(3);
// game.play(2);
// game.play(3);
// game.play(2);
// game.play(3);
// game.play(2);
// game.printBoard();