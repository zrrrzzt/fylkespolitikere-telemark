'use strict';

var data = require('../data/data.json');

function resolveIndex(id) {
  var splitted = id.split('_');
  return data[splitted[0]][splitted[1]];
}

module.exports = resolveIndex;