
/**
 * 中心 App 对象，挂载着一些初始化程序。
 */

var Backbone = require('backbone');
var Mn = Backbone.Marionette;

var RootLayout = require('./layout').RootLayout;
var Controller = require('./router').Controller;
var Router = require('./router').Router;

// 定义一个状态类
require('./filterState');

// 将 root 布局挂载到 App 上。
var TodoApp = Mn.Application.extend({
  setRootLayout: function() {
    this.root = new RootLayout();
  }
})

App = new TodoApp();

App.on('before:start', function() {
  App.setRootLayout();
})

// 启动控制器
App.on('start', function() {

  var controller = new Controller();

  controller.router = new Router({
    controller: controller
  });

  controller.start();
  Backbone.history.start();

  console.log('app is start!');
})

App.start();
