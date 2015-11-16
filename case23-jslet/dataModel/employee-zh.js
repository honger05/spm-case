//Define Dataset Object
(function () {
    var lkf, dataList;
    //Dataset object: Gender. There are two fields in enum dataset: code, name
    var dsGender = jslet.data.createEnumDataset('gender', 'F:女,M:男,U:未知');
  //------------------------------------------------------------------------------------------------------

    //Dataset object: Position
    var dsPosition = jslet.data.createEnumDataset('position', '0:Senior Manger,1:Junior Manger,2:Team Leader,3:Employee');
  //------------------------------------------------------------------------------------------------------
    
    //Dataset object: Province
    //Global variable for demo
    dsProvince = jslet.data.createEnumDataset('province',
    		'01:Anhui,02:Beijing,03:Fujian,04:Gansu,05:Guangdong,06:Guangxi,' + 
    		 '07:Guizhou,08:Hainan,09:Hebei,10:Henan,11:Hei Nongjiang,12:Hubei,'+
             '13:Hunan,14:Jilin,15:Jiangsu,16:Jiangxi,17:Liaoning,18:Neimenggu,'+
             '19:Ningxia,20:Qinghai,21:Shangdong,22:Shangxi,23:Shanxi,24:Shanghai,'+
             '25:Sichuan,26:Tianjing,27:Xizang,28:Xinjiang,29:Yunnan,30:Zhejiang,31:Chongqing');
  //------------------------------------------------------------------------------------------------------

    //Dataset object: Department
    var fldCfg = [{
        name: 'deptid',
        type: 'S',
        length: 10,
        label: 'ID'
    }, {
        name: 'name',
        type: 'S',
        length: 20,
        label: 'Dept. Name'
    }, {
        name: 'address',
        type: 'S',
        length: 20,
        label: 'Address'
    }, {
        name: 'parentid',
        type: 'S',
        length: 10,
        label: 'ParentID'
    }];

    var dsDept = jslet.data.createDataset('department', fldCfg, 
    		{keyField: 'deptid',codeField: 'deptid', nameField: 'name', 
    		parentField: 'parentid', autoRefreshHostDataset: true});

    var data = [{
        deptid: '00',
        name: 'Admin Dept.',
        address: 'Shenzhen',
        parentid: ''
    }, {
        deptid: '01',
        name: 'Marketing Dept.',
        address: 'Beijing',
        parentid: ''
    }, {
        deptid: '0101',
        name: 'Chengdu Branch.',
        address: 'Chengdu',
        parentid: '01'
    }, {
        deptid: '0102',
        name: 'Shanghai Branch ',
        address: 'Shanghai',
        parentid: '01'
    }, {
        deptid: '02',
        name: 'Dev. Dept.',
        address: 'Shenzhen',
        parentid: ''
    }, {
        deptid: '0201',
        name: 'Dev. Branch 1',
        address: 'Shenzhen',
        parentid: '02'
    }, {
        deptid: '0202',
        name: 'Dev. Branch 2',
        address: 'Shenzhen',
        parentid: '02'
    }, {
        deptid: '03',
        name: 'QA',
        address: 'Shenzhen',
        parentid: ''
    }, {
        deptid: '04',
        name: 'FA Dept.',
        address: 'Shenzhen',
        parentid: ''
    }];
    dsDept.dataList(data);//In real environment, you can call dataset.applyQuery() to retrieve data from server
  //------------------------------------------------------------------------------------------------------

    //Dataset object: Employee
    //Global variable
    dsEmployee = new jslet.data.Dataset('employee');

    //Define fields and add to dsEmployee
    var fldObj = jslet.data.createNumberField('workerid');
    fldObj.label('工号');
    fldObj.required(true);
    fldObj.displayWidth(6);
    fldObj.tip('Employee ID must be unique!');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('name', 20);
    fldObj.label('姓名');
    fldObj.required(true);
    fldObj.unique(true);
    fldObj.tip('姓名必填并且唯一');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('department', 20);
    fldObj.label('部门');
    fldObj.required(false);
    fldObj.nullText('(Empty)');
    lkf = new jslet.data.FieldLookup();
    lkf.dataset(dsDept);
    fldObj.lookup(lkf);

    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('gender', 20);
    fldObj.label('性别');
    lkf = new jslet.data.FieldLookup();
    lkf.dataset(dsGender);
    fldObj.lookup(lkf);
    fldObj.displayWidth(16);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createNumberField('age', 5, 0);
    fldObj.label('年龄');
    fldObj.displayWidth(6);
    fldObj.dataRange({ from: 0, to: 100 });
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createBooleanField('married');
    fldObj.label('Married');
    fldObj.trueValue = 1;
    fldObj.falseValue = 0;
    fldObj.displayWidth(10);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createDateField('birthday');
    fldObj.label('出生日期');
    fldObj.displayFormat('yyyy-MM-dd');
    fldObj.dataRange({ from: new Date(1950, 1, 1) });
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('position', 20);
    fldObj.label('Position');
    lkf = new jslet.data.FieldLookup();
    lkf.dataset(dsPosition);
    fldObj.lookup(lkf);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createNumberField('salary', 16, 2);
    fldObj.label('薪水');
    fldObj.displayFormat('￥#,##0.00');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('university', 50);
    fldObj.label('University');
    fldObj.displayWidth(20);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('province', 20);
    fldObj.label('Province');
    lkf = new jslet.data.FieldLookup();
    lkf.dataset(dsProvince);
    fldObj.lookup(lkf);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('city', 8);
    fldObj.label('City');
    fldObj.visible(false);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('photo', 20);
    fldObj.label('Photo');
    fldObj.visible(false);
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('officephone', 12);
    fldObj.label('办公电话');
    fldObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, '无效电话号码!');//like: 0755-12345678
    fldObj.tip('格式:999-99999999');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('cellphone', 12);
    fldObj.label('移动电话');
    fldObj.regularExpr(/1\d{10}/ig, '无效移动电话!');//like: 13912345678
    fldObj.tip('"1"+10 数字');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('email', 30);
    fldObj.label('Email');
    fldObj.regularExpr(/^[a-zA-Z_0-9-'\+~]+(\.[a-zA-Z_0-9-'\+~]+)*@([a-zA-Z_0-9-]+\.)+[a-zA-Z]{2,7}$/ig, '无效Email地址!');//like: foo@gmail.com
    fldObj.tip('foo@foo.com');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('idcard', 18);
    fldObj.label('身份证号');
    fldObj.regularExpr(/\d{15}|\d{18}/ig, 'Invalid IDCard number, 15 or 18 digits allowed!');//like: 15 or 18 digits
    fldObj.tip('15或者18 数字');
    dsEmployee.addField(fldObj);

    fldObj = jslet.data.createStringField('summary', 200);
    fldObj.label('Summary');
    fldObj.displayWidth(10);
    fldObj.visible(false);
    dsEmployee.addField(fldObj);

    dsEmployee.keyField('workerid');
    dsEmployee.codeField('workerid');
    dsEmployee.nameField('name');

    //Add data into dsEmployee
    var dataList = [{
        workerid: 1,
        name: 'Tom',
        department: '01',
        gender: 'M',
        age: 48,
        birthday: new Date(1961, 1, 23),
        province: '01',
        city: '0110',
        position: '1',
        married: 1,
        university: 'Peking University',
        photo: '1.jpg',
        salary: 1000
    },

    {
        workerid: 2,
        name: 'Marry',
        department: '03',
        gender: 'F',
        age: 26,
        birthday: new Date(1983, 8, 23),
        province: '02',
        city: '0201',
        position: '2',
        married: 0,
        university: 'Harvard University',
        photo: '2.jpg',
        salary: 2000
    },

    {
        workerid: 3,
        name: 'Jerry',
        department: '02',
        gender: 'M',
        age: 32,
        birthday: new Date(1977, 5, 22),
        province: '13',
        city: '1305',
        position: '3',
        married: 1,
        university: 'TsingHua University',
        photo: '3.jpg',
        salary: 3200
    },

    {
        workerid: 4,
        name: 'John',
        department: '00',
        gender: 'M',
        age: 48,
        birthday: new Date(1961, 1, 6),
        province: '13',
        city: '1311',
        position: '0',
        married: 1,
        university: 'Peking University',
        photo: '4.jpg',
        salary: 7800
    },

    {
        workerid: 5,
        name: 'Monica',
        department: '04',
        gender: 'F',
        age: 38,
        birthday: new Date(1971, 8, 23),
        province: '06',
        city: '0605',
        position: '1',
        married: 0,
        university: 'Cambridge University',
        photo: '5.jpg',
        salary: 5000
    },

    {
        workerid: 6,
        name: 'Ted',
        department: '02',
        gender: 'U',
        age: 26,
        birthday: new Date(1983, 7, 12),
        province: '06',
        city: '0606',
        position: '3',
        married: 0,
        university: 'Cambridge University',
        photo: '6.jpg',
        salary: 3000
    },

    {
        workerid: 7,
        name: 'Jack',
        department: '02',
        gender: 'M',
        age: 26,
        birthday: new Date(1983, 9, 12),
        province: '06',
        city: '0606',
        position: '3',
        married: 0,
        university: 'MIT',
        photo: '6.jpg',
        salary: 3000
    },

    {
        workerid: 8,
        name: 'Mike',
        department: '02',
        gender: 'M',
        age: 26,
        birthday: new Date(1983, 8, 12),
        province: '06',
        city: '0606',
        position: '3',
        married: 0,
        university: 'MIT',
        photo: '6.jpg',
        salary: 3000
    },

    {
        workerid: 9,
        name: 'Jessica',
        department: '03',
        gender: 'F',
        age: 25,
        birthday: new Date(1984, 8, 23),
        province: '03',
        city: '0307',
        position: '3',
        married: 1,
        university: 'Harvard University',
        photo: '7.jpg',
        salary: 8000
    }];
    // Set field context rule
    // var contextRule = new jslet.data.ContextRule(dsEmployee);
    // contextRule.addRuleItem('city',null,'[province]==[human!province]',null);
    // dsEmployee.contextRule(contextRule);
    // dsEmployee.enableContextRule();
    dsEmployee.dataList(dataList);//In real environment, you can call dataset.applyQuery() to retrieve data from server
})();
