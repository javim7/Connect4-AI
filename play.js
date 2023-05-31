class Connect4 {
    constructor() {
      this.board = [];
      this.currentPlayer = 1; // Player 1 starts the game
      this.winner = null;
      this.moves = 0;
      this.gameOn = true;
  
      // Initialize the board with empty cells
      for (let i = 0; i < 6; i++) {
        this.board[i] = [];
        for (let j = 0; j < 7; j++) {
          this.board[i][j] = 0;
        }
      }
    }
  
    play(column) {
      if (this.winner) {
        console.log('Game over. Player ' + this.winner + ' has won!');
        this.gameOn = false;
        return;
      }
  
      if (column < 0 || column >= 7) {
        console.log('Invalid column. Please choose a column between 0 and 6.');
        return;
      }
  
      for (let row = 5; row >= 0; row--) {
        if (!this.board[row][column]) {
          this.board[row][column] = this.currentPlayer;
          this.moves++;
  
          if (this.checkWin(row, column)) {
            this.winner = this.currentPlayer;
            console.log('\x1b[32mPlayer ' + this.winner + ' wins!\x1b[0m');
          } else if (this.moves === 42) {
            console.log("It's a draw! The board is full.");
            this.gameOn = false;
          }
  
          this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
          return;
        }
      }
  
      console.log('Column ' + column + ' is full. Please choose another column.');
    }
  
    checkWin(row, column) {
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
            this.board[newRow][newColumn] === this.currentPlayer
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
            this.board[newRow][newColumn] === this.currentPlayer
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
  
    printBoard() {
      for (let row = 0; row < 6; row++) {
        let line = '\x1b[34m|\x1b[0m';
        for (let col = 0; col < 7; col++) {
          if (this.board[row][col] === 1) {
            line += ' \x1b[33m●\x1b[0m \x1b[34m|\x1b[0m'; // Yellow circle symbol (●)
          } else if (this.board[row][col] === 2) {
            line += ' \x1b[31m●\x1b[0m \x1b[34m|\x1b[0m'; // Red circle symbol (●)
          } else {
            line += ' \x1b[34m●\x1b[0m \x1b[34m|\x1b[0m'; // Blue circle symbol (●)
          }
        }
        console.log(line);
      }
      console.log('\x1b[34m-----------------------------\x1b[0m');
      console.log('\x1b[32m| 0 | 1 | 2 | 3 | 4 | 5 | 6 |\x1b[0m');
      console.log('\x1b[32m-----------------------------\x1b[0m');

     }
    

    // movement(board, player) {
    //     console.log('Player ' + player + 's turn');
    //     // console.log(board);
    //     const depth = 5;
    //     const maximizingPlayer = true;
    //     const alpha = -Infinity;
    //     const beta = Infinity;
      
    //     let possibleMoves = this.getPossibleMoves(board);
    //     // console.log(possibleMoves);
      
    //     let bestMove = null;
    //     let bestScore = -Infinity;
      
    //     // Evaluate the score of the current board
    //     const initialScore = this.calculateHeuristic(board, player);
    //     // console.log('Initial score: ' + initialScore)
      
    //     if (initialScore >= 0) {
    //       // Player's favorable situation, find the best move
    //       for (const move of possibleMoves) {
    //         const newBoard = this.makeMove(board, move, player);
    //         let score = this.minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
    //         // if (move == 3) {
    //         //   score += 800
    //         // } else if(move == 2 || move == 4) {
    //         //  score += 100 
    //         // }
    //         // console.log(newBoard)
    //         // console.log('move: ' + move + ' score: ' + score);
      
    //         if (score > bestScore) {
    //           bestScore = score;
    //           bestMove = move;
    //         }
    //       }
      
    //       console.log('score: ' + bestScore + ' move: ' + bestMove);
    //       return bestMove;
          
    //     } else {
    //       // Opponent's favorable situation, block their best move
    //       const opponent = this.getOpponent(player);
    //       let opponentBestMove = null;
    //       let opponentBestScore = -Infinity;
      
    //       for (const move of possibleMoves) {
    //         const newBoard = this.makeMove(board, move, player);
    //         const score = this.minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
    //         // console.log(newBoard)
    //         // console.log('move: ' + move + ' score: ' + score);
      
    //         if (score > opponentBestScore) {
    //           opponentBestScore = score;
    //           opponentBestMove = move;
    //         }
    //       }
      
    //       console.log('Blocking opponent move: ' + opponentBestMove);
    //       return opponentBestMove;
    //     }
    //   }

    movement(board, player) {
      console.log('\x1b[33m\nPlayer \x1b[0m' + player + "\x1b[33m's turn\x1b[0m");
      // console.log(board)
      const depth = 5;
      const maximizingPlayer = true;
      const alpha = -Infinity;
      const beta = Infinity;
    
      let bestScore = -Infinity;
      let bestMove = null;
    
      const possibleMoves = this.getPossibleMoves(board);
      // console.log(possibleMoves);
    
      for (const move of possibleMoves) {
        const newBoard = this.makeMove(board, move, player);
        let score = this.minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
         if (move === 3) {
              score += 710
            } else if(move === 2 || move === 4) {
             score += 105 
            }
        // console.log('Move: ' + move + ' Score: ' + score);
    
        // Check if the move leads to an opponent's winning position
        if (score < 0 && this.isWinningMove(newBoard, this.getOpponent(player))) {
          console.log('Move ' + move + ' leads to opponent win, skipping');
          continue;
        } 
        // if ((score > 0 && this.isWinningMove(newBoard, player))){
        //   console.log('Move ' + move + ' leads to player win blocked, skipping');
        //   continue;
        // }
    
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }

      }

      if (bestMove === null) {
        console.log("possibleMoves:" + possibleMoves);
        bestMove = possibleMoves[0]
      }
    
      console.log('\x1b[33mBest Score: \x1b[0m' + bestScore + '\x1b[33m. Best Move: \x1b[0m' + bestMove);
      return bestMove;
    }
    
  
      calculateHeuristic(board, player) {
        let score = 0;
        let maxScore = 10000;
        let minScore = -10000;
        let opponent = player === 1 ? 2 : 1;
        
        // Winning move
        if (this.checkWin(board, player)) {
          return maxScore;
        } else if (this.checkWin(board, opponent)) {
          return minScore;
        }

        // Evaluate horizontal combinations
        for (let row = 0; row < 6; row++) {
          for (let col = 0; col < 4; col++) {
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
      
        // Evaluate vertical combinations
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
      
        // Evaluate diagonal combinations (top left to bottom right)
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
      
        // Evaluate diagonal combinations (bottom left to top right)
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
              break; // Beta pruning
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
              break; // Alpha prunin
            }
          }
      
          return minScore;
        }
      }
  
      getOpponent(player) {
        // Returns the opponent player
        return player === 1 ? 2 : 1;
      }
  
      getPossibleMoves(board) {
        // Returns an array of column numbers that represent the possible moves
        const possibleMoves = [];
        for (let col = 0; col < board[0].length; col++) {
          if (board[0][col] === 0) {
            possibleMoves.push(col);
          }
        }
        return possibleMoves;
      }          
  
      makeMove(board, move, player) {
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

      isWinningMove(board, player) {
        // Create a copy of the board
        const newBoard = JSON.parse(JSON.stringify(board));
      
        // Make the move for the specified player
        const possibleMoves = this.getPossibleMoves(newBoard);
        const winningMove = possibleMoves.find(move => {
          const updatedBoard = this.makeMove(newBoard, move, player);
          return this.isGameOver(updatedBoard);
        });
      
        return !!winningMove;
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
}    
  
// Calling the class to start a game, human vs ai

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

async function gameLoop(order) {
  if (order === 1) {
      while (game.gameOn) {
      if (!game.gameOn) {
        break;
      }

      game.play(game.movement(game.board, game.currentPlayer));
      game.printBoard();

      if (!game.gameOn) {
        break;
      }

      let userInput = await getInput('\x1b[32mEnter a number (0-6):\x1b[0m ');
      while (true) {
        const number = parseInput(userInput);
      
        if (number !== null && number >= 0 && number <= 6) {
          game.play(number);
          game.printBoard();
          break;
        } else {
          console.log('\x1b[31mInvalid input! Enter a number between 0 and 6!\x1b[0m\n');
          userInput = await getInput('\x1b[32mEnter a number (0-6):\x1b[0m ');
        }
      }
    }
   } else if (order === 2) {
      game.printBoard();
      
      while (game.gameOn) {
        if (!game.gameOn) {
          break;
        }
  
        let userInput = await getInput('\x1b[32mEnter a number (0-6):\x1b[0m ');
        while (true) {
          const number = parseInput(userInput);
        
          if (number !== null && number >= 0 && number <= 6) {
            game.play(number);
            game.printBoard();
            break;
          } else {
            console.log('\x1b[31mInvalid input! Enter a number between 0 and 6!\x1b[0m\n');
            userInput = await getInput('\x1b[33mEnter a number (0-6):\x1b[0m ');
          }
        }
  
        if (!game.gameOn) {
          break;
        }
  
        game.play(game.movement(game.board, game.currentPlayer));
        game.printBoard();
      }
    
  
    rl.close();
      }
}

const order = Math.random() < 0.5 ? 1 : 2;
gameLoop(order);
