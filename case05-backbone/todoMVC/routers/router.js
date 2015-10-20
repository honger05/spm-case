var Backbone, Workspace, todos, common;

Backbone = require('backbone');
todos = require('../collections/todos')
common = require('../common');

Workspace = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},

	setFilter: function(param) {
		common.TodoFilter = param && param.trim() || '';

		todos.trigger('filter');
	}
})

module.exports = Workspace;