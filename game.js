import {v4 as uuidv4} from 'uuid'

const TTTPhase = {
  TITLE_SCREEN: 0,
  PLAYER_X: 1,
  PLAYER_O: 2,
  WINNER_PLAYER_X: 3,
  WINNER_PLAYER_O: 4,
  WAITING_TO_RESTART: 5,
  RESTARTING: 6,
  WAITING_FOR_PLAYER: 7,
  DRAW: 8,
  WAITING_FOR_CONNECTION: 9
}

const defaultBox = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
}

const TTTWinningSets = [
  [1,2,3],
  [4,5,6],
  [7,8,9],

  [1,4,7],
  [2,5,8],
  [3,6,9],

  [1,5,9],
  [7,5,3],
]

export default class TicTacToeGame {
  _playerXID = -1
  _playerOID = -1

  _movesPX = new Set()
  _movesPO = new Set()
  
  _gameID = -1

  _state = TTTPhase.WAITING_FOR_CONNECTION

  constructor(playerXID) {
    this._playerXID = playerXID

    this._gameID = uuidv4()
  }

  getGameID () {
    return this._gameID
  }

  connect(playerOID) {
    // TODO: Protect against redundant reconnects
    // TODO: Protect against 3+ players connecting
    if (this._playerXID === playerOID) return new Error('Same Player Trying to connect to own game.')
    this._playerOID = playerOID
    return this.startGame()
  }

  startGame() {
    this._movesPX.clear()
    this._movesPO.clear()

    this._state = Math.floor(Math.random + 0.5) === 0 ? TTTPhase.PLAYER_X : TTTPhase.PLAYER_O

    return {
      boxes: {
        ...defaultBox
      },
      state: this._state,
      id: this._gameID
    }
  }
  
  getGameState () {
    return {
      state: this._state,
      playerXID: this._playerXID,
      playerOID: this._playerOID
    }
  }

  checkWin(moves) {
    return TTTWinningSets.some(elem => elem.every(number => moves.has(number)))
  }

  handlePlayerMove(playerID, index) {
    if (this._state !== TTTPhase.PLAYER_X && this._state !== TTTPhase.PLAYER_O) return new Error("Game not started!")
    if (playerID !== this._playerXID && playerID !== this._playerOID) return new Error("Invalid Player ID for move")
    if ((playerID === this._playerXID && this._state !== TTTPhase.PLAYER_X) || 
        (playerID === this._playerOID && this._state !== TTTPhase.PLAYER_O)) return "move out of turn"

    if (this._movesPX.has(index) || this._movesPO.has(index)) return new Error('move already exists!')

    const moves = playerID === this._playerXID ? this._movesPX : this._movesPO
    moves.add(index)

    const MovesPXObj = {}
    for (const key of this._movesPX) {
      MovesPXObj[key] = 1
    }
    const MovesPYObj = {}
    for (const key of this._movesPO) {
      MovesPYObj[key] = 2
    }

    let boxes = {
      ...defaultBox,
      ...MovesPXObj,
      ...MovesPYObj,
    }

    console.log(boxes)
    
    const win = this.checkWin(moves)
    this._state = win ? this._state === TTTPhase.PLAYER_X ? TTTPhase.WINNER_PLAYER_X : TTTPhase.WINNER_PLAYER_O : 
            this._state === TTTPhase.PLAYER_X ? TTTPhase.PLAYER_O : TTTPhase.PLAYER_X

    return {
      boxes,
      state: this._state
    }
  }

}
