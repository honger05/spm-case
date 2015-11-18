jQuery(function () {

	module('jslet.Dataset');
	var dsEmp = jslet.data.getDataset('employee');
	var dsEmpClone = dsEmp.clone('employeeCopy', ['name', 'department', 'age']);

	test('jslet.Dataset: create and destroy', function() {
		throws(function(){
			new jslet.data.Dataset();
		}, 'jslet.Dataset.name is required.')

		throws(function(){
			new jslet.data.Dataset(123);
		}, 'jslet.Dataset.name is String.')
		
		var dsTemp = new jslet.data.Dataset('temp');
		ok(jslet.data.getDataset('temp') !== null, 'Dataset "temp" created.');

		dsTemp.destroy();
		ok(jslet.data.getDataset('temp') === null, 'Dataset "temp" destroyed.');
	});
		
	test('jslet.Dataset: name()', function () {
		var dsName = dsEmp.name();
		ok(dsName == 'employee', 'jslet.Dataset.name().');
	});

	test('jslet.Dataset: field count', function() {
		var fldCnt = dsEmp.getFields().length;
		ok(fldCnt == 18, 'jslet.Dataset field count equals 18');
		
		fldCnt = dsEmp.getNormalFields().length;
		ok(fldCnt == 18, 'jslet.Dataset normal field count equals 18');
	});
	
	test('jslet.Dataset: clone', function() {
		var fldCnt = dsEmpClone.getFields().length;
		ok(fldCnt == 3, 'jslet.Dataset field count equals 3');
		
		ok(dsEmpClone.keyField() === null, 'jslet.Dataset key field name is null');
		ok(dsEmpClone.nameField() == 'name', 'jslet.Dataset name field name is not null' );
	});
	
	test('jslet.Dataset: clone without arguments', function() {
		var dsTemp = dsEmp.clone();
		var fldCnt = dsTemp.getFields().length;
		ok(fldCnt == 18, 'jslet.Dataset field count equals 18');

		ok(dsTemp.name() == 'employee_clone', 'jslet.Dataset name is "employee_clone"');

		ok(dsTemp.keyField() == 'workerid', 'jslet.Dataset key field name is "workerid"');
		ok(dsTemp.codeField() == 'workerid', 'jslet.Dataset code field name is "workerid"');
		ok(dsTemp.nameField() == 'name', 'jslet.Dataset name field name is "name"');
		
		dsTemp.destroy();
	});

	test('jslet.Dataset: addFieldFromDataset', function() {
		dsEmpClone.addFieldFromDataset(dsEmp, ['gender']);
		
		var fldCnt = dsEmpClone.getFields().length;
		ok(fldCnt == 4, 'jslet.Dataset field count equals 4');
		
		ok(dsEmpClone.getField('gender') !== null, 'Field "gender" is added sucessfully');
		
		throws(function(){
			dsEmpClone.addFieldFromDataset('employee', ['gender']);;
		}, 'The first argument is invalid.');
		
		throws(function(){
			dsEmpClone.addFieldFromDataset(dsEmp, 'gender');;
		}, 'The second argument is invalid.');
	});
	
	test('jslet.Dataset: pageSize()', function() {
		dsEmp.pageSize(100);
		ok(dsEmp.pageSize() == 100, 'jslet.Dataset pageSize() is 100');

		throws(function(){
			dsEmp.pageSize('String value');
		}, 'The argument must be numberic.');

		throws(function(){
			dsEmp.pageSize(-100);
		}, 'The argument must be greater than 0.');
	});
	
	test('jslet.Dataset: pageNo()', function() {
		dsEmp.pageNo(10);
		ok(dsEmp.pageNo() == 10, 'jslet.Dataset pageNo() is 10');

		throws(function(){
			dsEmp.pageNo('String value');
		}, 'The argument must be numberic.');	

		throws(function(){
			dsEmp.pageSize(-100);
		}, 'The argument must be greater than 0.');
	});
	
	test('jslet.Dataset: autoShowError()', function() {
		dsEmp.autoShowError(true);
		ok(dsEmp.autoShowError() === true, 'jslet.Dataset autoShowError(Boolean) is true');

		dsEmp.autoShowError(100);
		ok(dsEmp.autoShowError() === true, 'jslet.Dataset autoShowError(Number) is true');
	});
	
	test('jslet.Dataset: autoRefreshHostDataset()', function() {
		dsEmp.autoRefreshHostDataset(true);
		ok(dsEmp.autoRefreshHostDataset() === true, 'jslet.Dataset autoRefreshHostDataset(Boolean) is true');

		dsEmp.autoRefreshHostDataset(100);
		ok(dsEmp.autoShowError() === true, 'jslet.Dataset autoRefreshHostDataset(Number) is true');
	});
	
	test('jslet.Dataset: setVisibleFields()', function() {
		dsEmp.setVisibleFields(['name', 'age']);
		var fields = dsEmp.getFields(), 
			fldObj, vCnt = 0;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.visible()) {
				vCnt++;
			}
		}
		ok(vCnt == 2, 'setVisibleFields successfully');

		throws(function(){
			dsEmp.setVisibleFields('age');
		}, 'The argument must be String[].');
	});
	
	test('jslet.Dataset: datasetField()', function() {
		throws(function(){
			dsEmp.datasetField('age');
		}, 'The argument must be a field object.');
	});
	
	test('jslet.Dataset: addField(fldObj) and removeField(fldName)', function() {
		var fldObj = jslet.data.createStringField('tempFld', 20);
		dsEmp.addField(fldObj);
		ok(dsEmp.getField('tempFld') !== null, 'addField successfully');
		
		dsEmp.removeField('tempFld');
		ok(dsEmp.getField('tempFld') === null, 'removeField successfully');
		
		throws(function(){
			dsEmp.addField('tmpFld');
		}, 'The argument must be a field object.');
		
		throws(function(){
			dsEmp.removeField(fldObj);
		}, 'The argument must be field name.');
	});
	
	test('jslet.Dataset: getField(fldName)', function() {
		ok(dsEmp.getField('age') !== null, 'getField successfully');

		ok(dsEmp.getField('Not-exist-field') === null, 'getField with error field name will return null');

		ok(dsEmp.getField('department.deptid') !== null, 'Get lookup field successfully');		
		
		throws(function(){
			dsEmp.getField(123);
		}, 'The argument must be field name.');
	});
	
	test('jslet.Dataset: getTopField(fldName)', function() {
		var dsSum = jslet.data.getDataset('salesum');
		var fldObj = dsSum.getTopField('a1010');
		ok(fldObj.name() == 'y10', 'get top field successfully');		
		ok(dsSum.getTopField('y10').name() === 'y10', 'Get top field with the non-group field name');		

		ok(dsSum.getTopField('not-exist-field') === null, 'Get top field with the not-exist-field');		

		throws(function(){
			dsSum.getTopField(123);
		}, 'The argument must be field name.');
	});
	
	test('jslet.Dataset: indexFields(indFlds)', function() {
		dsEmp.indexFields('name desc,age');
		ok(dsEmp.indexFields() === 'name desc,age', 'Set index fields successfully');		

		throws(function(){
			dsEmp.indexFields(123);
		}, 'The argument must be string value.');
	});
	
	test('jslet.Dataset: filter(filter), filtered() and recordCount()', function() {
		dsEmp.filter('[name]=="Tom"');
		dsEmp.filtered(true);
		ok(dsEmp.filter() === '[name]=="Tom"', 'Set data filter successfully');
		ok(dsEmp.recordCount() === 1, 'Set data filter successfully');
		dsEmp.filtered(false);
		ok(dsEmp.recordCount() > 1, 'Set data filter successfully');
		dsEmp.filtered(true);
		dsEmp.filter('');
		ok(dsEmp.recordCount() > 1, 'Set data filter successfully');
		
		throws(function(){
			dsEmp.indexFields(123);
		}, 'The argument must be string value.');
	});
	
	test('jslet.Dataset: recno(recno)', function() {
		dsEmp.recno(1);
		ok(dsEmp.recno() === 1, 'Set recno successfully');		
		dsEmp.recno(10000);
		ok(dsEmp.recno() === dsEmp.recordCount() - 1, 'Set recno successfully');		

		throws(function(){
			dsEmp.recno('string_v');
		}, 'The argument must be numberic value.');
		
		throws(function(){
			dsEmp.recno(-10);
		}, 'The argument must be greater than 0.');
	});
	
	test('jslet.Dataset: abort() and aborted()', function() {
		dsEmp.abort();
		ok(dsEmp.aborted(), 'Abort successfully');
	});
	
	test('jslet.Dataset: moveToRecord()', function() {
		dsEmp.last();
		var lastRecno = dsEmp.recno();
		var recObj = dsEmp.getRecord();
		dsEmp.first();
		var firstRecno = dsEmp.recno();
		
		dsEmp.moveToRecord(recObj);
		ok(dsEmp.recno() == lastRecno && firstRecno === 0, 'moveToRecord successfully');

		throws(function(){
			dsEmp.moveToRecord(null);
		}, 'The argument is required.');
		
		throws(function(){
			dsEmp.moveToRecord(10);
		}, 'The argument must be an Object.');
	});
	
	test('jslet.Dataset: first(), last(), next(), prior(), isBof() and isEof()', function() {
		dsEmp.first();
		dsEmp.prior();
		ok(dsEmp.isBof() && !dsEmp.isEof(), 'first() and isBof() successfully');
		
		dsEmp.next();
		ok(!dsEmp.isBof() && !dsEmp.isEof() && dsEmp.recno() == 1, 'next() successfully');
		
		dsEmp.last();
		dsEmp.next();
		ok(dsEmp.isEof() && !dsEmp.isBof(), 'last() and isEof() successfully');
		
		dsEmp.prior();
		ok(!dsEmp.isBof() && !dsEmp.isEof() && dsEmp.recno() == dsEmp.recordCount() - 2, 'prior() successfully');
	});
	
	test('jslet.Dataset: insertRecord(), deleteRecord(), appendRecord(), confirm()', function() {
		dsEmp.insertRecord();
		dsEmp.setFieldValue('workerid', 1000);
		dsEmp.setFieldValue('name', 'Temp01');
		dsEmp.confirm();
		ok(dsEmp.find('[workerid] == 1000'), 'insertRecord() successfully');

		dsEmp.appendRecord();
		dsEmp.setFieldValue('workerid', 1001);
		dsEmp.setFieldValue('name', 'Temp02');
		dsEmp.confirm();
		ok(dsEmp.find('[workerid] == 1001'), 'insertRecord() successfully');
		
		dsEmp.find('[workerid] == 1000');
		dsEmp.deleteRecord();
		ok(!dsEmp.find('[workerid] == 1000'), 'deleteRecord() successfully');
		
		dsEmp.find('[workerid] == 1001');
		dsEmp.deleteRecord();
		ok(!dsEmp.find('[workerid] == 1001'), 'deleteRecord() successfully');
	});
	
	
})
