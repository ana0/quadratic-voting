const db = require('../connections/sqlite')

const readPolls = (req, res)  => {
  return db.all(`SELECT question, answer, pollsId FROM polls INNER JOIN pollItems ON pollItems.pollsId = polls.id;`, async (err, polls) => {
    if (err) throw err;
    if (!polls) return res.status(401).json({ error: 'No polls' });
    return res.status(200).json({ polls })
  })
}

const createPoll = (req, res) => {
  console.log('create')
  let pollId
  const { question, answers } = req.body.poll
  // must use old function notation
  db.run("INSERT INTO polls(question) VALUES (?)", question, function(err) {
    if (err) throw err;

    console.log(`inserted question ${this.lastID}`)
    pollId = this.lastID
    const stmt = db.prepare("INSERT INTO pollItems(answer, pollsId) VALUES (?, ?)");
    answers.map((a) => {
      return stmt.run([a, pollId]);
    })
    stmt.finalize();
    // db.each("SELECT rowid AS id, answer, pollsId FROM pollItems", function(err, row) {
    //     console.log(row.id + ": " + row.answer + ' ' + row.pollsId);
    // });
    res.status(200).json(`Create poll ${pollId}`)
  })
}

const updatePoll = (req, res)  => {
	res.status(200).json('Polls endpoint')
}

const deletePoll = (req, res)  => {
	res.status(200).json('Polls endpoint')
}

module.exports = {
  readPolls,
  createPoll,
  updatePoll,
  deletePoll
}