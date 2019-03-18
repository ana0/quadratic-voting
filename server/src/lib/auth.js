const bcrypt = require('bcrypt')
const adminPassword = require('../config/env').adminPassword
const db = require('../connections/sqlite')

const SALT_WORK_FACTOR = 10;

const createAdminUser = async () => {
  const pass = await prePassword(adminPassword);
  db.run("INSERT INTO users(username, password) VALUES (?, ?)", ['admin', pass], (err) => {
    if (err) throw err;
    console.log('saved admin')
  });
}

const prePassword = (pass) => {
 return bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) throw (err);
    if (!pass) throw new Error('must set password')

    // hash the password along with our new salt
    return bcrypt.hash(pass, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      return hash
    });
  });
}

module.exports = { createAdminUser }