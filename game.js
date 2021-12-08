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
  WAITING_FOR_CONNECTION: 9,
  GAME_NOT_FOUND: 10
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
  _playerXJWT = -1
  _playerOJWT = -1

  _state = {
    gameID: -1,
    phase: TTTPhase.WAITING_FOR_CONNECTION,
    playerXID: -1,
    playerXIcon: 0,
    playerOID: -1,
    playerOIcon: 1,
    movesPX: new Set(),
    movesPO: new Set(),
    boxes: {
      ...defaultBox
    }
  }

  constructor(playerXID, playerXIcon) {
    this._state.playerXID = playerXID
    this._state.playerXIcon = playerXIcon
    this._state.gameID = uuidv4()
  }

  getGameID () {
    return this._state.gameID
  }

  connect(playerOID, playerOIcon) {
    if (this._state.phase !== TTTPhase.WAITING_FOR_CONNECTION) return new Error("Game not waiting for connection")
    if (this._state.playerOID !== -1) return new Error("Player O already connected")
    if (this._state.playerXID === playerOID) return new Error('Same Player Trying to connect to own game.')
    this._state.playerOID = playerOID
    this._state.playerOIcon = playerOIcon
    return this.startGame()
  }

  startGame() {
    this._state.movesPX.clear()
    this._state.movesPO.clear()

    this._state.phase = (Math.random() > 0.5) ? TTTPhase.PLAYER_X : TTTPhase.PLAYER_O
    this._state.boxes = {
      ...defaultBox
    }


    return {
      state: this._state, 
    }
  }
  
  getGameState () {
    return {
      state: this._state,
    }
  }

  checkWin(moves) {
    return TTTWinningSets.some(elem => elem.every(number => moves.has(number)))
  }

  handlePlayerMove(playerID, index) {
    if (this._state.phase !== TTTPhase.PLAYER_X && this._state.phase !== TTTPhase.PLAYER_O) return new Error("Game not started!")
    if (playerID !== this._state.playerXID && playerID !== this._state.playerOID) return new Error("Invalid Player ID for move")
    if ((playerID === this._state.playerXID && this._state.phase !== TTTPhase.PLAYER_X) || 
        (playerID === this._state.playerOID && this._state.phase !== TTTPhase.PLAYER_O)) return "move out of turn"

    if (this._state.movesPX.has(index) || this._state.movesPO.has(index)) return new Error('move already exists!')

    const moves = playerID === this._state.playerXID ? this._state.movesPX : this._state.movesPO
    moves.add(index)

    const MovesPXObj = {}
    for (const key of this._state.movesPX) {
      MovesPXObj[key] = 1
    }
    const MovesPYObj = {}
    for (const key of this._state.movesPO) {
      MovesPYObj[key] = 2
    }

    let boxes = {
      ...defaultBox,
      ...MovesPXObj,
      ...MovesPYObj,
    }

    console.log(boxes)
    
    const win = this.checkWin(moves)
    this._state.phase = win ? this._state.phase === TTTPhase.PLAYER_X ? TTTPhase.WINNER_PLAYER_X : TTTPhase.WINNER_PLAYER_O : 
            this._state.phase === TTTPhase.PLAYER_X ? TTTPhase.PLAYER_O : TTTPhase.PLAYER_X
    
    if (Object.values(boxes).indexOf(0) === -1 && !win) this._state.phase = TTTPhase.DRAW
    this._state.boxes = boxes

    return {
      state: this._state
    }
  }

}
