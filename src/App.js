import React from 'react';
import './App.css';
import axios from 'axios';
import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {
  requestURL, summary, listData,
  domesticURL, latestFromDomesticState, domesticStateAbbreviation,
  GetAbbreviation,
} from './constants';
import { BarChart, LineChart, Line, CartesianGrid, 
  XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'; 


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
      <div>
        <div className="App">
          <header className="App-header">
            <h2><strong>Virus Visualizer</strong></h2>
            <div className='worldSummary'>
              <p><strong>Worldwide data</strong></p>
              <p>cases: {this.state.cases} &nbsp;&nbsp;&nbsp;deaths: {this.state.deaths}&nbsp;&nbsp;&nbsp;recoveries: {this.state.recovered}</p>
            </div>
          </header>
        </div> 
        <div className="mainContent">
          <Grid doubling columns='two'>
            <Grid.Row>
              {/* international */}
              <Grid.Column className='column'>
                <div className="searchDiv">
                  <Search
                    onSubmit={this.Submit}
                    value={this.state.lookup}
                    onChange={this.onChange}
                    placeholder="Search nation"
                  />
                  {
                    this.state.worldLookupArray.map( item =>
                      <Result
                        name={item}
                        key={item}
                      />
                    )
                  }     
                </div>
              </Grid.Column>
              {/* domestic */}
              <Grid.Column>
                <div className="searchDiv">
                  <Search
                    onSubmit={this.DomesticSubmit}
                    value={this.state.domesticLookup}
                    onChange={this.DomesticOnChange}
                    placeholder="Search state"
                    array={this.state.domesticLookupArray}
                  />
                  {
                    this.state.domesticLookupArray.map(item =>
                      <DomesticResult
                        name={item}
                      />  
                    )
                  }  
                </div>
              </Grid.Column>
              </Grid.Row>
            </Grid>          
        </div>
      </div>
    );
  }
} // App

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
    const data = [{name: country, cases: cases,  cases_today: todayCases}];
    const deathRecoveryRatio = 100*(deaths/(deaths+recovered));
    return (
      <div className='DomesticResult'>
        <p>{country} cases: {cases}</p>
        <p>Cases today: {todayCases}</p>
        <p>Deaths: {deaths}.</p>
        <p>Deaths today: {todayDeaths}</p>
        <p>Recoveries: {recovered}</p>
        <p>Deaths/(Deaths+Recoveries) percentage: {deathRecoveryRatio}</p>
        <p>{active} active cases, {critical} of which are critical.</p>
        <p>Cases per million: {casesPerOneMillion}</p>

        <BarChart width={450} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          {/* <YAxis /> */}
          <Tooltip />
          <Legend />
          <Bar dataKey="cases" fill="#8884d8" />
          <Bar dataKey="cases_today" fill="#82ca9d" />
        </BarChart>        

        <hr></hr>
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
          There have been {totalTested} tests.
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
        <p>Deaths per confirmed cases percentage: {ratio}</p>

        <hr />
      </div>
    );
  };
}

export default App;
