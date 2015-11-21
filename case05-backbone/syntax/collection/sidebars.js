
/**
 *  collection 结构
 *
 *  models: 数组，存放着 Backbone.Model
 *
 *  _byId: 对象，键值对的方式存放着 Backbone.Model , 键是 model 的 cid
 *
 *
 *
 */

var Backbone = require('backbone');


var books = new Backbone.Collection([
  {name: 'java', price: 5},
  {name: 'c++', price: 26},
  {name: 'ruby', price: 55}
])

// collection.toJSON
console.log(books.toJSON())


// collection.map
var prices = books.map(function(book) {
  return book.get('price');
})
console.log(prices);


// collection.filter
var filteredBooks = books.filter(function(book) {
  return book.get('price') > 5;
})
console.log(filteredBooks);


// conllection.add
books.on('add', function(book) {
  console.log('book ' + book.get('name') + ' added!')
})
books.add([
 {name: 'js', price: 15},
 {name: 'python', price: 28}
]);













// var Sidebar = require('../models/sidebar');

// var persons = new Backbone.Collection([
//   {name: "Tim", age: 5},
//   {name: "Ida", age: 26},
//   {name: "Rob", age: 55}
// ]);

// persons.reset({na1me: "T1om", a1ge: 115});

// persons.add({na1me: "Tom", a1ge: 15});

// console.log(JSON.stringify(persons));

// persons.each(function(person) {
// 	//console.log(person);
// });

// /**
//   add
// **/
// console.log('========================= add');

// var ships = new Backbone.Collection();

// ships.on("add", function(ship) {
//   console.log("Ahoy " + ship.get("name") + "!");
// });

// ships.add([
//   {name: "Flying Dutchman", id: 1},
//   {name: "Black Pearl", id: 1}
// ]);

// *
// 	comparator
// *
// console.log('========================= comparator');

// var Chapter  = Backbone.Model;
// var chapters = new Backbone.Collection();

// chapters.comparator = 'page';

// chapters.add(new Chapter({page: 9, title: "The End"}));
// chapters.add(new Chapter({page: 5, title: "The Middle"}));
// chapters.add(new Chapter({page: 1, title: "The Beginning"}));

// console.log(chapters.pluck('title'));

// /**
// 	create
// **/
// console.log('========================= create');

// var Library = Backbone.Collection.extend({
//   model: Sidebar
// });

// var nypl = new Library();

// var othello = nypl.create({
//   title: "Othello",
//   author: "William Shakespeare"
// });

