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
      timelineCases: [],
      timelineDeaths: [], 

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
    const newNation=[this.state.lookup];
    this.setState({
      lookup: this.state.lookup,
      submitted: true,
      worldLookupArray: newNation.concat(this.state.worldLookupArray),
    });
    event.preventDefault();
  }
  DomesticSubmit = (event) => {
    const newState=[this.state.domesticLookup];
    this.setState({
      domesticLookup: this.state.domesticLookup,
      domesticSubmitted: true,
      domesticLookupArray: newState.concat(this.state.domesticLookupArray),  
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
                    this.state.worldLookupArray.map(item =>
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
                    // array={this.state.domesticLookupArray}
                  />
                  {
                    this.state.domesticLookupArray.map(item =>
                      <DomesticResult
                        name={item}
                        key={item}
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

      timelineCases: [],
      timelineDeaths: [], 
    };
    this.LoadNationData = this.LoadNationData.bind(this);
    this.LoadTimeLineCases = this.LoadTimeLineCases.bind(this); 
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
  LoadTimeLineCases = () => {
    return axios
      .get(`${requestURL}`+'/v2/historical/'+`${this.props.name}`)
      .then(
        result => {
          this.setState({
            timelineCases: result.data.timeline.cases, 
            timelineDeaths: result.data.timeline.deaths, 
          })
          this.GraphData(result.data.timeline.cases, result.data.timeline.deaths);  
        },
      );
  }
  GraphData = (cases, deaths) => {
    const dataCases = []; 
    const dataDeaths = []; 
    let keys = Object.keys(cases);
    let keysOfDeath=Object.keys(deaths); 
    for ( let i = keys.length-1; i > -1; i-- ) {
      var obj = new Object();
      obj.date = keys[i];
      obj.cases = cases[keys[i]];
      dataCases.push(obj);
    }    
    for ( let i = keysOfDeath.length-1; i > -1; i-- ) {
      var deathObj = new Object(); 
      deathObj.date = keysOfDeath[i];
      deathObj.deaths = deaths[keysOfDeath[i]]; 
      dataDeaths.push(deathObj); 
    }    
    this.setState({
      timelineCases: dataCases,
      timelineDeaths: dataDeaths,
    })
  }
  componentDidMount() {
    this.LoadNationData();
    this.LoadTimeLineCases(); 
  }

  render() {
    const { country, cases, todayCases, deaths, todayDeaths, recovered,
    active, critical, casesPerOneMillion, deathsPerOneMillion, timelineCases, timelineDeaths,
    } = this.state; 
    const data = [{name: country, cases: cases,  cases_today: todayCases}];
    const deathRecoveryRatio = 100*(deaths/(deaths+recovered));

    return (
      <div className='Result'>
        <p>{country} cases: {cases}</p>
        <p>Cases today: {todayCases}</p>
        <p>Deaths: {deaths}.</p>
        <p>Deaths today: {todayDeaths}</p>
        <p>Recoveries: {recovered}</p>
        <p>Deaths/(Deaths+Recoveries) percentage: {deathRecoveryRatio}</p>
        <p>{active} active cases, {critical} of which are critical.</p>
        <p>Cases per million: {casesPerOneMillion}</p>

        {/* <BarChart width={225} height={150} data={data} className='ChartFont'>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cases" fill="#a9aaad" />
          <Bar dataKey="cases_today" fill="#282c34" />
        </BarChart>  */}

        <LineChart data={timelineDeaths} layout="vertical" width={300} height={300} className='ChartFont LineChart'>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis type="number" domain={[0, dataMax => (dataMax * 1.25)]} />
          <YAxis dataKey="date" type='category'/>
          <Tooltip/>
          <Legend />
          <Line dataKey="deaths" stroke="#8884d8" />
        </LineChart>          

        <LineChart layout="vertical" width={300} height={300} className='ChartFont' data={timelineCases}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis type="number" domain={[0, dataMax => (dataMax *1.25)]} />
          <YAxis dataKey="date" type='category'/>
          <Tooltip/>
          <Legend />
          <Line dataKey="cases" stroke="#8884d8" />
        </LineChart>              

        <hr></hr>
      </div>
    );
  };
} // Result

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
      <div className='Result'>
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
          pendingCases?
          <p>{pendingCases} are pending</p>
          : null
        }          
        {
          hospitalized ?
            <p>{hospitalized} are hospitalized. </p>
            : null
        }

        {/* int parse? */}
        <p>Deaths per confirmed cases percentage: {ratio}</p>

        <hr />
      </div>
    );
  };
} // DomesticResult

export default App;
