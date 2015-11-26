
/**
 * 布局定义，布局是一种特殊的view
 */

var Backbone = require('backbone');

var Mn = Backbone.Marionette;
var Radio = Backbone.Radio;

var RootLayout = Mn.LayoutView.extend({

	el: '#todoapp',

	regions: {
		header: '#header',
		main: '#main',
		footer: '#footer'
	}

})

var HeaderLayout = Mn.ItemView.extend({

	template: '#template-header',

	ui: {
		input: '#new-todo'
	},

	events: {
		'keypress @ui.input': 'onInputKeypress'
	},

	onInputKeypress: function(e) {
		var ENTER_KEY = 13;
		var todoText = this.ui.input.val().trim();

		if (e.which === ENTER_KEY && todoText) {
			this.collection.create({
				title: todoText
			});
			this.ui.input.val('');
		}
	}

})


var FooterLayout = Mn.ItemView.extend({
	
	template: '#template-footer',

	ui: {
		filters: '#filters a',
		completed: '.completed a',
		active: '.active a',
		all: '.all a',
		summary: '#todo-count',
		clear: '#clear-completed'
	},

	events: {
		'click @ui.clear': 'onClearClick'
	},

	collectionEvents: {
		all: 'render'
	},

	templateHelpers: {
		activeCountLabel: function() {
			return (this.activeCount === 1 ? 'item' : 'items') + ' left';
		}
	},

	initialize: function() {
		console.log('footer initialize');
	},

	serializeData: function() {
		var active = this.collection.getActive().length;
		var total = this.collection.length;

		return {
			activeCount: active,
			totalCount: total,
			completedCount: total - active
		};
	},

	onRender: function() {
		this.$el.parent().toggle(this.collection.length > 0);
		// this.updateFilterSelection();
	},

	updateFilterSelection: function() {
		this.ui.filters.removeClass('selected');
	},

	onClearClick: function() {
		var completed = this.collection.getCompleted();
		completed.forEach(function (todo) {
			todo.destroy();
		})
	}

})

