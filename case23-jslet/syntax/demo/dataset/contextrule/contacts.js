var dsContactType = jslet.data.createEnumDataset('ContactType', 'I:Individual,O:Organization'); 
var dsContactStatus = jslet.data.createEnumDataset('ContactStatus', 'E:Enabled,D:Disabled'); 
var dsGender = jslet.data.createEnumDataset('Gender', 'F:Female,M:Male'); 
var dsPerferChannel = jslet.data.createEnumDataset('PerferChannel', '01:Postal Mail,02:Phone,03:Email'); 
var dsRace = jslet.data.createEnumDataset('Race', '01:Brown,02:Yellow,03:White'); 

var salutationFldCfg =[
   	{ name: 'code', type: 'S', length: 2, label: 'Code'},
	{ name: 'name', type: 'S', length: 30, label: 'Name'},
	{ name: 'gender', type: 'S', length: 30, label: 'Gender' }
];
dsSalutation = jslet.data.createDataset('Salutation', salutationFldCfg, {keyField: 'code', codeField: 'code', nameField: 'name'});

dsSalutation.dataList([
	{code:'Sir', name:'Sir', gender: 'M'},
	{code:'Gentleman', name:'Gentleman', gender: 'M'},
	{code:'Mr', name:'Mr.', gender: 'M'},
	{code:'Miss', name:'Miss', gender: 'F'},
	{code:'Madam', name:'Madam', gender: 'F'},
	{code:'Mrs', name:'Mrs.', gender: 'F'},
	{code:'Dr', name:'Dr.', gender: 'B'}
]);

var countryFldCfg = [
	{ name: 'code', type: 'S', length: 2, label: 'Country Code', displayWidth: 6, editMask: {mask:'LL',transform: 'upper'}, required: true },
	{ name: 'name', type: 'S', length: 30, label: 'Country Name', displayWidth: 20, required: true },
	{ name: 'phoneMask', type: 'S', length: 30, label: 'Phone Mask', displayWidth: 20 },
	{ name: 'ssnMask', type: 'S', length: 30, label: 'SSN Edit Mask', displayWidth: 20 },
	{ name: 'idCardMask', type: 'S', length: 20, label: 'ID Card Mask', displayWidth: 20},
	{ name: 'driverLicenseMask ', type: 'S', length: 20, label: 'Driver\'s License Number Mask', displayWidth: 20}
];

var dsCountry = jslet.data.createDataset('Country', countryFldCfg, {keyField: 'code', codeField: 'code', nameField: 'name'}); 

dsCountry.dataList([
 {code:'CN', name:'China', phoneMask: '(86)9009-00000009',ssnMask: 'NO999999', idCardMask: '',driverLicenseMask:''},
 {code:'US', name:'United State', phoneMask: '(1)9009-00000009',ssnMask: 'US999999', idCardMask: '',driverLicenseMask:''}
]);

var contactFldCfg = [
  	{ name: 'id', type: 'N', length: 8, label: 'Num#', displayWidth: 6, diaplayFormat: '##0' },
  	{ name: 'contactType', type: 'S', length: 1, label: 'Contact Type', defaultValue: 'I', 
  		lookup: {dataset: 'ContactType'},editControl:"DBRadioGroup", tip: 'Change it and check other fields.' },
  	{ name: 'firstName', type: 'S', length: 10, label: 'First Name', required: true },
  	{ name: 'lastName', type: 'S', length: 20, label: 'Last Name', required: true },
  	{ name: 'gender', type: 'S', length: 1, label: 'Gender', required: true, lookup: {dataset: 'Gender'},tip: 'Change it and check "Salutation" field.' },
  	{ name: 'salutation', type: 'S', length: 1, label: 'Salutation',lookup: {dataset: 'Salutation'} },
  	
  	{ name: 'title', type: 'S', length: 10, label: 'Title'},
    { name: 'country', type: 'S', length: 2, label: 'Country', displayWidth: 10, required: true, defaultValue: 'US',
  		lookup: {dataset: 'Country'}, tip: 'Change it and check the edit mask of "Phone", "SSNCode" etc.' },
    { name: 'city', type: 'S', length: 15, label: 'City', displayWidth: 10 },
    { name: 'birthday', type: 'D', label: 'Birthday'},
  	{ name: 'phone', type: 'S', length: 12, label: 'Phone' },
  	{ name: 'ssnCode', type: 'S', length: 20, label: 'SSN Code', displayWidth: 10 },
  	{ name: 'idCardNum', type: 'S', length: 20, label: 'ID Card#', displayWidth: 10 },
  	{ name: 'driverLicenseNum', type: 'S', length: 20, label: 'Driver\'s License#', displayWidth: 10 },
  	{ name: 'race', type: 'S', length: 1, label: 'Race',lookup: {dataset: 'Race'} },
  	{ name: 'perferChannel', type: 'S', length: 1, label: 'Perfer Channel',lookup: {dataset: 'PerferChannel'} },
  	{ name: 'contactStatus', type: 'S', length: 1, label: 'Contact Status',lookup: {dataset: 'ContactStatus'} },
  	{ name: 'notes', type: 'S', length: 30, label: 'Notes', displayWidth: 10 }
];

var dsContact = jslet.data.createDataset('Contact', contactFldCfg, {keyField: 'id'});
dsContact.dataList([
	{id:1, contactType: 'I', firstName: 'Tom', lastName: 'Zeng', gender: 'M',title:'PM',
	country:'CN',contactStatus: 'E',perferChannel:'03',race:'02', salutation: 'Sir'},
	{id:2, contactType: 'O',title:'Google', country:'US',contactStatus: 'E',perferChannel:'02'}
]);