/* ========================================================================
 * Jslet framework: jslet.contextrule.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

jslet.data.ContextRule = function() {
	var Z = this;
	Z._name = '';
	Z._description = '';
	Z._status = undefined;
	Z._condition = undefined;
	Z._rules = [];
};

jslet.data.ContextRule.className = 'jslet.data.ContextRule';

jslet.data.ContextRule.prototype = {
	className: jslet.data.ContextRule.className,
	
	dataStatus: ['insert','update','other'],
	
	name: function(name) {
		if(name === undefined) {
			return this._name;
		}
		
		jslet.Checker.test('ContextRule.name', name).isString();
		this._name = jQuery.trim(name);
		return this;
	},

	status: function(status) {
		if(status === undefined) {
			return this._status;
		}
		
		jslet.Checker.test('ContextRule.status', status).isArray();
		if(status) {
			var item, checker;
			for(var i = 0, len = status.length; i < len; i++) {
				item = jQuery.trim(status[i]);
				checker = jslet.Checker.test('ContextRule.status' + i, item).isString().required();
				item = item.toLowerCase();
				checker.testValue(item).inArray(this.dataStatus);
				status[i] = item;
			}
		}
		this._status = status;
		return this;
	},
	
	condition: function(condition) {
		if(condition === undefined) {
			return this._condition;
		}
		
		jslet.Checker.test('ContextRule.status', condition).isString();
		this._condition = jQuery.trim(condition);
		return this;
	},
	
	rules: function(rules) {
		if(rules === undefined) {
			return this._rules;
		}

		jslet.Checker.test('ContextRule.rules', rules).isArray();
		this._rules = rules;
		return this;
	}
};

jslet.data.ContextRuleItem = function(fldName) {
	var Z = this;
	jslet.Checker.test('ContextRule.field', fldName).isString();
	fldName = jQuery.trim(fldName);
	jslet.Checker.test('ContextRule.field', fldName).required();
	Z._field = fldName;
	
	Z._meta = undefined;
	Z._value = undefined;
	Z._lookup = undefined;
};

jslet.data.ContextRuleItem.className = 'jslet.data.ContextRuleItem';

jslet.data.ContextRuleItem.prototype = {
	className: jslet.data.ContextRuleItem.className,
	
	field: function() {
		return this._field;
	},
	
	meta: function(meta) {
		if(meta === undefined) {
			return this._meta;
		}
		
		jslet.Checker.test('ContextRuleItem.meta', meta).isClass(jslet.data.ContextRuleMeta.className);
		this._meta = meta;
		return this;
	},

	lookup: function(lookup) {
		if(lookup === undefined) {
			return this._lookup;
		}
		
		jslet.Checker.test('ContextRuleItem.lookup', lookup).isClass(jslet.data.ContextRuleLookup.className);
		this._lookup = lookup;
		return this;
	},

	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		
		this._value = value;
		return this;
	}
};

jslet.data.ContextRuleMeta = function() {
	var Z = this;
	Z._label = undefined;
	Z._tip = undefined;
	Z._nullText = undefined;
	
	Z._required = undefined;
	Z._disabled = undefined;
	Z._readOnly = undefined;
	Z._visible = undefined;
	Z._formula = undefined;
	Z._scale = undefined;
	Z._defaultValue = undefined;
	Z._displayFormat = undefined;
	Z._editMask = undefined;
	Z._editControl = undefined;
	
	Z._range = undefined;
	Z._regularExpr = undefined;
	Z._valueCountLimit = undefined;
	Z._validChars = undefined;
	Z._customValidator = undefined;
};

jslet.data.ContextRuleMeta.className = 'jslet.data.ContextRuleMeta';

jslet.data.ContextRuleMeta.prototype = {
	className: jslet.data.ContextRuleMeta.className,
	
	properties: ['label', 'tip','nullText', 'required','disabled','readOnly','visible',
	             'formula','scale','defaultValue','displayFormat','editMask','editControl',
	             'range','regularExpr','valueCountLimit','validChars','customValidator'],
	/**
	 * Get or set field label.
	 * 
	 * @param {String or undefined} label Field label.
	 * @return {String or this}
	 */
	label: function (label) {
		if (label === undefined) {
			return this._label;
		}
		jslet.Checker.test('ContextRuleMeta.label', label).isString();
		this._label = label;
		return this;
	},

	/**
	 * Get or set field tip.
	 * 
	 * @param {String or undefined} tip Field tip.
	 * @return {String or this}
	 */
	tip: function(tip) {
		if (tip === undefined) {
			return this._tip;
		}
		jslet.Checker.test('ContextRuleMeta.tip', tip).isString();
		this._tip = tip;
		return this;
	},

	/**
	 * Get or set the display text if the field value is null.
	 * 
	 * @param {String or undefined} nullText Field null text.
	 * @return {String or this}
	 */
	nullText: function (nullText) {
		if (nullText === undefined) {
			return this._nullText;
		}
		
		jslet.Checker.test('ContextRuleMeta.nullText', nullText).isString();
		this._nullText = jQuery.trim(nullText);
		return this;
	},
	
	/**
	 * Get or set flag required.
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
			return Z._visible;
		}
		Z._visible = visible ? true: false;
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
			return Z._readOnly;
		}
		
		Z._readOnly = readOnly? true: false;
		return this;
	},

	/**
	 * Get or set field edit mask.
	 * 
	 * @param {jslet.data.EditMask or String or undefined} mask Field edit mask.
	 * @return {jslet.data.EditMask or this}
	 */
	editMask: function (mask) {
		var Z = this;
		if (mask === undefined) {
			return Z._editMask;
		}
		Z._editMask = mask;
		return this;
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
		jslet.Checker.test('ContextRuleMeta.scale', scale).isNumber();
		Z._scale = parseInt(scale);
		return this;
	},
	
	/**
	 * Get or set field formula. Example: 
	 * <pre><code>
	 *  obj.formula('[price]*[num]');
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
		
		jslet.Checker.test('ContextRuleMeta.formula', formula).isString();
		Z._formula = jQuery.trim(formula);
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
			return Z._displayFormat;
		}
		
		jslet.Checker.test('ContextRuleMeta.format', format).isString();
		Z._displayFormat = jQuery.trim(format);
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
			return Z._editControl;
		}

		Z._editControl = (typeof (editCtrl) === 'string') ? { type: editCtrl } : editCtrl;
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
		Z._defaultValue = dftValue;
		return this;
	},
	
	/**
	 * Get or set field rang.
	 * Range is an object as: {min: x, max: y}. Example:
	 * <pre><code>
	 * //For String field
	 *	var range = {min: 'a', max: 'z'};
	 *  //For Date field
	 *	var range = {min: new Date(2000,1,1), max: new Date(2010,12,31)};
	 *  //For Number field
	 *	var range = {min: 0, max: 100};
	 *  fldObj.range(range);
	 * </code></pre>
	 * 
	 * @param {Range or Json String} range Field range;
	 * @return {Range or this}
	 */
	range: function (range) {
		var Z = this;
		if (range === undefined) {
			return Z._range;
		}
		if (jslet.isString(range)) {
			Z._range = new Function('return ' + range);
		} else {
			Z._range = range;
		}
		return this;
	},

	/**
	 * Get or set regular expression.
	 * You can specify your own validator with regular expression. If regular expression not specified, 
	 * The default regular expression for Date and Number field will be used. Example:
	 * <pre><code>
	 * fldObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, 'Invalid phone number!');//like: 0755-12345678
	 * </code></pre>
	 * 
	 * @param {String or JSON object} expr Regular expression, format: {expr: xxx, message: yyy};
	 * @return {Object} An object like: { expr: expr, message: message }
	 */
	regularExpr: function (regularExpr) {
		var Z = this;
		if (regularExpr === undefined){
			return Z._regularExpr;
		}
		
		if (jslet.isString(regularExpr)) {
			Z._range = new Function('return ' + regularExpr);
		} else {
			Z._regularExpr = regularExpr;
		}
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
		jslet.Checker.test('ContextRuleMeta.valueCountLimit', count).isNumber();
		Z._valueCountLimit = parseInt(count);
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
		jslet.Checker.test('ContextRuleMeta.customValidator', validator).isFunction();
		Z._customValidator = validator;
		return this;
	},
	
	/**
	 * Valid characters for this field.
	 */
	validChars: function(chars){
		var Z = this;
		if (chars === undefined){
			return Z._validChars;
		}
		
		jslet.Checker.test('ContextRuleMeta.validChars', chars).isString();
		Z._validChars = jQuery.trim(chars);
	}
	
};

jslet.data.ContextRuleLookup = function() {
	var Z = this;
	Z._dataset = undefined;
	Z._filter = undefined;
	Z._fixedFilter = undefined;
	Z._criteria = undefined;
	Z._displayFields = undefined;
	Z._onlyLeafLevel = undefined;
};

jslet.data.ContextRuleLookup.className = 'jslet.data.ContextRuleLookup';

jslet.data.ContextRuleLookup.prototype ={
	className: jslet.data.ContextRuleLookup.className,
	
	properties: ['dataset', 'filter', 'fixedFilter', 'criteria', 'displayFields', 'onlyLeafLevel'],
	
	dataset: function(datasetName){
		var Z = this;
		if (datasetName === undefined){
			return Z._dataset;
		}
		jslet.Checker.test('ContextRuleLookup.dataset', datasetName).isString();
		Z._dataset = jQuery.trim(datasetName);
	},

	filter: function(filter){
		var Z = this;
		if (filter === undefined){
			return Z._filter;
		}
		jslet.Checker.test('ContextRuleLookup.filter', filter).isString();
		Z._filter = jQuery.trim(filter);
	},

	fixedFilter: function(fixedFilter){
		var Z = this;
		if (fixedFilter === undefined){
			return Z._fixedFilter;
		}
		jslet.Checker.test('ContextRuleLookup.fixedFilter', fixedFilter).isString();
		Z._fixedFilter = jQuery.trim(fixedFilter);
	},

	criteria: function(criteria){
		var Z = this;
		if (criteria === undefined){
			return Z._criteria;
		}
		jslet.Checker.test('ContextRuleLookup.criteria', criteria).isString();
		Z._criteria = jQuery.trim(criteria);
	},

	displayFields: function(displayFields){
		var Z = this;
		if (displayFields === undefined){
			return Z._displayFields;
		}
		jslet.Checker.test('ContextRuleLookup.displayFields', displayFields).isString();
		Z._displayFields = jQuery.trim(displayFields);
	},

	onlyLeafLevel: function(onlyLeafLevel){
		var Z = this;
		if (onlyLeafLevel === undefined){
			return Z._onlyLeafLevel;
		}
		Z._onlyLeafLevel = onlyLeafLevel ? true: false;
	}
};

jslet.data.createContextRule = function(cxtRuleCfg) {
	if(!cxtRuleCfg) {
		return null;
	}
	var ruleObj = new jslet.data.ContextRule();
	if(cxtRuleCfg.status !== undefined) {
		ruleObj.status(cxtRuleCfg.status);
	}
	if(cxtRuleCfg.condition !== undefined) {
		ruleObj.condition(cxtRuleCfg.condition);
	}
	if(cxtRuleCfg.rules !== undefined) {
		jslet.Checker.test('ContextRule.rules', rules).isArray();
		var rules = [];
		ruleObj.rules(rules);
		for(var i = 0, len = cxtRuleCfg.rules.length; i < len; i++) {
			rules.push(createContextRuleItem(cxtRuleCfg.rules[i]));
		}
	}
	
	function createContextRuleItem(itemCfg) {
		var item = new jslet.data.ContextRuleItem(itemCfg.field);
		if(itemCfg.meta !== undefined) {
			item.meta(createContextRuleMeta(itemCfg.meta));
		}
		
		if(itemCfg.value !== undefined) {
			item.value(itemCfg.value);
		}
		
		if(itemCfg.lookup !== undefined) {
			item.lookup(createContextRuleLookup(itemCfg.lookup));
		}
		return item;
	}
	
	function createContextRuleMeta(metaCfg) {
		var meta = new jslet.data.ContextRuleMeta();
		if(metaCfg.label !== undefined) {
			meta.label(metaCfg.label);
		}
		
		if(metaCfg.tip !== undefined) {
			meta.tip(metaCfg.tip);
		}
		
		if(metaCfg.nullText !== undefined) {
			meta.nullText(metaCfg.nullText);
		}
		
		if(metaCfg.required !== undefined) {
			meta.required(metaCfg.required);
		}
		
		if(metaCfg.disabled !== undefined) {
			meta.disabled(metaCfg.disabled);
		}
		
		if(metaCfg.readOnly !== undefined) {
			meta.readOnly(metaCfg.readOnly);
		}
		
		if(metaCfg.visible !== undefined) {
			meta.visible(metaCfg.visible);
		}
		
		if(metaCfg.formula !== undefined) {
			meta.formula(metaCfg.formula);
		}
		
		if(metaCfg.scale !== undefined) {
			meta.scale(metaCfg.scale);
		}
		
		if(metaCfg.required !== undefined) {
			meta.required(metaCfg.required);
		}
		
		if(metaCfg.displayFormat !== undefined) {
			meta.displayFormat(metaCfg.displayFormat);
		}
		
		if(metaCfg.editMask !== undefined) {
			meta.editMask(metaCfg.editMask);
		}
		
		if(metaCfg.editControl !== undefined) {
			meta.editControl(metaCfg.editControl);
		}
		
		if(metaCfg.range !== undefined) {
			meta.range(metaCfg.range);
		}
		
		if(metaCfg.regularExpr !== undefined) {
			meta.regularExpr(metaCfg.regularExpr);
		}
		
		if(metaCfg.valueCountLimit !== undefined) {
			meta.valueCountLimit(metaCfg.valueCountLimit);
		}
		
		if(metaCfg.validChars !== undefined) {
			meta.validChars(metaCfg.validChars);
		}
		
		if(metaCfg.customValidator !== undefined) {
			meta.customValidator(metaCfg.customValidator);
		}
		
		return meta;
	}

	function createContextRuleLookup(lookupCfg) {
		var lookup = new jslet.data.ContextRuleLookup();
		if(lookupCfg.dataset !== undefined) {
			lookup.dataset(lookupCfg.dataset);
		}
		
		if(lookupCfg.filter !== undefined) {
			lookup.filter(lookupCfg.filter);
		}
		
		if(lookupCfg.fixedFilter !== undefined) {
			lookup.fixedFilter(lookupCfg.fixedFilter);
		}
		
		if(lookupCfg.criteria !== undefined) {
			lookup.criteria(lookupCfg.criteria);
		}
		
		if(lookupCfg.displayFields !== undefined) {
			lookup.displayFields(lookupCfg.displayFields);
		}
		
		if(lookupCfg.onlyLeafLevel !== undefined) {
			lookup.onlyLeafLevel(lookupCfg.onlyLeafLevel);
		}
		
		return lookup;
	}
	return ruleObj;
};

jslet.data.ContextRuleEngine = function(dataset) {
	this._dataset = dataset;
	this._matchedRules = [];
	this._ruleEnv = {};
};

jslet.data.ContextRuleEngine.prototype = {

	compile: function() {
		var contextRules = this._dataset.contextRules();
		for(var i = 0, len = contextRules.length; i < len; i++) {
			this._compileOneRule(contextRules[i]);
		}
	},

	evalStatus: function() {
		var contextRules = this._dataset.contextRules(),
			status = 'other', 
			dsStatus = this._dataset.changedStatus();
		if(dsStatus == jslet.data.DataSetStatus.INSERT) {
			status = 'insert';
		} else if(dsStatus == jslet.data.DataSetStatus.UPDATE) {
			status = 'update';
		}

		this._matchedRules = [];
		var ruleObj, ruleStatus;
		for(var i = 0, len = contextRules.length; i < len; i++) {
			ruleObj = contextRules[i];
			ruleStatus = ruleObj.status();
			if(ruleStatus && ruleStatus.indexOf(status) >= 0) {
				this._evalRuleItems(ruleObj.rules(), status == 'insert' || status == 'update');
			}
		}
		this._syncMatchedRules();
	},
	
	evalRule: function(changingFldName){
		var contextRules = this._dataset.contextRules();
		var ruleObj;
		this._matchedRules = [];
		this._ruleEnv = {};
		for(var i = 0, len = contextRules.length; i < len; i++) {
			ruleObj = contextRules[i];
			if(!ruleObj.status()) {
				this._evalOneRule(ruleObj, changingFldName);
			}
		}
		this._syncMatchedRules();
	},
	
	_compileOneRule: function(ruleObj) {
		var condition = ruleObj.condition;
		this._compileExpr(ruleObj, 'condition', true);
		var rules = ruleObj.rules();
		for(var i = 0, len = rules.length; i < len; i++) {
			this._compileRuleItem(rules[i]);
		}
	},
	
	_compileRuleItem: function(ruleItem) {
		this._compileExpr(ruleItem, 'value');
		var metaObj = ruleItem.meta();
		var props, propName, i, len;
		if(metaObj) {
			props = metaObj.properties;
			len = props.length;
			for(i = 0; i < len; i++) {
				propName = props[i];
				this._compileExpr(metaObj, propName);
			}
		}
		var lookupObj = ruleItem.lookup();
		if(lookupObj) {
			props = lookupObj.properties;
			len = props.length;
			for(i = 0; i < len; i++) {
				propName = props[i];
				this._compileExpr(lookupObj, propName);
			}
		}
	},
	
	_compileExpr: function(itemObj, propName, isExpr) {
		var setting = itemObj[propName].call(itemObj),
			exprName = propName +'Expr';
		
		if(setting !== null && setting !== undefined && jslet.isString(setting)) {
			if(setting.indexOf('expr:') === 0) {
				setting = setting.substring(5);
				isExpr = true;
			}
			if(isExpr) {
				itemObj[exprName] = new jslet.Expression(this._dataset, setting);
			}
		}
	},
	
	_evalOneRule: function(ruleObj, changingFldName) {
		var matched = false;
		var exprObj = ruleObj.conditionExpr;
		var mainFields = null;
		if(exprObj) {
			mainFields = exprObj.mainFields();
			if(changingFldName) {
				if(mainFields && mainFields.indexOf(changingFldName) < 0) {
					return;
				}
			}
			matched = ruleObj.conditionExpr.eval();
		} else {
			matched = ruleObj.condition();
		}
		if(matched) {
			var ruleEnv = null;
			if(mainFields) {
				var fldName;
				for(var i = 0, len = mainFields.length; i < len; i++) {
					fldName = mainFields[i];
					if(this._ruleEnv[fldName] === undefined) {
						this._ruleEnv[fldName] = this._dataset.getFieldValue(fldName);
					}
				}
			}
			this._evalRuleItems(ruleObj.rules(), changingFldName? true: false)
		}
	},
	
	_evalRuleItems: function(rules, isValueChanged) {
		var fldName, ruleItem, matchedRule;
		for(var i = 0, len = rules.length; i < len; i++) {
			ruleItem = rules[i];
			fldName = ruleItem.field();
			matchedRule = this._findMatchedRule(fldName);
			if(!matchedRule) {
				matchedRule = new jslet.data.ContextRuleItem(fldName);
			}
			
			var meta = ruleItem.meta(); 
			if(meta) {
				matchedRule.meta(new jslet.data.ContextRuleMeta());
				this._copyProperties(meta, matchedRule.meta());
			}
			
			var lookup = ruleItem.lookup(); 
			if(lookup) {
				matchedRule.lookup(new jslet.data.ContextRuleLookup());
				this._copyProperties(lookup, matchedRule.lookup());
			}

			if(isValueChanged && ruleItem.value() !== undefined) {
				matchedRule.value(this._evalExpr(ruleItem, 'value'));
			}
			this._matchedRules.push(matchedRule);
		}
	},
	
	_copyProperties: function(srcObject, descObject) {
		var props = srcObject.properties, propName, propValue;
		for(var i = 0, len = props.length; i < len; i++) {
			propName = props[i];
			propValue = this._evalExpr(srcObject, propName);
			if(propValue !== undefined) {
				descObject[propName].call(descObject, propValue);
			}
		}
	},
	
	_evalExpr: function(evalObj, propName) {
		var exprObj = evalObj[propName + 'Expr'];
		if(exprObj) {
			return exprObj.eval();
		} else {
			return evalObj[propName].call(evalObj);
		}
	},
	
	_findMatchedRule: function(fldName) {
		var item;
		for(var i = 0, len = this._matchedRules.length; i < len; i++) {
			item = this._matchedRules[i];
			if(fldName == item.field()) {
				return item;
			}
		}
		return null;
	},
	
	_syncMatchedRules: function() {
		var matchedRules = this._matchedRules,
			ruleObj, fldName, fldObj;
		
		for(var i = 0, len = matchedRules.length; i < len; i++) {
			ruleObj = matchedRules[i];
			fldName = ruleObj.field();
			fldObj = this._dataset.getField(fldName);
			if(fldObj) {
				this._syncMatchedRuleMeta(fldObj, ruleObj.meta());
				this._syncMatchedRuleLookup(fldObj, ruleObj.lookup());
				this._syncMatchedRuleValue(fldObj, ruleObj.value());
			}
		}
	},
	
	_syncMatchedRuleMeta: function(fldObj, ruleMeta) {
		if(!ruleMeta) {
			return;
		}
		var props = ruleMeta.properties, 
			propName, propValue;
		for(var i = 0, len = props.length; i < len; i++) {
			propName = props[i];
			propValue = ruleMeta[propName].call(ruleMeta);
			if(propValue !== undefined) {
				fldObj[propName].call(fldObj, propValue);
			}
		}
	},
	
	_syncMatchedRuleLookup: function(fldObj, ruleLookup) {
		if(!ruleLookup) {
			return;
		}
		var fieldLookup = fldObj.lookup();
		if(!fieldLookup) {
			return;
		}
		var ruleDs = ruleLookup.dataset();
		if(ruleDs) {
			fieldLookup.dataset(ruleDs);
		}
		var lkDsObj = fieldLookup.dataset();
		lkDsObj.autoRefreshHostDataset(true);
		var ruleFilter = ruleLookup.filter();
		if(ruleFilter !== undefined) {
			for(var fldName in this._ruleEnv) {
				ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
			}
			lkDsObj.filter(ruleFilter);
			lkDsObj.filtered(true);
		}
		var ruleFilter = ruleLookup.fixedFilter();
		if(ruleFilter !== undefined) {
			for(var fldName in this._ruleEnv) {
				ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
			}
			lkDsObj.fixedFilter(ruleFilter);
			lkDsObj.filtered(true);
		}
		var ruleCriteria = ruleLookup.criteria();
		if(ruleCriteria !== undefined) {
			lkDsObj.query(ruleCriteria);
		}
		var ruleDisplayFields = ruleLookup.displayFields();
		if(ruleDisplayFields !== undefined) {
			fieldLookup.displayFields(ruleDisplayFields);
		}
		var ruleOnlyLeafLevel = ruleLookup.onlyLeafLevel();
		if(ruleOnlyLeafLevel !== undefined) {
			fieldLookup.onlyLeafLevel(ruleOnlyLeafLevel);
		}
	},
	
	_syncMatchedRuleValue: function(fldObj, value) {
		if(value !== undefined) {
			fldObj.setValue(value);
		}
	}
};








