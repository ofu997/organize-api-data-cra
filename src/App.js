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
      worldLookupArray: [],

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
    return axios
      .get(`${domesticURL}`)
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
      worldLookupArray: this.state.worldLookupArray.concat(this.state.lookup),
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
          <h4><strong>Virus Visualizer</strong></h4>
          <div className='worldSummary'>
            <p><strong>Worldwide data</strong></p>
            <p>cases: {this.state.cases}</p>
            <p> deaths: {this.state.deaths}</p>
            <p>recoveries: {this.state.recovered}</p>
          </div>
        </header>
        {/* international */}
        <div className="searchDiv">
          <Search
            onSubmit={this.Submit}
            value={this.state.lookup}
            onChange={this.onChange}
            placeholder="Search nation"
          />
          {/* 
          {
            this.state.submitted &&
            <Result
              name={this.state.lookup}
              countryArray={this.state.countryArray}
            />
          }      
          */}
          {
            this.state.worldLookupArray.map( item =>
              <Result
                name={item}
              />
            )
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
          {/* 
          {
            this.state.domesticSubmitted &&
            <DomesticResult
              name={this.state.domesticLookup}
            />
          }         
          */}
          {
            this.state.domesticLookupArray.map(item =>
              <DomesticResult
                name={item}
              />  
            )
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
    };
    this.LoadNationData = this.LoadNationData.bind(this);
  }
  LoadNationData = () => {
    return axios
      .get(`${listData}` + '/' + `${this.props.name}`)
      .then(result => {
        this.setState({
          country: result.data.country,
          cases: result.data.cases,
          todayCases: result.data.todayCases,
          deaths: result.data.deaths,
          todayDeaths: result.data.todayDeaths,
          recovered: result.data.recovered,
          active: result.data.active,
          critical: result.data.critical,
          casesPerOneMillion: result.data.casesPerOneMillion,
          deathsPerOneMillion: result.data.deathsPerOneMillion,
        })
      })
  }
  componentDidMount() {
    this.LoadNationData();
  }

  render() {
    const { country, cases, todayCases, deaths, todayDeaths, recovered,
    active, critical, casesPerOneMillion, deathsPerOneMillion
    } = this.state; 
    const deathRecoveryRatio = 100*(deaths/(deaths+recovered));
    return (
      <div className='DomesticResult'>
        <p>{country} cases: {cases}</p>
        <p>Cases today: {todayCases}</p>
        <p>Deaths: {deaths}.</p>
        <p>Deaths today: {todayDeaths}</p>
        <p>Recoveries: {recovered}</p>
        <p>Percentage of cases ending with death: {deathRecoveryRatio}</p>
        <p>{this.state.active} active cases, {critical} of which are critical.</p>
        <p>Cases per million: {casesPerOneMillion}</p>
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
          state: abbr, 
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
      <div className='DomesticResult'>
        <p>
          In "{this.state.state}", as of {dateChecked} there have been {cases} confirmed cases.
          </p>
        <p>
          Deaths: {deaths}
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
