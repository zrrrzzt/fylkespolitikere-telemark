'use strict';

var fs = require('fs');
var http = require('http');
var lunr = require('lunr');
var idx = lunr(function () {
  this.ref('id');
  this.field('name');
  this.field('content');
});
var data = {};
var jobsCounter = 0;

function writeData(options){
  fs.writeFile('data/' + options.fileName, options.data, function(err){
    if (err) {
      console.error(err);
    } else {
      console.log('File ' + options.fileName + ' written.');
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
    writeData({data:JSON.stringify(data), fileName:'data.json'});
    writeData({data:JSON.stringify(idx), fileName:'index.json'});
  }
}

function getPolitikere() {
  var politikere = [];

  getData('http://ws.t-fk.no/?resource=politicians&search=all&format=json', function(err, result) {
    if (err) {
      console.error(err);
    } else {
      result.forEach(function(item){
        var p = {
          name: item.givenName + ' ' + item.middleName + ' ' + item.familyName,
          firstName: item.givenName,
          middleName: item.middleName,
          lastName: item.familyName,
          id: 'politiker_' + item.personId
        };
        var pIndex = {
          id: p.id,
          name: p.name,
          content: p.name
        };

        idx.add(pIndex);
        politikere.push(p);
      });

      data.politikere = politikere;
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
        };
        var pIndex = {
          id: p.id,
          name: p.name,
          content: p.name
        };

        idx.add(pIndex);
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
        var uIndex = {
          id: u.id,
          name: u.name,
          content: u.name
        };

        idx.add(uIndex);
        utvalg.push(u);
      });

      data.utvalg = utvalg;
      doWrite();
    }
  });
}

getPartier();
getUtvalg();
getPolitikere();