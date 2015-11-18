(function () {
	function getRandomChar(){
		return String.fromCharCode(65 + Math.round(Math.random()*25));// + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	
	//Generate very large test data: 5000 records 
	function generateLargeData(){
		var data = [], rec, code1, code2, m=1, id1, id2;
		for(var i = 1; i <= 3; i++){
			code1 = i;
			if(i < 10)
				code1 ='00' + i;
			else
			if(i < 100)
				code1 = '0' + i;
			else
				code1 = i;
			
			id1 = m++;
			rec = {id: id1, code: code1, name: getRandomChar() + code1, iconcls: 'folderIcon'};
			data.push(rec);
			for(var j = 1; j < 2; j++){
				code2 = code1+ (j < 10 ? '0': '')+j;
				id2 = m++;
				rec = {id: id2, code: code2, name: getRandomChar() + code2, parentid: id1, iconcls: 'folderIcon'};
				data.push(rec);
				for(var k = 1; k < 11; k++){
					code3 = code2+(k < 10 ? '0': '') + k;
					rec = {id: m++, code: code3, name: getRandomChar() + code3, parentid: id2, iconcls: 'fileIcon'};
					data.push(rec);
				}
			}
		}
		return data;
	}
	
	
	dsAgency = new jslet.data.Dataset("dsAgency");
	var fldObj = jslet.data.createNumberField("id", 10);
	fldObj.label("ID");
	fldObj.required(true);
	dsAgency.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("parentid", 10);
	fldObj.label("ParentID");
	fldObj.readOnly(true);
	dsAgency.addField(fldObj);
	
	fldObj = jslet.data.createStringField("code", 10);
	fldObj.label("Code");
	fldObj.required(true);
	dsAgency.addField(fldObj);
	
	fldObj = jslet.data.createStringField("name", 60);
	fldObj.displayWidth(20);
	fldObj.label("Name");
	fldObj.required(true);
	dsAgency.addField(fldObj);
	
	fldObj = jslet.data.createStringField("iconcls", 10);
	fldObj.label("Icon Style Class");
	dsAgency.addField(fldObj);
	
	dsAgency.keyField("id");
	dsAgency.codeField("code");
	dsAgency.nameField("name");
	dsAgency.parentField("parentid");
	
	dsAgency.dataList(generateLargeData());
	
	var cloneDs = dsAgency.clone('selectableAgency');
	cloneDs.dataList(dsAgency.dataList());
})();
