
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from '../node_modules/events/events';
import TodoConstants from '../constants/TodoConstants';
import assign from '../node_modules/object-assign/index';

const CHANGE_EVENT = 'change';

var _todos = {};

function create(text) {
	var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
	_todos[id] = {
		id: id,
		complete: false,
		text: text
	}
}

function update(id, updates) {
	_todos[id] = assign({}, _todos[id], updates);
}

function updateAll(updates) {
	for (var id in _todos) {
		update(id, updates);
	}
}

function destroy(id) {
	delete _todos[id];
}

function destroyCompleted() {
	for (var id in _todos) {
		if (_todos[id].complete) {
			destroy(id);
		}
	}
}

var TodoStore = assign({}, EventEmitter.prototype, {

	areAllComplete() {
		for (var id in _todos) {
			if (!_todos[id].complete) {
				return false;
			}
		}
		return true;
	},

	getAll() {
		return _todos;
	},

	emitChange() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener() {
		this.removeListener(CHANGE_EVENT, callback);
	}

})

AppDispatcher.register(function(action) {

	var text;

	switch (action.actionType) {

		case TodoConstants.TODO_CREATE:
			text = action.text.trim();
			if (text !== '') {
				create(text);
				TodoStore.emitChange();
			}
			break;

		case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
			if (TodoStore.areAllComplete()) {
				updateAll({complete: false})
			} else {
				updateAll({complete: true})
			}
			TodoStore.emitChange();
			break;

		case TodoConstants.TODO_UNDO_COMPLETE:
			update(action.id, {complete: false});
			TodoStore.emitChange();
			break;

		case TodoConstants.TODO_COMPLETE:
			update(action.id, {complete: true});
			TodoStore.emitChange();
			break;

		case TodoConstants.TODO_UPDATE_TEXT:
			text = action.text.trim();
			if (text !== '') {
				update(action.id, {text: text});
				TodoStore.emitChange();
			}
			break;

		case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      TodoStore.emitChange();
      break;

		default:
		  // no op
	}

})


export default TodoStore;