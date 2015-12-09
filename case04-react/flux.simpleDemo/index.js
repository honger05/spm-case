
var React = require('react');
var ReactDom = require('react-dom');
var MyButton = require('./component/MyButton.js');

ReactDom.render(
  <MyButton />,
  document.getElementById('container')
);
