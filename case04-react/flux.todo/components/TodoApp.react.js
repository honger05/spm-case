
import React from 'react';
import Header from './Header.react';
import MainSection from './MainSection.react';
import Footer from './Footer.react';
import TodoStore from '../stores/TodoStore';

function getTodoState() {
	return {
		allTodos: TodoStore.getAll(),
		areAllComplete: TodoStore.areAllComplete()
	}
}

class TodoApp extends React.Component {

	state = {
		allTodos: TodoStore.getAll(),
		areAllComplete: TodoStore.areAllComplete()
	}

	componentDidMount() {
		TodoStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		TodoStore.removeChangeListener(this._onChange);
	}

	render() {
		return (
			<div>
				<Header />
				<MainSection 
					allTodos={this.state.allTodos}
					areAllComplete={this.state.areAllComplete}
				/>
				<Footer allTodos={this.state.allTodos} />
			</div>
		)
	}

	_onChange = () => {
		this.setState(getTodoState())
	}

}

export default TodoApp;