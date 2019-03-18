const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory sqlite database.');
});
 
db.serialize(async () => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY ASC, username TEXT, password TEXT)");
 
  // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  // for (var i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  // }
  // stmt.finalize();
 
  // db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
  //     console.log(row.id + ": " + row.info);
  // });
});

module.exports = db