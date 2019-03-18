import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { apiUrl } from './env'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: null,
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
      .then(data => this.setState({ data }));
  }

  render() {
  	console.log(this.state.data)
    return (
      <div className="App">
        <h1>{apiUrl}!</h1>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))