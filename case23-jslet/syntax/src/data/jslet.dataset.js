/* ========================================================================
 * Jslet framework: jslet.dataset.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class Dataset
 * 
 * @param {String} name dataset's name that must be unique in jslet.data.dataModule variable.
 */
jslet.data.Dataset = function (name) {
	
	var Z = this;
	Z._name = null; //Dataset name
	Z._recordClass = jslet.global.defaultRecordClass; //Record class, used for serialized/deserialize
	Z._dataList = null; //Array of data records
	Z._oriDataList = null;
	Z._fields = []; //Array of jslet.data.Field
	Z._oriFields = null;
	
	Z._normalFields = []; //Array of jslet.data.Field except the fields with children.
	Z._recno = -1;
	Z._filteredRecnoArray = null;

	Z._unitConvertFactor = 1;
	Z._unitName = null;
	Z._aborted = false;

	Z._status = 0; // dataset status, optional values: 0:browse;1:created;2:updated;3:deleted;
	Z._subDatasetFields = null; //Array of dataset field object
	
	Z._fixedFilter = null;	
	Z._filter = null;
	Z._filtered = false;
	Z._innerFilter = null; //inner variable
	Z._findCondition = null;
	Z._innerFindCondition = null; //inner variable

	Z._innerFormularFields = null; //inner variable

	Z._bof = false;
	Z._eof = false;
	Z._igoreEvent = false;
	Z._logChanges = true;

	Z._modiObject = null;
	Z._inputtingRecord = {};
	Z._lockCount = 0;

	Z._fixedIndexFields = null;
	Z._innerFixedIndexFields = [];
	Z._indexFields = '';
	Z._innerIndexFields = [];
	Z._sortingFields = null;

	Z._convertDestFields = null;
	Z._innerConvertDestFields = null;

	Z._masterDataset = null;
	Z._detailDatasets = null; // array

	Z._datasetField = null; //jslet.data.Field 

	Z._linkedControls = []; //Array of DBControl except DBLabel
	Z._linkedLabels = []; //Array of DBLabel
	Z._silence = 0;
	Z._keyField = null;
	Z._codeField = null;
	Z._nameField = null;
	Z._parentField = null;
	Z._levelOrderField = null;
	Z._selectField = null;
	
	Z._contextRules = null;
	Z._contextRuleEngine = null;
	Z._contextRuleEnabled = false;

	Z._dataProvider = jslet.data.DataProvider ? new jslet.data.DataProvider() : null;

	Z._queryCriteria = null; //String query parameters 
	Z._queryUrl = null; //String query URL 
	Z._submitUrl = null; //String submit URL
	Z._pageSize = 500;
	Z._pageNo = 0;  
	Z._pageCount = 0;
	//The following attributes are used for private.
	Z._ignoreFilter = false;
	Z._ignoreFilterRecno = 0;
	
	Z._fieldValidator = new jslet.data.FieldValidator();
	
	Z._onFieldChanged = null;  
	
	Z._onCheckSelectable = null;
	
	Z._datasetListener = null; //
	
	Z._designMode = false;
	
	Z._autoShowError = true;
	Z._autoRefreshHostDataset = false;
	Z._readOnly = false;
	Z._aggradedValues = null;
	Z._afterScrollDebounce = jslet.debounce(Z._innerAfterScrollDebounce, 30);
	Z._onlyChangedSubmitted = false;
	Z.selection = new jslet.data.DataSelection(Z);
	Z._changeLog = new jslet.data.ChangeLog(Z);
	Z._dataTransformer = new jslet.data.DataTransformer(Z);
	Z._followedValue = null;

	Z._lastFindingValue = null;
	Z._inContextRule = false;
	
	Z._errRecordCount = 0;
	this.name(name);
};
jslet.data.Dataset.className = 'jslet.data.Dataset';

jslet.data.Dataset.prototype = {

	className: jslet.data.Dataset.className,
	/**
	* Set dataset's name.
	* 
	* @param {String} name Dataset's name that must be unique in jslet.data.dataModule variable.
	* @return {String or this}
	*/
	name: function(name) {
		var Z = this;
		if(name === undefined) {
			return Z._name;
		}
		jslet.Checker.test('Dataset.name', name).required().isString();
		name = jQuery.trim(name);
		
		var dsName = this._name;
		if (dsName) {
			jslet.data.dataModule.unset(dsName);
			jslet.data.datasetRelationManager.changeDatasetName(dsName, name);
		}
		jslet.data.dataModule.unset(name);
		jslet.data.dataModule.set(name, this);
		this._name = name;
		Z._datasetField = jslet.data.datasetRelationManager.getHostFieldObject(name); //jslet.data.Field 
		return this;
	},
		
	/**
	* Set dataset's record class, recordClass is the server entity class quantified name.
	* It's used for automated serialization.
	* 
	* @param {String} clazz Server entity class name.
	* @return {String or this}
	*/
	recordClass: function(clazz) {
		var Z = this;
		if (clazz === undefined) {
			return Z._recordClass;
		}
		jslet.Checker.test('Dataset.recordClass', clazz).isString();
		Z._recordClass = clazz ? clazz.trim() : null;
		return this;
	},
		
	/**
	* Clone this dataset's structure and return new dataset object..
	* 
	* @param {String} newDsName New dataset's name.
	* @param {Array of String} fieldNames a list of field names which will be cloned to new dataset.
	* 
	* @return {jslet.data.Dataset} Cloned dataset object
	*/
	clone: function (newDsName, fieldNames) {
		var Z = this;
		if (!newDsName) {
			newDsName = Z._name + '_clone';
		}
		var result = new jslet.data.Dataset(newDsName);
		result._datasetListener = Z._datasetListener;

		result._unitConvertFactor = Z._unitConvertFactor;
		result._unitName = Z._unitName;

		result._fixedFilter = Z._fixedFilter;
		result._filter = Z._filter;
		result._filtered = Z._filtered;
		result._logChanges = Z._logChanges;
		result._fixedIndexFields = Z._fixedIndexFields;
		result._indexFields = Z._indexFields;
		result._onlyChangedSubmitted = Z._onlyChangedSubmitted;
		
		var keyFldName = Z._keyField,
			codeFldName = Z._codeField,
			nameFldName = Z._nameField,
			parentFldName = Z._parentField,
			levelOrderField = Z._levelOrderField,
			selectFldName = Z._selectField;
		if (fieldNames) {
			keyFldName = keyFldName && fieldNames.indexOf(keyFldName) >= 0 ? keyFldName: null;
			codeFldName = codeFldName && fieldNames.indexOf(codeFldName) >= 0 ? codeFldName: null;
			nameFldName = nameFldName && fieldNames.indexOf(nameFldName) >= 0 ? nameFldName: null;
			parentFldName = parentFldName && fieldNames.indexOf(parentFldName) >= 0 ? parentFldName: null;
			levelOrderField = levelOrderField && fieldNames.indexOf(levelOrderField) >= 0 ? levelOrderField: null;
			selectFldName = selectFldName && fieldNames.indexOf(selectFldName) >= 0 ? selectFldName: null;
		}
		result._keyField = keyFldName;
		result._codeField = codeFldName;
		result._nameField = nameFldName;
		result._parentField = parentFldName;
		result._levelOrderField = levelOrderField;
		result._selectField = selectFldName;

		result._contextRules = Z._contextRules;
		var fldObj, fldName;
		for(var i = 0, cnt = Z._fields.length; i < cnt; i++) {
			fldObj = Z._fields[i];
			fldName = fldObj.name();
			if (fieldNames) {
				if (fieldNames.indexOf(fldName) < 0) {
					continue;
				}
			}
			result.addField(fldObj.clone(fldName, result));
		}
		return result;
	},

	/**
	 * Clone one record to another
	 * 
	 * @param {Plan Object} srcRecord source record
	 * @param {Plan Object} destRecord destination record
	 */
	cloneRecord: function(srcRecord, destRecord) {
		var result = destRecord || {}, 
			fldName, fldObj, fldValue, newValue, 
			arrFieldObj = this.getNormalFields();

		for(var i = 0, len = arrFieldObj.length; i < len; i++) {
			fldObj = arrFieldObj[i];
			fldName = fldObj.name();
			fldValue = srcRecord[fldName];
			if(fldValue === undefined) {
				continue;
			}
			if(fldValue && jslet.isArray(fldValue)) {
				newValue = [];
				for(var j = 0, cnt = fldValue.length; j < cnt; j++) {
					newValue.push(fldValue[j]);
				}
			} else {
				newValue = fldValue;
			}
			result[fldName] = newValue;
		}
		jslet.data.FieldValueCache.removeCache(result);
		return result;
	},
	
	/**
	 * Add specified fields of source dataset into this dataset.
	 * 
	 * @param {jslet.data.Dataset} srcDataset New dataset's name.
	 * @param {Array of String} fieldNames a list of field names which will be copied to this dataset.
	 */
	addFieldFromDataset: function(srcDataset, fieldNames) {
		jslet.Checker.test('Dataset.addFieldFromDataset#srcDataset', srcDataset).required().isClass(jslet.data.Dataset.className);
		jslet.Checker.test('Dataset.addFieldFromDataset#fieldNames', fieldNames).isArray();
		var fldObj, fldName, 
			srcFields = srcDataset.getFields();
		for(var i = 0, cnt = srcFields.length; i < cnt; i++) {
			fldObj = srcFields[i];
			fldName = fldObj.name();
			if (fieldNames) {
				if (fieldNames.indexOf(fldName) < 0) {
					continue;
				}
			}
			this.addField(fldObj.clone(fldName, this));
		}
	},
	
	/**
	 * Set or get dataset is readonly or not.
	 * 
	 * @param {Boolean} readOnly.
	 * @return {Boolean or this}
	 */
	readOnly: function(readOnly) {
		var Z = this;
		if (readOnly === undefined) {
			return Z._readOnly;
		}
		
		Z._readOnly = readOnly? true: false;
		var fields = Z.getNormalFields(),
			fldObj;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			fldObj._fireMetaChangedEvent('readOnly', true);
		}
		return this;
	},
	
	/**
	 * Only submit the changed record to server.
	 * 
	 * @param {Boolean} onlyChangedSubmitted.
	 * @return {Boolean or this}
	 */
	onlyChangedSubmitted: function(onlyChangedSubmitted) {
		if(onlyChangedSubmitted === undefined) {
			return this._onlyChangedSubmitted;
		}
		this._onlyChangedSubmitted = onlyChangedSubmitted? true: false;
	},
	
	/**
	 * Set or get page size.
	 * 
	 * @param {Integer} pageSize.
	 * @return {Integer or this}
	 */
	pageSize: function(pageSize) {
		if (pageSize === undefined) {
			return this._pageSize;
		}
		
		jslet.Checker.test('Dataset.pageSize#pageSize', pageSize).isGTZero();
		this._pageSize = pageSize;
		return this;
	},

	/**
	 * Set or get page number.
	 * 
	 * @param {Integer} pageNo.
	 * @return {Integer or this}
	 */
	pageNo: function(pageNo) {
		if (pageNo === undefined) {
			return this._pageNo;
		}
		
		jslet.Checker.test('Dataset.pageNo#pageNo', pageNo).isGTZero();
		this._pageNo = pageNo;
		return this;
	},
	
	/**
	 * Get page count.
	 * 
	 * @return {Integer}
	 */
	pageCount: function() {
		return this._pageCount;
	},
	
	/**
	 * Identify whether dataset is in desin mode.
	 * 
	 * @param {boolean} designMode.
	 * @return {boolean or this}
	 */
	designMode: function(designMode) {
		if (designMode === undefined) {
			return this._designMode;
		}
		
		this._designMode = designMode ? true: false;
		return this;
	},
	
	/**
	 * Identify whether alerting the error message when confirm or apply to server.
	 * 
	 * @param {boolean} autoShowError.
	 * @return {boolean or this}
	 */
	autoShowError: function(autoShowError) {
		if (autoShowError === undefined) {
			return this._autoShowError;
		}
		
		this._autoShowError = autoShowError ? true: false;
		return this;
	},
	
	/**
	 * Update the host dataset or not if this dataset is a lookup dataset and its data has changed.
	 * If true, all datasets which host this dataset as a lookup dataset will be refreshed.
	 * 
	 * @param {boolean} flag.
	 * @return {boolean or this}
	 */
	autoRefreshHostDataset: function(flag) {
		if(flag === undefined) {
			return this._autoRefreshHostDataset;
		}
		this._autoRefreshHostDataset = flag ? true: false;
		return this;
	},
	
	/**
	 * Set unit converting factor.
	 * 
	 * @param {Double} factor When changed this value, the field's display value will be changed by 'fldValue/factor'.
	 * @param {String} unitName Unit name that displays after field value.
	 * @return {Double or this}
	 */
	unitConvertFactor: function (factor, unitName) {
		var Z = this;
		if (arguments.length === 0) {
			return Z._unitConvertFactor;
		}
		
		jslet.Checker.test('Dataset.unitConvertFactor#factor', factor).isGTZero();
		jslet.Checker.test('Dataset.unitConvertFactor#unitName', unitName).isString();
		if (factor > 0) {
			Z._unitConvertFactor = factor;
		}
		else{
			Z._unitConvertFactor = 1;
		}

		Z._unitName = unitName;
		for (var i = 0, cnt = Z._normalFields.length, fldObj; i < cnt; i++) {
			fldObj = Z._normalFields[i];
			if (fldObj.getType() == jslet.data.DataType.NUMBER && fldObj.unitConverted()) {
				var fldName = fldObj.name();
				jslet.data.FieldValueCache.clearAll(Z, fldName);
				var evt = jslet.data.RefreshEvent.updateColumnEvent(fldName);
				Z.refreshControl(evt);
			}
		} //end for
		return Z;
	},

	/**
	 * Set or get dataset event listener.
	 * Pattern:
	 * function(eventType, dataset) {}
	 * //eventType: jslet.data.DatasetEvent
	 * //dataset: jslet.data.Dataset
	 * 
	 * Example:
	 * <pre><code>
	 *   dsFoo.datasetListener(function(eventType, dataset) {
	 *		console.log(eventType);
	 *   });
	 * </code></pre>
	 * 
	 * @param {Function} listener Dataset event listener
	 * @return {Function or this}
	 */
	datasetListener: function(listener) {
		if (arguments.length === 0) {
			return this._datasetListener;
		}
		
		this._datasetListener = listener;
		return this;
	},
	
	/**
	 * Fired when check a record if it's selectable or not.
	 * Pattern:
	 *   function() {}
	 *   //return: Boolean, true - record can be selected, false - otherwise.
	 */
	onCheckSelectable: function(onCheckSelectable) {
		if (onCheckSelectable === undefined) {
			return this._onCheckSelectable;
		}
		
		this._onCheckSelectable = onCheckSelectable;
		return this;
	},
	
	fieldValidator: function() {
		return this._fieldValidator;
	},
	
	/**
	 * Set or get dataset onFieldChanged event handler.
	 * Pattern:
	 * function(fldName, value, valueIndex) {}
	 * //fldName: {String} field name
	 * //value: {Object} field value
	 * //valueIndex: {Integer} value index, has value when field value style is BETWEEN or MULTIPLE.
	 * 
	 * Example:
	 * <pre><code>
	 *   dsFoo.onFieldChanged(function(fldName, value, valueIndex) {
	 *		
	 *   });
	 * </code></pre>
	 * 
	 * @param {Function} onFieldChanged Dataset on field change event handler
	 * @return {Function or this}
	 */
	onFieldChanged: function(onFieldChanged) {
		if (onFieldChanged === undefined) {
			return this._onFieldChanged;
		}
		
		this._onFieldChanged = onFieldChanged;
		return this;
	},
	
	/**
	 * @deprecated
	 * Use onFieldChanged instead.
	 */
	onFieldChange: function(onFieldChanged) {
		if (onFieldChanged === undefined) {
			return this._onFieldChanged;
		}
		
		this._onFieldChanged = onFieldChanged;
		return this;
	},
	
	/**
	 * Get dataset fields.
	 * @return {Array of jslet.data.Field}
	 */
	getFields: function () {
		return this._fields;
	},

	/**
	 * Get fields except the fields with children.
	 * @return {Array of jslet.data.Field}
	 */
	getNormalFields: function() {
		return this._normalFields;
	},
	
	getEditableFields: function() {
		var fields = this._normalFields,
			fldObj,
			result = [];
		
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.visible() && !fldObj.disabled() && !fldObj.readOnly()) {
				result.push(fldObj.name());
			}
		}
		return result;
	},
	
	/**
	 * Set the specified fields to be visible, others to be hidden.
	 * 
	 * Example:
	 * <pre><code>
	 *   dsFoo.setVisibleFields(['field1', 'field3']);
	 * </code></pre>
	 * 
	 * @param {String[]} fieldNameArray array of field name
	 */
	setVisibleFields: function(fieldNameArray) {
		jslet.Checker.test('Dataset.setVisibleFields#fieldNameArray', fieldNameArray).isArray();
		this._travelField(this._fields, function(fldObj) {
			fldObj.visible(false);
			return false; //Identify if cancel traveling or not
		});
		if(!fieldNameArray) {
			return;
		}
		for(var i = 0, len = fieldNameArray.length; i < len; i++) {
			var fldName = jQuery.trim(fieldNameArray[i]);
			var fldObj = this.getField(fldName);
			if(fldObj) {
				fldObj.visible(true);
			}
		}
	},
	
	/**
	 * @private
	 */
	_travelField: function(fields, callBackFn) {
		if (!callBackFn || !fields) {
			return;
		}
		var isBreak = false;
		for(var i = 0, len = fields.length; i < len; i++) {
			var fldObj = fields[i];
			isBreak = callBackFn(fldObj);
			if (isBreak) {
				break;
			}
			
			var children = fldObj.children();
			if(children && children.length > 0) {
				isBreak = this._travelField(fldObj.children(), callBackFn);
				if (isBreak) {
					break;
				}
			}
		}
		return isBreak;
	},
	
	/**
	 * @private
	 */
	_cacheNormalFields: function() {
		var arrFields = this._normalFields = [];
		this._travelField(this._fields, function(fldObj) {
			var children = fldObj.children();
			if(!children || children.length === 0) {
				arrFields.push(fldObj);
			}
			return false; //Identify if cancel traveling or not
		});
	},
	
	/**
	 * Set or get datasetField object, use internally.
	 * 
	 * @param {Field} datasetField, "dataset field" in master dataset.
	 * @return {jslet.data.Field or this}
	 */
	datasetField: function(fldObj) {
		if (fldObj === undefined) {
			return this._datasetField;
		}
		jslet.Checker.test('Dataset.datasetField#fldObj', fldObj).isClass(jslet.data.Field.className);
		this._datasetField = fldObj;
		return this;
	},

	/**
	* Add a new field object.
	* 
	* @param {jslet.data.Field} fldObj: field object.
	*/
	addField: function (fldObj) {
		jslet.Checker.test('Dataset.addField#fldObj', fldObj).required().isClass(jslet.data.Field.className);
		var Z = this,
			fldName = fldObj.name();
		if(Z.getField(fldName)) {
			Z.removeField(fldName);
		}
		Z._fields.push(fldObj);
		fldObj.dataset(Z);
		var dispOrder = fldObj.displayOrder(); 
		if (dispOrder) {
			Z._fields.sort(jslet.data.displayOrderComparator);
		} else {
			fldObj.displayOrder(Z._fields.length - 1);
		}
		if (fldObj.getType() == jslet.data.DataType.DATASET) {
			if (!Z._subDatasetFields) {
				Z._subDatasetFields = [];
			}
			Z._subDatasetFields.push(fldObj);
		}
		
		Z._cacheNormalFields();
		
		function addFormulaField(fldObj) {
			var children = fldObj.children();
			if(!children || children.length === 0) {
				Z.addInnerFormulaField(fldObj.name(), fldObj.formula());
				return;
			}
			for(var i = 0, len = children.length; i < len; i++) {
				addFormulaField(children[i]);
			}
		}
		
		addFormulaField(fldObj);
		return Z;
	},
	
	refreshDisplayOrder: function() {
		this._fields.sort(jslet.data.displayOrderComparator);
		this._cacheNormalFields();
	},
	
	moveField: function(fromFldName, toFldName) {
		var Z = this,
			fromFldObj = Z.getField(fromFldName),
			toFldObj = Z.getField(toFldName),
			fromParent = fromFldObj.parent(),
			toParent = toFldObj.parent();
		if(!fromFldObj || !toFldObj || fromParent != toParent) {
			return;
		}
		var fields;
		if(fromParent) {
			fields = fromParent.children();
		} else {
			fields = Z._fields;
		}
		var fldObj, fldName,
			fromOrder = fromFldObj.displayOrder(),
			toOrder = toFldObj.displayOrder(),
			fromIndex = fields.indexOf(fromFldObj),
			toIndex = fields.indexOf(toFldObj),
			oldDesignMode = Z.designMode();
		Z.designMode(false);
		try {
			fromFldObj.displayOrder(toFldObj.displayOrder());
			if(fromIndex < toIndex) {
				for(var i = fromIndex + 1; i <= toIndex; i++) {
					fldObj = fields[i];
					fldObj.displayOrder(fldObj.displayOrder() - 1);
				}
			} else {
				for(var i = toIndex; i < fromIndex; i++) {
					fldObj = fields[i];
					fldObj.displayOrder(fldObj.displayOrder() + 1);
				}
			}
		} finally {
			Z.designMode(oldDesignMode);
		}
		Z.refreshDisplayOrder();
		if(Z.designMode()) {
			var handler = jslet.data.globalDataHandler.fieldMetaChanged();
			if(handler) {
				handler.call(this, Z, null, 'displayOrder');
			}
		}
	},
	
	/**
	 * Remove field by field name.
	 * 
	 * @param {String} fldName: field name.
	 */
	removeField: function (fldName) {
		jslet.Checker.test('Dataset.removeField#fldName', fldName).required().isString();
		fldName = jQuery.trim(fldName);
		var Z = this,
			fldObj = Z.getField(fldName);
		if (fldObj) {
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				var k = Z._subDatasetFields.indexOf(fldObj);
				if (k >= 0) {
					Z._subDatasetFields.splice(k, 1);
				}
			}
			var i = Z._fields.indexOf(fldObj);
			Z._fields.splice(i, 1);
			fldObj.dataset(null);
			Z.removeInnerFormulaField(fldName);
			Z._cacheNormalFields();
			jslet.data.FieldValueCache.clearAll(Z, fldName);

			function removeFormulaField(fldObj) {
				var children = fldObj.children();
				if(!children || children.length === 0) {
					Z.removeInnerFormulaField(fldObj.name());
					return;
				}
				for(var i = 0, len = children.length; i < len; i++) {
					removeFormulaField(children[i]);
				}
			}
			
			removeFormulaField(fldObj);
			
		}
		return Z;
	},

	/**
	 * Get field object by name.
	 * 
	 * @param {String} fldName: field name.
	 * @return jslet.data.Field
	 */
	getField: function (fldName) {
		jslet.Checker.test('Dataset.getField#fldName', fldName).isString().required();
		fldName = jQuery.trim(fldName);

		var arrField = fldName.split('.'), fldName1 = arrField[0];
		var fldObj = null;
		this._travelField(this._fields, function(fldObj1) {
			var cancelTravel = false;
			if (fldObj1.name() == fldName1) {
				fldObj = fldObj1;
				cancelTravel = true;
			}
			return cancelTravel; //Identify if cancel traveling or not
		});

		if (!fldObj) {
			return null;
		}
		
		if (arrField.length == 1) {
			return fldObj;
		}
		else {
			arrField.splice(0, 1);
			var lkf = fldObj.lookup();//Lookup dataset
			if (lkf) {
				var lkds = lkf.dataset();
				if (lkds) {
					return lkds.getField(arrField.join('.'));
				}
			} else {
				var subDs = fldObj.subDataset(); //Detail dataset
				if(subDs) {
					return subDs.getField(arrField.join('.'));
				}
			}
		}
		return null;
	},

	/**
	 * Get field object by name.
	 * 
	 * @param {String} fldName: field name.
	 * @return jslet.data.Field
	 */
	getTopField: function (fldName) {
		jslet.Checker.test('Dataset.getField#fldName', fldName).isString().required();
		fldName = jQuery.trim(fldName);
		
		var fldObj = this.getField(fldName);
		if (fldObj) {
			while(true) {
				if (fldObj.parent() === null) {
					return fldObj;
				}
				fldObj = fldObj.parent();
			}
		}
		return null;
	},
	
	/**
	 * @Private,Sort function.
	 * 
	 * @param {Object} rec1: dataset record.
	 * @param {Object} rec2: dataset record.
	 */
	sortFunc: function (rec1, rec2) {
		var dsObj = jslet.temp.sortDataset;
		
		var indexFlds = dsObj._sortingFields,
			strFields = [],
			fname, idxFldCfg;
		for (var i = 0, cnt = indexFlds.length; i < cnt; i++) {
			idxFldCfg = indexFlds[i];
			fname = idxFldCfg.fieldName;
			if(idxFldCfg.useTextToSort || dsObj.getField(fname).getType() === jslet.data.DataType.STRING) {
				strFields.push(fname);
			}
		}
		var  v1, v2, flag = 1;
		for (var i = 0, cnt = indexFlds.length; i < cnt; i++) {
			idxFldCfg = indexFlds[i];
			fname = idxFldCfg.fieldName;
			if(idxFldCfg.useTextToSort) {
				v1 = dsObj.getFieldTextByRecord(rec1, fname);
				v2 = dsObj.getFieldTextByRecord(rec2, fname);
			} else {
				v1 = dsObj.getFieldValueByRecord(rec1, fname);
				v2 = dsObj.getFieldValueByRecord(rec2, fname);
			}
			if (v1 == v2) {
				continue;
			}
			if (v1 !== null && v2 !== null) {
				if(strFields.indexOf(fname) >= 0) {
					v1 = v1.toLowerCase();
					v2 = v2.toLowerCase();
					flag = (v1.localeCompare(v2) < 0? -1: 1);
				} else {
					flag = (v1 < v2 ? -1: 1);
				}
			} else if (v1 === null && v2 !== null) {
				flag = -1;
			} else {
				if (v1 !== null && v2 === null) {
					flag = 1;
				}
			}
			return flag * idxFldCfg.order;
		} //end for
		return 0;
	},
	
	/**
	 * Set fixed index fields, field names separated by comma(',')
	 * 
	 * @param {String} indFlds: fixed index field name.
	 * @return {String or this}
	 */
	fixedIndexFields: function (fixedIndexFields) {
		var Z = this;
		if (fixedIndexFields === undefined) {
			return Z._fixedIndexFields;
		}
		
		jslet.Checker.test('Dataset.fixedIndexFields', fixedIndexFields).isString();
		
		Z._fixedIndexFields = fixedIndexFields;
		Z._innerFixedIndexFields = fixedIndexFields? Z._parseIndexFields(fixedIndexFields): [];
		var idxFld, fixedIdxFld;
		for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerIndexFields[i];
			for(var j = 0, len = Z._innerFixedIndexFields.length; j < len; j++) {
				fixedIdxFld = Z._innerFixedIndexFields[j];
				if(idxFld.fieldName === fixedIdxFld.fieldName) {
					Z._innerIndexFields.splice(i, 1);
				}
			}
		}
		
		Z._sortByFields();
		return this;
	},
	
	/**
	 * Set index fields, field names separated by comma(',')
	 * 
	 * @param {String} indFlds: index field name.
	 * @return {String or this}
	 */
	indexFields: function (indFlds) {
		var Z = this;
		if (indFlds === undefined) {
			return Z._indexFields;
		}
		
		jslet.Checker.test('Dataset.indexFields', indFlds).isString();
		indFlds = jQuery.trim(indFlds);
		if(!indFlds && !Z._indexFields && !Z._fixedIndexFields) {
			return this;
		}

		Z._indexFields = indFlds;
		Z._innerIndexFields = indFlds? Z._parseIndexFields(indFlds): [];
		var idxFld, fixedIdxFld;
		for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerIndexFields[i];
			for(var j = 0, len = Z._innerFixedIndexFields.length; j < len; j++) {
				fixedIdxFld = Z._innerFixedIndexFields[j];
				if(idxFld.fieldName === fixedIdxFld.fieldName) {
					fixedIdxFld.order = idxFld.order;
					Z._innerIndexFields.splice(i, 1);
				}
			}
		}
		Z._sortByFields();
		return this;
	},

	mergedIndexFields: function() {
		var Z = this,
			result = [];
		for(var i = 0, len = Z._innerFixedIndexFields.length; i < len; i++) {
			result.push(Z._innerFixedIndexFields[i]);
		}
		for(var i = 0, len = Z._innerIndexFields.length; i < len; i++) {
			result.push(Z._innerIndexFields[i]);
		}
		return result;
	},
	
	toggleIndexField: function(fldName, emptyIndexFields) {
		var Z = this,
			idxFld, 
			found = false;
		//Check fixed index fields
		for(var i = Z._innerFixedIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerFixedIndexFields[i];
			if(idxFld.fieldName === fldName) {
				idxFld.order = (idxFld.order === 1 ? -1: 1);
				found = true;
				break;
			}
		}
		if(found) {
			if(emptyIndexFields) {
				Z._innerIndexFields = [];
			}
			Z._sortByFields();
			return;
		}
		//Check index fields
		found = false;
		for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
			idxFld = Z._innerIndexFields[i];
			if(idxFld.fieldName === fldName) {
				idxFld.order = (idxFld.order === 1 ? -1: 1);
				found = true;
				break;
			}
		}
		if(found) {
			if(emptyIndexFields) {
				Z._innerIndexFields = [];
				Z._innerIndexFields.push(idxFld);
			}
		} else {
			if(emptyIndexFields) {
				Z._innerIndexFields = [];
			}
			idxFld = {fieldName: fldName, order: 1};
			Z._innerIndexFields.push(idxFld);
		}
		Z._sortByFields();
	},
	
	_parseIndexFields: function(indexFields) {
		var arrFields = indexFields.split(','), 
			fname, fldObj, arrFName, indexNameObj, 
			order = 1;//asce
		var result = [];
		for (i = 0, cnt = arrFields.length; i < cnt; i++) {
			fname = jQuery.trim(arrFields[i]);
			arrFName = fname.split(' ');
			if (arrFName.length == 1) {
				order = 1;
			} else if (arrFName[1].toLowerCase() == 'asce') {
				order = 1; //asce
			} else {
				order = -1; //desc
			}
			result.push({fieldName: arrFName[0], order: order});
		} //end for
		return result;
	},
	
	_sortByFields: function() {
		var Z = this;
		if (!Z.hasRecord()) {
			return;
		}
		Z.selection.removeAll();

		Z._sortingFields = [];
		var idxFld;
		for (var i = 0, cnt = Z._innerFixedIndexFields.length; i < cnt; i++) {
			idxFld = Z._innerFixedIndexFields[i];
			Z._createIndexCfg(idxFld.fieldName, idxFld.order);
		} //end for
		for (var i = 0, cnt = Z._innerIndexFields.length; i < cnt; i++) {
			idxFld = Z._innerIndexFields[i];
			Z._createIndexCfg(idxFld.fieldName, idxFld.order);
		} //end for

		var currRec = Z.getRecord(), 
		flag = Z.isContextRuleEnabled();
		if (flag) {
			Z.disableContextRule();
		}
		Z.disableControls();
		jslet.temp.sortDataset = Z;
		try {
			Z.dataList().sort(Z.sortFunc);
			Z._refreshInnerRecno();
		} finally {
			jslet.temp.sortDataset = null;
			Z.moveToRecord(currRec);
			if (flag) {
				Z.enableContextRule();
			}
			Z.enableControls();
		}		
	},
	
	/**
	 * @private
	 */
	_createIndexCfg: function(fname, order) {
		var Z = this,
			fldObj = fname;
		if(jslet.isString(fname)) {
			fldObj = Z.getField(fname);
		}
		if (!fldObj) {
			return;
		}
		if(fldObj.dataset() !== Z) {
			Z._combineIndexCfg(fname, order);
			return;
		}
		var children = fldObj.children();
		if (!children || children.length === 0) {
			var useTextToSort = true;
			if(fldObj.getType() === 'N' && !fldObj.lookup()) {
				useTextToSort = false;
			}
			Z._combineIndexCfg(fldObj.name(), order, useTextToSort);
		} else {
			for(var k = 0, childCnt = children.length; k < childCnt; k++) {
				Z._createIndexCfg(children[k], order);
			}
		}		
	},
	
	/**
	 * @private
	 */
	_combineIndexCfg: function(fldName, order, useTextToSort) {
		for(var i = 0, len = this._sortingFields.length; i < len; i++) {
			if (this._sortingFields[i].fieldName == fldName) {
				this._sortingFields.splice(i,1);//remove duplicated field
			}
		}
		var indexNameObj = {
				fieldName: fldName,
				order: order,
				useTextToSort: useTextToSort
			};
		this._sortingFields.push(indexNameObj);
	},
	
	_getWholeFilter: function() {
		var Z = this, 
			result = Z._fixedFilter;
		if(result) {
			if(Z._filter) {
				return '(' + result + ') && (' + Z._filter + ')';
			}
		} else {
			result = Z._filter;
		}
		return result;
	},
	
	/**
	 * Set or get dataset fixed filter expression
	 * Fixed filter is the global filter expression for dataset.
	 * <pre><code>
	 *   dsFoo.fixedFilter('[age] > 20');
	 * </code></pre>
	 * 
	 * @param {String} fixedFilter: fixed filter expression.
	 * @return {String or this}
	 */
	fixedFilter: function (fixedFilter) {
		var Z = this;
		if (fixedFilter === undefined) {
			return Z._fixedFilter;
		}
		
		jslet.Checker.test('dataset.fixedFilter', fixedFilter).isString();
		if(fixedFilter) {
			fixedFilter = jQuery.trim(fixedFilter);
		}
		var oldFilter = Z._getWholeFilter();
		Z._fixedFilter = fixedFilter;
		var newFilter = Z._getWholeFilter();
		
		if (!newFilter) {
			Z._innerFilter = null;
			Z._filtered = false;
			Z._filteredRecnoArray = null;
		} else {
			if(oldFilter == newFilter) {
				return this;
			} else {
				Z._innerFilter = new jslet.Expression(Z, newFilter);
			}
		}
		Z._doFilterChanged();
		return this;
	},
	
	/**
	 * Set or get dataset filter expression
	 * Filter can work depending on property: filtered, filtered must be true.
	 * <pre><code>
	 *   dsFoo.filter('[name] like "Bob%"');
	 *   dsFoo.filter('[age] > 20');
	 * </code></pre>
	 * 
	 * @param {String} filterExpr: filter expression.
	 * @return {String or this}
	 */
	filter: function (filterExpr) {
		var Z = this;
		if (filterExpr === undefined) {
			return Z._filter;
		}
		
		jslet.Checker.test('dataset.filter#filterExpr', filterExpr).isString();
		if(filterExpr) {
			filterExpr = jQuery.trim(filterExpr);
		}

		var oldFilter = Z._getWholeFilter();
		Z._filter = filterExpr;
		var newFilter = Z._getWholeFilter();
		
		if (!newFilter) {
			Z._innerFilter = null;
			Z._filtered = false;
			Z._filteredRecnoArray = null;
		} else {
			if(oldFilter == newFilter) {
				return this;
			} else {
				Z._innerFilter = new jslet.Expression(Z, newFilter);
			}
		}
		Z._doFilterChanged();
		return this;
	},

	/**
	 * Set or get filtered flag
	 * Only filtered is true, the filter can work
	 * 
	 * @param {Boolean} afiltered: filter flag.
	 * @return {Boolean or this}
	 */
	filtered: function (afiltered) {
		var Z = this;
		if (afiltered === undefined) {
			return Z._filtered;
		}
		
		var oldFilter = Z._getWholeFilter(), 
			oldFiltered = Z._filtered;
		if (afiltered && !oldFilter) {
			Z._filtered = false;
		} else {
			Z._filtered = afiltered ? true: false;
		}

		if(oldFiltered == Z._filtered) {
			return this;
		}
		this._doFilterChanged();
		return this;
	},
	
	_doFilterChanged: function() {
		var Z = this;
		Z.selection.removeAll();
		Z.disableControls();
		try {
			if (!Z._filtered) {
				Z._filteredRecnoArray = null;
			} else {
				Z._refreshInnerRecno();
			}
			Z.first();
			Z.calcAggradedValue();		
		}
		finally {
			Z.enableControls();
		}
		Z.refreshLookupHostDataset();

		return this;
	},
	
	/**
	 * @private, filter data
	 */
	_filterData: function () {
		var Z = this,
		 	filter = Z._getWholeFilter();
		if (!Z._filtered || !filter || 
				Z._status == jslet.data.DataSetStatus.INSERT || 
				Z._status == jslet.data.DataSetStatus.UPDATE) {
			return true;
		}
		var result = Z._innerFilter.eval();
		return result;
	},

	/**
	 * @private
	 */
	_refreshInnerRecno: function () {
		var Z = this;
		if (!Z.hasData()) {
			Z._filteredRecnoArray = null;
			return;
		}
		Z._filteredRecnoArray = null;
		var tempRecno = [];
		var oldRecno = Z._recno;
		try {
			for (var i = 0, cnt = Z.dataList().length; i < cnt; i++) {
				Z._recno = i;
				if (Z._filterData()) {
					tempRecno.push(i);
				}
			}
		}
		finally {
			Z._recno = oldRecno;
		}
		Z._filteredRecnoArray = tempRecno;
	},

	_innerAfterScrollDebounce: function() {
		var Z = this,
			eventFunc = jslet.getFunction(Z._datasetListener);
		if(eventFunc) {
			eventFunc.call(Z, jslet.data.DatasetEvent.AFTERSCROLL);
		}
	},
	
	/**
	 * @private
	 */
	_fireDatasetEvent: function (evtType) {
		var Z = this;
		if (Z._silence || Z._igoreEvent || !Z._datasetListener) {
			return;
		}
		if(evtType == jslet.data.DatasetEvent.AFTERSCROLL) {
			Z._afterScrollDebounce.call(Z);
		} else {
			var eventFunc = jslet.getFunction(Z._datasetListener);
			if(eventFunc) {
				eventFunc.call(Z, evtType);
			}
		}
	},

	/**
	 * Get record count
	 * 
	 * @return {Integer}
	 */
	recordCount: function () {
		var records = this.dataList();
		if (records) {
			if (!this._filteredRecnoArray) {
				return records.length;
			} else {
				return this._filteredRecnoArray.length;
			}
		}
		return 0;
	},

	hasRecord: function () {
		return this.recordCount() > 0;
	},
	
	hasData: function() {
		var records = this.dataList();
		return records && records.length > 0;
	},
	
	/**
	 * Set or get record number
	 * 
	 * @param {Integer}record number
	 * @return {Integer or this}
	 */
	recno: function (recno) {
		var Z = this;
		if (recno === undefined) {
			return Z._recno;
		}
		jslet.Checker.test('dataset.recno#recno', recno).isGTEZero();
		recno = parseInt(recno);
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return true;
		}
		
		if (recno == Z._recno) {
			return true;
		}
		Z.confirm();
		Z._gotoRecno(recno);
		Z._bof = Z._eof = false;
		return true;
	},
	
	/**
	 * Set record number silently, it will not fire any event.
	 * 
	 * @param {Integer}recno - record number
	 */
	recnoSilence: function (recno) {
		var Z = this;
		if (recno === undefined) {
			return Z._recno;
		}
		Z._recno = recno;
		return this;
	},

	/**
	 * @private
	 * Goto specified record number(Private)
	 * 
	 * @param {Integer}recno - record number
	 */
	_gotoRecno: function (recno) {
		var Z = this,
			recCnt = Z.recordCount();
		if(recCnt == 0) {
			return false;
		}
		if (recno >= recCnt) {
			recno = recCnt - 1;
		} else if (recno < 0) {
			recno = 0;
		}
		
		if (Z._recno == recno) {
			return false;
		}
		var evt;
		if (!Z._silence) {
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESCROLL);
				if (Z._aborted) {
					return false;
				}
			} finally {
				Z._aborted = false;
			}
			if (!Z._lockCount) {
				evt = jslet.data.RefreshEvent.beforeScrollEvent(Z._recno);
				Z.refreshControl(evt);
			}
		}

		var preno = Z._recno;
		Z._recno = recno;
		
		if (Z._recno != preno && Z._subDatasetFields && Z._subDatasetFields.length > 0) {
			var fldObj, subds;
			for (var i = 0, len = Z._subDatasetFields.length; i < len; i++) {
				fldObj = Z._subDatasetFields[i];
				subds = fldObj.subDataset();
				if (subds) {
					subds._initialize(true);
				}
			} //end for
		} //end if
		if (!Z._silence) {
			if (Z._contextRuleEnabled) {
				this.calcContextRule();
			}
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			if (!Z._lockCount) {
				evt = jslet.data.RefreshEvent.scrollEvent(Z._recno, preno);
				Z.refreshControl(evt);
			}
		}
		return true;
	},

	/**
	 * Abort insert/update/delete action before insert/update/delete.
	 * 
	 */
	abort: function () {
		this._aborted = true;
	},

	/**
	 * Get aborted status.
	 * 
	 * @return {Boolean}
	 */
	aborted: function() {
		return this._aborted;
	},
	
	/**
	 * @private
	 * Move cursor back to startRecno(Private)
	 * 
	 * @param {Integer}startRecno - record number
	 */
	_moveCursor: function (recno) {
		var Z = this;
		Z.confirm();
		Z._gotoRecno(recno);
	},

	/**
	 * Move record cursor by record object
	 * 
	 * @param {Object}recordObj - record object
	 * @return {Boolean} true - Move successfully, false otherwise. 
	 */
	moveToRecord: function (recordObj) {
		var Z = this;
		Z.confirm();
		if (!Z.hasRecord() || !recordObj) {
			return false;
		}
		jslet.Checker.test('dataset.moveToRecord#recordObj', recordObj).isObject();
		var k = Z.dataList().indexOf(recordObj);
		if (k < 0) {
			return false;
		}
		if (Z._filteredRecnoArray) {
			k = Z._filteredRecnoArray.indexOf(k);
			if (k < 0) {
				return false;
			}
		}
		Z._gotoRecno(k);
		return true;
	},

	/**
	 * @private
	 */
	startSilenceMove: function (notLogPos) {
		var Z = this;
		var context = {};
		if (!notLogPos) {
			context.recno = Z._recno;
		} else {
			context.recno = -999;
		}

		Z._silence++;
		return context;
	},

	/**
	 * @private
	 */
	endSilenceMove: function (context) {
		var Z = this;
		if (context.recno != -999 && context.recno != Z._recno) {
			Z._gotoRecno(context.recno);
		}
		Z._silence--;
	},

	/**
	 * Check dataset cursor at the last record
	 * 
	 * @return {Boolean}
	 */
	isBof: function () {
		return this._bof;
	},

	/**
	 * Check dataset cursor at the first record
	 * 
	 * @return {Boolean}
	 */
	isEof: function () {
		return this._eof;
	},

	/**
	 * Move cursor to first record
	 */
	first: function () {
		var Z = this;
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return;
		}
		Z._moveCursor(0);
		Z._bof = Z._eof = false;
	},

	/**
	 * Move cursor to last record
	 */
	next: function () {
		var Z = this;
		var recCnt = Z.recordCount();
		if(recCnt === 0) {
			Z._bof = Z._eof = true;
			return;
		}
		if(Z._recno == recCnt - 1) {
			Z._bof = false;
			Z._eof = true;
			return;
		}
		Z._bof = Z._eof = false;
		Z._moveCursor(Z._recno + 1);
	},

	/**
	 * Move cursor to prior record
	 */
	prior: function () {
		var Z = this;
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return;
		}
		if(Z._recno === 0) {
			Z._bof = true;
			Z._eof = false;
			return;
		}
		Z._bof = Z._eof = false;
		Z._moveCursor(Z._recno - 1);
	},

	/**
	 * Move cursor to next record
	 */
	last: function () {
		var Z = this;
		if(!Z.hasRecord()) {
			Z._bof = Z._eof = true;
			return;
		}
		Z._bof = Z._eof = false;
		Z._moveCursor(Z.recordCount() - 1);
		Z._bof = Z._eof = false;
	},

	/**
	 * @private
	 * Check dataset status and cancel dataset 
	 */
	checkStatusByCancel: function () {
		if (this._status != jslet.data.DataSetStatus.BROWSE) {
			this.cancel();
		}
	},

	/**
	 * Insert child record by parentId, and move cursor to the newly record.
	 * 
	 * @param {Object} parentId - key value of parent record
	 */
	insertChild: function (parentId) {
		var Z = this;
		if (!Z._parentField || !Z.keyField()) {
			throw new Error('parentField and keyField not set,use insertRecord() instead!');
		}

		if (!Z.hasRecord()) {
			Z.innerInsert();
			return;
		}

		var context = Z.startSilenceMove(true);
		try {
			Z.expanded(true);
			if (parentId) {
				if (!Z.findByKey(parentId)) {
					return;
				}
			} else {
				parentId = Z.keyValue();
			}

			var pfldname = Z.parentField(), 
				parentParentId = Z.getFieldValue(pfldname);
			while (true) {
				Z.next();
				if (Z.isEof()) {
					break;
				}
				if (parentParentId == Z.getFieldValue(pfldname)) {
					Z.prior();
					break;
				}
			}
		} finally {
			Z.endSilenceMove(context);
		}

		Z.innerInsert(function (newRec) {
			newRec[Z._parentField] = parentId;
		});
	},

	/**
	 * Insert sibling record of current record, and move cursor to the newly record.
	 */
	insertSibling: function () {
		var Z = this;
		if (!Z._parentField || !Z._keyField) {
			throw new Error('parentField and keyField not set,use insertRecord() instead!');
		}

		if (!Z.hasRecord()) {
			Z.innerInsert();
			return;
		}

		var parentId = Z.getFieldValue(Z.parentField()),
			context = Z.startSilenceMove(true),
			found = false,
			parentKeys = [],
			currPKey, lastPKey = prePKey = Z.keyValue();
		try {
			Z.next();
			while (!Z.isEof()) {
				currPKey = Z.parentValue();
				if(currPKey == prePKey) {
					parentKeys.push(prePKey);
					lastPKey = prePKey;
				} else {
					if(lastPKey != currPKey) {
						if(parentKeys.indexOf(currPKey) < 0) {
							Z.prior();
							found = true;
							break;
						}
					}
				}
				prePKey = currPKey;
				Z.next();
			}
			if (!found) {
				Z.last();
			}
		} finally {
			Z.endSilenceMove(context);
		}

		Z.innerInsert(function (newRec) {
			newRec[Z._parentField] = parentId;
		});
	},

	/**
	 * Insert record after current record, and move cursor to the newly record.
	 */
	insertRecord: function () {
		var Z = this;
		Z.confirm();

		Z.innerInsert();
	},

	/**
	 * Add record after last record, and move cursor to the newly record.
	 */
	appendRecord: function () {
		var Z = this;
		Z.confirm();

		Z._silence++;
		try {
			Z.last();
		} finally {
			Z._silence--;
		}
		Z.insertRecord();
	},

	/**
	 * @private
	 */
	status: function(status) {
		if(status === undefined) {
			return this._status;
		}
		this._status = status;
		return this;
	},
	
	expanded: function(expanded) {
		this.expandedByRecno(this.recno(), expanded);
	},
	
	expandedByRecno: function(recno, expanded) {
		jslet.Checker.test('dataset.expandedByRecno', recno).required().isNumber();
		var record = this.getRecord(recno);
		var recInfo = jslet.data.getRecInfo(record);
		if(expanded === undefined) {
			var result = recInfo && recInfo.expanded;
			return result? true: false;
		}
		if(recInfo == null) {
			return this;
		}
		recInfo.expanded = expanded;
		return this;
	},
	
	/**
	 * @private
	 */
	changedStatus: function(status) {
		var record = this.getRecord();
		if(!record) {
			return null;
		}
		var recInfo = jslet.data.getRecInfo(record);		
		if(status === undefined) {
			if(!recInfo) {
				return jslet.data.DataSetStatus.BROWSE;
			}
			return recInfo.status;
		}
		var	oldStatus = recInfo.status;
		if(status === jslet.data.DataSetStatus.DELETE) {
			recInfo.status = status;
			return;
		}
		if(oldStatus === jslet.data.DataSetStatus.INSERT) {
			return;
		}
		if(oldStatus != status) {
			if(this._contextRuleEngine) {
				this._contextRuleEngine.evalStatus();
			}
			recInfo.status = status;
		}
	},
	
	/**
	 * @Private
	 */
	innerInsert: function (beforeInsertFn) {
		var Z = this;
		Z.confirm();

		Z.selection.removeAll();
		var mfld = Z._datasetField, mds = null;
		if (mfld) {
			mds = mfld.dataset();
			if (!mds.hasRecord()) {
				throw new Error(jslet.locale.Dataset.insertMasterFirst);
			}
			mds.editRecord();
		}

		Z._aborted = false;
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREINSERT);
			if (Z._aborted) {
				return;
			}
		} finally {
			Z._aborted = false;
		}

		var records = Z.dataList();
		if (records === null) {
			records = [];
			Z.dataList(records);
		}
		var preRecno = Z.recno(), k;
		if (Z.hasRecord()) {
			k = records.indexOf(this.getRecord()) + 1;
		} else {
			k = 0;
		}

		var newRecord = {};
		records.splice(k, 0, newRecord);

		if (Z._filteredRecnoArray && Z._filteredRecnoArray.length > 0) {
			for (var i = Z._filteredRecnoArray.length - 1; i >= 0; i--) {
				if (Z._filteredRecnoArray[i] < k) {
					Z._filteredRecnoArray.splice(i + 1, 0, k);
					Z._recno = k;
					break;
				}
				Z._filteredRecnoArray[i] += 1;
			}
		} else {
			Z._recno = k;
		}
		
		Z.status(jslet.data.DataSetStatus.INSERT);
		Z.changedStatus(jslet.data.DataSetStatus.INSERT);
		Z._calcDefaultValue();
		if (beforeInsertFn) {
			beforeInsertFn(newRecord);
		}

		//calc other fields' range to use context rule
		if (Z._contextRuleEnabled) {
			Z.calcContextRule();
		}

		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERINSERT);
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
		var evt = jslet.data.RefreshEvent.insertEvent(preRecno, Z.recno(), Z._recno < Z.recordCount() - 1);
		Z.refreshControl(evt);
	},

	/**
	 * Insert all records of source dataset into current dataset;
	 * Source dataset's structure must be same as current dataset 
	 * 
	 * @param {Integer}srcDataset - source dataset
	 */
	insertDataset: function (srcDataset) {
		var Z = this;
		var oldFiltered = Z.filtered();
		var thisContext = Z.startSilenceMove(true);
		var srcContext = srcDataset.startSilenceMove(true), rec;
		try {
			Z.filtered(false);
			srcDataset.first();
			while (!srcDataset.isEof()) {
				Z.insertRecord();
				Z.cloneRecord(srcDataset.getRecord(), Z.getRecord());
				Z.confirm();
				srcDataset.next();
			}
		} finally {
			srcDataset.endSilenceMove(srcContext);
			Z.filtered(oldFiltered);
			Z.endSilenceMove(thisContext);
		}
	},

	/**
	 * Append all records of source dataset into current dataset;
	 * Source dataset's structure must be same as current dataset 
	 * 
	 * @param {Integer}srcDataset - source dataset
	 */
	appendDataset: function (srcDataset) {
		var Z = this;
		Z._silence++;
		try {
			Z.last();
		} finally {
			Z._silence--;
		}
		Z.insertDataset(srcDataset);
	},

	/**
	 * Append records into dataset.
	 * 
	 * @param {Array} records An array of object which need to append to dataset
	 * @param {Boolean} replaceExists true - replace the record if it exists, false - skip to append if it exists. 
	 */
	batchAppendRecords: function(records, replaceExists) {
		jslet.Checker.test('dataset.records', records).required().isArray();
		var Z = this;
		Z.confirm();
		
		Z.selection.removeAll();
		Z.disableControls();
		try{
			var keyField = Z.keyField(), rec, found,
				keyValue;
			for(var i = 0, len = records.length; i < len; i++) {
				rec = records[i];
				found = false;
				if(keyField) {
					keyValue = rec[keyField];
					if(keyValue && Z.findByKey(keyValue)) {
						found = true;
					}
				}
				if(found) {
					if(replaceExists) {
						Z.editRecord();
						Z.cloneRecord(rec, Z.getRecord());
						Z.confirm();
					} else {
						continue;
					}
				} else {
					Z.appendRecord();
					Z.cloneRecord(rec, Z.getRecord());
					Z.confirm();
				}
			}
		} finally {
			Z.enableControls();
			Z.refreshControl(jslet.data.RefreshEvent._updateAllEvent);
			Z.refreshLookupHostDataset();
		}
	},
	
	/**
	 * @rivate
	 * Calculate default value.
	 */
	_calcDefaultValue: function () {
		var Z = this, fldObj, expr, value, fldName;
		for (var i = 0, fldcnt = Z._normalFields.length; i < fldcnt; i++) {
			fldObj = Z._normalFields[i];
			fldName = fldObj.name();
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				continue;
			}
			
			if(fldObj.valueFollow() && Z._followedValue) {
				var fValue = Z._followedValue[fldName];
				if(fValue !== undefined) {
					fldObj.setValue(fValue);
					continue;
				}
			}
			value = fldObj.defaultValue();
			if (value === undefined || value === null || value === '') {
				expr = fldObj.defaultExpr();
				if (!expr) {
					continue;
				}
				value = window.eval(expr);
			} else {
				if(fldObj.getType() === jslet.data.DataType.NUMBER) {
					value = fldObj.scale() > 0 ? parseFloat(value): parseInt(value);
				}
			}
			var valueStyle = fldObj.valueStyle();
			if(value && jslet.isDate(value)) {
				value = new Date(value.getTime());
			}
			if(valueStyle == jslet.data.FieldValueStyle.BETWEEN) {
				if(value) {
					value = [value, value];
				} else {
					value = [null, null];
				}
			} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE) {
				value = [value];
			}
			Z.setFieldValue(fldName, value);		
		}
	},

	/**
	 * @rivate
	 * Calculate default value.
	 */
	checkAggraded: function(fldName) {
		var Z = this,
			fldObj;
		if(fldName) {
			fldObj = Z.getField(fldName);
			return fldObj.aggraded();
		}
		var fields = Z.getNormalFields();
		for(var i = 0, len = fields.length; i< len; i++) {
			fldObj = fields[i];
			if(fldObj.aggraded()) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * 
	 * Calculate aggraded value.
	 */
	calcAggradedValue: function(fldName) {
		var Z = this;
		if(!Z.checkAggraded(fldName)) {
			return;
		}
		var fields = Z.getNormalFields(), 
			fldObj, aggradedBy,
			aggradedFields = [],
			arrAggradeBy = [],
			aggradedValues = null;
		for(var i = 0, len = fields.length; i< len; i++) {
			fldObj = fields[i];
			if(fldObj.aggraded()) {
				aggradedBy = fldObj.aggradedBy();
				if(fldObj.getType() !== jslet.data.DataType.NUMBER && !aggradedBy) {
					if(!aggradedValues) {
						aggradedValues = {};
					}
					aggradedValues[fldObj.name()] = {count: Z.recordCount(), sum: 0};
				} else {
					aggradedFields.push(fldObj);
				}
				if(aggradedBy && arrAggradeBy.indexOf(aggradedBy) === -1) {
					arrAggradeBy.push({aggradedBy: aggradedBy, values: [], exists: false});
				}
			}
		}
		if(aggradedFields.length === 0) {
			Z.aggradedValues(aggradedValues);			
			return;
		}
		if(!aggradedValues) {
			aggradedValues = {};
		}
		
		function getAggradeByValue(aggradedBy) {
			if(aggradedBy.indexOf(',') < 0) {
				return Z.getFieldValue(aggradedBy);
			}
			var fieldNames = aggradedBy.split(',');
			var values = [];
			for(var i = 0, len = fieldNames.length; i < len; i++) {
				values.push(Z.getFieldValue(fieldNames[i]));
			}
			return values.join(',')
		}
		
		function updateAggrByValues(arrAggradeBy) {
			var aggrByObj, 
				aggrByValue,
				arrAggrByValues;			
			for(var i = 0, len = arrAggradeBy.length; i < len; i++) {
				aggrByObj = arrAggradeBy[i];
				arrAggrByValues = aggrByObj.values;
				aggrByValue = getAggradeByValue(aggrByObj.aggradedBy);
				if(arrAggrByValues.indexOf(aggrByValue) < 0) {
					arrAggrByValues.push(aggrByValue);
					aggrByObj.exists = false;
				} else {
					aggrByObj.exists = true;
				}
			}
		}
		
		function existAggrBy(arrAggradeBy, aggradedBy) {
			var aggrByObj;			
			for(var i = 0, len = arrAggradeBy.length; i < len; i++) {
				aggrByObj = arrAggradeBy[i];
				if(aggrByObj.aggradedBy == aggradedBy) {
					return aggrByObj.exists;
				}
			}
			console.warn('Not found aggradedBy value!');
			return false;
		}
		
		var oldRecno = Z.recnoSilence(),
			fldCnt = aggradedFields.length, 
			fldName, value, totalValue,
			aggradedValueObj;
		try{
			for(var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
				Z.recnoSilence(k);
				updateAggrByValues(arrAggradeBy);
				
				for(var i = 0; i < fldCnt; i++) {
					fldObj = aggradedFields[i];
					fldName = fldObj.name();
					aggradedBy = fldObj.aggradedBy();
					if(aggradedBy && existAggrBy(arrAggradeBy, aggradedBy)) {
						continue;
					}
					aggradedValueObj = aggradedValues[fldName];
					if(!aggradedValueObj) {
						aggradedValueObj = {count: 0, sum: 0};
						aggradedValues[fldName] = aggradedValueObj; 
					}
					aggradedValueObj.count = aggradedValueObj.count + 1;
					if(fldObj.getType() === jslet.data.DataType.NUMBER) {
						value = Z.getFieldValue(fldName) || 0;
						if(jslet.isString(value)) {
							throw new Error('Field: ' + fldName + ' requires Number value!');
						}
						aggradedValueObj.sum = aggradedValueObj.sum + value;
					}
				} //end for i
			} //end for k
		}finally{
			Z.recnoSilence(oldRecno);
		}
		var scale;
		for(var i = 0; i < fldCnt; i++) {
			fldObj = aggradedFields[i];
			fldName = fldObj.name();
			scale = fldObj.scale() || 0;
			aggradedValueObj = aggradedValues[fldName];
			if(!aggradedValueObj ) {
				aggradedValueObj = {count: 0, sum: 0};
				aggradedValues[fldName] = aggradedValueObj;
			}
			var sumValue = aggradedValueObj.sum;
			if(sumValue) {
				var pow = Math.pow(10, scale);
				sumValue = Math.round(sumValue * pow) / pow;
				aggradedValueObj.sum = sumValue;
			}
		} //end for i
		Z.aggradedValues(aggradedValues);			
	},
	
	aggradedValues: function(aggradedValues) {
		var Z = this;
		if(aggradedValues === undefined) {
			return Z._aggradedValues;
		}
		var Z = this;
		Z._aggradedValues = aggradedValues;
		if(!Z._aggradedValues && !aggradedValues) {
			return;
		}

		evt = jslet.data.RefreshEvent.aggradedEvent();
		Z.refreshControl(evt);
	},
	
	/**
	 * Get record object by record number.
	 * 
	 * @param {Integer} recno Record Number.
	 * @return {Object} Dataset record.
	 */
	getRecord: function (recno) {
		var Z = this, k;
		if(!Z.hasData()) {
			return null;
		}
		var records = Z.dataList();
		//Used to convert field value for performance purpose. 
		if(Z._ignoreFilter) {
			return records[Z._ignoreFilterRecno || 0];
		}
		
		if (Z.recordCount() === 0) {
			return null;
		}
		if (recno === undefined || recno === null) {
			recno = Z._recno >= 0 ? Z._recno : 0;
		} else {
			if (recno < 0 || recno >= Z.recordCount()) {
				return null;
			}
		}
		
		if (Z._filteredRecnoArray) {
			k = Z._filteredRecnoArray[recno];
		} else {
			k = recno;
		}

		return records[k];
	},

	/**
	 * @private
	 */
	getRelativeRecord: function (delta) {
		return this.getRecord(this._recno + delta);
	},

	/**
	 * @private
	 */
	isSameAsPrevious: function (fldName) {
		var Z = this,
			preRec = Z.getRelativeRecord(-1);
		if (!preRec) {
			return false;
		}
		var currRec = Z.getRecord(),
			preValue = preRec[fldName],
			currValue = currRec[fldName],
			isSame = false;
		if(!preValue && preValue !== 0 && !currValue && currValue !== 0) {
			isSame = true;
		} else if(preValue && currValue) {
			if(jslet.isDate(preValue)) { //Date time comparing
				isSame = (preValue.getTime() == currValue.getTime());
			} else {
				isSame = (preValue == currValue);
			}
		}
		if(!isSame) {
			return isSame;
		}
		var	fldObj = Z.getField(fldName),
			mergeSameBy = fldObj.mergeSameBy();
		if(mergeSameBy) {
			var arrFlds = mergeSameBy.split(','), groupFldName;
			for(var i = 0, len = arrFlds.length; i < len; i++) {
				groupFldName = jQuery.trim(arrFlds[i]);
				if(preRec[groupFldName] != currRec[groupFldName]) {
					return false;
				}
			}
		}
		return isSame;
	},

	/**
	 * Check the current record has child records or not
	 * 
	 * @return {Boolean}
	 */
	hasChildren: function () {
		var Z = this;
		if (!Z._parentField) {
			return false;
		}
		var context = Z.startSilenceMove();
		var keyValue = Z.keyValue();
		try {
			Z.next();
			if (!Z.isEof()) {
				var pValue = Z.parentValue();
				if (pValue == keyValue) {
					return true;
				}
			}
			return false;
		} finally {
			Z.endSilenceMove(context);
		}
	},
	
	/** 
	* Iterate the child records of current record, and run the specified callback function. 
	* Example: 
	* 
	* dataset.iterateChildren(function(){
	* 	var fldValue = this.getFieldValue('xxx');
	* 	this.setFieldValue('xxx', fldValue);
	* }); 
	* 
	*/ 
	iterateChildren: function() {
		
	},
	
	/**
	 * Update record and send dataset to update status.
	 * You can use cancel() or confirm() method to return browse status.
	 */
	editRecord: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.UPDATE ||
			Z._status == jslet.data.DataSetStatus.INSERT) {
			return;
		}

		Z.selection.removeAll();
		if (!Z.hasRecord()) {
			Z.insertRecord();
		} else {
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREUPDATE);
				if (Z._aborted) {
					return;
				}
			} finally {
				Z._aborted = false;
			}

			Z._modiObject = {};
			jQuery.extend(Z._modiObject, Z.getRecord());
			var mfld = Z._datasetField;
			if (mfld && mfld.dataset()) {
				mfld.dataset().editRecord();
			}

			Z.status(jslet.data.DataSetStatus.UPDATE);
//			Z.changedStatus(jslet.data.DataSetStatus.UPDATE);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERUPDATE);
		}
	},

	/**
	 * Delete record
	 */
	deleteRecord: function () {
		var Z = this;
		var recCnt = Z.recordCount();
		if (recCnt === 0 || Z.changedStatus() === jslet.data.DataSetStatus.DELETE) {
			return;
		}
		Z.selection.removeAll();
		if (Z._status == jslet.data.DataSetStatus.INSERT) {
			Z.cancel();
			return;
		}

		Z._silence++;
		try {
			Z.checkStatusByCancel();
		} finally {
			Z._silence--;
		}

		if (Z.hasChildren()) {
			jslet.showInfo(jslet.locale.Dataset.cannotDelParent);
			return;
		}

		Z._aborted = false;
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREDELETE);
			if (Z._aborted) {
				return;
			}
		} finally {
			Z._aborted = false;
		}
		var preRecno = Z.recno(), 
			isLast = preRecno == (recCnt - 1), 
			k = Z._recno;
		if(Z.changedStatus() === jslet.data.DataSetStatus.INSERT) {
			Z._changeLog.unlog();
		} else {
			Z.changedStatus(jslet.data.DataSetStatus.DELETE);
			Z._changeLog.log();
		}
		Z.dataList().splice(k, 1);
		Z._refreshInnerRecno();
		
		var mfld = Z._datasetField;
		if (mfld && mfld.dataset()) {
			mfld.dataset().editRecord();
		}

		Z.status(jslet.data.DataSetStatus.BROWSE);
		
		if (isLast) {
			Z._silence++;
			try {
				Z.prior();
			} finally {
				Z._silence--;
			}
		}
		Z.calcAggradedValue();
		var evt = jslet.data.RefreshEvent.deleteEvent(preRecno);
		Z.refreshControl(evt);
		
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);	
		Z.refreshLookupHostDataset();
		var detailFields = Z._subDatasetFields;
		if(detailFields) {
			var subFldObj, subDs;
			for(var i = 0, len = detailFields.length; i < len; i++) {
				subFldObj = detailFields[i];
				subDs = subFldObj.subDataset();
				if(subDs) {
					subDs.refreshControl();
				}
			}
		}
		if (Z.isBof() && Z.isEof()) {
			return;
		}
		evt = jslet.data.RefreshEvent.scrollEvent(Z._recno);
		Z.refreshControl(evt);
		
	},

	/**
	 * Delete all selected records;
	 */
	deleteSelected: function() {
		var Z = this, 
			records = Z.selectedRecords(),
			recObj;
		Z.disableControls();
		try {
			for(var i = records.length - 1; i >= 0; i--) {
				recObj = records[i];
				Z.moveToRecord(recObj);
				Z.deleteRecord();
			}
		} finally {
			Z.enableControls();
		}
	},
	
	/**
	 * @private
	 */
	_innerValidateData: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE || Z.recordCount() === 0) {
			return;
		}
		var fldObj, fldName, fldValue, invalidMsg, firstInvalidField = null;

		for (var i = 0, cnt = Z._normalFields.length; i < cnt; i++) {
			fldObj = Z._normalFields[i];
			if (fldObj.disabled() || fldObj.readOnly() || !fldObj.visible()) {
				continue;
			}
			fldName = fldObj.name();
			fldValue = Z.getFieldValue(fldName);
			if(fldObj.valueStyle() == jslet.data.FieldValueStyle.NORMAL && Z.existFieldError(fldName)) {
				invalidMsg = Z._fieldValidator.checkRequired(fldObj, fldValue);
				invalidMsg = invalidMsg || Z._fieldValidator.checkValue(fldObj, fldValue);
				if (invalidMsg) {
					Z.setFieldError(fldName, invalidMsg);
					if(!firstInvalidField) {
						firstInvalidField = fldName;
					}
				}
			} else {
				invalidMsg = Z._fieldValidator.checkRequired(fldObj, fldValue);
				if (invalidMsg) {
					Z.setFieldError(fldName, invalidMsg)
					if(!firstInvalidField) {
						firstInvalidField = fldName;
					}
				}
				if(fldObj.valueStyle() == jslet.data.FieldValueStyle.BETWEEN) {
					var v1 = null, v2 = null;
					if(fldValue && fldValue.length === 2) {
						v1 = fldValue[0];
						v2 = fldValue[1];
					}
					if(v1 && v2) {
						invalidMsg = null;
						if(jslet.isDate(v1) && v1.getTime() > v2.getTime() || v1 > v2) {
							invalidMsg = jslet.locale.Dataset.betwwenInvalid;
						}
						if (invalidMsg) {
							Z.setFieldError(fldName, invalidMsg, 0);
							if(!firstInvalidField) {
								firstInvalidField = fldName;
							}
						}
					}
				}
				if(fldValue) {
					var recObj = Z.getRecord();
					for(var k = 0, len = fldValue.length; k < len; k++) {
						if(Z.existFieldError(fldName, k)) {
							invalidMsg = invalidMsg || Z._fieldValidator.checkValue(fldObj, fldValue);
							if (invalidMsg) {
								Z.setFieldError(fldName, invalidMsg, k)
								if(!firstInvalidField) {
									firstInvalidField = fldName;
								}
							}
						}
					} //end for k
				}
			}
			
		} //end for i
		if(firstInvalidField) {
			Z.focusEditControl(firstInvalidField);
		}
	},

	/**
	 * @private
	 */
	errorMessage: function(errMessage) {
		var evt = jslet.data.RefreshEvent.errorEvent(errMessage || '');
		this.refreshControl(evt);
	},
	
	addFieldError: function(fldName, errorMsg, valueIndex, inputText) {
		jslet.data.FieldError.put(this.getRecord(), fldName, errorMsg, valueIndex, inputText);
	},
	
	addDetailFieldError: function(fldName, errorCount) {
		jslet.data.putDetailError.put(this.getRecord(), fldName, errorCount);
	},
	
	existRecordError: function(recno) {
		return jslet.data.FieldError.existRecordError(this.getRecord(recno));
	},
	
	checkAndShowError: function() {
		var Z = this;
		if(Z.existDatasetError()) {
			if (Z._autoShowError) {
				jslet.showError(jslet.locale.Dataset.cannotConfirm, null, 2000);
			} else {
				console.warn(jslet.locale.Dataset.cannotConfirm);
			}
			return true;
		}
		return false;
	},
	
	existDatasetError: function() {
		var Z = this, isError = false,
			dataList = Z.dataList();
		if(!dataList) {
			return false;
		}
		for(var i = 0, len = dataList.length; i < len; i++) {
			isError = jslet.data.FieldError.existRecordError(dataList[i]);
			if(isError) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Confirm insert or update
	 */
	confirm: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE) {
			return true;
		}
		Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECONFIRM);
		Z._innerValidateData();
		Z._confirmSubDataset();

		if(Z.status() == jslet.data.DataSetStatus.UPDATE) {
			Z.changedStatus(jslet.data.DataSetStatus.UPDATE);
		}
		
		var evt, hasError = Z.existRecordError();
		var rec = Z.getRecord();
		Z._modiObject = null;
		Z.status(jslet.data.DataSetStatus.BROWSE);
		if(!hasError) {
			Z._changeLog.log();
		}
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCONFIRM);
		Z.calcAggradedValue();
		evt = jslet.data.RefreshEvent.updateRecordEvent();
		Z.refreshControl(evt);
		if(hasError) {
			Z.errorMessage(jslet.locale.Dataset.cannotConfirm);			
		} else {
			jslet.data.FieldError.clearRecordError(Z.getRecord());
			Z.errorMessage();
		}
		var masterFld = Z._datasetField;
		if (masterFld) {
			var masterDs = masterFld.dataset();
			var masterFldName = masterFld.name();
			if(hasError) {
				masterDs.addFieldError(masterFldName, 'Detail Dataset Error');
			} else {
				masterDs.addFieldError(masterFldName, null);
			}
			masterDs.refreshControl(evt);
		}

		return !hasError;
	},

	/*
	 * @private
	 */
	_confirmSubDataset: function() {
		var Z = this,
			fldObj, 
			subDatasets = [],
			subFields = [];
		for (var i = 0, len = Z._normalFields.length; i < len; i++) {
			fldObj = Z._normalFields[i];
			if(fldObj.getType() === jslet.data.DataType.DATASET) {
				subDatasets.push(fldObj.subDataset());
				subFields.push(fldObj.name());
			}
		}
		var subDs, oldShowError;
		for(var i = 0, len = subDatasets.length; i < len; i++) {
			subDs = subDatasets[i];
			subDs.confirm();
			if(subDs.existDatasetError()) {
				Z.addFieldError(subFields[i], 'Detail Dataset Error');
			} else {
				Z.addFieldError(subFields[i], null);
			}
		}
	},
	
	/**
	 * Cancel insert or update
	 */
	cancel: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE) {
			return;
		}
		if (Z.recordCount() === 0) {
			return;
		}
		Z._aborted = false;
		try {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECANCEL);
			if (Z._aborted) {
				return;
			}
		} finally {
			Z._aborted = false;
		}
//		var rec = Z.getRecord();
//		jslet.data.FieldError.clearRecordError(rec);
		 Z._cancelSubDataset();
		 var evt, 
			k = Z._recno,
			records = Z.dataList();
		if (Z._status == jslet.data.DataSetStatus.INSERT) {
			Z.selection.removeAll();
			var no = Z.recno();
			records.splice(k, 1);
			Z._refreshInnerRecno();
			if(no >= Z.recordCount()) {
				Z._recno = Z.recordCount() - 1;
			}
			Z.calcAggradedValue();		
			evt = jslet.data.RefreshEvent.deleteEvent(no);
			Z.refreshControl(evt);
			Z.status(jslet.data.DataSetStatus.BROWSE);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			evt = jslet.data.RefreshEvent.scrollEvent(Z._recno); 
			Z.refreshControl(evt); 
			return;
		} else {
			if (Z._filteredRecnoArray) {
				k = Z._filteredRecnoArray[Z._recno];
			}
//			jslet.data.FieldValueCache.removeCache(Z._modiObject);
			records[k] = Z._modiObject;
			Z._modiObject = null;	
		}

		Z.calcAggradedValue();		
		Z.status(jslet.data.DataSetStatus.BROWSE);
//		Z.changedStatus(jslet.data.DataSetStatus.BROWSE);
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCANCEL);
//		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);

		evt = jslet.data.RefreshEvent.updateRecordEvent();
		Z.refreshControl(evt);
	},

	restore: function() {
		
	},
	
    /*
     * @private
     */
    _cancelSubDataset: function() {
        var Z = this,
            fldObj, 
            subDatasets = [];
        for (var i = 0, len = Z._normalFields.length; i < len; i++) {
            fldObj = Z._normalFields[i];
            if(fldObj.getType() === jslet.data.DataType.DATASET) {
                subDatasets.push(fldObj.subDataset());
            }
        }
        var subDs;
        for(var i = 0, len = subDatasets.length; i < len; i++) {
            subDs = subDatasets[i];
            subDs.cancel();
        }
    },
     
	/**
	 * Set or get logChanges
	 * if NOT need send changes to Server, can set logChanges to false  
	 * 
	 * @param {Boolean} logChanges
	 */
	logChanges: function (logChanges) {
		if (logChanges === undefined) {
			return this._logChanges;
		}

		this._logChanges = logChanges;
	},

	/**
	 * Disable refreshing controls, you often use it in a batch operation;
	 * After batch operating, use enableControls()
	 */
	disableControls: function () {
		this._lockCount++;
		var fldObj, subDs;
		for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
			fldObj = this._normalFields[i];
			subDs = fldObj.subDataset();
			if (subDs !== null) {				
				subDs.disableControls();
			}
		}
	},

	/**
	 * Enable refreshing controls.
	 * 
	 * @param {Boolean} refreshCtrl true - Refresh control immediately, false - Otherwise.
	 */
	enableControls: function (needRefreshCtrl) {
		if (this._lockCount > 0) {
			this._lockCount--;
		}
		if (!needRefreshCtrl) {
			this.refreshControl();
		}

		var fldObj, subDs;
		for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
			fldObj = this._normalFields[i];
			subDs = fldObj.subDataset();
			if (subDs !== null) {				
				subDs.enableControls();
			}
		}
	},

	/**
	 * Check the specified field which value is valid.
	 * 
	 * @param fldName {String} - field name;
	 * @param valueIndex {Integer} - value index.
	 * @return {Boolean} true - exists invalid data.
	 */
	existFieldError: function(fldName, valueIndex) {
		if (this.recordCount() === 0) {
			return false;
		}

		var currRec = this.getRecord();
		if (!currRec) {
			return false;
		}
		return jslet.data.FieldError.existFieldError(currRec, fldName, valueIndex);
	},
	
	getFieldError: function(fldName, valueIndex) {
		return this.getFieldErrorByRecno(null, fldName, valueIndex);
	},
	
	getFieldErrorByRecno: function(recno, fldName, valueIndex) {
		if (this.recordCount() === 0) {
			return null;
		}

		var currRec = this.getRecord(recno);
		if (!currRec) {
			return null;
		}
		return jslet.data.FieldError.get(currRec, fldName, valueIndex);
	},
	
	setFieldError: function(fldName, errorMsg, valueIndex, inputText) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return Z;
		}

		var currRec = Z.getRecord();
		if (!currRec) {
			return Z;
		}
		jslet.data.FieldError.put(currRec, fldName, errorMsg, valueIndex, inputText);
		return this;
	},
		
	/**
	 * Get field value of specified record number
	 * 
	 * @param {Object} recno - specified record number
	 * @param {String} fldName - field name
	 * @return {Object} field value
	 */
	getFieldValueByRecno: function(recno, fldName, valueIndex) {
		var dataRec = this.getRecord(recno);
		if(!dataRec) {
			return null;
		}
		return this.getFieldValueByRecord(dataRec, fldName, valueIndex);
	},
	
	/**
	 * Get field value of specified record
	 * 
	 * @param {Object} dataRec - specified record
	 * @param {String} fldName - field name
	 * @return {Object} field value
	 */
	getFieldValueByRecord: function (dataRec, fldName, valueIndex) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return null;
		}

		if (!dataRec) {
			dataRec = Z.getRecord();
		}

		var k = fldName.indexOf('.'), 
			subfldName, fldValue = null,
			fldObj = Z.getField(fldName),
			value, lkds;
		if (k > 0) { //field chain
			subfldName = fldName.substr(0, k);
			fldObj = Z.getField(subfldName);
			var lkf = fldObj.lookup(),
				subDs = fldObj.subDataset();
			
			if (!lkf && !subDs) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [subfldName]));
			}
			if(lkf) {
				value = dataRec[subfldName];
				lkds = lkf.dataset();
				if(value === undefined || value === null || value === '') {
					fldValue = null;
				} else {
					if (lkds.findByField(lkds.keyField(), value)) {
						fldValue = lkds.getFieldValue(fldName.substr(k + 1));
					} else {
						throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,
									[lkds.name(),lkds.keyField(), value]));
					}
				}
			} else {
				fldValue = subDs.getFieldValue(fldName.substr(k + 1));
			}
			
		} else { //single field
			if (!fldObj) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			var formula = fldObj.formula();
			if (!formula) {
				value = dataRec[fldName];
				fldValue = value !== undefined ? value :null;
			} else {
				if(dataRec[fldName] === undefined) {
					fldValue = Z._calcFormula(dataRec, fldName);
					dataRec[fldName] = fldValue;
				} else {
					value = dataRec[fldName];
					fldValue = value !== undefined ? value :null;
				}
			}
		}

		if(!fldObj.valueStyle() || valueIndex === undefined) { //jslet.data.FieldValueStyle.NORMAL
			if(fldObj.getType() === jslet.data.DataType.BOOLEAN) {
				return fldValue === fldObj.trueValue();
			}
			return fldValue;
		}
		return jslet.getArrayValue(fldValue, valueIndex);
	},

	/**
	 * Get field value of current record
	 * 
	 * @param {String} fldName - field name
	 * @param {Integer or undefined} valueIndex get the specified value if a field has multiple values.
	 *		if valueIndex is not specified, all values(Array of value) will return.
	 * @return {Object}
	 */
	getFieldValue: function (fldName, valueIndex) {
		if (this.recordCount() === 0) {
			return null;
		}

		var currRec = this.getRecord();
		if (!currRec) {
			return null;
		}
		return this.getFieldValueByRecord(currRec, fldName, valueIndex);
	},

	/**
	 * Set field value of current record.
	 * 
	 * @param {String} fldName - field name
	 * @param {Object} value - field value
	 * @param {Integer or undefined} valueIndex set the specified value if a field has multiple values.
	 *		if valueIndex is not specified, Array of value will be set.
	 * @return {this}
	 */
	setFieldValue: function (fldName, value, valueIndex) {
		var Z = this,
			fldObj = Z.getField(fldName);
		if(Z._status == jslet.data.DataSetStatus.BROWSE) {
			Z.editRecord();
		}
		var currRec = Z.getRecord();
		if(!fldObj.valueStyle() || valueIndex === undefined) { //jslet.data.FieldValueStyle.NORMAL
			if(value && fldObj.getType() === jslet.data.DataType.NUMBER && !jslet.isArray(value)) {
				value = fldObj.scale() > 0 ? parseFloat(value): parseInt(value);
			}
			var realValue = value;
			if(fldObj.getType() === jslet.data.DataType.BOOLEAN) {
				if(value) {
					realValue = fldObj.trueValue();
				} else {
					realValue = fldObj.falseValue();
				}
			}

			currRec[fldName] = realValue;
			if (fldObj.getType() == jslet.data.DataType.DATASET) {//dataset field
				return this;
			}
		} else {
			var arrValue = currRec[fldName];
			if(!arrValue || !jslet.isArray(arrValue)) {
				arrValue = [];
				currRec[fldName] = arrValue;
			}
			var len = arrValue.length;
			if(valueIndex < len) {
				arrValue[valueIndex] = value;
			} else {
				for(var i = len; i < valueIndex; i++) {
					arrValue.push(null);
				}
				arrValue.push(value);
			}
		}
		Z.setFieldError(fldName, null, valueIndex);
		if (Z._onFieldChanged) {
			var eventFunc = jslet.getFunction(Z._onFieldChanged);
			if(eventFunc) {
				eventFunc.call(Z, fldName, value, valueIndex);
			}
		}
		var globalHandler = jslet.data.globalDataHandler.fieldValueChanged();
		if(globalHandler) {
			globalHandler.call(Z, Z, fldName, value, valueIndex);
		}

		if(fldObj.valueFollow()) {
			if(!Z._followedValue) {
				Z._followedValue = {};
			}
			Z._followedValue[fldName] = value;
		}
		//calc other fields' range to use context rule
		if (Z._contextRuleEnabled) {
			Z.calcContextRule(fldName);
		}	
		jslet.data.FieldValueCache.clear(Z.getRecord(), fldName);
		var evt = jslet.data.RefreshEvent.updateRecordEvent(fldName);
		Z.refreshControl(evt);
		Z.updateFormula(fldName);
		Z.calcAggradedValue(fldName);
		return this;
	},

	_calcFormulaRelation: function() {
		var Z = this;
		if(!Z._innerFormularFields) {
			return;
		}
		var fields = Z._innerFormularFields.keys(),
			fldName, formulaFields, formulaFldName, fldObj;
		var relation = new jslet.SimpleMap();
		for(var i = 0, len = fields.length; i < len; i++) {
			fldName = fields[i];
			var evaluator = Z._innerFormularFields.get(fldName);
			formulaFields = evaluator.mainFields();
			relation.set(fldName, formulaFields);
		} //end for i
		Z._innerFormulaRelation = relation.count() > 0? relation: null;
	},
	
	/**
	 * @rivate
	 */
	addInnerFormulaField: function(fldName, formula) {
		var Z = this;
		if(!formula) {
			return;
		}
		if (!Z._innerFormularFields) {
			Z._innerFormularFields = new jslet.SimpleMap();
		}
		evaluator = new jslet.Expression(Z, formula);
		Z._innerFormularFields.set(fldName, evaluator);
		Z._calcFormulaRelation();
	},
	
	/**
	 * @rivate
	 */
	removeInnerFormulaField: function (fldName) {
		if (this._innerFormularFields) {
			this._innerFormularFields.unset(fldName);
			this._calcFormulaRelation();
		}
	},

	_calcFormula: function(currRec, fldName) {
		var Z = this,
			evaluator = Z._innerFormularFields.get(fldName),
			result = null;
		if(evaluator) {
			evaluator.context.dataRec = currRec;
			result = evaluator.eval();
		}
		return result;
	},
	
	/**
	 * @private
	 */
	updateFormula: function (changedFldName) {
		var Z = this;
		if(!Z._innerFormulaRelation) {
			return;
		}
		var fmlFields = Z._innerFormulaRelation.keys(),
			fmlFldName, fields, fldObj,
			currRec = this.getRecord();
		for(var i = 0, len = fmlFields.length; i < len; i++) {
			fmlFldName = fmlFields[i];
			fields = Z._innerFormulaRelation.get(fmlFldName);
			fldObj = Z.getField(fmlFldName);
			if(!fields || fields.length === 0) {
				fldObj.setValue(Z._calcFormula(currRec, fmlFldName));
				continue;
			}
			var found = false;
			for(var j = 0, cnt = fields.length; j < cnt; j++) {
				if(fields[j] == changedFldName) {
					found = true;
					break;
				}
			}
			if(found) {
				fldObj.setValue(Z._calcFormula(currRec, fmlFldName));
			}
		}
	},
	
	/**
	 * Get field display text. 
	 * 
	 * @param {String} fldName Field name
	 * @param {Boolean} isEditing In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
	 * @param {Integer} valueIndex identify which item will get if the field has multiple values.
	 * @return {String} 
	 */
	getFieldText: function (fldName, isEditing, valueIndex) {
		if (this.recordCount() === 0) {
			return null;
		}

		var currRec = this.getRecord();
		if (!currRec) {
			return null;
		}
		return this.getFieldTextByRecord(currRec, fldName, isEditing, valueIndex);
	},
	
	/**
	 * Get field display text by record number.
	 * 
	 * @param {Object} recno - record number.
	 * @param {String} fldName - Field name
	 * @param {Boolean} isEditing - In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
	 * @param {Integer} valueIndex - identify which item will get if the field has multiple values.
	 * @return {String} 
	 */
	getFieldTextByRecno: function (recno, fldName, isEditing, valueIndex) {
		var dataRec = this.getRecord(recno);
		if(!dataRec) {
			return null;
		}
		return this.getFieldTextByRecord(dataRec, fldName, isEditing, valueIndex);
	},
	
	/**
	 * Get field display text by data record.
	 * 
	 * @param {Object} dataRec - data record.
	 * @param {String} fldName - Field name
	 * @param {Boolean} isEditing - In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
	 * @param {Integer} valueIndex - identify which item will get if the field has multiple values.
	 * @return {String} 
	 */
	getFieldTextByRecord: function (dataRec, fldName, isEditing, valueIndex) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return '';
		}
		var currRec = dataRec, 
			k = fldName.indexOf('.'), 
			fldObj, value;
		if (k > 0) { //Field chain
			var subFldName = fldName.substr(0, k);
			fldName = fldName.substr(k + 1);
			fldObj = Z.getField(subFldName);
			if (!fldObj) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			var lkf = fldObj.lookup(),
				subDs = fldObj.subDataset();
			if (!lkf && !subDs) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [fldName]));
			}
			if(lkf) {
				value = currRec[subFldName];
				if (value === null || value === undefined) {
					return '';
				}
				var lkds = lkf.dataset();
				if (lkds.findByField(lkds.keyField(), value)) {
					if (fldName.indexOf('.') > 0) {
						return lkds.getFieldValue(fldName);
					} else {
						return lkds.getFieldText(fldName, isEditing, valueIndex);
					}
				} else {
					throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,
							[lkds.name(), lkds.keyField(), value]));
				}
			}
			else {
				//Can't use it in sort function.
				return subDs.getFieldText(fldName, isEditing, valueIndex);
			}
		}
		//Not field chain
		fldObj = Z.getField(fldName);
		if (!fldObj) {
			throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [fldName]));
		}
		if (fldObj.getType() == jslet.data.DataType.DATASET) {
			return '[dataset]';
		}
		var valueStyle = fldObj.valueStyle(),
			result = [];
		if(valueStyle == jslet.data.FieldValueStyle.BETWEEN && valueIndex === undefined)
		{
			var minVal = Z.getFieldTextByRecord(currRec, fldName, isEditing, 0),
				maxVal = Z.getFieldTextByRecord(currRec, fldName, isEditing, 1);
			if(!isEditing && !minVal && !maxVal){
				return '';
			}
			result.push(minVal);
			if(isEditing) {
				result.push(jslet.global.valueSeparator);
			} else {
				result.push(jslet.locale.Dataset.betweenLabel);
			}
			result.push(maxVal);
			return result.join('');
		}
		
		if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && valueIndex === undefined)
		{
			var arrValues = Z.getFieldValue(fldName), 
				len = 0;
			if(arrValues && jslet.isArray(arrValues)) {
				len = arrValues.length - 1;
			}
			
			for(var i = 0; i <= len; i++) {
				result.push(Z.getFieldTextByRecord(currRec, fldName, isEditing, i));
				if(i < len) {
					result.push(jslet.global.valueSeparator);
				}
			}
			return result.join('');
		}
		//Get cached display value if exists.
		if(!isEditing) {
			var cacheValue = jslet.data.FieldValueCache.get(currRec, fldName, valueIndex);
			if(cacheValue !== undefined) {
				return cacheValue;
			}
		}
		value = Z.getFieldValueByRecord(currRec, fldName, valueIndex);
		if (value === null || value === undefined) {
			var fixedValue = fldObj.fixedValue();
			if(fixedValue) {
				return fixedValue;
			}
			return '';
		}

		var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
		if(!convert) {
			throw new Error('Can\'t find any field value converter!');
		}
		var text = convert.valueToText.call(Z, fldObj, value, isEditing);
		//Put display value into cache
		if(!isEditing) {
			jslet.data.FieldValueCache.put(currRec, fldName, text, valueIndex);
		}
		return text;
	},
	
	/**
	 * @private
	 */
	setFieldValueLength: function(fldObj, valueLength) {
		if(!fldObj.valueStyle()) { //jslet.data.FieldValueStyle.NORMAL
			return;
		}
		var value = this.getFieldValue(fldObj.name());
		if(value && jslet.isArray(value)) {
			value.length = valueLength;
		}
	},
	
	/**
	 * Set field value by input value. There are two forms to use:
	 *   1. setFieldText(fldName, inputText, valueIndex)
	 *   2. setFieldText(fldName, inputText, keyValue, displayValue, valueIndex)
	 *   
	 * @param {String} fldName - field name
	 * @param {String} inputText - String value inputed by user
	 * @param {Object} keyValue - key value
	 * @param {String} displayValue - display value
	 * @param {Integer} valueIndex identify which item will set if the field has multiple values.
	 */
	setFieldText: function (fldName, inputText, valueIndex) {
		var Z = this,
		fldObj = Z.getField(fldName);
		if (fldObj === null) {
			throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
		}
		var fType = fldObj.getType();
		if (fType == jslet.data.DataType.DATASET) {
			throw new Error(jslet.formatString(jslet.locale.Dataset.datasetFieldNotBeSetValue, [fldName]));
		}
		var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
		if(!convert) {
			throw new Error('Can\'t find any field value converter!');
		}
		
		var value = Z._textToValue(fldObj, inputText, valueIndex);
		if(value !== undefined) {
			Z.setFieldValue(fldName, value, valueIndex);
		}
	},

	_textToValue: function(fldObj, inputText, valueIndex) {
		var Z = this,
			fType = fldObj.getType();
		
		if((fldObj.valueStyle() === jslet.data.FieldValueStyle.BETWEEN ||
			fldObj.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE)				
				&& valueIndex === undefined) {
			//Set an array value
			if(!jslet.isArray(inputText)) {
				inputText = inputText.split(jslet.global.valueSeparator);
			}
			var len = inputText.length, 
				values = [], value,
				invalid = false;
			for(var k = 0; k < len; k++ ) {
				value = Z._textToValue(fldObj, inputText[k], k);
				if(value === undefined) {
					invalid = true;
				} else {
					if(!invalid) {
						values.push(value);
					}
				}
			}
			if(!invalid) {
				return values;
			}
			return undefined;
		}
		var invalidMsg = Z._fieldValidator.checkInputText(fldObj, inputText);
		if (invalidMsg) {
			Z.setFieldError(fldObj.name(), invalidMsg, valueIndex, inputText);
			return undefined;
		} else {
			Z.setFieldError(fldObj.name(), null, valueIndex);
		}
		
		var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
		var value = convert.textToValue.call(Z, fldObj, inputText, valueIndex);
		return value;
	},
	
	/**
	 * Get key value of current record
	 * 
	 * @return {Object} Key value
	 */
	keyValue: function () {
		if (!this._keyField || this.recordCount() === 0) {
			return null;
		}
		return this.getFieldValue(this._keyField);
	},

	/**
	 * Get parent record key value of current record
	 * 
	 * @return {Object} Parent record key value.
	 */
	parentValue: function () {
		if (!this._parentField || this.recordCount() === 0) {
			return null;
		}
		return this.getFieldValue(this._parentField);
	},

	/**
	 * Find record with specified condition
	 * if found, then move cursor to that record
	 * <pre><code>
	 *   dsFoo.find('[name] like "Bob%"');
	 *   dsFoo.find('[age] > 20');
	 * </code></pre>
	 * @param {String} condition condition expression.
	 * @param {Boolean} fromCurrentPosition Identify whether finding data from current position or not.
	 * @return {Boolean} 
	 */
	find: function (condition, fromCurrentPosition) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return false;
		}
		Z.confirm();
		if (condition === null) {
			Z._findCondition = null;
			Z._innerFindCondition = null;
			return false;
		}

		if (condition != Z._findCondition) {
			Z._innerFindCondition = new jslet.Expression(this, condition);
		}
		if (Z._innerFindCondition.eval()) {
			return true;
		}
		Z._silence++;
		var foundRecno = -1, 
			oldRecno = Z._recno;
		try {
			if(!fromCurrentPosition) {
				Z.first();
			}
			while (!Z.isEof()) {
				if (Z._innerFindCondition.eval()) {
					foundRecno = Z._recno;
					break;
				}
				Z.next();
			}
		} finally {
			Z._silence--;
			Z._recno = oldRecno;
		}
		if (foundRecno >= 0) {// can fire scroll event
			Z._gotoRecno(foundRecno);
			return true;
		}
		return false;
	},

	/**
	 * Find record with specified field name and value
	 * 
	 * @param {String} fldName - field name
	 * @param {Object} findingValue - finding value
	 * @param {Boolean} fromCurrentPosition Identify whether finding data from current position or not.
	 * @param {Boolean} findingByText - Identify whether finding data with field text, default is with field value
	 * @param {String} matchType null or undefined - match whole value, 'first' - match first, 'last' - match last, 'any' - match any
	 * @return {Boolean} 
	 */
	findByField: function (fldName, findingValue, fromCurrentPosition, findingByText, matchType) {
		var Z = this,
			fldObj = Z.getField(fldName);
		if(!fldObj) {
			throw new Error('Field name: ' + fldName + ' NOT Found!');
		}
		Z.confirm();
		
		function matchValue(matchType, value, findingValue) {
			if(!matchType) {
				return value == findingValue;
			}
			if(matchType == 'first') {
				return jslet.like(value, findingValue + '%');
			}
			if(matchType == 'any') {
				return jslet.like(value, '%' + findingValue + '%');
			}
			if(matchType == 'last') {
				return jslet.like(value, '%' + findingValue);
			}
		}
		
		var byText = true;
		if(fldObj.getType() === 'N' && !fldObj.lookup()) {
			byText = false;
		}
		var value, i;
		if(Z._ignoreFilter) {
			if(!Z.hasData()) {
				return false;
			}
			var records = Z.dataList(),
				len = records.length,
				dataRec;
			var start = 0;
			if(fromCurrentPosition) {
				var currRec = Z.getRecord();
				if(Z._lastFindingValue && Z._lastFindingValue === findingValue) {
					start = records.indexOf(currRec) + 1;
				}
				Z._lastFindingValue = findingValue;
			}
			for(i = start; i < len; i++) {
				dataRec = records[i];
				if(findingByText && byText) {
					value = Z.getFieldTextByRecord(dataRec, fldName);
				} else {
					value = Z.getFieldValueByRecord(dataRec, fldName);
				}
				if (matchValue(matchType, value, findingValue)) {
					Z._ignoreFilterRecno = i;
					return true;
				}
			}
			return false;
		}
		if (Z.recordCount() === 0) {
			return false;
		}

		var foundRecno = -1, oldRecno = Z.recno();
		try {
			var cnt = Z.recordCount(),
				start = 0;
			if(fromCurrentPosition) {
				start = Z.recno();
				if(Z._lastFindingValue && Z._lastFindingValue === findingValue) {
					start =  Z.recno() + 1;
				}
				Z._lastFindingValue = findingValue;
			}
			for (i = start; i < cnt; i++) {
				Z.recnoSilence(i);
				if(findingByText && byText) {
					value = Z.getFieldText(fldName);
				} else {
					value = Z.getFieldValue(fldName);
				}
				if (matchValue(matchType, value, findingValue)) {
					foundRecno = Z._recno;
					break;
				}
			}
		} finally {
			Z.recnoSilence(oldRecno);
		}
		if (foundRecno >= 0) {// can fire scroll event
			Z._gotoRecno(foundRecno);
			return true;
		}
		return false;
	},

	/**
	 * Find record with key value.
	 * 
	 * @param {Object} keyValue Key value.
	 * @return {Boolean}
	 */
	findByKey: function (keyValue) {
		var keyField = this.keyField();
		if (!keyField) {
			return false;
		}
		return this.findByField(keyField, keyValue);
	},

	/**
	 * Find record and return specified field value
	 * 
	 * @param {String} fldName - field name
	 * @param {Object} findingValue - finding field value
	 * @param {String} returnFieldName - return value field name
	 * @return {Object} 
	 */
	lookup: function (fldName, findingValue, returnFieldName) {
		if (this.findByField(fldName, findingValue)) {
			return this.getFieldValue(returnFieldName);
		} else {
			return null;
		}
	},

	lookupByKey: function(keyValue, returnFldName) {
		if (this.findByKey(keyValue)) {
			return this.getFieldValue(returnFldName);
		} else {
			return null;
		}
	},
	
	/**
	 * Copy dataset's data. Example:
	 * <pre><code>
	 * var list = dsFoo.copyDataset(true);
	 * 
	 * </code></pre>
	 * 
	 * @param {Boolean} underCurrentFilter - if true, copy data under dataset's {@link}filter
	 * @return {Object[]} Array of records. 
	 */
	copyDataset: function (underCurrentFilter) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return null;
		}
		var result = [];

		if ((!underCurrentFilter || !Z._filtered)) {
			return Z.dataList().slice(0);
		}

		var foundRecno = -1, 
			oldRecno = Z._recno, 
			oldFiltered = Z._filtered;
		if (!underCurrentFilter) {
			Z._filtered = false;
		}

		Z._silence++;
		try {
			Z.first();
			while (!Z.isEof()) {
				result.push(Z.getRecord());
				Z.next();
			}
		} finally {
			Z._silence--;
			Z._recno = oldRecno;
			if (!underCurrentFilter) {
				Z._filtered = oldFiltered;
			}
		}
		return result;
	},

	/**
	 * Set or get 'key' field name
	 * 
	 * @param {String} keyFldName Key field name.
	 * @return {String or this}
	 */
	keyField: function (keyFldName) {
		if (keyFldName === undefined) {
			return this._keyField;
		}
		jslet.Checker.test('Dataset.keyField', keyFldName).isString();
		this._keyField = jQuery.trim(keyFldName);
		return this;
	},

	/**
	 * Set or get 'code' field name
	 * 
	 * @param {String} codeFldName Code field name.
	 * @return {String or this}
	 */
	codeField: function (codeFldName) {
		if (codeFldName === undefined) {
			return this._codeField;
		}
		
		jslet.Checker.test('Dataset.codeField', codeFldName).isString();
		this._codeField = jQuery.trim(codeFldName);
		return this;
	},
	
	/**
	 * Set or get 'name' field name
	 * 
	 * @param {String} nameFldName Name field name
	 * @return {String or this}
	 */
	nameField: function (nameFldName) {
		if (nameFldName === undefined) {
			return this._nameField;
		}
		
		jslet.Checker.test('Dataset.nameField', nameFldName).isString();
		this._nameField = jQuery.trim(nameFldName);
		return this;
	},

	/**
	 * Set or get 'parent' field name
	 * 
	 * @param {String} parentFldName Parent field name.
	 * @return {String or this}
	 */
	parentField: function (parentFldName) {
		if (parentFldName === undefined) {
			return this._parentField;
		}
		
		jslet.Checker.test('Dataset.parentField', parentFldName).isString();
		this._parentField = jQuery.trim(parentFldName);
		return this;
	},
	
	levelOrderField: function(fldName) {
		if (fldName === undefined) {
			return this._levelOrderField;
		}
		
		jslet.Checker.test('Dataset.levelOrderField', fldName).isString();
		this._levelOrderField = jQuery.trim(fldName);
		return this;
	},
	
	/**
	 * Set or get 'select' field name. "Select field" is a field to store the selected state of a record. 
	 * 
	 * @param {String} parentFldName Parent field name.
	 * @return {String or this}
	 */
	selectField: function (selectFldName) {
		if (selectFldName === undefined) {
			return this._selectField;
		}
		
		jslet.Checker.test('Dataset.selectField', selectFldName).isString();
		this._selectField = jQuery.trim(selectFldName);
		return this;
	},
	
	/**
	 * @private
	 */
	_convertFieldValue: function (srcField, srcValues, destFields) {
		var Z = this;

		if (destFields === null) {
			throw new Error('NOT set destFields in method: ConvertFieldValue');
		}
		var isExpr = destFields.indexOf('[') > -1;
		if (isExpr) {
			if (destFields != Z._convertDestFields) {
				Z._innerConvertDestFields = new jslet.Expression(this,
						destFields);
				Z._convertDestFields = destFields;
			}
		}
		if (typeof (srcValues) != 'string') {
			srcValues += '';
		}
		var separator = jslet.global.valueSeparator;
		var values = srcValues.split(separator), valueCnt = values.length - 1;
		Z._ignoreFilter = true;
		try {
			if (valueCnt === 0) {
				if (!Z.findByField(srcField, values[0])) {
					return null;
					//throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,[Z._name, srcField, values[0]]));
				}
				if (isExpr) {
					return Z._innerConvertDestFields.eval();
				} else {
					return Z.getFieldValue(destFields);
				}
			}
	
			var fldcnt, destValue = '';
			for (var i = 0; i <= valueCnt; i++) {
				if (!Z.findByField(srcField, values[i])) {
					return null;
				}
				if (isExpr) {
					destValue += Z._innerConvertDestFields.eval();
				} else {
					destValue += Z.getFieldValue(destFields);
				}
				if (i != valueCnt) {
					destValue += separator;
				}
			}
			return destValue;
		} finally {
			Z._ignoreFilter = false;
		}
	},

	/**
	 * Set or get context rule
	 * 
	 * @param {jslet.data.ContextRule[]} contextRule Context rule;
	 * @return {jslet.data.ContextRule[] or this}
	 */
	contextRules: function (rules) {
		if (rules === undefined) {
			return this._contextRules;
		}
		if(jslet.isString(rules)) {
			rules = rules? jslet.JSON.parse(rules): null;
		}
		jslet.Checker.test('Dataset.contextRules', rules).isArray();
		if(!rules || rules.length === 0) {
			this._contextRules = null;
			this._contextRuleEngine = null;
		} else {
			var ruleObj;
			for(var i = 0, len = rules.length; i < len; i++) {
				ruleObj = rules[i];
				if(!ruleObj.className || 
						ruleObj.className != jslet.data.ContextRule.className) {
					
					jslet.Checker.test('Dataset.contextRules#ruleObj', ruleObj).isPlanObject();
					rules[i] = jslet.data.createContextRule(ruleObj);
				}
			}
			this._contextRules = rules;
			this._contextRuleEngine = new jslet.data.ContextRuleEngine(this);
			this._contextRuleEngine.compile();
			this.enableContextRule();
		}
		return this;
	},
	
	/**
	 * Disable context rule
	 */
	disableContextRule: function () {
		this._contextRuleEnabled = false;
//		this.restoreContextRule();
	},

	/**
	 * Enable context rule, any context rule will be calculated.
	 */
	enableContextRule: function () {
		this._contextRuleEnabled = true;
		this.calcContextRule();
	},

	/**
	 * Check context rule enable or not.
	 * 
	 * @return {Boolean}
	 */
	isContextRuleEnabled: function () {
		return this._contextRuleEnabled;
	},

	/**
	 * @private
	 */
	calcContextRule: function (changedField) {
		var Z = this;
		if(Z.recordCount() === 0) {
			return;
		}
		
		if(Z._contextRuleEngine) {
			Z._inContextRule = true;
			try {
				if(!changedField) {
					Z._contextRuleEngine.evalStatus();
				}
				Z._contextRuleEngine.evalRule(changedField);
			} finally {
				Z._inContextRule = false;
			}
		}
	},

	/**
	 * Check current record if it's selectable.
	 */
	checkSelectable: function (recno) {
		if(this.recordCount() === 0) {
			return false;
		}
		if(this._onCheckSelectable) {
			var eventFunc = jslet.getFunction(this._onCheckSelectable);
			if(eventFunc) {
				return eventFunc.call(this, recno);
			}
		}
		return true;
	},
	
	/**
	 * Get or set selected state of current record.
	 */
	selected: function (selected) {
		var Z = this;
		var selFld = Z._selectField || jslet.global.selectStateField,
			rec = Z.getRecord();
		
		if(selected === undefined) {
			return rec && rec[selFld];
		}
		
		if(rec) {
			if(Z.checkSelectable()) {
				Z._aborted = false;
				try {
					Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESELECT);
					if (Z._aborted) {
						return Z;
					}
				} finally {
					Z._aborted = false;
				}
				rec[selFld] = selected;
				Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSELECT);
			}
		}
		return Z;
	},
	
	selectedByRecno: function(recno) {
		var Z = this,
			selFld = Z._selectField || jslet.global.selectStateField,
			rec = Z.getRecord(recno);
		
		return rec && rec[selFld];
	},
	
	/**
	 * Select/unselect all records.
	 * 
	 * @param {Boolean}selected  true - select records, false otherwise.
	 * @param {Function)onSelectAll Select event handler.
	 *	Pattern: function(dataset, Selected}{}
	 *	//dataset: jslet.data.Dataset
	 *	//Selected: Boolean
	 *	//return: true - allow user to select, false - otherwise.

	 * @param {Boolean}noRefresh Refresh controls or not.
	 */
	selectAll: function (selected, onSelectAll, noRefresh) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return;
		}

		jslet.Checker.test('Dataset.selectAll#onSelectAll', onSelectAll).isFunction();
		var oldRecno = Z.recno();
		try {
			for (var i = 0, cnt = Z.recordCount(); i < cnt; i++) {
				Z.recnoSilence(i);

				if (onSelectAll) {
					var flag = onSelectAll(this, selected);
					if (flag !== undefined && !flag) {
						continue;
					}
				}
				Z.selected(selected);
			}
		} finally {
			Z.recnoSilence(oldRecno);
		}
		if (!noRefresh) {
			var evt = jslet.data.RefreshEvent.selectAllEvent(selected);
			Z.refreshControl(evt);
		}
	},

	/**
	 * Select/unselect record by key value.
	 * 
	 * @param {Boolean} selected true - select records, false otherwise.
	 * @param {Object) keyValue Key value.
	 * @param {Boolean} noRefresh Refresh controls or not.
	 */
	selectByKeyValue: function (selected, keyValue, noRefresh) {
		var Z = this,
			oldRecno = Z.recno(),
			cnt = Z.recordCount(),
			v, changedRecNum = [];
		try {
			for (var i = 0; i < cnt; i++) {
				Z.recnoSilence(i);
				v = Z.getFieldValue(Z._keyField);
				if (v == keyValue) {
					Z.selected(selected);
					changedRecNum.push(i);
					break;
				}
			} //end for
		} finally {
			Z.recnoSilence(oldRecno);
		}
		if (!noRefresh) {
			var evt = jslet.data.RefreshEvent.selectRecordEvent(changedRecNum, selected);
			Z.refreshControl(evt);
		}
	},

	/**
	 * Select current record or not.
	 * If 'selectBy' is not empty, select all records which value of 'selectBy' field is same as the current record.
	 * <pre><code>
	 * dsEmployee.select(true, 'gender');
	 * //if the 'gender' of current value is female, all female employees will be selected.  
	 * </code></pre>
	 * 
	 * @param {Boolean}selected - true: select records, false:unselect records
	 * @param {String)selectBy - field names, multiple fields concatenated with ',' 
	 */
	select: function (selected, selectBy) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return;
		}

		var changedRecNum = [];
		if (!selectBy) {
			Z.selected(selected);
			changedRecNum.push(Z.recno());
		} else {
			var arrFlds = selectBy.split(','), 
				arrValues = [], i, 
				fldCnt = arrFlds.length;
			for (i = 0; i < fldCnt; i++) {
				arrValues[i] = Z.getFieldValue(arrFlds[i]);
			}
			var v, preRecno = Z.recno(), flag;
			try {
				for (var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
					Z.recnoSilence(k);
					flag = 1;
					for (i = 0; i < fldCnt; i++) {
						v = Z.getFieldValue(arrFlds[i]);
						if (v != arrValues[i]) {
							flag = 0;
							break;
						}
					}
					if (flag) {
						Z.selected(selected);
						changedRecNum.push(Z.recno());
					}
				}
			} finally {
				Z.recnoSilence(preRecno);
			}
		}

		var evt = jslet.data.RefreshEvent.selectRecordEvent(changedRecNum, selected);
		Z.refreshControl(evt);
	},

	/**
	 * Set or get data provider
	 * 
	 * @param {jslet.data.Provider} provider - data provider
	 * @return {jslet.data.Provider or this}
	 */
	dataProvider: function (provider) {
		if (provider === undefined) {
			return this._dataProvider;
		}
		this._dataProvider = provider;
		return this;
	},
	
	/**
	 * @private
	 */
	_checkDataProvider: function () {
		if (!this._dataProvider) {
			throw new Error('DataProvider required, use: yourDataset.dataProvider(yourDataProvider);');
		}
	},

	/**
	 * Get selected records
	 * 
	 * @return {Object[]} Array of records
	 */
	selectedRecords: function () {
		var Z = this;
		if (!Z.hasRecord()) {
			return null;
		}

		var preRecno = Z.recno(), result = [];
		try {
			for (var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
				Z.recnoSilence(k);
				if(Z.selected()) {
					result.push(Z.getRecord());
				}
			}
		} finally {
			Z.recnoSilence(preRecno);
		}
		
		return result;
	},

	/**
	 * Get key values of selected records.
	 * 
	 * @return {Object[]} Array of selected record key values
	 */
	selectedKeyValues: function () {
		var oldRecno = this.recno(), result = [];
		try {
			for (var i = 0, cnt = this.recordCount(); i < cnt; i++) {
				this.recnoSilence(i);
				var state = this.selected();
				if (state && state !== 2) { // 2: partial select
					result.push(this.getFieldValue(this._keyField));
				}
			}
		} finally {
			this.recnoSilence(oldRecno);
		}
		if (result.length > 0) {
			return result;
		} else {
			return null;
		}
	},

	queryUrl: function(url) {
		if(url === undefined) {
			return this._queryUrl;
		}
		jslet.Checker.test('Dataset.queryUrl', url).isString();
		this._queryUrl = jQuery.trim(url);
		return this;
	},
	
	/**
	 * Query data from server. Example:
	 * <pre><code>
	 * dsEmployee.queryUrl('../getemployee.do');
	 * var criteria = {name:'Bob', age:25};
	 * dsEmployee.query(condition);
	 * </code></pre>
	 * @param {Plan Object or jslet.data.Dataset} criteria Condition should be a JSON object or criteria dataset.
	 */
	query: function (criteria) {
		if(criteria && criteria instanceof jslet.data.Dataset) {
			var criteriaDataset = criteria;
			criteriaDataset.confirm();
			if(criteriaDataset.checkAndShowError()) {
				return jslet.emptyPromise;
			}
			criteria = criteriaDataset.getRecord();
		}
		this._queryCriteria = criteria;
		return this.requery();
	},

	_doQuerySuccess: function(result, dataset) {
		var Z = dataset;
		if (!result) {
			Z.dataList([]);
			if(result && result.info) {
				jslet.showInfo(result.info);
			}
			return;
		}
		var mainData = result.main;
		if (mainData) {
			Z.dataList(mainData);
		}
		var extraData = result.extraEntities;
		if(extraData) {
			var dsName, ds;
			for (var dsName in extraData) {
				ds = jslet.data.getDataset(dsName);
				if (ds) {
					ds.dataList(extraData[dsName]);
				} else {
					console.warn(dsName + ' is returned from server, but this datase does not exist!');
				}
			}
		}
		if (result.pageNo) {
			Z._pageNo = result.pageNo;
		}
		if (result.pageCount) {
			Z._pageCount = result.pageCount;
		}

		var evt = jslet.data.RefreshEvent.changePageEvent();
		Z.refreshControl(evt);
		if(result && result.info) {
			jslet.showInfo(result.info);
		}
	},
	
	_doApplyError: function(result, dataset) {
		var Z = dataset,
			errCode = result.errorCode,
			errMsg = result.errorMessage;
		if(jslet.global.serverErrorHandler) {
			var catched = jslet.global.serverErrorHandler(errCode, errMsg);
			if(catched) {
				return;
			}
		}
		errMsg = errMsg + "[" + errCode + "]";
		Z.errorMessage(errMsg);
		if(Z._autoShowError) {
			jslet.showError(errMsg);
		}
	},
	
	/**
	 * Send request to refresh with current condition.
	 */
	requery: function () {
		var Z = this;
		Z._checkDataProvider();

		if(!this._queryUrl) {
			throw new Error('QueryUrl required! Use: yourDataset.queryUrl(yourUrl)');
		}
		if(Z._querying) { //Avoid duplicate submitting
			return;
		}
		Z._querying = true;
		try {
			var reqData = {};
			if(Z._pageNo > 0) {
				reqData.pageNo = Z._pageNo;
				reqData.pageSize = Z._pageSize;
			}
			var criteria = Z._queryCriteria;
			if(criteria) {
				if(jslet.isArray(criteria)) {
					reqData.criteria = criteria;
				} else {
					reqData.simpleCriteria = criteria;
				}
			}
			if(Z.csrfToken) {
				reqData.csrfToken = Z.csrfToken;
			}
			var reqData = jslet.data.record2Json(reqData);
			var url = Z._queryUrl;
			return Z._dataProvider.sendRequest(Z, url, reqData)
			.done(Z._doQuerySuccess)
			.fail(Z._doApplyError)
			.always(function(){Z._querying = false})
		} catch(e) {
			Z._querying = false
		}
	},

	_setChangedState: function(flag, chgRecs, pendingRecs) {
		if(!chgRecs || chgRecs.length === 0) {
			return;
		}
		var result = this._addRecordClassFlag(chgRecs, flag, this._recordClass || jslet.global.defaultRecordClass);
		for(var i = 0, len = result.length; i < len; i++) {
			pendingRecs.push(result[i]);
		}
	},

	_addRecordClassFlag: function(records, changeFlag, recClazz) {
		var fields = this.getFields(),
			fldObj,
			subRecordClass = null;
		
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.getType() === jslet.data.DataType.DATASET) {
				if(!subRecordClass) {
					subRecordClass = {};
				}
				subRecordClass[fldObj.name()] = fldObj.subDataset().recordClass();
			}
		}
		var result = [], rec, pRec, subRecClazz;
		for (var i = 0, cnt = records.length; i < cnt; i++) {
			rec = records[i];
			pRec = {};
			if(recClazz) {
				pRec["@type"] = recClazz;
			}
			rec[jslet.global.changeStateField] = changeFlag + i;
			var fldValue;
			for(var prop in rec) {
				fldValue = rec[prop];
				if(fldValue && subRecordClass) {
					subRecClazz = subRecordClass[prop];
					if(subRecClazz) {
						fldValue = this._addRecordClassFlag(fldValue, changeFlag, subRecClazz);
					}
				}
				pRec[prop] = fldValue;
			}
			result.push(pRec);
		}
		return result;
	},
	
	_doSaveSuccess: function(result, dataset) {
		if (!result) {
			if(result && result.info) {
				jslet.showInfo(result.info);
			}
			return;
		}
		var mainData = result.main;
		var Z = dataset;
		Z._dataTransformer.refreshSubmittedData(mainData);

		Z.calcAggradedValue();
		Z.selection.removeAll();
		
		Z.refreshControl();
		Z.refreshLookupHostDataset();
		if(result && result.info) {
			jslet.showInfo(result.info);
		}
	},
	
	submitUrl: function(url) {
		if(url === undefined) {
			return this._submitUrl;
		}

		jslet.Checker.test('Dataset.submitUrl', url).isString();
		this._submitUrl = jQuery.trim(url);
		return this;
	},
	
	/**
	 * Identify dataset has changed records.
	 */
	hasChangedData: function() {
		var Z = this;
		Z.confirm();
		var dataList = Z.dataList(), record, recInfo;
		if(!dataList) {
			return false;
		}
		for(var i = 0, len = dataList.length; i < len; i++) {
			record = dataList[i];
			recInfo = jslet.data.getRecInfo(record);
			return recInfo && recInfo.status && recInfo.status !== jslet.data.DataSetStatus.BROWSE;
		}
		return false;
	},
	
	/**
	 * Submit changed data to server. 
	 * If server side save data successfully and return the changed data, Jslet can refresh the local data automatically.
	 * 
	 * Cause key value is probably generated at server side(like sequence), we need an extra field which store an unique value to update the key value,
	 * this extra field is named '_s_', its value will start a letter 'i', 'u' or 'd', and follow a sequence number, like: i1, i2, u1, u2, d1, d3,....
	 * You don't care about it in client side, it is generated by Jslet automatically.
	 * 
	 * At server side, you can use the leading letter to distinguish which action will be sent to DB('i' for insert, 'u' for update and 'd' for delete)
	 * If the records need be changed in server(like sequence key or other calculated fields), you should return them back.Notice:
	 * you need not to change this value of extra field: '_s_', just return it. Example:
	 * <pre><code>
	 * dsFoo.insertRecord();
	 * dsFoo.setFieldValue('name','Bob');
	 * dsFoo.setFieldValue('code','A01');
	 * dsFoo.confirm();
	 * dsFoo.submitUrl('../foo_save.do');
	 * dsFoo.submit();
	 * </code></pre>
	 * 
	 * @param {Object} extraInfo extraInfo to send to server
	 * @param {Array of String} excludeFields Array of field names which need not be sent to server;
	 */
	submit: function(extraInfo, excludeFields) {
		var Z = this;
		Z.confirm();
		if(Z.checkAndShowError()) {
			return jslet.emptyPromise;
		}
		Z._checkDataProvider();

		if(!Z._submitUrl) {
			throw new Error('SubmitUrl required! Use: yourDataset.submitUrl(yourUrl)');
		}
		var changedRecs = Z._dataTransformer.getSubmittingChanged();
		if (!changedRecs || changedRecs.length === 0) {
			jslet.showInfo(jslet.locale.Dataset.noDataSubmit);
			return jslet.emptyPromise;
		}
		if(Z._submitting) { //Avoid duplicate submitting
			return;
		}
		Z._submitting = true;
		try {
			var reqData = {main: changedRecs};
			if(extraInfo) {
				reqData.extraInfo = extraInfo;
			}
			if(Z.csrfToken) {
				reqData.csrfToken = Z.csrfToken;
			}
			reqData = jslet.data.record2Json(reqData, excludeFields);
			var url = Z._submitUrl;
			return Z._dataProvider.sendRequest(Z, url, reqData)
			.done(Z._doSaveSuccess)
			.fail(Z._doApplyError)
			.always(function(){
				Z._submitting = false;
			});
		} catch(e) {
			Z._submitting = false
		}
	},
	
	_doSubmitSelectedSuccess: function(result, dataset) {
		if(!result) {
			return;
		}
		var mainData = result.main;
		if (!mainData || mainData.length === 0) {
			if(result.info) {
				jslet.showInfo(result.info);
			}
			return;
		}
		var Z = dataset,
			deleteOnSuccess = Z._deleteOnSuccess_,
			arrRecs = Z.selectedRecords() || [],
			i, k,
			records = Z.dataList();
		Z.selection.removeAll();
		if(deleteOnSuccess) {
			for(i = arrRecs.length; i >= 0; i--) {
				rec = arrRecs[i];
				k = records.indexOf(rec);
				records.splice(k, 1);
			}
			Z._refreshInnerRecno();
		} else {
			var newRec, oldRec, len;
			Z._dataTransformer.refreshSubmittedData(mainData);
		}
		Z.calcAggradedValue();
		Z.refreshControl();
		Z.refreshLookupHostDataset();
		if(result && result.info) {
			jslet.showInfo(result.info);
		}
	},
	
	/**
	 * Send selected data to server whether or not the records have been changed. 
	 * Under some special scenarios, we need send user selected record to server to process. 
	 * Sever side need not send back the processed records. Example:
	 * 
	 * <pre><code>
	 * //Audit the selected records, if successful, delete the selected records.
	 * dsFoo.submitSelected('../foo_audit.do', true);
	 * 
	 * </code></pre>
	 * @param {String} url Url
	 * @param {Boolean} deleteOnSuccess If processing successfully at server side, delete the selected record or not.
	 * @param {Object} extraInfo extraInfo
	 * @param {Array of String} excludeFields Array of field names which need not be sent to server;
	 */
	submitSelected: function (url, deleteOnSuccess, extraInfo, excludeFields) {
		var Z = this;
		Z.confirm();
		if(Z.checkAndShowError()) {
			return jslet.emptyPromise;
		}
		Z._checkDataProvider();
		if(!url) {
			throw new Error('Url required! Use: yourDataset.submitSelected(yourUrl)');
		}
		if(Z._submitting) { //Avoid duplicate submitting
			return;
		}
		Z._submitting = true;
		try {
			var changedRecs = Z._dataTransformer.getSubmittingSelected() || [];
	
			Z._deleteOnSuccess_ = deleteOnSuccess;
			var reqData = {main: changedRecs};
			if(Z.csrfToken) {
				reqData.csrfToken = Z.csrfToken;
			}
			if(extraInfo) {
				reqData.extraInfo = extraInfo;
			}
			reqData = jslet.data.record2Json(reqData, excludeFields);
			return Z._dataProvider.sendRequest(Z, url, reqData)
			.done(Z._doSubmitSelectedSuccess)
			.fail(Z._doApplyError)
			.always(function(){
				Z._submitting = false;
			});
		} catch(e) {
			Z._submitting = false
		}
	},

	/**
	 * @private
	 */
	_refreshInnerControl: function (updateEvt) {
		var i, cnt, ctrl;
		if (updateEvt.eventType == jslet.data.RefreshEvent.UPDATEALL || 
				updateEvt.eventType == jslet.data.RefreshEvent.CHANGEMETA) {
			cnt = this._linkedLabels.length;
			for (i = 0; i < cnt; i++) {
				ctrl = this._linkedLabels[i];
				if (ctrl.refreshControl) {
					ctrl.refreshControl(updateEvt);
				}
			}
		}
		cnt = this._linkedControls.length;
		for (i = 0; i < cnt; i++) {
			ctrl = this._linkedControls[i];
			if (ctrl.refreshControl) {
				ctrl.refreshControl(updateEvt);
			}
		}
	},

	/**
	 * Focus on the edit control that link specified field name.
	 * 
	 * @param {String} fldName Field name
	 */
	focusEditControl: function (fldName) {
		var Z = this,
			ctrl, el, fldObj;
		for (var i = Z._linkedControls.length - 1; i >= 0; i--) {
			ctrl = Z._linkedControls[i];
			if(!ctrl.field) {
				continue;
			}
			if (ctrl.field() == fldName) {
				fldObj = Z.getField(fldName);
				if(!fldObj || !fldObj.visible() || fldObj.disabled()|| !ctrl.isActiveRecord()) {
					continue;
				}
				el = ctrl.el;
				if (el.focus) {
					try {
						el.focus();
						if(ctrl.selectText) {
							ctrl.selectText();
						}
						return;
					} catch (e) {
						console.warn('Can\' focus into a disabled control!');
					}
				}
			} //end if
		} //end for
	},

	/**
	 * Refresh whole field.
	 * 
	 * @param {String} fldName field name.
	 */
	refreshField: function(fldName) {
		this.refreshControl(jslet.data.RefreshEvent.updateColumnEvent(fldName));
	},
	
	/**
	 * Refresh lookup field.
	 * 
	 * @param {String} fldName field name.
	 * @param {Integer} recno (Optional) if recno >=0, only refresh the current record control specified by 'recno', otherwise refresh whole field. 
	 */
	refreshLookupField: function(fldName, recno) {
		var lookupEvt;
		if(recno === undefined) {
			lookupEvt = jslet.data.RefreshEvent.lookupEvent(fldName);
		} else {
			lookupEvt = jslet.data.RefreshEvent.lookupEvent(fldName, recno);
		}
		this.refreshControl(lookupEvt);
	},
	
	/**
	 * @private 
	 */
	refreshControl: function (updateEvt) {
		if (this._lockCount) {
			return;
		}

		if (!updateEvt) {
			updateEvt = jslet.data.RefreshEvent.updateAllEvent();
		}
		this._refreshInnerControl(updateEvt);
	},

	/**
	 * @private 
	 */
	addLinkedControl: function (linkedControl) {
		if (linkedControl.isLabel) {
			this._linkedLabels.push(linkedControl);
		} else {
			this._linkedControls.push(linkedControl);
		}
	},

	/**
	 * @private 
	 */
	removeLinkedControl: function (linkedControl) {
		var arrCtrls = linkedControl.isLabel ? this._linkedLabels : this._linkedControls;
		
		var k = arrCtrls.indexOf(linkedControl);
		if (k >= 0) {
			arrCtrls.splice(k, 1);
		}
	},

	refreshLookupHostDataset: function() {
		if(this._autoRefreshHostDataset) {
			jslet.data.datasetRelationManager.refreshLookupHostDataset(this._name);
		}
	},
	
	handleLookupDatasetChanged: function(fldName) {
		var Z = this;
		if(Z._inContextRule) {
			Z.refreshLookupField(fldName, Z.recno());
		} else {
			jslet.data.FieldValueCache.clearAll(Z, fldName);
			Z.refreshLookupField(fldName);
		}
		//Don't use the following code, is will cause DBAutoComplete control issues.
		//this.refreshControl(jslet.data.RefreshEvent.updateColumnEvent(fldName));
	},
	
	/**
	 * Export data with CSV format.
	 * 
	 * Export option pattern:
	 * {exportHeader: true|false, //export with field labels
	 *  exportDisplayValue: true|false, //true: export display value of field, false: export actual value of field
	 *  onlySelected: true|false, //export selected records or not
	 *  includeFields: ['fldName1', 'fldName2',...], //Array of field names which to be exported
	 *  excludeFields: ['fldName1', 'fldName2',...]  //Array of field names which not to be exported
	 *  }
	 *  
	 * @param exportOption {PlanObject} export options
	 * 
	 * @return {String} Csv Text. 
	 */
	exportCsv: function(exportOption) {
		var Z = this;
		Z.confirm();
		if(Z.existDatasetError()) {
			console.warn(jslet.locale.Dataset.cannotConfirm);
		}

		var exportHeader = true,
			exportDisplayValue = true,
			onlySelected = false,
			includeFields = null,
			excludeFields = null;
		
		if(exportOption && jQuery.isPlainObject(exportOption)) {
			if(exportOption.exportHeader !== undefined) {
				exportHeader = exportOption.exportHeader? true: false;
			}
			if(exportOption.exportDisplayValue !== undefined) {
				exportDisplayValue = exportOption.exportDisplayValue? true: false;
			}
			if(exportOption.onlySelected !== undefined) {
				onlySelected = exportOption.onlySelected? true: false;
			}
			if(exportOption.includeFields !== undefined) {
				includeFields = exportOption.includeFields;
				jslet.Checker.test('Dataset.exportCsv#exportOption.includeFields', includeFields).isArray();
			}
			if(exportOption.excludeFields !== undefined) {
				excludeFields = exportOption.excludeFields;
				jslet.Checker.test('Dataset.exportCsv#exportOption.excludeFields', excludeFields).isArray();
			}
		}
		var fldSeperator = ',', surround='"';
		var context = Z.startSilenceMove();
		try{
			Z.first();
			var result = [], 
				arrRec, 
				fldCnt = Z._normalFields.length, 
				fldObj, fldName, value, i,
				exportFields = [];
			for(i = 0; i < fldCnt; i++) {
				fldObj = Z._normalFields[i];
				fldName = fldObj.name();
				if(includeFields && includeFields.length > 0) {
					if(includeFields.indexOf(fldName) < 0) {
						continue;
					}
				} else {
					if(!fldObj.visible()) {
						continue;
					}
				}
				if(excludeFields && excludeFields.length > 0) {
					if(excludeFields.indexOf(fldName) >= 0) {
						continue;
					}
				} 
				
				exportFields.push(fldObj);
			}
			fldCnt = exportFields.length;
			if (exportHeader) {
				arrRec = [];
				for(i = 0; i < fldCnt; i++) {
					fldObj = exportFields[i];
					fldName = fldObj.label() || fldObj.name();
					fldName = surround + fldName + surround;
					arrRec.push(fldName);
				}
				result.push(arrRec.join(fldSeperator));
			}
			while(!Z.isEof()) {
				if (onlySelected && !Z.selected()) {
					Z.next();
					continue;
				}
				arrRec = [];
				for(i = 0; i < fldCnt; i++) {
					fldObj = exportFields[i];
					fldName = fldObj.name();
					if (exportDisplayValue) {
						//If Number field does not have lookup field, return field value, not field text. 
						//Example: 'amount' field
						if(fldObj.getType() === 'N' && !fldObj.lookup()) {
							value = Z.getFieldValue(fldName);
						} else {
							value = Z.getFieldText(fldName);
						}
					} else {
						value = Z.getFieldValue(fldName);
					}
					if (!value && value !== 0) {
						value = '';
					} else {
						value += '';
					}
					value = value.replace(/"/,'');
					value = surround + value + surround;
					arrRec.push(value);
				}
				result.push(arrRec.join(fldSeperator));
				Z.next();
			}
			return result.join('\n');
		}finally{
			Z.endSilenceMove(context);
		}
	},

	/**
	 * Export data to CSV file.
	 * 
	 * @param {fileName}fileName - CSV file name.
	 * @param {String}includeFieldLabel - export with field labels, can be null  
	 * @param {Boolean}dispValue - true: export display value of field, false: export actual value of field 
	 * @param {Boolean}onlySelected - export selected records or not.
	 * @param {String[]} onlyFields - specified the field name to export.
	 */
	exportCsvFile: function(fileName, includeFieldLabel, dispValue, onlySelected, onlyFields) {
		jslet.Checker.test('Dataset.exportCsvFile#fileName', fileName).required().isString();
    	var str = this.exportCsv(includeFieldLabel, dispValue, onlySelected, onlyFields);
        var a = document.createElement('a');
		
        var blob = new Blob([str], {'type': 'text\/csv'});
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    },
    
	/** 
	* Get filtered data list. 
	* 
	*/ 
	filteredDataList: function() { 
		var Z= this, 
			result = [], 
			oldRecno = Z.recnoSilence(); 
		Z.confirm();
		try { 
			for(var i = 0, len = Z.recordCount(); i < len; i++) {
				Z.recnoSilence(i); 
				result.push(Z.getRecord()); 
			} 
		} finally { 
			Z.recnoSilence(oldRecno); 
		} 
		return result; 
	}, 

	/** 
	* Iterate the whole dataset, and run the specified callback function. 
	* Example: 
	* 
	* dataset.iterate(function(){
	* 	var fldValue = this.getFieldValue('xxx');
	* 	this.setFieldValue('xxx', fldValue);
	* }); 
	* 
	*/ 
	iterate: function(callBackFn, startRecno, endRecno) { 
		jslet.Checker.test('Dataset.iterate#callBackFn', callBackFn).required().isFunction(); 
		var Z= this, 
			result = [], 
			context = Z.startSilenceMove(); 
		try{
			startRecno = startRecno || 0;
			if(endRecno !== 0 && !endRecno) {
				endRecno = Z.recordCount() - 1;
			}
			for(var k = startRecno; k <= endRecno; k++) {
				Z.recno(k);
				if(callBackFn) { 
					callBackFn.call(Z); 
				} 
			} 
		}finally{ 
			Z.endSilenceMove(context); 
		} 
		return result; 
	}, 
	
	/**
	 * Set or get raw data list
	 * 
	 * @param {Object[]} datalst - raw data list
	 */
	dataList: function (datalst) {
		var Z = this;
		if (datalst === undefined) {
			if(Z._datasetField) {
				return Z._datasetField.getValue();
			}
			return Z._dataList;
		}
		jslet.Checker.test('Dataset.dataList', datalst).isArray();
		if(Z._datasetField) {
			if(datalst === null) {
				datalst = [];
			}
			Z._datasetField.setValue(datalst);
		} else {
			Z._dataList = datalst;
		}
		Z._initialize();
		var fields = Z._subDatasetFields;
		if(fields) {
			var fldObj, subDs;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				subDs = fldObj.subDataset();
				if(subDs) {
					subDs.confirm();
					subDs._initialize();
				}
			}
		}
		return this;
	},
	
	_initialize: function(isDetailDs) {
		var Z = this;
		if(!isDetailDs) { //Master dataset
			jslet.data.FieldValueCache.removeAllCache(Z);
			jslet.data.FieldError.clearDatasetError(Z);
			jslet.data.convertDateFieldValue(Z);
			Z._changeLog.clear();
		}
		Z.status(jslet.data.DataSetStatus.BROWSE);
		Z._recno = -1;
		Z.indexFields(Z.indexFields());
		Z.filter(null);
		if(Z.filtered() || Z.fixedFilter()) {
			Z._doFilterChanged();			
		}
		Z.first();
		Z.calcAggradedValue();	
		Z.refreshControl(jslet.data.RefreshEvent._updateAllEvent);
		Z.refreshLookupHostDataset();
	},
	
	/**
	 * Return dataset data with field text, field text is formatted or calculated field value.
	 * You can use them to do your special processing like: use them in jquery template.
	 */
	textList: function() {
		var Z = this;
		Z.confirm();
		
		var	oldRecno = Z.recno(), 
			result = [],
			fldCnt = Z._normalFields.length,
			fldObj, fldName, textValue, textRec;
		try {
			for (var i = 0, cnt = Z.recordCount(); i < cnt; i++) {
				Z.recnoSilence(i);
				textRec = {};
				for(var j = 0; j < fldCnt; j++) {
					fldObj = Z._normalFields[j];
					fldName = fldObj.name();
					textValue = Z.getFieldText(fldName);
					textRec[fldName] = textValue;
				}
				result.push(textRec);
			}
			return result;
		} finally {
			this.recnoSilence(oldRecno);
		}
	},
	
	/**
	 * Export dataset snapshot. Dataset snapshot can be used for making a backup when inputing a lot of data. 
	 * 
	 * @return {Object} Dataset snapshot.
	 */
	exportSnapshot: function() {
		var Z = this,
			mainDs = {name: Z.name(), recno: Z.recno(), status: Z.status(), dataList: Z.dataList(), changedRecords: Z._changeLog._changedRecords};
		var indexFields = Z.indexFields();
		if(indexFields) {
			mainDs.indexFields = indexFields;
		}
		var filter = Z.filter();
		if(filter) {
			mainDs.filter = filter;
			mainDs.filtered = Z.filtered();
		}
		var result = {master: mainDs};
		var details = null, detail;
		var detailFields = Z._subDatasetFields;
		if(detailFields) {
			var subFldObj, subDs;
			for(var i = 0, len = detailFields.length; i < len; i++) {
				subFldObj = detailFields[i];
				subDs = subFldObj.subDataset();
				if(subDs) {
					if(!details) {
						details = [];
					}
					detail = {name: subDs.name(), recno: subDs.recno(), status: subDs.status()};
					indexFields = subDs.indexFields();
					if(indexFields) {
						subDs.indexFields = indexFields;
					}
					filter = subDs.filter();
					if(filter) {
						subDs.filter = filter;
						subDs.filtered = subDs.filtered();
					}
					details.push(detail);
				}
			}
		}
		if(details) {
			result.details = details;
		}
		
		return result;
	},
	
	/**
	 * Import a dataset snapshot.
	 * 
	 * @param {Object} snapshot Dataset snapshot.
	 */
	importSnapshot: function(snapshot) {
		jslet.Checker.test('Dataset.importSnapshot#snapshot', snapshot).required().isPlanObject();
		var master = snapshot.master;
		jslet.Checker.test('Dataset.importSnapshot#snapshot.master', master).required().isPlanObject();
		var Z = this,
			dsName = master.name;
		if(dsName != Z._name) {
			throw new Error('Snapshot does not match the current dataset name!');
		}
		Z._dataList = master.dataList;
		Z._changeLog._changedRecords = master.changedRecords;
		if(master.indexFields !== undefined) {
			Z.indexFields(master.indexFields);
		}
		if(master.filter != undefined) {
			Z.filter(master.filter);
			Z.filtered(master.filtered);
		}
		if(master.recno >= 0) {
			Z._silence++;
			try {
				Z.recno(master.recno);
			} finally {
				Z._silence--;
			}
		}
		Z.refreshControl();
		var details = snapshot.details;
		if(!details || details.length === 0) {
			return;
		}
		var detail, subDs;
		for(var i = 0, len = details.length; i < len; i++) {
			detail = details[i];
			subDs = jslet.data.getDataset(detail.name);
			if(subDs) {
				if(detail.indexFields !== undefined) {
					subDs.indexFields(detail.indexFields);
				}
				if(detail.filter !== undefined) {
					subDs.filter(detail.filter);
					subDs.filtered(detail.filtered);
				}
				if(detail.recno >= 0) {
					subDs._silence++;
					try {
						subDs.recno(detail.recno);
					} finally {
						subDs._silence--;
					}
				}
				subDs.refreshControl();
			}
		}
	},
	
	destroy: function () {
		var Z = this;
		Z._masterDataset = null;
		Z._detailDatasets = null;
		Z._fields = null;
		Z._linkedControls = null;
		Z._innerFilter = null;
		Z._innerFindCondition = null;
		Z._sortingFields = null;
		Z._innerFormularFields = null;
		Z._datasetField = null;
		
		jslet.data.dataModule.unset(Z._name);
		jslet.data.datasetRelationManager.removeDataset(Z._name);		
	}
	
};
// end Dataset

/**
 * Create Enum Dataset. Example:
 * <pre><code>
 * var dsGender = jslet.data.createEnumDataset('gender', 'F:Female,M:Male');
 * dsGender.getFieldValue('code');//return 'F'
 * dsGender.getFieldValue('name');//return 'Female'
 * dsGender.next();
 * dsGender.getFieldValue('code');//return 'M'
 * dsGender.getFieldValue('name');//return 'Male'
 * </code></pre>
 * 
 * @param {String} dsName dataset name;  
 * @param {String or Object} enumStrOrObject a string or an object which stores enumeration data; if it's a string, the format must be:<code>:<name>,<code>:<name>
 * @return {jslet.data.Dataset}
 */
jslet.data.createEnumDataset = function(dsName, enumStrOrObj) {
	jslet.Checker.test('createEnumDataset#enumStrOrObj', enumStrOrObj).required();
		
	var dsObj = new jslet.data.Dataset(dsName);
	dsObj.addField(jslet.data.createStringField('code', 10));
	dsObj.addField(jslet.data.createStringField('name', 20));

	dsObj.keyField('code');
	dsObj.codeField('code');
	dsObj.nameField('name');

	var dataList = [];
	if(jslet.isString(enumStrOrObj)) {
		var enumStr = jQuery.trim(enumStrOrObj);
		var recs = enumStr.split(','), recstr;
		for (var i = 0, cnt = recs.length; i < cnt; i++) {
			recstr = jQuery.trim(recs[i]);
			rec = recstr.split(':');
	
			dataList[dataList.length] = {
				'code' : jQuery.trim(rec[0]),
				'name' : jQuery.trim(rec[1])
			};
		}
	} else {
		for(var key in enumStrOrObj) {
			dataList[dataList.length] = {code: key, name: enumStrOrObj[key]};
		}
	}
	dsObj.dataList(dataList);
	dsObj.indexFields('code');
	return dsObj;
};

/**
 * Create dataset with field configurations. Example:
 * <pre><code>
 *   var fldCfg = [{
 *     name: 'deptid',
 *     type: 'S',
 *     length: 10,
 *     label: 'ID'
 *   }, {
 *     name: 'name',
 *     type: 'S',
 *     length: 20,
 *     label: 'Dept. Name'
 *   }];
 *   var dsCfg = {keyField: 'deptid', codeField: 'deptid', nameField: 'name'};
 *   var dsDepartment = jslet.data.createDataset('department', fldCfg, dsCfg);
 * </code></pre>
 * 
 * @param {String} dsName - dataset name
 * @param {jslet.data.Field[]} field configuration
 * @param {Object} dsCfg - dataset configuration
 * @return {jslet.data.Dataset}
 */
jslet.data.createDataset = function(dsName, fieldConfig, dsCfg) {
	jslet.Checker.test('createDataset#fieldConfig', fieldConfig).required().isArray();
	jslet.Checker.test('Dataset.createDataset#datasetCfg', dsCfg).isPlanObject();
	var dsObj = new jslet.data.Dataset(dsName),
		fldObj, 
		fldCfg;
	for (var i = 0, cnt = fieldConfig.length; i < cnt; i++) {
		fldCfg = fieldConfig[i];
		jslet.Checker.test('Dataset.createDataset#fieldCfg', fldCfg).isPlanObject();
		
		fldCfg.dsName = dsName;
		fldObj = jslet.data.createField(fldCfg);
		dsObj.addField(fldObj);
	}
	
	function setPropValue(propName) {
		var propValue = dsCfg[propName];
		if(propValue === undefined) {
			propValue = dsCfg[propName.toLowerCase()];
		}
		if (propValue !== undefined) {
			dsObj[propName](propValue);
		}
	}
	
	function setIntPropValue(propName) {
		var propValue = dsCfg[propName];
		if(propValue === undefined) {
			propValue = dsCfg[propName.toLowerCase()];
		}
		if (propValue !== undefined) {
			dsObj[propName](parseInt(propValue));
		}
	}
	
	function setBooleanPropValue(propName) {
		var propValue = dsCfg[propName];
		if(propValue === undefined) {
			propValue = dsCfg[propName.toLowerCase()];
		}
		if (propValue !== undefined) {
			if(jslet.isString(propValue)) {
				if(propValue) {
					propValue = propValue != '0' && propValue != 'false';
				}
			}
			dsObj[propName](propValue? true: false);
		}
	}
	
	if(dsCfg) {
		setPropValue('keyField');
		setPropValue('codeField');
		setPropValue('nameField');
		setPropValue('parentField');
		setPropValue('levelOrderField');
		setPropValue('selectField');
		setPropValue('recordClass');

		setPropValue('queryUrl');
		setPropValue('submitUrl');
		setIntPropValue('pageNo');
		setIntPropValue('pageSize');
		setPropValue('fixedIndexFields');
		setPropValue('indexFields');
		setPropValue('fixedFilter');
		setPropValue('filter');
		setBooleanPropValue('filtered');
		setBooleanPropValue('autoShowError');
		setBooleanPropValue('autoRefreshHostDataset');
		setBooleanPropValue('readOnly');
		setBooleanPropValue('logChanges');
		setPropValue('datasetListener');
		setPropValue('onFieldChange');
		setPropValue('onCheckSelectable');
		setPropValue('contextRules');
	}
	var globalHandler = jslet.data.globalDataHandler.datasetCreated();
	if(globalHandler) {
		globalHandler(dsObj);
	}
	return dsObj;
};

//
//jslet.data.createCrossDataset = function(sourceDataset, labelField, valueField, crossDsName) {
//	if(!crossDsName) { 
//		crossDsName = sourceDataset.name()+'_cross'; 
//	} 
//	jslet.Checker.test('createCrossDataset#labelField', labelField).required().isString();
//	jslet.Checker.test('createCrossDataset#valueField', valueField).required().isString();
//
//	if(jslet.isString(sourceDataset)) {
//		sourceDataset = jslet.data.getDataset(sourceDataset);
//	}
//	jslet.Checker.test('createCrossDataset#sourceDataset', sourceDataset).required().isClass(jslet.data.Dataset.className);
//	
//	var lblFldObj = sourceDataset.getField(labelField);
//	if(!lblFldObj) {
//		throw new Error('Not found field: ' + labelField);
//	}
//	var lblLkFld = lblFldObj.lookup(); 
//	if(!lblLkFld) { 
//		throw new Error(sourceDataset.name() + '.' + labelField + ' must have lookup dataset!'); 
//	} 
//	var valueFldObj = sourceDataset.getField(valueField); 
//	if(!valeFldObj) {
//		throw new Error('Not found field: ' + valeFldObj);
//	}
//	if(valeFldObj.getType() != jslet.data.DataType.NUMBER) {
//		hasTotalField = false;
//	}
//	
//	var labelFldNames = labelField.split(',');
//		
//	{name: '', horiFields:[{field:'', subTotal: false, showAll:false}, 
//	           vertFields:[{field:'', subTotal: false, showAll:false}], 
//	           cellFields:'',
//	           totalPosition: 'before/after',
//	           indent: true}
//	
//	
//}

jslet.data.ChangeLog = function(dataset) {
	this._dataset = dataset;
	this._changedRecords = null;
}

jslet.data.ChangeLog.prototype = {
	changedRecords: function(changedRecords) {
		if(changedRecords === undefined) {
			return this._changedRecords;
		}
		this._changedRecords = changedRecords;
	},
	
	log: function(recObj) {
		if(!this._dataset.logChanges()) {
			return;
		}
		if(!recObj) {
			recObj = this._dataset.getRecord();
		}
		var recInfo = jslet.data.getRecInfo(recObj);
		if(!recInfo.status) {
			return;
		}
		var chgRecords = this._getChangedRecords();
		if(chgRecords.indexOf(recObj) < 0) {
			chgRecords.push(recObj);
		}
	},
	
	unlog: function(recObj) {
		if(!this._dataset.logChanges()) {
			return;
		}
		if(!recObj) {
			recObj = this._dataset.getRecord();
		}
		var chgRecords = this._getChangedRecords(recObj);
		var k = chgRecords.indexOf(recObj);
		if(k >= 0) {
			chgRecords.splice(k, 1);
		}
	},
	
	clear: function() {
		this._changedRecords = null;
	},
	
	_getChangedRecords: function() {
		var dsObj = this._dataset;
		var masterFldObj = dsObj.datasetField(),
		  	chgRecords;
		if(masterFldObj) {
			var masterFldName = masterFldObj.name(),
				masterDsObj = masterFldObj.dataset();
				masterRecInfo = jslet.data.getRecInfo(masterDsObj.getRecord());
				if(!masterRecInfo.subLog) {
					masterRecInfo.subLog = {};
				}
				chgRecords = masterRecInfo.subLog[masterFldName];
				if(!chgRecords) {
					chgRecords = [];
					masterRecInfo.subLog[masterFldName] = chgRecords;
				}
		} else {
			if(!this._changedRecords) {
				this._changedRecords = [];
			}
			chgRecords = this._changedRecords;
		}
		return chgRecords;
	}
	
}

jslet.data.DataTransformer = function(dataset) {
	this._dataset = dataset;
}

jslet.data.DataTransformer.prototype = {
		
	hasChangedData: function() {
		var chgRecList = this._dataset._changeLog._changedRecords;
		if(!chgRecList || chgRecList.length === 0) {
			return false;
		}
		return true;
	},
	
	getSubmittingChanged: function() {
		var chgRecList = this._dataset._changeLog._changedRecords;
		if(!chgRecList || chgRecList.length === 0) {
			return null;
		}
		var result = this._convert(this._dataset, chgRecList);
		return result;
	},
	
	getSubmittingSelected: function() {
		var chgRecList = this._dataset.selectedRecords();
		if(!chgRecList || chgRecList.length === 0) {
			return null;
		}
		var result = this._convert(this._dataset, chgRecList, true);
		return result;
	},
	
	_convert: function(dsObj, chgRecList, submitAllSubData) {
		if(!chgRecList || chgRecList.length === 0) {
			return null;
		}
		var chgRec, recInfo, status, newRec,
			recClazz = dsObj._recordClass || jslet.global.defaultRecordClass,
			result = [],
			subLog;
		for(var i = 0, len = chgRecList.length; i < len; i++) {
			chgRec = chgRecList[i];
			recInfo = jslet.data.getRecInfo(chgRec);
			newRec = {};
			if(recClazz) {
				newRec["@type"] = recClazz;
			}
			subLog = recInfo.subLog;
			chgRec[jslet.global.changeStateField] = this._getStatusPrefix(recInfo.status) + i;
			var fldObj, subList;
			for(var fldName in chgRec) {
				if(fldName === '_jl_') {
					continue;
				}
				fldObj = dsObj.getField(fldName);
				if(fldObj && fldObj.getType() === jslet.data.DataType.DATASET) {
					var subDsObj = fldObj.subDataset();
					if(submitAllSubData === undefined) {
						submitAllSubData = !subDsObj._onlyChangedSubmitted;
					}
					var allList = chgRec[fldName];
					if(!submitAllSubData) { //add deleted record
						var subChgList = subLog? subLog[fldName]: null;
						if(subChgList) {
							var subChgRec, subRecInfo;
							for(var k = 0, chgLen = subChgList.length; k < chgLen; k++) {
								subChgRec = subChgList[k];
								subRecInfo = jslet.data.getRecInfo(subChgRec);
								if(subRecInfo && subRecInfo.status === jslet.data.DataSetStatus.DELETE) {
									allList.push(subChgRec);
								}
							}
						}
					}
					subList = this._convert(subDsObj, allList);
					if(subList) {
						newRec[fldName] = subList;
					}
				} else {
					newRec[fldName] = chgRec[fldName];
				}
			}
			result.push(newRec);
		}
		return result;
	},
	
	_getStatusPrefix: function(status) {
		return  status === jslet.data.DataSetStatus.INSERT ? 'i' : 
			(status === jslet.data.DataSetStatus.UPDATE? 'u':
			 status === jslet.data.DataSetStatus.DELETE? 'd':'s');
	},
			
	refreshSubmittedData: function(submittedData) {
		if(!submittedData || submittedData.length === 0) {
			return;
		}
		this._refreshDataset(this._dataset, submittedData);
	},
	
	_refreshDataset: function(dsObj, submittedData, isDetailDataset) {
		if(!submittedData || submittedData.length === 0) {
			return;
		}
		if(!isDetailDataset) {
			jslet.data.convertDateFieldValue(dsObj, submittedData);
		}
		var masterFldObj = dsObj.datasetField(), chgLogs;
		if(!masterFldObj) {
			chgLogs = dsObj._changeLog._changedRecords;
		} else {
			var masterRec = masterFldObj.dataset().getRecord();
			var masterRecInfo = jslet.data.getRecInfo(masterRec);
			chgLogs = masterRecInfo.subLog? masterRecInfo.subLog[masterFldObj.name()]: null;
		}

		var newRec, oldRec, flag;
		for(var i = 0, len = submittedData.length; i < len; i++) {
			newRec = submittedData[i];
			if(!newRec) {
				console.warn('The return record exists null. Please check it.');
				continue;
			}
			this._refreshRecord(dsObj, newRec, chgLogs);
		}
	},
		
	_refreshRecord: function(dsObj, newRec, chgLogs) {
		var recState = newRec[jslet.global.changeStateField];
		if(!recState) {
			return;
		}
		if(chgLogs && recState.charAt(0) == 'd') {
			for(var i = 0, len = chgLogs.length; i < len; i++) {
				if(recState == chgLogs[i][jslet.global.changeStateField]) {
					chgLogs.splice(i, 1);
					break;
				}
			}
			return;
		}
		var oldRec, fldObj,
			records = dsObj.dataList() || [];
		for(var i = records.length - 1; i >= 0; i--) {
			oldRec = records[i];
			if(oldRec[jslet.global.changeStateField] != recState) {
				continue;
			}
			for(var fldName in newRec) {
				if(!fldName) {
					continue;
				}
				fldObj = dsObj.getField(fldName);
				if(fldObj && fldObj.subDataset()) {
					this._refreshDataset(fldObj.subDataset(), newRec[fldName], true);
				} else {
					oldRec[fldName] = newRec[fldName];
				}
			} // end for fldName
			if(chgLogs) {
				for(var i = 0, len = chgLogs.length; i < len; i++) {
					if(recState == chgLogs[i][jslet.global.changeStateField]) {
						chgLogs.splice(i, 1);
						break;
					}
				}
			}
			oldRec[jslet.global.changeStateField] = null;
			var recInfo = jslet.data.getRecInfo(oldRec);
			if(recInfo && recInfo.status) {
				recInfo.status = 0;
			}
			jslet.data.FieldValueCache.removeCache(oldRec);
		} // end for i
	}
	
}