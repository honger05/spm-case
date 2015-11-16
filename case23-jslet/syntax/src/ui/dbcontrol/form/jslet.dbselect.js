/* ========================================================================
 * Jslet framework: jslet.dbselect.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBSelect. Example:
 * <pre><code>
 * var jsletParam = {type:"DBSelect",dataset:"employee",field:"department"};
 * 
 * //1. Declaring:
 * &lt;select data-jslet='type:"DBSelect",dataset:"employee",field:"department"' />
 * or
 * &lt;select data-jslet='jsletParam' />
 *
 *  //2. Binding
 * &lt;select id="ctrlId"  />
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 * 
 * </code></pre>
 */
jslet.ui.DBSelect = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,groupField,lookupDataset';
		/**
		 * {String} Group field name, you can use this to group options.
		 * Detail to see html optgroup element.
		 */
		Z._groupField = null;
		
		/**
		 * {String or jslet.data.Dataset} It will use this dataset to render Select Options.
		 */
		Z._lookupDataset = null;
		
		Z._enableInvalidTip = true;
		
		Z._innerEditFilterExpr;
		$super(el, params);
	},

	groupField: function(groupField) {
		if(groupField === undefined) {
			return this._groupField;
		}
		groupField = jQuery.trim(groupField);
		jslet.Checker.test('DBSelect.groupField', groupField).isString();
		this._groupField = groupField;
	},
	
	lookupDataset: function(lookupDataset) {
		if(lookupDataset === undefined) {
			return this._lookupDataset;
		}

		if (jslet.isString(lookupDataset)) {
			lookupDataset = jslet.data.dataModule.get(jQuery.trim(lookupDataset));
		}
		
		jslet.Checker.test('DBSelect.lookupDataset', lookupDataset).isClass(jslet.data.Dataset.className);
		this._lookupDataset = lookupDataset;
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return (el.tagName.toLowerCase() == 'select');
	},

	/**
	 * @override
	 */
	bind: function () {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			valueStyle = fldObj.valueStyle();
		
		if(Z.el.multiple && valueStyle != jslet.data.FieldValueStyle.MULTIPLE) {
			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
		} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && !Z.el.multiple) {
			Z.el.multiple = "multiple";	
		}
		Z.renderAll();

		var jqEl = jQuery(Z.el);
		jqEl.on('change', Z._doChanged);
		jqEl.on('mousedown', Z._doMouseDown);
		jqEl.focus(function(event) {
			jqEl.trigger('editing', [Z._field]);
		});
		if(Z.el.multiple) {
			jqEl.on('click', 'option', Z._doCheckLimitCount);
		}
		jqEl.addClass('form-control');//Bootstrap class
		Z.doMetaChanged('required');
	}, // end bind

	_doMouseDown: function(event) {
		var Z = this.jslet,
			ctrlRecno = Z.ctrlRecno();
		if(ctrlRecno >= 0 && ctrlRecno != Z._dataset.recno()) {
			Z._skipRefresh = true;
			try {
				Z._dataset.recno(ctrlRecno);
			} finally {
				Z._skipRefresh = false;
			}
		}
	},
	
	_doChanged: function (event) {
		var Z = this.jslet;
		if(Z.el.multiple) {
			if(Z.inProcessing) {
				Z.inProcessing = false;
			}
			var fldObj = Z._dataset.getField(Z._field),
				limitCount = fldObj.valueCountLimit();

			if(limitCount) {
				var values = Z._dataset.getFieldValue(Z._field),
					count = 1;
				if(jslet.isArray(values)) {
					count = values.length;
				}
				if (count >= limitCount) {
					jslet.showInfo(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
							[''	+ limitCount]));
					
					window.setTimeout(function(){
						if(Z._currOption) {
							Z.inProcessing = true;
							Z._currOption.selected = false;
						}
					}, 10);
					return;
				}
			}
		}
		this.jslet.updateToDataset();
	},
	
	_doCheckLimitCount: function(event) {
		var Z = event.delegateTarget.jslet;
		Z._currOption = this;
	},

	_setDefaultValue: function(fldObj, firstItemValue) {
		if(!firstItemValue || !fldObj.required()) {
			return;
		}
		var dftValue = fldObj.defaultValue();
		if(dftValue) {
			var lkds = fldObj.lookup().dataset();
			var found = lkds.findByKey(dftValue);
			if(found) {
				return;
			} else {
				dftValue = null;
			}
		}
		
		if(!dftValue) {
			fldObj.defaultValue(firstItemValue);
		}
		if(this._dataset.changedStatus() && !fldObj.getValue()) {
			fldObj.setValue(firstItemValue);
		}
	},
	
	/**
	 * @override
	 */
	doLookupChanged: function () {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			lkf = fldObj.lookup();
		if(Z._lookupDataset) {
			lkf = new jslet.data.FieldLookup();
			lkf.dataset(Z._lookupDataset);
		} else {
			if (!lkf) {
				return;
			}
		}
		var lkds = lkf.dataset(),
			groupIsLookup = false,
			groupLookup, 
			groupFldObj, 
			extraIndex;

		if (Z._groupField) {
			groupFldObj = lkds.getField(Z._groupField);
			if (groupFldObj === null) {
				throw 'NOT found field: ' + Z._groupField + ' in ' + lkds.name();
			}
			groupLookup = groupFldObj.lookup();
			groupIsLookup = (groupLookup !== null);
			if (groupIsLookup) {
				extraIndex = Z._groupField + '.' + groupLookup.codeField();
			} else {
				extraIndex = Z._groupField;
			}
			var indfld = lkds.indexFields();
			if (indfld) {
				lkds.indexFields(extraIndex + ';' + indfld);
			} else {
				lkds.indexFields(extraIndex);
			}
		}
		var preGroupValue = null, groupValue, groupDisplayValue, content = [];

		if (!Z.el.multiple && !fldObj.required()){
			content.push('<option value="_null_">');
			content.push(fldObj.nullText());
			content.push('</option>');
		}
		var oldRecno = lkds.recno(),
			optValue, optDispValue, 
			firstItemValue = null,
			editFilter = lkf.editFilter();
		Z._innerEditFilterExpr = null;
		var editItemDisabled = lkf.editItemDisabled();
		if(editFilter) {
			Z._innerEditFilterExpr = new jslet.Expression(lkds, editFilter);
		}
		var disableOption = false;
		try {
			for (var i = 0, cnt = lkds.recordCount(); i < cnt; i++) {
				lkds.recnoSilence(i);
				disableOption = false;
				if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
					if(!editItemDisabled) {
						continue;
					} else {
						disableOption = true;
					}
				}
				if (Z._groupField) {
					groupValue = lkds.getFieldValue(Z._groupField);
					if (groupValue != preGroupValue) {
						if (preGroupValue !== null) {
							content.push('</optgroup>');
						}
						if (groupIsLookup) {
							if (!groupLookup.dataset()
											.findByField(
													groupLookup
															.keyField(),
													groupValue)) {
								throw 'Not found: [' + groupValue + '] in Dataset: [' +
									groupLookup.dataset().name() +
									']field: [' + groupLookup.keyField() + ']';
							}
							groupDisplayValue = groupLookup.getCurrentDisplayValue();
						} else
							groupDisplayValue = groupValue;

						content.push('<optgroup label="');
						content.push(groupDisplayValue);
						content.push('">');
						preGroupValue = groupValue;
					}
				}
				content.push('<option value="');
				optValue = lkds.getFieldValue(lkf.keyField());
				if(firstItemValue === null) {
					firstItemValue = optValue;
				}
				content.push(optValue);
				content.push('"'+ (disableOption? ' disabled': '') +  '>');
				content.push(lkf.getCurrentDisplayValue());
				content.push('</option>');
			} // end for
			if (preGroupValue !== null) {
				content.push('</optgroup>');
			}
			jQuery(Z.el).html(content.join(''));
			Z._setDefaultValue(fldObj, firstItemValue);
			Z.doValueChanged();
		} finally {
			lkds.recnoSilence(oldRecno);
		}
	}, // end renderOptions

	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			Z.el.disabled = disabled;
			jslet.ui.setEditableStyle(Z.el, disabled, disabled, true, fldObj.required());
		}
		if(metaName && metaName == 'required') {
			var jqEl = jQuery(Z.el);
			if (fldObj.required()) {
				jqEl.addClass('jl-ctrl-required');
			} else {
				jqEl.removeClass('jl-ctrl-required');
			}
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
	},
	
	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._skipRefresh) {
			return;
		}
		var errObj = Z.getFieldError();
		if(errObj && errObj.message) {
			Z.el.value = errObj.inputText;
			Z.renderInvalid(errObj);
			return;
		} else {
			Z.renderInvalid(null);
		}
		var value = Z.getValue();
		if(!Z.el.multiple && value === Z.el.value) {
			return;
		}
		var optCnt = Z.el.options.length, 
			opt, i;
		for (i = 0; i < optCnt; i++) {
			opt = Z.el.options[i];
			if (opt) {
				opt.selected = false;
			}
		}
		
		var fldObj = Z._dataset.getField(Z._field);
		if (!Z.el.multiple) {
			if(!Z._checkOptionEditable(fldObj, value)) {
				value = null;
			}
			if (value === null){
				if (!fldObj.required()) {
					value = '_null_';
				}
			}
			Z.el.value = value;
		} else {
			var arrValue = value;
			if(arrValue === null || arrValue.length === 0) {
				return;
			}
				
			var vcnt = arrValue.length - 1, selected;
			Z._skipRefresh = true;
			try {
				for (i = 0; i < optCnt; i++) {
					opt = Z.el.options[i];

					for (j = vcnt; j >= 0; j--) {
						selected = (arrValue[j] == opt.value);
						if (selected) {
							opt.selected = selected;
						}
					} // end for j
				} // end for i
			} finally {
				Z._skipRefresh = false;
			}
		}
	},
 
	_checkOptionEditable: function(fldObj, fldValue) {
		var Z = this;
		if(!Z._innerEditFilterExpr || fldValue === null || fldValue === undefined || fldValue === '') {
			return true;
		}
		var lkDs = fldObj.lookup().dataset(); 
		if(lkDs.findByKey(fldValue) && !Z._innerEditFilterExpr.eval()) {
			return false;
		} else {
			return true;
		}
	},
	
	focus: function() {
		this.el.focus();
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	},

	updateToDataset: function () {
		var Z = this;
		if (Z._skipRefresh) {
			return;
		}
		var opt, value,
			isMulti = Z.el.multiple;
		if (!isMulti) {
			value = Z.el.value;
			if (!value) {
				opt = Z.el.options[Z.el.selectedIndex];
				value = opt.innerHTML;
			}
		} else {
			var opts = jQuery(Z.el).find('option'),
				optCnt = opts.length - 1;
			value = [];
			for (var i = 0; i <= optCnt; i++) {
				opt = opts[i];
				if (opt.selected) {
					value.push(opt.value ? opt.value : opt.innerHTML);
				}
			}
		}

		Z._skipRefresh = true;
		try {
			if (!isMulti) {
				var fldObj = Z._dataset.getField(Z._field);
				if (value == '_null_' && !fldObj.required()) {
					value = null;
				}
				Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
				var lkfldObj = fldObj.lookup(),
					fieldMap = lkfldObj.returnFieldMap();
				if(fieldMap) {
					var lookupDs = lkfldObj.dataset();
						mainDs = Z._dataset;
					if(lookupDs.findByKey(value)) {
						var fldName, lkFldName;
						for(var fldName in fieldMap) {
							lkFldName = fieldMap[fldName];
							mainDs.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
						}
					}
				}				
			} else {
				Z._dataset.setFieldValue(Z._field, value);
			}
			
		} finally {
			Z._skipRefresh = false;
		}
	}, // end updateToDataset
	
	/**
	 * @override
	 */
	destroy: function($super){
		this._currOption = null;
		jQuery(this.el).off();
		$super();
	}
});

jslet.ui.register('DBSelect', jslet.ui.DBSelect);
jslet.ui.DBSelect.htmlTemplate = '<select></select>';
