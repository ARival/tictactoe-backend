import express from 'express'
import TicTacToeGame from './game.js'
const app = express()
const port = 3001

const games = {}

app.use(express.json())

app.get('/', (req, res) => {

  res.json(games)
})

app.post('/connect', (req, res) => {
  let body = req.body
  // res.json(req.body)
  if (body.gameID) {
    if (!games[body.gameID]) {
      res.send(`Game ${body.gameID} does not exist.`)
      return
    }

    let connection = games[body.gameID].connect(body.playerID)
    // res.send('no id')
    console.log(connection)
    res.json(connection)
    return
  }
  let newGame = new TicTacToeGame(body.playerID)
  console.log(newGame)
  games[newGame.getGameID()] = newGame
  res.json(
    {
      gameID: newGame.getGameID()
    }
  )
})

app.post('/move', (req, res) => {
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