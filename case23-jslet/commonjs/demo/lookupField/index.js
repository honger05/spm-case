
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/employee.js');

var dsEmployee = dataSet.dsEmployee;


function changeDisplayFields(dispFlds) {
  var f = dsEmployee.getField("department");
  var lkf = f.lookup();
  lkf.displayFields(dispFlds);
  dsEmployee.refreshControl();
  dsEmployee.renderOptions();
}

        
// pares....
var tpl = {
	root: 'root',
	masterDataset: '',
	controls: [
		{
			panel: {
				title: 'lookupField', 
				bodyTpl: '<div id="tablePanel"></div><hr>',
				toolbar: []
			},
			bind: [{
				el: 'tablePanel',
				jsletParams: {type:'DBTable', dataset: 'employee'}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();