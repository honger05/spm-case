
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
			panel: {
				title: 'serach', 
				bodyTpl: '<div id="serachPanel"></div>',
				toolbar: ['search', 'reset']
			},
			bind: [{
				el: 'serachPanel',
				jsletParams: {type:'DBEditPanel', dataset: 'criteria'}
			}]
		},
		{
			panel: {
				title: '', 
				bodyTpl: '<div id="resultPanel" style="height:400px"></div>',
				toolbar: ['filterMale', 'showAll'],
				options: {
					inputs: ['id'],
					buttons: ['find']
				}
			},
			bind: [{
				el: 'resultPanel',
				jsletParams: {type:'DBTable', dataset: 'employee'}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();


// parseEvent
document.getElementById('searchBtn').addEventListener('click', doQuery);

document.getElementById('findBtn').addEventListener('click', doFind);

document.getElementById('filterMaleBtn').addEventListener('click', doFilterMale);

document.getElementById('showAllBtn').addEventListener('click', showAll);

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

function doFind() {
	var idOption = document.getElementById('idOption');
	dsEmployee.findByField('workerid', idOption.value);
}

function doFilterMale() {
	dsEmployee.filter("[gender]=='M'");
	dsEmployee.filtered(true);
}

function showAll() {
	dsEmployee.filtered(false);
}















