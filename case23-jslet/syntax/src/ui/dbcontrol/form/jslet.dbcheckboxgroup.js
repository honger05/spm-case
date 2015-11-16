/* ========================================================================
 * Jslet framework: jslet.dbcheckboxgroup.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBCheckBoxGroup. 
 * Display a group of checkbox. Example:
 * <pre><code>
 * var jsletParam = {type:"DBCheckBoxGroup",dataset:"employee",field:"department", columnCount: 3};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBCheckBoxGroup",dataset:"employee",field:"department", columnCount: 3' />
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
jslet.ui.DBCheckBoxGroup = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,columnCount,hasSelectAllBox';
		/**
		 * {Integer} Column count
		 */
		Z._columnCount = 99999;
		Z._itemIds = null;
		$super(el, params);
	},

	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBCheckBoxGroup.columnCount', columnCount).isGTEZero();
		this._columnCount = parseInt(columnCount);
	},
	
	hasSelectAllBox: function(hasSelectAllBox) {
		if(hasSelectAllBox === undefined) {
			return this._hasSelectAllBox;
		}
		this._hasSelectAllBox = hasSelectAllBox? true: false;
	},
	
	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div';
	},

	/**
	 * @override
	 */
	bind: function () {
		var Z = this;
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.on('click', 'input[type="checkbox"]', function (event) {
			var ctrl = this;
			window.setTimeout(function(){ //Defer firing 'updateToDataset' when this control is in DBTable to make row changed firstly.
				event.delegateTarget.jslet.updateToDataset(ctrl);
			}, 5)
		});
		jqEl.on('focus', 'input[type="checkbox"]', function (event) {
			jqEl.trigger('editing', [Z._field]);
		});
		jqEl.addClass('form-control');//Bootstrap class
		jqEl.css('height', 'auto');
	},

	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
			var disabled = fldObj.disabled(),
				readOnly = fldObj.readOnly();
			disabled = disabled || readOnly;
			var chkBoxes = jQuery(Z.el).find('input[type="checkbox"]'),
				chkEle, 
				tabIndex = fldObj.tabIndex(),
				required = fldObj.required();
			for(var i = 0, cnt = chkBoxes.length; i < cnt; i++){
				chkEle = chkBoxes[i];
				jslet.ui.setEditableStyle(chkEle, disabled, readOnly, false, required);
				chkEle.tabIndex = tabIndex;
			}
		}
	},
	
	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var checkboxs = jQuery(Z.el).find('input[type="checkbox"]'),
			chkcnt = checkboxs.length, 
			checkbox, i;
		for (i = 0; i < chkcnt; i++) {
			checkbox = checkboxs[i];
			if(jQuery(checkbox).hasClass('jl-selectall')) {
				continue;
			}
			checkbox.checked = false;
		}
		var values = Z.getValue();
		if(values && values.length > 0) {
			var valueCnt = values.length, value;
			for (i = 0; i < chkcnt; i++) {
				checkbox = checkboxs[i];
				for (var j = 0; j < valueCnt; j++) {
					value = values[j];
					if (value == checkbox.value) {
						checkbox.checked = true;
					}
				}
			}
		}
	},
	
	/**
	 * @override
	 */
	doLookupChanged: function () {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field), 
			lkf = fldObj.lookup();
		if (!lkf) {
			console.error(jslet.formatString(jslet.locale.Dataset.lookupNotFound,
					[fldObj.name()]));
			return;
		}
		if(fldObj.valueStyle() != jslet.data.FieldValueStyle.MULTIPLE) {
			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
		}
		
		var lkds = lkf.dataset(),
			lkCnt = lkds.recordCount();
		if(lkCnt === 0) {
			Z.el.innerHTML = jslet.locale.DBCheckBoxGroup.noOptions;
			return;
		}
		Z._itemIds = [];
		var template = ['<table cellpadding="0" cellspacing="0">'],
			isNewRow = false;
		var editFilter = lkf.editFilter();
		Z._innerEditFilterExpr = null;
		var editItemDisabled = lkf.editItemDisabled();
		if(editFilter) {
			Z._innerEditFilterExpr = new jslet.Expression(lkds, editFilter);
		}
		var disableOption = false,
			itemId = jslet.nextId(), k = -1;
		if(Z._hasSelectAllBox && lkCnt > 0) {
			template.push('<tr>');
			itemId = jslet.nextId();
			template.push('<td style="white-space: nowrap; "><input type="checkbox" class="jl-selectall"');
			template.push(' id="');
			template.push(itemId);
			template.push('"/><label for="');
			template.push(itemId);
			template.push('">');
			template.push(jslet.locale.DBCheckBoxGroup.selectAll);
			template.push('</label></td>');
			k = 0;
		}
		var oldRecno = lkds.recnoSilence();
		try {
			for (var i = 0; i < lkCnt; i++) {
				lkds.recnoSilence(i);
				disableOption = false;
				if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
					if(!editItemDisabled) {
						continue;
					} else {
						disableOption = true;
					}
				}
				k++;
				isNewRow = (k % Z._columnCount === 0);
				if (isNewRow) {
					if (k > 0) {
						template.push('</tr>');
					}
					template.push('<tr>');
				}
				itemId = jslet.nextId();
				template.push('<td style="white-space: nowrap; "><input type="checkbox" value="');
				template.push(lkds.getFieldValue(lkf.keyField()));
				template.push('" id="');
				template.push(itemId);
				template.push('" ' + (disableOption? ' disabled': '') + '/><label for="');
				template.push(itemId);
				template.push('">');
				template.push(lkf.getCurrentDisplayValue());
				template.push('</label></td>');
				isNewRow = (k % Z._columnCount === 0);
			} // end for
			if (lkCnt > 0) {
				template.push('</tr>');
			}
			template.push('</table>');
			Z.el.innerHTML = template.join('');
		} finally {
			lkds.recnoSilence(oldRecno);
		}
	}, // end renderOptions

	updateToDataset: function(currCheckBox) {
		var Z = this;
		if (Z._is_silence_) {
			return;
		}
		var allBoxes = jQuery(Z.el).find('input[type="checkbox"]'), chkBox;
		if(jQuery(currCheckBox).hasClass('jl-selectall')) {
			var isAllSelected = currCheckBox.checked;
			for(var j = 0, allCnt = allBoxes.length; j < allCnt; j++){
				chkBox = allBoxes[j];
				if(chkBox == currCheckBox) {
					continue;
				}
				if (!chkBox.disabled) {
					chkBox.checked = isAllSelected;
				}
			} //end for j
			
		}
		var fldObj = Z._dataset.getField(Z._field),
			limitCount = fldObj.valueCountLimit();
		
		var values = [], count = 0;
		for(var j = 0, allCnt = allBoxes.length; j < allCnt; j++){
			chkBox = allBoxes[j];
			if(jQuery(chkBox).hasClass('jl-selectall')) {
				continue;
			}
			if (chkBox.checked) {
				values.push(chkBox.value);
				count ++;
			}
		} //end for j

		if (limitCount && count > limitCount) {
			currCheckBox.checked = !currCheckBox.checked;
			jslet.showInfo(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
					[''	+ limitCount]));
			return;
		}

		Z._is_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, values);
		} finally {
			Z._is_silence_ = false;
		}
	},
	
	focus: function() {
		if (_itemIds && _itemIds.length > 0) {
			document.getElementById(_itemIds[0]).focus();
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, 
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass("jl-checkboxgroup")) {
			jqEl.addClass("jl-checkboxgroup");
		}
		Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.off();
		$super();
	}
});

jslet.ui.register('DBCheckBoxGroup', jslet.ui.DBCheckBoxGroup);
jslet.ui.DBCheckBoxGroup.htmlTemplate = '<div></div>';

