const db = require('../connections/sqlite')

const readVotes = () => {

}

const createVotes = (req, res) => {
  console.log('create votes')
  //let pollId
  console.log(req.body)
  let { votes, sessionId, pollId } = req.body
  // votes = votes.map((votes) => {
  // 	v.pollsId = pollId
  // 	v.sessionId = sessionId
  // })
  // must use old function notation
  console.log(sessionId)
  console.log(pollId)
  db.get(`SELECT rowid AS id FROM hasVoted WHERE sessionId == '${sessionId}' AND pollsId == '${pollId}'`, function(err, hasVoted) {
    if (err) throw err;
    console.log(hasVoted)
    if (hasVoted) return res.status(403).json({ error: 'You have already voted on this poll' });

    const stmt = db.prepare("INSERT INTO votes(pollsId, voteWeight, pollItemsId) VALUES (?, ?, ?)");
    votes.map((a) => {
      return stmt.run([pollId, a.voteWeight, a.id]);
    })
    stmt.finalize();

    db.run("INSERT INTO hasVoted(sessionId, pollsId) VALUES (?, ?)", [sessionId, pollId])
    // db.each("SELECT rowid AS id, answer, pollsId FROM pollItems", function(err, row) {
    //     console.log(row.id + ": " + row.answer + ' ' + row.pollsId);
    // });
    res.status(200).json(`Create votes for ${sessionId} on poll ${pollId}`);
  })
  // })
}

const updateVotes = () => {
	
}

const deleteVotes = () => {
	
}

module.exports = {
  readVotes,
  createVotes,
  updateVotes,
  deleteVotes
}