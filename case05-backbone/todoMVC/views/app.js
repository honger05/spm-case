
/**
 * 程序主入口，主视图
 *
 * 视图的作用： 
 * 			1. el tagName className 绑定一个 dom 元素
 * 			2. events 配置事件代理 delegateEvents
 *
 * 其它的 Backbone 并不作限制
 */

var Backbone, TodoView, todos, common, AppView;

var $ = require('jquery');
var _ = require('underscore');

Backbone = require('backbone');
TodoView = require('./todos');
todos = require('../collections/todos');
common = require('../common');

AppView = Backbone.View.extend({

	el: '#todoapp',

	// statsTemplate: _.template($('#stats-template').html());

	events: {
		'keypress #new-todo': 'createOnEnter'
	},

	initialize: function() {
		this.$input = this.$('#new-todo');

		this.listenTo(todos, 'add', this.addOne);
		this.listenTo(todos, 'all', this.render);

		todos.fetch();
	},

	render: function() {

	},

	createOnEnter: function(e) {
		if (e.which !== common.ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		todos.create(this.newAttributes());
		this.$input.val('');
	},

	addOne: function(todo) {
		var view = new TodoView({model: todo});
		$('#todo-list').append(view.render().el);
	},

	newAttributes: function() {
		return {
			title: this.$input.val().trim(),
			order: todos.nextOrder(),
			completed: false
		}
	}

})

module.exports = AppView;