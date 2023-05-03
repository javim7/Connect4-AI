
const io = require('socket.io-client');
const serverUrl = 'http://192.168.1.132:4000';
const socket = io(serverUrl);

socket.on('connect', function() {
  console.log('Connected to server');
  
  // Send a 'signin' message to the server to log in
  socket.emit('signin', {
    user_name: "mombi",
    tournament_id: 142857,
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
    console.log("Successfully signed in!");
});

socket.on('ready', function(data){
    const {game_id, player_turn_id, board} = data;
    console.log("Ready!");
    console.log("Game ID: ", game_id);
    console.log("It's player: ", player_turn_id, "'s turn");
    console.log("Board: ", board);
    
    const movement = 1;
    
    socket.emit('play', {
      tournament_id: tournamentID,
      player_turn_id: playerTurnID,
      game_id: gameID,
      movement
    });
});

socket.on('finish', function(data){
    var gameID = data.game_id;
    var playerTurnID = data.player_turn_id;
    var winnerTurnID = data.winner_turn_id;
    var board = data.board;

    socket.emit('player_ready', {
        tournament_id: tournamentID,
        player_turn_id: playerTurnID,
        game_id: gameID
    });
});