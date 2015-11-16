/* ========================================================================
 * Jslet framework: jslet.dbrating.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBRating. 
 * A control which usually displays some star to user, and user can click to rate something. Example:
 * <pre><code>
 * var jsletParam = {type:"DBRating",dataset:"employee",field:"grade", itemCount: 5};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBRating",dataset:"employee",field:"grade"', itemCount: 5' />
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
jslet.ui.DBRating = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,itemCount,splitCountitemWidth';
		/**
		 * {Integer} Rate item count, In other words, the count of 'Star' sign.
		 */
		Z._itemCount = 5;
		/**
		 * {Integer} You can use it to split the 'Star' sign to describe decimal like: 1.5, 1.25.
		 * SplitCount equals 2, that means cut 'Star' sign into two part, it can express: 0, 0.5, 1, 1.5, ...
		 */
		Z._splitCount = 1;
		/**
		 * {Integer} The width of one 'Star' sign.
		 */
		Z._itemWidth = 20;
		/**
		 * {Boolean} Required or not. If it is not required, you can rate 0 by double clicking first item. 
		 */
		Z._required = false;
		/**
		 * {Boolean} read only or not.
		 */
		Z._readOnly = false;
		
		$super(el, params);
	},

	itemCount: function(itemCount) {
		if(itemCount === undefined) {
			return this._itemCount;
		}
		jslet.Checker.test('DBRating.itemCount', itemCount).isGTZero();
		this._itemCount = parseInt(itemCount);
	},

	splitCount: function(splitCount) {
		if(splitCount === undefined) {
			return this._splitCount;
		}
		jslet.Checker.test('DBRating.splitCount', splitCount).isGTZero();
		this._splitCount = parseInt(splitCount);
	},

	itemWidth: function(itemWidth) {
		if(itemWidth === undefined) {
			return this._itemWidth;
		}
		jslet.Checker.test('DBRating.itemWidth', itemWidth).isGTZero();
		this._itemWidth = parseInt(itemWidth);
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

		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.on('mousedown', 'td', Z._mouseDown);
		jqEl.on('mousemove', 'td', Z._mouseMove);
		jqEl.on('mouseout', 'td', Z._mouseOut);
		jqEl.on('mouseup', 'td', Z._mouseUp);
	}, // end bind

	_mouseMove: function domove(event) {
		event = jQuery.event.fix( event || window.event );
		var rating = event.delegateTarget, Z = rating.jslet;
		if (Z._readOnly) {
			return;
		}
		var jqRating = jQuery(rating),
			x1 = event.pageX - jqRating.offset().left,
			k = Math.ceil(x1 / Z.splitWidth), offsetW,
			oRow = rating.firstChild.rows[0],
			itemCnt = oRow.cells.length;

		var valueNo = this.cellIndex + 1;
		for (var i = 0; i < itemCnt; i++) {
			var oitem = oRow.cells[i];
			Z._setBackgroundPos(oitem, Z._getPosX(i % Z._splitCount, i < valueNo ? 1: 2));
		}
	},

	_mouseOut: function doout(event) {
		event = jQuery.event.fix( event || window.event );
		var Z = event.delegateTarget.jslet;
		if (Z._readOnly) {
			return;
		}
		Z.doValueChanged();
	},

	_mouseDown: function dodown(event) {
		event = jQuery.event.fix( event || window.event );
		var rating = event.delegateTarget,
		Z = rating.jslet;
		if (Z._readOnly) {
			return;
		}
		var oRow = rating.firstChild.rows[0],
			itemCnt = oRow.cells.length;
		
		//if can set zero and current item is first one, then clear value
		var k = this.cellIndex+1;
		if (!Z._required && k == 1) {
			k = (Z.value * Z._splitCount) == 1 ? 0 : 1;
		}
		Z.value = k / Z._splitCount;
		Z._dataset.setFieldValue(Z._field, Z.value, Z._valueIndex);
		Z.doValueChanged();
	},

	_mouseUp: function(event) {
		event = jQuery.event.fix( event || window.event );
		var rating = event.delegateTarget,
			oRow = rating.firstChild.rows[0],
			Z = rating.jslet;
		if (Z._readOnly) {
			return;
		}
		if (Z._selectedItem >= 0) {
			var oitem = oRow.cells[Z._selectedItem];
			Z._setBackgroundPos(oitem, Z._selectedPx);
		}
	},

	_getPosX: function(index, status){
		var Z = this, isRtl = jslet.locale.isRtl,bgX;
		bgX = 0 - status * Z._itemWidth;
		if (isRtl){
			bgX += (index+1)*Z.splitWidth - Z._itemWidth;
		} else {
			bgX -= index * Z.splitWidth;
		}
		return bgX;
	},
	
	_setBackgroundPos: function (oitem, posX) {
		if (oitem.style.backgroundPositionX !== undefined) {
			oitem.style.backgroundPositionX = posX + 'px';
		} else {
			oitem.style.backgroundPosition = posX + 'px 0px';
		}
	},

	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			Z._readOnly = fldObj.disabled() || fldObj.readOnly();
		}
		if(!metaName || metaName == "required") {
			Z._required = fldObj.required();
		}
	},
	
	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field),
			value = Z.getValue(),
			itemCnt = Z._itemCount * Z._splitCount,
			valueNo = Math.ceil(value * Z._splitCount),
			oitem, offsetW, bgX, ratingRow = Z.el.firstChild.rows[0],
			bgW = Z._itemWidth * 2,
			isRtl = jslet.locale.isRtl;
		
		Z.value = value;
		for (var i = 0; i < itemCnt; i++) {
			oitem = ratingRow.childNodes[i];
			Z._setBackgroundPos(oitem, Z._getPosX(i % Z._splitCount, i < valueNo ? 0: 2));
		}
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, 
			fldObj = Z._dataset.getField(Z._field);
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-rating')) {
			jqEl.addClass('jl-rating');
		}
		jqEl.html('<table border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;border-collapse:collapse"><tr></tr></table>');

		var oitem, itemCnt = Z._itemCount * Z._splitCount,
			otr = Z.el.firstChild.rows[0];
			
		Z.splitWidth = parseInt(Z._itemWidth / Z._splitCount);
		for (var i = 1; i <= itemCnt; i++) {
			oitem = document.createElement('td');
			oitem.className = 'jl-rating-item';
			oitem.style.width = Z.splitWidth + 'px';
			oitem.style.height = Z._itemWidth + 'px';
			oitem.title = i / Z._splitCount;
			otr.appendChild(oitem);
		}
		jqEl.width(Z._itemCount * Z._itemWidth);
		Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}, // end renderAll

	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(Z.el);
		jqEl.off();
		
		$super();
	}
});

jslet.ui.DBRating.CHECKED = 0;
jslet.ui.DBRating.UNCHECKED = 1;
jslet.ui.DBRating.FOCUS = 2;

jslet.ui.register('DBRating', jslet.ui.DBRating);
jslet.ui.DBRating.htmlTemplate = '<Div></Div>';
