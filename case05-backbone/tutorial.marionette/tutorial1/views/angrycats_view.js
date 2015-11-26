
var Backbone = require('backbone');
var Mn = Backbone.Marionette;

var AngryCatView = require('./angrycat_view');

// CompositeView 里面会包含一个 childView 
// 用 childViewContainer 指定这个 childView 插入的地方
// 之前版本是使用 itemView ，并手动插入
var AngryCatsView = Mn.CompositeView.extend({
	tagName: 'table',
	id: 'angry_cats',
	className: 'table-striped table-bordered',

	template: require('./tpl/angrycats.handlebars'),

	childView: AngryCatView,

	childViewContainer: '#name-td',

	initialize: function(){
		// 集合发生变化时 更新视图
		this.listenTo(this.collection, 'sort', this.renderCollection);
  }

})


module.exports = AngryCatsView;

