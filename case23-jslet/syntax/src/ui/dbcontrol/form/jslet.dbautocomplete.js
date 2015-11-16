/* ========================================================================
 * Jslet framework: jslet.dbautocomplete.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBAutoComplete. Example:
 * <pre><code>
 * var jsletParam = {type:"DBAutoComplete",field:"department", matchType:"start"};
 * //1. Declaring:
 *      &lt;input id="cboAuto" type="text" data-jslet='jsletParam' />
 *      
 *  //2. Binding
 *      &lt;input id="cboAuto" type="text" data-jslet='jsletParam' />
 *      //Js snippet
 *      var el = document.getElementById('cboAuto');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *      jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBAutoComplete = jslet.Class.create(jslet.ui.DBText, {
	
	MatchModes: ['start','end', 'any'],
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		if (!Z.allProperties) {
			Z.allProperties = 'dataset,field,lookupField,minChars,minDelay,displayTemplate,matchMode,beforePopup,onGetFilterField,filterFields';
		}
		
		Z._lookupField = null;
		
		Z._minChars = 0;

		Z._minDelay = 0;
		
		Z._beforePopup = null;
		
		Z._filterFields = null;
		
		Z._defaultFilterFields = null;
		
		Z._onGetFilterField = null;
		
		Z._matchMode = 'start';
		
		Z._timeoutHandler = null; 
		$super(el, params);
	},

	/**
	 * Get or set lookup field name.
	 * 
	 * @Param {String} lookup field name.
	 * @return {this or String}
	 */
	lookupField: function(lookupField) {
		if(lookupField === undefined) {
			return this._lookupField;
		}
		jslet.Checker.test('DBAutoComplete.lookupField', lookupField).isString();
		this._lookupField = lookupField;
	},
   
	/**
	 * Get or set minimum characters before searching.
	 * 
	 * @Param {Integer} Minimum character before searching.
	 * @return {this or Integer}
	 */
	minChars: function(minChars) {
		if(minChars === undefined) {
			return this._minChars;
		}
		jslet.Checker.test('DBAutoComplete.minChars', minChars).isGTEZero();
		this._minChars = parseInt(minChars);
	},
   
	/**
	 * Get or set delay time(ms) before auto searching.
	 * 
	 * @param {Integer} minDelay Delay time.
	 * @return {this or Integer}
	 */
	minDelay: function(minDelay) {
		if(minDelay === undefined) {
			return this._minDelay;
		}
		jslet.Checker.test('DBAutoComplete.minDelay', minDelay).isGTEZero();
		this._minDelay = parseInt(minDelay);
	},
   
	/**
	 * Get or set delay time(ms) before auto searching.
	 * 
	 * @param {String} matchMode match mode,optional values: 'start', 'end', 'any', default: 'start'
	 * @return {this or String}
	 */
	matchMode: function(matchMode) {
		if(matchMode === undefined) {
			return this._matchMode;
		}
		matchMode = jQuery.trim(matchMode);
		var checker = jslet.Checker.test('DBAutoComplete.matchMode', matchMode).isString();
		matchMode = matchMode.toLowerCase();
		checker.testValue(matchMode).inArray(this.MatchModes);
		this._matchMode = matchMode;
	},
   
	/**
	 * {Function} Before pop up event handler, you can use this to customize the display result.
	 * Pattern: 
	 *   function(dataset, inputValue){}
	 *   //dataset: jslet.data.Dataset; 
	 *   //inputValue: String
	 */
	beforePopup: function(beforePopup) {
		if(beforePopup === undefined) {
			return this._beforePopup;
		}
		this._beforePopup = beforePopup;
	},
	
	/**
	 * Get or set filter fields, more than one fields are separated with ','.
	 * 
	 * @param {String} filterFields filter fields.
	 * @return {this or String}
	 */
	filterFields: function(filterFields) {
		if(filterFields === undefined) {
			return Z._filterFields;
		}
		jslet.Checker.test('DBAutoComplete.filterFields', filterFields).isString();
		Z._filterFields = filterFields;
	},
	
	/**
	 * {Function} Get filter field event handler, you can use this to customize the display result.
	 * Pattern: 
	 *   function(dataset, inputValue){}
	 *   //dataset: jslet.data.Dataset; 
	 *   //inputValue: String
	 *   //return: String Field name
	 */
	onGetFilterField: function(onGetFilterField) {
		if(onGetFilterField === undefined) {
			return this._onGetFilterField;
		}
		this._onGetFilterField = onGetFilterField;
	},
	
	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input' &&
			el.type.toLowerCase() == 'text';
	},

	/**
	 * @override
	 */
	doBlur: function () {
		var Z = this;
		if (Z.el.disabled || Z.el.readOnly) {
			return;
		}
		var	fldObj = Z._dataset.getField(Z._field);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		if (Z.contentPanel && Z.contentPanel.isShowing()) {
			window.setTimeout(function(){
				if(Z._isSelecting) {
					return;
				}
				var value = Z.el.value, canBlur = true;
				if(!Z._lookupField) {
					var fldObj = Z._dataset.getField(Z._field),
						lkf = fldObj.lookup(),
						lkds = lkf.dataset();
					if(value.length > 0 && lkds.recordCount() === 0) {
						canBlur = false;
					}
				}
				if (Z.contentPanel && Z.contentPanel.isShowing()) {
					Z.contentPanel.closePopup();
				}
				Z.updateToDataset();
				Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
				if(!canBlur) {
					Z.el.focus();
				}
			}, 200);
		} else {
			Z.updateToDataset();
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		}
	},

	/**
	 * @override
	 */
	doChange: null,

	/**
	 * @override
	 */
	doKeydown: function (event) {
		if (this.disabled || this.readOnly) {
			return;
		}
		event = jQuery.event.fix( event || window.event );

		var keyCode = event.which, Z = this.jslet;
		if(keyCode >= 112 && keyCode <= 123 || keyCode == 16 || keyCode == 17 || keyCode == 18 || //F1-F12, ctrl, shift, alt
				keyCode == 20 || keyCode == 45 || keyCode == 35 || keyCode == 36 || keyCode == 34 || keyCode == 33) { //CapsLock, Insert, Home, End, PageUp, PageDown 
			return;
		}
		if ((keyCode == 38 || keyCode == 40) && Z.contentPanel && Z.contentPanel.isPop) {
			var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
			lkf = fldObj.lookup(),
			lkds = lkf.dataset();
			if (keyCode == 38) { //up arrow
				lkds.prior();
				event.preventDefault();
	       		event.stopImmediatePropagation();
			}
			if (keyCode == 40) {//down arrow
				lkds.next();
				event.preventDefault();
	       		event.stopImmediatePropagation();
			}
			return;
		}

		if (keyCode == 8 || keyCode == 46 || keyCode == 229) {//delete/backspace/ime
			this.jslet._invokePopup();
			return;
		}
		if (keyCode != 13 && keyCode != 9) {
			Z._invokePopup();
		} else if (Z.contentPanel) {
			if(Z.contentPanel.isShowing()) {
				Z.contentPanel.confirmSelect();
			}
		}
	},

	/**
	 * @override
	 */
	doKeypress: function (event) {
		if (this.disabled || this.readOnly) {
			return;
		}
//		var keyCode = event.keyCode ? event.keyCode : 
//			event.which	? event.which: event.charCode;
//		var Z = this.jslet;
//		if (keyCode != 13 && keyCode != 9) {
//			Z._invokePopup();
//		} else if (Z.contentPanel) {
//			if(Z.contentPanel.isShowing()) {
//				Z.contentPanel.confirmSelect();
//			}
//		}
	},

	_invokePopup: function () {
		var Z = this;
		if (Z._timeoutHandler) {
			clearTimeout(Z._timeoutHandler);
		}
		var delayTime = 100;
		if (Z._minDelay) {
			delayTime = parseInt(Z._minDelay);
		}
		
		Z._timeoutHandler = setTimeout(function () {
			Z._populate(Z.el.value); 
		}, delayTime);
	},

	_getDefaultFilterFields: function(lookupFldObj) {
		var Z = this;
		if(Z._defaultFilterFields) {
			return Z._defaultFilterFields;
		}
		var codeFld = lookupFldObj.codeField(),
			nameFld = lookupFldObj.nameField(),
			lkDs = lookupFldObj.dataset(),
			codeFldObj = lkDs.getField(codeFld),
			nameFldObj = lkDs.getField(nameFld),
			arrFields = [];
		if(codeFldObj && codeFldObj.visible()) {
			arrFields.push(codeFld);
		}
		if(codeFld != nameFld && nameFldObj && nameFldObj.visible()) {
			arrFields.push(nameFld);
		}
		Z._defaultFilterFields = arrFields;
		return arrFields;
	},
	
	_getFilterFields: function(lkFldObj, inputValue) {
		var Z = this;
		var filterFlds = null;
		
		var eventFunc = jslet.getFunction(Z._onGetFilterField);
		if (eventFunc) {
			filterFlds = eventFunc.call(Z, lkFldObj.dataset(), inputValue);
			jslet.Checker.test('DBAutoComplete.onGetFilterField#return', filterFlds).isString();
		}
		filterFlds = filterFlds || Z._filterFields;
		var arrFields;
		if (filterFlds) {
			arrFields = filterFlds.split(',');
		} else {
			arrFields = Z._getDefaultFilterFields(lkFldObj);
		}
		if(arrFields.length === 0) {
			throw new Error('Not specified [filter fields]!');
		}
		var filterValue = inputValue;
		if (Z._matchMode == 'start') {
			filterValue = filterValue + '%';
		} else {
			if (Z._matchMode == 'end') {
				filterValue = '%' + filterValue;
			} else {
				filterValue = '%' + filterValue + '%';
			}
		}
		var fldName, result = '';
		for(var i = 0, len = arrFields.length; i < len; i++) {
			fldName = arrFields[i];
			if(i > 0) {
				result += ' || '
			}
			result += 'like([' + fldName + '],"' + filterValue + '")';
		}
		return result;
	},
	
	_populate: function (inputValue) {
		var Z = this;
		if (Z._minChars > 0 && inputValue && inputValue.length < Z._minChars) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
			lkf = fldObj.lookup();
		if (!lkf) {
			console.error(Z._field + ' is NOT a lookup field!');
			return;
		}
		
		var lkds = lkf.dataset();
		var eventFunc = jslet.getFunction(Z._beforePopup);
		if (eventFunc) {
			eventFunc.call(Z, lkds, inputValue);
		} else if (inputValue) {
			var filter = Z._getFilterFields(lkf, inputValue);
			lkds.filter(filter);
			lkds.filtered(true);
		} else {
			lkds.filter(null);
		}
		//Clear field value which specified by 'lookupField'.
		if(Z._lookupField) {
			Z._dataset.getRecord()[Z._lookupField] = null;
		}
		if (!Z.contentPanel) {
			Z.contentPanel = new jslet.ui.DBAutoCompletePanel(Z);
		} else {
			if(Z.contentPanel.isShowing()) {
				return;
			}
		}
		jslet.ui.PopupPanel.excludedElement = Z.el;
		var jqEl = jQuery(Z.el),
			r = jqEl.offset(),
			h = jqEl.outerHeight(),
			x = r.left,
			y = r.top + h;
		
		if (jslet.locale.isRtl){
			x = x + jqEl.outerWidth() - Z.contentPanel.dlgWidth;
		}
		Z.contentPanel.showPopup(x, y, 0, h);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		jQuery(Z.el).off();
		if (Z.contentPanel){
			Z.contentPanel.destroy();
			Z.contentPanel = null;
		}
		$super();
	}
	
});

/**
 * @private
 * @class DBAutoCompletePanel
 * 
 */
jslet.ui.DBAutoCompletePanel = function (autoCompleteObj) {
	var Z = this;
	Z.dlgWidth = 320;
	Z.dlgHeight = 180;

	var lkf, lkds;
	Z.comboCfg = autoCompleteObj;
	Z.dataset = autoCompleteObj.dataset();
	Z.field = autoCompleteObj.lookupField() || autoCompleteObj.field();
	
	Z.panel = null;
	Z.lkDataset = null;
	Z.popup = new jslet.ui.PopupPanel();
	Z.isPop = false;

	Z.create = function () {
		if (!Z.panel) {
			Z.panel = document.createElement('div');
			Z.panel.style.width = '100%';
			Z.panel.style.height = '100%';
			jQuery(Z.panel).on("mousedown", function(event){
				Z.comboCfg._isSelecting = true;
				event.stopPropagation();
			});
		}
		//process variable
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			lkds = lkfld.dataset();
		Z.lkDataset = lkds;
		var fields = lkds.getNormalFields(),
			totalChars = 0;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if(fldObj.visible()) {
				totalChars += fldObj.displayWidth();
			}
		}
		var totalWidth = totalChars * (jslet.global.defaultCharWidth || 12) + 30;
		Z.dlgWidth = totalWidth;
		if(Z.dlgWidth < 150) {
			Z.dlgWidth = 150;
		}
		if(Z.dlgWidth > 500) {
			Z.dlgWidth = 500;
		}

		Z.panel.innerHTML = '';

		var cntw = Z.dlgWidth - 4,
			cnth = Z.dlgHeight - 4,
			tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, noborder:true, hasSelectCol: false, hasSeqCol: false, hideHead: true };
		tableparam.onRowClick = Z.confirmSelect;

		Z.otable = jslet.ui.createControl(tableparam, Z.panel, '100%', cnth);
		Z.otable.el.focus();
		Z.otable.el.style.border = "0";
		
		return Z.panel;
	};

	Z.confirmSelect = function () {
		Z.comboCfg._isSelecting = true;
		var fldValue = Z.lkDataset.keyValue();
		if (fldValue || fldValue === 0) {
			Z.dataset.setFieldValue(Z.field, fldValue, Z.valueIndex);
			
			var fldObj = Z.dataset.getField(Z.field),
				lkfldObj = fldObj.lookup(),
				fieldMap = lkfldObj.returnFieldMap();
			if(fieldMap) {
				var lookupDs = lkfldObj.dataset();
					mainDs = Z.dataset;
				var fldName, lkFldName;
				for(var fldName in fieldMap) {
					lkFldName = fieldMap[fldName];
					mainDs.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
				}
			}
			
			Z.comboCfg.el.focus();
		}
		if (Z.comboCfg.afterSelect) {
			Z.comboCfg.afterSelect(Z.dataset, Z.lkDataset);
		}
		Z.closePopup();
	};

	Z.showPopup = function (left, top, ajustX, ajustY) {
		if (!Z.panel) {
			Z.panel = Z.create();
		}
		Z.comboCfg._isSelecting = false;
		Z.isPop = true;
		var p = Z.popup.getPopupPanel();
		p.style.padding = '0';
		Z.popup.setContent(Z.panel);
		Z.popup.onHidePopup = Z.doClosePopup;
		Z.popup.show(left, top, Z.dlgWidth, Z.dlgHeight, ajustX, ajustY);
	};

	Z.doClosePopup = function () {
		Z.isPop = false;
		var oldRecno = Z.lkDataset.recno() || 0;
		try {
			Z.lkDataset.filter(null);
		} finally {
			if(oldRecno >= 0) {
				Z.lkDataset.recno(oldRecno);
			}
		}
	};
	
	Z.closePopup = function () {
		Z.popup.hide();
	};
	
	Z.isShowing = function(){
		if (Z.popup) {
			return Z.popup.isShowing;
		} else {
			return false;
		}
	};
	
	Z.destroy = function(){
		jQuery(Z.panel).off();
		Z.otable.onRowClick = null;
		Z.otable.destroy();
		Z.otable = null;
		Z.panel = null;
		Z.popup.destroy();
		Z.popup = null;
		Z.comboCfg = null;
		Z.dataset = null;
		Z.field = null;
		Z.lkDataset = null;
	};
};

jslet.ui.register('DBAutoComplete', jslet.ui.DBAutoComplete);
jslet.ui.DBAutoComplete.htmlTemplate = '<input type="text"></input>';
