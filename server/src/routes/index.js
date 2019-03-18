const bodyParser = require('body-parser')
const cors = require('cors')
const login = require('../controllers/user')

module.exports = (app) => {
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.get('/', (req, res) => res.status(200).json('Server listening'))

  app.post('/login', login)

  app.get('/polls', (req, res) => res.status(200).json('Polls endpoint'))
  app.post('/polls', (req, res) => res.status(200).json('Polls endpoint'))
  app.put('/polls', (req, res) => res.status(200).json('Polls endpoint'))
  app.delete('/polls', (req, res) => res.status(200).json('Polls endpoint'))
}

