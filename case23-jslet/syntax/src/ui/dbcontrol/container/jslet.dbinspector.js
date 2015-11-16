/* ========================================================================
 * Jslet framework: jslet.dbinspector.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBInspector. 
 * Display&Edit fields in two columns: Label column and Value column. If in edit mode, this control takes the field editor configuration from dataset field object.
 * Example:
 * <pre><code>
 *  var jsletParam = {type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100};
 * 
 * //1. Declaring:
 *  &lt;div id='ctrlId' data-jslet='type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100' />
 *  or
 *  &lt;div data-jslet='jsletParam' />
 * 
 *  //2. Binding
 *  &lt;div id="ctrlId"  />
 *  //Js snippet
 *  var el = document.getElementById('ctrlId');
 *  jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *  jslet.ui.createControl(jsletParam, document.body);
 *  
 * </code></pre>
 */
jslet.ui.DBInspector = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,columnCount,rowHeight,fields';
		
		/**
		 * {Integer} Column count
		 */
		Z._columnCount = 1;
		/**
		 * {Integer} Row height
		 */
		Z._rowHeight = 30;
		
		Z._fields = null;
		
		Z._metaChangedDebounce = jslet.debounce(Z.renderAll, 10);

		$super(el, params);
	},
	
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBInspector.columnCount', columnCount).isGTZero();
		this._columnCount = parseInt(columnCount);
	},
	
	rowHeight: function(rowHeight) {
		if(rowHeight === undefined) {
			return this._rowHeight;
		}
		jslet.Checker.test('DBInspector.rowHeight', rowHeight).isGTZero();
		this._rowHeight = parseInt(rowHeight);
	},
	
	fields: function(fields) {
		if(fields === undefined) {
			return this._fields;
		}
		jslet.Checker.test('DBInspector.fields', fields).isArray();
		var fldCfg;
		for(var i = 0, len = fields.length; i < len; i++) {
			fldCfg = fields[i];
			jslet.Checker.test('DBInspector.fields.field', fldCfg.field).isString().required();
			fldCfg.visible = fldCfg.visible ? true: false;
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
		var Z = this;
		var colCnt = Z._columnCount;
		if (colCnt) {
			colCnt = parseInt(colCnt);
		}
		if (colCnt && colCnt > 0) {
			Z._columnCount = colCnt;
		} else {
			Z._columnCount = 1;
		}
		Z.renderAll();
	}, // end bind
	
		/**
		 * @override
		 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		Z.removeAllChildControls();
		
		if (!jqEl.hasClass('jl-inspector'))
			jqEl.addClass('jl-inspector jl-round5');
		var totalWidth = jqEl.width(),
			allFlds = Z._dataset.getFields();
		jqEl.html('<table cellpadding=0 cellspacing=0 style="margin:0;padding:0;table-layout:fixed;width:100%;height:100%"><tbody></tbody></table>');
		var oCol, fldObj, i, found, visible, fldName, cfgFld,
			fcnt = allFlds.length,
			visibleFlds = [];
		for (i = 0; i < fcnt; i++) {
			fldObj = allFlds[i];
			fldName = fldObj.name();
			found = false;
			if(Z._fields) {
				for(var j = 0, len = Z._fields.length; j < len; j++) {
					cfgFld = Z._fields[j];
					if(fldName == cfgFld.field) {
						found = true;
						visible = cfgFld.visible? true: false;
						break;
					} 
				}
			}
			if(!found) {
				visible = fldObj.visible();
			}
			if (visible) {
				visibleFlds.push(fldObj);
			}
		}
		fcnt = visibleFlds.length;
		if (fcnt === 0) {
			return;
		}
		var w, c, columnCnt = Math.min(fcnt, Z._columnCount), arrLabelWidth = [];
		for (i = 0; i < columnCnt; i++) {
			arrLabelWidth[i] = 0;
		}
		var startWidth = jslet.ui.textMeasurer.getWidth('*');
		jslet.ui.textMeasurer.setElement(Z.el);
		for (i = 0; i < fcnt; i++) {
			fldObj = visibleFlds[i];
			c = i % columnCnt;
			w = Math.round(jslet.ui.textMeasurer.getWidth(fldObj.label()) + startWidth) + 5;
			if (arrLabelWidth[c] < w) {
				arrLabelWidth[c] = w;
			}
		}
		jslet.ui.textMeasurer.setElement();
		
		var totalLabelWidth = 0;
		for (i = 0; i < columnCnt; i++) {
			totalLabelWidth += arrLabelWidth[i];
		}
		
		var editorWidth = Math.round((totalWidth - totalLabelWidth) / columnCnt);
		
		var otable = Z.el.firstChild,
			tHead = otable.createTHead(), otd, otr = tHead.insertRow(-1);
		otr.style.height = '0';
		for (i = 0; i < columnCnt; i++) {
			otd = otr.insertCell(-1);
			otd.style.width = arrLabelWidth[i] + 'px';
			otd.style.height = '0';
			otd = otr.insertCell(-1);
			otd.style.height = '0';
		}
		
		var oldRowNo = -1, oldC = -1, rowNo, odiv, oLabel, fldName, editor, fldCtrl, dbCtrl;
		Z.preRowIndex = -1;
		for (i = 0; i < fcnt; i++) {
			fldObj = visibleFlds[i];
			fldName = fldObj.name();
			rowNo = Math.floor(i / columnCnt);
			c = i % columnCnt;
			if (oldRowNo != rowNo) {
				otr = otable.insertRow(-1);
				if (Z._rowHeight) {
					otr.style.height = Z._rowHeight + 'px';
				}
				oldRowNo = rowNo;
			}
			
			otd = otr.insertCell(-1);
			otd.noWrap = true;
			otd.className = jslet.ui.htmlclass.DBINSPECTOR.labelColCls;
			
			oLabel = document.createElement('label');
			otd.appendChild(oLabel);
			dbCtrl = new jslet.ui.DBLabel(oLabel, {
				type: 'DBLabel',
				dataset: Z._dataset,
				field: fldName
			});
			Z.addChildControl(dbCtrl);
			
			otd = otr.insertCell(-1);
			otd.className = jslet.ui.htmlclass.DBINSPECTOR.editorColCls;
			otd.noWrap = true;
			otd.align = 'left';
			odiv = document.createElement('div');
			odiv.noWrap = true;
			otd.appendChild(odiv);
			fldCtrl = fldObj.editControl();
			fldCtrl.dataset = Z._dataset;
			fldCtrl.field = fldName;
			
			editor = jslet.ui.createControl(fldCtrl, odiv);
			if (!editor.isCheckBox) {
				editor.el.style.width = '100%';//editorWidth - 10 + 'px';
			}
			Z.addChildControl(editor);
		} // end for
	},
	
	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		if(metaName && (metaName == 'visible' || metaName == 'editControl')) {
			this._metaChangedDebounce.call(this);
		}
	}
});

jslet.ui.htmlclass.DBINSPECTOR = {
	labelColCls: 'jl-inspector-label',
	editorColCls: 'jl-inspector-editor'
};

jslet.ui.register('DBInspector', jslet.ui.DBInspector);
jslet.ui.DBInspector.htmlTemplate = '<div></div>';
