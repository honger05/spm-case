
var Backbone = require('backbone');
var Mn = Backbone.Marionette;

var RootLayout = require('./layout').RootLayout;

var TodoApp = Mn.Application.extend({
  setRootLayout: function() {
    this.root = new RootLayout();
  }
})

App = new TodoApp();

App.on('before:start', function() {
  App.setRootLayout();
})


App.on('start', function() {
  console.log('app is start!');
})

App.start();
