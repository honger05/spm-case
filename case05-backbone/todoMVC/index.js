require('./index.css');

window.jQuery = require('jquery');
var Backbone = require('backbone');
var App = require('./views/app');
var Router = require('./routers/router');

new Router();

Backbone.history.start();

new App();