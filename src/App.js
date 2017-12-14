import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      reqHeaders: {},
      resHeaders: {},
      response: ''
    }
  }

  resetState() {
    this.setState(
      {
        data: [],
        reqHeaders: {},
        resHeaders: {},
        response: ''
      }
    )
  }

  getStrangers() {
    this.resetState();

    axios.get('/people')
      .then(response => {
        // console.log('RESPONSE', response);
        const reqHeaders = response.data.pop();
        this.setState(
          {
            data: response.data,
            reqHeaders,
            resHeaders: response.headers,
            response
          }
        )
      });
  }

  requestStudents() {
    this.resetState();

    // axios.get('http://localhost:3101/students')
    axios.delete('http://localhost:3101/student/Amy')
    // axios.post('http://localhost:3101/student', { 'name': 'Amy' })
      .then(students => {
        // console.log('RESPONSE', students);
        const reqHeaders = students.data.pop();
        this.setState(
          {
            data: students.data,
            reqHeaders,
            resHeaders: students.headers,
            response: students
          }
        )
      });
  }

  render() {
    const data = this.state.data.map((datum, i) => <div key={i}>{datum.name}</div>);
    const reqHeaders = Object.keys(this.state.reqHeaders).map((prop, i) => (
      <div key={i}>
        {prop}: &nbsp; "{this.state.reqHeaders[prop]}"
      </div>
    ))
    const resHeaders = Object.keys(this.state.resHeaders).map((prop, i) => (
      <div key={i}>
        {prop}: &nbsp; "{this.state.resHeaders[prop]}"
      </div>
    ))
    const envs = Object.keys(process.env).map((env, i) => (
      <div key={i}>{env}: {process.env[env]}</div>
    ))

    return (
      <div className="App">
        <header className="App-header">
          <div className="button" onClick={this.getStrangers.bind(this)}>GET STRANGERS</div>
          <div className="button" onClick={this.requestStudents.bind(this)}>REQUEST STUDENTS</div>
        </header>

        <section className="main">
          <div className="headers field">
            <h4>Request headers</h4>
            {this.state.response ? reqHeaders : null}
          </div>

          <div className="headers field">
            <h4>Response headers</h4>
            {this.state.response ? resHeaders : null}
          </div>

          <div className="data field">
            <h4>Data</h4>
            {this.state.data.length ? data : null}
          </div>
        </section>

      </div>
    );
  }
}

export default App;
