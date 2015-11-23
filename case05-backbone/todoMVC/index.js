
/**
 * 程序入口，启动路由，启动主视图 
 */

require('./index.css');

var Backbone = require('backbone');
var app = require('./views/app');
var Router = require('./routers/router');

app = new app();

new Router();
Backbone.history.start();



