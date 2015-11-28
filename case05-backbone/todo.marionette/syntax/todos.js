
// /**
//  * Model 和 Collection
//  */

// var Backbone = require('backbone');

// var Mn = Backbone.Marionette;
// var Radio = Backbone.Radio;

// var Todo = Backbon.Model.extend({

// 	defaults: {
// 		title: '',
// 		completed: false,
// 		created: 0
// 	},

// 	initialize: function() {
// 		if (this.isNew()) {
// 			this.set('created', Date.now());
// 		}
// 	},

// 	toggle: function() {
// 		return this.set('completed', !this.isCompleted());
// 	},

// 	isCompleted: function() {
// 		return this.get('completed');
// 	},

// 	matchesFilter: function(filter) {
// 		if (filter === 'all') {
// 			retunr true;
// 		}

// 		if (filter === 'active') {
// 			return !this.isCompleted();
// 		}

// 		return this.isCompleted();
// 	}

// })


// var TodoList = Backbone.Collection.extend({

// 	model: Todo,

// 	localStorage: new Backbone.LocalStorage('todos-backbone-marionette'),

// 	comparator: 'created',

// 	getCompleted: function() {
// 		return this.filter(this._isCompleted);
// 	},

// 	getActive: function() {
// 		return this.reject(this._isCompleted);
// 	},

// 	_isCompleted: function(todo) {
// 		return todo.isCompleted();
// 	}

// })
