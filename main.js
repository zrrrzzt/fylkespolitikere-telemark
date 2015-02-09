'use strict';

var http = require('http');
var React = require('react');
var lunr = require('lunr');
var SearchBar  = require('./elements/searchbar');
var resolveIndex = require('./utils/resolveindex');
var indexDump = require('./data/index.json');
var idx = lunr.Index.load(indexDump);

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
      <table>
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

var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      searchText: '',
      results: []
    };
  },

  handleUserInput: function(searchText) {
    this.setState({
      searchText: searchText,
      results: this.props.idx.search(searchText)
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          searchText={this.state.searchText}
          onUserInput={this.handleUserInput}
        />
        <ResultTable
          results={this.state.results}
        />
      </div>
    );
  }
});

React.render(<FilterableProductTable idx={idx} />, document.body);
