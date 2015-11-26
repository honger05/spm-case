
var Backbone = require('backbone');
var Mn = Backbone.Marionette;

var AngryCat = require('../models/angrycat');
var AngryCats = require('../collections/angrycats');
var AngryCatsView = require('../views/angrycats_view')

// 实例化一个 Application
MyApp = new Mn.Application();

// 添加一个区域到 regions 
MyApp.addRegions({
	mainRegion: '#contents'
})

// 添加实例化器，这些实例化器将在 start 执行之后，立即触发。
MyApp.addInitializer(function(options) {
	// 实例化 compositeView 
	var angryCatsView = new AngryCatsView({
		collection: options.cats
	});
	// 这里将 实例化 childView
	MyApp.mainRegion.show(angryCatsView);
})

var cats = new AngryCats([
  new AngryCat({ name: 'Wet Cat', image_path: '../assets/images/cat2.jpg' }),
  new AngryCat({ name: 'Bitey Cat', image_path: '../assets/images/cat1.jpg' }),
  new AngryCat({ name: 'Surprised Cat', image_path: '../assets/images/cat3.jpg' })
]);

// 传入的参数 options 将传递给每一个 实例化器
MyApp.start({cats: cats});


cats.add(new AngryCat({ 
	name: 'Cranky Cat', 
	image_path: '../assets/images/cat4.jpg',
	rank: cats.size() + 1
}));

