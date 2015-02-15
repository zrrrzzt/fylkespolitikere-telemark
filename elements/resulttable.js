'use strict';

var React = require('react');
var resolveIndex = require('../utils/resolveindex');

var ResultRow = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.result.name}</td>
        <td>{this.props.result.id}</td>
      </tr>
    );
  }
});

var ResultTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.results.forEach(function(result) {
      rows.push(<ResultRow result={resolveIndex(result.ref)} key={result.ref} />);
    }.bind(this));
    return (
      <table className="u-full-width">
        <thead>
          <tr>
            <th>Name</th>
            <th>Id</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

module.exports = ResultTable;