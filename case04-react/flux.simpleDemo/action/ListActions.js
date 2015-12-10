
var AppDispatcher = require('../AppDispatcher.js');

var ListActions = {

    add: function( item ) {
      AppDispatcher.dispatch({
        eventName: 'new-item',
        newItem: item
      });
    },

    delete: function( item ) {
    	AppDispatcher.dispatch({
    		eventName: 'delete-item',
    		item: item
    	})
    }

};

module.exports = ListActions;