
/**
 * 伪控制器, 控制着 Model 和 View 的初始化
 *
 * 但是 逻辑 并不在这里发生。
 *
 */

var Backbone = require('backbone');
var $ = require('jquery');

var filterChannel = Backbone.Radio.channel('filter');

var TodoList = require('./todos').TodoList;
var HeaderLayout = require('./layout').HeaderLayout;
var FooterLayout = require('./layout').FooterLayout;
var ListView = require('./todolist.views').ListView;

// TodoList Router
// ---------------
//
// Handles a single dynamic route to show
// the active vs complete todo items
exports.Router = Backbone.Marionette.AppRouter.extend({
  appRoutes: {
    '*filter': 'filterItems'
  }
});

// TodoList Controller (Mediator)
// ------------------------------
//
// Control the workflow and logic that exists at the application
// level, above the implementation detail of views and models
exports.Controller = Backbone.Marionette.Object.extend({

  initialize: function () {
    this.todoList = new TodoList();
  },

  // Start the app by showing the appropriate views
  // and fetching the list of todo items, if there are any
  start: function () {
    this.showHeader(this.todoList);
    this.showFooter(this.todoList);
    this.showTodoList(this.todoList);
    this.todoList.on('all', this.updateHiddenElements, this);
    this.todoList.fetch();
  },

  updateHiddenElements: function () {
    $('#main, #footer').toggle(!!this.todoList.length);
  },

  showHeader: function (todoList) {
    var header = new HeaderLayout({
      collection: todoList
    });
    App.root.showChildView('header', header);
  },

  showFooter: function (todoList) {
    var footer = new FooterLayout({
      collection: todoList
    });
    App.root.showChildView('footer', footer);
  },

  showTodoList: function (todoList) {
    App.root.showChildView('main', new ListView({
      collection: todoList
    }));
  },

  // Set the filter to show complete or all items
  filterItems: function (filter) {
    var newFilter = filter && filter.trim() || 'all';
    filterChannel.request('filterState').set('filter', newFilter);
  }
});
