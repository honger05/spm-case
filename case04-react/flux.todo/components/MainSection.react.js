
import React from 'react';
import TodoActions from '../actions/TodoActions';
import TodoItem from './TodoItem.react';

var ReactPropTypes = React.PropTypes;

class MainSection extends React.Component {

	static propTypes = {
		allTodos: ReactPropTypes.object.isRequired,
		areAllComplete: ReactPropTypes.bool.isRequired
	}

	render() {

		var allTodos = this.props.allTodos;

		if (Object.keys(allTodos).length < 1) {
			return null;
		}

		var todos = [];

		for (var key in allTodos) {
			todos.push(<TodoItem key={key} todo={allTodos[key]} />);
		}

		return (
			<section id="main">
				<input 
					id="toggle-all"
					type="checkbox"
					onChange={this._onToggleCompleteAll}
					checked={this.props.areAllComplete ? 'checked' : ''}
				/>
				<label htmlFor="toggle-all">Mark all complete</label>
				<ul id="todo-list">{todos}</ul>
			</section>
		)

	}

	_onToggleCompleteAll = (ev) => {
		TodoActions.toggleCompleteAll();
	}

}

export default MainSection;