'use strict';

var http = require('http');
var React = require('react');
var lunr = require('lunr');
var SearchBar  = require('./elements/searchbar');
var ResultTable  = require('./elements/resulttable');
var indexDump = require('./data/index.json');
var idx = lunr.Index.load(indexDump);


var App = React.createClass({
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
      <div className="container">
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

React.render(<App idx={idx} />, document.body);
