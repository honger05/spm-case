
var Backbone = require('backbone');
var _ = require('lodash');

var AngryCat = require('../models/angrycat');

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

module.exports = AngryCats;