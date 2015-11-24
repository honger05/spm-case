
/**
 * 程序主入口，主视图
 *
 * 视图的作用：
 * 			1. el tagName className 绑定一个 dom 元素
 * 			2. events 配置事件代理 delegateEvents
 *
 * 其它的 Backbone 并不作限制
 *
 *
 * 主视图是对集合的处理
 */

var Backbone, TodoView, todos, common, AppView;

var $ = require('jquery');
var _ = require('underscore');

Backbone = require('backbone');
TodoView = require('./todos');
todos = require('../collections/todos');
common = require('../common');


/**
 *  view 嵌套 和 组合
 */

AppView = Backbone.View.extend({

	el: '#todoapp',

	statsTemplate: _.template($('#stats-template').html()),

	/**
	 * Dom 事件，只会处理 model ，然后让 model 去渲染界面.
	 *
	 * 有点像 view --> model 的绑定
	 *
	 */
	events: {
		'keypress #new-todo': 'createOnEnter',
		'click #clear-completed': 'clearCompleted',
		'click #toggle-all': 'toggleAllComplete'
	},

	initialize: function() {
		this.allCheckbox = this.$('#toggle-all')[0];

		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		/**
		 *  model --> view 的绑定
		 */

		// todos.create 被动触发 add 事件
		// appView 的 addOne 进行界面同步
		this.listenTo(todos, 'add', this.addOne);

		// 在路由中，主动触发 filter 事件
		// appView 的 filterAll 进行界面同步
		this.listenTo(todos, 'filter', this.filterAll);

		// 模型属性的改变，被动触发 change:completed 事件
		// appView 的 filterOne 进行界面同步
		this.listenTo(todos, 'change:completed', this.filterOne);

		this.listenTo(todos, 'reset', this.addAll);

		// 集合上所有事件都要触发 all 事件
		this.listenTo(todos, 'all', this.render);

		// 拉取到所有数据后，依次触发 [add - all] 事件。
		todos.fetch();
	},

	render: function(method) {

		console.log('app render method: ' + method);

		var completed = todos.completed().length;
		var remaining = todos.remaining().length;

		if (todos.length) {

			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}))

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (common.TodoFilter || '') + '"]')
				.addClass('selected');

		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
	},

	createOnEnter: function(e) {
		if (e.which !== common.ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		todos.create(this.newAttributes());
		this.$input.val('');
	},

	/**
	 *  增加一条数据会触发 主视图 render 5 次。
	 *  app render method: add
			app render method: sort
			app render method: change:id
			app render method: change
			app render method: sync
	 */
	addOne: function(todo) {
		var view = new TodoView({model: todo});
		$('#todo-list').append(view.render().el);
	},

	addAll: function() {
		this.$('#todo-list').html('');
		todos.each(this.addOne, this);
	},

	newAttributes: function() {
		return {
			title: this.$input.val().trim(),
			order: todos.nextOrder(),
			completed: false
		}
	},

	filterOne: function(todo) {
		todo.trigger('visible');
	},

	/**
	 *  过滤一次，触发主视图 render n + 1 次. n 表示集合长度
	 *  app render method: visible N
      app render method: filter
	 */
	filterAll: function() {
		todos.each(this.filterOne, this);
	},

	clearCompleted: function() {
		_.invoke(todos.completed(), 'destroy');
		return false;
	},

	toggleAllComplete: function() {
		var completed = this.allCheckbox.checked;

		// 通过改变模型的状态来驱动界面的展示
		todos.each(function (todo) {
			todo.save({
				'completed': completed
			})
		})
	}

})

module.exports = AppView;
