/* ========================================================================
 * Jslet framework: jslet.dbspinedit.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBSpinEdit. 
 * <pre><code>
 * var jsletParam = {type:"DBSpinEdit",dataset:"employee",field:"age", minValue:18, maxValue: 100, step: 5};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBSpinEdit",dataset:"employee",field:"age", minValue:18, maxValue: 100, step: 5' />
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
jslet.ui.DBSpinEdit = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,step';
		/**
		 * {Integer} Step value.
		 */
		Z._step = 1;

		$super(el, params);
	},

	step: function(step) {
		if(step === undefined) {
			return this._step;
		}
		jslet.Checker.test('DBSpinEdit.step', step).isNumber();
		this._step = step;
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tag = el.tagName.toLowerCase();
		return tag == 'div';
	},

	/**
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass('jl-spinedit')) {
			jqEl.addClass('input-group jl-spinedit');
		}
		Z._createControl();
		Z.renderAll();
	}, // end bind

	_createControl: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			s = '<input type="text" class="form-control">' + 
		    	'<div class="jl-spinedit-btn-group">' +
		    	'<button class="btn btn-default jl-spinedit-up" tabindex="-1"><i class="fa fa-caret-up"></i></button>' + 
		    	'<button class="btn btn-default jl-spinedit-down" tabindex="-1"><i class="fa fa-caret-down"></i></button>';
		jqEl.html(s);
		
		var editor = jqEl.find('input')[0],
			upButton = jqEl.find('.jl-spinedit-up')[0],
			downButton = jqEl.find('.jl-spinedit-down')[0];
		Z.editor = editor;
		jQuery(Z.editor).on("keydown", function(event){
			if(Z._isDisabled()) {
				return;
			}
			var keyCode = event.keyCode;
			if(keyCode == jslet.ui.KeyCode.UP) {
				Z.decValue();
				event.preventDefault();
				return;
			}
			if(keyCode == jslet.ui.KeyCode.DOWN) {
				Z.incValue();
				event.preventDefault();
				return;
			}
		});
		new jslet.ui.DBText(editor, {
			dataset: Z._dataset,
			field: Z._field,
			beforeUpdateToDataset: Z.beforeUpdateToDataset,
			valueIndex: Z._valueIndex
		});
		
		jQuery(upButton).on('click', function () {
			Z.incValue();
		});
		
		jQuery(upButton).on('focus', function () {
			jqEl.trigger('editing', [Z._field]);
		});
		
		jQuery(downButton).on('click', function () {
			Z.decValue();
		});
		
		jQuery(downButton).on('focus', function () {
			jqEl.trigger('editing', [Z._field]);
		});
		
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
	
	_isDisabled: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		return fldObj.disabled() || fldObj.readOnly();
	},
	
	/**
	 * @override
	 */
	beforeUpdateToDataset: function () {
		var Z = this,
			val = Z.el.value;
		var fldObj = Z._dataset.getField(Z._field),
			range = fldObj.dataRange(),
			minValue = Number.NEGATIVE_INFINITY, 
			maxValue = Number.POSITIVE_INFINITY;
		
		if(range) {
			if(range.min) {
				minValue = parseFloat(range.min);
			}
			if(range.max) {
				maxValue = parseFloat(range.max);
			}
		}
		if (val) {
			val = parseFloat(val);
//			if (val) {
//				if (val > maxValue)
//					val = maxValue;
//				else if (val < minValue)
//					val = minValue;
//				val = String(val);
//			}
		}
		jQuery(Z.el).attr('aria-valuenow', val);
		Z.el.value = val;
		return true;
	}, // end beforeUpdateToDataset

	setValueToDataset: function (val) {
		var Z = this;
		if (Z.silence) {
			return;
		}
		Z.silence = true;
		if (val === undefined) {
			val = Z.value;
		}
		try {
			Z._dataset.setFieldValue(Z._field, val, Z._valueIndex);
		} finally {
			Z.silence = false;
		}
	}, // end setValueToDataset

	incValue: function () {
		var Z = this,
			val = Z.getValue();
		if (!val) {
			val = 0;
		}
		var maxValue = Z._getRange().maxValue;
		if (val == maxValue) {
			return;
		} else if (val < maxValue) {
			val += Z._step;
		} else {
			val = maxValue;
		}
		if (val > maxValue) {
			value = maxValue;
		}
		jQuery(Z.el).attr('aria-valuenow', val);
		Z.setValueToDataset(val);
	}, // end incValue

	_getRange: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			range = fldObj.dataRange(),
			minValue = Number.NEGATIVE_INFINITY, 
			maxValue = Number.POSITIVE_INFINITY;
		
		if(range) {
			if(range.min) {
				minValue = parseFloat(range.min);
			}
			if(range.max) {
				maxValue = parseFloat(range.max);
			}
		}
		return {minValue: minValue, maxValue: maxValue};
	},
	
	decValue: function () {
		var Z = this,
			val = Z.getValue();
		if (!val) {
			val = 0;
		}
		var minValue = Z._getRange().minValue;
		if (val == minValue) {
			return;
		} else if (val > minValue) {
			val -= Z._step;
		} else {
			val = minValue;
		}
		if (val < minValue)
			val = minValue;
		jQuery(Z.el).attr('aria-valuenow', val);
		Z.setValueToDataset(val);
	}, // end decValue
	
	focus: function() {
		if(Z._isDisabled()) {
			return;
		}
		this.editor.focus();
	},
	
	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName) {
		$super(metaName);
		var Z = this,
			jqEl = jQuery(this.el),
			fldObj = Z._dataset.getField(Z._field);
		
		if(!metaName || metaName == 'disabled' || metaName == 'readOnly') {
			var disabled = fldObj.disabled() || fldObj.readOnly(),
				jqUpBtn = jqEl.find('.jl-spinedit-up'),
				jqDownBtn = jqEl.find('.jl-spinedit-down');
				
			if (disabled) {
				jqUpBtn.attr('disabled', 'disabled');
				jqDownBtn.attr('disabled', 'disabled');
			} else {
				jqUpBtn.attr('disabled', false);
				jqDownBtn.attr('disabled', false);
			}
		}
		if(!metaName || metaName == 'dataRange') {
			range = fldObj.dataRange();
			jqEl.attr('aria-valuemin', range && (range.min || range.min === 0) ? range.min: '');
			jqEl.attr('aria-valuemin', range && (range.max || range.max === 0) ? range.max: '');
		}
		if(!metaName || metaName == 'tabIndex') {
			Z.setTabIndex();
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function(){
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	},
	
	/**
	 * @override
	 */
	destroy: function(){
		var jqEl = jQuery(this.el);
		jQuery(this.editor).off();
		this.editor = null;
		jqEl.find('.jl-upbtn-up').off();
		jqEl.find('.jl-downbtn-up').off();
	}
	
});
jslet.ui.register('DBSpinEdit', jslet.ui.DBSpinEdit);
jslet.ui.DBSpinEdit.htmlTemplate = '<div></div>';

