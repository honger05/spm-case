
/**
 * 定义一个集合
 */

var Backbone, TodoModel, TodosCollection;

Backbone = require('backbone');
require('../vendor/backbone.localStorage.js');

var $ = require('jquery');
var _ = require('underscore');

TodoModel = require('../models/todo');

TodosCollection = Backbone.Collection.extend({

	model: TodoModel,

	localStorage: new Backbone.LocalStorage('todos-backbone'),

	// 返回集合中 completed 状态是已完成的子集
	completed: function() {
		return this.filter(function(todo) {
			return todo.get('completed');
		})
	},

	// 返回集合中 completed 状态是未完成的子集
	remaining: function() {
		return this.without.apply(this, this.completed());
	},

	// 为集合中的模型生成 order 从 1 开始
	nextOrder: function() {
		if (!this.length) {
			return 1;
		}
		return this.last().get('order') + 1;
	},

	// 根据 order 属性排队
	comparator: function(todo) {
		return todo.get('order');
	}

})

module.exports = new TodosCollection();