
/**
 * View 内部结构
 * 
 * cid: 'view1' 从 1 开始
 *
 * el: dom 对象
 *
 * $el: jquery 对象
 *
 * attributes: dom 对象上的属性
 *
 * _listenTo: 对象，监听模型的事件
 *
 * model: Backbone.Model 实例
 * 
 */

var Backbone = require('backbone');

var ItemView = Backbone.View.extend({
  tagName: 'li'
});

var BodyView = Backbone.View.extend({
  el: 'body'
});

var item = new ItemView();
var body = new BodyView();

console.log(item.el + ' ' + body.el);



// constructor/initialize   new View([options]) 
// extend   Backbone.View.extend(properties, [classProperties]) 
// 开始创建自定义的视图类。 通常我们需要重载 render 函数，声明 events， 
// 以及通过 tagName, className, 或 id 为视图指定根元素。













