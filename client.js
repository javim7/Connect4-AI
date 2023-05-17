const io = require('socket.io-client');
const socket = io('http://192.168.1.134:4000');

socket.on('connect', function () {
    console.log('Conectado al servidor.');

    // Sign in del jugador
    socket.emit('signin', {
        user_name: 'Mombi',
        tournament_id: 142857,
        user_role: 'player'
    });
});

// Sign-in exitoso
socket.on('ok_signin', function () {
    console.log('Se inicio sesion con exito!');
});

// Jugador listo para jugar
socket.on('ready', function (data) {
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var board = data.board;

    console.log("")
    console.log('Listo para jugar - Juego: ' + gameID)
    console.log('Turno de: ' + playerTurnID)
    console.log(board)

    // TODO: Implement your game logic here
    // Ejemplo: Movimiento Random
    var movementx = Math.floor(Math.random() * board.length);
    // var movementResult = movement(board, playerTurnID);
    // console.log('Movimiento: ' + movementResult)

    // Realizar el movimiento
    socket.emit('play', {
        tournament_id: 142857, 
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: movementx
    });
});

// Juego termiando
socket.on('finish', function (data) {
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;

    console.log("")
    console.log('Juego terminado - Juego: ' + gameID)
    console.log('Ganador: ' + winnerTurnID)
    console.log('Tablero: ' + board)

    // TODO: Handle game finishing logic here

    // Senal del jugador listo para el siguiente juego
    socket.emit('player_ready', {
        tournament_id: 142857,
        player_turn_id: playerTurnID,
        game_id: gameID
    });
});

// Manejo de errores
socket.on('error', function (error) {
    console.error('Error de socket!:', error);
});

function movement(board, player) {
    console.log('Player ' + player + 's turn');
    console.log(board);
    const depth = 5;
    const maximizingPlayer = true;
    const alpha = -Infinity;
    const beta = Infinity;
  
    const possibleMoves = getPossibleMoves(board);
    // console.log(possibleMoves);
  
    let bestMove = null;
    let bestScore = -Infinity;
  
    // Evaluate the score of the current board
    const initialScore = calculateHeuristic(board, player);
    // console.log('Initial score: ' + initialScore)
  
    if (initialScore >= 0) {
      // Player's favorable situation, find the best move
      for (const move of possibleMoves) {
        const newBoard = makeMove(board, move, player);
        const score = minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
        console.log(newBoard)
        console.log('move: ' + move + ' score: ' + score);
  
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
  
      console.log('score: ' + bestScore + ' move: ' + bestMove);
      return bestMove;
    } else {
      // Opponent's favorable situation, block their best move
      const opponent = getOpponent(player);
      let opponentBestMove = null;
      let opponentBestScore = -Infinity;
  
      for (const move of possibleMoves) {
        const newBoard = makeMove(board, move, player);
        const score = minimax(newBoard, depth - 1, !maximizingPlayer, alpha, beta, player);
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

  function calculateHeuristic(board, player) {
    let score = 0;
    let maxScore = 100;
    let minScore = -100;
    let opponent = player === '1' ? '2' : '1';
  
    // Evaluar combinaciones horizontales
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
  
    // Evaluar combinaciones verticales
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 6; row++) {
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
  
    // Evaluar combinaciones diagonales descendentes
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
  
    // Evaluar combinaciones diagonales ascendentes
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
    let maxScore = 100;
    let minScore = -100;
    let opponent = player === '1' ? '2' : '1';
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
          break; // Beta cutoff
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
          break; // Alpha cutoff
        }
      }
  
      return minScore;
    }
  }

  function getOpponent(player) {
    // Returns the opponent player
    return player === '1' ? '2' : '1';
  }

  function getPossibleMoves(board) {
    // Returns an array of column numbers that represent the possible moves
    const possibleMoves = [];
    for (let col = 0; col < board.length; col++) {
      if (board[col][0] === 0) {
        possibleMoves.push(col);
      }
    }
    return possibleMoves;
  }

  function makeMove(board, move, player) {
    const newBoard = JSON.parse(JSON.stringify(board));
    for (let row = 5; row >= 0; row--) {
      if (newBoard[move][row] === 0) {
        newBoard[move][row] = player;
        break;
      }
    }
    return newBoard;
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
