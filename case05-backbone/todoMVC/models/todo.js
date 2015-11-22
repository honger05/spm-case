
/**
 *  定义一个数据模型 TodoModel
 *
 * 	title: 标题
 *
 * 	completed: 是否完成
 *
 *  toggle： 改变 completed 的状态
 */

var Backbone = require('backbone');

var TodoModel = Backbone.Model.extend({

	defaults: {
		title: '',
		completed: false
	},

	toggle: function() {
		this.save({
			completed: !this.get('completed')
		})
	}

});

module.exports = TodoModel;