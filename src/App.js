import React from 'react';
import './App.css';
import axios from 'axios';
import { Grid, Button, Select } from 'semantic-ui-react';
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
            <h3><strong>Virus Visualizer</strong></h3>
            <div className='worldSummary'>
              <p><strong>Worldwide data</strong></p>
              <p>cases: {this.state.cases} &nbsp;&nbsp;&nbsp;deaths: {this.state.deaths}&nbsp;&nbsp;&nbsp;recoveries: {this.state.recovered}</p>
            </div>
          </header>
        </div> 


        <div>
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


        <div className='sort'>
          <Sort/>
        </div>

      </div> 
    );
  }
} // App

const Search = (props) =>
  <form onSubmit={props.onSubmit}>
    <div>
      <input
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        array={props.array}
      />
      <Button basic compact size='mini' color='black' attached='right' type="submit">
        Submit
      </Button>
    </div>
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
    const deathPercentIncrease=((this.state.todayDeaths/(this.state.deaths-this.state.todayDeaths))*100).toFixed(2); 
    const casesPercentIncrease=((this.state.todayCases/(this.state.cases-this.state.todayCases))*100).toFixed(2);
    const deathRecoveryRatio = (100*(deaths/(deaths+recovered))).toFixed(2);

    return (
      <div className="WorldResult">
        <Grid doubling columns='two'>
          <Grid.Row>
            <Grid.Column>
              <p>Deaths: {deaths}.</p>
              <p>Deaths today: {todayDeaths}</p>
              <p>Daily increase in death: <strong>{deathPercentIncrease}%</strong></p> 
              <p>Recoveries: {recovered}</p>
              <p><sup>Deaths</sup>&frasl;<sub>Deaths+Recoveries</sub>: {deathRecoveryRatio}</p>
            </Grid.Column>
            <Grid.Column>
              <p>{country} cases: {cases}</p>
              <p>Cases today: {todayCases}</p>          
              <p>Daily increase in cases: <strong>{casesPercentIncrease}%</strong></p>               
              <p>{active} active cases, {critical} of which are critical.</p>
              <p>Cases per million: {casesPerOneMillion}</p>
            </Grid.Column>

      
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid columns='one'>
            <Grid.Row>
              <div className='Chart'>
                <LineChart data={timelineDeaths} layout="vertical" width={300} height={300} className='ChartFont'>
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
            </Grid.Row>
          </Grid>
        </Grid>

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
      readableDateChecked: null, 
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
          readableDateChecked: state.dateChecked.replace("T", " ").replace(":00Z", " "), 
        });
      })
  }
  componentDidMount() {
    this.LoadStateData();
  }

  render() {
    const { state, cases, testedNegative, pendingCases, hospitalized,
      deaths, totalTested, readableDateChecked } = this.state;
    const ratio = (100*(deaths/cases)).toFixed(2); 
    return (
      <div className='Result'>
        <p>
          In "{state}", as of { readableDateChecked } there have been {cases} confirmed cases.
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
        <p>Deaths per confirmed cases percentage: {ratio}</p>

        <hr />
      </div>
    );
  };
} // DomesticResult

class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      submitted: false,
      value: '',
      sortedData: [], 
      dataKey: '', 
    };
    this.Change=this.Change.bind(this);
    this.Submit=this.Submit.bind(this); 
    this.LoadSortData=this.LoadSortData.bind(this); 
  }
  Change(event) {
    this.setState({
      value: event.target.value,
      submitted: false, 
    });
  }
  Submit(event) {
    event.preventDefault(); 
    if (this.state.value==''){
      return;
    }
    this.setState({
      submitted: true, 
    });
    this.LoadSortData(); 
    // this.renderChart(); 
  }
  LoadSortData = () => {
    console.log(this.state.value);
    console.log(this.state.submitted);
    return axios
      .get(`${requestURL}` + '/countries?sort=' + `${this.state.value}`)
      .then(result => {
        this.GraphSortedData(result.data);
      })
  }
  GraphSortedData = (data) => {
    this.setState({
      sortedData: data, 
    })
  }
  componentDidMount() {
    this.LoadSortData();
  }
  
  render() {
    const { value, submitted, sortedData } = this.state; 
    // const chart; 
    // console.log(this.state.sortedData);
    return (
      <div id='parentElementSort'>
        <form onSubmit={this.Submit}>
          <label>Sort by</label>
          <select value={this.state.value} onChange={this.Change}>
            <option value=""></option>
            <option value="cases">cases</option>
            <option value="todayCases">cases today</option>
            <option value="deaths">deaths</option>
            <option value="todayDeaths">deaths today</option>
            <option value="recovered">recovered</option>
            <option value="active">active</option>
            <option value="critical">critical</option>
            <option value="casesPerOneMillion">cases per one million</option>
            <option value="deathsPerOneMillion">deaths per one million</option>
          </select>
          <input type='submit' value='Submit' />
        </form> 
        {
          submitted &&           
          // <div>
          //   {this.renderChart()}
          // </div>
          <BarChart width={1500} height={500} data={sortedData} className='ChartFont'>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={value} fill="#8884d8" />
          </BarChart>   
        }
      </div>
    );
  }
}

export default App;
