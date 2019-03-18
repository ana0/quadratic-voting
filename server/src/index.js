const express = require('express')
const routes = require('./routes')
const port = require('./config/env').port
const db = require('./connections/sqlite')
const createAdminUser = require('./lib/auth').createAdminUser

const app = express()
routes(app)
createAdminUser()


const server = app.listen(port, async err => {
  if (err) console.error(err)
  else console.log(`Server up on ${port}`)
})

process.on('SIGINT', () => {
    db.close();
    server.close();
    console.log('closed db and server')
});

module.exports = app
module.exports.server = server