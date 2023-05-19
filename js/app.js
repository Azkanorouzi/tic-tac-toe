// Stores the result of user options input

const elements = (function () {
  // returns a DOM element
  const _getElement = (selector) => document.querySelector(selector)
  //   Stores main elements
  const mainElements = {
    BOARD: _getElement('.board'),
  }
  return {}
})()
const displayController = (function () {})()
const gameBoard = (function () {
  const player1 = player('X')
  const player2 = player('O')
})()
// Player factory function
const player = function (sign) {
  const playerSign = sign
  let roundWon = 0
  // Returns true if it's the player's turn
  function isTurn(num, condition) {
    return condition(num)
  }
  return { sign, roundWon, isTurn }
}
