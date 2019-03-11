const express = require('express')
const routes = require('./routes')
const port = require('./config/env').port

const app = express()
routes(app)

const server = app.listen(port, async err => {
  if (err) console.error(err)
  else console.log(`Server up on ${port}`)
})

module.exports = app
module.exports.server = server