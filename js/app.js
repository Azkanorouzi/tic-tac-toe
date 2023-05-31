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
      _loadTheGame()
      _changeElState(options.ops.OPTION_CONTAINER)
      _changeElState(ELEMENTS.MAIN_ELEMENTS.MAIN)
      _listenToResetButton(ELEMENTS.MAIN_ELEMENTS.RESET_BUTTON)
      setTimeout(function () {
        _startBackgroundAnimation()
      }, 4000)
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
        const boardArr = new Array(+gameInfo.sizeOfBoard[0])
          .fill('')
          .map(() => new Array(+gameInfo.sizeOfBoard[0]).fill(''))
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
      const _controlTheGame = (function (info, players, boardArr) {
        let turn = 1
        let turnChange
        setTimeout(function () {
          turnChange = _startTurnChange()
        }, 4000)
        ELEMENTS.MAIN_ELEMENTS.BOARD.addEventListener('click', function (e) {
          const clickedBox = e.target
          console.log(clickedBox)
          // Populates the board array when the box's empty
          if (e.target.textContent === '') {
            // Changing the turn
            _resetTurnChange()
            _changeTurn()
            _populateBoardArr(clickedBox, players[turn].sign)
            _changeCurUserDomSign(
              document.querySelector('.current-player-sign'),
              players[turn === 1 ? 0 : 1].sign
            )
            const winner = _getRoundWinner(boardArr, players[turn])
            console.log(winner)
            clickedBox.textContent = players[turn].sign
            // If winner won the game
            if (winner && winner.player.roundWon === info.numberOfRounds) {
              alert(`${winner.sign} won the game`)
            }
            // If winner won the round
            if (winner && winner.player.roundWon < info.numberOfRounds) {
              const roundWonType = _getRoundWinner(
                boardArr,
                players[turn]
              ).pattern
              ++winner.player.roundWon
              _showWinner(roundWonType)
              _increaseDomScore(winner, turn)
              _resetRound()
            }
          }
        })
        function _showWinner(type) {
          const board = document.querySelector('.board')
          document
            .querySelectorAll('.box')
            .forEach((box) => box.classList.add('box-shown'))
          // If player won vertically
          if (type.vertical || type.vertical === 0) {
            document
              .querySelectorAll(`[data-col="${type.vertical}"]`)
              .forEach((box) => box.classList.add('box-shown-winner'))
          }
          // If player won horizontally
          if (type.horizontal || type.horizontal === 0) {
            let index = +type.horizontal
            console.log(document.querySelectorAll(`[data-row="${index}"]`))
            document
              .querySelectorAll(`[data-row="${index}"]`)
              .forEach((box) => box.classList.add('box-shown-winner'))
          }
          // cross
          if (type.cross || type.cross === 0) {
            boardArr.forEach((box, i) => {
              document
                .querySelector(`[data-row="${i}"][data-col="${i}"]`)
                .classList.add('box-shown-winner')
            })
          }
          // reversed cross
          if (type.crossReverse || type.crossReverse) {
            let reversedIndex = boardArr.length - 1
            console.log(reversedIndex)
            boardArr.forEach((box, i) => {
              document
                .querySelector(`[data-row="${i}"][data-col="${reversedIndex}"]`)
                .classList.add('box-shown-winner')
              reversedIndex--
            })
          }
        }
        function _increaseDomScore(winner, turn) {
          const winnerDomScore = document.querySelector(
            `.player${turn + 1}-score`
          ).textContent
          document.querySelector(`.player${turn + 1}-score`).textContent =
            +winnerDomScore + 1
        }
        function _resetRound() {
          // Resetting the round ...
        }
        // Populates the board array
        function _populateBoardArr(box, sign) {
          const rowNumber = +box.dataset.row
          const colNumber = +box.dataset.col
          console.log(rowNumber)
          boardArr[rowNumber][colNumber] = sign
          return 0
        }
        function _changeCurUserDomSign(curPlayer, sign) {
          curPlayer.textContent = sign
        }
        function _startTurnChange() {
          return setInterval(() => {
            _changeTurn()
            _changeCurUserDomSign(
              document.querySelector('.current-player-sign'),
              players[turn === 1 ? 0 : 1].sign
            )
          }, 3000)
        }
        function _resetTurnChange() {
          clearInterval(turnChange)
          turnChange = _startTurnChange()
        }
        function _changeTurn() {
          turn = turn === 0 ? 1 : 0
        }
        // Checks round winner and returns the sign
        function _getRoundWinner(boardArr, player) {
          const playerSign = player.sign
          let pattern = {}
          for (let i = 0; i < boardArr.length; i++) {
            if (_checkVerticalWinner(playerSign, i)) {
              pattern.vertical = i
              return { player, pattern }
            }
          }
          if (_checkCrossWinner(playerSign)) {
            pattern.cross = true
            return { player, pattern }
          }
          if (_checkCrossWinnerReversed(playerSign)) {
            pattern.crossReverse = true
            return { player, pattern }
          }
          if (_checkHorizontalWinner(playerSign)) {
            let horizontalIndex = _checkHorizontalWinner(playerSign)
            pattern.horizontal = horizontalIndex
            return { player, pattern }
          }
          // If none were true then we're going to return false indicating that there were no match
          return false
          function _checkHorizontalWinner(sign) {
            let horizontalIndex = false
            boardArr.forEach((e, i) => {
              if (e.every((e) => e === sign)) {
                horizontalIndex = String(i)
              }
            })
            return horizontalIndex
          }
          function _checkVerticalWinner(sign, i) {
            return boardArr.every((e) => e[i] === sign)
          }
          function _checkCrossWinner(sign) {
            return boardArr.every((e, i) => e[i] === sign)
          }
          function _checkCrossWinnerReversed(sign) {
            let reversedIndex = boardArr.length
            return boardArr.every((e, i) => {
              reversedIndex--
              return e[reversedIndex] === sign
            })
          }
        }
      })(gameBoard.gameInfo, gameBoard.players, gameBoard.boardArr)
    }
    function _startBackgroundAnimation() {
      document.querySelector('html').classList.add('animated-background')
    }
    function _loadTheGame() {
      const load = setInterval(function () {
        document.querySelector('.counter-text').textContent -= 1
        if (document.querySelector('.counter-text').textContent === '-1') {
          clearInterval(load)
          _hideCounter()
        }
      }, 1000)
    }
    function _hideCounter() {
      document.querySelector('.counter-container').classList.add('hidden')
    }
  })
  // makes a certain element hidden or visible
  const _changeElState = function (element) {
    element.classList.toggle('hidden')
  }
  const _listenToResetButton = function (button) {
    button.addEventListener('click', function () {
      // Showing the module
      _showModule()
      // Listening to the reset module buttons
      document
        .querySelector('.reset-module-container')
        .addEventListener('click', function (e) {
          if (e.target.dataset.cancel === 'true') _hideModule()
          if (e.target.dataset.cancel === 'false') _resetTheGame()
        })
    })
    function _showModule() {
      document
        .querySelector('.reset-module-container')
        .classList.remove('hidden')
    }
    function _hideModule() {
      document.querySelector('.reset-module-container').classList.add('hidden')
    }
    function _resetTheGame() {
      location.reload()
    }
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
