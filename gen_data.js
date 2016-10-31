//require
var faker=require('faker');
var fs = require('fs');
var turf = require('turf');
var dateformat=require('dateformat');
var request=require('superagent');
var jf=require('jsonfile');
var moment=require('moment');
var chance = require('chance')();
var randomPointsOnPolygon = require('random-points-on-polygon');

//constant

var d2url='http://johnlew:Password1@localhost:8080/dhis/';
//var TE='wzwWT2lqYIc';
var programUID='AYrwyf6tttg';
var programStageUID='';
var personPerOrgUnit=50;
var folderpath=__dirname;
global.gc();
var OU4=JSON.parse(fs.readFileSync(folderpath + '/tland_mapl4.json'));

//var programMal=JSON.parse(fs.readFileSync(folderpath + '/datain/MalariaProgram.json'));
var eUid=JSON.parse(fs.readFileSync(folderpath + '/temp_data/euidfile1.json'));

////////////////////////////////event program///////////////

j=1;

//console.log(moment("2016-06-24","YYYY-MM-DD").subtract(2,'days'));
OU4.features.forEach(function(features){
  var malevent={events:[]};
  for (i=0;i<personPerOrgUnit;i++){
    var eventData={};
    eventData.program=programUID;
    eventData.orgUnit=features.id;
    eventData.eventDate=dateformat(faker.date.between("2015-06-01","2016-06-24"),"yyyy-mm-dd");
    eventData.status="COMPLETED";
    eventData.storedBy="johnlew";
    eventData.event=eUid.codes[j];
    j=j+1;
    var coordinate = {};
    var OU3=JSON.parse(fs.readFileSync(folderpath + '/tland_mapl3.json'));
    for (i=0;i<OU3.features.length;i++){
       if (OU3.features[i].id==features.properties.parent){

        var parentPolygon= OU3.features[i];
        var rPoint=randomPointsOnPolygon(1,parentPolygon);
        var lat=rPoint[0].geometry.coordinates[0];
        var long=rPoint[0].geometry.coordinates[1];

        //console.log(JSON.stringify(rPoint[0].geometry.coordinates[0]));
        //console.log(JSON.stringify(rPoint[0].geometry.coordinates[1]));
        break;
      }
    }
    OU3=null;

    coordinate.latitude=lat;
    coordinate.longitude=long;
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
    var dataElement = {"dataElement" : "TyRGGkPqrOE", "value" : moment(eventData.eventDate).subtract(chance.integer({min:1,max:5}),'days').format("YYYY-MM-DD")};//Symptom start date
    dataValues.push(dataElement);
    var dataElement = {"dataElement" : "sf5qV1Q1C7v", "value" : eventData.eventDate}; //date of treatement
    dataValues.push(dataElement);
    var dataElement = {"dataElement" : "GditJVYnYq5", "value" : eventData.eventDate};//date of visit
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

    eventData.dataValues=dataValues;
    eventData.coordinate=coordinate;
    malevent.events.push(eventData);
  }
  jf.writeFile(folderpath + '/temp_data/Mal_data.json',malevent);
  malevent=null;
   dataElement=null;
  eventData=null;
  age=null;
  gender=null;
  pregnant=null;
});



///////////////////////////////////////////////

/////put UID to orgunit and programstage
/*
var TEIdata={TEI_data_UID:[]};
var OU4=JSON.parse(fs.readFileSync(folderpath + '/tland_mapl4.json'));
var eUid=JSON.parse(fs.readFileSync(folderpath + '/temp_data/euidfile.json'));
j=1;
//var jOU4=JSON.parse(OU4);
OU4.features.forEach(function(features){
  for (i=0;i<personPerOrgUnit;i++){
    var TEIPOU={};
    TEIPOU.orgUnitUID=features.id;
    TEIPOU.orgUnitname=features.properties.name;

    TEIPOU.parentuid=features.properties.parent;
    TEIPOU.parentGraph=features.properties.parentGraph;
    TEIPOU.programUID=programUID;
    TEIPOU.TEUID=TE;
    TEIPOU.TEIUID=eUid.codes[j];
    TEIPOU.PSI_UID=eUid.codes[j+1];
    // console.log(eUid.codes[j]);
    j=j+2;
    TEIdata.TEI_data_UID.push(TEIPOU);
  }
  //nouid=jOU4.features.length * personPerOrgUnit * 2;
  //console.log(features.properties.name);
});
jf.writeFile(folderpath + '/temp_data/TEI_data.json',TEIdata);
*/
/////////////////////////////////////-----------------------------///////////////////////////
//// make fake person details in d2 format
/*
var D2_TEI={trackedEntityInstances:[]};

var teidata=JSON.parse(fs.readFileSync(folderpath + '/temp_data/TEI_data.json'));
teidata.TEI_data_UID.forEach(function(TEI_data_UID){
    var property={};
    property.orgUnit=TEI_data_UID.orgUnitUID;
    property.trackedEntity=TEI_data_UID.TEUID;
    property.trackedEntityInstance=TEI_data_UID.TEIUID;
    var attributes = [];
    for ( i=0; i<4; i++ )
    {
      var attribute = {"attribute" : "abcd"+i, "value" : "1234"+i};
      attributes.push(attribute);
    }
    //attributes = {"attributes": attributes };
  property.attributes= attributes;
  D2_TEI.trackedEntityInstances.push(property);
    //D2_TEI.trackedEntityInstances.push(teidata.TEI_data_UID[1].orgUnitUID);
    //D2_TEI.trackedEntityInstances.push(teidata.TEI_data_UID[1].TEUID);
    //D2_TEI.trackedEntityInstances.push(teidata.TEI_data_UID[1].TEIUID);
});

jf.writeFile(folderpath + '/temp_data/TEI_data11.json',D2_TEI);

/*
 programTrackedEntityAttributes: [
 {
 id: "DCN7Iir4sef",
 displayName: "Malaria case registration First Name"
 },
 {
 id: "Mt1QexNRv9r",
 displayName: "Malaria case registration Last name"
 },
 {
 id: "P9ZOIqIpzGr",
 displayName: "Malaria case registration Gender"
 },
 {
 id: "Yi1FTjIDI6P",
 displayName: "Malaria case registration Age"
 },
 {
 id: "nuLcOLLKEth",
 displayName: "Malaria case registration Patient Registration No."
 },
 {
 id: "i1lwrexmLK7",
 displayName: "Malaria case registration Phone number"
 }
 ],
 */


////////////////////////////////////////////////------------------------/////////////////////////////

//
//getUID(d2url,OU4.features.length * personPerOrgUnit * 2, 'euidfile');
//
//var noeUid=eUid.codes.length;

function getUID (url, no, fname) {
  var url1=url + '/api/system/id.json?limit=' + no;
  var stream=fs.createWriteStream(folderpath +'/temp_data/' + fname + '.json');
  var req=request.get(url1);
  req.pipe(stream);
  // console.log(req);
  for( var i = 0; i < request.length; i++ ) {
    var obj = request[ i ];
    
  }
}



//console.log(noeUid);



/*
//console.log(jOU4.features.length);
/*faker.locale="vi";


var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var enrollmentDate = faker.date.between("2016-01-01","2016-06-01");
var lat = faker.address.latitude();
var long = faker.address.longitude({min:-78, max:-77});
var noPoints=2;
var allPolygon=JSON.parse(fs.readFileSync(__dirname +'/vnL2.json'));


//var randomCard = faker.helpers.createCard();//
console.log(randomName,randomEmail, dateformat(enrollmentDate,"yyyy-mm-dd"), lat, long);
console.log(allPolygon.features.length);

allPolygon.features.forEach(function(feature) {
  var points = randomPointsOnPolygon(noPoints, feature);
  console.log(JSON.stringify(points));
});


 OU3.features.forEach(function(feature==OU4.features.properties.parentid) {
 var points = randomPointsOnPolygon(noPoints, feature)
 });
 if (OU3.features.id==OU4.features.properties.parentid){
 var parentPolygon= OU3.features[
 }
 var points = randomPointsOnPolygon(noPoints, feature);
 console.log(JSON.stringify(points));
 });
*/
//getUID(d2url,10,'tei');

/////////////Function

//get uid



/*
for (k=0;k<allPolygon.features.length;k++) {
  var polygon=allPolygon.features[k];
}
*/