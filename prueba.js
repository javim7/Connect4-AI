const algorithm = require('./algorithms.js');

let board = [
    [
      2, 2, 1, 1,
      1, 0, 1
    ],
    [
      2, 1, 1, 1,
      2, 0, 2
    ],
    [
      1, 2, 2, 2,
      1, 0, 1
    ],
    [
      2, 2, 1, 1,
      2, 0, 2
    ],
    [
      1, 1, 2, 2,
      1, 0, 1
    ],
    [
      2, 2, 1, 1,
      2, 0, 2
    ]
  ]
let player = 1

let movement = algorithm.movement(board, player)
console.log(movement)