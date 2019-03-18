const bodyParser = require('body-parser')
const cors = require('cors')
const login = require('../controllers/user')
const authMiddleware = require('../middleware/auth')
const polls = require('../controllers/polls')

module.exports = (app) => {
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.get('/', (req, res) => res.status(200).json('Server listening'))

  app.post('/login', login)

  app.get('/polls', polls.readPolls)
  app.post('/polls', authMiddleware, polls.createPoll)
  app.put('/polls', authMiddleware, (req, res) => res.status(200).json('Polls endpoint'))
  app.delete('/polls', authMiddleware, (req, res) => res.status(200).json('Polls endpoint'))
}

