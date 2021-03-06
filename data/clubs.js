var _test =[
  {
    nome: "flamengo",
    hst: [0, 0.5, 1, 1]
  },
  {
    nome: "barcelona",
    hst: [0, 0, 0.5, 1]
  },
  {
    nome: "santos FC",
    hst: [1, 1, 1, 0]
  }
]; 

function _distinctCodes(){
  var codes = [];
  _clubs.clubs.map(function(club) {
    codes.push(club.code);
  })
  return codes;
}
function _nameByCode(){
  var codes = [];
  _clubs.clubs.map(function(club) {
    codes.push(club.code);
  })
  return codes;
}

var _clubs = {
  "name": "Bundesliga 2019/20",
  "clubs": [
    {
      "key": "dortmund",
      "name": "Borussia Dortmund",
      "code": "BVB"
    },
    {
      "key": "bremen",
      "name": "Werder Bremen",
      "code": "BRE"
    },
    {
      "key": "mgladbach",
      "name": "Bor. Mönchengladbach",
      "code": "BMG"
    },
    {
      "key": "hoffenheim",
      "name": "TSG 1899 Hoffenheim",
      "code": "HOF"
    },
    {
      "key": "freiburg",
      "name": "SC Freiburg",
      "code": "SCF"
    },
    {
      "key": "mainz",
      "name": "1. FSV Mainz 05",
      "code": "M05"
    },
    {
      "key": "augsburg",
      "name": "FC Augsburg",
      "code": "FCA"
    },
    {
      "key": "duesseldorf",
      "name": "Fortuna Düsseldorf",
      "code": "F95"
    },
    {
      "key": "bayern",
      "name": "Bayern München",
      "code": "FCB"
    },
    {
      "key": "frankfurt",
      "name": "Eintracht Frankfurt",
      "code": "FFM"
    },
    {
      "key": "leverkusen",
      "name": "Bayer 04 Leverkusen",
      "code": "B04"
    },
    {
      "key": "wolfsburg",
      "name": "VfL Wolfsburg",
      "code": "WOB"
    },
    {
      "key": "schalke",
      "name": "FC Schalke 04",
      "code": "S04"
    },
    {
      "key": "koeln",
      "name": "1. FC Köln",
      "code": "KOE"
    },
    {
      "key": "herthabsc",
      "name": "Hertha BSC",
      "code": "BSC"
    },
    {
      "key": "paderborn",
      "name": "SC Paderborn 07",
      "code": "SCP"
    },
    {
      "key": "unionberlin",
      "name": "1. FC Union Berlin",
      "code": "FCU"
    },
    {
      "key": "leipzig",
      "name": "RB Leipzig",
      "code": "RBL"
    }
  ]
}