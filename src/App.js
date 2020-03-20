import React from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';
import { requestURL , summary } from './constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, 
      cases: "",
      deaths: "",
      recovered: "",
      error: null,
    };

    this.loadData = this.loadData.bind(this);
  }

  loadData = () => {
    this.setState({loading: true});
    return axios  
      .get(`${requestURL}${summary}`)
      .then(result => {
        this.setState({ 
          loading: false,
          error: false, 
          cases: result.data.cases,
          deaths: result.data.deaths,
          recovered: result.data.recovered,
        })
      })
      .catch(error => {
        this.setState({ 
          error: `${error}`,
          loading: false,
        })
      });
  };  

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>cases: {this.state.cases} deaths: {this.state.deaths} recoveries: {this.state.recovered}</p>
        </header>
      </div>
    );
  }
}

export default App;
