const elements = (function () {
  // returns a DOM element
  _getElement = (selector) => document.querySelector(selector)
  const BOARD = _getElement('.board')
  return {}
})()
const displayController = (function () {})()
const gameBoard = (function () {
  const playerX = player('X')
  const playerO = player('O')
})()
// Player factory function
const player = function (sign) {
  const sign = sign
  let roundWon = 0
  // Returns true if it's the player's turn
  function isTurn(num, condition) {
    return condition(num)
  }
  return { sign, roundWon, isTurn }
}
