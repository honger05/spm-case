

var Backbone = require('backbone');

var Mn = Backbone.Marionette;
var Radio = Backbone.Radio;

var TodoView = Mn.ItemView.extend({

	tagName: 'li',

	template: '#template-todoItemView',

	className: function() {
		return this.model.get('completed') ? 'completed' : 'active';
	},

	ui: {
		edit: '.edit',
		destroy: '.destroy',
		label: 'label',
		toggle: '.toggle'
	},

	events: {
		'click @ui.destroy': 'deleteModel',
		'keydown @ui.edit': 'onEditKeypress',
		'focusout @ui.edit': 'onEditFocusout'
	},

	modelEvents: {
		change: 'render'
	},

	deleteModel: function() {
		this.model.destroy();
	},

	onEditFocusout: function() {
		var todoText = this.ui.edit.val().trim();
		if (todoText) {
			this.model.set('title', todoText).save();
			this.$el.removeClass('editing');
		} else {
			this.destroy();
		}
	},

	onEditKeypress: function() {
		var ENTER_KEY = 13;
		var ESC_KEY = 27;

		if (e.which === ENTER_KEY) {
			this.onEditFocusout();
			return;
		}

		if (e.which === ESC_KEY) {
			this.ui.edit.val(this.model.get('title'));
			this.$el.removeClass('editing');
		}
	}



})