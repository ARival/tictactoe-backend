import express from 'express'
import cors from 'cors'
import TicTacToeGame from './game.js'
import dotenv from 'dotenv'

const app = express()
const port = process.env.PORT || 3000

dotenv.config()

const games = {}

app.use(express.json())
app.use(cors())

app.get('/api/', (req, res) => {
  res.json(games)
})

app.post('/api/connect', (req, res) => {
  let body = req.body
  if (body.gameID) {
    if (!games[body.gameID]) {
      res.send(`Game ${body.gameID} does not exist.`)
      return
    }

    let connection = games[body.gameID].connect(body.playerID, body.icon)
    console.log(connection)
    console.log('connection successful!')
    res.json(connection)
    return
  }
  let newGame = new TicTacToeGame(body.playerID, body.icon)
  console.log(newGame)
  games[newGame.getGameID()] = newGame
  res.json(
    newGame.getGameState()
  )
})

app.post('/api/cancel', (req, res) => {
  let state = req?.body?.state
  if (state && state.gameID) { 
    let game = games[state.gameID]
    if (!game) {
      res.send(`Game ${state.gameID} does not exist.`)
      return
    }

    let gameState = game.getGameState()
    if (state.playerXID !== gameState.state.playerXID && state.playerOID !== gameState.state.playerOID) {
        res.send(`Player ${body.playerID} does not have access to game ${body.gameID}.`)
        return
    }
    delete games[state.gameID]
    res.send(`Game ${state.gameID} has been deleted.`)
    return
  }
  res.send('No gameID provided.')
})

app.post('/api/restart', (req, res) => {
  let state = req?.body?.state
  if (state && state.gameID) { 
    let game = games[state.gameID]
    if (!game) {
      res.send(`Game ${state.gameID} does not exist.`)
      return
    }

    let gameState = game.getGameState()
    if (state.playerXID !== gameState.state.playerXID && state.playerOID !== gameState.state.playerOID) {
        res.send(`Player ${body.playerID} does not have access to game ${body.gameID}.`)
        return
    }
    res.json(game.startGame())
    return
  }
  res.send('No gameID provided.')
})

app.post('/api/getGameState', (req, res) => {
  let body = req.body
  if (body.gameID) {
    let game = games[body.gameID]
    if (!game) {
      console.log('game does not exist')
      res.json({
        state: {
          phase: 10,
          message: "Game does not exist."
        }
      })
      return
    } else {
      let gameState = game.getGameState()
      if (body.playerID !== gameState.state.playerXID && body.playerID !== gameState.state.playerOID) {
        console.log('playerID does not match')
        res.send(`Player ${body.playerID} does not have access to game ${body.gameID}.`)
        return
      }

      res.json(gameState)
      return
    }
  }
  console.log('no gameID provided')
  res.send('No gameID provided.')
})

app.post('/api/move', (req, res) => {
  let body = req.body
  if (body.gameID) {
    if (!games[body.gameID]) {
      res.send(`Game ${body.gameID} does not exist.`)
      return
    }

    let game = games[body.gameID]
    let response = game.handlePlayerMove(body.playerID, body.index)
    console.log(response)
    res.json(response)
    return
  }
  res.send('no game found')
})

app.listen(port, () => console.log(`App listening on port ${port}`))