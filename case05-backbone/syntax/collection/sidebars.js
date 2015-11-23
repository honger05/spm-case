
/**
 *  collection 结构
 *
 *  models: 数组，存放着 Backbone.Model
 *
 *  _byId: 对象，键值对的方式存放着 Backbone.Model , 键是 model 的 cid
 *
 *  _events: 事件对象, 一般会是 view 监听（ listenTo ）集合上的变化
 *
 *  length： 集合内 models 数量
 *
 *  
 *
 */

var Backbone = require('backbone');


// new Backbone.Collection([models], [options]) 
var books = new Backbone.Collection([
  {name: 'java', price: 5},
  {name: 'c++', price: 26},
  {name: 'ruby', price: 55}
], {
  url: '/books'
})

// collection.toJSON([options]) 
console.log(books.toJSON())


// map
var prices = books.map(function(book) {
  return book.get('price');
})
console.log(prices);


// filter
var filteredBooks = books.filter(function(book) {
  return book.get('price') > 5;
})
console.log(filteredBooks);


// collection.add(models, [options]) 
books.on('add', function(book) {
  console.log('book ' + book.get('name') + ' added!')
})
var two_books = [
 {name: 'js', price: 15},
 {name: 'python', price: 28}
]
books.add(two_books);


// collection.remove(models, [options]) 
books.on('remove', function(book) {
   console.log('book ' + book.get('name') + ' removed!')
})


// collection.reset([models], [options])  替换集合
books.reset(two_books);


// get(id)
var js_book = books.get('c6');
books.remove(js_book);


// collection.comparator  
var Chapter  = Backbone.Model;
var chapters = new Backbone.Collection;
// 按 page 排序
chapters.comparator = 'page';
chapters.add(new Chapter({page: 9, title: "The End"}));
chapters.add(new Chapter({page: 5, title: "The Middle"}));
chapters.add(new Chapter({page: 1, title: "The Beginning"}));
// collection.pluck(attribute)   拉取属性， 相当于 map
console.log(chapters.pluck('title'));



// collection.where(attributes) 
var friends = new Backbone.Collection([
  {name: "Athos",      job: "Musketeer"},
  {name: "Porthos",    job: "Musketeer"},
  {name: "Aramis",     job: "Musketeer"},
  {name: "d'Artagnan", job: "Guard"},
]);
console.log(friends.where({job: "Musketeer"}).length);
// collection.findWhere(attributes) 
console.log(friends.findWhere({job: "Musketeer"}));


// collection.url or collection.url() 
// Backbone.Collection.extend(properties, [classProperties])
var Notes = Backbone.Collection.extend({
  url: '/notes'
});
// Or, something more sophisticated:
// var Notes = Backbone.Collection.extend({
//   url: function() {
//     return this.document.url() + '/notes';
//   }
// });
var notes = new Notes();
console.log(notes.url);


// collection.fetch([options]) 
Backbone.sync = function(method, model) {
  console.log(method + ": " + model.url);
};
var accounts = new Backbone.Collection;
accounts.url = '/accounts';
accounts.fetch();



// collection.create(attributes, [options]) 
// 方便的在集合中创建一个模型的新实例
// 立即触发集合上的"add"事件
// 还有一个 "sync" ”事件，一旦服务器响应成功创建模型
// 如果你想在集合中添加这个模型前等待服务器相应，请传递{wait: true}
var Library = Backbone.Collection.extend({
  model: Chapter
});
var nypl = new Library;
var othello = nypl.create({
  title: "Othello",
  author: "William Shakespeare"
});





