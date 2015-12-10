
import React from 'react';
import ReactDom from 'react-dom';
import TodoApp from './components/TodoApp.react';

ReactDom.render(
	<TodoApp />,
	document.getElementById('todoapp')
)