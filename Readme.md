# Connect 4 AI

## Project Overview
This project is an implementation of a connect 4 AI. The AI works based on three main points. 

1. **Heuristics**: The first calculation the AI does, is evaluate the board and give it a score via the `calculateHeuristic()` function, in which a negative score represents a favorable position for the opponent whereas a positive score represents a favorable position for the AI. This score is calculated by checking every possible combination of 4 cells in a row and counting how many of those cells are used by the player or by the opponent. Given the counts of every combination, a number is either subtracted from the total score or added to the total score. The amount that is added or subtracted depends by how favorable or unfavorable the position is. This score is then used by the `minimax()` function

2. **MiniMax**: The `minimax()` function is a recursive function which aims to find the optimal move for the AI, and it does this by exploring the game tree and considering all the possible moves and their outcomes. The function takes into account the current game state, the depth of the search tree, and the players involved. It recursively calls itself to evaluate possible future game states and assigns scores to each state based on the heuristics. By considering the scores of different game states, the algorithm determines the best move for the current player.

3. **Alpha-Beta Pruning**: The alpha-beta pruning is used to optimize the minimax algorithm by reducing the number of nodes that need to be evaluated. It cuts off branches of the game tree that are determined to be irrelevant or unpromising, based on the alpha and beta values. Alpha represents the maximum lower bound of possible scores for the maximizing player, while beta represents the minimum upper bound of possible scores for the minimizing player. 

The project contains three main files:

- `play.js`: This file allows a player vs machine connect 4 confrontation. The starting player is selected randomly, and you can modify the variable `const depth = 5` to be able to change the difficulty level of the AI.

- `client.js`: This file allows the client to connect to a server which was made for the class to be able to connect to a tournament, and be able to compete against each other randomely, and see who would win the tournament.

- `algorithms.js`: This file contains the algorithms mentioned in the overview, and are the same algorithms that the machine uses in the `play.js`, and this are the methods that the `client.js` file calls to be able to calculate the best move in the tournament.


## Usage 
1. To use the project, it is necessary to install all the required libraries.
```bash
npm install
```

2. Run the file of choice. (Client.js and Algorithms.js only work if the server is running) Play.js is recommended.
```bash
node play.js
```

After running the play.js file, you will see a board pop up in the terminal, and it will ask you for an input, which must be an integer from 0 to 6, as this represents the choices available in the board. The game will look like this:
```bash
Player 1's turn
Best Score: 5300. Best Move: 1
| ● | ● | ● | ● | ● | ● | ● |
| ● | ● | ● | ● | ● | ● | ● |
| ● | ● | ● | ● | ● | ● | ● |
| ● | ● | ● | ● | ● | ● | ● |
| ● | ● | ● | ● | ● | ● | ● |
| ● | ● | ● | ● | ● | ● | ● |
-----------------------------
| 0 | 1 | 2 | 3 | 4 | 5 | 6 |
-----------------------------
Enter a number (0-6):
```

## Author
#### Javier Mombiela