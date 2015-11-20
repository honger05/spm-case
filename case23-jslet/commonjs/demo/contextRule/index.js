
var jslet = require('../../build/locale/zh-cn/locale.js');
var Interpreter = require('../../interpreter/interpreter.js');

var dataSet = require('../dataModel/contacts.js');

var dsContact = dataSet.dsContact;
var dsSalutation = dataSet.dsSalutation;

dsContact.getField('id').visible(false);

var rule1 = {
	condition: 'expr:[country]',
	rules:[
	{field: 'phone', meta: {editMask: 'expr:dsCountry.lookupByKey([Contact!country],"phoneMask")'}},
	{field: 'ssnCode', meta: {editMask: 'expr:dsCountry.lookupByKey([Contact!country],"ssnMask")'}},
	{field: 'idCardNum', meta: {editMask: 'expr:[Country!idCardMask]'}},
	{field: 'driverLicenseNum', meta: {editMask: 'expr:[Country!driverLicenseMask]'}}		
	]
};

//If contactType is 'Organization', the following fields is disabed.
var rule2 = {
	condition: '[contactType] == "O"',
	rules:[
	{field: 'gender', meta: {disabled: true}, value: null},
	{field: 'firstName', meta: {disabled: true}, value: ''},
	{field: 'lastName', meta: {disabled: true}, value: ''},
	{field: 'salutation', meta: {disabled: true}, value: ''},
	{field: 'birthday', meta: {disabled: true}, value: null},
	{field: 'race', meta: {disabled: true}, value: null}
	]
};

//If contactType is 'Individual', the following fields is enabled.
var rule3 = {
	condition: '[contactType] == "I"',
	rules:[
	{field: 'gender', meta: {disabled: false}},
	{field: 'firstName', meta: {disabled: false}},
	{field: 'lastName', meta: {disabled: false}},
	{field: 'salutation', meta: {disabled: false}},
	{field: 'birthday', meta: {disabled: false}},
	{field: 'race', meta: {disabled: false}}
	]
};

//If contactType is 'Individual', the following fields is enabled.
var rule4 = {
	condition: '[gender]',
	rules: [
	{field: 'salutation', lookup: {filter: '[Salutation!gender] == "${gender}" || [Salutation!gender] == "B"'}}
	]
};

dsContact.contextRules([rule1, rule2, rule3, rule4]);
dsContact.enableContextRule();



// pares....
var tpl = {
	root: 'root',
	masterDataset: '',
	controls: [
		{
			panel: {
				title: 'Context Rule', 
				bodyTpl: '<div id="tablePanel"></div><hr><div id="resultPanel" style="height:400px"></div>',
				toolbar: []
			},
			bind: [{
				el: 'tablePanel',
				jsletParams: {type:'DBTable', dataset: 'Contact'}
			}, {
				el: 'resultPanel',
				jsletParams: {type:'DBEditPanel', dataset: 'Contact'}
			}]
		}
	]
};

var interpreter = new Interpreter(tpl);

interpreter.parse();


















