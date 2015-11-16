
/**
 *  Model 实例结构
 *
 *  _changing: 布尔值，表示是否改变, change 事件触发后，值为 true.
 *
 *  _pending: 布尔值，表示等待
 *
 *  _previousAttributes: 对象，表示上一个属性值
 *                       model.previous(attribute)
 *                       model.previousAttributes() 返回模型的上一个属性的副本。
 *                       一般用于获取模型的不同版本之间的区别，或者当发生错误时回滚模型状态。
 *
 *  attributes: 对象，表示当前属性值
 *              model.get(key)
 *              model.set(key, value)
 *              model.has(key)
 *
 *  changed: 对象，记录发生改变的属性
 *           model.hasChanged([attribute])  检查整个或单个属性是否 change。
 *           model.changedAttributes([attributes]) 返回整个或单个改变了的属性，没有则返回 false。
 *
 *  id: 任意字符串（整型 id 或 UUID），
 *      服务器 id，判断模型是否已经保存到服务器。 如果模型尚无 id，则被视为新的。
 *  		model.isNew() 可以检查。
 *  		在属性中设置的 id 会被直接拷贝到model属性上。 
 *  		我们可以从集合（collections）中通过 id 获取model，
 *  		另外 id 通常用于生成model的 URLs。
 *
 *  cid: 字符串，客户端 id， model创建时自动产生的唯一标识符 
 *
 *  _events: 对象，etc：change:color: Array[1] 。
 *           Backbone.Events 实例，记录事件信息。
 *           与 Arale.Events 相同。
 *
 *  validationError: 字符串，用 validate 验证失败返回的值
 */

var Backbone = require('backbone');

var Sidebar = Backbone.Model.extend({
	/**
	 * default 中如果包含一个对象作为默认值，它会被所有实例共享，可以用一个函数取代。
	 * @type {Object}
	 */
	defaults: {
		color: 'blue',
		html: "<script>alert('xss')</script>"
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
console.log('========================== Model');

var sidebar = new Sidebar({color: 'red'});

console.log(sidebar.get('color'));

console.log('sidebar has html ? ' + sidebar.has('html'));

console.log(sidebar.get('html'));

console.log(sidebar.escape('html'));

// model.unset(attribute, [options])
// 从内部属性散列表中删除指定属性(attribute)。 
// 如果未设置 silent 选项，会触发 "change" 事件。
sidebar.unset('color');

// model.clear([options]) 
// 从model中删除所有属性， 包括id属性。 
// 如果未设置 silent 选项，会触发 "change" 事件。
sidebar.clear();

/**
  model.idAttribute 
**/
console.log('========================== model.idAttribute ');

// 一个model的唯一标示符，被储存在 id 属性下。如果使用一个不同的唯一的key直接和后端通信。
// 可以设置Model的 idAttribute 到一个从key到 id 的一个透明映射中。
var Meal = Backbone.Model.extend({
  idAttribute: "_id"
});

var cake = new Meal({ _id: 1, name: "Cake" });
console.log("Cake id: " + cake.id);

/**
	change
**/
console.log('========================== change:color');

sidebar.on('change', function(model, options) {
	console.log('sidebar is changed')
})

sidebar.on('change:color', function(model, color) {
	$('#sidebar').css({background: color});
	console.log("Changed color from " + model.previous("color") + " to " + color);
});

// default: {slient: true, validate: false}
// {slient: false} 不触发 change 事件
// {validate: true} 执行 validate 检查。
sidebar.set({color: '#ccc'});

// sidebar.promptColor();

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
  // 通过 id 来判断 method，无 id : create , 有 id : update
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

/* 执行 validate 检查失败后，将触发 invalid 事件 */
// one.on('invalid', function(model, error) {
// 	console.log(model.get('title') + ' ' + error);
// });

// 默认 save 执行 validate 检查
// one.save({start: 10, end: 5});


// set 不执行 validate 检查，除非设置 {validate: true}
one.set({
  start: 15,
  end:   10
});


// model.isValid() 主动执行检查, 返回布尔值
if (!one.isValid()) {
  console.log(one.get("title") + " " + one.validationError);
}


/**
	urlRoot
**/
console.log('========================== urlRoot');

var Book = Backbone.Model.extend({urlRoot : '/books'});

var solaris = new Book({id: "1083-lem-solaris"});

// model.url 生成 URLs 的默认形式为："/[collection.url]/[id]"
// 如果使用的集合外部的模型，通过指定 urlRoot 
// 来设置生成基于模型 id 的 URLs 的默认 url 函数。 "[urlRoot]/id"
console.log(solaris.url());