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
        </label>
    )
  }
}

class AnswerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      votes: this.props.data.answers
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
    const vote = parseInt(event.target.value);
  	const votes = this.state.votes.map((v) => {
    	if (v.answer = currentAnswer) { v.vote = vote }
      if (Number.isNaN(v.vote)) { hasError = true }
    	return v
  	})
   //  //const parsedVotes = 
  	// const vote = parseInt(event.target.value)
  	// if (Number.isNaN(vote)) {
  	this.setState({ hasError, error: 'Only decimal numbers as vote input', votes });
  	// }
    //this.setState({value: event.target.value});
  }

  render() {
    console.log('table row')
  	console.log(this.props)
  	console.log(this.state)
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.hasError ? <h2>{this.state.error}</h2> : null}
	    {this.props.data.answers.map(row => <FormRow row={row ? row : {}} handleChange={this.handleChange.bind(this)}/>)}
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

class TableRow extends Component {
  render() {
   //  console.log('table row')
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