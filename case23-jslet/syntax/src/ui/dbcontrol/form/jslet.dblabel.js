/* ========================================================================
 * Jslet framework: jslet.dblabel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBLabel. 
 * Display field name, use this control to void hard-coding field name, and you can change field name dynamically. 
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBLabel",dataset:"employee",field:"department"};
 * 
 * //1. Declaring:
 * &lt;label data-jslet='type:"DBLabel",dataset:"employee",field:"department"' />
 * or
 * &lt;label data-jslet='jsletParam' />
 *
 *  //2. Binding
 * &lt;label id="ctrlId"  />
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBLabel = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'dataset,field';
		this.isLabel = true;
		$super(el, params);
	},

	/**
	 * @override
	 */
	bind: function () {
		jQuery(this.el).addClass('control-label');
		this.renderAll();
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'label';
	},

	/**
	 * @override
	 */
	doMetaChanged: function(metaName) {
		if(metaName && jslet.ui.DBLabel.METANAMES.indexOf(metaName) < 0) {
			return;
		}
		var Z = this, subType = Z._fieldMeta,
			fldObj = Z._dataset.getField(Z._field),
			content = '';
		if(!fldObj) {
			throw new Error('Field: ' + this._field + ' NOT exist!');
		}
		if((!subType || subType == 'label') && (!metaName || metaName == 'label' || metaName == 'required')) {
			if (fldObj.required()) {
				content += '<span class="jl-lbl-required">' + 
					jslet.ui.DBLabel.REQUIREDCHAR + '</span>';
			}
			content += fldObj.label();
			Z.el.innerHTML = content || '';
			return;
		}
		if(subType && subType == 'tip' && 
			(!metaName || metaName == subType)) {
			content = fldObj.tip();
			Z.el.innerHTML = content || '';
			return;
		}
		if(subType  && subType == 'error' && 
			(metaName && metaName == subType)) {
			var errObj = Z.getFieldError();
			var content = errObj && errObj.message;
			Z.el.innerHTML = content || '';
			return;
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var jqEl = jQuery(this.el),
			subType = this.fieldMeta();
		
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent());
		if(subType == 'error') {
			if(!jqEl.hasClass('jl-lbl-error')) {
				jqEl.addClass('jl-lbl-error');
			}
		} else 
		if(subType == 'tip') {
			if(!jqEl.hasClass('jl-lbl-tip')) {
				jqEl.addClass('jl-lbl-tip');
			}
		} else {
			if(!jqEl.hasClass('jl-lbl')) {
				jqEl.addClass('jl-lbl');
			}
		}
	}
});

jslet.ui.DBLabel.REQUIREDCHAR = '*';
jslet.ui.DBLabel.METANAMES = ['label', 'required', 'tip', 'error'];
jslet.ui.register('DBLabel', jslet.ui.DBLabel);
jslet.ui.DBLabel.htmlTemplate = '<label></label>';

