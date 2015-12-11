
import React from 'react';
import TodoActions from '../actions/TodoActions';
import TodoTextInput from './TodoTextInput.react';

let Header = class extends React.Component {

	render() {
		return (
			<header id="header">
				<h1>todos</h1>
				<TodoTextInput 
					id="new-todo" 
					placeholder="What needs to be done?" 
					onSave={this._onSave}
				/>
			</header>
		)
	}

	_onSave(text) {
		if (text.trim()) {
			TodoActions.create(text);
		}
	}

}

export default Header;