
var React = require('react');
var ReactDom = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

class CommentList extends React.Component {
	render() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment author={comment.author} key={comment.author}>
					{comment.text}
				</Comment>
			)
		});

		return (
			<div className="commentList">
				{commentNodes}
			</div>
		)
	}
}

class CommentForm extends React.Component {

	handleSubmit = (e) => {
		e.preventDefault();
		var author = this.refs.author.value.trim();
		var text = this.refs.text.value.trim();
		if (!text || !author) {
			return;
		}
		this.props.onCommentSubmit({author: author, text: text});
		this.refs.author.value = '';
		this.refs.text.value = '';
		return;
	}

	render() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Your name" ref="author"/>
				<input type="text" placeholder="Say somthing..." ref="text"/>
				<input type="submit" value="Post"/>
			</form>
		)
	}
}

class Comment extends React.Component {
	rawMarkup() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return {__html: rawMarkup};
	}

	render() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		)
	}
}

class CommentBox extends React.Component {

	state =  {data: []}

	handleCommentSubmit = (comment) => {
		var comments = this.state.data;
		var newComents = comments.concat([comment]);
		this.setState({data: newComents});
	}

	componentDidMount() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: ((data) => {
				this.setState({data: data})
			}),
			error: ((xhr, status, err) => {
				console.error(this.props.url, status, err.toString());
			})
		})
	}

	render() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
			</div>
		)
	}
}


ReactDom.render(<CommentBox url='/api/comments.json' />, document.getElementById('content'))
