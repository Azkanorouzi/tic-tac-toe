// We are gonna be using module pattern for gameboard because this is only an object which controls the flow of our application in general and that's really all it does
const displayController = (function () {
  // Event listeners
})()
const gameBoard = (function () {
  const playerX = player('X')
  const playerO = player('O')
})()
// Player factory function
const player = function (sign) {
  const sign = sign
  let roundWon = 0
  return { sign, roundWon }
}
