/* ========================================================================
 * Jslet framework: jslet.datacommon.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * keep all dataset object,
 * key for dataset name, value for dataset object
 */

jslet.data.dataModule = new jslet.SimpleMap();
/**
 * Get dataset object with dataset name.
 * 
 * @param {String} dsName dataset name;
 * @return {jslet.data.Dataset} Dataset object.
 */
jslet.data.getDataset = function (dsName) {
	return jslet.data.dataModule.get(dsName);
};

jslet.data.DatasetType = {
	NORMAL: 0, //Normal dataset
	LOOKUP: 1, //Lookup dataset
	DETAIL: 2  //Detail dataset	 
};

jslet.data.onCreatingDataset = function(dsName, dsCatalog, realDsName, hostDatasetName) { };


jslet.data.DataType = {
	NUMBER: 'N', //Number
	STRING: 'S', //String
	DATE: 'D',  //Date
	TIME: 'T',  //Time
	BOOLEAN: 'B', //Boolean
	DATASET: 'V', //Dataset field
	CROSS: 'C'   //Cross Field
};

jslet.data.FieldValueStyle = {
	NORMAL: 0,	//Single value
	BETWEEN: 1, //Between style value
	MULTIPLE: 2 //Multile value
};

/**
 * @class Edit Mask 
 */
jslet.data.EditMask = function(mask, keepChar, transform){
	/**
	 * {String} Mask String, rule:
	 *  '#': char set: 0-9 and -, not required
	 *  '0': char set: 0-9, required
	 *  '9': char set: 0-9, not required
	 *  'L': char set: A-Z,a-z, required
	 *  'l': char set: A-Z,a-z, not required
	 *  'A': char set: 0-9,a-z,A-Z, required
	 *  'a': char set: 0-9,a-z,A-Z, not required
	 *  'C': char set: any char, required
	 *  'c': char set: any char, not required
	 */
	this.mask = mask; 
	/**
	 * {Boolean} keepChar Keep the literal character or not
	 */
	this.keepChar = (keepChar !== undefined ? keepChar: true);
	/**
	 * {String} transform Transform character into UpperCase or LowerCase,
	 *  optional value: upper, lower or null.
	 */
	this.transform = transform;
	
	this.clone = function(){
		return new jslet.data.EditMask(this.mask, this.keepChar, this.transform);
	};
};

jslet.data.DatasetEvent = {
	BEFORESCROLL: 'beforeScroll',
	AFTERSCROLL: 'afterScroll',
	
	BEFOREINSERT: 'beforeInsert',
	AFTERINSERT: 'afterInsert',
	
	BEFOREUPDATE: 'beforeUpdate',
	AFTERUPDATE: 'afterUpdate',
	
	BEFOREDELETE: 'beforeDelete',
	AFTERDELETE: 'afterDelete',
	
	BEFORECONFIRM: 'beforeConfirm',
	AFTERCONFIRM: 'afterConfirm',
	
	BEFORECANCEL: 'beforeCancel',
	AFTERCANCEL: 'afterCancel',
	
	BEFORESELECT: 'beforeSelect',
	AFTERSELECT: 'afterSelect'
};

jslet.data.DataSetStatus = {BROWSE:0, INSERT: 1, UPDATE: 2, DELETE: 3};

jslet.data.RefreshEvent = {
	updateRecordEvent: function(fldName) {
		return {eventType: jslet.data.RefreshEvent.UPDATERECORD, fieldName: fldName};
	},
	
	updateColumnEvent: function(fldName) {
		return {eventType: jslet.data.RefreshEvent.UPDATECOLUMN, fieldName: fldName};
	},
	
	updateAllEvent: function() {
		return this._updateAllEvent;
	},
	
	changeMetaEvent: function(metaName, fieldName, changeAllRows) {
		var result = {eventType: jslet.data.RefreshEvent.CHANGEMETA, metaName: metaName, fieldName: fieldName};
		if(changeAllRows !== undefined) {
			result.changeAllRows = changeAllRows;
		}
		return result;
	},
	
	beforeScrollEvent: function(recno) {
		return {eventType: jslet.data.RefreshEvent.BEFORESCROLL, recno: recno};
	},
	
	scrollEvent: function(recno, prevRecno) {
		return {eventType: jslet.data.RefreshEvent.SCROLL, prevRecno: prevRecno, recno: recno};
	},
	
	insertEvent: function(prevRecno, recno, needUpdateAll) {
		return {eventType: jslet.data.RefreshEvent.INSERT, prevRecno: prevRecno, recno: recno, updateAll: needUpdateAll};
	},
	
	deleteEvent: function(recno) {
		return {eventType: jslet.data.RefreshEvent.DELETE, recno: recno};
	},
	
	selectRecordEvent: function(recno, selected) {
		return {eventType: jslet.data.RefreshEvent.SELECTRECORD, recno: recno, selected: selected};
	},
	
	selectAllEvent: function(selected) {
		return {eventType: jslet.data.RefreshEvent.SELECTALL, selected: selected};
	},
	
	changePageEvent: function() {
		return this._changePageEvent;
	},
	
	errorEvent: function(errMessage) {
		return {eventType: jslet.data.RefreshEvent.ERROR, message: errMessage};
	},
	
	lookupEvent: function(fieldName, recno) {
		return {eventType: jslet.data.RefreshEvent.UPDATELOOKUP, fieldName: fieldName, recno: recno};
	},
	
	aggradedEvent: function() {
		return {eventType: jslet.data.RefreshEvent.AGGRADED};		
	}
};

jslet.data.RefreshEvent.CHANGEMETA = 'changeMeta';// fieldname, metatype(title, readonly,disabled,format)
jslet.data.RefreshEvent.UPDATEALL = 'updateAll';
jslet.data.RefreshEvent.UPDATERECORD = 'updateRecord';// fieldname
jslet.data.RefreshEvent.UPDATECOLUMN = 'updateColumn';// fieldname
jslet.data.RefreshEvent.BEFORESCROLL = 'beforescroll';
jslet.data.RefreshEvent.SCROLL = 'scroll';// preRecno, recno

jslet.data.RefreshEvent.SELECTRECORD = 'selectRecord';//
jslet.data.RefreshEvent.SELECTALL = 'selectAll';//
jslet.data.RefreshEvent.INSERT = 'insert';
jslet.data.RefreshEvent.DELETE = 'delete';// recno
jslet.data.RefreshEvent.CHANGEPAGE = 'changePage';
jslet.data.RefreshEvent.UPDATELOOKUP = 'updateLookup';
jslet.data.RefreshEvent.AGGRADED = 'aggraded';

jslet.data.RefreshEvent.ERROR = 'error';

jslet.data.RefreshEvent._updateAllEvent = {eventType: jslet.data.RefreshEvent.UPDATEALL};
jslet.data.RefreshEvent._changePageEvent = {eventType: jslet.data.RefreshEvent.CHANGEPAGE};

/**
 * Field Validator
 */
jslet.data.FieldValidator = function() {
};

jslet.data.FieldValidator.prototype = {
	
	intRegular: { expr: /^(-)?[1-9]*\d+$/ig},
	
	floatRegular: { expr: /((^-?[1-9])|\d)\d*(\.[0-9]*)?$/ig},

   /**
	 * Check the specified character is valid or not.
	 * Usually use this when user presses a key down.
	 * 
	 * @param {String} inputChar Single character
	 * @param {Boolean} True for passed, otherwise failed.
	 */
	checkInputChar: function (fldObj, inputChar, existText, cursorPos) {
		var validChars = fldObj.validChars();
		var valid = true;
		if (validChars && inputChar) {
			var c = inputChar.charAt(0);
			valid = validChars.indexOf(c) >= 0;
		}
		if(existText && valid && fldObj.getType() == jslet.data.DataType.NUMBER){
			var scale = fldObj.scale();
			var k = existText.lastIndexOf('.');
			if(inputChar == '.') {
				if(k >= 0) {
					return false;
				} else {
					return true;
				}
			}
			if(scale > 0 && k >= 0) {
				if(existText.length - k - 1 === scale && cursorPos - 1 > k) {
					return false;
				}
			}
			
		}
		return valid;
	},
	
	/**
	 * Check the specified text is valid or not
	 * Usually use this when a field loses focus.
	 * 
	 * @param {jslet.data.Field} fldObj Field Object
	 * @param {String} inputText Input text, it is original text that user inputed. 
	 * @return {String} If input text is valid, return null, otherwise return error message.
	 */
	checkInputText: function (fldObj, inputText) {
		var result = this.checkRequired(fldObj, inputText);
		if(result) {
			return result;
		}
		if(inputText === "") {
			return null;
		}
		var fldType = fldObj.getType();
		
		//Check with regular expression
		var regular = fldObj.regularExpr();
		if (!regular) {
			if (fldType == jslet.data.DataType.DATE) {
				regular = fldObj.dateRegular();
			} else {
				if (fldType == jslet.data.DataType.NUMBER) {
					if (!this.intRegular.message) {
						this.intRegular.message = jslet.locale.Dataset.invalidInt;
						this.floatRegular.message = jslet.locale.Dataset.invalidFloat;
					}
					if (!fldObj.scale()) {
						regular = this.intRegular;
					} else {
						regular = this.floatRegular;
					}
				}
			}
		}
		
		if (regular) {
			var regExpObj = regular.expr;
			if (typeof regExpObj == 'string') {
				regExpObj = new RegExp(regular.expr, 'ig');
			}
			regExpObj.lastIndex = 0;
			if (!regExpObj.test(inputText)) {
				return regular.message;
			}
		}
		
		var value = inputText;
		if (!fldObj.lookup()) {//Not lookup field
			if (fldType == jslet.data.DataType.NUMBER) {
				var scale = fldObj.scale() || 0;
				var length = fldObj.length();
				if (scale === 0) {
					value = parseInt(inputText);
				} else {
					var k = inputText.indexOf('.');
					var actual = k > 0? k: inputText.length,
						expected = length - scale;
					if(actual > expected) {
						return jslet.formatString(jslet.locale.Dataset.invalidIntegerPart, [expected, actual]);
					}
					actual = k > 0 ? inputText.length - k - 1: 0;
					if(actual > scale) {
						return jslet.formatString(jslet.locale.Dataset.invalidDecimalPart, [scale, actual]);
					}
					value = parseFloat(inputText);
				}
			}
			if (fldType == jslet.data.DataType.DATE) {// Date convert
				value = jslet.parseDate(inputText, fldObj.displayFormat());
			}
		}
		
		return this.checkValue(fldObj, value);
	},

	/**
	 * Check the required field's value is empty or not
	 * 
	 * @param {jslet.data.Field} fldObj Field Object
	 * @param {Object} value field value.
	 * @return {String} If input text is valid, return null, otherwise return error message.
	 */
	checkRequired: function(fldObj, value) {
		if (fldObj.required()) {
			var valid = true;
			if (value === null || value === undefined) {
				valid = false;
			}
			if(valid && jslet.isString(value) && jQuery.trim(value).length === 0) {
				valid = false;
			}
			if(valid && jslet.isArray(value) && value.length === 0) {
				valid = false;
			}
			if(fldObj.getType() === jslet.data.DataType.BOOLEAN && !value) {
				valid = false;
			}
			if(!valid) {
				return jslet.formatString(jslet.locale.Dataset.fieldValueRequired, [fldObj.label()]);
			} else {
				return null;
			}
		}
		return null;
	},
	
	/**
	 * Check the specified field value is valid or not
	 * It will check required, range and custom validation
	 * 
	 * @param {jslet.data.Field} fldObj Field Object
	 * @param {Object} value field value. 
	 * @return {String} If input text is valid, return null, otherwise return error message.
	 */
	checkValue: function(fldObj, value) {
		var fldType = fldObj.getType();
		//Check range
		var fldRange = fldObj.dataRange(),
			hasLookup = fldObj.lookup()? true: false;
		
		if (hasLookup) {//lookup field need compare code value of the Lookup
			value = fldObj.dataset().getFieldText(fldObj.name(), true);
		}
			
		if (fldRange) {
			var min = fldRange.min,
				strMin = min,
				max = fldRange.max,
				strMax = max;
			var fmt = fldObj.displayFormat();
			
			if (fldType == jslet.data.DataType.DATE) {
				if (min) {
					strMin = jslet.formatDate(min, fmt);
				}
				if (max) {
					strMax = jslet.formatDate(max, fmt);
				}
			}
			
			if (!hasLookup && fldType == jslet.data.DataType.NUMBER) {
				strMin = jslet.formatNumber(min, fmt);
				strMax = jslet.formatNumber(max, fmt);
			}
			
			if (min !== undefined && max !== undefined && (value < min || value > max)) {
				return jslet.formatString(jslet.locale.Dataset.notInRange, [strMin, strMax]);
			}
			if (min !== undefined && max === undefined && value < min) {
				return jslet.formatString(jslet.locale.Dataset.moreThanValue, [strMin]);
			}
			if (min === undefined && max !== undefined && value > max) {
				return jslet.formatString(jslet.locale.Dataset.lessThanValue, [strMax]);
			}
		}
		
		//Check unique in local data, if need check at server side, use 'customValidator' instead.
		if(fldObj.unique()) {
			var currDs = fldObj.dataset(),
				dataList = currDs.dataList();
			
			if(value !== null && value !== undefined && dataList && dataList.length > 1) {
				var currRec = currDs.getRecord(), 
					fldName = fldObj.name(),
					rec;
				for(var i = 0, len = dataList.length; i < len; i++) {
					rec = dataList[i];
					if(rec === currRec) {
						continue;
					}
					if(rec[fldName] == value) {
						return jslet.locale.Dataset.notUnique;
					}
				}
			}
		}
		//Customized validation
		if (fldObj.customValidator()) {
			return fldObj.customValidator().call(fldObj.dataset(), fldObj, value);
		}
		
		return null;
	}
};

/*Start of field value converter*/
jslet.data.FieldValueConverter = jslet.Class.create({
	className: 'jslet.data.FieldValueConverter',
	
	textToValue: function(fldObj, inputText) {
		var value = inputText;
		return value;
	},
	
	valueToText: function(fldObj, value, isEditing) {
		var text = value;
		return text;
	}
});
jslet.data.FieldValueConverter.className = 'jslet.data.FieldValueConverter';

jslet.data.NumberValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		var value = null;
		if (inputText) {
			if (fldObj.scale() === 0) {
				value = parseInt(inputText);
			} else {
				value = parseFloat(inputText);
			}
		}
		return value;
	},

	valueToText: function(fldObj, value, isEditing) {
		var Z = this;
		if (fldObj.unitConverted()) {
			value = value * Z._unitConvertFactor;
		}

		if (!isEditing) {
			var rtnText = jslet.formatNumber(value, fldObj.displayFormat());
			if (fldObj.unitConverted() && Z._unitName) {
				rtnText += Z._unitName;
			}
			return rtnText;
		} else {
			return value;
		}
	}
});

jslet.data.DateValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		var value = jslet.parseDate(inputText, fldObj.displayFormat());
		return value; 
	},
	
	valueToText: function(fldObj, value, isEditing) {
		if (!(value instanceof Date)) {
			throw new Error(jslet.formatString(jslet.locale.Dataset.invalidDateFieldValue, [fldObj.name()]));
		}

		return value ? jslet.formatDate(value, fldObj.displayFormat()): '';
	}
});

jslet.data.StringValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		var value = inputText;
		if (fldObj.antiXss()) {
			value = jslet.htmlEncode(value);
		}
		return value;
	}
});

jslet.data.BooleanValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText) {
		if(!inputText) {
			return false;
		}
		return inputText.toLowerCase() == 'true';
	},
	
	valueToText: function(fldObj, value, isEditing) {
		return value ? fldObj.trueText(): fldObj.falseText();
	}
});

jslet.data.LookupValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText, valueIndex) {
		if(!inputText) {
			return null;
		}
		var value = '',
			lkFldObj = fldObj.lookup(),
			lkDs = lkFldObj.dataset();
		
		value = lkDs._convertFieldValue(
				lkFldObj.codeField(), inputText, lkFldObj.keyField());
		if (value === null) {
			var invalidMsg = jslet.formatString(jslet.locale.Dataset.valueNotFound);
			fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, valueIndex, inputText);
			lkDs.first();
			return undefined;
		}
		if(fldObj.valueStyle() === jslet.data.FieldValueStyle.NORMAL) {
			var fieldMap = lkFldObj.returnFieldMap(),
				lookupDs = lkFldObj.dataset();
			mainDs = this;
			if(lookupDs.findByKey(value)) {
				var fldName, lkFldName;
				for(var fldName in fieldMap) {
					lkFldName = fieldMap[fldName];
					mainDs.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
				}
			}
		}
		return value;
	},
	
	valueToText: function(fldObj, value, isEditing) {
		var lkFldObj = fldObj.lookup(),
			lkds = lkFldObj.dataset(),
			result;
		if (!isEditing) {
			result = lkds._convertFieldValue(lkFldObj.keyField(), value,
					lkFldObj.displayFields());
		} else {
			result = lkds._convertFieldValue(lkFldObj.keyField(), value, 
					'[' + lkFldObj.codeField() + ']');
		}
		return result;
	}
});

jslet.data._valueConverters = {};
jslet.data._valueConverters[jslet.data.DataType.NUMBER] = new jslet.data.NumberValueConverter();
jslet.data._valueConverters[jslet.data.DataType.STRING] = new jslet.data.StringValueConverter();
jslet.data._valueConverters[jslet.data.DataType.DATE] = new jslet.data.DateValueConverter();
jslet.data._valueConverters[jslet.data.DataType.BOOLEAN] = new jslet.data.BooleanValueConverter();

jslet.data._valueConverters.lookup = new jslet.data.LookupValueConverter();

/**
 * Get appropriate field value converter.
 * 
 * @param {jslet.data.Field} fldObj field object.
 * 
 * @return {jslet.data.FieldValueConverter} field value converter;
 */
jslet.data.getValueConverter = function(fldObj) {
	if(fldObj.lookup()) {
		return jslet.data._valueConverters.lookup;
	}
	
	return jslet.data._valueConverters[fldObj.getType()];
};
/* End of field value converter */

/**
 * Convert dataset record to json.
 * 
 * @param {Array of Object} records Dataset records, required.
 * @param {Array of String} excludeFields Excluded field names,optional.
 * 
 * @return {String} Json String. 
 */
jslet.data.record2Json = function(records, excludeFields) {
	if(!window.JSON || !JSON) {
		alert('Your browser does not support JSON!');
		return;
	}
	if(excludeFields) {
		jslet.Checker.test('record2Json#excludeFields', excludeFields).isArray();		
	}
	
	function record2JsonFilter(key, value) {
		if(key == '_jl_') {
			return undefined;
		}
		if(excludeFields) {
			var fldName;
			for(var i = 0, len = excludeFields.length; i < len; i++) {
				fldName = excludeFields[i];
				if(key == fldName) {
					return undefined;
				}
			}
		}
		return value;		
	}
	
	return JSON.stringify(records, record2JsonFilter);
};

jslet.data.getRecInfo = function(record) {
	if(!record) {
		return null;
	}
	var recInfo = record._jl_;
	if(!recInfo) {
		recInfo = {};
		record._jl_ = recInfo;
	}
	return recInfo;
}

/*Field value cache manager*/
jslet.data.FieldValueCache = {
	
	put: function(record, fieldName, value, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
			cacheObj = recInfo.cache;
		if(!cacheObj) {
			cacheObj = {};
			record._jl_.cache = cacheObj;
		}
		if(valueIndex || valueIndex === 0) {
			var fldCacheObj = cacheObj[fieldName];
			if(!fldCacheObj || !jslet.isObject(fldCacheObj)){
				fldCacheObj = {};
				cacheObj[fieldName] = fldCacheObj;
			}
			fldCacheObj[valueIndex+""] = value;
		} else {
			cacheObj[fieldName] = value;
		}
	},
	
	get: function(record, fieldName, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
			cacheObj = recInfo.cache;
		if(cacheObj) {
			if(valueIndex || valueIndex === 0) {
				var fldCacheObj = cacheObj[fieldName];
				if(fldCacheObj && jslet.isObject(fldCacheObj)){
					return fldCacheObj[valueIndex+""];
				}
				return undefined;
			} else {
				return cacheObj[fieldName];
			}
		} else {
			return undefined;
		}
	},
	
	clear: function(record, fieldName) {
		var recInfo = jslet.data.getRecInfo(record), 
			cacheObj = recInfo.cache;
		if(cacheObj) {
			delete cacheObj[fieldName];
		}
	},
	
	clearAll: function(dataset, fieldName) {
		var dataList = dataset.dataList();
		if(!dataList) {
			return;
		}
		var rec, cacheObj, recInfo;
		for(var i = 0, len = dataList.length; i < len; i++) {
			rec = dataList[i];
			var recInfo = jslet.data.getRecInfo(rec), 
				cacheObj = recInfo.cache;
			if(cacheObj) {
				delete cacheObj[fieldName];
			}
		}
	},
	
	removeCache: function(record) {
		var recInfo = jslet.data.getRecInfo(record);
		delete recInfo['cache'];
	},
	
	removeAllCache: function(dataset) {
		var dataList = dataset.dataList();
		if(!dataList) {
			return;
		}
		var rec, cacheObj, recInfo;
		for(var i = 0, len = dataList.length; i < len; i++) {
			rec = dataList[i];
			if(!rec) {
				continue;
			}
			recInfo = jslet.data.getRecInfo(rec); 
			delete recInfo['cache'];
		}
	}
};
/*End of field value cache manager*/

/*Field value cache manager*/
jslet.data.FieldError = {
	
	put: function(record, fldName, errorMsg, valueIndex, inputText) {
		if(!errorMsg) {
			jslet.data.FieldError.clear(record, fldName, valueIndex);
			return;
		}
		var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
		if(!errObj) {
			errObj = {};
			recInfo.error = errObj;
		}
		var fldErrObj = errObj[fldName];
		if(!fldErrObj) {
			fldErrObj = {};
			errObj[fldName] = fldErrObj;
		}
		var errMsgObj = {message: errorMsg};
		if(inputText !== undefined) {
			errMsgObj.inputText = inputText;
		}
		if(!valueIndex) {
			valueIndex = 0;
		}
		fldErrObj[valueIndex+""] = errMsgObj;
	},
	
	putDetailError: function(record, fldName, errorCount) {
		var recInfo = jslet.data.getRecInfo(record), 
		errObj = recInfo.error;
		if(!errObj) {
			errObj = {};
			recInfo.error = errObj;
		}
		var fldErrObj = errObj[fldName];
		if(!fldErrObj) {
			fldErrObj = {};
			errObj[fldName] = fldErrObj;
		}
		if(!valueIndex) {
			valueIndex = 0;
		}
		var errMsgObj = fldErrObj[valueIndex+""];
		if(!errMsgObj) {
			errMsgObj = {errorCount: 0};
			fldErrObj[valueIndex+""] = errMsgObj;
		}
		errMsgObj.errorCount += errorCount;
		if(errMsgObj.errorCount <= 0) {
			jslet.data.FieldError.clear(record, fldName);
		}
		
	},
	
	get: function(record, fldName, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
		if(errObj) {
			var fldErrObj = errObj[fldName];
			if(!fldErrObj) {
				return null;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			return fldErrObj[valueIndex+""];
		} else {
			return null;
		}
	},
	
	clear: function(record, fldName, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
		if(errObj) {
			var fldErrObj = errObj[fldName];
			if(!fldErrObj) {
				return;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			delete fldErrObj[valueIndex+""];
			var found = false;
			for(var idx in fldErrObj) {
				foutnd = true;
				break;
			}
			if(!found) {
				delete errObj[fldName];
			} 
		}
	},
	
	existFieldError: function(record, fldName, valueIndex) {
		var recInfo = jslet.data.getRecInfo(record), 
		errObj = recInfo.error;
		if(errObj) {
			var fldErrObj = errObj[fldName];
			if(!fldErrObj){
				return false;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			return fldErrObj[valueIndex+""] ? true: false;
		}
		return false;
	},
	
	existRecordError: function(record) {
		var recInfo = jslet.data.getRecInfo(record);
		if(!recInfo) {
			return false;
		}
		var errObj = recInfo.error;
		if(errObj) {
			for(var fldName in errObj) {
				if(errObj[fldName]) {
					return true;
				}
			}
		}
		return false;
	},
	
	clearFieldError: function(dataset, fldName) {
		var dataList = dataset.dataList();
		if(!dataList) {
			return;
		}
		var rec, errObj, recInfo;
		for(var i = 0, len = dataList.length; i < len; i++) {
			rec = dataList[i];
			var recInfo = jslet.data.getRecInfo(rec), 
				errObj = recInfo.error;
			if(errObj) {
				delete errObj[fldName];
			}
		}
	},
	
	clearRecordError: function(record) {
		var recInfo = jslet.data.getRecInfo(record);
		if(recInfo) {
			delete recInfo['error'];
		}
	},
	
	clearDatasetError: function(dataset) {
		var dataList = dataset.dataList();
		if(!dataList) {
			return;
		}
		var rec, errObj, recInfo;
		for(var i = 0, len = dataList.length; i < len; i++) {
			rec = dataList[i];
			recInfo = jslet.data.getRecInfo(rec); 
			delete recInfo['error'];
		}
	}
};
/*End of field value error manager*/

jslet.data.DatasetRelationManager = function() {
	var relations= [];
	
	/**
	 * Add dataset relation.
	 * 
	 * @param {String} hostDsName host dataset name;
	 * @param {String} hostFldName field name of host dataset;
	 * @param {String} lookupOrDetailDsName lookup or detail dataset name;
	 * @param {jslet.data.DatasetType} relationType, optional value: jslet.data.DatasetType.LOOKUP, jslet.data.DatasetType.DETAIL
	 */
	this.addRelation = function(hostDsName, hostFldName, lookupOrDetailDsName, relationType) {
		for(var i = 0, len = relations.length; i < len; i++) {
			var relation = relations[i];
			if(relation.hostDataset == hostDsName && 
				relation.hostField == hostFldName && 
				relation.lookupDataset == lookupOrDetailDsName) {
				return;
			}
		}
		relations.push({hostDataset: hostDsName, hostField: hostFldName, lookupOrDetailDataset: lookupOrDetailDsName, relationType: relationType});
		//If reation type is DETAIL, set 'datasetField' property of detail dataset.
		if(relationType == jslet.data.DatasetType.DETAIL) {
			var detailDs = jslet.data.getDataset(lookupOrDetailDsName);
			if(detailDs) {
				var fldObj = this.getHostFieldObject(lookupOrDetailDsName);
				if(fldObj) {
					detailDs.datasetField(fldObj);
				}
			}
		}
	};
	
	this.removeRelation = function(hostDsName, hostFldName, lookupOrDetailDsName) {
		for(var i = relations.length - 1; i >= 0; i--) {
			var relation = relations[i];
			if(relation.hostDataset == hostDsName && 
				relation.hostField == hostFldName && 
				relation.lookupOrDetailDataset == lookupOrDetailDsName) {
				relations.splice(i,1);
			}
		}
	};
	
	this.removeDataset = function(datasetName) {
		for(var i = relations.length - 1; i >= 0; i--) {
			var relation = relations[i];
			if(relation.hostDataset == datasetName || relation.lookupOrDetailDataset == datasetName) {
				relations.splice(i,1);
			}
		}
	};
	
	this.changeDatasetName = function(oldName, newName) {
		if(!oldName || !newName) {
			return;
		}
		for(var i = 0, len = relations.length; i < len; i++) {
			var relation = relations[i];
			if(relation.hostDataset == oldName) {
				relation.hostDataset = newName;
			}
			if(relation.lookupOrDetailDataset == oldName) {
				relation.lookupOrDetailDataset = newName;
			}
		}
	};
	
	this.refreshLookupHostDataset = function(lookupDsName) {
		var relation, hostDataset;
		for(var i = 0, len = relations.length; i < len; i++) {
			relation = relations[i];
			if(relation.lookupOrDetailDataset == lookupDsName &&
				relation.relationType == jslet.data.DatasetType.LOOKUP) {
				hostDataset = jslet.data.getDataset(relation.hostDataset);
				if(hostDataset) {
					hostDataset.handleLookupDatasetChanged(relation.hostField);
				} else {
					throw new Error('NOT found Host dataset: ' + relation.hostDataset);
				}
			}
		}
	};
	
	this.getHostFieldObject = function(lookupOrDetailDsName) {
		var relation, hostDataset;
		for(var i = 0, len = relations.length; i < len; i++) {
			relation = relations[i];
			if(relation.lookupOrDetailDataset == lookupOrDetailDsName &&
				relation.relationType == jslet.data.DatasetType.DETAIL) {
				hostDataset = jslet.data.getDataset(relation.hostDataset);
				if(hostDataset) {
					return hostDataset.getField(relation.hostField);
				} else {
					throw new Error('NOT found Host dataset: ' + relation.hostDataset);
				}
			}
		} //end for i	
	}
};
jslet.data.datasetRelationManager = new jslet.data.DatasetRelationManager();

jslet.data.convertDateFieldValue = function(dataset, records) {
	var Z = dataset;
	if(!records) {
		records = Z.dataList();
	}
	if (!records || records.length === 0) {
		return;
	}

	var dateFlds = [], subFlds = [],
		fields = Z.getNormalFields(),
		fldObj;
	for (var i = 0, len = fields.length; i < len; i++) {
		fldObj = fields[i];
		if (fldObj.getType() == jslet.data.DataType.DATE) {
			dateFlds.push(fldObj.name());
		}
		if (fldObj.getType() == jslet.data.DataType.DATASET) {
			subFlds.push(fldObj);
		}
	}
	if (dateFlds.length === 0 && subFlds.length === 0) {
		return;
	}

	var rec, fname, value,
		fcnt = dateFlds.length,
		subCnt = subFlds.length;
	for (var i = 0, recCnt = records.length; i < recCnt; i++) {
		rec = records[i];
		for (var j = 0; j < fcnt; j++) {
			fname = dateFlds[j];
			value = rec[fname];
			if (!jslet.isDate(value)) {
				value = jslet.parseDate(value,'yyyy-MM-ddThh:mm:ss');
				if (value) {
					rec[fname] = value;
				} else {
					throw new Error(jslet.formatString(jslet.locale.Dataset.invalidDateFieldValue,[fldName]));
				}
			} //end if
		} //end for j
		for(var j = 0; j < subCnt; j++) {
			fldObj = subFlds[j];
			fname = fldObj.name();
			jslet.data.convertDateFieldValue(fldObj.subDataset(), rec[fname]);
		}
	} //end for i
	
}

jslet.emptyPromise = {
	done: function(callBackFn) {
		if(callBackFn) {
			callBackFn();
		}
		return this;
	},
	
	fail: function(callBackFn) {
		if(callBackFn) {
			callBackFn();
		}
		return this;
	},
	
	always: function(callBackFn) {
		if(callBackFn) {
			callBackFn();
		}
		return this;
	}
}

jslet.data.displayOrderComparator = function(fldObj1, fldObj2) {
	return fldObj1.displayOrder() - fldObj2.displayOrder();
}

/**
 * Data selection class.
 */
jslet.data.DataSelection = function(dataset) {
	this._dataset = dataset;
	this._selection = [];
	this._onChanged;
}

jslet.data.DataSelection.prototype = {
	/**
	 * Select all data.
	 * 
	 * @param {String[]} fields An array of field name to be selected.
	 * @param {Boolean} fireEvent Identify firing event or not.
	 */
	selectAll: function(fields, fireEvent) {
		jslet.Checker.test('DataSelection.add#fields', fields).isArray();
		this.removeAll();
		if(!fields) {
			var arrFldObj = this._dataset.getNormalFields(), fldName;
			fields = [];
			for(var i = 0, len = arrFldObj.length; i < len; i++) {
				fldName = arrFldObj[i].name();
				fields.push(fldName);
			}
		}
		this.add(0, this._dataset.recordCount() - 1, fields, fireEvent)
	},
	
	/**
	 * Remove all selected data.
	 */
	removeAll: function() {
		this._selection = [];
	},
	
	/**
	 * Add data into selection.
	 * 
	 * @param {Integer} startRecno The start recno to be selected.
	 * @param {Integer} endRecno The end recno to be selected.
	 * @param {String[]} fields An array of field name to be selected.
	 * @param {Boolean} fireEvent Identify firing event or not.
	 */
	add: function(startRecno, endRecno, fields, fireEvent) {
		jslet.Checker.test('DataSelection.add#startRecno', startRecno).required().isNumber();
		jslet.Checker.test('DataSelection.add#endRecno', endRecno).required().isNumber();
		jslet.Checker.test('DataSelection.add#fields', fields).required().isArray();

		if(endRecno === undefined) {
			endRecno = startRecno;
		}
		var fldName;
		for(var recno = startRecno; recno <= endRecno; recno++) {
			for(var i = 0, len = fields.length; i < len; i++) {
				fldName = fields[i];
				this._selectCell(recno, fldName, true);
			}
		}
		if(fireEvent && this._onChanged) {
			this._onChanged(startRecno, endRecno, fields, true);
		}
	},

	/**
	 * Unselect data.
	 * 
	 * @param {Integer} startRecno The start recno to be unselected.
	 * @param {Integer} endRecno The end recno to be selected.
	 * @param {String[]} fields An array of field name to be unselected.
	 * @param {Boolean} fireEvent Identify firing event or not.
	 */
	remove: function(startRecno, endRecno, fields, fireEvent) {
		jslet.Checker.test('DataSelection.remove#startRecno', startRecno).required().isNumber();
		jslet.Checker.test('DataSelection.remove#endRecno', endRecno).required().isNumber();
		jslet.Checker.test('DataSelection.remove#fields', fields).required().isArray();

		if(endRecno === undefined) {
			endRecno = startRecno;
		}
		if(startRecno > endRecno) {
			var tmp = startRecno;
			startRecno = endRecno;
			endRecno = tmp;
		}
		var fldName;
		for(var recno = startRecno; recno <= endRecno; recno++) {
			for(var i = 0, len = fields.length; i < len; i++) {
				fldName = fields[i];
				this._selectCell(recno, fldName, false);
			}
		}
		if(fireEvent && this._onChanged) {
			this._onChanged(startRecno, endRecno, fields, false);
		}
	},

	/**
	 * Fired when the selection area is changed.
	 * 
	 * @param {Function} onChanged The event handler, format:
	 * 	function(startRecno, endRecno, fields, selected) {
	 * 		//startRecno - Integer, start recno;
	 * 		//endRecno - Integer, end recno;
	 * 		//fields - String[], field names;
	 * 		//selected - Boolean, selected or not;	
	 * 	}
	 * 	
	 */
	onChanged: function(onChanged) {
		if(onChanged === undefined) {
			return this._onChanged;
		}
		jslet.Checker.test('DataSelection.onChanged', onChanged).isFunction();
		this._onChanged = onChanged;
	},
	
	/**
	 * Check the specified cell is selected or not.
	 * 
	 * @param {Integer} recno Record no.
	 * @param {String} fldName Field name.
	 * 
	 * @return {Boolean}
	 */
	isSelected: function(recno, fldName) {
		jslet.Checker.test('DataSelection.isSelected#recno', recno).required().isNumber();
		jslet.Checker.test('DataSelection.isSelected#fldName', fldName).required().isString();
		var selObj;
		for(var i = 0, len = this._selection.length; i < len; i++) {
			selObj = this._selection[i];
			if(selObj._recno_ === recno && selObj[fldName]) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * Get selected text.
	 * 
	 * @param {String} seperator Seperator for fields.
	 * 
	 * @return {String}
	 */
	getSelectionText: function(seperator) {
		if(!seperator) {
			seperator = '\t';
		}
		var dataset = this._dataset,
			result = [], 
			context = dataset.startSilenceMove(),
			fields = dataset.getNormalFields(),
			fldCnt = fields.length,
			fldName, textRec = '', fldObj, text;
		try {
			dataset.first();
			while(!dataset.isEof()) { 
				for(var i = 0; i < fldCnt; i++) {
					fldObj = fields[i];
					fldName = fldObj.name();
					if(this.isSelected(dataset.recno(), fldName)) {
						//If Number field does not have lookup field, return field value, not field text. 
						//Example: 'amount' field
						if(fldObj.getType() === 'N' && !fldObj.lookup()) {
							text = fldObj.getValue();
						} else {
							text = dataset.getFieldText(fldName);
							if(text === null || text === undefined) {
								text = '';
							}
						}
						textRec += text + seperator; 
					}
				}
				if(textRec) {
					result.push(textRec);
				}
				textRec = '';
				dataset.next(); 
			} 
		} finally { 
			dataset.endSilenceMove(context); 
		}
		if(result.length > 0) {
			return result.join('\n');
		} else {
			return null;
		}
	},
	
	_selectCell: function(recno, fldName, selected) {
		var selObj
			found = false;
		for(var i = 0, len = this._selection.length; i < len; i++) {
			selObj = this._selection[i];
			if(selObj._recno_ === recno) {
				found = true;
				selObj[fldName] = selected;
			}
		}
		if(selected && !found) {
			selObj = {_recno_: recno};
			selObj[fldName] = true;
			this._selection.push(selObj);
		}
	}
}

jslet.data.GlobalDataHandler = function() {
	var Z = this;
	Z._datasetMetaChanged = null;
	Z._fieldMetaChanged = null;
	Z._fieldValueChanged = null;
}

jslet.data.GlobalDataHandler.prototype = {
		
	/**
	 * Fired when dataset created.
	 *  Pattern: 
	 *	function(dataset}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  
	 * @param {Function or undefined} datasetCreated dataset created event handler.
	 * @return {this or Function}
	 */
	datasetCreated: function(datasetCreated) {
		var Z = this;
		if(datasetCreated === undefined) {
			return Z._datasetCreated;
		}
		jslet.Checker.test('globalDataHandler.datasetCreated', datasetCreated).isFunction();
		Z._datasetCreated = datasetCreated;
	},
	
	/**
	 * Fired when dataset meta is changed.
	 *  Pattern: 
	 *	function(dataset, metaName}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  	//metaName: {String} dataset's meta name
	 *  
	 * @param {Function or undefined} datasetMetaChanged dataset meta changed event handler.
	 * @return {this or Function}
	 */
	datasetMetaChanged: function(datasetMetaChanged) {
		var Z = this;
		if(datasetMetaChanged === undefined) {
			return Z._datasetMetaChanged;
		}
		jslet.Checker.test('globalDataHandler.datasetMetaChanged', datasetMetaChanged).isFunction();
		Z._datasetMetaChanged = datasetMetaChanged;
	},
	
	/**
	 * Fired when field meta is changed.
	 *  Pattern: 
	 *	function(dataset, fieldName, metaName}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  	//fieldName: {String} field name
	 *  	//metaName: {String} dataset's meta name
	 *  
	 * @param {Function or undefined} fieldMetaChanged dataset meta changed event handler.
	 * @return {this or Function}
	 */
	fieldMetaChanged: function(fieldMetaChanged) {
		var Z = this;
		if(fieldMetaChanged === undefined) {
			return Z._fieldMetaChanged;
		}
		jslet.Checker.test('globalDataHandler.fieldMetaChanged', fieldMetaChanged).isFunction();
		Z._fieldMetaChanged = fieldMetaChanged;
	},
	
	/**
	 * Fired when field value is changed.
	 *  Pattern: 
	 *	function(dataset, metaName}{}
	 *  	//dataset:{jslet.data.Dataset} Dataset Object
	 *  	//fieldName: {String} field name
	 *  	//fieldValue: {Object} field value
	 *  	//valueIndex: {Integer} value index
	 *  
	 * @param {Function or undefined} fieldValueChanged field value changed event handler.
	 * @return {this or Function}
	 */
	fieldValueChanged: function(fieldValueChanged) {
		var Z = this;
		if(fieldValueChanged === undefined) {
			return Z._fieldValueChanged;
		}
		jslet.Checker.test('globalDataHandler.fieldValueChanged', fieldValueChanged).isFunction();
		Z._fieldValueChanged = fieldValueChanged;
	}
	
}

jslet.data.globalDataHandler = new jslet.data.GlobalDataHandler();