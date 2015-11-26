
var Backbone = require('backbone');
var _ = require('lodash');

require('../node_modules/backbone.marionette/lib/backbone.marionette');

var Mn = Backbone.Marionette;

// 实例化一个 Application
var MyApp = new Mn.Application();

// 添加一个区域到 regions 
MyApp.addRegions({
	mainRegion: '#contents'
})

// Model and Collection
var AngryCat = Backbone.Model.extend({
	defaults: {
		votes: 0
	},

	// implement a vote incrementer
	addVote: function() {
		this.set('votes', this.get('votes') + 1)
	},

	rankUp: function() {
    this.set({rank: this.get('rank') - 1});
  },
 
  rankDown: function() {
    this.set({rank: this.get('rank') + 1});
  }
});

// 处理业务逻辑
var AngryCats = Backbone.Collection.extend({
	model: AngryCat,

	initialize: function(cats) {

		var rank = 1;
		_.each(cats, function(cat) {
			cat.set('rank', rank);
			++rank;
		})

		this.on('add', function(cat) {
			if (! cat.get('rank')) {
				var error = new Error('Cat must have a rank defined before being added to the collection');
				error.name = 'NoRankError';
				throw error;
			}
		})

		var self = this;

		/**
		 *  在集合中订阅，来自视图的 dom 事件。
		 */
		MyApp.on('rank:up', function(cat) {
			if (cat.get('rank') === 1) {
				return true;
			}
			self.rankUp(cat);
			self.sort();
			// self.trigger('reset');
		})

		MyApp.on('rank:down', function(cat) {
			if (cat.get('rank') === self.size()) {
				return true;
			}
			self.rankDown(cat);
			self.sort();
			// self.trigger('reset');
		})

		MyApp.on('cat:disqualify', function(cat) {
			var disqualifiedRank = cat.get('rank');
			var catsToUprank = self.filter(function(cat) {
				return cat.get('rank') > disqualifiedRank;
			})
			catsToUprank.forEach(function(cat) {
				cat.rankUp();
			})
			
			// let our app know that the collection changed
			self.trigger('reset');
		})

	},

	comparator: function(cat) {
		return cat.get('rank');
	},

	// 改变 model 的 rank 值
	rankUp: function(cat) {
		// find the cat we're going to swap ranks with
    var rankToSwap = cat.get('rank') - 1;
    var otherCat = this.at(rankToSwap - 1);

		// swap ranks
    cat.rankUp();
    otherCat.rankDown();
  },
 
 	// 改变 model 的 rank 值
  rankDown: function(cat) {
    // find the cat we're going to swap ranks with
    var rankToSwap = cat.get('rank') + 1;
    var otherCat = this.at(rankToSwap - 1);
    
    // swap ranks
    cat.rankDown();
    otherCat.rankUp();
  }
});

// ItemView
// 定义的 tagName，className 是被加在 模板 最外层包裹的元素上的
// 不指定 tagName，默认是 div
var AngryCatView = Mn.ItemView.extend({
	template: '#angry_cat-template',
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

// CompositeView 里面会包含一个 childView 
// 用 childViewContainer 指定这个 childView 插入的地方
// 之前版本是使用 itemView ，并手动插入
var AngryCatsView = Mn.CompositeView.extend({
	tagName: 'table',
	id: 'angry_cats',
	className: 'table-striped table-bordered',

	template: '#angry_cats-template',

	childView: AngryCatView,

	childViewContainer: '#name-td',

	initialize: function(){
		// 集合发生变化时 更新视图
		this.listenTo(this.collection, 'sort', this.renderCollection);
  }

})

// 添加实例化器，这些实例化器将在 start 执行之后，立即触发。
MyApp.addInitializer(function(options) {
	// 实例化 compositeView 
	var angryCatsView = new AngryCatsView({
		collection: options.cats
	});
	// 这里将 实例化 childView
	MyApp.mainRegion.show(angryCatsView);
})

var cats = new AngryCats([
  new AngryCat({ name: 'Wet Cat', image_path: '../assets/images/cat2.jpg' }),
  new AngryCat({ name: 'Bitey Cat', image_path: '../assets/images/cat1.jpg' }),
  new AngryCat({ name: 'Surprised Cat', image_path: '../assets/images/cat3.jpg' })
]);

// 传入的参数 options 将传递给每一个 实例化器
MyApp.start({cats: cats});


cats.add(new AngryCat({ 
	name: 'Cranky Cat', 
	image_path: '../assets/images/cat4.jpg',
	rank: cats.size() + 1
}));
