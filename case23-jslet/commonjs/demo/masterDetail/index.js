
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/salesdetail.js');

var dsSaleDetail = dataSet.dsSaleDetail;
var dsSaleMaster = dataSet.dsSaleMaster;



// pares....
var tpl = {
	root: 'root',
	controls: [
		{
			panel: {
				title: 'Master-Detail', 
				bodyTpl: '<div id="tablePanel" style="height:200px"></div><div id="editPanel"></div>',
				toolbar: ['edit']
			},
			bind: [{
				el: 'tablePanel',
				jsletParams: {type:'DBTable', dataset: 'dsSaleMaster'}
			},{
				el: 'editPanel',
				jsletParams: {type:'DBTable', dataset: 'dsSaleDetail'}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();


















