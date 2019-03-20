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
      remainingVotes: 25
    };
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    //event.preventDefault();
  }

  handleChange(event, currentAnswer) {
  	console.log('change')
  	console.log(event.target.value)
    let hasError
    let error = ''
    let sumVotes = 0
    let remainingVotes
    const vote = parseInt(event.target.value);
  	const votes = this.state.votes.map((v) => {
    	if (v.answer === currentAnswer) { v.vote = vote }
      if (Number.isNaN(v.vote) || v.vote === undefined) {
        console.log('iterating')
        hasError = true; error = 'Only decimal numbers as vote input'
        v.voteWeight = 0
      }
      else {
        console.log(`iterating sumvotes is ${sumVotes}`)
        console.log(v.vote)
        sumVotes += v.vote
        console.log(`iterating 2 sumvotes is ${sumVotes}`)
        const sqrt = Math.round(Math.sqrt(v.vote))
        v.voteWeight = sqrt
      }
      if (sumVotes > this.props.data.totalVotes) { hasError = true; error = 'Too many votes!' }
    	return v
  	})
    console.log(votes)
    console.log('sumVotes:' + sumVotes)
    console.log('remainingVotes:')
    console.log(remainingVotes)
    const answers = this.props.data.answers
    remainingVotes = this.props.data.totalVotes - sumVotes
  	this.setState({ hasError, error, votes, remainingVotes });
  }

  render() {
    console.log('table row')
  	console.log(this.props)
  	console.log(this.state)
    console.log(this.state.remainingVotes)
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.hasError ? <h2>{this.state.error}</h2> : null}
        {this.state.remainingVotes > 0 ? <h2>Remaining vote credits: {this.state.remainingVotes}</h2> : null}
        {this.state.votes.map(row => <FormRow row={
          row ? row : {}}
          handleChange={this.handleChange.bind(this)}
          />)}
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

class TableRow extends Component {
  render() {
    // console.log('table row')
  	// console.log(this.props)
  	// console.log(this.state)
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
      	console.log(response)
      	return response.json()
      })
      .then(data => {
      	console.log(data)
      	const question = this.props.data.find(row => row.id === i)
      	// this.setState({ question: question.question, answers: data.answers })
      	// console.log('handling click')
      	// console.log(question.question)
      	this.props.unmountPolls({ question: question.question, answers: data.answers })
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
    this.state = {
      renderPolls: true,
      renderAnswerForm: false,
      polls: [],
      question: '',
      answers: [],
      totalVotes: 25,
      votes: []
    };
    this.sessionId = localStorage.getItem('myData');
    if (!sessionId) { localStorage.setItem("sessionId", (Math.random() * Math.pow(2, 54)).toString(36) }
    console.log(this.sessionId)
  }


  componentDidMount() {
    return fetch(`${apiUrl}polls`, {
	  method: "GET",
	  headers: {
	    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
	  }})
      .then(response => {
      	//console.log(response)
      	return response.json()
      })
      .then(data => {
      	//console.log(data.polls)
      	return this.setState({ polls: data.polls })
      });
  }

  handleUnmountPolls(chosenPoll) {
  	this.setState({renderPolls: false, ...chosenPoll, renderAnswerForm: true });
  }

  render() {
   //  console.log('render')
  	// console.log(`state data is ${this.state.question}`)
  	// console.log(this.state)
    return (
      <div className="App">
        <h1>{this.state.question}</h1>
        {this.state.renderPolls ? <PollTable data={this.state.polls} unmountPolls={this.handleUnmountPolls}/> : null}
        {this.state.renderAnswerForm ? <AnswerForm data={this.state} /> : null}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))