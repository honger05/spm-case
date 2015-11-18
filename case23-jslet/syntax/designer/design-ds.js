// define Dataset Object
var lkf,dataList;

var dsFieldDatatype = jslet.data.createEnumDataset('fieldDatatype', 'S:String,N:Number,D:Date,B:Boolean,V:Dataset,G:Group'); 
var dsFieldAlignment = jslet.data.createEnumDataset('fieldAlignment', 'left:Left,center:Center,right:Right'); 
var dsFieldUrlTarget = jslet.data.createEnumDataset('fieldUrlTarget', '_blank:Blank,_parent:Parent,_self:Self,_top:Top');
//var dsValueStyle = jslet.data.createEnumDataset('valueStyle', '0:Normal,1:Between style value,2:Multiple value');
var dsValueStyle = jslet.data.createEnumDataset('valueStyle', {'0':'Normal','1':'Between style value','2':'Multiple value'});

var dsFieldEditor = jslet.data.createEnumDataset('fieldEditor', 
'DBText:Text Control,DBDataLabel:Data Label Control,DBPassword:Password Control,DBTextArea:TextArea Control,DBSpinEdit:Spin Edit Control,DBCheckBox:Checkbox Control,'+
'DBCheckBoxGroup:Checkbox Group Control,DBRadioGroup:Radio Group Control,DBSelect:Select Control,DBRangeSelect:Range Select Control,DBComboSelect:Popup Dropdown Control,' + 
'DBAutoComplete:AutoComplete Control,DBDatePicker:DatePicker Control,DBImage:Image Control,DBRating:Rating Control,DBHtml:Html Display,DBRating:Rating Control,DBBetweenEdit:Between style editor'
);

var fldCfg = [
	{ name: 'name', type: 'S', length: 30, label: 'Field Name', displayWidth: 20, required: true },
	{ name: 'label', type: 'S', length: 30, label: 'Field Label', displayWidth: 20 },
	{ name: 'tip', type: 'S', length: 30, label: 'Field Tips', displayWidth: 20 },
	{ name: 'type', type: 'S', length: 1, label: 'Data Type', lookup: '{dataset:"fieldDatatype"}', displayWidth: 10, defaultValue:'S' },
    { name: 'subDataset', type: 'S', length: 30, label: 'Sub-Dataset Name', displayWidth: 10 },
	{ name: 'length', type: 'N', length: 3, label: 'Data Length', displayWidth: 10, diaplayFormat: '##0', editControl: 'DBSpinEdit' },
	{ name: 'scale', type: 'N', length: 3, label: 'Data Scale', displayWidth: 6, diaplayFormat: '##0', editControl:'DBSpinEdit'},
	{ name: 'defaultExpr', type: 'S', length: 100, label: 'Default Value Expr', displayWidth: 10 },
	{ name: 'valueStyle', type: 'S', label: 'Value Style', displayWidth: 10, lookup: {dataset:"valueStyle"},defaultValue: '0' },

	{ name: 'displayWidth', type: 'N', length: 3, label: 'Display Width', displayWidth: 10, diaplayFormat: '##0',editControl:'DBSpinEdit'},
	{ name: 'displayOrder', type: 'N', length: 3, label: 'Display Order', displayWidth: 6, defaultValue: 0, diaplayFormat: '##0', editControl:'DBSpinEdit' },
	{ name: 'alignment', type: 'S', length: 3, label: 'Alignment', displayWidth: 10, lookup: '{dataset:"fieldAlignment"}' },
	{ name: 'displayFormat', type: 'S', length: 30, label: 'Display Format', displayWidth: 10 },
	{ name: 'editControl', type: 'S', length: 100, label: 'Editor', displayWidth: 10, lookup: '{dataset:"fieldEditor"}',required:false,nullText:'(auto)' },

	{ name: 'formula', type: 'S', length: 100, label: 'Formula', displayWidth: 10 },
	{ name: 'readOnly', type: 'B', label: 'ReadOnly', displayWidth: 10 },
	{ name: 'visible', type: 'B', label: 'Visible', displayWidth: 10 },
	{ name: 'unitConverted', type: 'B', label: 'Unit Conversion', displayWidth: 10 },

	{ name: 'required', type: 'B', label: 'required', displayWidth: 10 },
	{ name: 'dataRange', type: 'S', length: 50, label: 'Data Range', displayWidth: 10 },
	{ name: 'regularExpr', type: 'S', length: 50, label: 'Regular Expression', displayWidth: 10 },

	{ name: 'lookup', type: 'S', length: 100, label: 'Lookup Field', displayWidth: 10 },
	{ name: 'urlExpr', type: 'S', length: 100, label: 'HyperLink Expression', displayWidth: 10 },
	{ name: 'urlTarget',type:'S',length:10,label:'HyperLink Target',lookup:'{dataset:"fieldUrlTarget"}'}

];

var dsFieldCfg = jslet.data.createDataset('fieldCfg', fldCfg, {keyField: 'name', codeField: 'name', nameField: 'label'});

fldCfg = [
	{ name: 'name', type: 'S', length: 30, label: 'Dataset Name', displayWidth: 20, required: true },
	{ name: 'description', type: 'S', length: 100, label: 'description', displayWidth: 20 },
	{ name: 'keyField', type: 'S', length: 30, label: 'ID Field', displayWidth: 10,required: false },
	{ name: 'inputValueField', type: 'S', length: 30, label: 'Code Field', displayWidth: 10 },
	{ name: 'displayValueField', type: 'S', length: 30, label: 'Name Field', displayWidth: 10 },
	{ name: 'parentField', type: 'S', length: 30, label: 'Parent ID Field', displayWidth: 10 },
	{ name: 'fields', type: 'V', label: 'fields',subDataset:'fieldCfg', visible:false }
    ];

var dsDatasetCfg = jslet.data.createDataset('datasetCfg', fldCfg);
delete fldCfg;

var data = [{ name: "employee", description: "Employee(Sample)", fields: 
	[{index: 0, name: "workerid", label: "ID", type: "N", length: 10, required: true, valueStyle: '0' }, 
	 {index: 1, name: "name", label: "Name", type: "S", length: 20, required: true, valueStyle: '0'}, 
	 {index: 2, name: "gender", description: "Gender", type: "S", lookup: "{dataset: 'gender'}", nullText:"(Empty)", valueStyle: '0'},
	 {index: 5, name: "age", label: "Age", type: "N", length: 6, valueStyle: '0'}, 
	 {index: 7, name: "married", label: "Married", type: "B", valueStyle: '0'}, 
	 {index: 8, name: "birthday", label: "Birthday", type: "D", valueStyle: '0'}, 
	 {index: 10, name: "position", description: "Position", type: "S", lookup: "{dataset: 'position'}", nullText:"(Empty)", valueStyle: '0'}
	 ]
	}];
dsDatasetCfg.dataList(data);

delete data;


//---------Construct sample data -----//
//Dataset object: Gender. There are two fields in enum dataset: code, name
var dsGender = jslet.data.createEnumDataset('gender', {'F':'Female','M':'Male','U':'Unknown'});
//------------------------------------------------------------------------------------------------------

//Dataset object: Position
var dsPosition = jslet.data.createEnumDataset('position',{'0':'Senior Manger','1':'Junior Manger','2':'Team Leader','3':'Employee'});
//------------------------------------------------------------------------------------------------------
