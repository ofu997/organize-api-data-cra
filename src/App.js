import axios from 'axios';
import React from 'react';
import { BrowserRouter as BR, Link, Route } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { ConvertStateNameAndID, domesticPress, domesticURL, latestFromDomesticState, listData, publicHealth, requestURL, summary } from './constants';

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
      pressData: [],

      domesticLookup: '',
      domesticSubmitted: false,
      domesticLookupArray: [],
    };
    this.LoadData = this.LoadData.bind(this);
    this.LoadNews = this.LoadNews.bind(this);
    this.Submit = this.Submit.bind(this);
    this.onChange = this.onChange.bind(this);
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
  LoadNews = () => {
    return axios
      .get(`${domesticPress}`)
      .then(result => {
        const first10 = result.data.slice(0, 10);
        const first10DescendingOrder = first10.reverse(); 
        this.setState({ pressData: first10DescendingOrder, })
      })
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
    const Nation = [this.state.lookup];
    this.setState({
      lookup: this.state.lookup,
      submitted: true,
      worldLookupArray: Nation.concat(this.state.worldLookupArray),
    });
    event.preventDefault();
  }
  DomesticSubmit = (event) => {
    const USAState = [this.state.domesticLookup];
    this.setState({
      domesticLookup: this.state.domesticLookup,
      domesticSubmitted: true,
      domesticLookupArray: USAState.concat(this.state.domesticLookupArray),
    });
    event.preventDefault();
  }
  componentDidMount() {
    this.LoadData();
    this.LoadNews();
  }

  render() {
    return (
      <BR>
        <div>
        {/* |^|^| parent element div */}
          <div className="App">
            <header className="App-header">
              <h3 id='Header'><strong>Virus Visualizer</strong></h3>
              <nav className='ResponsiveText'>
                <ul className='nav-links'>
                  <li>
                    <Link to='/'>Home</Link>
                  </li>
                  <li>
                    <Link to='/track-by-nation'>Track nations</Link>
                  </li>
                  <li>
                    <Link to='/sort-nations'>Sort nations</Link>
                  </li>
                  <li>
                    <Link to='/track-by-states'>Track states</Link>
                  </li>
                  <li>
                    <Link to='/sort-states'>Sort states</Link>
                  </li>
                  <li>
                    <Link to='/state-public-health-resources'>State resources</Link>
                  </li>
                </ul>
              </nav>
            </header>
          </div>

          <section columns='one'>
            <Route path='/' exact>
              <Home
                cases={ this.state.cases }
                deaths={ this.state.deaths }
                recovered={ this.state.recovered }
                pressData={ this.state.pressData }
              />
            </Route>
            {/* international */}
            <Route path='/track-by-nation' exact>
              <div id='rowForWorldResult'>
                <div className="PageLayout">
                  <Search
                    onChange={ this.onChange }
                    onSubmit={ this.Submit }
                    placeholder="Search nation"
                    value={ this.state.lookup }
                  />
                  {
                    this.state.worldLookupArray.map(item =>
                      <Nation
                        name={ item }
                        key={ item }
                      />
                    )
                  }
                </div>
              </div>
            </Route>

            {/* domestic */}
            <Route path='/track-by-states' exact>
              <div>
                <div>
                  <div className="PageLayout">
                    <Search
                      onChange={ this.DomesticOnChange }
                      onSubmit={ this.DomesticSubmit }
                      placeholder="Search state"
                      value={ this.state.domesticLookup }
                    />
                    {
                      this.state.domesticLookupArray.map(item =>
                        <USAState
                          name={ item }
                          key={ item }
                        />
                      )
                    }
                  </div>
                </div>
              </div>
            </Route>
          </section>

          <Route path='/sort-nations' exact>
            <Sort />
          </Route>

          <Route path='/sort-states' exact>
              <DomesticSort />
          </Route>

          <Route path='/state-public-health-resources' exact>
              <PublicHealth />
          </Route>
        {/* \v/\v/ parent element div */}
        </div>
      </BR>
    );
  }
} // App

const Search = (props) =>
  <form onSubmit={ props.onSubmit } className='searchDiv'>
    <div>
      <input
        type="text"
        placeholder={ props.placeholder }
        value={ props.value }
        onChange={ props.onChange }
      />
      <button type="submit" className='SubmitButton'>
        Submit
      </button>
    </div>
  </form>

class Nation extends React.Component {
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
      flag: null,
      timelineCases: [],
      timelineDeaths: [],
      timelinePercentageIncreaseInDeath: [],
    };
    this.LoadNationData = this.LoadNationData.bind(this);
    this.LoadTimeLineCases = this.LoadTimeLineCases.bind(this);
  }
  LoadNationData = () => {
    return axios
      .get(`${listData}/${this.props.name}`)
      .then(result => {
        this.setState({
          country: result.data.country,
          flag: result.data.countryInfo.flag,
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
      .get(`${requestURL}/v2/historical/${this.props.name}`)
      .then(
        result => {
          this.GraphData(result.data.timeline.cases, result.data.timeline.deaths);
        },
      );
  }
  GraphData = (cases, deaths) => {
    const arrayCases = [];
    const arrayDeaths = [];
    const arrayPercentages = [];
    let keysOfCases = Object.keys(cases);
    let keysOfDeath = Object.keys(deaths);
    for (let i = 0; i < keysOfCases.length; i++) {
      const caseObj = {
        date: keysOfCases[i],
        cases: cases[keysOfCases[i]]
      };
      arrayCases.push(caseObj);
    }
    for (let i = 1; i < keysOfDeath.length; i++) {
      const deathObj = {
        date: keysOfDeath[i],
        deaths: deaths[keysOfDeath[i]] - deaths[keysOfDeath[i-1]],
      };
      arrayDeaths.push(deathObj);
    }
    for (let i = 0; i < keysOfDeath.length; i++) {
      let standardizedPercentage;
      const percentageIncrease = deaths[keysOfDeath[i - 1]] === 0 && deaths[keysOfDeath[i]] === 0 ? 0
        : 100 * ( (deaths[keysOfDeath[i]] - deaths[keysOfDeath[i - 1]]) / deaths[keysOfDeath[i - 1]] ).toFixed(2);
      if (percentageIncrease === Infinity || percentageIncrease > 200) {
        standardizedPercentage = 200;
      }
      else {
        standardizedPercentage = percentageIncrease;
      }
      const deathPercentageObj = {
        date: keysOfDeath[i],
        percentage: standardizedPercentage,
      };
      arrayPercentages.push(deathPercentageObj);
    }
    this.setState({
      timelineCases: arrayCases,
      timelineDeaths: arrayDeaths,
      timelinePercentageIncreaseInDeath: arrayPercentages,
    })
  }
  componentDidMount() {
    this.LoadNationData();
    this.LoadTimeLineCases();
  }

  render() {
    const { country, cases, todayCases, deaths, todayDeaths, recovered,
      active, critical, casesPerOneMillion, timelineCases,
      timelineDeaths, timelinePercentageIncreaseInDeath, flag } = this.state;
    const deathPercentIncrease = ( (this.state.todayDeaths / (this.state.deaths - this.state.todayDeaths) ) * 100).toFixed(2);
    const casesPercentIncrease = ( (this.state.todayCases / (this.state.cases - this.state.todayCases) ) * 100).toFixed(2);
    const deathRecoveryRatio = ( 100 * ( deaths / ( deaths + recovered ) ) ).toFixed(2);
    return (
      <div>
        <section style={{ marginTop: 1 }} >
          <div height={{ maxHeight: 20 }}>
            <div className='ResponsiveText FlagAndCountry' style={{ paddingLeft: 0 }}>
              <img src={ flag } alt={ flag } /><p id='NameOfNation'>{ country }</p>
            </div>
          </div>
          <div style={{ display:'flex' }}
          >
            <div className='ResponsiveText' style={{ width: '50%' }}>
              <p>Deaths: { deaths }</p>
              <p>Deaths today: { todayDeaths }</p>
              <p>Daily increase in death: <strong>{ deathPercentIncrease }%</strong></p>
              <p>Recoveries: { recovered }</p>
              <p>Deaths per resolved cases: { deathRecoveryRatio }%</p>
            </div>
            <div className='ResponsiveText' style={{ width: '50%' }}>
              <p>Cases: { cases }</p>
              <p>Cases today: { todayCases }</p>
              <p>Daily increase in cases: <strong>{ casesPercentIncrease }%</strong></p>
              <p>{ active } active cases, { critical } of which are critical</p>
              <p>Cases per million: { casesPerOneMillion }</p>
            </div>
          </div>
        </section>
        
        <Chart 
          dataSet1={ timelinePercentageIncreaseInDeath }
          dataSet2={ timelineDeaths }
          dataSet3={ timelineCases }
          dataKey1='percentage'
          dataKey2='deaths'
          dataKey3='cases'
          chart2Name='Daily deaths'
          chart3Name='Cases'
          dataMaxForChart1={ 2.00 }
          XAxisLabelForChart1='Percent increase in deaths'
        />
      </div>
    );
  };
} // Nation

class USAState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: null,
      cases: null,
      todayCases: null,
      testedNegative: null,
      pendingCases: null,
      hospitalized: null,
      deaths: null,
      todayDeaths: null,
      dateChecked: null,
      readableDateChecked: null,
      totalTested: null,
      allData: null,
      percentageIncreaseInCases: [],
    };
    this.LoadStateData = this.LoadStateData.bind(this);
  }
  LoadStateData = () => {
    const stateNameAndAbbr = ConvertStateNameAndID(this.props.name);
    const lowerCaseAbbr = stateNameAndAbbr[0].toLowerCase(); 
    const stateName = stateNameAndAbbr[1]; 
    return axios
      .get(`${domesticURL}/${lowerCaseAbbr}${latestFromDomesticState}`)
      .then(result => {
        const recentData = result.data[0];
        this.setState({
          state: stateName,
          cases: recentData.positive,
          todayCases: recentData.positiveIncrease,
          testedNegative: recentData.negative,
          pendingCases: recentData.pending,
          hospitalized: recentData.hospitalizedCurrently,
          deaths: recentData.death,
          todayDeaths: recentData.deathIncrease,
          totalTested: recentData.total,
          readableDateChecked: recentData.lastUpdateEt,
          allData: result.data.reverse(),
        });
        this.MakeTimeline(this.state.allData);
        console.log('tracked state data: '+this.state); 
      })
  }
  MakeTimeline = (data) => {
    const percentageArrayGoingToLoop = [];
    let standardizedPercentage;
    for (let i = 1; i < data.length; i++) {
      const percentIncrease = data[i - 1].positive === 0 && data[i].positive === 0 ? 0
        : 100 * ((data[i].positive - data[i - 1].positive) / data[i - 1].positive).toFixed(2);
      if (percentIncrease === Infinity || percentIncrease > 200) {
        standardizedPercentage = 200;
      }
      else {
        standardizedPercentage = percentIncrease;
      }
      const readableDate = data[i].lastUpdateEt;
      const casesPercentageObj = {
        date: readableDate,
        percentIncreaseProp: standardizedPercentage,
      };
      percentageArrayGoingToLoop.push(casesPercentageObj);
    }
    this.setState({
      percentageIncreaseInCases: percentageArrayGoingToLoop,
    })
  }
  componentDidMount() {
    this.LoadStateData();
  }

  render() {
    const { state, cases, todayCases, deaths, todayDeaths, pendingCases, hospitalized,
      totalTested, readableDateChecked, allData, percentageIncreaseInCases } = this.state;
    const deathPercentIncrease = (100 * (todayDeaths / (deaths - todayDeaths))).toFixed(2);
    const casesPercentIncrease = (100 * (todayCases / (cases - todayCases))).toFixed(2);
    return (
      <div>
        <section style={{ marginTop: 5 }}>
          <div>
            <div className='ResponsiveText USAStateText'>
              <p>
                In { state }, as of { readableDateChecked } there have been <strong>{ cases }</strong> confirmed cases out of { totalTested } tests
              </p>
              <p>
                Cases today: { todayCases }
              </p>
              <p>
                Daily increase in cases: <strong>{ casesPercentIncrease }%</strong>
              </p>
              {
                pendingCases ?
                  <p>{ pendingCases } tests are pending</p>
                  : null
              }
              {
                hospitalized ?
                  <p>{ hospitalized } are hospitalized</p>
                  : null
              }
              <p>
                Deaths: { deaths }
              </p>
              <p>
                Deaths today: { todayDeaths } 
              </p>
              <p>
                Daily increase in deaths: <strong>{ deathPercentIncrease }%</strong>
              </p>
            </div>
          </div>
        </section>

        <Chart 
          dataSet1={ percentageIncreaseInCases }
          dataSet2={ allData }
          dataSet3={ allData }
          dataKey1='percentIncreaseProp'
          dataKey2='positiveIncrease'
          dataKey3='death'
          chart2Name='Daily cases'
          chart3Name='Deaths'
          dataMaxForChart1={ 0.75 }
          XAxisLabelForChart1='Percent increase in cases'
        />
      </div>
    );
  };
} // USAState

class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      value: '',
      sortedData: [],
      dataKey: '',
      colorOfBar: '#ffffff',
    };
    this.Change = this.Change.bind(this);
    this.Submit = this.Submit.bind(this);
    this.LoadSortData = this.LoadSortData.bind(this);
  }
  Change(event) {
    this.setState({
      value: event.target.value,
      submitted: false,
    });
  }
  Submit(event) {
    event.preventDefault();
    if (this.state.value === '') {
      return;
    }
    this.setState({
      submitted: true,
    });
    this.LoadSortData(this.state.value);
  }
  LoadSortData = (value) => {
    // console.log(this.state.value);
    if (value === 'deaths' || value === 'todayDeaths' || value === 'deathsPerOneMillion') {
      this.setState({
        colorOfBar: '#d88884',
      })
    }
    if (value === 'cases' || value === 'todayCases' || value === 'recovered' || value === 'active' || value === 'critical' || value === 'casesPerOneMillion') {
      this.setState({
        colorOfBar: '#8884d8',
      })
    }
    if (value === 'recovered' || value === 'active' || value === 'critical') {
      this.setState({
        colorOfBar: '#a9bfc0',
      })
    }
    return axios
      .get(`${requestURL}/v2/countries?sort=${this.state.value}`)
      .then(result => {
        const top50Nations = [];
        for (let i = 0; i < 50; i++) {
          top50Nations.push(result.data[i]);
        }
        this.GraphSortedData(top50Nations);
      })
  }
  GraphSortedData = (data) => {
    this.setState({
      sortedData: data,
    })
  }

  render() {
    const { value, submitted, sortedData, colorOfBar } = this.state;
    return (
      <div id='parentElementSort' className='sort'>
        <form onSubmit={ this.Submit }>
          <label>Sort nations by</label>
          <select value={ this.state.value } onChange={ this.Change }>
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
          <input type='submit' value='Submit' className='SubmitButton' />
        </form>
        {
          submitted &&
          <ResponsiveContainer width='80%' height={1500}>
            <BarChart layout='vertical' data={ sortedData } className='ChartFont'>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type='number' domain={[0, 'dataMax']} orientation='top' />
              <YAxis dataKey="country" type='category' />
              <Tooltip />
              <Bar dataKey={ value } fill={ colorOfBar } />
            </BarChart>
          </ResponsiveContainer>
        }
      </div>
    );
  }
} // Sort

class DomesticSort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      value: '',
      sortedData: [],
      dataKey: '',
      colorOfBar: '#ffffff',
    };
    this.Change = this.Change.bind(this);
    this.Submit = this.Submit.bind(this);
    this.LoadSortData = this.LoadSortData.bind(this);
  }
  Change(event) {
    this.setState({
      value: event.target.value,
      submitted: false,
    });
  }
  Submit(event) {
    event.preventDefault();
    if (this.state.value === '') {
      return;
    }
    this.setState({
      submitted: true,
    });
    this.LoadSortData(this.state.value);
  }
  LoadSortData = (value) => {
    if (value === 'deaths' || value === 'todayDeaths') {
      this.setState({
        colorOfBar: '#d88884',
      })
    }
    if (value === 'cases' || value === 'todayCases' || value === 'active') {
      this.setState({
        colorOfBar: '#8884d8',
      })
    }
    return axios
      .get(`${requestURL}/v2/states`)
      .then(result => {
        const sortedStates = result.data.sort(this.SortStates(value));
        this.GraphSortedData(sortedStates);
      })
  }
  SortStates = (prop) => {
    return function (a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      }
      else if (a[prop] > b[prop]) {
        return -1;
      }
      return 0;
    }
  }
  GraphSortedData = (data) => {
    this.setState({
      sortedData: data,
    })
  }

  render() {
    const { value, submitted, sortedData, colorOfBar } = this.state;
    return (
      <div id='parentElementSort' className='sort'>
        <form onSubmit={ this.Submit }>
          <label>Sort states by</label>
          <select value={ this.state.value } onChange={ this.Change }>
            <option value=""></option>
            <option value="cases">cases</option>
            <option value="todayCases">cases today</option>
            <option value="deaths">deaths</option>
            <option value="todayDeaths">deaths today</option>
            <option value="active">active cases</option>
          </select>
          <input type='submit' value='Submit' className='SubmitButton' />
        </form>
        {
          submitted &&
          <ResponsiveContainer width='80%' height={2000}>
            <BarChart layout='vertical' data={ sortedData } className='ChartFont'>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type='number' domain={[0, 'dataMax']} orientation='top' />
              <YAxis dataKey="state" type='category' />
              <Tooltip />
              <Bar dataKey={ value } fill={ colorOfBar } />
            </BarChart>
          </ResponsiveContainer>
        }
      </div>
    );
  }
} // DomesticSort

class PublicHealth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicHealthArray: [],
    }
    this.LoadPublicHealthInfo = this.LoadPublicHealthInfo.bind(this);
  }
  LoadPublicHealthInfo = () => {
    return axios
      .get(`${publicHealth}`)
      .then(result => {
        this.setState({
          publicHealthArray: result.data,
        })
      });
  }
  componentDidMount() {
    this.LoadPublicHealthInfo(); 
  }
  render() {
    return (
      <div className='Table'>
      <div className='TableRow ColumnHeaders TablePadding TableRowFontSize'>
        <span style={{ width: '20%' }}>
            {/* State */}
        </span>
        <span style={{ width: '30%' }}>
            Resource
        </span>
        <span style={{ width: '25%' }}>
            Secondary resource
        </span>        
        <span style={{ width: '25%' }}>
            Social Media
        </span>          
      </div>
      {
        this.state.publicHealthArray.map(item =>
          <div key={ item.state } className='TableRowFontSize TableRow TableRowColors TablePadding TableBorder'>
            <span style={{ width: '20%', borderRight: '1px dashed #1db954', paddingLeft: 5 }}>
              { ConvertStateNameAndID(item.state)[1] }
            </span>
            <span style={{ width: '30%', borderRight: '1px dashed #1db954' }}>
              <a href={ item.covid19Site } target='_blank' rel='noopener noreferrer'>{ item.covid19Site.slice(8) }</a>
            </span>
            <span style={{ width: '25%', borderRight: '1px dashed #1db954' }}>
              {
                (item.covid19SiteSecondary!==item.covid19Site && (item.covid19SiteSecondary)) && 
                  <a href={ item.covid19SiteSecondary } target='_blank' rel='noopener noreferrer'>
                    { item.covid19SiteSecondary.slice(8) }
                  </a>
              }
            </span>        
            <span style={{ width: '25%'}}>
              <a href={ (item.twitter) && 'https://twitter.com/' + item.twitter.slice(1) } target='_blank' rel='noopener noreferrer'>
                { (item.twitter) && item.twitter }
              </a>
            </span>                   
          </div>
        )
      }
      </div>
    );
  }
}  // PublicHealth

const Home = (props) =>
  <div>
  {/*|^|^| parent div */}
    <div>
      <div>
        <div className='CenteredPageContent HomePageFontSize'>
          <p>Worldwide there have been { props.cases.toLocaleString("en-US") } cases, { props.deaths.toLocaleString("en-US") } deaths, and { props.recovered.toLocaleString("en-US") } recoveries from COVID-19.</p>
          <p>Use the links above to see how the virus is affecting different states and nations, and access state-level public health information.</p>
        </div>
      </div>
    </div>
    <div>
      <div>
        <div className='CenteredNewsContent'>
          <h3>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            In the news
          </h3>
          <News
            listOfArticles={ props.pressData }
          />
        </div>
      </div>
    </div>
  {/*\v/\v/ parent div  */} 
  </div>

const News = (props) =>
  props.listOfArticles.map(item =>
    <div key={ item._id }>
      <ul className='NewsFontSize'>
        <p>&#8226;{ item.publication }: <a href={ item.url } target="_blank" rel='noopener noreferrer'>{ item.title }</a></p>
      </ul>
    </div>
  )

const Chart = (props) =>
  <div>
    <div className='parentDivForCharts'>
      <div className='ChartPosition flexboxForCharts' style={{ marginRight: 50 }}>
        <LineChart width={300} height={300} className='ChartFont' data={ props.dataSet1 }>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type='category' />
          <YAxis type="number" domain={[0, dataMax => (dataMax * props.dataMaxForChart1 )]} />
          <Tooltip />
          <Legend />
          <Line dataKey={ props.dataKey1 } name={ props.XAxisLabelForChart1 } stroke="#8884d8" />
        </LineChart>
      </div>
      <div className='ChartPosition flexboxForCharts' style={{ marginRight: 50 }}>
        <BarChart data={ props.dataSet2 } width={300} height={300} className='ChartFont'>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type='category'/>
          <YAxis type="number" domain={[0, dataMax => (dataMax * 1.25)]} />
          <Tooltip />
          <Legend />
          <Bar dataKey={ props.dataKey2 } name={ props.chart2Name } stroke="#91A5A6"/>
        </BarChart>
      </div>      
      <div className='ChartPosition flexboxForCharts' style={{ marginRight: 50 }}>
        <LineChart width={300} height={300} className='ChartFont' data={ props.dataSet3 }>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type='category' />
          <YAxis type="number" domain={[0, dataMax => (dataMax * 1.25)]} />
          <Tooltip />
          <Legend />
          <Line dataKey={ props.dataKey3 } name={ props.chart3Name } stroke="#8884d8" />
        </LineChart>
      </div>
    </div>  
    <hr style={{ margin: "3em 1em", borderTop: '2px solid #dbcccd', borderBottom: '2px solid #8884d8' }} />
  </div>

export default App;
