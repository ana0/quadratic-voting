import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { apiUrl } from './env'

class FormRow extends Component {
  render() {
    return (
        <label>
          {this.props.row.answer}:
          <input type="text" onChange={(event) => this.props.handleChange(event, this.props.row.answer)} /><br />
          {this.props.row.voteWeight ? <p>These vote credits give {this.props.row.voteWeight} vote weight</p> : null}
        </label>
    )
  }
}

class AnswerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      votes: this.props.data.answers,
      remainingVotes: 25,
      message: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('submit')
    if (this.state.hasError) { alert('Cannot submit votes with errors!') }
    else { 
      const voteData = {
        votes: this.state.votes,
        sessionId: localStorage.getItem('sessionId'),
        pollId: this.props.data.pollId
      }
      console.log(voteData)
      return fetch(`${apiUrl}votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voteData),
      })
      .then(response => {
        console.log(response)
        if (response.status === 403 ) {
          return 'You cannot vote in the same poll again!'
        } else {
          console.log('submitted')
          return 'Votes were submitted'
        }
      })
      .then(message => {
        alert(message)
        this.props.unmountAnswers()
      })
      .catch((err) => console.log(err))
    }
  }

  handleChange(event, currentAnswer) {
    let hasError
    let error = ''
    let sumVotes = 0
    let remainingVotes
    const vote = parseInt(event.target.value);
  	const votes = this.state.votes.map((v) => {
    	if (v.answer === currentAnswer) { v.vote = vote }
      if (Number.isNaN(v.vote) || v.vote === undefined) {
        hasError = true; error = 'Only decimal numbers as vote input'
        v.voteWeight = 0
      }
      else {
        sumVotes += v.vote
        const sqrt = Math.round(Math.sqrt(v.vote))
        v.voteWeight = sqrt
      }
      if (sumVotes > this.props.data.totalVotes) { hasError = true; error = 'Too many votes!' }
    	return v
  	})
    remainingVotes = this.props.data.totalVotes - sumVotes
  	this.setState({ hasError, error, votes, remainingVotes });
  }

  render() {
    console.log('test console')
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {this.state.hasError ? <h2>{this.state.error}</h2> : null}
        {this.state.remainingVotes > 0 ? <h2>Remaining vote credits: {this.state.remainingVotes}</h2> : null}
        {this.state.votes.map(row => <FormRow row={
          row ? row : {}}
          key={row.id}
          handleChange={this.handleChange.bind(this)}
          />)}
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

class TableRow extends Component {
  render() {
    return (
	  <tr onClick={this.props.onClick}>
	    <td key={this.props.row.id}>{this.props.row.id}</td>
	    <td key={this.props.row.question}>{this.props.row.question}</td>
	  </tr>
    )
  }
}

class PollTable extends Component {
  handleClick(i) {
    return fetch(`${apiUrl}polls/${i}`, {
	  method: "GET",
	  headers: {
	    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
	  }})
      .then(response => {
      	return response.json()
      })
      .then(data => {
      	const question = this.props.data.find(row => row.id === i)
      	this.props.unmountPolls({ question: question.question, answers: data.answers, pollId: question.id })
      });
  }

  render() {
	return (
	  <table><tbody>
	    {this.props.data.map(row => <TableRow
	      onClick={() => this.handleClick(row.id)}
	      key={row.id}
	      row={row ? row : {}} />)}
	  </tbody></table>
	)
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.handleUnmountPolls = this.handleUnmountPolls.bind(this);
    this.handleUnmountAnswers = this.handleUnmountAnswers.bind(this);
    this.state = {
      renderPolls: true,
      sessionId: '',
      renderAnswerForm: false,
      polls: [],
      question: '',
      pollId: '',
      answers: [],
      totalVotes: 50,
      votes: []
    };
  }


  componentDidMount() {
    return fetch(`${apiUrl}polls`, {
	  method: "GET",
	  headers: {
	    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
	  }})
      .then(response => {
      	return response.json()
      })
      .then(data => {
        let sessionId = localStorage.getItem('sessionId');
        console.log('sessionId:' + sessionId)
        if (!sessionId) {
          sessionId = (Math.random() * Math.pow(2, 54)).toString(36);
          localStorage.setItem("sessionId", sessionId)
        }
      	return this.setState({ polls: data.polls, sessionId })
      });
  }

  handleUnmountPolls(chosenPoll) {
  	this.setState({renderPolls: false, ...chosenPoll, renderAnswerForm: true });
  }

  handleUnmountAnswers() {
    this.setState({renderPolls: true, question: '', renderAnswerForm: false });
  }

  render() {
    return (
      <div className="App">
        <h1>{this.state.question}</h1>
        {this.state.renderPolls ? <PollTable data={this.state.polls} unmountPolls={this.handleUnmountPolls}/> : null}
        {this.state.renderAnswerForm ? <AnswerForm data={this.state} unmountAnswers={this.handleUnmountAnswers}/> : null}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))