import React from 'react';
import './App.css';

import axios from 'axios';
import { requestURL , summary, listData } from './constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, 
      cases: "",
      deaths: "",
      recovered: "",
      error: null,
      lookup: null,
      submitted: false,
      countryArray: [],
    };
    this.LoadData = this.LoadData.bind(this);
    this.Submit = this.Submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  LoadData = () => {
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

  onChange(event) {
    this.setState({
      lookup : event.target.value,
      submitted: false,
    })
  }

  Submit = (event) => {
    this.setState({ 
      lookup : this.state.lookup,
      submitted: true,
      // countryArray : countryArray.push(this.state.lookup),
    });
    // this.setState({ lookup : "Canada" });
    console.log(this.state.lookup);
    event.preventDefault(); 
  }  

  componentDidMount() {
    this.LoadData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p><strong>Worldwide</strong></p>
          <p>cases: { this.state.cases }</p>
          <p> deaths: { this.state.deaths }</p>
          <p>recoveries: { this.state.recovered }</p>
        </header>
        <div className="searchDiv">
          <Search 
          onSubmit = { this.Submit } 
          test="test"
          value={ this.state.value }
          onChange = { this.onChange }
          />
        </div>
        <div className="displayResult">
          {
            this.state.submitted &&
            <Result 
              name = { this.state.lookup }
              countryArray = { this.state.countryArray }
            />
          }
        </div>
      </div>
    );
  }
}

const Search = (props) => 
  <form onSubmit = { props.onSubmit }>
    <input 
      type = "text" 
      placeholder = "Search..." 
      value={ props.value }
      onChange = { props.onChange }
    /> 
    <button type="submit">
      Submit
    </button>
  </form>

class Result extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      country: null,
      cases: null,
      todayCases: null,
      deaths: null,
      todayDeaths: null,
      recovered: null,
      active: null,
      critical: null,
      casesPerOneMillion: null, 
      // countryArray: [],
    };
    this.LoadListData = this.LoadListData.bind(this);
  }
  LoadListData = () => {
    return axios
      .get(`${listData}` + '/' + `${this.props.name}`)
      .then(result => {
        this.setState({
          cases: result.data.cases,
        })
      })
  }
  componentDidMount() {
    this.LoadListData();
  }
  render() {
    return(
      <div>
          <p>{this.props.name} cases: {this.state.cases}</p>
      </div>
    );
  };
}


export default App;
