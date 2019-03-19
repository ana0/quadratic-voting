import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { apiUrl } from './env'

const TableRow = ({row}) => (
  <tr>
    <td key={row.id}>{row.id}</td>
    <td key={row.question}>{row.question}</td>
  </tr>
);

const Table = ({data}) => (
  <table><tbody>
    {data.map(row => <TableRow key={row.id} row={row ? row : {}} />)}
  </tbody></table>
);


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      polls: []
    };
  }

  componentDidMount() {
    return fetch(`${apiUrl}polls`, {
	  method: "GET",
	  headers: {
	    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
	  }})
      .then(response => {
      	console.log(response)
      	return response.json()
      })
      .then(data => {
      	console.log(data.polls)
      	return this.setState({ polls: data.polls })
      });
  }

  render() {
    console.log('render')
  	console.log(`state data is ${this.state}`)
  	console.log(this.state)
    return (
      <div className="App">
        <h1>{apiUrl}!</h1>
        <Table data={this.state.polls} />, 
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))