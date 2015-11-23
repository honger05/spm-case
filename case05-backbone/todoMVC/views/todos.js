
/**
 *  单个 item 视图, 也只对应单个 model
 *
 *  model 是视图动态创建时 传入的参数。
 *
 * 	会生成多个视图实例。
 *
 *  增查：在主视图 appView 中完成
 *  删改：在本视图 todoView 中完成
 */

var Backbone, common, TodoView;

Backbone = require('backbone');
common = require('../common');

var $ = require('jquery');
var _ = require('underscore');

TodoView = Backbone.View.extend({

	tagName: 'li',

	template: _.template($('#item-template').html()),

	/**
	 * Dom 事件，只会处理 model ，然后让 model 去渲染界面.
	 */
	events: {
		'click .toggle': 'toggleCompleted',
		'dbclick label': 'edit',
		'click .destroy': 'clear',
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close'
	},

	initialize: function() {

		// 模型上所有事件都要触发集合上的 all 事件
		// 包括 模型自身状态的改变引起的事件.
		
		this.listenTo(this.model, 'change', this.render);
		
		// 监听删除事件
		this.listenTo(this.model, 'destroy', this.remove);

		// 监听模型的显示、隐藏事件
		this.listenTo(this.model, 'visible', this.toggleVisible);
	},

	// model 的改变会引起 render 重绘
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		// 切换 完成状态
		this.$el.toggleClass('completed', this.model.get('completed'));

		this.$input = this.$('.edit');
		return this;
	},

	/**
	 * 清除一次，触发主视图 render 3 次
	 * app render method: sync
     app render method: remove
     app render method: destroy
	 */
	clear: function() {
		this.model.destroy();
	},

	updateOnEnter: function(e) {
		if (e.which === common.ENTER_KEY) {
			this.close();
		}
	},

	/**
	 * 修改一次 title，触发 主视图 render 3 次
	 * app render method: change:title
     app render method: change
     app render method: sync
	 */
	close: function() {
		var value = this.$input.val().trim();

		if (value) {
			this.model.save({title: value});
		} else {
			this.clear();
		}

	},

	/**
	 *  修改一次 completed，引发 主视图 render 3 次
	 *  app render method: change:completed
			app render method: change
			app render method: sync
	 */
	toggleCompleted: function() {
		this.model.toggle();
	},

	toggleVisible: function() {
		this.$el.toggleClass('hidden', this.isHidden());
	},

	isHidden: function() {
		var isCompleted = this.model.get('completed');

		// 过滤的是 active ，则 完成的要隐藏
		// 过滤的是 completed ，则 未完成的要隐藏
		// 过滤的是 all，则 都不隐藏
		return (
			(!isCompleted && common.TodoFilter === 'completed') || 
			(isCompleted && common.TodoFilter === 'active')
		)
	}

})

module.exports = TodoView;