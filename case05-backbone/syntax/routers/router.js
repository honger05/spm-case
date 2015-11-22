
/**
 *  Router 内部结构
 *
 *  routes: 对象，就是以下的键值对
 *
 * 
 */

var Backbone = require('backbone');

// Backbone.Router.extend(properties, [classProperties]) 
// 开始创建一个自定义的路由类。当匹配了 URL 片段便执行定义的动作，
// 并可以通过 routes 定义路由动作键值对
var Workspace = Backbone.Router.extend({

  routes: {
    "help":                 "help",    // #help
    "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  help: function() {
    
  },

  search: function(query, page) {
    
  }

});

var router = new Workspace();
console.log(router.routes);

// routesrouter.routes 
// 路由可以包含参数， :param，它在斜线之间匹配 URL 组件。 
// 路由也支持通配符， *splat，可以匹配多个 URL 组件。 
// 路由的可选部分放在括号中(/:optional)


// router.route(route, name, [callback]) 
// 为路由对象手动创建路由
var router = new Workspace();
router.route("page/:number", "page", function(number){
	console.log(number)
})
console.log(router.routes);



// navigate router.navigate(fragment, [options]) 
// 每当你达到你的应用的一个点时，你想保存为一个URL
router.navigate("help/troubleshooting", {trigger: true, replace: true});


// executerouter.execute(callback, args) 
// 这种方法在路由内部被调用，  每当路由和其相应的callback匹配时被执行。 
// 覆盖它来执行自定义解析或包装路由， 
// 例如， 在传递他们给你的路由回调之前解析查询字符串，像这样：
var Router = Backbone.Router.extend({
  execute: function(callback, args) {
    args.push(parseQueryString(args.pop()));
    if (callback) callback.apply(this, args);
  }
});









