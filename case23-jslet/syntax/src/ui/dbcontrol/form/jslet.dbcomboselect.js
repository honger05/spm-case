/* ========================================================================
 * Jslet framework: jslet.dbcomboselect.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBCombodlg. 
 * Show data on a popup panel, it can display tree style or table style. 
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBCombodlg",dataset:"employee",field:"department", textReadOnly:true};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBCombodlg",dataset:"employee",field:"department", textReadOnly:true' />
 * or
 * &lt;div data-jslet='jsletParam' />
 *  
 *  //2. Binding
 * &lt;div id="ctrlId"  />
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 * 
 * </code></pre>
 */
jslet.ui.DBComboSelect = jslet.Class.create(jslet.ui.DBCustomComboBox, {
	showStyles: ['auto', 'table', 'tree'],
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,textField,searchField,popupHeight,popupWidth,showStyle,textReadOnly,onGetSearchField,correlateCheck';
		Z._textField = null;
		
		Z._showStyle = 'auto';
		
		Z._popupWidth = 300;

		Z._popupHeight = 300;
		
		Z._contentPanel = null;
		
		Z._pickupField = null;
		
		Z._onGetSearchField = null;
		
		Z._correlateCheck = false;
		
		$super(el, params);
	},

	/**
	 * Get or set the field name of text box.
	 * 
	 * @param textField {String} Field name of text box.
	 * @return {String or this}
	 */
	textField: function(textField) {
		if(textField === undefined) {
			return this._textField;
		}
		jslet.Checker.test('DBComboSelect.textField', textField).required().isString();
		this._textField = textField.trim();
	},
	
	/**
	 * Get or set popup panel height.
	 * 
	 * @param popupHeight {Integer} Popup panel height.
	 * @return {Integer or this}
	 */
	popupHeight: function(popupHeight) {
		if(popupHeight === undefined) {
			return this._popupHeight;
		}
		jslet.Checker.test('DBComboSelect.popupHeight', popupHeight).isGTEZero();
		this._popupHeight = parseInt(popupHeight);
	},

	/**
	 * Get or set popup panel width.
	 * 
	 * @param popupHeight {Integer} Popup panel width.
	 * @return {Integer or this}
	 */
	popupWidth: function(popupWidth) {
		if(popupWidth === undefined) {
			return this._popupWidth;
		}
		jslet.Checker.test('DBComboSelect.popupWidth', popupWidth).isGTEZero();
		this._popupWidth = parseInt(popupWidth);
	},
		
	/**
	 * Get or set panel content style.
	 * 
	 * @param {String} Optional value: auto, table, tree.
	 * @return {String or this}
	 */
	showStyle: function(showStyle) {
		if(showStyle === undefined) {
			return this._showStyle;
		}
		showStyle = jQuery.trim(showStyle);
		var checker = jslet.Checker.test('DBComboSelect.showStyle', showStyle).isString();
		showStyle = showStyle.toLowerCase();
		checker.testValue(showStyle).inArray(this.showStyles);
		this._showStyle = showStyle;
	},
	
	/**
	 * Get or set onGetSearchField event handler.
	 * 
	 * @param {Function} Optional onGetSearchField event handler.
	 * @return {Function or this}
	 */
	onGetSearchField: function(onGetSearchField) {
		if(onGetSearchField === undefined) {
			return this._onGetSearchField;
		}
		this._onGetSearchField = onGetSearchField;
	},
		
	correlateCheck: function(correlateCheck) {
		if(correlateCheck === undefined) {
			return this._correlateCheck;
		}
		this._correlateCheck = correlateCheck;
	},
	
	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return true;
	},

	/**
	 * @override
	 */
	afterBind: function ($super) {
		$super();
		
		if (this._contentPanel) {
			this._contentPanel = null;
		}
	},

	buttonClick: function (btnEle) {
		var Z = this, 
			el = Z.el, 
			fldObj = Z._dataset.getField(Z._field), 
			lkf = fldObj.lookup(),
			jqEl = jQuery(el);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;		
		}
		if (lkf === null && lkf === undefined) {
			throw new Error(Z._field + ' is NOT a lookup field!');
		}
		var style = Z._showStyle;
		if (Z._showStyle == 'auto') {
			style = lkf.parentField() ? 'tree' : 'table';
		}
		if (!Z._contentPanel) {
			Z._contentPanel = new jslet.ui.DBComboSelectPanel(Z);
			Z._contentPanel.showStyle = style;
			Z._contentPanel.customButtonLabel = Z.customButtonLabel;
			Z._contentPanel.onCustomButtonClick = Z.onCustomButtonClick;
			if (Z._popupWidth) {
				Z._contentPanel.popupWidth = Z._popupWidth;
			}
			if (Z._popupHeight) {
				Z._contentPanel.popupHeight = Z._popupHeight;
			}
		}
		jslet.ui.PopupPanel.excludedElement = btnEle;
		var r = jqEl.offset(), h = jqEl.outerHeight(), x = r.left, y = r.top + h;
		if (jslet.locale.isRtl){
			x = x + jqEl.outerWidth();
		}
		Z._contentPanel.showPopup(x, y, 0, h);
	},
	
	closePopup: function(){
		if(this._contentPanel) {
			this._contentPanel.closePopup();
		}
		this._contentPanel = null;
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		if (Z._contentPanel){
			Z._contentPanel.destroy();
			Z._contentPanel = null;
		}
		jslet.ui.PopupPanel.excludedElement = null;
		$super();
	}
});

jslet.ui.DBComboSelectPanel = function (comboSelectObj) {
	var Z = this;

	Z.showStyle = 'auto';

	Z.customButtonLabel = null;
	Z.onCustomButtonClick = null;
	Z.popupWidth = 350;
	Z.popupHeight = 350;

	var otree, otable, showType, valueSeperator = ',', lkf, lkds, self = this;
	Z.comboSelectObj = comboSelectObj;

	Z.dataset = comboSelectObj._dataset;
	Z.field = comboSelectObj._field;
	Z.fieldObject = Z.dataset.getField(Z.field);
	Z.panel = null;
	Z.searchBoxEle = null;
	
	Z.popup = new jslet.ui.PopupPanel();
	Z.popup.onHidePopup = function() {
		Z.comboSelectObj.focus();
	};
};

jslet.ui.DBComboSelectPanel.prototype = {
		
	lookupDs: function() {
		return this.fieldObject.lookup().dataset();
	},
	
	isMultiple: function() {
		return this.fieldObject.valueStyle() == jslet.data.FieldValueStyle.MULTIPLE;
	},
		
	showPopup: function (left, top, ajustX, ajustY) {
		var Z = this;
		Z._initSelected();
		var showType = Z.showStyle.toLowerCase();
		if (!Z.panel) {
			Z.panel = Z._create();
		} else {
			var ojslet = Z.otree ? Z.otree : Z.otable;
			ojslet.dataset().addLinkedControl(ojslet);
			window.setTimeout(function(){
				ojslet.renderAll();
			}, 1);
		}
		if(showType == 'table') {
			var fields = Z.lookupDs().getNormalFields(),
				fldObj, totalChars = 0;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(fldObj.visible()) {
					totalChars += fldObj.displayWidth();
				}
			}
			var totalWidth = totalChars * (jslet.global.defaultCharWidth || 12) + 40;
			Z.popupWidth = totalWidth;
			if(Z.popupWidth < 150) {
				Z.popupWidth = 150;
			}
			if(Z.popupWidth > 500) {
				Z.popupWidth = 500;
			}
		}
		Z.popup.setContent(Z.panel, '100%', '100%');
		Z.popup.show(left, top, Z.popupWidth, Z.popupHeight, ajustX, ajustY);
		jQuery(Z.panel).find(".jl-combopnl-head input").focus();
	},

	closePopup: function () {
		var Z = this;
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup();
		if(Z.isMultiple() && lkfld.onlyLeafLevel()) {
			Z.lookupDs().onCheckSelectable(null);
		}
		
		Z.popup.hide();
		var dispCtrl = Z.otree ? Z.otree : Z.otable;
		if(dispCtrl) {
			dispCtrl.dataset().removeLinkedControl(dispCtrl);
		}
	},
	
	_create: function () {
		var Z = this;
		if (!Z.panel) {
			Z.panel = document.createElement('div');
		}

		//process variable
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			pfld = lkfld.parentField(),
			showType = Z.showStyle.toLowerCase(),
			lkds = Z.lookupDs();

		var template = ['<div class="jl-combopnl-head"><div class="col-xs-12 jl-nospacing">',
		                '<input class="form-control" type="text" size="20"></input></div></div>',
			'<div class="jl-combopnl-content',
			Z.isMultiple() ? ' jl-combopnl-multiselect': '',
			'"></div>',
			'<div class="jl-combopnl-footer" style="display:none"><button class="jl-combopnl-footer-cancel btn btn-default btn-sm" >',
			jslet.locale.MessageBox.cancel,
			'</button><button class="jl-combopnl-footer-ok btn btn-default btn-sm" >',
			jslet.locale.MessageBox.ok,
			'</button></div>'];

		Z.panel.innerHTML = template.join('');
		var jqPanel = jQuery(Z.panel),
			jqPh = jqPanel.find('.jl-combopnl-head');
		jqPanel.on('keydown', function(event){
			if(event.keyCode === 27) {
				Z.closePopup();
			}
		});
		Z.searchBoxEle = jqPh.find('input')[0];
		jQuery(Z.searchBoxEle).on('keydown', jQuery.proxy(Z._findData, Z));
		
		var jqContent = jqPanel.find('.jl-combopnl-content');
		if (Z.isMultiple()) {
			jqContent.addClass('jl-combopnl-content-nofooter').removeClass('jl-combopnl-content-nofooter');
			var pnlFoot = jqPanel.find('.jl-combopnl-footer')[0];
			pnlFoot.style.display = 'block';
			var jqFoot = jQuery(pnlFoot);
			jqFoot.find('.jl-combopnl-footer-cancel').click(jQuery.proxy(Z.closePopup, Z));
			jqFoot.find('.jl-combopnl-footer-ok').click(jQuery.proxy(Z._confirmSelect, Z));
		} else {
			jqContent.addClass('jl-combopnl-content-nofooter');
		}

		var contentPanel = jqContent[0];

		//create popup content
		if (showType == 'tree') {
			var treeparam = { 
				type: 'DBTreeView', 
				dataset: lkds, 
				readOnly: false, 
				displayFields: lkfld.displayFields(), 
				hasCheckBox: Z.isMultiple()
			};

			if (!Z.isMultiple()) {
				treeparam.onItemDblClick = jQuery.proxy(Z._confirmSelect, Z);
			}
			treeparam.correlateCheck = Z.comboSelectObj.correlateCheck();
			window.setTimeout(function(){
				Z.otree = jslet.ui.createControl(treeparam, contentPanel, '100%', '100%');
			}, 1);
		} else {
			var tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, hasSelectCol: Z.isMultiple(), hasSeqCol: false, hasFindDialog: false };
			if (!Z.isMultiple()) {
				tableparam.onRowDblClick = jQuery.proxy(Z._confirmSelect, Z);
			}
			window.setTimeout(function(){
				Z.otable = jslet.ui.createControl(tableparam, contentPanel, '100%', '100%');
			}, 1);
		}
		return Z.panel;
	},

	_initSelected: function () {
		var Z = this;
		var fldValue = Z.comboSelectObj.getValue(), 
			lkds = Z.lookupDs();

		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup();

		if(lkfld.onlyLeafLevel()) {
			lkds.onCheckSelectable(function(){
				return !this.hasChildren();
			});
		}
		if (!Z.isMultiple()) {
			if (fldValue) {
				lkds.findByKey(fldValue);
			}
			return;
		}
		lkds.selectAll(false);
		if (fldValue) {
			var arrKeyValues = fldValue;
			if(!jslet.isArray(fldValue)) {
				arrKeyValues = fldValue.split(jslet.global.valueSeparator);
			}
			for (var i = 0, len = arrKeyValues.length; i < len; i++){
				lkds.selectByKeyValue(true, arrKeyValues[i]);
			}
		}
	},

	_findData: function (event) {
		event = jQuery.event.fix( event || window.event );
		if (event.which != 13) {//enter
			return;
		}
		var Z = this;
		var findFldName = Z.comboSelectObj.searchField, 
			findValue = this.searchBoxEle.value;
		if (!findValue) {
			return;
		}
		var eventFunc = jslet.getFunction(Z.comboSelectObj.onGetSearchField);
		if (eventFunc) {
			findFldName = eventFunc.call(findValue);
		}
		var findFldNames = null;
		if(!findFldName) {
			var lkFldObj = Z.fieldObject.lookup(),
				codeFldName = lkFldObj.codeField(),
				nameFldName = lkFldObj.nameField();
			 
			findFldNames = [];
			codeFldName && findFldNames.push(codeFldName);
			nameFldName && codeFldName != nameFldName && findFldNames.push(nameFldName);
		} else {
			findFldNames = findFldName.split(',');
		}
		if(!findFldNames || findFldNames.length === 0) {
			console.warn('Search field NOT specified! Can\'t search data!')
			return;
		}
		var lkds = Z.lookupDs(), fldObj;
		for(var i = 0, len = findFldNames.length; i < len; i++) {
			findFldName = findFldNames[i];
			fldObj = lkds.getField(findFldName);
			if(!fldObj) {
				console.warn('Field Name: ' + findFldName + ' NOT exist!');
				return;
			}
			if(lkds.find('like([' + findFldName + '],"%' + findValue + '%")')) {
				break;
			}
		}
	},

	_confirmSelect: function () {
		var Z = this;
		var fldValue = Z.comboSelectObj.getValue(),
			fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			isMulti = Z.isMultiple(),
			lookupDs = Z.lookupDs();
		
		if(!lookupDs.checkSelectable()) {
			return;
		}
		if (isMulti) {
			fldValue = lookupDs.selectedKeyValues();
		} else {
			fldValue = lookupDs.keyValue();
		}

		Z.dataset.setFieldValue(Z.field, fldValue, Z._valueIndex);
		if (!isMulti && Z.comboSelectObj._afterSelect) {
			Z.comboSelectObj._afterSelect(Z.dataset, lookupDs);
		}
		if(!isMulti) {
			var fieldMap = lkfld.returnFieldMap();
			if(fieldMap) {
				var mainDs = Z.dataset,
					fldName, 
					lkFldName;
				for(var fldName in fieldMap) {
					lkFldName = fieldMap[fldName];
					Z.dataset.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
				}
			}
		}
		Z.closePopup();
	},

	destroy: function(){
		var Z = this;
		if (Z.otree){
			Z.otree.destroy();
			Z.otree = null;
		}
		if (Z.otable){
			Z.otable.destroy();
			Z.otable = null;
		}
		Z.comboSelectObj = null;
		
		var jqPanel = jQuery(Z.panel),
			jqFoot = jqPanel.find('.jl-combopnl-footer');
		jqFoot.find('.jl-combopnl-footer-cancel').off();
		jqFoot.find('.jl-combopnl-footer-ok').off();
		jQuery(Z.searchBoxEle).off();
		Z.fieldObject = null;
		
		Z.searchBoxEle = null;
		Z.popup = null;
		Z.panel = null;
	}
};

jslet.ui.register('DBComboSelect', jslet.ui.DBComboSelect);
jslet.ui.DBComboSelect.htmlTemplate = '<div></div>';
