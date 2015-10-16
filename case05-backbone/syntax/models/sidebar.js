var Backbone = require('backbone');

var Sidebar = Backbone.Model.extend({
	defaults: {
		color: 'red',
		name: "<script>alert('xss')</script>"
	},
	promptColor: function() {
		var cssColor = prompt('Please enter a CSS color: ');
		this.set({color: cssColor});
	}
});

module.exports = Sidebar;

var $ = require('jquery');
var _ = require('underscore');

/**
  model syntax
**/
var sidebar = new Sidebar({color: 'red'});

console.log(sidebar.get('color'));

console.log('sidebar has name ? ' + sidebar.has('name'));

// console.log(sidebar.get('name'));

// console.log(sidebar.escape('name'));

/**
	change
**/
console.log('========================== change');

sidebar.on('change:color', function(model, color) {
	$('#sidebar').css({background: color});
	console.log("Changed color from " + model.previous("color") + " to " + color);
});

sidebar.set({color: '#ccc'});

//sidebar.promptColor();

/**
  escape
**/
console.log('========================== escape');

var hacker = new Backbone.Model({
  name: "<script>alert('xss')</script>"
});

console.log(hacker.escape('name'));

console.log('hacker has name ? ' + hacker.has('name'));

/**
  toJSON
**/
console.log('========================== toJSON');

var artist = new Backbone.Model({
  firstName: "Wassily",
  lastName: "Kandinsky"
});

artist.set({birthday: "December 16, 1866"});

console.log(JSON.stringify(artist));

/**
  save
**/
console.log('========================== save');

Backbone.sync = function(method, model) {
  console.log(method + ": " + JSON.stringify(model));
  model.set('id', 1);
};

var book = new Backbone.Model({
  title: "The Rough Riders",
  author: "Theodore Roosevelt"
});

book.save();

book.save({author: "Teddy"});

/**
  validate
**/
console.log('========================== validate');

var Chapter = Backbone.Model.extend({
	validate: function(attrs, options) {
		if (attrs.end < attrs.start) {
			// 只要返回 `真值` 就会触发 invalid
			return 'cannot end before it starts';
		}
	}
});

var one = new Chapter({title: 'Chapter One: The Beginning'});

one.on('invalid', function(model, error) {
	console.log(model.get('title') + ' ' + error);
});

one.save({start: 10, end: 5});

/**
	urlRoot
**/
console.log('========================== urlRoot');

var Book = Backbone.Model.extend({urlRoot : '/books'});

var solaris = new Book({id: "1083-lem-solaris"});

console.log(solaris.url());