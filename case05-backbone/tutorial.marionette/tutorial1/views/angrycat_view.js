

var Backbone = require('backbone');
var Mn = Backbone.Marionette;

// ItemView
// 定义的 tagName，className 是被加在 模板 最外层包裹的元素上的
// 不指定 tagName，默认是 div
var AngryCatView = Mn.ItemView.extend({
	template: require('./tpl/angrycat.handlebars'),
	tagName: 'tr',
	className: 'angry_cat',

	initialize: function() {
		// 当视图被删除之后，marionette 会为你解绑。
		this.listenTo(this.model, 'change:votes', this.render)

		// 这样写你就需要自己来解绑
		// this.model.on('change:votes', this.render, this);
		// 解绑方式
		// This onClose method is called automatically 
		// by Marionette when the ItemView is closed.
		// onClose: function(){
		//   this.model.off('change:votes', this.render);
		// }
	},

	events: {
		'click .rank_up img': 'rankUp',
		'click .rank_down img': 'rankDown',
		'click a.disqualify': 'disqualify'
	},

	// Using the event aggregator    事件聚合
	// 在点击 up or down 之后，itemview 要进行 swap 互换动作
	// 但是我们只有权力改变本视图，而动作发生在 collection 里面。
	// 所以要使用 marionette 的 事件聚合 
	// It is looks like Publish/Subscribe concept
	rankUp: function(){
		this.model.addVote();
		// 通知集合 排名变化，调整界面
	  MyApp.trigger('rank:up', this.model);
	},
	 
	rankDown: function(){
		this.model.addVote();
		// 通知集合 排名变化，调整界面
	  MyApp.trigger('rank:down', this.model);
	},

	disqualify: function() {
		// 通知集合 cat 已被删除，重新计算排名, 并调整界面
		MyApp.trigger('cat:disqualify', this.model);
		this.model.destroy();
	}
})

module.exports = AngryCatView;