
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/groupfields.js');

var dsGroupFields = dataSet.dsGroupFields;

        
// pares....
var tpl = {
	root: 'root',
	masterDataset: '',
	controls: [
		{
			panel: {
				title: 'groupfields', 
				bodyTpl: '<div id="tablePanel"></div><hr>',
				toolbar: []
			},
			bind: [{
				el: 'tablePanel',
				jsletParams: {type:'DBTable', dataset: 'group_field_ds'}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();