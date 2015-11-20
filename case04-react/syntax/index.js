
var React = require('react');
var $ = require('jquery');


// Demo01: Render JSX
React.render(
	<h1>Hello, world!</h1>,
	document.getElementById('example')
);


// Demo02: Use JavaScript in JSX
var names = ['Alice', 'Emily', 'Kate'];

React.render(
	<div>
	{
		names.map(function(name) {
			return <div>Hello, {name}!</div>
		})
	}
	</div>,
	document.getElementById('example1')
);


// Demo03: Use array in JSX
var arr = [
	<h1>React is awesome!</h1>,
	<h2>React is awesome</h2>
];

React.render(
	<div>{arr}</div>,
	document.getElementById('example2')
);


// Demo04: Define a component
var HelloMessage = React.createClass({
	render: function() {
		return <h1>Hello {this.props.name}</h1>
	}
});

React.render(
	<HelloMessage name="John"></HelloMessage>,
	document.getElementById('example3')
);


// Demo05: this.props.children
var NotesList = React.createClass({
	render: function() {
		return (
			<ol>
			{
				this.props.children.map(function(child) {
					return <li>{child}</li>
				})
			}
			</ol>
		);
	}
});

React.render(
	<NotesList>
		<span>hello</span>
		<span>world</span>
	</NotesList>,
	document.getElementById('example4')
);


// Demo06: PropTypes and getDefaultProps
var MyTitle = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired
	},

	getDefaultProps: function() {
		return {
			df: 'df'
		}
	},

	render: function() {
		return <h1>{this.props.title},{this.props.df}</h1>
	}
});

var data = 123;

React.render(
	<MyTitle title={data}></MyTitle>,
	document.getElementById('example5')
);


// Demo07: Finding a DOM node
var MyComponent = React.createClass({
	handleClick: function() {
		React.findDOMNode(this.refs.myTextInput).focus();
	},

	render: function() {
		return (
			<div>
				<input type="text" ref="myTextInput"/>
				<input type="button" value="Focus the text input" onClick={this.handleClick} />
			</div>
		);
	}
});

React.render(
	<MyComponent />,
	document.getElementById('example6')
);


// Demo08: this.state
var LikeButton = React.createClass({
	getInitialState: function() {
		return {liked: false};
	},

	handleClick: function(e) {
		this.setState({liked: !this.state.liked});
	},

	render: function() {
		var text = this.state.liked ? 'like' : 'haven\'t liked';
		return (
			<p onClick={this.handleClick}>
				You {text} this. Click to toggle.
			</p>
		)
	}
})

React.render(
	<LikeButton />,
	document.getElementById('example7')
)


// Demo09: Form
var Input = React.createClass({
	getInitialState: function() {
		return {value: 'Hello!'}
	},

	handleChange: function(e) {
		this.setState({value: e.target.value});
	},

	render: function() {
		var value = this.state.value;
		return (
			<div>
				<input type="text" value={value} onChange={this.handleChange} />
				<p>{value}</p>
			</div>
		)
	}
})

React.render(<Input></Input>, document.getElementById('example8'));


// Demo10: Component Lifecycle
var Hello = React.createClass({
	getInitialState: function() {
		return {
			opacity: 1.0
		}
	},

	componentDidMount: function() {
		this.timer = setInterval(function() {
			var opacity = this.state.opacity;
			opacity -= 0.05;
			if (opacity < 0.1) {
				opacity = 1.0;
			}
			this.setState({
				opacity: opacity
			});
		}.bind(this), 100)
	},

	render: function() {
		return (
			<div style={{opacity: this.state.opacity}}>
				Hello {this.props.name}
			</div>
		)
	}
})

React.render(
	<Hello name="React"></Hello>,
	document.getElementById('example9')
)


// Demo11: Ajax
var UserGist = React.createClass({
	getInitialState: function() {
		return {
			username: '',
			lastGistUrl: ''
		}
	},

	componentDidMount: function() {
		$.get(this.props.source, function(result) {
			var lastGist = result[0];
			if (this.isMounted()) {
				this.setState({
					username: lastGist.owner.login,
					lastGistUrl: lastGist.html_url
				})
			}
		}.bind(this))
	},

	render: function() {
		return (
			<div>
				{this.state.username}'s last gist is
				<a href={this.state.lastGistUrl}>here</a>.
			</div>
		)
	}
})

React.render(
	<UserGist source="https://api.github.com/users/octocat/gists"></UserGist>,
	document.getElementById('example10')
)

