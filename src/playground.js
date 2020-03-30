const arr=[];
arr.concat("a");
arr.concat("b"); 
arr.map(
  item => {
  item+"hi";
});

console.log(arr); 

// const domesticRequestURL = 'https://covidtracking.com/api/';
// const latestFromState = '/states/daily?state=';
// const stateAbbreviation = "";
// // maybe map/filter
// const constantArray = [cases, testedNegative, pendingCases, hospitalized, 
//   deaths, totalTested, dateChecked ];
// const checkIfNull = (constant) => {
//   if (constant===null)
//   this.setState({
//     constant:"missing information",
//   })
// };
// constantArray.forEach(element => {
//   checkIfNull(element);       
// });

// const cases = {
//   "1/22/20": 0, "1/23/20": 0, "1/24/20": 0,
//   "1/25/20": 0, "1/26/20": 0, "1/27/20": 0, "1/28/20": 0,
//   "1/29/20": 0, "1/30/20": 0, "1/31/20": 0, "2/1/20": 1,
//   "2/2/20": 1, "2/3/20": 1, "2/4/20": 1, "2/5/20": 1, "2/6/20": 1,
//   "2/7/20": 1, "2/8/20": 1, "2/9/20": 2, "2/10/20": 2, "2/11/20": 2,
//   "2/12/20": 2, "2/13/20": 2, "2/14/20": 2, "2/15/20": 2, "2/16/20": 2, "2/17/20": 2, "2/18/20": 2,
//   "2/19/20": 2, "2/20/20": 2, "2/21/20": 2, "2/22/20": 2, "2/23/20": 2, "2/24/20": 2, "2/25/20": 6,
//   "2/26/20": 13, "2/27/20": 15, "2/28/20": 32, "2/29/20": 45, "3/1/20": 84, "3/2/20": 120, "3/3/20": 165,
//   "3/4/20": 222, "3/5/20": 259, "3/6/20": 400, "3/7/20": 500, "3/8/20": 673, "3/9/20": 1073, "3/10/20": 1695,
//   "3/11/20": 2277, "3/12/20": 2277, "3/13/20": 5232, "3/14/20": 6391, "3/15/20": 7798, "3/16/20": 9942,
//   "3/17/20": 11748, "3/18/20": 13910, "3/19/20": 17963, "3/20/20": 20410, "3/21/20": 25374, "3/22/20": 28768,
//   "3/23/20": 35136, "3/24/20": 39885, "3/25/20": 49515, "3/26/20": 57786, "3/27/20": 65719, "3/28/20": 73235
// };

// const data = [];

// let keys = Object.keys(cases);

// for (let i = 0; i < keys.length; i++) {812,"recovered":14620,"active":75528,"critical":398
//   var obj = new Object();
//   obj.date = keys[i];
//   obj.cases = cases[keys[i]];
//   data.push(obj);
// }

// console.log(data);

// const data = [
//   {date: '', cases: ''},

// ]

// for (let [key,value] of Object.entries(cases)) {
//   var obj = new Object();
//   obj.date=key;
//   obj.cases=value; 
//   data.push(obj); 
// }

// https://stackoverflow.com/questions/14379274/how-to-iterate-over-a-javascript-object


    // const displayCases=dataCases; 

//     const longarray=
// [
//   { date: '1/22/20', cases: 0 },
//   { date: '1/23/20', cases: 0 },
//   { date: '1/24/20', cases: 0 },
//   { date: '1/25/20', cases: 0 },
//   { date: '1/26/20', cases: 0 },
//   { date: '1/27/20', cases: 0 },
//   { date: '1/28/20', cases: 0 },
//   { date: '1/29/20', cases: 0 },
//   { date: '1/30/20', cases: 0 },
//   { date: '1/31/20', cases: 0 },
//   { date: '2/1/20', cases: 1 },
//   { date: '2/2/20', cases: 1 },
//   { date: '2/3/20', cases: 1 },
//   { date: '2/4/20', cases: 1 },
//   { date: '2/5/20', cases: 1 },
//   { date: '2/6/20', cases: 1 },
//   { date: '2/7/20', cases: 1 },
//   { date: '2/8/20', cases: 1 },
//   { date: '2/9/20', cases: 2 },
//   { date: '2/10/20', cases: 2 },
//   { date: '2/11/20', cases: 2 },
//   { date: '2/12/20', cases: 2 },
//   { date: '2/13/20', cases: 2 },
//   { date: '2/14/20', cases: 2 },
//   { date: '2/15/20', cases: 2 },
//   { date: '2/16/20', cases: 2 },
//   { date: '2/17/20', cases: 2 },
//   { date: '2/18/20', cases: 2 },
//   { date: '2/19/20', cases: 2 },
//   { date: '2/20/20', cases: 2 },
//   { date: '2/21/20', cases: 2 },
//   { date: '2/22/20', cases: 2 },
//   { date: '2/23/20', cases: 2 },
//   { date: '2/24/20', cases: 2 },
//   { date: '2/25/20', cases: 6 },
//   { date: '2/26/20', cases: 13 },
//   { date: '2/27/20', cases: 15 },
//   { date: '2/28/20', cases: 32 },
//   { date: '2/29/20', cases: 45 },
//   { date: '3/1/20', cases: 84 },
//   { date: '3/2/20', cases: 120 },
//   { date: '3/3/20', cases: 165 },
//   { date: '3/4/20', cases: 222 },
//   { date: '3/5/20', cases: 259 },
//   { date: '3/6/20', cases: 400 },
//   { date: '3/7/20', cases: 500 },
//   { date: '3/8/20', cases: 673 },
//   { date: '3/9/20', cases: 1073 },
//   { date: '3/10/20', cases: 1695 },
//   { date: '3/11/20', cases: 2277 },
//   { date: '3/12/20', cases: 2277 },
//   { date: '3/13/20', cases: 5232 },
//   { date: '3/14/20', cases: 6391 },
//   { date: '3/15/20', cases: 7798 },
//   { date: '3/16/20', cases: 9942 },
//   { date: '3/17/20', cases: 11748 },
//   { date: '3/18/20', cases: 13910 },
//   { date: '3/19/20', cases: 17963 },
//   { date: '3/20/20', cases: 20410 },
//   { date: '3/21/20', cases: 25374 },
//   { date: '3/22/20', cases: 28768 },
//   { date: '3/23/20', cases: 35136 },
//   { date: '3/24/20', cases: 39885 },
//   { date: '3/25/20', cases: 49515 },
//   { date: '3/26/20', cases: 57786 },
//   { date: '3/27/20', cases: 65719 },
//   { date: '3/28/20', cases: 73235 }
// ];