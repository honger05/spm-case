/* ========================================================================
 * Jslet framework: jslet.dbcustomcombobox.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* @class DBCustomComboBox: used in jslet.ui.DBComboDlg and jslet.ui.DBDatePicker
*/
jslet.ui.DBCustomComboBox = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,textReadOnly';
		Z._textReadOnly = false;
		Z.enableInvalidTip = false;

		$super(el, params);
	},

	textReadOnly: function(textReadOnly) {
		if(textReadOnly === undefined) {
			return this._textReadOnly;
		}
		this._textReadOnly = textReadOnly ? true: false;
	},
	
	/**
	 * @override
	 */
	afterBind: function ($super) {
		$super();
		
		if (this._textReadOnly) {
			this.el.childNodes[0].readOnly = true;
		}
	},

	/**
	 * @override
	 */
	ctrlRecno: function($super, ctrlRecno) {
		var result = $super(ctrlRecno);
		if(ctrlRecno !== undefined) {
			this.textCtrl.ctrlRecno(ctrlRecno);
		}
		return result;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('input-group')) {
			jqEl.addClass('input-group');
		}
		var btnCls = Z.comboButtonCls ? Z.comboButtonCls:'fa-caret-down'; 
		var s = '<input type="text" class="form-control">' + 
    	'<div class="jl-comb-btn-group"><button class="btn btn-default btn-sm" tabindex="-1"><i class="fa ' + btnCls + '"></i></button></div>'; 
		jqEl.html(s);
		var dbtext = jqEl.find('[type="text"]')[0];
		Z.textCtrl = new jslet.ui.DBText(dbtext, {
			type: 'dbtext',
			dataset: Z._dataset,
			field: Z._textField || Z._field,
			enableInvalidTip: true,
			valueIndex: Z._valueIndex
		});
		jQuery(Z.textCtrl.el).on('keydown', this.popupUp);
		Z.addChildControl(Z.textCtrl);
		
		var jqBtn = jqEl.find('button');
		if (this.buttonClick) {
			
			jqBtn.on('click', function(event){
				Z.buttonClick(jqBtn[0]);
			});
			jqBtn.on('focus', function (event) {
				jqEl.trigger('editing', [Z._field]);
			});
			
		}
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl();
	},
	
	popupUp: function(event) {
		if(event.keyCode == jslet.ui.KeyCode.DOWN) {
			var Z = jslet(this);
			if(Z.ctrlRecno() < 0) {
				Z.doBlur(event);
				var el = jslet.ui.findJsletParent(this.parentNode);
				el.jslet.buttonClick();
			}
		}
	},
	
	focus: function() {
		this.textCtrl.focus();
	},
	
	/**
	 * @override
	 */
	forceRefreshControl: function(){
		this.textCtrl.forceRefreshControl();
	},
	
	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this;
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var fldObj = Z._dataset.getField(Z._field),
				flag = fldObj.disabled() || fldObj.readOnly();
			var jqEl = jQuery(Z.el);
			jqEl.find('button').attr("disabled", flag);
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}

	},
	
	/** 
	 * @override
	 */ 
	setTabIndex: function(tabIdx) {
		var Z = this;
		if(Z.inTableCtrl()) {
			return;
		}
		if(tabIdx !== 0 && !tabIdx) {
			fldObj = Z._dataset.getField(Z._field);
			if(fldObj) {
				tabIdx = fldObj.tabIndex();
			}
		}
		if(tabIdx === 0 || tabIdx) {
			Z.textCtrl.el.tabIndex = tabIdx;
		}	
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		var dbbtn = Z.el.childNodes[1];
		dbbtn.onclick = null;
		jQuery(Z.textCtrl.el).off('keydown', this.popupUp);
		Z.textCtrl.destroy();
		Z.textCtrl = null;
		$super();
	}
});



