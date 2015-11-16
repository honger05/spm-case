/* ========================================================================
 * Jslet framework: jslet.field.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class Field 
 * 
 * @param {String} fieldName Field name
 * @param {jslet.data.DataType} dataType Data type of field
 */
jslet.data.Field = function (fieldName, dataType) {
	jslet.Checker.test('Field#fieldName', fieldName).isString();
	fieldName = jQuery.trim(fieldName);
	jslet.Checker.test('Field#fieldName', fieldName).required();
	jslet.Checker.test('Field#dataType', dataType).isString().required();

	var Z = this;
	Z._dataset = null;
	Z._dsName = null;
	Z._displayOrder = 0;
	Z._tabIndex = null;
	Z._fieldName = fieldName;
	Z._dataType = dataType;
	Z._length = 0;
	Z._scale = 0;
	Z._unique = false;
	
	Z._defaultExpr = null;
	Z._defaultValue = null;
	Z._label = null;
	Z._tip = null;
	Z._message = null;
	Z._displayWidth = 0;
	Z._editMask = null;
	Z._displayFormat = null;
	Z._dateFormat = null;
	Z._formula = null;
	Z._readOnly = false;
	Z._visible = true;
	Z._disabled = false;
	Z._customValueConverter = null;
	Z._unitConverted = false;

	Z._lookup = null;
	
	Z._displayControl = null;
	Z._editControl = null;
	Z._subDataset = null;
	Z._urlExpr = null;
	Z._innerUrlExpr = null;
	Z._urlTarget = null;
	Z._valueStyle = jslet.data.FieldValueStyle.NORMAL; //0 - Normal, 1 - Between style value, 2 - Multiple value
	Z._valueCountLimit = 0;
	Z._required = false;
	Z._nullText = jslet.locale.Dataset.nullText;
	Z._dataRange= null;
	Z._regularExpr = null;
	Z._antiXss = true;
	Z._customValidator = null;
	Z._validChars = null; //Array of characters
	Z._dateChar = null;
	Z._dateRegular = null;
	Z._parent = null; //parent field object
	Z._children = null; //child field object
	Z._trueValue = true;
	Z._falseValue = false;
	Z._trueText = null;
	Z._falseText = null;
	Z._mergeSame = false;
	Z._mergeSameBy = null;
	Z._fixedValue = null;
	Z._valueFollow = false;
	Z._aggraded = false; //optional value: sum, count, avg
	Z._aggradedBy = null;
	
	Z._crossSource = null;
};

jslet.data.Field.className = 'jslet.data.Field';

jslet.data.Field.prototype = {
	className: jslet.data.Field.className,
	
	/**
	 * {jslet.data.Dataset}
	 */
	dataset: function (dataset) {
		var Z = this;
		if (dataset === undefined) {
			if(Z._parent) {
				return Z._parent.dataset();
			}
			return Z._dataset;
		}
		
		if(jslet.isString(dataset)) {
			dataset = jslet.data.getDataset(dataset); 
		} else {
			jslet.Checker.test('Field.dataset', dataset).isClass(jslet.data.Dataset.className);
		}
		if(dataset) {
			Z._dsName = dataset.name();
		}
		Z._removeRelation();
		Z._dataset = dataset;
		Z._clearFieldCache();
		Z._addRelation();
		return this;
	},
	
	/**
	 * Get or set field name
	 * 
	 * @param {String or undefined} fldName Field name.
	 * @return {String}
	 */
	name: function () {
		if(arguments.length >0) {
			alert("Can't change field name!");
		}
		return this._fieldName;
	},

	/**
	 * Get or set field label.
	 * 
	 * @param {String or undefined} label Field label.
	 * @return {String or this}
	 */
	label: function (label) {
		var Z = this;
		if (label === undefined) {
			return Z._label || Z._fieldName;
		}
		jslet.Checker.test('Field.label', label).isString();
		Z._label = label;
		Z._fireMetaChangedEvent('label');
		Z._fireGlobalMetaChangedEvent('label');
		return this;
	},

	/**
	 * Get or set field tip.
	 * 
	 * @param {String or undefined} tip Field tip.
	 * @return {String or this}
	 */
	tip: function(tip) {
		var Z = this;
		if (tip === undefined) {
			return Z._tip;
		}
		jslet.Checker.test('Field.tip', tip).isString();
		Z._tip = tip;
		Z._fireMetaChangedEvent('tip');
		Z._fireGlobalMetaChangedEvent('tip');
		return this;
	},
	
	/**
	 * Get field data type.
	 * 
	 * @param {jslet.data.DataType}
	 */
	getType: function () {
		return this._dataType;
	},

	/**
	 * Get or set parent field object.
	 * 
	 * @param {jslet.data.Field or undefined} parent Parent field object.
	 * @return {jslet.data.Field or this}
	 */
	parent: function (parent) {
		var Z = this;
		if (parent === undefined) {
			return Z._parent;
		}
		jslet.Checker.test('Field.parent', parent).isClass(this.className);
		Z._parent = parent;
		return this;
	},

	/**
	 * Get or set child fields of this field.
	 * 
	 * @param {jslet.data.Field[] or undefined} children Child field object.
	 * @return {jslet.data.Field or this}
	 */
	children: function (children) {
		var Z = this;
		if (children === undefined) {
			return Z._children;
		}
		jslet.Checker.test('Field.children', children).isArray();
		for(var i = 0, len = children.length; i < len; i++) {
			jslet.Checker.test('Field.children#childField', children[i]).isClass(this.className);
		}
		Z._children = children;
		return this;
	},
	
	/**
	 * Get or set field display order.
	 * Dataset uses this property to resolve field order.
	 * 
	 * @param {Integer or undefined} displayOrder Field display order.
	 * @return {Integer or this}
	 */
	displayOrder: function (displayOrder) {
		var Z = this;
		if (displayOrder === undefined) {
			return Z._displayOrder;
		}
		jslet.Checker.test('Field.displayOrder', displayOrder).isNumber();
		Z._displayOrder = parseInt(displayOrder);
		Z._fireGlobalMetaChangedEvent('displayOrder');
		return this;
	},

	/**
	 * Get or set the edit control tab index of this field.
	 * 
	 * @param {Integer or undefined} tabIndex the edit control tab index of this field.
	 * @return {Integer or this}
	 */
	tabIndex: function(tabIndex) {
		var Z = this;
		if (tabIndex === undefined) {
			return Z._tabIndex;
		}
		jslet.Checker.test('Field.tabIndex', tabIndex).isNumber();
		Z._tabIndex = parseInt(tabIndex);
		Z._fireMetaChangedEvent('tabIndex');
		Z._fireGlobalMetaChangedEvent('tabIndex');
		return this;
	},
	
	/**
	 * Get or set field stored length.
	 * If it's a database field, it's usually same as the length of database.  
	 * 
	 * @param {Integer or undefined} len Field stored length.
	 * @return {Integer or this}
	 */
	length: function (len) {
		var Z = this;
		if (len === undefined) {
			return Z._length;
		}
		jslet.Checker.test('Field.length', len).isGTEZero();
		Z._length = parseInt(len);
		Z._fireGlobalMetaChangedEvent('length');
		return this;
	},
	
	/**
	 * Get edit length.
	 * Edit length is used in editor to input data.
	 * 
	 * @return {Integer}
	 */
	getEditLength: function () {
		var Z = this;
		if (Z._lookup) {
			var codeFld = Z._lookup.codeField();
			var lkds = Z._lookup.dataset();
			if (lkds && codeFld) {
				var lkf = lkds.getField(codeFld);
				if (lkf) {
					return lkf.getEditLength();
				}
			}
		}
		if(Z._dataType === jslet.data.DataType.NUMBER && Z._scale > 0) {
			return Z._length + 1; // 1 for decimal point
		}
		return Z._length > 0 ? Z._length : 10;
	},

	/**
	 * Get or set field decimal length.
	 * 
	 * @param {Integer or undefined} scale Field decimal length.
	 * @return {Integer or this}
	 */
	scale: function (scale) {
		var Z = this;
		if (scale === undefined) {
			return Z._scale;
		}
		jslet.Checker.test('Field.scale', scale).isGTEZero();
		Z._scale = parseInt(scale);
		Z._fireGlobalMetaChangedEvent('scale');
		return this;
	},

	/**
	 * Get or set field alignment.
	 * 
	 * @param {String or undefined} alignment Field alignment.
	 * @return {String or this}
	 */
	alignment: function (alignment) {
		var Z = this;
		if (alignment === undefined){
			if(Z._alignment) {
				return Z._alignment;
			}
			
			if(Z._lookup) {
				return 'left';
			}
			if(Z._dataType == jslet.data.DataType.NUMBER) {
				return 'right';
			}
			
			if(Z._dataType == jslet.data.DataType.BOOLEAN) {
				return 'center';
			}
			return 'left';
		}
		
		jslet.Checker.test('Field.alignment', alignment).isString();
		Z._alignment = jQuery.trim(alignment);
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('alignment');
		return this;
	},

	/**
	 * Get or set the display text if the field value is null.
	 * 
	 * @param {String or undefined} nullText Field null text.
	 * @return {String or this}
	 */
	nullText: function (nullText) {
		var Z = this;
		if (nullText === undefined) {
			return Z._nullText;
		}
		jslet.Checker.test('Field.nullText', nullText).isString();
		nullText = jQuery.trim(nullText);
		Z._nullText = nullText;
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('nullText');
		return this;
	},

	/**
	 * Get or set field display width.
	 * Display width is usually used in DBTable column.
	 * 
	 * @param {Integer or undefined} displayWidth Field display width.
	 * @return {Integer or this}
	 */
	displayWidth: function (displayWidth) {
		var Z = this;
		if (displayWidth === undefined){
			if (Z._displayWidth <= 0) {
				return Z._length > 0 ? Z._length : 12;
			} else {
				return Z._displayWidth;
			}
		}
		jslet.Checker.test('Field.displayWidth', displayWidth).isGTEZero();
		Z._displayWidth = parseInt(displayWidth);
		Z._fireGlobalMetaChangedEvent('displayWidth');
		return this;
	},
	
	/**
	 * Get or set field default expression.
	 * This expression will be calculated when inserting a record.
	 * 
	 * @param {String or undefined} defaultExpr Field default expression.
	 * @return {String or this}
	 */
	defaultExpr: function (defaultExpr) {
		var Z = this;
		if (defaultExpr === undefined) {
			return Z._defaultExpr;
		}
		jslet.Checker.test('Field.defaultExpr', defaultExpr).isString();
		Z._defaultExpr = defaultExpr;
		Z._fireGlobalMetaChangedEvent('defaultExpr');
		return this;
	},

	/**
	 * Get or set field display format.
	 * For number field like: #,##0.00
	 * For date field like: yyyy/MM/dd
	 * 
	 * @param {String or undefined} format Field display format.
	 * @return {String or this}
	 */
	displayFormat: function (format) {
		var Z = this;
		if (format === undefined) {
			if (Z._displayFormat) {
				return Z._displayFormat;
			} else {
				if (Z._dataType == jslet.data.DataType.DATE) {
					return jslet.locale.Date.format;
				} else {
					return Z._displayFormat;
				}
			}
		}
		
		jslet.Checker.test('Field.displayFormat', format).isString();
		Z._displayFormat = jQuery.trim(format);
		Z._dateFormat = null;
		Z._dateChar = null;
		Z._dateRegular = null;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('displayFormat');
		return this;
	},

	/**
	 * Get or set field default value.
	 * The data type of default value must be same as Field's.
	 * Example:
	 *   Number field: fldObj.defauleValue(100);
	 *   Date field: fldObj.defaultValue(new Date());
	 *   String field: fldObj.defaultValue('test');
	 * 
	 * @param {Object or undefined} dftValue Field default value.
	 * @return {Object or this}
	 */
	defaultValue: function (dftValue) {
		var Z = this;
		if (dftValue === undefined) {
			return Z._defaultValue;
		}
		jslet.Checker.test('Field.defaultValue', Z.dftValue).isDataType(Z._dateType);
		Z._defaultValue = dftValue;
		Z._fireGlobalMetaChangedEvent('defaultValue');
		return this;
	},

	/**
	 * Get or set field is unique or not.
	 * 
	 * @param {Boolean or undefined} unique Field is unique or not.
	 * @return {Boolean or this}
	 */
	unique: function (unique) {
		var Z = this;
		if (unique === undefined) {
			return Z._unique;
		}
		Z._unique = unique ? true: false;
		Z._fireGlobalMetaChangedEvent('unique');
		return this;
	},
	
	/**
	 * Get or set field is required or not.
	 * 
	 * @param {Boolean or undefined} required Field is required or not.
	 * @return {Boolean or this}
	 */
	required: function (required) {
		var Z = this;
		if (required === undefined) {
			return Z._required;
		}
		Z._required = required ? true: false;
		Z._fireMetaChangedEvent('required');
		Z._fireGlobalMetaChangedEvent('required');
		return this;
	},
	
	/**
	 * Get or set field edit mask.
	 * 
	 * @param {jslet.data.EditMask or undefined} mask Field edit mask.
	 * @return {jslet.data.EditMask or this}
	 */
	editMask: function (mask) {
		var Z = this;
		if (mask === undefined) {
			return Z._editMask;
		}
		if(mask) {
			if (jslet.isString(mask)) {
				mask = {mask: mask,keepChar:true};
			}
		} else {
			mask = null;
		}
		Z._editMask = mask;
		Z._clearFieldCache();		
		Z._fireMetaChangedEvent('editMask');
		Z._fireGlobalMetaChangedEvent('required');
		return this;
	},
	
	dateFormat: function(){
		var Z = this;
		if (Z._dateFormat) {
			return Z._dateFormat;
		}
		if (this.getType() != jslet.data.DataType.DATE) {
			return null;
		}
		var displayFmt = this.displayFormat().toUpperCase();
		Z._dateFormat = '';
		var c;
		for(var i = 0, len = displayFmt.length; i < len; i++){
			c = displayFmt.charAt(i);
			if ('YMD'.indexOf(c) < 0) {
				continue;
			}
			if (Z._dateFormat.indexOf(c) < 0) {
				Z._dateFormat += c;
			}
		}
		return Z._dateFormat;
	},
	
	dateSeparator: function(){
		var Z = this;
		if (Z._dateChar) {
			return Z._dateChar;
		}
		if (this.getType() != jslet.data.DataType.DATE) {
			return null;
		}
		var displayFmt = this.displayFormat().toUpperCase();
		for(var i = 0, c, len = displayFmt.length; i < len; i++){
			c = displayFmt.charAt(i);
			if ('YMD'.indexOf(c) < 0){
				Z._dateChar = c;
				return c;
			}
		}
	},
	
	dateRegular: function(){
		var Z = this;
		if (Z._dateRegular) {
			return Z._dateRegular;
		}
		var dateFmt = this.dateFormat(),
			dateSeparator = this.dateSeparator(),
			result = ['^'];
		for(var i = 0, c; i < dateFmt.length; i++){
			if (i > 0){
				result.push('\\');
				result.push(dateSeparator);
			}
			c = dateFmt.charAt(i);
			if (c == 'Y') {
				result.push('(\\d{4}|\\d{2})');
			} else if (c == 'M'){
				result.push('(0?[1-9]|1[012])');
			} else {
				result.push('(0?[1-9]|[12][0-9]|3[01])');
			}
		}
		result.push('(\\s+\\d{2}:\\d{2}:\\d{2}(\\.\\d{3}){0,1}){0,1}');
		result.push('$');
		Z._dateRegular = {expr: new RegExp(result.join(''), 'gim'), message: jslet.locale.Dataset.invalidDate};
		return Z._dateRegular;
	},
	
	/**
	 * Get or set field formula. Example: 
	 * <pre><code>
	 *  fldObj.formula('[price]*[num]');
	 * </code></pre>
	 * 
	 * @param {String or undefined} formula Field formula.
	 * @return {String or this}
	 */
	formula: function (formula) {
		var Z = this;
		if (formula === undefined) {
			return Z._formula;
		}
		
		jslet.Checker.test('Field.formula', formula).isString();
		Z._formula = jQuery.trim(formula);
		Z._clearFieldCache();
		var dataset = Z.dataset(); 
		if (dataset) {
			dataset.removeInnerFormulaField(Z._fieldName);
			dataset.addInnerFormulaField(Z._fieldName, Z._formula);		
			Z._fireColumnUpdatedEvent();
		}
		Z._fireGlobalMetaChangedEvent('formula');
		return this;
	},

	/**
	 * Get or set field is visible or not.
	 * 
	 * @param {Boolean or undefined} visible Field is visible or not.
	 * @return {Boolean or this}
	 */
	visible: function (visible) {
		var Z = this;
		if (visible === undefined){
			if (Z._visible){
				var p = this.parent();
				while(p){
					if (!p.visible()) { //if parent is invisible
						return false;
					}
					p = p.parent();
				}
			}
			return Z._visible;
		}
		Z._visible = visible ? true: false;
		Z._fireMetaChangedEvent('visible');
		Z._fireGlobalMetaChangedEvent('visible');
		return this;
	},

	/**
	 * Get or set field is disabled or not.
	 * 
	 * @param {Boolean or undefined} disabled Field is disabled or not.
	 * @return {Boolean or this}
	 */
	disabled: function (disabled) {
		var Z = this;
		if (disabled === undefined) {
			return Z._disabled;
		}
		Z._disabled = disabled ? true: false;
		Z._fireMetaChangedEvent('disabled');
		Z._fireGlobalMetaChangedEvent('disabled');
		return this;
	},

	/**
	 * Get or set field is readOnly or not.
	 * 
	 * @param {Boolean or undefined} readOnly Field is readOnly or not.
	 * @return {Boolean or this}
	 */
	readOnly: function (readOnly) {
		var Z = this;
		if (readOnly === undefined){
			if (Z._dataType == jslet.data.DataType.DATASET) {
				return true;
			}
			var children = Z.children();
			if (children && children.length === 0) {
				return true;
			}

			return Z._readOnly || Z._dataset.readOnly();
		}
		
		Z._readOnly = readOnly? true: false;
		Z._fireMetaChangedEvent('readOnly');
		Z._fireGlobalMetaChangedEvent('readOnly');
		return this;
	},
	
	fieldReadOnly: function() {
		var Z = this;
		if (Z._dataType == jslet.data.DataType.DATASET) {
			return true;
		}
		var children = Z.children();
		if (children && children.length === 0) {
			return true;
		}

		return Z._readOnly;
	},
	
	fieldDisabled: function() {
		return this._disabled;
	},
	
	_fireGlobalMetaChangedEvent: function(metaName) {
		var ds = this.dataset();
		if (ds && ds.designMode()) {
			var handler = jslet.data.globalDataHandler.fieldMetaChanged();
			if(handler) {
				handler.call(this, ds, this._fieldName, metaName)
			}
		}
	},
	
	_fireMetaChangedEvent: function(metaName, changeAllRows) {
		var ds = this.dataset();
		if (ds) {
			var evt = jslet.data.RefreshEvent.changeMetaEvent(metaName, this._fieldName, changeAllRows);
			ds.refreshControl(evt);
		}
	},
	
	_fireColumnUpdatedEvent: function() {
		var ds = this.dataset();
		if (ds) {
			var evt = jslet.data.RefreshEvent.updateColumnEvent(this._fieldName);
			ds.refreshControl(evt);
		}
	},
	
	/**
	 * Get or set if field participates unit converting.
	 * 
	 * @param {Boolean or undefined} unitConverted .
	 * @return {Boolean or this}
	 */
	unitConverted: function (unitConverted) {
		var Z = this;
		if (unitConverted === undefined) {
			return Z._dataType == jslet.data.DataType.NUMBER? Z._unitConverted:false;
		}
		Z._unitConverted = unitConverted ? true : false;
		var ds = this.dataset();
		Z._clearFieldCache();		
		if (Z._dataType == jslet.data.DataType.NUMBER && ds && ds.unitConvertFactor() != 1) {
			Z._fireColumnUpdatedEvent();
		}
		Z._fireGlobalMetaChangedEvent('unitConverted');
		return this;
	},

	/**
	 * Get or set value style of this field. Optional value: 0 - Normal, 1 - Between style, 2 - Multiple value
	 * 
	 * @param {Integer or undefined} mvalueStyle.
	 * @return {Integer or this}
	 */
	valueStyle: function (mvalueStyle) {
		var Z = this;
		if (mvalueStyle === undefined) {
			if(Z._dataType == jslet.data.DataType.DATASET ||  
					Z._children && Z._children.length > 0) 
				return jslet.data.FieldValueStyle.NORMAL;
			
			return Z._valueStyle;
		}

		if(mvalueStyle) {
			mvalueStyle = parseInt(mvalueStyle);
		} else {
			mvalueStyle = 0;
		}
		jslet.Checker.test('Field.valueStyle', mvalueStyle).isNumber().inArray([0,1,2]);
		Z._valueStyle = mvalueStyle;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('valueStyle');
		return this;
	},

	/**
	 * Get or set allowed count when valueStyle is multiple.
	 * 
	 * @param {String or undefined} count.
	 * @return {String or this}
	 */
	valueCountLimit: function (count) {
		var Z = this;
		if (count === undefined) {
			return Z._valueCountLimit;
		}
		if(count) {
			jslet.Checker.test('Field.valueCountLimit', count).isNumber();
		} else {
			count = 0;
		}
		Z._valueCountLimit = parseInt(count);
		Z._fireGlobalMetaChangedEvent('valueCountLimit');
		return this;
	},

	/**
	 * Get or set field display control. It is similar as DBControl configuration.
	 * Here you need not set 'dataset' and 'field' property.   
	 * Example:
	 * <pre><code>
	 * //Normal DBControl configuration
	 * //var normalCtrlCfg = {type:"DBSpinEdit",dataset:"employee",field:"age",minValue:10,maxValue:100,step:5};
	 * 
	 * var displayCtrlCfg = {type:"DBSpinEdit",minValue:10,maxValue:100,step:5};
	 * fldObj.displayControl(displayCtrlCfg);
	 * </code></pre>
	 * 
	 * @param {DBControl Config or String} dispCtrl If String, it will convert to DBControl Config.
	 * @return {DBControl Config or this}
	 */
	displayControl: function (dispCtrl) {
		var Z = this;
		if (dispCtrl === undefined){
			if (Z._dataType == jslet.data.DataType.BOOLEAN && !Z._displayControl) {
				return {
					type: 'dbcheckbox'
				};
			}
			return Z._displayControl;
		}
		 
		Z._displayControl = (typeof (Z._fieldName) == 'string') ? { type: dispCtrl } : dispCtrl;
		Z._fireGlobalMetaChangedEvent('displayControl');
		return this;
	},

	/**
	 * Get or set field edit control. It is similar as DBControl configuration.
	 * Here you need not set 'dataset' and 'field' property.   
	 * Example:
	 * <pre><code>
	 * //Normal DBControl configuration
	 * //var normalCtrlCfg = {type:"DBSpinEdit",dataset:"employee",field:"age",minValue:10,maxValue:100,step:5};
	 * 
	 * var editCtrlCfg = {type:"DBSpinEdit",minValue:10,maxValue:100,step:5};
	 * fldObj.displayControl(editCtrlCfg);
	 * </code></pre>
	 * 
	 * @param {DBControl Config or String} editCtrl If String, it will convert to DBControl Config.
	 * @return {DBControl Config or this}
	 */
	editControl: function (editCtrl) {
		var Z = this;
		if (editCtrl=== undefined){
			if (Z._editControl) {
				return Z._editControl;
			}

			if (Z._dataType == jslet.data.DataType.BOOLEAN) {
				return {type: 'dbcheckbox'};
			}
			if (Z._dataType == jslet.data.DataType.DATE) {
				return {type: 'dbdatepicker'};
			}
			
			return (Z._lookup !== null)? {type: 'dbselect'}:{type: 'dbtext'};
		}
		if(typeof (editCtrl) === 'string') {
			editCtrl = jQuery.trim(editCtrl);
			if(editCtrl) {
				if(editCtrl.indexOf(':') > 0) {
					editCtrl = jslet.JSON.parse(editCtrl);
				} else {
					editCtrl =  {type: editCtrl};
				}
			} else {
				editCtrl = null;
			}
		}
		Z._editControl = editCtrl;
		Z._fireMetaChangedEvent('editControl');
		Z._fireGlobalMetaChangedEvent('editControl');
		return this;
	},

	/**
	 * {Event} Get customized field text.
	 * Pattern: function(fieldName, value){}
	 *   //fieldName: String, field name;
	 *   //value: Object, field value, the value type depends on field type;
	 *   //return: String, field text;
	 */
	onCustomFormatFieldText: null, // (fieldName, value)

	_addRelation: function() {
		var Z = this,
			lkDsName;
		if(!Z._dataset || (Z.getType() != jslet.data.DataType.DATASET && !Z._lookup)) {
			return;
		}
		
		var hostDs = Z._dataset.name(),
			hostField = Z._fieldName,
			relationType;
		if(Z.getType() == jslet.data.DataType.DATASET) {
			if(Z._subDataset) {
				lkDsName = Z._getDatasetName(Z._subDataset);
				relationType = jslet.data.DatasetType.DETAIL;
				jslet.data.datasetRelationManager.addRelation(hostDs, hostField, lkDsName, relationType);
			}
		} else {
			lkDsName = Z._getDatasetName(Z._lookup._dataset);
			relationType = jslet.data.DatasetType.LOOKUP;
			jslet.data.datasetRelationManager.addRelation(hostDs, hostField, lkDsName, relationType);
		}
	},
	
	_removeRelation: function() {
		var Z = this;
		if(!Z._dataset || (!Z._subDataset && !Z._lookup)) {
			return;
		}
		var hostDs = Z._dataset.name(),
			hostField = Z._fieldName,
			relationType;

		if(Z._subDataset) {
			lkDsName = Z._getDatasetName(Z._subDataset);
		} else {
			lkDsName = Z._getDatasetName(Z._lookup._dataset);
		}
		jslet.data.datasetRelationManager.removeRelation(hostDs, hostField, lkDsName);
	},
		
	/**
	 * Get or set lookup field object
	 * 
	 * @param {jslet.data.FieldLookup or undefined} lkFld lookup field Object.
	 * @return {jslet.data.FieldLookup or this}
	 */
	lookup: function (lkFldObj) {
		var Z = this;
		if (lkFldObj === undefined){
			return Z._lookup;
		}
		jslet.Checker.test('Field.lookup', lkFldObj).isClass(jslet.data.FieldLookup.className);		
		Z._removeRelation();
		
		Z._lookup = lkFldObj;
		if(lkFldObj) {
			lkFldObj.hostField(Z);
			Z._addRelation();
		}
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		return this;
	},
	
	_getDatasetName: function(dsObjOrName) {
		return jslet.isString(dsObjOrName)? dsObjOrName: dsObjOrName.name();
	},
	
	_subDsParsed: false,
	
	/**
	 * Set or get sub dataset.
	 * 
	 * @param {jslet.data.Dataset or undefined} subdataset
	 * @return {jslet.data.Dataset or this}
	 */
	subDataset: function (subdataset) {
		var Z = this;
		if (subdataset === undefined) {
			if(!Z._subDsParsed && Z._subDataset) {
				Z.subDataset(Z._subDataset);
				if(!Z._subDsParsed) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.datasetNotFound, [Z._subDataset]));
				}			
			}
			return Z._subDataset;
		}
		
		var oldSubDsName = Z._getDatasetName(Z._subDataset),
		 	newSubDsName = Z._getDatasetName(subdataset),
		 	needProcessRelation = (oldSubDsName != newSubDsName);
		var subDsObj = subdataset;
		if (jslet.isString(subDsObj)) {
			subDsObj = jslet.data.getDataset(subDsObj);
			if(!subDsObj && jslet.data.onCreatingDataset) {
				jslet.data.onCreatingDataset(subdataset, jslet.data.DatasetType.DETAIL, null, Z._dsName); //1 - sub dataset
			}
		}
		if(needProcessRelation) {
			Z._removeRelation();
		}
		if(subDsObj) {
			jslet.Checker.test('Field.subDataset', subDsObj).isClass(jslet.data.Dataset.className);		
			if (Z._subDataset && Z._subDataset.datasetField) {
				Z._subDataset.datasetField(null);
			}
			Z._subDataset = subDsObj;
			Z._subDsParsed = true;
		} else {
			Z._subDataset = subdataset;
			Z._subDsParsed = false;
		}
		if(needProcessRelation) {
			Z._addRelation();
		}
		return this;
	},

	urlExpr: function (urlExpr) {
		var Z = this;
		if (urlExpr === undefined) {
			return Z._urlExpr;
		}

		jslet.Checker.test('Field.urlExpr', urlExpr).isString();
		Z._urlExpr = jQuery.trim(urlExpr);
		Z._innerUrlExpr = null;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('urlExpr');
		return this;
	},

	urlTarget: function (target) {
		var Z = this;
		if (target === undefined){
			return !Z._urlTarget ? jslet.data.Field.URLTARGETBLANK : Z._urlTarget;
		}

		jslet.Checker.test('Field.urlTarget', target).isString();
		Z._urlTarget = jQuery.trim(target);
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('urlTarget');
		return this;
	},

	calcUrl: function () {
		var Z = this;
		if (!this.dataset() || !Z._urlExpr) {
			return null;
		}
		if (!Z._innerUrlExpr) {
			Z._innerUrlExpr = new jslet.Expression(this.dataset(), Z._urlExpr);
		}
		return Z._innerUrlExpr.eval();
	},

	/**
	 * Get or set if field need be anti-xss.
	 * If true, field value will be encoded.
	 * 
	 * @param {Boolean or undefined} isXss.
	 * @return {Boolean or this}
	 */
	antiXss: function(isXss){
		var Z = this;
		if (isXss === undefined) {
			return Z._antiXss;
		}
		Z._antiXss = isXss ? true: false;
		Z._fireGlobalMetaChangedEvent('antiXss');
		return this;
	},

	/**
	 * Get or set field rang.
	 * Range is an object as: {min: x, max: y}. Example:
	 * <pre><code>
	 *	//For String field
	 *	var range = {min: 'a', max: 'z'};
	 *  //For Date field
	 *	var range = {min: new Date(2000,1,1), max: new Date(2010,12,31)};
	 *  //For Number field
	 *	var range = {min: 0, max: 100};
	 *  fldObj.dataRange(range);
	 * </code></pre>
	 * 
	 * @param {Range or Json String} range Field range;
	 * @return {Range or this}
	 */
	dataRange: function (range) {
		var Z = this;
		if (range === undefined) {
			return Z._dataRange;
		}
		if(range && jslet.isString(range)) {
			range = jslet.JSON.parse(range);
		}
		if(range) {
			jslet.Checker.test('Field.dataRange', range).isObject();
			if(range.min) {
				jslet.Checker.test('Field.dataRange.min', range.min).isDataType(Z._dateType);
			}
			if(range.max) {
				jslet.Checker.test('Field.dataRange.max', range.max).isDataType(Z._dateType);
			}
		}
		Z._dataRange = range;
		Z._fireGlobalMetaChangedEvent('dataRange');
		return this;
	},

	/**
	 * Get or set regular expression.
	 * You can specify your own validator with regular expression. If regular expression not specified, 
	 * The default regular expression for Date and Number field will be used. Example:
	 * <pre><code>
	 *	fldObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, 'Invalid phone number!');//like: 0755-12345678
	 * </code></pre>
	 * 
	 * @param {String} expr Regular expression;
	 * @param {String} message Message for invalid.
	 * @return {Object} An object like: { expr: expr, message: message }
	 */
	regularExpr: function (expr, message) {
		var Z = this;
		var argLen = arguments.length;
		if (argLen === 0){
			return Z._regularExpr;
		}
		
		if (argLen == 1) {
			Z._regularExpr = expr;
		} else {
			Z._regularExpr = { expr: expr, message: message };
		}
		Z._fireGlobalMetaChangedEvent('regularExpr');
		return this;
	},
	
	
	/**
	 * Get or set customized field value converter.
	 * 
	 * @param {jslet.data.FieldValueConverter} converter converter object, sub class of jslet.data.FieldValueConverter.
	 */
	customValueConverter: function (converter) {
		var Z = this;
		if (converter === undefined) {
			return Z._customValueConverter;
		}
		Z._customValueConverter = converter;
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
		Z._fireGlobalMetaChangedEvent('customValueConverter');
		return this;
	},

	/**
	 * Get or set customized validator.
	 * 
	 * @param {Function} validator Validator function.
	 * Pattern:
	 *   function(fieldObj, fldValue){}
	 *   //fieldObj: jslet.data.Field, Field object
	 *   //fldValue: Object, Field value
	 *   //return: String, if validate failed, return error message, otherwise return null; 
	 */
	customValidator: function (validator) {
		var Z = this;
		if (validator === undefined) {
			return Z._customValidator;
		}
		if(validator) {
			jslet.Checker.test('Field.customValidator', validator).isFunction();
		}
		Z._customValidator = validator;
		Z._fireGlobalMetaChangedEvent('customValidator');
		return this;
	},
	
	/**
	 * Valid characters for this field.
	 */
	validChars: function(chars){
		var Z = this;
		if (chars === undefined){
			if (Z._validChars) {
				return Z._validChars;
			}
			if (Z._dataType == jslet.data.DataType.NUMBER){
				return Z._scale ? '+-0123456789.' : '+-0123456789';
			}
			if (Z._dataType == jslet.data.DataType.DATE){
				var displayFormat = Z.displayFormat();
				var chars = '0123456789';
				for(var i = 0, len = displayFormat.length; i < len; i++) {
					var c = displayFormat.charAt(i);
					if(c === 'y' || c === 'M' || c === 'd' || c === 'h' || c === 'm' || c === 's') {
						continue;
					}
					chars += c;
				}
				return chars;
			}
			return null;
		}
		
		Z._validChars = chars;
		Z._fireGlobalMetaChangedEvent('validChars');
		return this;
	},
	
	/**
	 * Use for Boolean field, actual value for 'true'
	 */
	trueValue: function(value) {
		var Z = this;
		if (value === undefined) {
			return Z._trueValue;
		}
		Z._trueValue = value;
		return this;		
	},
	
	/**
	 * Use for Boolean field, actual value for 'false'
	 */
	falseValue: function(value) {
		var Z = this;
		if (value === undefined) {
			return Z._falseValue;
		}
		Z._falseValue = value;
		return this;		
	},
	
	/**
	 * Use for Boolean field, display text for 'true'
	 */
	trueText: function(trueText) {
		var Z = this;
		if (trueText === undefined) {
			return Z._trueText || jslet.locale.Dataset.trueText;
		}
		Z._trueText = trueText;
		return this;		
	},
	
	/**
	 * Use for Boolean field, display text for 'false'
	 */
	falseText: function(falseText) {
		var Z = this;
		if (falseText === undefined) {
			return Z._falseText || jslet.locale.Dataset.falseText;
		}
		Z._falseText = falseText;
		return this;		
	},
	
	/**
	 * Get or set if the same field value will be merged.
	 * 
	 * @param {Boolean or undefined} mergeSame.
	 * @return {Boolean or this}
	 */
	mergeSame: function(mergeSame){
		var Z = this;
		if (mergeSame === undefined) {
			return Z._mergeSame;
		}
		Z._mergeSame = mergeSame ? true: false;
		Z._fireGlobalMetaChangedEvent('mergeSame');
		return this;
	},

	/**
	 * Get or set the field names to "mergeSame".
	 * Multiple field names are separated by ','.
	 * 
	 * @param {String or undefined} mergeSameBy.
	 * @return {String or this}
	 */
	mergeSameBy: function(mergeSameBy){
		var Z = this;
		if (mergeSameBy === undefined) {
			return Z._mergeSameBy;
		}
		jslet.Checker.test('Field.mergeSameBy', mergeSameBy).isString();
		Z._mergeSameBy = jQuery.trim(mergeSameBy);
		Z._fireGlobalMetaChangedEvent('mergeSameBy');
		return this;
	},
	
	/**
	 * Get or set if the field is following the value which append before.
	 * 
	 * @param {Boolean or undefined} valueFollow true - the default value is same as the value which appended before, false -otherwise.
	 * @return {Boolean or this}
	 */
	valueFollow: function(valueFollow) {
		var Z = this;
		if(valueFollow === undefined) {
			return Z._valueFollow;
		}
		Z._valueFollow = valueFollow? true: false;
		if(!Z._valueFollow && Z._dataset) {
			Z._dataset._followedValue = null;
		}
		Z._fireGlobalMetaChangedEvent('valueFollow');
		return this;
	},

	/**
	 * Get or set the type of aggraded value.
	 * 
	 * @param {String or undefined} aggraded optional value is: count,sum,avg.
	 * @return {String or this}
	 */
	aggraded: function (aggraded) {
		var Z = this;
		if (aggraded === undefined){
			return Z._aggraded;
		}
		
		Z._aggraded = aggraded? true: false;
		Z._fireGlobalMetaChangedEvent('aggraded');
		return this;
	},

	/**
	 * Get or set the field names to aggrade field value. 
	 * Multiple field names are separated by ','.
	 * 
	 * 
	 * @param {String or undefined} aggrBy.
	 * @return {String or this}
	 */
	aggradedBy: function(aggradedBy){
		var Z = this;
		if (aggradedBy === undefined) {
			return Z._aggradedBy;
		}
		jslet.Checker.test('Field.aggradedBy', aggradedBy).isString();
		Z._aggradedBy = jQuery.trim(aggradedBy);
		Z._fireGlobalMetaChangedEvent('aggradedBy');
		return this;
	},

	crossSource: function(crossSource) {
		var Z = this;
		if(crossSource === undefined) {
			return Z._crossSource;
		}
		jslet.Checker.test('Field.crossSource', crossSource).isClass(jslet.data.CrossFieldSource.className);
		Z._crossSource = crossSource;
		return this;
	},
	
	/**
	 * Get or set fixed field value, if field value not specified, fixed field value used.
	 * 
	 * @param {String or undefined} fixedValue.
	 * @return {String or this}
	 */
	fixedValue: function(fixedValue){
		var Z = this;
		if (fixedValue === undefined) {
			return Z._fixedValue;
		}
		jslet.Checker.test('Field.fixedValue', fixedValue).isString();
		Z._fixedValue = jQuery.trim(fixedValue);
		Z._fireGlobalMetaChangedEvent('fixedValue');
		return this;
	},
	
	getValue: function(valueIndex) {
		return this._dataset.getFieldValue(this._fieldName, valueIndex);
	},
	
	setValue: function(value, valueIndex) {
		this._dataset.setFieldValue(this._fieldName, value, valueIndex);
	},

	getTextValue: function(isEditing, valueIndex) {
		return this._dataset.getFieldText(this._fieldName, isEditing, valueIndex);
	},
	
	setTextValue: function(value, valueIndex) {
		this._dataset.setFieldText(this._fieldName, inputText, valueIndex);
	},
	
	clone: function(fldName, newDataset){
		var Z = this;
		jslet.Checker.test('Field.clone#fldName', fldName).required().isString();
		var result = new jslet.data.Field(fldName, Z._dataType);
		result.dataset(newDataset ? newDataset : this.dataset());
		result.length(Z._length);
		result.scale(Z._scale);
		result.alignment(Z._alignment);
		result.defaultExpr(Z._defaultExpr);
		result.defaultValue(Z._defaultValue);
		result.label(Z._label);
		result.tip(Z._tip);
		result.displayWidth(Z._displayWidth);
		if (Z._editMask) {
			result.editMask(Z._editMask.clone());
		}
		result.displayOrder(Z._displayOrder);
		result.tabIndex(Z._tabIndex);
		result.displayFormat(Z._displayFormat);
		result.dateFormat(Z._dateFormat);
		result.formula(Z._formula);
		result.unique(Z._unique);
		result.required(Z._required);
		result.readOnly(Z._readOnly);
		result.visible(Z._visible);
		result.disabled(Z._disabled);
		result.unitConverted(Z._underted);
		if (Z._lookup) {
			result.lookup(Z._lookup.clone());
		}
		
		result.displayControl(Z._displayControl);
		result.editControl(Z._editControl);
		result.urlExpr(Z._urlExpr);
		result.urlTarget(Z._urlTarget);
		result.valueStyle(Z._valueStyle);
		result.valueCountLimit(Z._valueCountLimit);
		result.nullText(Z._nullText);
		result.dataRange(Z._dataRange);
		if (Z._regularExpr) {
			result.regularExpr(Z._regularExpr);
		}
		result.antiXss(Z._antiXss);
		result.customValidator(Z._customValidator);
		result.customValueConverter(Z._customValueConverter);
		result.validChars(Z._validChars);
		if (Z._parent) {
			result.parent(Z._parent.clone(newDataset));
		}
		if (Z._children && Z._children.length > 0){
			var childFlds = [];
			for(var i = 0, cnt = Z._children.length; i < cnt; i++){
				childFlds.push(Z._children[i].clone(newDataset));
			}
			result.children(childFlds);
		}
		
		result.mergeSame(Z._mergeSame);
		result.mergeSameBy(Z._mergeSameBy);
		result.fixedValue(Z._fixedValue);
		
		result.valueFollow(Z._valueFollow);
		result.aggraded(Z._aggraded);
		result.aggradedBy(Z._aggradedBy);

		result.trueValue(Z._trueValue);
		result.falseValue(Z._falseValue);
		result.trueText(Z._trueText);
		result.falseText(Z._falseText);

		return result;
	},
	
	_clearFieldCache: function() {
		var Z = this;
		if(Z._dataset && Z._fieldName) {
			jslet.data.FieldValueCache.clearAll(Z._dataset, Z._fieldName);
		}
	}
	
};

jslet.data.Field.URLTARGETBLANK = '_blank';

/**
 * Create field object. Example:
 * <pre><code>
 * var fldObj = jslet.data.createField({name:'field1', type:'N', label: 'field1 label'});
 * </code></pre>
 * 
 * @param {Json Object} fieldConfig A json object which property names are same as jslet.data.Field. Example: {name: 'xx', type: 'N', ...}
 * @param {jslet.data.Field} parent Parent field object.
 * @return {jslet.data.Field}
 */
jslet.data.createField = function (fieldConfig, parent) {
	jslet.Checker.test('createField#fieldConfig', fieldConfig).required().isObject();
	var cfg = fieldConfig;
	if (!cfg.name) {
		throw new Error('Property: name required!');
	}
	var dtype = cfg.type;
	if (dtype === null) {
		dtype = jslet.data.DataType.STRING;
	} else {
		dtype = dtype.toUpperCase();
		if (dtype != jslet.data.DataType.STRING && 
				dtype != jslet.data.DataType.NUMBER && 
				dtype != jslet.data.DataType.DATE && 
				dtype != jslet.data.DataType.BOOLEAN && 
				dtype != jslet.data.DataType.CROSS && 
				dtype != jslet.data.DataType.DATASET)
		dtype = jslet.data.DataType.STRING;
	}

	var fldObj = new jslet.data.Field(cfg.shortName || cfg.name, dtype);

	if(fieldConfig.dsName) {
		fldObj._dsName = fieldConfig.dsName;
	}
	function setPropValue(propName) {
		var propValue = cfg[propName];
//		if(propValue === undefined) {
//			propValue = cfg[propName.toLowerCase()];
//		}
		if (propValue !== undefined) {
			fldObj[propName](propValue);
		}
	}
	
	fldObj.parent(parent);
	if(parent) {
		fldObj.dataset(parent.dataset());
	}
	if(cfg.crossSource) {
 		var crossSrc = jslet.data.createCrossFieldSource(cfg.crossSource);
 		fldObj.crossSource(crossSrc);
	}
	setPropValue('tabIndex');
	setPropValue('displayOrder');
	setPropValue('label');
	setPropValue('tip');

	if (dtype == jslet.data.DataType.DATASET){
		var subds = cfg.subDataset || cfg.subdataset;
		if (subds) {
			fldObj.subDataset(subds);
		} else {
			throw new Error('subDataset NOT set when field data type is Dataset');
		}
		fldObj.visible(false);
		return fldObj;
	}
	
	setPropValue('visible');

	setPropValue('unique');
	setPropValue('required');
	setPropValue('readOnly');
	setPropValue('disabled');
	setPropValue('length');
	setPropValue('scale');
	setPropValue('alignment');
	setPropValue('formula');
	setPropValue('defaultExpr');
	setPropValue('defaultValue');
	setPropValue('displayWidth');
	setPropValue('editMask');
	setPropValue('displayFormat');
	setPropValue('nullText');
	setPropValue('unitConverted');
	setPropValue('editControl');
	setPropValue('urlExpr');
	setPropValue('urlTarget');
	setPropValue('valueStyle');
	
	setPropValue('valueCountLimit');
	setPropValue('dataRange');
	setPropValue('customValidator');
	setPropValue('customValueConverter');
	setPropValue('trueValue');
	setPropValue('falseValue');
	setPropValue('mergeSame');
	setPropValue('mergeSameBy');
	setPropValue('aggraded');

	setPropValue('valueFollow');
	setPropValue('aggradedBy');
	setPropValue('mergeSameBy');
	setPropValue('fixedValue');
	setPropValue('antiXss');
	setPropValue('validChars');
	
	setPropValue('trueValue');
	setPropValue('falseValue');
	setPropValue('trueText');
	setPropValue('falseText');

	var regularExpr = cfg.regularExpr;
	var regularMessage = cfg.regularMessage;
	if(regularExpr) {
		fldObj.regularExpr(regularExpr, regularMessage);
	}
	
	var lkfCfg = cfg.lookup;
	if(lkfCfg === undefined) {
		var lkDataset = cfg.lookupSource || cfg.lookupsource || cfg.lookupDataset || cfg.lookupdataset;
			lkParam = cfg.lookupParam || cfg.lookupparam,
			realDataset = cfg.realSource || cfg.realsource || cfg.realDataset || cfg.realdataset;
		if(lkDataset) {
			if(lkParam) {
				if (jslet.isString(lkParam)) {
					lkfCfg = jslet.JSON.parse(lkParam);
				} else {
					lkfCfg = lkParam;
				}
			} else {
				lkfCfg = {};
			}
			lkfCfg.dataset = lkDataset;
			if(realDataset) {
				lkfCfg.realDataset = realDataset;
			}
		}
	}
	if (lkfCfg !== undefined && lkfCfg) {
		if (jslet.isString(lkfCfg)) {
			lkfCfg = lkfCfg.trim();
			if(lkfCfg) {
				if(lkfCfg.trim().startsWith('{')) {
					lkfCfg = jslet.JSON.parse(lkfCfg);
				} else {
					lkfCfg = {dataset: lkfCfg};
				}
			}
		}
		fldObj.lookup(jslet.data.createFieldLookup(lkfCfg, fldObj._dsName));
	}
	if (cfg.children){
		var fldChildren = [], 
			childFldObj;
		for(var i = 0, cnt = cfg.children.length; i < cnt; i++){
			childFldObj = jslet.data.createField(cfg.children[i], fldObj);
			childFldObj.displayOrder(i);
			fldChildren.push(childFldObj);
		}
		fldObj.children(fldChildren);
		fldObj.alignment('center');
	}
	
	return fldObj;
};

/**
 * Create string field object.
 * 
 * @param {String} fldName Field name.
 * @param {Integer} length Field length.
 * @param {jslet.data.Field} parent (Optional)Parent field object.
 * @return {jslet.data.Field}
 */
jslet.data.createStringField = function(fldName, length, parent) {
	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.STRING, parent);
	fldObj.length(length);
	return fldObj;
};

/**
 * Create number field object.
 * 
 * @param {String} fldName Field name.
 * @param {Integer} length Field length.
 * @param {Integer} scale Field scale.
 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
 * @return {jslet.data.Field}
 */
jslet.data.createNumberField = function(fldName, length, scale, parent) {
	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.NUMBER, parent);
	fldObj.length(length);
	fldObj.scale(scale);
	return fldObj;
};

/**
 * Create boolean field object.
 * 
 * @param {String} fldName Field name.
 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
 * @return {jslet.data.Field}
 */
jslet.data.createBooleanField = function(fldName, parent) {
	return new jslet.data.Field(fldName, jslet.data.DataType.BOOLEAN, parent);
};

/**
 * Create date field object.
 * 
 * @param {String} fldName Field name.
 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
 * @return {jslet.data.Field}
 */
jslet.data.createDateField = function(fldName, parent) {
	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.DATE, parent);
	return fldObj;
};

/**
 * Create dataset field object.
 * 
 * @param {String} fldName Field name.
 * @param {jslet.data.Dataset} subDataset Detail dataset object.
 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
 * @return {jslet.data.Field}
 */
jslet.data.createDatasetField = function(fldName, subDataset, parent) {
	if (!subDataset) {
		throw new Error('expected property:dataset in DatasetField!');
	}
	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.DATASET, parent);
	fldObj.subDataset(subDataset);
	fldObj.visible(false);
	return fldObj;
};

/**
 * Create group field object.
 * 
 * @param {String} fldName Field name.
 * @param {String} fldName Field label.
 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
 * @return {jslet.data.Field}
 */
//jslet.data.createGroupField = function(fldName, label, parent) {
//	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.GROUP, parent);
//	fldObj.label(label);
//	return fldObj;
//};

jslet.data.createCrossField = function(fldName, crossSource, parent) {
	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.CROSS, parent);
	fldObj.crossSource(crossSource);
};

/**
 * @class FieldLookup
 * 
 * A lookup field represents a field value is from another dataset named "Lookup Dataset";
 */
jslet.data.FieldLookup = function() {
	var Z = this;
	Z._hostDatasetName = null;
	Z._hostField = null;//The field which contains this lookup field object.
	Z._dataset = null;
	Z._realDataset = null;
	Z._dsParsed = false;
	Z._keyField = null;
	Z._codeField = null;
	Z._nameField = null;
	Z._codeFormat = null;
	Z._displayFields = null;
	Z._innerdisplayFields = null;
	Z._parentField = null;
	Z._onlyLeafLevel = true;
	Z._returnFieldMap = null;
	Z._editFilter = null;
	Z._editItemDisabled = false;
};
jslet.data.FieldLookup.className = 'jslet.data.FieldLookup';

jslet.data.FieldLookup.prototype = {
	className: jslet.data.FieldLookup.className,
	
	clone: function(){
		var Z = this, 
			result = new jslet.data.FieldLookup();
		result.dataset(Z._dataset);
		result.keyField(Z._keyField);
		result.codeField(Z._codeField);
		result.nameField(Z._nameField);
		result.displayFields(Z._displayFields);
		result.parentField(Z._parentField);
		result.onlyLeafLevel(Z._onlyLeafLevel);
		result.returnFieldMap(Z._returnFieldMap);
		result.editFilter(Z._editFilter);
		result.editItemDisabled(Z._editItemDisabled);
		return result;
	},
	
	hostField: function(fldObj) {
		var Z = this;
		if (fldObj === undefined) {
			return Z._hostField;
		}
		jslet.Checker.test('FieldLookup.hostField', fldObj).isClass(jslet.data.Field.className);
		Z._hostField = fldObj;
		return this;
	},
	
	/**
	 * Get or set lookup dataset.
	 * 
	 * @param {jslet.data.Dataset or undefined} dataset Lookup dataset.
	 * @return {jslet.data.Dataset or this}
	 */
	dataset: function(lkdataset) {
		var Z = this;
		if (lkdataset === undefined) {
			if(!Z._dsParsed) {
				Z.dataset(Z._dataset);
				if(!Z._dsParsed) {
					throw new Error('Not found lookup dataset: ' + Z._dataset);
				}			}
			
			return Z._dataset;
		}
		var lkDsName;
		if(lkdataset) {
			if (typeof(lkdataset) == 'string') {
				lkDsName = lkdataset;
			} else {
				lkDsName = lkdataset.name();
			}
			if(lkDsName == Z._hostDatasetName) {
				throw new Error(jslet.locale.Dataset.LookupDatasetNotSameAsHost);
			}
		}
		var lkDsObj = lkdataset;
		if (typeof(lkDsObj) == 'string') {
			lkDsObj = jslet.data.getDataset(lkDsObj);
			if(!lkDsObj && jslet.data.onCreatingDataset) {
				jslet.data.onCreatingDataset(lkdataset, jslet.data.DatasetType.LOOKUP, Z._realDataset, Z._hostDatasetName); //1 - lookup dataset, 2 - subdataset
			}
		}
		if(lkDsObj) {
			Z._dataset = lkDsObj;
			Z._dsParsed = true;
		} else {
			Z._dataset = lkdataset;
			Z._dsParsed = false;
		}
		return this;
	},

	/**
	 * Get or set key field.
	 * Key field is optional, if it is null, it will use LookupDataset.keyField instead. 
	 * 
	 * @param {String or undefined} keyFldName Key field name.
	 * @return {String or this}
	 */
	realDataset: function(realDataset) {
		var Z = this;
		if (realDataset === undefined){
			return Z._realDataset;
		}

		jslet.Checker.test('FieldLookup.realDataset', realDataset).isString();
		Z._realDataset = realDataset;
		return this;
	},
	
	/**
	 * Get or set key field.
	 * Key field is optional, if it is null, it will use LookupDataset.keyField instead. 
	 * 
	 * @param {String or undefined} keyFldName Key field name.
	 * @return {String or this}
	 */
	keyField: function(keyFldName) {
		var Z = this;
		if (keyFldName === undefined){
			return Z._keyField || Z.dataset().keyField();
		}

		jslet.Checker.test('FieldLookup.keyField', keyFldName).isString();
		Z._keyField = jQuery.trim(keyFldName);
		return this;
	},

	/**
	 * Get or set code field.
	 * Code field is optional, if it is null, it will use LookupDataset.codeField instead. 
	 * 
	 * @param {String or undefined} codeFldName Code field name.
	 * @return {String or this}
	 */
	codeField: function(codeFldName) {
		var Z = this;
		if (codeFldName === undefined){
			return Z._codeField || Z.dataset().codeField();
		}

		jslet.Checker.test('FieldLookup.codeField', codeFldName).isString();
		Z._codeField = jQuery.trim(codeFldName);
		return this;
	},
	
	codeFormat: function(format) {
		var Z = this;
		if (format === undefined) {
			return Z._codeFormat;
		}

		jslet.Checker.test('FieldLookup.codeFormat', format).isString();
		Z._codeFormat = jQuery.trim(format);
		return this;
	},

	/**
	 * Get or set name field.
	 * Name field is optional, if it is null, it will use LookupDataset.nameField instead. 
	 * 
	 * @param {String or undefined} nameFldName Name field name.
	 * @return {String or this}
	 */
	nameField: function(nameFldName) {
		var Z = this;
		if (nameFldName === undefined){
			return Z._nameField || Z.dataset().nameField();
		}

		jslet.Checker.test('FieldLookup.nameField', nameFldName).isString();
		Z._nameField = jQuery.trim(nameFldName);
		return this;
	},

	/**
	 * Get or set parent field.
	 * Parent field is optional, if it is null, it will use LookupDataset.parentField instead. 
	 * 
	 * @param {String or undefined} parentFldName Parent field name.
	 * @return {String or this}
	 */
	parentField: function(parentFldName) {
		var Z = this;
		if (parentFldName === undefined){
			return Z._parentField || Z.dataset().parentField();
		}

		jslet.Checker.test('FieldLookup.parentField', parentFldName).isString();
		Z._parentField = jQuery.trim(parentFldName);
		return this;
	},

	/**
	 * An expression for display field value. Example:
	 * <pre><code>
	 * lookupFldObj.displayFields('[code]-[name]'); 
	 * </code></pre>
	 */
	displayFields: function(fieldExpr) {
		var Z = this;
		if (fieldExpr === undefined) {
			return Z._displayFields? Z._displayFields: this.getDefaultDisplayFields();
		}
		jslet.Checker.test('FieldLookup.displayFields', fieldExpr).isString();
		fieldExpr = jQuery.trim(fieldExpr);
		if (Z._displayFields != fieldExpr) {
			Z._displayFields = fieldExpr;
			Z._innerdisplayFields = null;
			if(Z._hostField) {
				Z._hostField._clearFieldCache();
			}
		}
		return this;
	},
	
	/**
	 * Return extra field values of lookup dataset into main dataset:
	 * <pre><code>
	 * lookupFldObj.returnFieldMap({"main dataset field name":"lookup dataset field name", ...}); 
	 * </code></pre>
	 */
	returnFieldMap: function(returnFieldMap) {
		if(returnFieldMap === undefined) {
			return this._returnFieldMap;
		}
		jslet.Checker.test('FieldLookup.returnFieldMap', returnFieldMap).isObject();
		this._returnFieldMap = returnFieldMap;
	},
	
	/**
	 * @private
	 */
	getDefaultDisplayFields: function() {
//		var expr = '[',fldName = this.codeField();
//		if (fldName) {
//			expr += fldName + ']';
//		}
//		fldName = this.nameField();
//
//		if (fldName) {
//			expr += '+"-"+[';
//			expr += fldName + ']';
//		}
//		if (expr === '') {
//			expr = '"Not set displayFields"';
//		}
//		
		var expr = '[' + this.nameField() + ']';
		return expr;
	},

	/**
	 * @private
	 */
	getCurrentDisplayValue: function() {
		var Z = this;
		if (Z._displayFields === null) {
			this.displayFields(this.getDefaultDisplayFields());
		}
		if(!Z._innerdisplayFields) {
			Z._innerdisplayFields = new jslet.Expression(Z.dataset(), Z.displayFields());
		}
		
		return Z._innerdisplayFields.eval();
	},

	/**
	 * Identify whether user can select leaf level item if lookup dataset is a tree-style dataset.
	 * 
	 * @param {Boolean or undefined} flag True - Only leaf level item user can selects, false - otherwise.
	 * @return {Boolean or this}
	 */
	onlyLeafLevel: function(flag) {
		var Z = this;
		if (flag === undefined) {
			return Z._onlyLeafLevel;
		}
		Z._onlyLeafLevel = flag ? true: false;
		return this;
	},

	/**
	 * An expression for display field value. Example:
	 * <pre><code>
	 * lookupFldObj.editFilter('like([code], "101%" '); 
	 * </code></pre>
	 * 
	 * @param {String or undefined} flag True - Only leaf level item user can selects, false - otherwise.
	 * @return {String or this}
	 */
	editFilter: function(editFilter) {
		var Z = this;
		if (editFilter === undefined) {
			return Z._editFilter;
		}
		jslet.Checker.test('FieldLookup.editFilter', editFilter).isString();
		
		if (Z._editFilter != editFilter) {
			Z._editFilter = editFilter;
		}
		return this;
	},
	
	/**
	 * Disable or hide the edit item which not match the 'editFilter'.
	 * editItemDisabled is true, the non-matched item will be disabled, not hidden.
	 * 
	 * @param {Boolean or undefined} editItemDisabled - true: disable edit item, false: hide edit item, default is true.
	 * @return {Boolean or this}
	 */
	editItemDisabled: function(editItemDisabled) {
		var Z = this;
		if (editItemDisabled === undefined) {
			return Z._editItemDisabled;
		}
		
		Z._editItemDisabled = editItemDisabled? true: false;
		return this;
	}
	
};

/**
 * Create lookup field object.
 * 
 * @param {Json Object} param A json object which property names are same as jslet.data.FieldLookup. Example: {dataset: fooDataset, keyField: 'xxx', ...}
 * @return {jslet.data.FieldLookup}
 */
jslet.data.createFieldLookup = function(param, hostDsName) {
	jslet.Checker.test('createFieldLookup#param', param).required().isObject();
	var lkds = param.dataset;
	if (!lkds) {
		throw new Error('Property: dataset required!');
	}
	var lkFldObj = new jslet.data.FieldLookup();
		lkFldObj._hostDatasetName = hostDsName;
	if (param.realDataset !== undefined) {
		lkFldObj.realDataset(param.realDataset);
	}
	lkFldObj.dataset(lkds);
	if (param.keyField !== undefined) {
		lkFldObj.keyField(param.keyField);
	}
	if (param.codeField !== undefined) {
		lkFldObj.codeField(param.codeField);
	}
	if (param.nameField !== undefined) {
		lkFldObj.nameField(param.nameField);
	}
	if (param.codeFormat !== undefined) {
		lkFldObj.codeFormat(param.codeFormat);
	}
	if (param.displayFields !== undefined) {
		lkFldObj.displayFields(param.displayFields);
	}
	if (param.parentField !== undefined) {
		lkFldObj.parentField(param.parentField);
	}
	if (param.onlyLeafLevel !== undefined) {
		lkFldObj.onlyLeafLevel(param.onlyLeafLevel);
	}
	if (param.returnFieldMap !== undefined) {
		lkFldObj.returnFieldMap(param.returnFieldMap);
	}
	if (param.editFilter !== undefined) {
		lkFldObj.editFilter(param.editFilter);
	}
	if (param.editItemDisabled !== undefined) {
		lkFldObj.editItemDisabled(param.editItemDisabled);
	}
	
	return lkFldObj;
};

jslet.data.CrossFieldSource = function() {
	var Z = this;
	
	Z._sourceType = 0; //Optional value: 0-field, 1-custom'
	Z._sourceField = null;
	Z._lookupLevel = 1;
	
	Z._labels = null;
	Z._values = null;
	Z._matchExpr = null;
	
	Z._hideEmptyValue = false;
	Z._hasSubtotal = true;
	Z._subtotalPosition = 1; //Optional value: 0-first, 1-end
	Z._subtotalLabel = null;		
};
jslet.data.CrossFieldSource.className = 'jslet.data.CrossFieldSource';

jslet.data.CrossFieldSource.prototype = {
	className: jslet.data.CrossFieldSource.className,
	
	clone: function(){
		var Z = this, 
			result = new jslet.data.CrossFieldSource();
		result.sourceType(Z._sourceType);
		result.sourceField(Z._sourceField);
		result.lookupLevel(Z._lookupLevel);
		result.labels(Z._labels);
		result.values(Z._values);
		result.matchExpr(Z._matchExpr);
		result.hideEmptyValue(Z._hideEmptyValue);
		result.hasSubtotal(Z._hasSubtotal);
		result.subtotalPosition(Z._subtotalPosition);
		result.subtotalLabel(Z._subtotalLabel);
		return result;
	},
	
	/**
	 * Cross source type, optional value: 0 - field, 1 - custom.
	 * 
	 * @param {Number or undefined} sourceType Cross source type.
	 * @return {Number or this}
	 */
	sourceType: function(sourceType) {
		var Z = this;
		if (sourceType === undefined) {
			return Z._sourceType;
		}
		jslet.Checker.test('CrossFieldSource.sourceType', sourceType).isNumber();
		Z._sourceType = sourceType;
		return this;
	},

	/**
	 * Identify the field name which is used to create cross field. Avaliable when crossType is 0-Field.
	 * sourceField must be a lookup field and required. 
	 * 
	 * @param {String or undefined} sourceField The field name which is used to create cross field.
	 * @return {String or this}
	 */
	sourceField: function(sourceField) {
		var Z = this;
		if (sourceField === undefined) {
			return Z._sourceField;
		}
		jslet.Checker.test('CrossFieldSource.sourceField', sourceField).isString();
		Z._sourceField = sourceField;
		return this;
	},
	
	/**
	 * Identify cross field labels. Avaliable when crossType is 1-Field.
	 * If labels is null, use "values" as "labels" instead.
	 * 
	 * @param {String[] or undefined} labels The cross field labels.
	 * @return {String[] or this}
	 */
	labels: function(labels) {
		var Z = this;
		if (labels === undefined) {
			return Z._labels;
		}
		jslet.Checker.test('CrossFieldSource.labels', labels).isArray();
		Z._labels = labels;
		return this;
	},
	
	/**
	 * Identify cross field cross values. Avaliable when crossType is 1-Field.
	 * If crossType is 1-Field, "values" is reqired.
	 * 
	 * @param {Object[] or undefined} values The cross field source values.
	 * @return {Object[] or this}
	 */
	values: function(values) {
		var Z = this;
		if (values === undefined) {
			return Z._values;
		}
		jslet.Checker.test('CrossFieldSource.values', values).isArray();
		Z._values = values;
		return this;
	},
	
	/**
	 * Identify the field name which is used to create cross field. Avaliable when crossType is 1-Custom.
	 * If crossType is 1-Custom, matchExpr is required. 
	 * 
	 * @param {String or undefined} matchExpr The expression which use to match value.
	 * @return {String or this}
	 */
	matchExpr: function(matchExpr) {
		var Z = this;
		if (matchExpr === undefined) {
			return Z._matchExpr;
		}
		jslet.Checker.test('CrossFieldSource.matchExpr', matchExpr).isString();
		Z._matchExpr = matchExpr;
		return this;
	},
	
	/**
	 * Identify it has subtotal column or not.
	 * 
	 * @param {Boolean or undefined} hasSubtotal True - has subtotal, false otherwise.
	 * @return {Boolean or this}
	 */
	hasSubtotal: function(hasSubtotal) {
		var Z = this;
		if (hasSubtotal === undefined) {
			return Z._hasSubtotal;
		}
		jslet.Checker.test('CrossFieldSource.hasSubtotal', hasSubtotal).isString();
		Z._hasSubtotal = hasSubtotal;
		return this;
	},
	
	/**
	 * Identify the "subtotal" column position. Avaliable when "hasSubtotal" is true;
	 * Optional Value: 0 - At first column, 1 - At last column.
	 * 
	 * @param {Number or undefined} subtotalPosition subtotal column position.
	 * @return {Number or this}
	 */
	subtotalPosition: function(subtotalPosition) {
		var Z = this;
		if (subtotalPosition === undefined) {
			return Z._subtotalPosition;
		}
		jslet.Checker.test('CrossFieldSource.subtotalPosition', subtotalPosition).isNumber();
		Z._subtotalPosition = subtotalPosition;
		return this;
	},

	/**
	 * Subtotal label. Avaliable when "hasSubtotal" is true;
	 * 
	 * @param {String or undefined} subtotalLabel Subtotal label.
	 * @return {String or this}
	 */
	subtotalLabel: function(subtotalLabel) {
		var Z = this;
		if (subtotalLabel === undefined) {
			return Z._subtotalLabel;
		}
		jslet.Checker.test('CrossFieldSource.subtotalLabel', subtotalLabel).isString();
		Z._subtotalLabel = subtotalLabel;
		return this;
	}
}

jslet.data.createCrossFieldSource = function(cfg) {
	var result = new jslet.data.CrossFieldSource();
	var srcType = cfg.sourceType || 0;
	result.sourceType(srcType);
	if(cfg.hasSubtotal !== undefined) {
		result.hasSubtotal(cfg.hasSubtotal);
	}
	
	if(cfg.subtotalPosition !== undefined) {
		result.subtotalPosition(cfg.subtotalPosition);
	}
	
	if(cfg.subtotalLabel !== undefined) {
		result.subtotalLabel(cfg.subtotalLabel);
	}
	
	if(srcType === 0) {
		result.sourceField(cfg.sourceField);
	} else {
		result.labels(cfg.labels);
		result.values(cfg.values);
		result.matchExpr(cfg.matchExpr);
	}
	return result;
}
