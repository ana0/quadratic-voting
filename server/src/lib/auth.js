const bcrypt = require('bcrypt')
const { adminPassword, jwtSecret } = require('../config/env')
const db = require('../connections/sqlite')
const jwt = require('jsonwebtoken')

const SALT_WORK_FACTOR = 10;

const createAdminUser = async () => {
  const pass = await prePassword(adminPassword);
  db.run("INSERT INTO users(username, password) VALUES (?, ?)", ['admin', pass], (err) => {
    if (err) throw err;
    console.log('saved admin')
  });

  // db.each("SELECT id, username, password FROM users", (err, row) => {
  //     console.log(row.id + ": " + row.username + ' ' + row.password);
  // });
}

const prePassword = async (pass) => {
 return new Promise((res, rej) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) throw (err);
    if (!pass) throw new Error('must set password')
      // hash the password along with our new salt
      bcrypt.hash(pass, salt, (err, hash) => {
        if (err) return next(err);
        // return the hashed password
        res(hash)
      })
    })
  })
}

const comparePassword = (candidatePassword, password) => {
  return new Promise((res, rej) => {
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
      if (err) throw err;
      res(isMatch)
    })
  });
}

const createToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7 days' });
}

module.exports = { createAdminUser, comparePassword, createToken }