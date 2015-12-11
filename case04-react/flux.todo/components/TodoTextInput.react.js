
import React from 'react';

var ReactPropTypes = React.PropTypes;

var ENTER_KEY_CODE = 13;

class TodoTextInput extends React.Component {

	static propTypes = {
		className: ReactPropTypes.string,
		id: ReactPropTypes.string,
		placeholder: ReactPropTypes.string,
		onSave: ReactPropTypes.func.isRequired,
		value: ReactPropTypes.string
	}

	state = {
		value: this.props.value || ''
	}

	render() {
		return (
			<input
				className={this.props.className}
				id={this.props.id}
				placeholder={this.props.placeholder}
				onBlur={this._save}
				onChange={this._onChange}
				onKeyDown={this._onKeyDown}
				value={this.state.value}
				autoFocus={true}
			/>
		)
	}

	_save = () => {
		this.props.onSave(this.state.value);
		this.setState({
			value: ''
		})
	}

	_onChange = (ev) => {
		this.setState({
			value: ev.target.value
		})
	}

	_onKeyDown = (ev) => {
		if (ev.keyCode === ENTER_KEY_CODE) {
			this._save();
		}
	}

}

export default TodoTextInput;
