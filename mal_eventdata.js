var fs = require('fs');
var faker=require('faker');

var dateformat=require('dateformat');
var request=require('superagent');
var jf=require('jsonfile');
var moment=require('moment');



var programUID='AYrwyf6tttg';
var programStageUID='';
var personPerOrgUnit=50;
var folderpath=__dirname;
//global.gc();
var OU4=JSON.parse(fs.readFileSync(folderpath + '/tland_mapl4.json'));
var eUid=JSON.parse(fs.readFileSync(folderpath + '/temp_data/euidfile1.json'));
var j=1;

/////
function rPointPOU(ouuid) {
  var turf = require('turf');
  //var randomPointsOnPolygon = require('random-points-on-polygon');
  var rPoint;
  rPoint=null;
  var i=0;
  var OU3 = JSON.parse(fs.readFileSync(folderpath + '/tland_mapl3.json'));
  for( i = 0; i < OU3.features.length; i++ ) {
    if( OU3.features[i].id == ouuid ) {
     // var rPoint = randomPointsOnPolygon(1, OU3.features[ i ])[0];
      rPoint = require('random-points-on-polygon')(1, OU3.features[i])[0];
      return rPoint;
      OU3=null;
      break;
    }
  }
}

function dValue(eDate){
  var chance = require('chance')();
  var dataValues = [];
  var age= chance.integer({min:1,max:80});
  var gender=chance.pickone(['Male','Female']);
  if (gender=='Female' && age >18 && age <49){
    var pregnant=chance.pickone(['Yes','No']);
  }
  var dataElement = {"dataElement" : "sHGso4ALMBu", "value" : JSON.stringify(age)};//AGe
  dataValues.push(dataElement);

  var dataElement = {"dataElement" : "THeZ4H9Hgm4", "value" : chance.address()};//Address
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "JJV05ZGPtWT", "value" : chance.pickone(['Simple','Severe'])};//Condition of patient (Simple/Severe)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "eLxMl3luykO", "value" : chance.pickone(['RDT','Mikroskop','Both'])};//Confirmation Method (RDT/Mikroskop/Both)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "TyRGGkPqrOE", "value" : moment(eDate).subtract(chance.integer({min:1,max:5}),'days').format("YYYY-MM-DD")};//Symptom start date
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "sf5qV1Q1C7v", "value" : eDate}; //date of treatement
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "GditJVYnYq5", "value" : eDate};//date of visit
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "dkzqUKpAsNj", "value" : gender};//Gender(Male/Female
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "pWk7LRZjDVb", "value" : pregnant}; // is Pregnant (Yes/No)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "u2Yachho0vO", "value" : JSON.stringify(chance.integer({min:1,max:11}))}; // Type of medicine ( 1 to 11)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "UIAJ95YQv7T", "value" : chance.pickone(['PCD','ACD','SK','FUP','SM','Kader','MBS','MFS'])};//Mode of detection (PCD/ACD/SK/FUP/SM/Kader/MBS/MFS)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "nzWNZ7prKl9", "value" : chance.pickone(['Pf','Pv','Pm','Po','Pk','Mix'])};//Malaria Species (Pf/Pv/Pm/Po/Pk/Mix)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "T3eBjntQTeE", "value" : JSON.stringify(chance.integer({min:3,max:20}))};//Mal Tablet A no
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "PRqT17qeGsG", "value" : JSON.stringify(chance.integer({min:2,max:10}))};//Mal Tablet b no
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "DlXIYC5zhrJ", "value" : chance.pickone(['Fisherman','Farmer','Miner','HouseWife','Employee','Army','Police','Forest Worker','Un Employed'])};//Occupation (Fisherman/Farmer/Miner/HouseWife/Employee/Army/Police/Forest Worker/Un Employed)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "PXHKqBq3UZl", "value" : JSON.stringify(chance.integer({min:1,max:4}))};//Patient Coming from 1 to 4
  dataValues.push(dataElement);

  var dataElement = {"dataElement" : "kNM9cmIqoHY", "value" : chance.pickone(['Pos','Neg'])}; // Pat follow up 4day (Pos/Neg)
  dataValues.push(dataElement);

  var dataElement = {"dataElement" : "MlPEdlRVIBj", "value" : dateformat(faker.date.between("2014-06-01","2015-06-24"),"yyyy-mm-dd")};// previsou Positive date
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "s7V5liocTiB", "value" : JSON.stringify(chance.integer({min:1,max:5}))};// Referred From (1 to 5)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "oMJWG1xK1Ez", "value" : JSON.stringify(chance.integer({min:1,max:2}))};// Referred To (1/2)
  dataValues.push(dataElement);
  var dataElement = {"dataElement" : "NLqaonoFwvv", "value" : chance.pickone(['RJ','RI'])};// servicetypeopd_ipd (RJ/RI)
  dataValues.push(dataElement);

  var dataElement = {"dataElement" : "Kt0zW60oyZO", "value" : chance.pickone(['Recovered','Drop out','Failed due to medication','Dead','Follow up'])};// Treatment Outcome (Recovered/Drop out/Failed due to medication/Dead/Follow up
  dataValues.push(dataElement);
  return dataValues;
  chance=null;
}



var malevent={events:[]};

OU4.features.forEach(function(features){
var k=0;
  for (k=0;k<personPerOrgUnit;k++){
    var eventData={};
    eventData.program=programUID;
    eventData.orgUnit=features.id;
    eventData.eventDate=dateformat(faker.date.between("2015-06-01","2016-06-24"),"yyyy-mm-dd");
    eventData.status="ACTIVE";
    eventData.storedBy="johnlew";
    eventData.event=eUid.codes[j];
    j=j+1;
    var coordinate = {};
    var cc=rPointPOU(features.properties.parent);
    coordinate.latitude=cc.geometry.coordinates[1];
    coordinate.longitude=cc.geometry.coordinates[0];

    eventData.dataValues=dValue(eventData.eventDate);
    eventData.coordinate=coordinate;
    malevent.events.push(eventData);
  }
  jf.writeFile(folderpath + '/temp_data/Mal_data2.json',malevent);
});
