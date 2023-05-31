const io = require('socket.io-client');
const algorithm = require('./algorithms.js');
const socket = io('http://192.168.1.131:4000');

socket.on('connect', function () {
    console.log('Conectado al servidor.');

    // Sign in del jugador
    socket.emit('signin', {
        user_name: 'mombi',
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
    // console.log('Turno de: ' + playerTurnID)
    // console.log(board)

    // Ejemplo: Movimiento Random
    // var movementx = Math.floor(Math.random() * board.length);
    let movementResult = algorithm.movement(board, playerTurnID)
    // console.log(movementResult)

    // Realizar el movimiento
    socket.emit('play', {
        tournament_id: 142857, 
        player_turn_id: playerTurnID,
        game_id: gameID,
        movement: movementResult
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