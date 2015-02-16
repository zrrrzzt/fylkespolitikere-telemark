'use strict';

var React = require('react');

var Menu = React.createClass({
  render: function() {
    return (
      <nav>
        <ul>
          <li><a href="#">Forsiden</a></li>
          <li><a href="#">Utvalg</a></li>
          <li><a href="#">Partier</a></li>
          <li><a href="#">Kontakt</a></li>
        </ul>
      </nav>
    );
  }
});

module.exports = Menu;