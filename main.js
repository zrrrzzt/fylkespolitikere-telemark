'use strict';

var React = require('react');
var SearchBar  = require('./elements/searchbar');

var App = React.createClass({
  getInitialState: function() {
    return {
      searchText: ''
    };
  },
  handleUserInput: function(searchText) {
    this.setState({
      searchText: searchText
    });
  },
  render: function() {
    return (
      <div>
        <SearchBar
          searchText={this.state.searchText}
        />
      </div>
    );
  }
});



React.render(
<App />,
  document.body
);
