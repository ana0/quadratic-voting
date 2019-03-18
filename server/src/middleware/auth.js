const jwtSecret = require('../config/env').jwtSecret
const jwt = require('jsonwebtoken')

const authMiddleWare = (req, res, next) => {
  const token = req.headers['token']
  if (!token) return res.status(403).send({ error: 'Must provide token' })

  // verifies secret and checks exp
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) return res.sendStatus(403)
    res.locals.user = decodedToken
    next()
  })

}

module.exports = authMiddleWare