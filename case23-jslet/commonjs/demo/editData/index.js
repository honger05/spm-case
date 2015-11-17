
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../../dataModel/employee.js');

var dsProvince = dataSet.dsProvince;
var dsEmployee = dataSet.dsEmployee;



// pares....
var tpl = {
	root: 'root',
	controls: [
		{type:'DBTable', dataset: 'employee'},
		{type:'DBEditPanel', dataset: 'employee'},
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();
















// function initialize(){
//   var dsGender = jslet.data.createEnumDataset('gender', {'F':'Female','M':'Male','U':'Unknown'});

// 	var fldCfg=[
// 		{index: 0, type: "N", name: "id", label: "ID", length: 8},
// 		{index: 1, type: "S", name: "StringFld", label: "String Field", length: 12},
// 		{index: 2, type: "N", name: "IntFld", label: "Int Field", length: 8, displayFormat: "#,##0"},
// 		{index: 3, type: "N", name: "DoubleFld", label: "Double Field", scale: 2, length: 12, displayFormat: "#,##0.00"},
// 		{index: 4, type: "D", name: "DateFld", label: "Date Field"},
// 		{index: 5, type: "B", name: "BooleanFld", label: "Boolean Field"},
// 		{index: 6, type: "S", name: "Gender", label: "Gender", lookupField: {dataset: "gender"}}
// 	];
	
// 	var dsObj = jslet.data.createDataset("firstds",fldCfg);

// 	dsObj.insertRecord();
// }
// jslet.ui.install();

