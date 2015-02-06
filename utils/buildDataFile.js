'use strict';

var fs = require('fs');
var http = require('http');
var data = {};
var jobsCounter = 0;

function writeData(data){
  fs.writeFile('data/data.json', data, function(err){
    if (err) {
      console.error(err);
    } else {
      console.log('File written');
    }
  })
}

function getData(url, callback){
  var body = '';

  http.get(url, function(res) {

    res.on('data', function(chunk){
      body += chunk.toString();
    });

    res.on('end', function(){
      var json = JSON.parse(body);
      return callback(null, json.results);
    });

  }).on('error', function(e) {
    return callback(e, null);
  })

}

function doWrite(){
  jobsCounter ++;
  if (jobsCounter === 3) {
    writeData(JSON.stringify(data));
  }
}

function getPolitikere() {
  getData('http://ws.t-fk.no/?resource=politicians&search=all&format=json', function(err, result) {
    if (err) {
      console.error(err);
    } else {
      data.politikerer = result;
      doWrite();
    }
  });
}

function getPartier() {
  var partier = [];

  getData('http://ws.t-fk.no/?resource=politicians&search=parties&string=all&format=json', function(err, result) {
    if (err) {
      console.error(err);
    } else {

      result.forEach(function(item){
        var p = {
          name: item.partyName,
          id: 'parti_' + item.partyId
        }

        partier.push(p);
      });

      data.partier = partier;
      doWrite();
    }
  });

}

function getUtvalg() {
  var utvalg = [];

  getData('http://ws.t-fk.no/?resource=politicians&search=committees&string=all&format=json', function(err, result) {
    if (err) {
      console.error(err);
    } else {
      result.forEach(function(item){
        var u = {
          name: item.committeeName,
          id: 'utvalg_' + item.committeeId
        };
        utvalg.push(u);
      });

      data.utvalg = utvalg;
      doWrite();
    }
  });
}

getPartier();
getPolitikere();
getUtvalg();