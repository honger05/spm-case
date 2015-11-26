
var Backbone = require('backbone');
var _ = require('lodash');

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

module.exports = AngryCat;