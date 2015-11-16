/* ========================================================================
 * Jslet framework: jslet.dbeditpanel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* DBEditPanel
*/
jslet.ui.DBEditPanel = jslet.Class.create(jslet.ui.DBControl, {
	_totalColumns: 12, //Bootstrap column count 
	/**
	 * @override
	*/
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,columnCount,labelCols,onlySpecifiedFields,fields';
		
		/**
		 * {Integer} Column count
		 */
		Z._columnCount = 3;
		/**
		 * {Integer} The gap between label and editor
		 */
		Z._labelCols = 1;

		/**
		 * {Boolean} True - only show specified fields, false otherwise.
		 */
		Z._onlySpecifiedFields = false;
		/**
		 * Array of edit field configuration, prototype: [{field: "field1", colSpan: 2, rowSpan: 1}, ...]
		 */
		Z._fields;
		
		Z._metaChangedDebounce = jslet.debounce(Z.renderAll, 10);

		$super(el, params);
	},
	
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBEditPanel.columnCount', columnCount).isGTZero();
		this._columnCount = parseInt(columnCount);
	},
	
	labelCols: function(labelCols) {
		if(labelCols === undefined) {
			return this._labelCols;
		}
		jslet.Checker.test('DBEditPanel.labelCols', labelCols).isNumber().between(1,3);
		this._labelCols = parseInt(labelCols);
	},
	
	onlySpecifiedFields: function(onlySpecifiedFields) {
		if(onlySpecifiedFields === undefined) {
			return this._onlySpecifiedFields;
		}
		this._onlySpecifiedFields = onlySpecifiedFields ? true: false;
	},
	
	fields: function(fields) {
		if(fields === undefined) {
			return this._fields;
		}
		jslet.Checker.test('DBEditPanel.fields', fields).isArray();
		var fldCfg;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldCfg = fields[i];
			jslet.Checker.test('DBEditPanel.fields.field', fldCfg.field).isString().required();
			jslet.Checker.test('DBEditPanel.fields.labelCols', fldCfg.colSpan).isNumber().between(1,3);
			jslet.Checker.test('DBEditPanel.fields.dataCols', fldCfg.colSpan).isNumber().between(1,11);
			fldCfg.inFirstCol = fldCfg.inFirstCol ? true: false;
			fldCfg.showLine = fldCfg.showLine ? true: false;
			fldCfg.visible = (fldCfg.visible === undefined || fldCfg.visible) ? true: false;
		}
		this._fields = fields;
	},
	
	/**
	 * @override
	*/
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'div';
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},
	
	_calcLayout: function () {
		var Z = this,
			allFlds = Z._dataset.getNormalFields(), 
			fldLayouts, fldObj;
		
		if (!Z._onlySpecifiedFields) {
			fldLayouts = [];
			var fldName, found, editFld, maxFld, visible,
				layoutcnt = Z._fields ? Z._fields.length : 0;
			for (var i = 0, fcnt = allFlds.length; i < fcnt; i++) {
				fldObj = allFlds[i];
				fldName = fldObj.name();
				visible = fldObj.visible();
				found = false;
				for (var j = 0; j < layoutcnt; j++) {
					editFld = Z._fields[j];
					if (fldName == editFld.field) {
						found = true;
						if(editFld.visible === undefined || editFld.visible) {
							fldLayouts.push(editFld);
						}
						break;
					}
				}
				
				if (!found) {
					if(!visible) {
						continue;
					}
					fldLayouts.push({
						field: fldObj.name()
					});
				}
			} //end for i
		} else {
			fldLayouts = Z._fields;
		}

		var dftDataCols = Math.floor((Z._totalColumns - Z._labelCols * Z._columnCount) / Z._columnCount);
		if(dftDataCols <= 0) {
			dftDataCols = 1;
		}

		//calc row, col
		var layout, r = 0, c = 0, colsInRow = 0, itemCnt;
		for (var i = 0, cnt = fldLayouts.length; i < cnt; i++) {
			layout = fldLayouts[i];
			if(!layout.labelCols) {
				layout._innerLabelCols = Z._labelCols;
			}
			if(!layout.dataCols) {
				layout._innerDataCols = dftDataCols
			} else {
				layout._innerDataCols = layout.dataCols;	
			}
			itemCnt = layout._innerLabelCols + layout._innerDataCols;
			if (layout.inFirstCol || layout.showLine || colsInRow + itemCnt > Z._totalColumns) {
				r++;
				colsInRow = 0;
			}
			layout.row = r;
			colsInRow += itemCnt;
		}
		return fldLayouts;
	},
	
	getEditField: function (fieldName) {
		var Z = this;
		if (!Z._fields) {
			Z._fields = [];
		}
		var editFld;
		for (var i = 0, cnt = Z._fields.length; i < cnt; i++) {
			editFld = Z._fields[i];
			if (editFld.field == fieldName) {
				return editFld;
			}
		}
		var fldObj = Z._dataset.getField(fieldName);
		if (!fldObj) {
			return null;
		}
		editFld = {
			field: fieldName
		};
		Z._fields.push(editFld);
		return editFld;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		Z.removeAllChildControls();
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-editpanel')) {
			jqEl.addClass('jl-editpanel form-horizontal');
		}
		jqEl.html('');
		var allFlds = Z._dataset.getNormalFields(),
			fcnt = allFlds.length;
		var layouts = Z._calcLayout();
		//calc max label width
			
		var r = -1, oLabel, editorCfg, fldName, fldObj, ohr, octrlDiv, opanel, ctrlId, dbCtrl;
		for (var i = 0, cnt = layouts.length; i < cnt; i++) {
			layout = layouts[i];
			if (layout.showLine) {
				ohr = document.createElement('hr');
				Z.el.appendChild(ohr);
			}
			if (layout.row != r) {
				opanel = document.createElement('div');
				opanel.className = 'form-group form-group-sm';
				Z.el.appendChild(opanel);
				r = layout.row;

			}
			fldName = layout.field;
			fldObj = Z._dataset.getField(fldName);
			if (!fldObj) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			editorCfg = fldObj.editControl();
			var isCheckBox = editorCfg.type.toLowerCase() == 'dbcheckbox';
			if(isCheckBox) {
				oLabel = document.createElement('div');
				opanel.appendChild(oLabel);
				oLabel.className = 'col-sm-' + layout._innerLabelCols;

				octrlDiv = document.createElement('div');
				opanel.appendChild(octrlDiv);
				octrlDiv.className = 'col-sm-' + layout._innerDataCols;
				
				editorCfg.dataset = Z._dataset;
				editorCfg.field = fldName;
				editor = jslet.ui.createControl(editorCfg, null);
				octrlDiv.appendChild(editor.el);
				Z.addChildControl(editor);
				
				oLabel = document.createElement('label');
				octrlDiv.appendChild(oLabel);
				dbCtrl = new jslet.ui.DBLabel(oLabel, {
					type: 'DBLabel',
					dataset: Z._dataset,
					field: fldName
				});
				
				ctrlId = jslet.nextId();
				editor.el.id = ctrlId;
				jQuery(oLabel).attr('for', ctrlId);
				Z.addChildControl(dbCtrl);
			} else {
				oLabel = document.createElement('label');
				opanel.appendChild(oLabel);
				oLabel.className = 'col-sm-' + layout._innerLabelCols;
				dbctrl = new jslet.ui.DBLabel(oLabel, {
					type: 'DBLabel',
					dataset: Z._dataset,
					field: fldName
				});
				Z.addChildControl(dbCtrl);
				
				octrlDiv = document.createElement('div');
				opanel.appendChild(octrlDiv);
				octrlDiv.className = 'col-sm-' + layout._innerDataCols;
				
				if (fldObj.valueStyle() == jslet.data.FieldValueStyle.BETWEEN) {
					editorCfg = {
						type: 'DBBetweenEdit'
					};
				}
				
				editorCfg.dataset = Z._dataset;
				editorCfg.field = fldName;
				editor = jslet.ui.createControl(editorCfg, null);
				octrlDiv.appendChild(editor.el);
				ctrlId = jslet.nextId();
				editor.el.id = ctrlId;
				jQuery(oLabel).attr('for', ctrlId);
				Z.addChildControl(editor);
			}
		}
	}, // render All
	
	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		if(metaName && (metaName == 'visible' || metaName == 'editControl')) {
			this._metaChangedDebounce.call(this);
		}
	}
});

jslet.ui.register('DBEditPanel', jslet.ui.DBEditPanel);
jslet.ui.DBEditPanel.htmlTemplate = '<div></div>';
