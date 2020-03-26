import React from 'react';
import './App.css';

import axios from 'axios';
import {
  requestURL, summary, listData,
  domesticURL, latestFromDomesticState, domesticStateAbbreviation,
  GetAbbreviation,
} from './constants';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cases: "",
      deaths: "",
      recovered: "",
      error: null,
      lookup: '',
      submitted: false,
      // countryArray: [],

      domesticLookup: '',
      domesticSubmitted: false,
      domesticLookupArray: [], 
    };
    this.LoadData = this.LoadData.bind(this);
    this.Submit = this.Submit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.DomesticLoadData = this.DomesticLoadData.bind(this);
    this.DomesticSubmit = this.DomesticSubmit.bind(this);
    this.DomesticOnChange = this.DomesticOnChange.bind(this);
  }
  LoadData = () => {
    this.setState({ loading: true });
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
  DomesticLoadData = () => {
    // this.setState({loading: true});
    return axios
      .get(`${domesticURL}`)
      // .then(result => {
      //   this.setState({ 
      //     loading: false,
      //     error: false, 
      //   })
      // })
      .catch(error => {
        this.setState({
          error: `${error}`,
          loading: false,
        })
      });
  }
  onChange(event) {
    this.setState({
      lookup: event.target.value,
      submitted: false,
    })
  }
  DomesticOnChange(event) {
    this.setState({
      domesticLookup: event.target.value,
      domesticSubmitted: false,
    })
  }
  Submit = (event) => {
    this.setState({
      lookup: this.state.lookup,
      submitted: true,
    });
    event.preventDefault();
  }
  DomesticSubmit = (event) => {
    this.setState({
      domesticLookup: this.state.domesticLookup,
      domesticSubmitted: true,
      domesticLookupArray: this.state.domesticLookupArray.concat(this.state.domesticLookup), 
    });
    console.log(this.state.domesticLookupArray);
    event.preventDefault();
  }
  componentDidMount() {
    this.LoadData();
    this.DomesticLoadData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p><strong>Worldwide</strong></p>
          <p>cases: {this.state.cases}</p>
          <p> deaths: {this.state.deaths}</p>
          <p>recoveries: {this.state.recovered}</p>
        </header>
        {/* international */}
        <div className="searchDiv">
          <Search
            onSubmit={this.Submit}
            value={this.state.lookup}
            onChange={this.onChange}
            placeholder="Search nation"
          />
          {
            this.state.submitted &&
            <Result
              name={this.state.lookup}
              countryArray={this.state.countryArray}
            />
          }          
        </div>
        {/* domestic */}
        <div className="searchDiv">
          <Search
            onSubmit={this.DomesticSubmit}
            value={this.state.domesticLookup}
            onChange={this.DomesticOnChange}
            placeholder="Search state"
            array={this.state.domesticLookupArray}
          />
          {
            this.state.domesticSubmitted &&
            <DomesticResult
              name={this.state.domesticLookup}
            />
          }          
        </div>
      </div>
    );
  }
}

const Search = (props) =>
  <form onSubmit={props.onSubmit}>
    <input
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      array={props.array}
    />
    <button type="submit">
      Submit
    </button>
  </form>

class Result extends React.Component {
  constructor(props) {
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
    return (
      <div>
        <p>{this.props.name} cases: {this.state.cases}</p>
      </div>
    );
  };
}

class DomesticResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: null,
      cases: null,
      testedNegative: null,
      pendingCases: null,
      hospitalized: null,
      deaths: null,
      dateChecked: null,
      totalTested: null,
      allData: null,
    };
    this.LoadStateData = this.LoadStateData.bind(this);
  }
  LoadStateData = () => {
    const abbr = GetAbbreviation(this.props.name);
    return axios
      .get(`${domesticURL}${latestFromDomesticState}${abbr}`)
      .then(result => {
        var state = result.data[0];
        this.setState({
          cases: state.positive,
          testedNegative: state.negative,
          pendingCases: state.pending,
          hospitalized: state.hospitalized,
          deaths: state.death,
          totalTested: state.total,
          dateChecked: state.dateChecked,
        });
      })
  }
  componentDidMount() {
    this.LoadStateData();
  }

  render() {
    const { cases, testedNegative, pendingCases, hospitalized,
      deaths, totalTested, dateChecked } = this.state;

    const ratio = 100*(deaths/cases); 
    return (
      <div>
        <p>
          As of {dateChecked} there are {cases} cases.
          </p>
        <p>
          deaths: {deaths}
        </p>
        <p>
          There have been {totalTested} tests, {cases} of which were confirmed cases.
          </p>
        <p>
          {testedNegative} tested negative.
          </p>
        {
          hospitalized ?
            <p>{hospitalized} are hospitalized. </p>
            : null
        }
        {
          pendingCases?
          <p>{pendingCases} are pending</p>
          : null
        }
        {/* int parse? */}
        <p>Deaths per cases percentage: {ratio}</p>
      </div>
    );
  };
}

export default App;