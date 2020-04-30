const requestURL = 'https://corona.lmao.ninja';
const summary = '/v2/all';
const listData = 'https://corona.lmao.ninja/v2/countries'

const domesticURL = 'https://covidtracking.com/api/states';
const domesticPress = 'https://mega-nap.herokuapp.com/api/ofu997/news/press';
const latestFromDomesticState = '/daily?state=';
const publicHealth = 'https://covidtracking.com/api/v1/states/info.json';

const ConvertStateNameAndID = userInput => {
  const input=userInput.toLowerCase(); 
  switch(input) {
    default:
      break; 
    case "alaska":
      return {'AK':'Alaska'};
    case 'ak':
      return {'AK':'Alaska'};
    case "al":
      return {'AL':'Alabama'};
    case "alabama":
      return {'AL':'Alabama'};
    case "ar":
      return {'AR':'Arkansas'};
    case "arkansas":
      return {'AR':'Arkansas'};
    case "az":
      return {'AZ':'Arizona'};
    case "arizona":
      return {'AZ':'Arizona'};
    case "ca":
      return {'CA':'California'};
    case "california":
      return {'CA':'California'};
    case "co":          
      return {'CO':'Colorado'};
    case "colorado":          
      return {'CO':'Colorado'};   
    case "ct":
      return {'CT':'Connecticut'};
    case "connecticut":
      return {'CT':'Connecticut'};      
    case "dc":
      return {'DC':'Washington, DC'};
    case "washington dc":
      return {'DC':'Washington, DC'};
    case "de":
      return {'DE':'Delaware'};
    case "delaware":
      return {'DE':'Delaware'};
    case "fl":
      return {'FL':'Florida'};
    case "florida":
      return {'FL':'Florida'};
    case "ga":
      return {'GA':'Georgia'};
    case "georgia":
      return {'GA':'Georgia'};   
    case "hi":
      return {'HI':'Hawaii'};
    case "hawaii":
      return {'HI':'Hawaii'};
    case "ia":
      return {'IA':'Iowa'};
    case "iowa":
      return {'IA':'Iowa'};
    case "id":
      return {'ID':'Idaho'};
    case "idaho":
      return {'ID':'Idaho'};
    case "il":
      return {'IL':'Illinois'};
    case "illinois":
      return {'IL':'Illinois'};
    case "in":
      return {'IN':'Indiana'};
    case "indiana":
      return {'IN':'Indiana'};      
    case "ks":
      return {'KS':'Kansas'};
    case "kansas":
      return {'KS':'Kansas'};      
    case "ky":
      return {'KY':'Kentucky'};
    case "kentucky":
      return {'KY':'Kentucky'};      
    case "la":
      return {'LA':'Louisiana'};
    case "louisiana":
      return {'LA':'Louisiana'};
    case "ma":
      return {'MA':'Massachusetts'}
    case "massachusetts":
      return {'MA':'Massachusetts'};      
    case "md":
      return {'MD':'Maryland'};
    case "maryland":
      return {'MD':'Maryland'};      
    case "me":
      return {'ME':'Maine'};
    case "maine":
      return {'ME':'Maine'};
    case "mi":
      return {'MI':'Michigan'};
    case "michigan":
      return {'MI':'Michigan'};
    case "mn":
      return {'MN':'Minnesota'};
    case "minnesota":
      return {'MN':'Minnesota'};      
    case "mo":
      return {'MO':'Missouri'};
    case "missouri":
      return {'MO':'Missouri'};
    case "ms":
      return {'MS':'Mississippi'};
    case "mississippi":
      return {'MS':'Mississippi'};      
    case "mt":
      return {'MT':'Montana'};
    case "montana":
      return {'MT':'Montana'};      
    case "nc":
      return {'NC':'North Carolina'};
    case "north carolina":
      return {'NC':'North Carolina'};      
    case "nd":
      return {'ND':'North Dakota'};
    case "north dakota":
      return {'ND':'North Dakota'};      
    case "ne":
      return {'NE':'Nebraska'};
    case "nebraska":
      return {'NE':'Nebraska'};
    case "nh":
      return {'NH':'New Hampshire'};
    case "new hampshire":
      return {'NH':'New Hampshire'};
    case "nj":
      return {'NJ':'New Jersey'};
    case "new jersey":
      return {'NJ':'New Jersey'};      
    case "nm":
      return {'NM':'New Mexico'};
    case "new mexico":
      return {'NM':'New Mexico'};
    case "nv":
      return {'NV':'Nevada'};
    case "nevada":
      return {'NV':'Nevada'};
    case "ny":
      return {'NY':'New York'};
    case "new york":
      return {'NY':'New York'};      
    case "oh":
      return {'OH':'Ohio'};
    case "ohio":
      return {'OH':'Ohio'};      
    case "ok":
      return {'OK':'Oklahoma'};
    case "oklahoma":
      return {'OK':'Oklahoma'};   
    case "or":
      return {'OR':'Oregon'};
    case "oregon":
      return {'OR':'Oregon'};
    case "pa":
      return {'PA':'Pennsylvania'};      
    case "pennsylvania":
      return {'PA':'Pennsylvania'};      
    case "ri":
      return {'RI':'Rhode Island'};
    case "rhode island":
      return {'RI':'Rhode Island'};      
    case "sc":
      return {'SC':'South Carolina'};
    case "south carolina":
      return {'SC':'South Carolina'};      
    case "sd":
      return {'SD':'South Dakota'};
    case "south dakota":
      return {'SD':'South Dakota'};      
    case "tn":
      return {'TN':'Tennessee'};
    case "tennessee":
      return {'TN':'Tennessee'};      
    case "tx":
      return {'TX':'Texas'};
    case "texas":
      return {'TX':'Texas'};      
    case "ut":
      return {'UT':'Utah'};
    case "utah":
      return {'UT':'Utah'};      
    case "va":
      return {'VA':'Virginia'};
    case "virginia":
      return {'VA':'Virginia'};      
    case "vt":
      return {'VT':'Vermont'};
    case "vermont":
      return {'VT':'Vermont'};      
    case "wa":
      return {'WA':'Washington'};
    case "washington":
      return {'WA':'Washington'};
    case "wi":
      return {'WI':'Wisconsin'};
    case "wisconsin":
      return {'WI':'Wisconsin'};      
    case "wv":
      return {'WV':'West Virginia'};      
    case "west virginia":
      return {'WV':'West Virginia'};      
    case "wy":
      return {'WY':'Wyoming'};
    case "wyoming":
      return {'WY':'Wyoming'};      
    case "pr":
      return {'PR':'Puerto Rico'};
    case "puerto rico":
      return {'PR':'Puerto Rico'};      
    case "as":
      return {'AS':'American Samoa'};      
    case "american samoa":
      return {'AS':'American Samoa'};      
    case "gu":
      return {'GU':'Guam'};
    case "guam":
      return {'GU':'Guam'};      
    case "mp":
      return {'MP':'Northern Mariana Islands'};
    case "northern mariana islands":
      return {'MP':'Northern Mariana Islands'};      
    case "vi":
      return {'VI':'Virgin Islands'};
    case "virgin islands":
      return {'VI':'Virgin Islands'};
  }  
};



export { requestURL , summary, listData, domesticURL, 
  latestFromDomesticState, ConvertStateNameAndID, 
  domesticPress, publicHealth };