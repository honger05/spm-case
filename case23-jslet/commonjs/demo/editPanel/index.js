
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/employee.js');

var dsEmployee = dataSet.dsEmployee;


// pares....
var tpl = {
	root: 'root',
	masterDataset: '',
	controls: [
		{
			panel: {
				title: 'DBEditPanel', 
				bodyTpl: '<div id="tablePanel"></div><hr><div id="editPanel"></div>',
				toolbar: ['column2Count', 'label2Column', 'spanColums', 'specify']
			},
			bind: [{
				el: 'tablePanel',
				jsletParams: {type:'DBTable', dataset: 'employee'}
			},{
				el: 'editPanel',
				jsletParams: {type:"DBeditpanel",dataset:"employee", 
					fields:[
						{field:"workerid", colSpan: 2},
						{field:"department", colSpan: 3, showLine: true}
					]
				}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();

var edtPnlObj = document.getElementById('editPanel');


document.getElementById('column2CountBtn').addEventListener('click', doColumn2Count);

function doColumn2Count() {
	var ojslet = edtPnlObj.jslet;
	ojslet.columnCount(2);
	ojslet.renderAll();
}

document.getElementById('label2ColumnBtn').addEventListener('click', doLabel2Column);

function doLabel2Column() {
	var ojslet = edtPnlObj.jslet;
	ojslet.labelCols(2);
	ojslet.renderAll();
}

document.getElementById('spanColumsBtn').addEventListener('click', doSpanColums);

function doSpanColums() {
	var ojslet = edtPnlObj.jslet;
	var fld = ojslet.getEditField("name");
	fld.dataCols = 5;
	fld = ojslet.getEditField("workerid");
	fld.dataCols = 2;
	ojslet.renderAll();
}

document.getElementById('specifyBtn').addEventListener('click', doSpecify);

function doSpecify() {
	var ojslet = edtPnlObj.jslet;
	ojslet.onlySpecifiedFields(true)
	ojslet.renderAll();
}


