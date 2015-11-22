
/**
 *  单个 item 视图, 也只对应单个 model
 *
 *  model 是视图动态创建时 传入的参数。
 *
 * 	会生成多个视图实例。
 */

var Backbone, common, TodoView;

Backbone = require('backbone');
common = require('../common');

var $ = require('jquery');
var _ = require('underscore');

TodoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#item-template').html()),

	events: {
		'click .toggle': 'toggleCompleted',
		'dbclick label': 'edit',
		'click .destroy': 'clear',
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close'
	},

	initialize: function() {
		// this.listenTo(this.model, 'change', this.render);
		// 监听删除事件
		this.listenTo(this.model, 'destroy', this.remove);
		// this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	clear: function() {
		this.model.destroy();
	}

})

module.exports = TodoView;