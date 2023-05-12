import socketio
import json

# Define constants
SERVER_URL = 'http://127.0.0.1:3000'
TOURNAMENT_ID = 1234
PLAYER_NAME = 'gallanghof'

# Initialize the Socket.IO client
sio = socketio.Client()

# Define the event handlers
@sio.event
def connect():
    print('Connected to server')

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.on('ok_signin')
def on_ok_signin():
    print('Successfully signed in!')

@sio.on('ready')
def on_ready(data):
    game_id = data['game_id']
    player_turn_id = data['player_turn_id']
    board = data['board']
    # TODO: Handle game logic here

@sio.on('finish')
def on_finish(data):
    game_id = data['game_id']
    player_turn_id = data['player_turn_id']
    winner_turn_id = data['winner_turn_id']
    board = data['board']
    # TODO: Handle end of game logic here

# Start the connection process
sio.connect(SERVER_URL)

# Send the signin event
sio.emit('signin', {
    'user_name': PLAYER_NAME,
    'tournament_id': TOURNAMENT_ID,
    'user_role': 'player'
})

# Wait for the connection to finish
sio.wait()
