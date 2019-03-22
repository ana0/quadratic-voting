const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./quadratic.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory sqlite database.');
});
 
db.serialize(async () => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY ASC, username TEXT, password TEXT)");
  db.run("CREATE TABLE polls (id INTEGER PRIMARY KEY ASC, question TEXT)");
  db.run("CREATE TABLE pollItems (id INTEGER PRIMARY KEY ASC, answer TEXT, pollsId INT, FOREIGN KEY(pollsId) REFERENCES polls(id))");
  db.run("CREATE TABLE hasVoted (id INTEGER PRIMARY KEY ASC, sessionId TEXT, pollsId INT, FOREIGN KEY(pollsId) REFERENCES polls(id))");
  db.run("CREATE TABLE votes " +
  	"(id INTEGER PRIMARY KEY ASC, voteWeight INT, pollsId INT, pollItemsId INT," +
  	"FOREIGN KEY(pollsId) REFERENCES polls(id), FOREIGN KEY(pollItemsId) REFERENCES pollItems(id))");
});

module.exports = db