const db = require('../connections/sqlite')
const { comparePassword, createToken } = require('../lib/auth')

const login = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ error: 'Incorrect args' });
  }
  const username = req.body.username.toLowerCase();
  const password = req.body.password;

  db.get(`SELECT rowid AS id, username, password FROM users`, async (err, user) => {
    if (err) throw err;
    if (!user) return res.status(401).json({ error: 'No such user' });
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) return res.status(403).send({ error: 'Incorrect password' })
    const token = createToken(user);
    return res.status(200).json({ token, username: user.name, id: user.id })
  })
}

module.exports = login