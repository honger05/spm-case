
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/employee.js');

var dsProvince = dataSet.dsProvince;
var dsEmployee = dataSet.dsEmployee;

var dsCriteria = dsEmployee.clone('criteria', ['name', 'birthday', 'department', 'gender']);

// pares....
var tpl = {
	root: 'root',
	controls: [
		{
			el: 'serachPanel',
			panel: {
				title: 'serachPanel', 
				bodyTpl: '<div id="serachPanel"></div>',
				toolbar: ['search', 'reset']
			},
			jsletParams: {type:'DBEditPanel', dataset: 'criteria'}
		},
		{
			el: 'resultPanel',
			panel: {
				title: '', 
				bodyTpl: '<div id="resultPanel" style="height:400px"></div>',
				toolbar: [],
				options: {
					inputs: ['filter'],
					buttons: ['find']
				}
			},
			jsletParams: {type:'DBTable', dataset: 'employee'}
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();


// parseEvent
document.getElementById('searchBtn').addEventListener('click', doQuery);



function doQuery() {

	//If dsCriteria is still in edit mode, confirm it.
	if(dsCriteria.confirm()) {
		//Use the criteria dataset data as the query criteria
		var paramText = jslet.data.record2Json(dsCriteria.getRecord());
		if(console) {
			console.log('Query criteria: ' + paramText);
		}
		jslet.showInfo("The query criteria is: \n" + paramText);
		//Replace the url "query.do" with your real url 
		//dsEmployee.queryUrl('query.do');
		//dsEmployee.query(dsCriteria.getRecord());
	}

}















