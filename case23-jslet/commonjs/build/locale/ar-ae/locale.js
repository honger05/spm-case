/* ========================================================================
 * Jslet framework: jslet.locale.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * Arab language pack
 */
(function () {
	var locale = {};
	locale.isRtl = true;//false: direction = 'ltr', true: direction = 'rtl'

	locale.Common = {
		jsonParseError: 'Can\'t parse JSON string: {0}'		
	};
		
	locale.Date = {
		format: 'dd/MM/yyyy'
	};
	
	locale.Dataset = {
		invalidDateFieldValue: 'Invalid value for date field: {0}!',
		fieldNotFound:  'Undefined field: {0}!',
		valueNotFound: ' Not find the value!',
		lookupNotFound: 'Field: {0} not set the lookup field, you can not use the field chain!',
		datasetFieldNotBeSetValue: 'Field: {0} is readonly!',
		datasetFieldNotBeCalculated: 'Cannot calculated by field: {0}!',
		insertMasterFirst: 'Add data to master dataset first!',
		lookupFieldExpected: 'Field: {0} must be lookup field!',
		invalidLookupField: 'Invalid lookup field: {0}!',
		invalidContextRule: 'Invalid context rule in field: [{0}]!',
		fieldValueRequired: '[{0}] cannot be null!',
		invalidFieldTranslate: 'Properties: displayValueField and inputValueField required in field: {0}!',
		translateListenerRequired: 'Event listener: translateListener required!',
		minMaxValueError: 'Min value must less than and equal to max value in Field: [{0}]!',
		invalidDate: 'Invalid date!',
		invalidInt: 'Only:0-9,- allowed!',
		invalidFloat: 'Only:0-9,-,. allowed',
		invalidIntegerPart: 'Invalid integer part, expected length：{0}, actual length：{1}!',
		invalidDecimalPart: 'Invalid decimal part, expected length：{0}, actual length：{1}!',
		cannotConfirm: 'Exists invalid data, check it first!',
		notInRange: 'يجب أن تكون قيمة الإدخال في نطاق: {0} إلى {1}', //Input value must be in range: {0} to {1}
		lessThanValue: 'Input value must less than: {0}',
		moreThanValue: 'Input value must more than: {0}',
		cannotDelParent: 'Cannot delete record which has children!',
		notUnique: 'Input value is not unique!',
		
		betweenLabel: ' - ',
		value: 'Value',
		nullText: '(Empty)',
		noDataSubmit: 'No data to submit!'
	};
	
	locale.DBControl = {
		datasetNotFound: 'Can not find the dataset: {0}!',
		expectedProperty: 'Property value: {0} expected!',
		propertyValueMustBeInt: 'Property: {0} must be number!',
		jsletPropRequired: 'Poperty:jslet required!',
		invalidHtmlTag: 'Invalid attached HTML tag，reference: {0} !',
		invalidJsletProp: 'Parameter NOT meet the JSON specification: {0}'
	};
	
	locale.DBImage = {
		lockedImageTips: 'Image locked'
	};
	
	locale.DBChart = {
		onlyNumberFieldAllowed: 'Number type field expected!'
	};
	
	locale.DBCheckBoxGroup = {
		invalidCheckedCount: 'Not exceed {0} items!'
	};
	
	locale.DBBetweenEdit = {
		betweenLabel: '-'
	};
	
	locale.DBPageBar = {
		pageSizeLabel: '/P ',
		pageNumLabel: 'No. ',
		pageCountLabel: 'total: {0} '
	};
	
	locale.DBComboSelect = { 
		find: 'Find: '
	};
	
	locale.MessageBox = { 
		ok: 'OK',
		cancel: 'Cancel',
		yes: 'Yes',
		no: 'No',
		info: 'Message',
		error: 'Error',
		warn: 'Warn',
		confirm: 'Confirm',
		prompt: 'Please input: '
	};
	
	locale.Calendar = { 
		yearPrev: 'Prev year',
		monthPrev: 'Prev month',
		yearNext: 'Next year',
		monthNext: 'Next month',
		Sun: 'Su',
		Mon: 'Mo',
		Tue: 'Tu',
		Wed: 'We',
		Thu: 'Th',
		Fri: 'Fr',
		Sat: 'Sa',
		today: 'Today',
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		firstDayOfWeek: 0
	};
	
	locale.DBTreeView = { 
		expandAll: 'Expand all',
		collapseAll: 'Collapse all',
		checkAll: 'Select all',
		uncheckAll: 'Unselect all'
	};
	
	locale.TabControl ={ 
		close: 'Close',
		closeOther: 'Close Other'
	};
	
	locale.DBTable = { 
		norecord: 'No Records',
		sorttitle: 'Press Ctrl to sort by multiple column',
		totalLabel: 'Total'
	};
	
	if (window.jslet === undefined || jslet === undefined){
		jslet=window.jslet = function(id){
			var ele = jQuery(id)[0];
			return (ele && ele.jslet)?ele.jslet:null;
		};
	}
	jslet.locale = locale;
})();
