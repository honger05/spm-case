
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/employee.js');

var dsProvince = dataSet.dsProvince;
var dsEmployee = dataSet.dsEmployee;



// pares....
var tpl = {
	root: 'root',
	controls: [
		{
			panel: {
				title: 'tableData', 
				bodyTpl: '<div id="tablePanel" style="height:300px"></div>',
				toolbar: ['edit']
			},
			bind: [{
				el: 'tablePanel',
				jsletParams: {type:'DBTable', dataset: 'employee'}
			}]
		},
		{
			panel: {
				title: 'editPanel', 
				bodyTpl: '<div id="editPanel"></div>',
				toolbar: ''
			},
			bind: [{
				el: 'editPanel',
				jsletParams: {type:'DBEditPanel', dataset: 'employee'}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();

















