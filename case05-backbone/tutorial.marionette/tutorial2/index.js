
var Backbone = require('backbone');
require('../node_modules/backbone.marionette/lib/backbone.marionette');

var Mn = Backbone.Marionette;

var MyApp = new Mn.Application();

MyApp.addRegions({
	mainRegion: '#contents'
})

var AngryCat = Backbone.Model.extend({});

var AngryCats = Backbone.Collection.extend({
	model: AngryCat
});

var AngryCatView = Mn.ItemView.extend({
	template: '#angry_cat-template',
	tagName: 'tr',
	className: 'angry_cat',

	initialize: function() {
		console.log(this.model)
	}
})

var AngryCatsView = Mn.CompositeView.extend({
	tagName: 'table',
	id: 'angry_cats',
	className: 'table-striped table-bordered',

	template: '#angry_cats-template',

	childView: AngryCatView,

	childViewContainer: '#name-td',

	initialize: function(){
		console.log(this.collection, this.render);
    // this.listenTo(this.collection, "sort", this.render);
  }

})

MyApp.addInitializer(function(options) {
	var angryCatsView = new AngryCatsView({
		collection: options.cats
	});
	MyApp.mainRegion.show(angryCatsView);
})

var cats = new AngryCats([
	{ name: 'Wet Cat' },
  { name: 'Bitey Cat' },
  { name: 'Surprised Cat' }
]);

MyApp.start({cats: cats});