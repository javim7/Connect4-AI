const algorithm = require('./algorithms.js');

let board = [
    [
      0, 0, 0, 2,
      0, 0, 0
    ],
    [
      0, 0, 0, 1,
      0, 0, 0
    ],
    [
      0, 0, 0, 2,
      0, 0, 0
    ],
    [
      0, 0, 0, 1,
      0, 0, 0
    ],
    [
      0, 0, 0, 2,
      0, 0, 0
    ],
    [
      0, 0, 0, 1,
      1, 0, 0
    ]
  ]
let player = 2

let movement = algorithm.movement(board, player)
console.log(movement)