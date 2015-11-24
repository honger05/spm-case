
/**
 * 根据 url 状态来驱动
 *
 * filter 过滤
 *
 * url 片段匹配规则
 *
 * 1. 冒号 表示参数 (:param)
 * 		search/:query  可以匹配 search/obama 此时参数是 obama
 *   	search/:query/p:page 可以匹配 search/obama/p2  此时参数是 obama 2
 *
 * 2. 星号 表示通配符 (*path)
 * 		file/*path 可以匹配 file/next/a.txt 此时参数为 'next/a.txt'
 *
 * 3. 圆括号 表示可选 （（/））
 * 		docs(/) 可以匹配 docs 也可以匹配 docs/
 * 
 */

var Backbone, Workspace, todos, common;

Backbone = require('backbone');
todos = require('../collections/todos')
common = require('../common');

Workspace = Backbone.Router.extend({

	routes: {

		// 匹配所有路径
		'*filter': 'setFilter'
	},

	setFilter: function(param) {
		
		// param 是匹配的 参数
		common.TodoFilter = param && param.trim() || '';

		console.log('param: ' + param);

		// 手动触发集合的 filter 事件
		todos.trigger('filter');
	}

})

module.exports = Workspace;