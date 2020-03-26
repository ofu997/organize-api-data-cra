const domesticRequestURL = 'https://covidtracking.com/api/';
const latestFromState = '/states/daily?state=';
const stateAbbreviation = "";
// maybe map/filter
const constantArray = [cases, testedNegative, pendingCases, hospitalized, 
  deaths, totalTested, dateChecked ];
const checkIfNull = (constant) => {
  if (constant===null)
  this.setState({
    constant:"missing information",
  })
};
constantArray.forEach(element => {
  checkIfNull(element);       
});