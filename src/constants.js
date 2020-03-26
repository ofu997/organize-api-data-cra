const requestURL = 'https://corona.lmao.ninja';
const summary = '/all';
const listData = 'https://corona.lmao.ninja/countries'

const domesticURL = 'https://covidtracking.com/api/states';
const latestFromDomesticState = '/daily?state=';
const domesticStateAbbreviation = "";

const setStateOfResponseFromAxios=
'https://stackoverflow.com/questions/41194866/how-to-set-state-of-response-from-axios-in-react/41196643#41196643';

const GetAbbreviation = userInput => {
  const input=userInput.toLowerCase(); 
  switch(input) {
    default:
      return userInput; 
    case "alaska":
      return "AK";
    case "alabama":
      return "AL";
    case "arkansas":
      return "AR";
    case "arizona":
      return "AZ";
    case "california":
      return "CA" ;
    case "colorado":          
      return "CO";
    case "connecticut":
      return "CT";
    case "dc":
      return "DC";
    case "delaware":
      return "DE";
    case "florida":
      return "FL";
    case "georgia":
      return "GA";
    case "hawaii":
      return "HI";
    case "iowa":
      return "IA";
    case "idaho":
      return "ID";
    case "illinois":
      return "IL";
    case "indiana":
      return "IN";
    case "kansas":
      return "KS";
    case "kentucky":
      return "KY";
    case "louisiana":
      return "LA";
    case "massachusetts":
      return "MA";
    case "maryland":
      return "MD";
    case "maine":
      return "ME";
    case "michigan":
      return "MI";
    case "minnesota":
      return "MN";
    case "missouri":
      return "MO";
    case "mississippi":
      return "MS";
    case "montana":
      return "MT";
    case "north carolina":
      return "NC";
    case "north dakota":
      return "ND";
    case "nebraska":
      return "NE";
    case "new hampshire":
      return "NH";
    case "new jersey":
      return "NJ";
    case "new mexico":
      return "NM";
    case "nevada":
      return "NV";
    case "new york":
      return "NY";
    case "ohio":
      return "OH";
    case "oklahoma":
      return "OK";
    case "oregon":
      return "OR";
    case "pennsylvania":
      return "PA";
    case "rhode island":
      return "RI";
    case "south carolina":
      return "SC";
    case "south dakota":
      return "SD";
    case "tennessee":
      return "TN";
    case "texas":
      return "TX";
    case "utah":
      return "UT";
    case "virginia":
      return "VA";
    case "vermont":
      return "VT";
    case "washington":
      return "WA";
    case "wisconsin":
      return "WI";
    case "west virginia":
      return "WV";
    case "wyoming":
      return "WY";
    case "puerto rico":
      return "PR";
    case "american samoa":
      return "AS";
    case "guam":
      return "GU";
    case "northern mariana islands":
      return "MP";
    case "virgin islands":
      return "VI";
  }  
}

export { requestURL , summary, listData, 
  domesticURL, latestFromDomesticState, domesticStateAbbreviation, GetAbbreviation,
};