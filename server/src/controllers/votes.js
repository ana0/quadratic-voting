const db = require('../connections/sqlite')

const readVotes = (req, res) => {
  console.log('read votes')
  if (!req.params.id) return res.status(403).json({ error: 'Must send poll id'})
  const pollId = req.params.id;
  db.all(`SELECT votes.id, voteWeight, pollItemsId, answer FROM votes INNER JOIN pollItems ON pollItems.id = votes.pollItemsId WHERE votes.pollsId IS ${pollId};`, function(err, votes) {
    if (err) throw err; //WHERE pollsId IS ${pollId}
    console.log(votes)
    const seenAnswers = {}
    const summedVotes = votes.map((vote, index, array) => {
    	if (seenAnswers[vote.pollItemsId]) {
        const match = array.find(a => a.pollItemsId === vote.pollItemsId)
        console.log(match)
        match.voteWeight += vote.voteWeight
        return false;
    	}
    	else { seenAnswers[vote.pollItemsId] = true; return vote }
    })
    console.log(summedVotes)
    // sort summedVotes by voteWeight
    return res.status(200).json({ totals: summedVotes })
  })
}

const createVotes = (req, res) => {
  console.log('create votes')
  //let pollId
  console.log(req.body )
  let { votes, sessionId, pollId } = req.body
  // must use old function notation

  db.get(`SELECT rowid AS id FROM hasVoted WHERE sessionId == '${sessionId}' AND pollsId == '${pollId}'`, function(err, hasVoted) {
    if (err) throw err;
    console.log(hasVoted)
    if (hasVoted) return res.status(403).json({ error: 'You have already voted on this poll' });
    console.log(votes)
    const stmt = db.prepare("INSERT INTO votes(pollsId, voteWeight, pollItemsId) VALUES (?, ?, ?)");
    votes.map((a) => {
      return stmt.run([pollId, a.voteWeight, a.id]);
    })
    stmt.finalize();

    db.run("INSERT INTO hasVoted(sessionId, pollsId) VALUES (?, ?)", [sessionId, pollId])

    res.status(200).json(`Create votes for ${sessionId} on poll ${pollId}`);
  })
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