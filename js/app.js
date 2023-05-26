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
  let gameBoard
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
      // Making the options input hidden so that the main game is now visible
      _changeElState(options.ops.OPTION_CONTAINER)
      _changeElState(ELEMENTS.MAIN_ELEMENTS.MAIN)
      _startBackgroundAnimation()
      // Starting the game by creating the gameboard
      gameBoard = (function (opts) {
        // Stores the crucial information about the game
        const gameInfo = {
          turns: 0,
          numberOfRounds: opts.numberOfRounds,
          sizeOfBoard: opts.sizeOfBoard,
          winRow: opts.sizeOfBoard[0],
        }
        // creating the array representing each row and column
        const boardArr = new Array(+gameInfo.sizeOfBoard[0]).fill([])
        console.log(boardArr)
        // Stores the information about the players
        const players = [player(opts.player1Sign), player(opts.player2Sign)]
        return { gameInfo, players, boardArr }
      })(options)
      // Rendering the game board after user clicks on go
      _renderGameBoard(
        ELEMENTS.MAIN_ELEMENTS.BOARD,
        gameBoard.gameInfo.sizeOfBoard
      )
      document.querySelector('.current-player-sign').textContent =
        gameBoard.players[0].sign
      // Starting the game
      const _startTheGame = (function (info, players, boardArr) {
        let turn = 1
        ELEMENTS.MAIN_ELEMENTS.BOARD.addEventListener('click', function (e) {
          const clickedBox = e.target
          // Populates the board array when the box's empty
          if (e.target.textContent === '') {
            // Changing the turn
            turn = turn === 0 ? 1 : 0
            _populateBoardArr(clickedBox)
            _changeCurUserDomSign(
              document.querySelector('.current-player-sign'),
              players[turn === 1 ? 0 : 1].sign
            )
            clickedBox.textContent = players[turn].sign
            console.log(boardArr)
          }
        })
        function _populateBoardArr(box, sign) {
          const rowNumber = box.dataset.row
          const colNumber = box.dataset.column
          boardArr[rowNumber][colNumber] = sign
          return 0
        }
        function _changeCurUserDomSign(curPlayer, sign) {
          curPlayer.textContent = sign
        }
      })(gameBoard.gameInfo, gameBoard.players, gameBoard.boardArr)
    }
    function _startBackgroundAnimation() {
      document.querySelector('html').classList.add('animated-background')
    }
  })
  // makes a certain element hidden or visible
  const _changeElState = function (element) {
    element.classList.toggle('hidden')
  }
  // Renders the game board based on user's chosen size
  const _renderGameBoard = function (container, size) {
    document
      .querySelector('.board')
      .classList.add(`board-${size[0]}x${size[0]}`)
    for (let i = 0; i < size[0]; i++) {
      for (let j = 0; j < size[0]; j++) {
        container.insertAdjacentHTML(
          'beforeend',
          `<div class="box" data-row="${i}" data-col="${j}"></div>`
        )
      }
    }
  }
  const _setTheCurrentPlayerSign = function (sign) {
    document.querySelector('.current-player-sign').textContent = sign
  }
  // Checks if any of the fields are empty or their value is not valid and returns true or false
  const _checkFormValidity = function (...values) {
    const V = [...values]
    return (
      V.every((value) => value !== '' && value !== ' ') &&
      V[2] > 0 &&
      V[0].toLowerCase() !== V[1].toLowerCase()
    )
  }
  return { options, gameBoard }
})()
// Player factory function
const player = function (s) {
  const sign = s
  let roundWon = 0
  let ai = false
  // Returns true if it's the player's turn
  function isTurn(num, condition) {
    return condition(num)
  }
  return { sign, roundWon, isTurn, ai }
}
