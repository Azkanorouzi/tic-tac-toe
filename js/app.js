const ELEMENTS = (function () {
  // returns a DOM element
  const _getElement = (selector) => document.querySelector(selector)
  //   returns dom elements
  const _getElements = (selector) => document.querySelectorAll(selector)
  //   Go button
  const GO_BTN = _getElement('.go-btn')
  // Updates elements
  const getOptions = () => {
    return {
      OPTION_CONTAINER: _getElement('.options-container'),
      PLAYER1_SIGN_INPUT: _getElement('.player1-sign-input'),
      PLAYER2_SIGN_INPUT: _getElement('.player2-sign-input'),
      ROUNDS_NUMBER_INPUT: _getElement('.rounds-number-input'),
      RADIO_BUTTON: _getElement('input[type="radio"]:checked'),
    }
  }
  //   Stores main elements
  const MAIN_ELEMENTS = {
    MAIN: _getElement('.main'),
    BOARD: _getElement('.board'),
    RESET_BUTTON: _getElement('.reset-button'),
    CURRENT_PLAYER_SIGN: _getElement('.current-player-sign'),
    PLAYER1_SCORE: _getElement('.player1-score'),
    PLAYER2_SCORE: _getElement('.player2-score'),
  }
  return { getOptions, MAIN_ELEMENTS, GO_BTN }
})()
// Stores the options
// Controls display of the game based on results and chosen options
let options
const displayController = (function () {
  const _changeElState = function (element) {
    element.classList.toggle('hidden')
  }
  const _checkFormValidity = function (...values) {
    const V = [...values]
    return (
      V.every((value) => value !== '' && value !== ' ') &&
      V[2] > 0 &&
      V[0].toLowerCase() !== V[1].toLowerCase()
    )
  }
  ELEMENTS.GO_BTN.addEventListener('click', () => {
    // Getting the options
    options = (function (elements) {
      // Updates the options
      let ops = elements.getOptions()
      let player1Sign, player2Sign, numberOfRounds, sizeOfBoard
      let _returnValueOf = (name) => ops[name].value
      // Getting the values
      player1Sign = _returnValueOf('PLAYER1_SIGN_INPUT') || false
      player2Sign = _returnValueOf('PLAYER2_SIGN_INPUT') || false
      numberOfRounds = _returnValueOf('ROUNDS_NUMBER_INPUT') || false
      sizeOfBoard = _returnValueOf('RADIO_BUTTON') || false
      return { player1Sign, player2Sign, numberOfRounds, sizeOfBoard, ops }
    })(ELEMENTS)
    if (
      _checkFormValidity(
        options.player1Sign,
        options.player2Sign,
        options.numberOfRounds,
        options.sizeOfBoard
      )
    ) {
      _changeElState(options.ops.OPTION_CONTAINER)
      _changeElState(ELEMENTS.MAIN_ELEMENTS.MAIN)
      const gameBoard = (function (opts) {
        console.log(
          opts.player1Sign,
          opts.player2Sign,
          opts.numberOfRounds,
          opts.sizeOfBoard
        )
        // Stores the crucial information about the game
        const gameInfo = {
          turns: 0,
          roundsPlayed: 0,
          numberOfRounds: opts.numberOfRounds,
          sizeOfBoard: opts.sizeOfBoard,
        }
        // Stores the information about the players
        const players = {
          player1: player(opts.player1Sign),
          player2: player(opts.player2Sign),
        }
        return { gameInfo, players }
      })(options)
    }
  })
  return { options }
})()

// Player factory function
const player = function (sign) {
  const playerSign = sign
  let roundWon = 0
  let ai = false
  // Returns true if it's the player's turn
  function isTurn(num, condition) {
    return condition(num)
  }
  return { playerSign, roundWon, isTurn, ai }
}
