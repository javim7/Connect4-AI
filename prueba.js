const io = require('socket.io-client');
const serverUrl = 'http://192.168.1.132:4000';
const socket = io(serverUrl);

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})

// const movimientos = [
//     1, 1, 1,
//     3, 3, 3,
//     5, 5, 5,
//     0, 0, 0,
//     2, 2, 2,
//     4, 4, 4,
//     6, 6, 6
// ]

let contador = 0

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('signin', {
        user_name: 'Mombi',
        tournament_id: 142857,
        user_role: 'player'
    });
});

socket.on('ok_signin', () => {
    console.log('Successfully signed in!');
});

socket.on('ready', (data) => {
    const { game_id, player_turn_id, board } = data;

    console.log(`Ready to play game ${game_id}`);
    console.log(`It is player ${player_turn_id}'s turn`);
    console.log(`The board is ${board}`);

    // TODO: Your logic / user input here

    const movement = Math.floor(Math.random() * 3)

    readline.question("Movimiento: ", turno => {
        var Movimiento = Number(turno)
        socket.emit('play', {
            tournament_id: 142857,
            player_turn_id: player_turn_id,
            game_id: game_id,
            movement: Movimiento
            // movement: movimientos[contador]
        });
    })




    contador = contador + 1

});

socket.on('finish', (data) => {
    const { game_id, player_turn_id, winner_turn_id, board } = data;

    console.log(`Game ${game_id} has finished`);
    console.log(`Player ${winner_turn_id} is the winner`);
    console.log(`The board is ${board}`);

    // TODO: Your cleaning board logic here

    socket.emit('player_ready', {
        tournament_id: 142857,
        player_turn_id: player_turn_id,
        game_id: game_id
    });
});
