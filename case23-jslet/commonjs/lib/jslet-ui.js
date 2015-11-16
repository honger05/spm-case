/* ========================================================================
 * Jslet framework: jslet.uicommon.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

if(!jslet.ui) {
	jslet.ui = {};
}

jslet.ui.htmlclass = {};
jslet.ui.GlobalZIndex = 100;

/**
* Popup Panel. Example: 
* <pre><code>
* var popPnl = new jslet.ui.PopupPanel();
* popPnl.setContent(document.getElementById('id'));
* popPnl.show(10, 10, 100, 100);
* 
* popPnl.hide(); //or
* popPnl.destroy();
* </code></pre>
*  
*/
jslet.ui.KeyCode = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	TAB: 9,
	ENTER: 13
};

jslet.ui.PopupPanel = function () {
	/**
	 * Event handler when hide popup panel: function(){}
	 */
	this.onHidePopup = null;

	this.isShowing = false;
	/**
	 * Private document click handler
	 */
	this.documentClickHandler = function (event) {
		event = jQuery.event.fix( event || window.event );
		var srcEle = event.target;
		if (jslet.ui.isChild(jslet.ui.PopupPanel.excludedElement,srcEle) ||
			jslet.ui.inPopupPanel(srcEle)) {
			return;
		}
		if (jslet.ui._activePopup) {
			jslet.ui._activePopup.hide();
		}
	};

	this._stopMouseEvent = function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
	};
	
	/**
	 * Private, create popup panel
	 */
	this._createPanel = function () {
		if (!jslet.ui._popupPanel) {
			var p = document.createElement('div');
			p.style.display = 'none';
			p.className = 'jl-popup-panel jl-opaque jl-border-box dropdown-menu';
			p.style.position = 'absolute';
			p.style.zIndex = 99000;
			document.body.appendChild(p);
			
			jQuery(document).on('click', this.documentClickHandler);
//			jQuery(p).on('click', this._stopMouseEvent);
//			jQuery(p).on('mousedown', this._stopMouseEvent);
//			jQuery(p).on('mouseup', this._stopMouseEvent);
			jslet.ui._popupPanel = p;
		}
	};
	
	/**
	 * Show popup panel in specified position with specified size.
	 * 
	 * @param {Integer} left Left position
	 * @param {Integer} top Top position
	 * @param {Integer} width Popup panel width
	 * @param {Integer} height Popup panel height
	 * 
	 */
	this.show = function (left, top, width, height, ajustX, ajustY) {
		this._createPanel();
		left = parseInt(left);
		top = parseInt(top);
		
		if (height) {
			jslet.ui._popupPanel.style.height = parseInt(height) + 'px';
		}
		if (width) {
			jslet.ui._popupPanel.style.width = parseInt(width) + 'px';
		}
		var jqWin = jQuery(window),
			winWidth = jqWin.scrollLeft() + jqWin.width(),
			winHeight = jqWin.scrollTop() + jqWin.height(),
			panel = jQuery(jslet.ui._popupPanel),
			w = panel.outerWidth(),
			h = panel.outerHeight();
		/*
		if (left - obody.scrollLeft + w > obody.clientWidth) {
			left -= w;
		}
		if (top - obody.scrollTop + h > obody.clientHeight) {
			top -= (h + ajustY);
		}
		*/
		if (jslet.locale.isRtl) {
			left -= w;
		}
		if(left + w > winWidth) {
			left += winWidth - left - w - 1;
		}
		if(top + h > winHeight) {
			top -= (h + ajustY);
		}
		if(left < 0) {
			left = 1;
		}
		if(top < 0) {
			top = 1;
		}
		
		if (top) {
			jslet.ui._popupPanel.style.top = top + 'px';
		}
		if (left) {
			jslet.ui._popupPanel.style.left = left + 'px';
		}
		jslet.ui._popupPanel.style.display = 'block';

		var shadow = jslet.ui._popupShadow;
		if(shadow) {
			shadow.style.width = w + 'px';
			shadow.style.height = h + 'px';
			shadow.style.top = top + 2 + 'px';
			shadow.style.left = left + 2 + 'px';
			shadow.style.display = 'block';
		}
		jslet.ui._activePopup = this;
		this.isShowing = true;
	};

	/**
	 * Set popup panel content.
	 * 
	 * @param {Html Element} content popup panel content
	 * @param {String} content width;
	 * @param {String} cotnent height;
	 */
	this.setContent = function (content, width, height) {
		this._createPanel();
		var oldContent = jslet.ui._popupPanel.childNodes[0];
		if (oldContent) {
			jslet.ui._popupPanel.removeChild(oldContent);
		}
		jslet.ui._popupPanel.appendChild(content);
		content.style.border = 'none';
		if(width) {
			content.style.width = width;
		}
		if(height) {
			content.style.height = height;
		}
	};

	/**
	 * Get popup Panel. You can use this method to customize popup panel.
	 * 
	 * @return {Html Element}
	 * 
	 */
	this.getPopupPanel = function () {
		this._createPanel();
		return jslet.ui._popupPanel;
	};

	/**
	 * Destroy popup panel completely.
	 */
	this.destroy = function () {
		if (!jslet.ui._popupPanel) {
			return;
		}
		this.isShowing = false;
		document.body.removeChild(jslet.ui._popupPanel);
		if(jslet.ui._popupShadow) {
			document.body.removeChild(jslet.ui._popupShadow);
		}
		jQuery(this._popupPanel).off();
		jslet.ui._popupPanel = null;
		jslet.ui._popupShadow = null;
		this.onHidePopup = null;
		jQuery(document).off('click', this.documentClickHandler);
	};

	/**
	 * Hide popup panel, and you can show it again.
	 * 
	 */
	this.hide = function () {
		if (jslet.ui._popupPanel) {
			jslet.ui._popupPanel.style.display = 'none';
			if(jslet.ui._popupShadow) {
				jslet.ui._popupShadow.style.display = 'none';
			}
		}
		if (this.onHidePopup) {
			this.onHidePopup();
		}
		this.isShowing = false;
		delete jslet.ui._activePopup;
	};
};

/**
* Check if a html element is in an active popup or not
* 
* @param {Html Element} htmlElement Checking html element
* 
* @return {Boolean} True - In popup panel, False - Otherwise
*/
jslet.ui.inPopupPanel = function (htmlElement) {
	if (!htmlElement || htmlElement == document) {
		return false;
	}
	if (jQuery(htmlElement).hasClass('jl-popup-panel')) {
		return true;
	} else {
		return jslet.ui.inPopupPanel(htmlElement.parentNode);
	}
};

/**
* Get the specified level parent element. Example:
* <pre><code>
*  //html snippet is: body -> div1 -> div2 ->table
*  jslet.ui.getParentElement(div2); // return div1
*  jslet.ui.getParentElement(div2, 2); //return body 
* </code></pre>
* 
* @param {Html Element} htmlElement html element as start point
* @param {Integer} level level
* 
* @return {Html Element} Parent element, if not found, return null.
*/
jslet.ui.getParentElement = function (htmlElement, level) {
	if (!level) {
		level = 1;
	}
	var flag = htmlElement.parentElement ? true : false,
	result = htmlElement;
	for (var i = 0; i < level; i++) {
		if (flag) {
			result = result.parentElement;
		} else {
			result = result.parentNode;
		}
		if (!result) {
			return null;
		}
	}
	return result;
};

/**
* Find first parent with specified condition. Example:
* <pre><code>
*   //Html snippet: body ->div1 ->div2 -> div3
*	var odiv = jslet.ui.findFirstParent(
*		odiv3, 
*		function (node) {return node.class == 'head';},
*		function (node) {return node.tagName != 'BODY'}
*   );
* </code></pre>
* 
* @param {Html Element} element The start checking html element
* @param {Function} conditionFn Callback function: function(node}{...}, node is html element;
*			if conditionFn return true, break finding and return 'node'
* @param {Function} stopConditionFn Callback function: function(node}{...}, node is html element;
*			if stopConditionFn return true, break finding and return null
* 
* @return {Html Element} Parent element or null
*/
jslet.ui.findFirstParent = function (htmlElement, conditionFn, stopConditionFn) {
	var p = htmlElement;
	if (!p) {
		return null;
	}
	if (!conditionFn) {
		return p.parentNode;
	}
	if (conditionFn(p)) {
		return p;
	} else {
		if (stopConditionFn && stopConditionFn(p.parentNode)) {
			return null;
		}
		return jslet.ui.findFirstParent(p.parentNode, conditionFn, stopConditionFn);
	}
};

/**
 * Find parent element that has 'jslet' property
 * 
 * @param {Html Element} element The start checking html element
 * @return {Html Element} Parent element or null
 */
jslet.ui.findJsletParent = function(element){
	return jslet.ui.findFirstParent(element, function(ele){
		return ele.jslet ? true:false; 
	});
};

/**
 * Check one node is a child of another node or not.
 * 
 * @param {Html Element} parentNode parent node;
 * @param {Html Element} testNode, testing node
 * @return {Boolean} true - 'testNode' is a child of 'parentNode', false - otherwise.
 */
jslet.ui.isChild = function(parentNode, testNode) {
	if(!parentNode || !testNode) {
		return false;
	}
	var p = testNode;
	while(p) {
		if(p == parentNode) {
			return true;
		}
		p = p.parentNode;
	}
	return false;
};

/**
* Text Measurer, measure the display width or height of the given text. Example:
* <pre><code>
*   jslet.ui.textMeasurer.setElement(document.body);
*   try{
		var width = jslet.ui.textMeasurer.getWidth('HellowWorld');
		var height = jslet.ui.textMeasurer.getHeight('HellowWorld');
	}finally{
		jslet.ui.textMeasurer.setElement();
	}
* </code></pre>
* 
*/
jslet.ui.TextMeasurer = function () {
	var rule,felement = document.body,felementWidth;

	var lastText = null;
	
	var createRule = function () {
		if (!rule) {
			rule = document.createElement('div');
			document.body.appendChild(rule);
			rule.style.position = 'absolute';
			rule.style.left = '-9999px';
			rule.style.top = '-9999px';
			rule.style.display = 'none';
			rule.style.margin = '0px';
			rule.style.padding = '0px';
			rule.style.overflow = 'hidden';
		}
		if (!felement) {
			felement = document.body;
		}
	};

	/**
	 * Set html element which to be used as rule. 
	 * 
	 * @param {Html Element} element 
	 */
	this.setElement = function (element) {
		felement = element;
		if (!felement) {
			return;
		}
		createRule();
		rule.style.fontSize = felement.style.fontSize;
		rule.style.fontStyle = felement.style.fontStyle;
		rule.style.fontWeight = felement.style.fontWeight;
		rule.style.fontFamily = felement.style.fontFamily;
		rule.style.lineHeight = felement.style.lineHeight;
		rule.style.textTransform = felement.style.textTransform;
		rule.style.letterSpacing = felement.style.letterSpacing;
	};

	this.setElementWidth = function (width) {
		felementWidth = width;
		if (!felement) {
			return;
		}
		if (width) {
			felement.style.width = width;
		} else {
			felement.style.width = '';
		}
	};

	function updateText(text){
		if (lastText != text) {
			rule.innerHTML = text;
		}
	}
	
	/**
	 * Get the display size of specified text
	 * 
	 * @param {String} text The text to be measured
	 * 
	 * @return {Integer} Display size, unit: px
	 */
	this.getSize = function (text) {
		createRule();
		updateText(text);
		var ruleObj = jQuery(rule);
		return {width:ruleObj.width(),height:ruleObj.height()};
	};

	/**
	 * Get the display width of specified text
	 * 
	 * @param {String} text The text to be measured
	 * 
	 * @return {Integer} Display width, unit: px
	 */
	this.getWidth = function (text) {
		return this.getSize(text).width;
	};

	/**
	 * Get the display height of specified text
	 * 
	 * @param {String} text The text to be measured
	 * 
	 * @return {Integer} Display height, unit: px
	 */
	this.getHeight = function (text) {
		return this.getSize(text).height;
	};
};

jslet.ui.textMeasurer = new jslet.ui.TextMeasurer();

/**
 * Get css property value. Example:
 * <pre><code>
 * var width = jslet.ui.getCssValue('fooClass', 'width'); //Return value like '100px' or '200em'
 * </code></pre>
 * 
 * @param {String} className Css class name.
 * @param {String} styleName style name
 * 
 * @return {String} Css property value.
 */
jslet.ui.getCssValue = function(className, styleName){
	var odiv = document.createElement('div');
	odiv.className = className;
	odiv.style.display = 'none';
	document.body.appendChild(odiv);
	var result = jQuery(odiv).css(styleName);
	
	document.body.removeChild(odiv);
	return result;
};

jslet.ui.setEditableStyle = function(formElement, disabled, readOnly, onlySetStyle) {
	if(!onlySetStyle) {
		formElement.disabled = disabled;
		formElement.readOnly = readOnly;
	}
	var jqEl = jQuery(formElement);
	if(disabled || readOnly) {
		if (!jqEl.hasClass('jl-readonly')) {
			jqEl.addClass('jl-readonly');
		}
	} else {
		jqEl.removeClass('jl-readonly');
	}
};

/**
 * Get system scroll bar width
 * 
 * @return {Integer} scroll bar width
 */
jslet.scrollbarSize = function() {
	var parent, child, width, height;

	if (width === undefined) {
		parent = jQuery('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
		child = parent.children();
		width = child.innerWidth() - child.height(99).innerWidth();
		parent.remove();
	}

	return width;
};
	/* ========================================================================
 * Jslet framework: jslet.control.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

if(!jslet.ui) {
	jslet.ui = {};
}

/**
* @class
* Control Class, base class for all control
*/
jslet.ui.Control = jslet.Class.create({
	/**
	 * Constructor method
	 * 
	 * @param {Html Element} el Html element
	 * @param {String or Object} ctrlParams Parameters of this control, 
	 * it would be a JSON string or plan object, like: '{prop1: value1, prop2: value2}';
	 */
	initialize: function (el, ctrlParams) {
		this.el = el;

		this.allProperties = null;
		ctrlParams = jslet.ui._evalParams(ctrlParams);
		if (this.isValidTemplateTag	&& !this.isValidTemplateTag(this.el)) {
			var ctrlClass = jslet.ui.getControlClass(ctrlParams.type), template;
			if (ctrlClass) {
				template = ctrlClass.htmlTemplate;
			} else {
				template = '';
			}
			throw new Error(jslet.formatString(jslet.locale.DBControl.invalidHtmlTag, template));
		}

		this.setParams(ctrlParams);
		this.checkRequiredProperty();
		this.el.jslet = this;
		this.beforeBind();
		this.bind();
		this.afterBind();
	},

	beforeBind: function() {
		
	},
	
	bind: function() {
		
	},
	
	afterBind: function() {
		
	},
	
	/**
	 * @protected
	 */
	setParams: function (ctrlParams) {
		if (!ctrlParams) {
			return;
		}
		
		for(var name in ctrlParams) {
			var prop = this[name];
			if(name == 'type') {
				continue;
			}
			if(prop && prop.call) {
				prop.call(this, ctrlParams[name]);
			} else {
				throw new Error("Not support control property: " + name);
			}
		}
	},

	/**
	 * @private
	 */
	checkRequiredProperty: function () {
		if (!this.requiredProperties) {
			return;
		}
		var arrProps = this.requiredProperties.split(','),
		cnt = arrProps.length, name;
		for (var i = 0; i < cnt; i++) {
			name = arrProps[i].trim();
			if (!this[name]) {
				throw new Error(jslet.formatString(jslet.locale.DBControl.expectedProperty, [name]));
			}
		}//end for
	},
	
	/**
	 * Destroy method
	 */
	destroy: function(){
		this.el.jslet = null;
		this.el = null;
	}
});

/**
 * @class
 * Base data sensitive control
 */
jslet.ui.DBControl = jslet.Class.create(jslet.ui.Control, {
	
	initialize: function ($super, el, ctrlParams) {
		$super(el, ctrlParams);
	},

	_dataset: undefined,

	/**Inner use**/
	_currRecno: -1,
	
	dataset: function(dataset) {
		if(dataset === undefined) {
			return this._dataset;
		}

		if (jslet.isString(dataset)) {
			dataset = jslet.data.dataModule.get(jQuery.trim(dataset));
		}
		
		jslet.Checker.test('DBControl.dataset', dataset).required().isClass(jslet.data.Dataset.className);
		this._dataset = dataset;
	},

	/**
	 * DBTable uses this property.
	 */
	currRecno: function(currRecno) {
		if(currRecno === undefined) {
			return this._currRecno;
		}

		jslet.Checker.test('DBControl.currRecno', currRecno).isGTEZero();
		this._currRecno = currRecno;
	},
	
	/**
	 * @protected
	 */
	setParams: function ($super, ctrlParams) {
		$super(ctrlParams);
		if(!this._dataset) {
			var dsName = this.getDatasetInParentElement();
			this.dataset(dsName);
		}
	},
	
	/**
	 * @override
	 * Call this method before binding parameters to a HTML element, you can rewrite this in your owner control
	 * @param {String or Object} ctrlParams Parameters of this control, it would be a json string or object, like: '{prop1: value1, prop2: value2}';
	 * 
	 */
	beforeBind: function ($super) {
		$super();
		this._dataset.addLinkedControl(this);
	},

	checkRequiredProperty: function($super) {
		jslet.Checker.test('DBControl.dataset', this._dataset).required();
		$super();
	},
	
	/**
	 * Refresh control when data changed.
	 * There are three type changes: meta changed, data changed, lookup data changed.
	 * 
	 * @param {jslet.data.refreshEvent} evt jslet refresh event object;
	 * @isForce {Boolean} Identify refresh control anyway or not.
	 * 
	 * @return {Boolean} if refresh successfully, return true, otherwise false.
	 */
	refreshControl: function (evt, isForce) {
		var Z = this;
		if (!isForce && !Z.isActiveRecord()) {
			return false;
		}
		var evtType = evt.eventType;
		//Value changed
		if (evtType == jslet.data.RefreshEvent.SCROLL || 
				evtType == jslet.data.RefreshEvent.INSERT ||
				evtType == jslet.data.RefreshEvent.DELETE) {
			Z.doValueChanged();
			return true;
		}
		if((evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN) && 
			evt.fieldName == Z._field){
			Z.doValueChanged();
			return true;
		}
		// Meta changed 
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA &&
				Z._field == evt.fieldName) {
			Z.doMetaChanged(evt.metaName);
			return true;
		}

		//Lookup data changed
		if(evtType == jslet.data.RefreshEvent.UPDATELOOKUP && evt.fieldName == Z._field) {
			Z.doLookupChanged();
			return true;
		}
		if(evtType == jslet.data.RefreshEvent.UPDATEALL) {
			Z.doMetaChanged();
			Z.doLookupChanged();
			Z.doValueChanged();
			return true;
		}
		
		return true;
	}, // end refreshControl
	
	/**
	 * 
	 */
	doMetaChanged: function(metaName){},
	
	doValueChanged: function() {},
	
	doLookupChanged: function() {},
	
	/**
	 * @private
	 */
	getDatasetInParentElement: function () {
		var el = this.el, pEl = null;
		while (true) {
			pEl = jslet.ui.getParentElement(el, 1);
			if (!pEl) {
				break;
			}
			if (pEl.jslet) {
				return pEl.jslet.dataset;
			}
			el = pEl;
		} //end while
		return null;
	},

	/**
	 * Check if this control is in current record.
	 * In DBTable edit mode, one field corresponds many edit control(one row one edit control), but only one edit control is in active record.
	 * Normally, only edit control in active record will refresh.  
	 */
	isActiveRecord: function(){
		return this._currRecno < 0 || this._currRecno == this._dataset.recno();
	},
	
	/**
	 * Force refresh control, regardless of which in active record or not.
	 */
	forceRefreshControl: function(){
		this.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(this._field), true);
	},
	
	destroy: function ($super) {
		if (this._dataset) {
			this._dataset.removeLinkedControl(this);
		}
		this._dataset = null;
		$super();
	}
});

/**
 * @class
 * Base data sensitive control
 */
jslet.ui.DBFieldControl = jslet.Class.create(jslet.ui.DBControl, {
	initialize: function ($super, el, ctrlParams) {
		$super(el, ctrlParams);
	},

	_field: undefined,
	_valueIndex: undefined,
	_enableInvalidTip: true,
	
	field: function(fldName) {
		if(fldName === undefined) {
			return this._field;
		}
		
		fldName = jQuery.trim(fldName);
		jslet.Checker.test('DBControl.field', fldName).isString().required();
		var k = fldName.lastIndexOf('#');
		if(k > 0) {
			this._fieldMeta = fldName.substring(k+1);
			fldName = fldName.substring(0, k);
		}
		
		this._field = fldName;
	},
	
	fieldMeta: function() {
		return this._fieldMeta;
	},
	
	valueIndex: function(valueIndex) {
		if(valueIndex === undefined) {
			return this._valueIndex;
		}
		jslet.Checker.test('DBControl.valueIndex', valueIndex).isNumber();
		
		this._valueIndex = parseInt(valueIndex);
	},
	
	/**
	 * @override
	 */
	setParams: function ($super, ctrlParams) {
		$super(ctrlParams);
		value = ctrlParams.valueIndex;
		if (value !== undefined) {
			this.valueIndex(value);
		}
	},
 
	checkRequiredProperty: function($super) {
		$super();
		jslet.Checker.test('DBControl.field', this._field).required();
		this.existField(this._field);
	},

	doMetaChanged: function($super, metaName){
		$super(metaName);
		if(!metaName || metaName == 'tip') {
			var fldObj = this._dataset.getField(this._field);
			if(!fldObj) {
				throw new Error('Field: ' + this._field + ' NOT exist!');
			}
			var tip = fldObj.tip();
			tip = tip ? tip: '';
			this.el.title = tip;
		}
	},
	
	existField: function(fldName) {
		fldObj = this._dataset.getField(fldName);
		return fldObj ? true: false;
	},
	
	/**
	 * @protected
	 * Render invalid message and change the control to "invalid" style.
	 * 
	 *  @param {String} invalidMsg Invalid message, if it's null, clear the 'invalid' style. 
	 */
	renderInvalid: function () {
		var Z = this;
		if (!Z._field) {
			return;
		}
		var fldObj = Z.dataset().getField(Z._field);
		var invalidMsg = fldObj.message(Z._valueIndex);
		if (invalidMsg){
			jQuery(Z.el).parent().addClass('has-error');
		} else {
			jQuery(Z.el).parent().removeClass('has-error');
		}
		if(!jslet.ui.globalTip) {
			Z.el.title = invalidMsg || '';
		}
	},
 
	destroy: function ($super) {
		this._field = null;
		$super();
	}
	
});

/**
* @private
* Convert string parameters to object
* 
* @param {String or Object} ctrlParams Control parameters.
* @return {Object}
*/
jslet.ui._evalParams = function (ctrlParams) {
	jslet.Checker.test('evalParams#ctrlParams', ctrlParams).required();
	if (jslet.isString(ctrlParams)) {
		var p = jQuery.trim(ctrlParams);
		if (!p.startsWith('{') && p.indexOf(':')>0) {
			p = '{' + p +'}';
		}
		try {
			ctrlParams = new Function('return ' + p)();
			if(ctrlParams['var']) {
				ctrlParams = ctrlParams['var'];
			}
			return ctrlParams;
		} catch (e) {
			throw new Error(jslet.formatString(jslet.locale.DBControl.invalidJsletProp, [ctrlParams]));
		}
	}
	return ctrlParams;
};

/**
* Hold all jslet control's configurations
*/
jslet.ui.controls = new jslet.SimpleMap();

/**
* Register jslet control class.
* <pre><code>
* jslet.ui.register('Accordion', jslet.ui.Accordion);
* </code></pre>
* 
* @param {String} ctrlName Control name.
* @param {jslet.Class} ctrlType Control Class
*/
jslet.ui.register = function (ctrlName, ctrlType) {
	jslet.ui.controls.set(ctrlName.toLowerCase(), ctrlType);
};

/**
* Create jslet control according to control configuration, and add it to parent element.
* 
* @param {String or Object} jsletparam Jslet Parameter
* @param {Html Element} parent Parent html element which created control will be added to.
* @param {Integer} width Control width, unit: px;
* @param {Integer} height Control height, Unit: px; 
* @return {jslet control}
*/
jslet.ui.createControl = function (jsletparam, parent, width, height) {
	var isAuto = false, 
		pnode = parent,
		container = document.createElement('div'),
		ctrlParam = jslet.ui._evalParams(jsletparam),
		controlType = ctrlParam.type;
	if (!controlType) {
		controlType = jslet.ui.controls.DBTEXT;
	}
	var ctrlClass = jslet.ui.controls.get(controlType.toLowerCase());
	if (!ctrlClass) {
		throw new Error('NOT found control type: ' + controlType);
	}
	container.innerHTML = ctrlClass.htmlTemplate;

	var el = container.firstChild;
	container.removeChild(el);
	
	if (parent) {
		parent.appendChild(el);
	} else {
//		el.style.display = 'none';
		document.body.appendChild(el);
	}
	if (width) {
		if (parseInt(width) == width)
			width = width + 'px';
		el.style.width = width; // parseInt(width) + 'px';
	}
	if (height) {
		if (parseInt(height) == height)
			height = height + 'px';
		el.style.height = height; // parseInt(height) + 'px';
	}

	return new ctrlClass(el, ctrlParam);
};

/**
 * Get jslet class with class name.
 * 
 * @param {String} name Class name.
 * @return {jslet.Class}
 */
jslet.ui.getControlClass = function (name) {
	return jslet.ui.controls.get(name.toLowerCase());
};

/**
* Bind jslet control to an existing html element.
* 
* @param {Html Element} el Html element
* @param {String or Object} jsletparam Control parameters
*/
jslet.ui.bindControl = function (el, jsletparam) {
	if (!jsletparam)
		jsletparam = jQuery(el).attr('data-jslet');

	var ctrlParam = jslet.ui._evalParams(jsletparam);
	var controlType = ctrlParam.type;
	if (!controlType) {
		el.jslet = ctrlParam;
		return;
	}
	var ctrlClass = jslet.ui.controls.get(controlType.toLowerCase());
	if (!ctrlClass) {
		throw new Error('NOT found control type: ' + controlType);
	}
	new ctrlClass(el, ctrlParam);
};

/**
* Scan the specified html element children and bind jslet control to these html element with 'data-jslet' attribute.
* 
* @param {Html Element} pElement Parent html element which need to be scan, if null, document.body used.
* @param {Function} onJsletReady Call back function after jslet installed.
*/
jslet.ui.install = function (pElement, onJsletReady) {
	if(pElement && (onJsletReady === undefined)) {
		//Match case: jslet.ui.install(onJsletReady);
		if(jQuery.isFunction(pElement)) {
			onJsletReady = pElement;
			pElement = null;
		}
	}
	
	if(!pElement && jslet.locale.isRtl){
		var jqBody = jQuery(document.body);
		if(!jqBody.hasClass('jl-rtl')) {
			jqBody.addClass('jl-rtl');
		}
	}
	var htmlTags;
	if (!pElement){
		pElement = document.body;
	}
	htmlTags = jQuery(pElement).find('*[data-jslet]');

	var cnt = htmlTags.length, el;
	for (var i = 0; i < cnt; i++) {
		el = htmlTags[i];
		jslet.ui.bindControl(el);
	}
	if(onJsletReady){
		onJsletReady();
		//jslet.ui.onReady();
	}
};

///**
// * {Event} Fired after jslet has installed all controls.
// * Pattern: function(){};
// */
//jslet.ui.onReady = null;

/**
* Scan the specified html element children and unbind jslet control to these html element with 'data-jslet' attribute.
* 
* @param {Html Element} pElement Parent html element which need to be scan, if null, document.body used.
*/
jslet.ui.uninstall = function (pElement) {
	var htmlTags;
	if (!pElement) {
		htmlTags = jQuery('*[data-jslet]');
	} else {
		htmlTags = jQuery(pElement).find('*[data-jslet]');
	}
	var el;
	for(var i =0, cnt = htmlTags.length; i < cnt; i++){
		el = htmlTags[i];
		if (el.jslet && el.jslet.destroy) {
			el.jslet.destroy();
		}
		el.jslet = null;
	}
	if(jslet.ui.menuManager) {
		jQuery(document).off('mousedown', jslet.ui.menuManager.hideAll);
	}
//	jslet.ui.onReady = null;
};
/* ========================================================================
 * Jslet framework: jslet.dnd.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */
if(!jslet.ui) {
	jslet.ui = {};
}

/**
* Drag & Drop. A common framework to implement drag & drop. Example:
* <pre><code>
*   //Define a delegate class
*   dndDelegate = {}
*   dndDelegate._doDragStart = function(){}
*   dndDelegate._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {}
*   dndDelegate._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {}
*   dndDelegate._doDragCancel = function () {}
* 
*   //Initialize jslet.ui.DnD
*   //var dnd = new jslet.ui.DnD();
*   //Or use global jslet.ui.DnD instance to bind 'dndDelegate'
*   jslet.ui.dnd.bindControl(dndDelegate);
*	
*   //After end dragging, you need unbind it
*   jslet.ui.dnd.unbindControl();
* 
* </code></pre>
* 
*/

jslet.ui.DnD = function () {
	var oldX, oldY, x, y, deltaX, deltaY,
		dragDelta = 2, 
		dragged = false, 
		bindedControl, 
		mouseDowned = true,
		self = this;

	this._docMouseDown = function (event) {
		event = jQuery.event.fix( event || window.event );
		mouseDowned = true;
		deltaX = 0;
		deltaY = 0;
		oldX = event.pageX;
		oldY = event.pageY;
		dragged = false;

		if (bindedControl && bindedControl._doMouseDown) {
			bindedControl._doMouseDown(oldX, oldY, x, y, deltaX, deltaY);
		}
	};

	this._docMouseMove = function (event) {
		if (!mouseDowned) {
			return;
		}
		event = jQuery.event.fix( event || window.event );
		
		x = event.pageX;
		y = event.pageY;
		if (!dragged) {
			if (Math.abs(deltaX) > dragDelta || Math.abs(deltaY) > dragDelta) {
				dragged = true;
				oldX = x;
				oldY = y;
				if (bindedControl && bindedControl._doDragStart) {
					bindedControl._doDragStart(oldX, oldY);
				}
				return;
			}
		}
		deltaX = x - oldX;
		deltaY = y - oldY;
		if (dragged) {
			if (bindedControl && bindedControl._doDragging) {
				bindedControl._doDragging(oldX, oldY, x, y, deltaX, deltaY);
			}
		} else {
			if (bindedControl && bindedControl._doMouseMove) {
				bindedControl._doMouseMove(oldX, oldY, x, y, deltaX, deltaY);
			}
			oldX = x;
			oldY = y;
		}
	};

	this._docMouseUp = function (event) {
		mouseDowned = false;
		if (dragged) {
			dragged = false;
			if (bindedControl && bindedControl._doDragEnd) {
				bindedControl._doDragEnd(oldX, oldY, x, y, deltaX, deltaY);
			}
		} else {
			if (bindedControl && bindedControl._doMouseUp) {
				bindedControl._doMouseUp(oldX, oldY, x, y, deltaX, deltaY);
			}
		}
		self.unbindControl();
	};

	this._docKeydown = function (event) {
		event = jQuery.event.fix( event || window.event );
		if (event.which == 27) {//Esc key
			if (dragged) {
				dragged = false;
				if (bindedControl && bindedControl._doDragCancel) {
					bindedControl._doDragCancel();
					self.unbindControl();
				}
			}
		}
	};

	this._docSelectStart = function (event) {
		event = jQuery.event.fix( event || window.event );
		event.preventDefault();

		return false;
	};

	/**
	 * Bind control 
	 * 
	 * @param {Object} ctrl The control need drag & drop, there are four method in it: 
	 *  ctrl._doDragStart = function(){}
	 *  ctrl._doDragging = function(oldX, oldY, x, y, deltaX, deltaY){}
	 *  ctrl._doDragEnd = function(oldX, oldY, x, y, deltaX, deltaY){}
	 *  ctrl._doDragCancel = function(){}
	 *  ctrl_doDragStart = function{}
	 *  
	 */
	this.bindControl = function (ctrl) {
		bindedControl = ctrl;
		var doc = jQuery(document);
		doc.on('mousedown', this._docMouseDown);
		doc.on('mouseup', this._docMouseUp);
		doc.on('mousemove', this._docMouseMove);
		doc.on('selectstart', this._docSelectStart);
		doc.on('keydown', this._docKeydown);
	};

	/**
	 * Unbind the current control
	 */
	this.unbindControl = function () {
		var doc = jQuery(document);
		doc.off('mousedown', this._docMouseDown);
		doc.off('mouseup', this._docMouseUp);
		doc.off('mousemove', this._docMouseMove);
		doc.off('selectstart', this._docSelectStart);
		doc.off('keydown', this._docKeydown);
		
		bindedControl = null;
	};
};

jslet.ui.dnd = new jslet.ui.DnD();

/* ========================================================================
 * Jslet framework: jslet.editmask.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

if(!jslet.ui) {
	jslet.ui = {};
}

/**
 * @class EditMask
 * Create edit mask class and attach to a html text element.Example:
 * <pre><code>
 *  var mask = new jslet.ui.EditMask('L00-000');
 *  var mask.attach(htmlText);
 * </code></pre>
 * 
 * @param {String} mask Mask string, rule:
 *  '#': char set: 0-9 and -, not required, 
 *  '0': char set: 0-9, required,
 *  '9': char set: 0-9, not required,
 *  'L': char set: A-Z,a-z, required,
 *  'l': char set: A-Z,a-z, not required,
 *  'A': char set: 0-9,a-z,A-Z, required,
 *  'a': char set: 0-9,a-z,A-Z, not required,
 *  'C': char set: any char, required
 *  'c': char set: any char, not required
 *
 *@param {Boolean} keepChar Keep the literal character or not
 *@param {String} transform Transform character into UpperCase or LowerCase,
 *  optional value: upper, lower or null.
 */
jslet.ui.EditMask = function () {
	this._mask = null;
	this._keepChar = true;
	this._transform = null;

	this._literalChars = null;
	this._parsedMask = null;
	this._format = null;
	this._target = null;
	this._buffer = null;
};

jslet.ui.EditMask.prototype = {
	maskChars: {
		'#': { regexpr: new RegExp('[0-9\\-]'), required: false }, 
		'0': { regexpr: new RegExp('[0-9]'), required: true },
		'9': { regexpr: new RegExp('[0-9]'), required: false },
		'L': { regexpr: new RegExp('[A-Za-z]'), required: true },
		'l': { regexpr: new RegExp('[A-Za-z]'), required: false },
		'A': { regexpr: new RegExp('[0-9a-zA-Z]'), required: true },
		'a': { regexpr: new RegExp('[0-9a-zA-Z]'), required: false },
		'C': { regexpr: null, required: true },
		'c': { regexpr: null, required: false }
	},
	
	transforms: ['upper','lower'],

	setMask: function(mask, keepChar, transform){
		mask = jQuery.trim(mask);
		jslet.Checker.test('EditMask#mask', mask).isString();
		this._mask = mask;
		this._keepChar = keepChar ? true: false;
		
		this._transform = null;
		if(transform){
			var checker = jslet.Checker.test('EditMask#transform', transform).isString();
			transform = jQuery.trim(transform);
			transform = transform.toLowerCase();
			checker.inArray(this.transforms);
			this._transform = transform;
		}
		this._parseMask();
	},
	
	/**
	 * Attach edit mask to a html text element
	 * 
	 * @param {Html Text Element} target Html text element
	 */
	attach: function (target) {
		jslet.Checker.test('EditMask.attach#target', target).required();
		var Z = this, jqText = jQuery(target);
		Z._target = target;
		jqText.on('keypress.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			var c = event.which;
			if (c === 0) {
				return true;
			}
			if (!Z._doKeypress(c)) {
				event.preventDefault();
			} else {
				return true;
			}
		});
		jqText.on('keydown.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			if (!Z._doKeydown(event.which)) {
				event.preventDefault();
			} else {
				return true;
			}
		});

		jqText.on('blur.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			if (!Z._doBur()) {
				event.preventDefault();
				event.currentTarget.focus();
			} else {
				return true;
			}
		});

		jqText.on('cut.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			Z._doCut(event.originalEvent.clipboardData || window.clipboardData);
			event.preventDefault();
			return false;
		});

		jqText.on('paste.editmask', function (event) {
			if(this.readOnly || !Z._mask) {
				return true;
			}
			if (!Z._doPaste(event.originalEvent.clipboardData || window.clipboardData)) {
				event.preventDefault();
			}
		});
	},

	/**
	 * Detach edit mask from a html text element
	 */
	detach: function(){
		var jqText = jQuery(this._target);
		jqText.off('keypress.editmask');
		jqText.off('keydown.editmask');
		jqText.off('blur.editmask');
		jqText.off('cut.editmask');
		jqText.off('paste.editmask');
		this._target = null; 
	},
	
	setValue: function (value) {
		value = jQuery.trim(value);
		jslet.Checker.test('EditMask.setValue#value', value).isString();
		value = value ? value : '';
		if(!this._mask) {
			this._target.value = value;
			return;
		}
		
		var Z = this;
		Z._clearBuffer(0);
		var prePos = 0, pos, preValuePos = 0, k, i, 
			ch, vch, valuePos = 0, fixedChar, 
			maskLen = Z._parsedMask.length;
		while (true) {
			fixedChar = Z._getFixedCharAndPos(prePos);
			pos = fixedChar.pos;
			ch = fixedChar.ch;
			if (pos < 0) {
				pos = prePos;
			}
			if (ch) {
				valuePos = value.indexOf(ch, preValuePos);
				if (valuePos < 0) {
					valuePos = value.length;
				}
				k = -1;
				for (i = valuePos - 1; i >= preValuePos; i--) {
					vch = value.charAt(i);
					Z._buffer[k + pos] = vch;
					k--;
				}
				preValuePos = valuePos + 1;
			} else {
				k = 0;
				var c, cnt = Z._buffer.length;
				for (i = prePos; i < cnt; i++) {
					c = value.charAt(preValuePos + k);
					if (!c) {
						break;
					}
					Z._buffer[i] = c;
					k++;
				}
				break;
			}
			prePos = pos + 1;
		}
		Z._showValue();
	},
	
	getValue: function(){
		var value = this._target.value;
		if(this._keepChar) {
			return value;
		} else {
			var result = [], maskObj;
			for(var i = 0, cnt = value.length; i< cnt; i++){
				maskObj = this._parsedMask[i];
				if(maskObj.isMask) {
					result.push(value.charAt(i));
				}
			}
			return result.join('');
		}
	},
	
	validateValue: function(){
		var Z = this, len = Z._parsedMask.length, cfg;
		for(var i = 0; i< len; i++){
			cfg = Z._parsedMask[i];
			if(cfg.isMask && Z.maskChars[cfg.ch].required){
				if(Z._buffer[i] == Z._format[i]) {
					return false;
				}
			}
		}
		return true;
	},
	
	_getFixedCharAndPos: function (begin) {
		var Z = this;
		if (!Z._literalChars || Z._literalChars.length === 0) {
			return { pos: 0, ch: null };
		}
		if (!begin) {
			begin = 0;
		}
		var ch, mask;
		for (var i = begin, cnt = Z._parsedMask.length; i < cnt; i++) {
			mask = Z._parsedMask[i];
			if (mask.isMask) {
				continue;
			}
			ch = mask.ch;
			if (Z._literalChars.indexOf(ch) >= 0) {
				return { ch: ch, pos: i };
			}
		}
		return { pos: -1, ch: null };
	},

	_parseMask: function () {
		var Z = this;
		if(!Z._mask) {
			Z._parsedMask = null;
			return;
		}
		Z._parsedMask = [];
		
		Z._format = [];
		var c, prevChar = null, isMask;

		for (var i = 0, cnt = Z._mask.length; i < cnt; i++) {
			c = Z._mask.charAt(i);
			if (c == '\\') {
				prevChar = c;
				continue;
			}
			isMask = false;
			if (Z.maskChars[c] === undefined) {
				if (prevChar) {
					Z._parsedMask.push({ ch: prevChar, isMask: isMask });
				}
				Z._parsedMask.push({ ch: c, isMask: isMask });
			} else {
				isMask = prevChar ? false : true;
				Z._parsedMask.push({ ch: c, isMask: isMask });
			}
			if(Z._keepChar && !isMask){
				if(!Z._literalChars) {
					Z._literalChars = [];
				}
				var notFound = true;
				for(var k = 0, iteralCnt = Z._literalChars.length; k < iteralCnt; k++){
					if(Z._literalChars[k] == c){
						notFound = false;
						break;
					}
				}
				if(notFound) {
					Z._literalChars.push(c);
				}
			}
			prevChar = null;
			Z._format.push(isMask ? '_' : c);
		} //end for

		Z._buffer = Z._format.slice(0);
		if(Z._target) {
			Z._target.value = Z._format.join('');
		}
	},
	
	_validateChar: function (maskChar, inputChar) {
		var maskCfg = this.maskChars[maskChar];
		var regExpr = maskCfg.regexpr;
		if (regExpr) {
			return regExpr.test(inputChar);
		} else {
			return true;
		}
	},

	_getValidPos: function (pos, toLeft) {
		var Z = this, 
			cnt = Z._parsedMask.length, i;
		if (pos >= cnt) {
			return cnt - 1;
		}
		if (!toLeft) {
			for (i = pos; i < cnt; i++) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}
			for (i = pos; i >= 0; i--) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}

		} else {
			for (i = pos; i >= 0; i--) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}
			for (i = pos; i < cnt; i++) {
				if (Z._parsedMask[i].isMask) {
					return i;
				}
			}
		}
		return -1;
	},

	_clearBuffer: function (begin, end) {
		if(!this._buffer) {
			return;
		}
		if (!end) {
			end = this._buffer.length - 1;
		}
		for (var i = begin; i <= end; i++) {
			this._buffer[i] = this._format[i];
		}
	},

	_packEmpty: function (begin, end) {
		var c, k = 0, Z = this, i;
		for (i = begin; i >= 0; i--) {
			c = Z._format[i];
			if (Z._literalChars && Z._literalChars.indexOf(c) >= 0) {
				k = i;
				break;
			}
		}
		begin = k;
		var str = [];
		for (i = begin; i < end; i++) {
			c = Z._buffer[i];
			if (c != Z._format[i]) {
				str.push(c);
			}
		}
		var len = str.length - 1;

		for (i = end - 1; i >= begin; i--) {
			if (len >= 0) {
				Z._buffer[i] = str[len];
				len--;
			} else {
				Z._buffer[i] = Z._format[i];
			}
		}
	},

	_updateBuffer: function (pos, ch) {
		var begin = pos.begin, end = pos.end, Z = this;

		begin = Z._getValidPos(begin);
		if (begin < 0) {
			return -1;
		}
		Z._clearBuffer(begin + 1, end);
		if (Z._literalChars && Z._literalChars.indexOf(ch) >= 0) {
			for (var i = begin, cnt = Z._parsedMask.length; i < cnt; i++) {
				if (Z._parsedMask[i].ch == ch) {
					Z._packEmpty(begin, i);
					return i;
				}
			}
		} else {
			var maskObj = Z._parsedMask[begin];
			if (Z._validateChar(maskObj.ch, ch)) {
				Z._buffer[begin] = ch;
				return begin;
			} else	{
				return -1;
			}
		}
	},

	_moveCursor: function (begin, toLeft) {
		begin = this._getValidPos(begin, toLeft);
		if (begin >= 0) {
			jslet.ui.textutil.setCursorPos(this._target, begin);
		}
	},

	_showValue: function () {
		this._target.value = this._buffer.join('');
	},

	_doKeypress: function (chCode) {
		if (chCode == 13) {
			return true;
		}

		var ch = String.fromCharCode(chCode), Z = this;
		if (Z._transform == 'upper') {
			ch = ch.toUpperCase();
		} else {
			if (Z._transform == 'lower') {
				ch = ch.toLowerCase();
			}
		}
		var pos = jslet.ui.textutil.getCursorPos(Z._target);
		var begin = Z._updateBuffer(pos, ch);
		Z._showValue();
		if (begin >= 0) {
			Z._moveCursor(begin + 1);
		} else {
			Z._moveCursor(pos.begin);
		}

		return false;
	},

	_doKeydown: function (chCode) {
		var Z = this,
			pos = jslet.ui.textutil.getCursorPos(Z._target),
			begin = pos.begin,
			end = pos.end;

		if (chCode == 229) {//IME showing
			var flag = (Z._parsedMask.legnth > begin);
			if (flag) {
				var msk = Z._parsedMask[begin];
				flag = msk.isMask;
				if (flag) {
					var c = msk.ch;
					flag = (c == 'c' || c == 'C');
				}
			}
			if (!flag) {
				window.setTimeout(function () {
					Z._showValue();
					Z._moveCursor(begin);
				}, 50);
			}
		}
		if (chCode == 13) //enter
		{
			return true;
		}

		if (chCode == 8) //backspace
		{
			if (begin == end) {
				begin = Z._getValidPos(--begin, true);
				end = begin;
			}
			Z._clearBuffer(begin, end);
			Z._showValue();
			Z._moveCursor(begin, true);
			return false;
		}

		if (chCode == 27) // Allow to send 'ESC' command
		{
			return false;
		}

		if (chCode == 39) // Move Left
		{
		}

		if (chCode == 46) // delete the selected text
		{
			Z._clearBuffer(begin, end - 1);
			Z._showValue();
			Z._moveCursor(begin);

			return false;
		}
		return true;
	},

	_doBur: function () {
		var mask, c, Z = this;
		for (var i = 0, cnt = Z._parsedMask.length; i < cnt; i++) {
			mask = Z._parsedMask[i];
			if (!mask.isMask) {
				continue;
			}
			c = mask.ch;
			if (Z.maskChars[c].required) {
				if (Z._buffer[i] == Z._format[i]) {
					//jslet.ui.textutil.setCursorPos(Z._target, i);
					//return false;
					return true;
				}
			}
		}
		return true;
	},

	_doCut: function (clipboardData) {
		var Z = this,
			data = jslet.ui.textutil.getSelectedText(Z._target),
			range = jslet.ui.textutil.getCursorPos(Z._target),
			begin = range.begin;
		Z._clearBuffer(begin, range.end - 1);
		Z._showValue();
		Z._moveCursor(begin, true);
		clipboardData.setData('Text', data);
		return false;
	},

	_doPaste: function (clipboardData) {
		var pasteValue = clipboardData.getData('Text');
		if (!pasteValue) {
			return false;
		}
		var pos = jslet.ui.textutil.getCursorPos(this._target), begin = 0, ch;
		pos.end = pos.begin;
		for (var i = 0; i < pasteValue.length; i++) {
			ch = pasteValue.charAt(i);
			begin = this._updateBuffer(pos, ch);
			pos.begin = i;
			pos.end = pos.begin;
		}
		this._showValue();
		if (begin >= 0) {
			this._moveCursor(begin + 1);
		}
		return true;
	}
};//edit mask

/**
 * Util of "Text" control
 */
jslet.ui.textutil = {
	/**
	 * Select text from an Input(Text) element 
	 * 
	 * @param {Html Text Element} txtEl The html text element   
	 * @param {Integer} start Start position.
	 * @param {Integer} end End position.
	 */
	selectText: function(txtEl, start, end){
		var v = txtEl.value;
		if (v.length > 0) {
			start = start === undefined ? 0 : start;
			end = end === undefined ? v.length : end;
 
			if (txtEl.setSelectionRange) {
				txtEl.setSelectionRange(start, end);
			} else if (txtEl.createTextRange) {
				var range = txtEl.createTextRange();
				range.moveStart('character', start);
				range.moveEnd('character', end - v.length);
				range.select();
			}
		}	
	},
	
	/**
	 * Get selected text
	 * 
	 * @param {Html Text Element} textEl Html Text Element
	 * @return {String}  
	 */
	getSelectedText: function (txtEl) {
		if (txtEl.setSelectionRange) {
			var begin = txtEl.selectionStart;
			var end = txtEl.selectionEnd;
			return txtEl.value.substring(begin, end);
		}
		if (document.selection && document.selection.createRange) {
			return document.selection.createRange().text;
		}
	},

	/**
	 * Get cursor postion of html text element
	 * 
	 * @param {Html Text Element} txtEl Html Text Element
	 * @return {Integer}
	 */
	getCursorPos: function(txtEl){
		var result = { begin: 0, end: 0 };

		if (txtEl.setSelectionRange) {
			result.begin = txtEl.selectionStart;
			result.end = txtEl.selectionEnd;
		}
		else if (document.selection && document.selection.createRange) {
			var range = document.selection.createRange();
			result.begin = 0 - range.duplicate().moveStart('character', -100000);
			result.end = result.begin + range.text.length;
		}
		return result;
	},
	
	/**
	 * Set cursor postion of html text element
	 * 
	 * @param {Html Text Element} txtEl Html Text Element
	 * @param {Integer} pos Cusor position
	 */
	setCursorPos: function(txtEl, pos){
		if (txtEl.setSelectionRange) {
			txtEl.focus();
			txtEl.setSelectionRange(pos, pos);
		}
		else if (txtEl.createTextRange) {
			var range = txtEl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}	
	}
};
/* ========================================================================
 * Jslet framework: jslet.resizeeventbus.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* Resize event bus, manage all resize event. Example:
* <pre><code>
*	var myCtrlObj = {
*		checkSizeChanged: function(){
*			;
*		}
*	}
*	
*	//Subcribe a message from MessageBus
*	jslet.messageBus.subcribe(myCtrlObj);
*   
*	//Unsubcribe a message from MessageBus
*	jslet.messageBus.unsubcribe(myCtrlObj);
* 
*	//Send a mesasge to MessageBus
*	jslet.messageBus.sendMessage('MyMessage', {x: 10, y:10});
* 
* </code></pre>
* 
*/
jslet.ResizeEventBus = function () {
	
	var handler = null;
	/**
	 * Send a message.
	 * 
	 * @param {Html Element} sender Sender which send resize event.
	 */
	this.resize = function (sender) {
		if (handler){
			window.clearTimeout(handler);
		}
		handler = setTimeout(function(){
			var ctrls, ctrl, jsletCtrl;
			if (sender) {
				ctrls = jQuery(sender).find("*[data-jslet-resizable]");
			} else {
				ctrls = jQuery("*[data-jslet-resizable]");
			}
			if(jslet.ui._activePopup) {
				jslet.ui._activePopup.hide();
			}
			for(var i = 0, cnt = ctrls.length; i < cnt; i++){
				ctrl = ctrls[i];
				if (ctrl){
					jsletCtrl = ctrl.jslet;
					if (jsletCtrl && jsletCtrl.checkSizeChanged){
						jsletCtrl.checkSizeChanged();
					}
				}
			}
			handler = null;
		}, 100);
	};

	/**
	 * Subscribe a control to response a resize event.
	 * 
	 * @param {Object} ctrlObj control object which need subscribe a message, 
	 *	there must be a function: checkSizeChanged in ctrlObj.
	 *	checkSizeChanged: function(){}
	 */
	this.subscribe = function(ctrlObj){
		if (!ctrlObj || !ctrlObj.el) {
			throw new Error("ctrlObj required!");
		}
		jQuery(ctrlObj.el).attr(jslet.ResizeEventBus.RESIZABLE, true);
	};
	
	/**
	 * Unsubscribe a control to response a resize event.
	 * 
	 * @param {Object} ctrlObj control object which need subscribe a message.
	 */
	this.unsubscribe = function(ctrlObj){
		if (!ctrlObj || !ctrlObj.el) {
			throw new Error("ctrlObj required!");
		}
		jQuery(ctrlObj.el).removeAttr(jslet.ResizeEventBus.RESIZABLE);
	};
	
};

jslet.ResizeEventBus.RESIZABLE = "data-jslet-resizable";

jslet.resizeEventBus = new jslet.ResizeEventBus();

jQuery(window).on("resize",function(){
	jslet.resizeEventBus.resize();
});
﻿/* ========================================================================
 * Jslet framework: jslet.accordion.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class Accordion. Example:
 * <pre><code>
 * var jsletParam = {type:"Accordion",selectedIndex:1,items:[{caption:"Caption1"},{caption:"Caption2"}]};
 * //1. Declaring:
 *	&lt;div data-jslet='jsletParam' style="width: 300px; height: 400px;">
 *     &lt;div>content1&lt;/div>
 *     &lt;div>content2&lt;/div>
 *    &lt;/div>
 *  
 *  //2. Binding
 *    &lt;div id='ctrlId'>
 *      &lt;div>content1&lt;/div>
 *      &lt;div>content2&lt;/div>
 *    &lt;/div>
 *    //Js snippet
 *    var el = document.getElementById('ctrlId');
 *    jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *    jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.Accordion = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'selectedIndex,onChanged,items';
		/**
		 * {Integer} 
		 */
		Z._selectedIndex = 0;
		
		/**
		 * {Event handler} Fire when user change accordion panel.
		 * Pattern: 
		 *	function(index){}
		 *	//index: Integer
		 */
		Z._onChanged = null;
		
		/**
		 * Array of accordion items,like: [{caption: 'cap1'},{caption: 'cap2'}]
		 */
		Z._items = null;
		
		$super(el, params);
	},

	selectedIndex: function(index) {
		if(index === undefined) {
			return this._selectedIndex;
		}
		jslet.Checker.test('Accordion.selectedIndex', index).isGTEZero();
		this._selectedIndex = index;
	},
	
	onChanged: function(onChanged) {
		if(onChanged === undefined) {
			return this._onChanged;
		}
		jslet.Checker.test('Accordion.onChanged', onChanged).isFunction();
		this._onChanged = onChanged;
	},
	
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('Accordion.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('Accordion.items.caption', item.caption).isString().required();
		}
		this._items = items;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-accordion')) {
			jqEl.addClass('jl-accordion jl-border-box jl-round5');
		}
		var panels = jqEl.find('>div'), jqCaption, headHeight = 0, item;

		var captionCnt = Z._items ? Z._items.length - 1: -1, caption;
		panels.before(function(index) {
			if (index <= captionCnt) {
				caption = Z._items[index].caption;
			} else {
				caption = 'caption' + index;
			}
			return '<button class="btn btn-default jl-accordion-head" jsletindex = "' + index + '">' + caption + '</button>';
		});

		var jqCaptions = jqEl.find('>.jl-accordion-head');
		jqCaptions.click(Z._doCaptionClick);
		
		headHeight = jqCaptions.outerHeight() * panels.length;
		var contentHeight = jqEl.innerHeight() - headHeight-1;
		
		panels.wrap('<div class="jl-accordion-body" style="height:'+contentHeight+'px;display:none"></div>');
        Z.setSelectedIndex(Z._selectedIndex, true);
	},
	
	_doCaptionClick: function(event){
		var jqCaption = jQuery(event.currentTarget),
			Z = jslet.ui.findJsletParent(jqCaption[0]).jslet,
			k = parseInt(jqCaption.attr('jsletindex'));
		Z.setSelectedIndex(k);
	},
	
	/**
	 * Set selected index
	 * 
	 * @param {Integer} index Panel index, start at 0.
	 */
	setSelectedIndex: function(index, isRenderAll){
		if (!index) {
			index = 0;
		}
		var Z = this;
		var jqBodies = jQuery(Z.el).find('>.jl-accordion-body');
		var pnlCnt = jqBodies.length - 1;
		if (index > pnlCnt) {
			return;
		}

		if (Z._selectedIndex == index && index < pnlCnt){
			jQuery(jqBodies[index]).slideUp('fast');
			if(!isRenderAll || isRenderAll && index > 0) {
				index++;
			}
			jQuery(jqBodies[index]).slideDown('fast');
			Z._selectedIndex = index;
			if (Z._onChanged){
				Z._onChanged.call(this, index);
			}
			return;
		}
		if (Z._selectedIndex >= 0 && Z._selectedIndex != index) {
			jQuery(jqBodies[Z._selectedIndex]).slideUp('fast');
		}
		jQuery(jqBodies[index]).slideDown('fast');
		Z._selectedIndex = index;
		if (Z._onChanged){
			Z._onChanged.call(this, index);
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.find('>.jl-accordion-head').off();
		$super();
	}
});
jslet.ui.register('Accordion', jslet.ui.Accordion);
jslet.ui.Accordion.htmlTemplate = '<div></div>';
/* ========================================================================
 * Jslet framework: jslet.calendar.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class Calendar. Example:
 * <pre><code>
 *  var jsletParam = {type:"Calendar"};
 *  //1. Declaring:
 *    &lt;div data-jslet='type:"Calendar"' />
 *
 *  //2. Binding
 *    &lt;div id='ctrlId' />
 *    //js snippet 
 *    var el = document.getElementById('ctrlId');
 *    jslet.ui.bindControl(el, jsletParam);
 *	
 *  //3. Create dynamically
 *    jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.Calendar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'value,onDateSelected,minDate,maxDate';
		/**
		 * {Date} Calendar value
		 */
		Z._value = null;
		
		/**
		 * {Event Handler}  Fired when user select a date.
		 * Pattern: 
		 *	function(value){}
		 *	//value: Date
		 */
		Z._onDateSelected = null;
		
		/**
		 * {Date} minDate Minimized date of calendar range 
		 */
		Z._minDate = null;

		/**
		 * {Date} maxDate Maximized date of calendar range 
		 */
		Z._maxDate = null;
		
		Z._currYear = 0;
		Z._currMonth = 0;
		Z._currDate = 0;
		
		$super(el, params);
	},

	value: function(value) {
		if(value === undefined) {
			return this._value;
		}
		jslet.Checker.test('Calendar.value', value).isDate();
		this._value = value;
	},
	
	minDate: function(minDate) {
		if(minDate === undefined) {
			return this._minDate;
		}
		jslet.Checker.test('Calendar.minDate', minDate).isDate();
		this._minDate = minDate;
	},
	
	maxDate: function(maxDate) {
		if(maxDate === undefined) {
			return this._maxDate;
		}
		jslet.Checker.test('Calendar.maxDate', maxDate).isDate();
		this._maxDate = maxDate;
	},
		
	onDateSelected: function(onDateSelected) {
		if(onDateSelected === undefined) {
			return this._onDateSelected;
		}
		jslet.Checker.test('Calendar.onDateSelected', onDateSelected).isFunction();
		this._onDateSelected = onDateSelected;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-calendar')) {
			jqEl.addClass('jl-calendar jl-border-box jl-round4');
		}
		var template = ['<div class="jl-cal-header">',
			'<a class="jl-cal-btn jl-cal-yprev" title="', jslet.locale.Calendar.yearPrev,
			'" href="javascript:;">&lt;&lt;</a><a href="javascript:;" class="jl-cal-btn jl-cal-mprev" title="', jslet.locale.Calendar.monthPrev, '">&lt;',
			'</a><a href="javascript:;" class="jl-cal-title"></a><a href="javascript:;" class="jl-cal-btn jl-cal-mnext" title="', jslet.locale.Calendar.monthNext, '">&gt;',
			'</a><a href="javascript:;" class="jl-cal-btn jl-cal-ynext" title="', jslet.locale.Calendar.yearNext, '">&gt;&gt;</a>',
		'</div>',
		'<div class="jl-cal-body">',
			'<table cellpadding="0" cellspacing="0">',
				'<thead><tr><th class="jl-cal-weekend">',
				jslet.locale.Calendar.Sun,
					'</th><th>',
					jslet.locale.Calendar.Mon,
						'</th><th>',
					jslet.locale.Calendar.Tue,
						'</th><th>',
					jslet.locale.Calendar.Wed,
						'</th><th>',
					jslet.locale.Calendar.Thu,
						'</th><th>',
					jslet.locale.Calendar.Fri,
						'</th><th class="jl-cal-weekend">',
					jslet.locale.Calendar.Sat,
						'</th></tr></thead><tbody>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
						'</tbody></table></div><div class="jl-cal-footer"><a class="jl-cal-today" href="javascript:;">', jslet.locale.Calendar.today, '</a></div>'];

		jqEl.html(template.join(''));
		var jqTable = jqEl.find('.jl-cal-body table');
		Z._currYear = -1;
		jqTable.on('click', Z._doTableClick);
		
		var dvalue = Z._value && jslet.isDate(Z._value) ? Z._value : new Date();
		this.setValue(dvalue);
		jqEl.find('.jl-cal-today').click(function (event) {
			var d = new Date();
			Z.setValue(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
			Z._fireSelectedEvent();
		});
		
		jqEl.find('.jl-cal-yprev').click(function (event) {
			Z.incYear(-1);
		});
		
		jqEl.find('.jl-cal-mprev').click(function (event) {
			Z.incMonth(-1);
		});
		
		jqEl.find('.jl-cal-ynext').click(function (event) {
			Z.incYear(1);
		});
		
		jqEl.find('.jl-cal-mnext').click(function (event) {
			Z.incMonth(1);
		});
		
		jqEl.on('keydown', function(event){
			var ctrlKey = event.ctrlKey,
				keyCode = event.keyCode;
			var delta = 0;
			if(keyCode == jslet.ui.KeyCode.UP) {
				if(ctrlKey) {
					Z.incYear(-1);
				} else {
					Z.incDate(-7);
				}
				event.preventDefault();
				return;
			} 
			if(keyCode == jslet.ui.KeyCode.DOWN) {
				if(ctrlKey) {
					Z.incYear(1);
				} else {
					Z.incDate(7);
				}
				event.preventDefault();
				return;
			}
			if(keyCode == jslet.ui.KeyCode.LEFT) {
				if(ctrlKey) {
					Z.incMonth(-1);
				} else {
					Z.incDate(-1);
				}
				event.preventDefault();
				return;
			}
			if(keyCode == jslet.ui.KeyCode.RIGHT) {
				if(ctrlKey) {
					Z.incMonth(1);
				} else {
					Z.incDate(1);
				}
				event.preventDefault();
				return;
			}
		});
	},
	
	_getNotNullDate: function() {
		var value =this._value;
		if(!value) {
			value = new Date();
		}
		return value;
	},
	
	incDate: function(deltaDay) {
		var value = this._getNotNullDate();
		value.setDate(value.getDate() + deltaDay);
		this.setValue(value);
	},
	
	incMonth: function(deltaMonth) {
		var value = this._getNotNullDate();
		value.setMonth(value.getMonth() + deltaMonth);
		this.setValue(value);
	},
	
	incYear: function(deltaYear) {
		var value = this._getNotNullDate();
		value.setFullYear(value.getFullYear() + deltaYear);
		this.setValue(value);
	},
	
	/**
	 * Set date value of calendar.
	 * 
	 * @param {Date} value Calendar date
	 */
	setValue: function (value) {
		if (!value) {
			return;
		}

		var Z = this;
		if (Z._minDate && value < Z._minDate) {
			value = new Date(Z._minDate.getTime());
		}
		if (Z._maxDate && value > Z._maxDate) {
			value = new Date(Z._maxDate.getTime());
		}
		Z._value = value;
		var y = value.getFullYear(), 
			m = value.getMonth();
		if (Z._currYear == y && Z._currMonth == m) {
			Z._setCurrDateCls();
		} else {
			Z._refreshDateCell(y, m);
		}
	},

	_checkNaviState: function () {
		var Z = this,
			jqEl = jQuery(Z.el), flag, btnToday;
		if (Z._minDate) {
			var minY = Z._minDate.getFullYear(),
				minM = Z._minDate.getMonth(),
				btnYearPrev = jqEl.find('.jl-cal-yprev')[0];
			flag = (Z._currYear <= minY);
			btnYearPrev.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._currYear == minY && Z._currMonth <= minM);
			var btnMonthPrev = jqEl.find('.jl-cal-mprev')[0];
			btnMonthPrev.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._minDate > new Date());
			btnToday = jqEl.find('.jl-cal-today')[0];
			btnToday.style.visibility = (flag ? 'hidden' : 'visible');
		}

		if (Z._maxDate) {
			var maxY = Z._maxDate.getFullYear(),
				maxM = Z._maxDate.getMonth(),
				btnYearNext = jqEl.find('.jl-cal-ynext')[0];
			flag = (Z._currYear >= maxY);
			btnYearNext.jslet_disabled = flag;
			btnYearNext.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._currYear == maxY && Z._currMonth >= maxM);
			var btnMonthNext = jqEl.find('.jl-cal-mnext')[0];
			btnMonthNext.jslet_disabled = flag;
			btnMonthNext.style.visibility = (flag ? 'hidden' : 'visible');

			flag = (Z._maxDate < new Date());
			btnToday = jqEl.find('.jl-cal-today')[0];
			btnToday.style.visibility = (flag ? 'hidden' : 'visible');
		}
	},

	_refreshDateCell: function (year, month) {
		var Z = this,
			jqEl = jQuery(Z.el),
			monthnames = jslet.locale.Calendar.monthNames,
			mname = monthnames[month],
			otitle = jqEl.find('.jl-cal-title')[0];
		otitle.innerHTML = mname + ',' + year;
		var otable = jqEl.find('.jl-cal-body table')[0],
			rows = otable.tBodies[0].rows,
			firstDay = new Date(year, month, 1),
			w1 = firstDay.getDay(),
			oneDayMs = 86400000, //24 * 60 * 60 * 1000
			date = new Date(firstDay.getTime() - (w1 + 1) * oneDayMs);
		date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

		var rowCnt = rows.length, otr, otd, m, oa;
		for (var i = 1; i <= rowCnt; i++) {
			otr = rows[i - 1];
			for (var j = 1, tdCnt = otr.cells.length; j <= tdCnt; j++) {
				otd = otr.cells[j - 1];
				date = new Date(date.getTime() + oneDayMs);
				oa = otd.firstChild;
				if (Z._minDate && date < Z._minDate || Z._maxDate && date > Z._maxDate) {
					oa.innerHTML = '';
					otd.jslet_date_value = null;
					continue;
				} else {
					oa.innerHTML = date.getDate();
					otd.jslet_date_value = date;
				}
				m = date.getMonth();
				if (m != month) {
					jQuery(otd).addClass('jl-cal-disable');
				} else {
					jQuery(otd).removeClass('jl-cal-disable');
				}
			} //end for j
		} //end for i
		Z._currYear = year;
		Z._currMonth = month;
		Z._setCurrDateCls();
		Z._checkNaviState();
	},
	
	_fireSelectedEvent: function() {
		var Z = this;
		if (Z._onDateSelected) {
			Z._onDateSelected.call(Z, Z._value);
		}
	},
	
	_doTableClick: function (event) {
		event = jQuery.event.fix( event || window.event );
		var node = event.target,
			otd = node.parentNode;
		
		if (otd && otd.tagName && otd.tagName.toLowerCase() == 'td') {
			if (!otd.jslet_date_value) {
				return;
			}
			var el = jslet.ui.findFirstParent(otd, function (node) { return node.jslet; });
			var Z = el.jslet;
			Z._value = otd.jslet_date_value;
			Z._setCurrDateCls();
			try{
			otd.firstChild.focus();
			}catch(e){
			}
			Z._fireSelectedEvent();
		}
	},

	_setCurrDateCls: function () {
		var Z = this;
		if (!jslet.isDate(Z._value)) {
			return;
		}
		var currM = Z._value.getMonth(),
			currY = Z._value.getFullYear(),
			currD = Z._value.getDate(),
			otable = jqEl.find('.jl-cal-body table')[0],
			rows = otable.tBodies[0].rows,
			rowCnt = rows.length, otr, otd, m, d, y, date, jqLink;
		for (var i = 0; i < rowCnt; i++) {
			otr = rows[i];
			for (var j = 0, tdCnt = otr.cells.length; j < tdCnt; j++) {
				otd = otr.cells[j];
				date = otd.jslet_date_value;
				if (!date) {
					continue;
				}
				m = date.getMonth();
				y = date.getFullYear();
				d = date.getDate();
				jqLink = jQuery(otd.firstChild);
				if (y == currY && m == currM && d == currD) {
					if (!jqLink.hasClass('jl-cal-current')) {
						jqLink.addClass('jl-cal-current');
					}
					try{
						otd.firstChild.focus();
					} catch(e){
					}
				} else {
					jqLink.removeClass('jl-cal-current');
				}
			}
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.off();
		jqEl.find('.jl-cal-body table').off();
		jqEl.find('.jl-cal-today').off();
		jqEl.find('.jl-cal-yprev').off();
		jqEl.find('.jl-cal-mprev').off();
		jqEl.find('.jl-cal-mnext').off();
		jqEl.find('.jl-cal-ynext').off();
		$super();
	}
});
jslet.ui.register('Calendar', jslet.ui.Calendar);
jslet.ui.Calendar.htmlTemplate = '<div></div>';
/* ========================================================================
 * Jslet framework: jslet.fieldset.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class FieldSet. Example:
 * <pre><code>
 *   //1. Declaring:
 *      &lt;div data-jslet='type:"FieldSet"' />
 *
 *  //2. Binding
 *      &lt;div id='ctrlId' />
 *      //Js snippet
 *      var jsletParam = {type:"FieldSet"};
 *      var el = document.getElementById('ctrlId');
 *      jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *      var jsletParam = {type:"FieldSet"};
 *      jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.FieldSet = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'caption,collapsed';
		/**
		 * {String} Fieldset caption
		 */
		Z._caption = null; 
		
		/**
		 * {Boolean} Fieldset is collapsed or not
		 */
		Z._collapsed = false;
		
		$super(el, params);
	},

	caption: function(caption) {
		if(caption === undefined) {
			return this._caption;
		}
		jslet.Checker.test('FieldSet.caption', caption).isString();
		this._caption = caption;
	},

	collapsed: function(collapsed) {
		if(collapsed === undefined) {
			return this._collapsed;
		}
		this._collapsed = collapsed ? true: false;
	},

	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-fieldset')) {
			jqEl.addClass('jl-fieldset jl-round5');
		}
		
		var tmpl = ['<legend class="jl-fieldset-legend">'];
		tmpl.push('<span class="jl-fieldset-title"><i class="fa fa-chevron-circle-up jl-fieldset-btn">');
		tmpl.push('<span>');
		tmpl.push(Z._caption);
		tmpl.push('</span></span></legend><div class="jl-fieldset-body"></div>');
		
		var nodes = Z.el.childNodes, 
			children = [],
			i, cnt;
		cnt = nodes.length;
		for(i = 0; i < cnt; i++){
			children.push(nodes[i]);
		}

		jqEl.html(tmpl.join(''));
		var obody = jQuery(Z.el).find('.jl-fieldset-body')[0];
		cnt = children.length;
		for(i = 0; i < cnt; i++){
			obody.appendChild(children[i]);
		}
		
		jqEl.find('.jl-fieldset-btn').click(jQuery.proxy(Z._doExpandBtnClick, this));
	},
	
	_doExpandBtnClick: function(){
		var Z = this, jqEl = jQuery(Z.el);
		var fsBody = jqEl.find('.jl-fieldset-body');
		if (!Z._collapsed){
			fsBody.slideUp();
			jqEl.addClass('jl-fieldset-collapse');
			jqEl.find('.jl-fieldset-btn').addClass('fa-chevron-circle-down');
		}else{
			fsBody.slideDown();
			jqEl.removeClass('jl-fieldset-collapse');
			jqEl.find('.jl-fieldset-btn').removeClass('fa-chevron-circle-down');
		}
		fsBody[0].focus();
		Z._collapsed = !Z._collapsed;
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var jqEl = jQuery(this.el);
		jqEl.find('input.jl-fieldset-btn').off();
		$super();
	}
});

jslet.ui.register('FieldSet', jslet.ui.FieldSet);
jslet.ui.FieldSet.htmlTemplate = '<fieldset></fieldset>';
/* ========================================================================
 * Jslet framework: jslet.overlaypanel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* @class Overlay panel. Example:
* <pre><code>
*  var overlay = new jslet.ui.OverlayPanel(Z.el.parentNode);
*  overlay.setZIndex(999);
*  overlay.show();
* </code></pre>
* 
* @param {Html Element} container Html Element that OverlayPanel will cover.
* @param {String} color Color String.
*/
jslet.ui.OverlayPanel = function (container, color) {
	var odiv = document.createElement('div');
	jQuery(odiv).addClass('jl-overlay').on('click', function(event){
		event.stopPropagation();
		event.preventDefault();
	});
	
	if (color) {
		odiv.style.backgroundColor = color;
	}
	var left, top, width, height;
	if (!container) {
		var jqBody = jQuery(document.body);
		left = 0;
		top = 0;
		width = jqBody.width();
		height = jqBody.height();
	} else {
		width = jQuery(container).width();
		height = jQuery(container).height();
	}
	odiv.style.left = '0px';
	odiv.style.top = '0px';
	odiv.style.width =  width + 'px';
	odiv.style.height =  height + 'px';
	if (!container) {
		document.body.appendChild(odiv);
	} else {
		container.appendChild(odiv);
	}
	odiv.style.display = 'none';

	var oldResizeHanlder = null;
	if (!container) {
		oldResizeHanlder = window.onresize;

		window.onresize = function () {
			odiv.style.width = document.body.scrollWidth + 'px';
			odiv.style.height = document.body.scrollHeight + 'px';
		};
	} else {
		oldResizeHanlder = container.onresize;
		container.onresize = function () {
			var width = jQuery(container).width() - 12;
			var height = jQuery(container).height() - 12;
			odiv.style.width = width + 'px';
			odiv.style.height = height + 'px';
		};
	}

	this.overlayPanel = odiv;

	/**
	 * Show overlay panel
	 */
	this.show = function () {
		odiv.style.display = 'block';
		return odiv;
	};

	/**
	 * Hide overlay panel
	 */
	this.hide = function () {
		odiv.style.display = 'none';
		return odiv;
	};
	
	/**
	 * Set Z-index 
	 * 
	 * @param {Integer} zIndex Z-Index
	 */
	this.setZIndex = function(zIndex){
		this.overlayPanel.style.zIndex = zIndex;
	};

	this.destroy = function () {
		this.hide();
		if (!container) {
			window.onresize = oldResizeHanlder;
			document.body.removeChild(odiv);
		} else {
			container.onresize = oldResizeHanlder;
			container.removeChild(odiv);
		}
		jQuery(this.overlayPanel).off();
	};
};
/* ========================================================================
 * Jslet framework: jslet.menu.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* Menu Manager
*/
jslet.ui.menuManager = {};
/**
 * Global menu id collection, array of string
 */
jslet.ui.menuManager._menus = [];

/**
 * Register menu id
 * 
 * @param {String} menuid Menu control id
 */
jslet.ui.menuManager.register = function (menuid) {
	jslet.ui.menuManager._menus.push(menuid);
};

/**
 * Unregister menu id
 * 
 * @param {String} menuid Menu control id
 */
jslet.ui.menuManager.unregister = function (menuid) {
	for (var i = 0, len = this._menus.length; i < len; i++) {
		jslet.ui.menuManager._menus.splice(i, 1);
	}
};

/**
 * Hide all menu item.
 */
jslet.ui.menuManager.hideAll = function (event) {
	var id, menu, menus = jslet.ui.menuManager._menus;
	for (var i = 0, len = menus.length; i < len; i++) {
		id = menus[i];
		menu = jslet('#'+id);
		if (menu) {
			menu.hide();
		}
	}
	jslet.ui.menuManager.menuBarShown = false;
	jslet.ui.menuManager._contextObject = null;
};

jQuery(document).on('mousedown', jslet.ui.menuManager.hideAll);

/**
 * @class Calendar. Example:
 * <pre><code>
 *  var jsletParam = { type: 'MenuBar', onItemClick: globalMenuItemClick, items: [
 *		{ name: 'File', items: [
 *         { id: 'new', name: 'New Tab', iconClass: 'icon1' }]
 *      }]};
 *
 *  //1. Declaring:
 *    &lt;div data-jslet='jsletParam' />
 *
 *  //2. Binding
 *    &lt;div id='ctrlId' />
 *    //js snippet:
 *    var el = document.getElementById('ctrlId');
 *    jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *    jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.MenuBar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'onItemClick,items';
		/**
		 * {Event} MenuItem click event handler
		 * Pattern: function(menuId){}
		 *   //menuId: String
		 */
		Z._onItemClick = null;
		
		/**
		 * {Array}Menu items configuration
		 * menu item's properties: 
		 * id, //{String} Menu id
		 * name, //{String} Menu name 
		 * onClick, //{Event} Item click event, 
		 *   Pattern: function(event){}
		 *   
		 * disabled, //{Boolean} Menu item is disabled or not
		 * iconClass,  //{String} Icon style class 
		 * disabledIconClass, //{String} Icon disabled style class
		 * itemType, //{String} Menu item type, optional value: null, radio, check
		 * checked, //{Boolean} Menu item is checked or not,  only work when itemType equals 'radio' or 'check'
		 * group, //{String} Group name, only work when itemType equals 'radio'
		 * items, //{Array} Sub menu items
		 */
		Z._items = null;
		$super(el, params);
	},

	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('MenuBar.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
	},
	
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('MenuBar.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('MenuBar.items.name', item.name).isString().required();
		}
		this._items = items;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-menubar')) {
			jqEl.addClass('jl-menubar jl-unselectable jl-bgcolor jl-round5');
		}

		Z._createMenuBar();
		jqEl.on('mouseout',function (event) {
			if (Z._preHoverItem && !jslet.ui.menuManager.menuBarShown) {
				jQuery(Z._preHoverItem).removeClass('jl-menubar-item-hover');
			}
		});
	},

	_createMenuBar: function () {
		var Z = this;
		if (Z.isPopup) {
			return;
		}

		for (var i = 0, cnt = Z._items.length, item; i < cnt; i++) {
			item = Z._items[i];
			Z._createBarItem(Z.el, item, Z._menubarclick);
		}
	},

	_showSubMenu: function (omi) {
		var Z = omi.parentNode.jslet,
			itemCfg = omi.jsletvar;
		if (!itemCfg.items) {
			return;
		}
		if (!itemCfg.subMenu) {
			var el = document.createElement('div');
			document.body.appendChild(el);
			itemCfg.subMenu = new jslet.ui.Menu(el, { onItemClick: Z._onItemClick, items: itemCfg.items });
		}
		var jqBody = jQuery(document.body),
			bodyMTop = parseInt(jqBody.css('margin-top')),
			bodyMleft = parseInt(jqBody.css('margin-left')),
			jqMi = jQuery(omi), 
			pos = jqMi.offset(), 
			posX = pos.left;
		if (jslet.locale.isRtl) {
			posX +=  jqMi.width() + 10;
		}
		itemCfg.subMenu.show(posX, pos.top + jqMi.height());
		jslet.ui.menuManager.menuBarShown = true;
		Z._activeMenuItem = omi;
		// this.parentNode.parentNode.jslet.ui._createMenuPopup(cfg);
	},

	_createBarItem: function (obar, itemCfg) {
		if (itemCfg.visible !== undefined && !itemCfg.visible) {
			return;
		}
		var omi = document.createElement('div');
		jQuery(omi).addClass('jl-menubar-item');
		omi.jsletvar = itemCfg;
		var Z = this, jqMi = jQuery(omi);
		jqMi.on('click',function (event) {
			var cfg = this.jsletvar;
			if(!cfg.items) {
				if (cfg.onClick) {
					cfg.onClick.call(Z, cfg.id || cfg.name);
				} else {
					if (Z._onItemClick)
						Z._onItemClick.call(Z, cfg.id || cfg.name);
				}
				jslet.ui.menuManager.hideAll();
			} else {
				//				if (Z._activeMenuItem != this || jslet.ui.menuManager.menuBarShown)
				Z._showSubMenu(this);
			}
			event.stopPropagation();
			event.preventDefault();
		});

		jqMi.on('mouseover', function (event) {
			if (Z._preHoverItem) {
				jQuery(Z._preHoverItem).removeClass('jl-menubar-item-hover');
			}
			Z._preHoverItem = this;
			jQuery(this).addClass('jl-menubar-item-hover');
			if (jslet.ui.menuManager.menuBarShown) {
				jslet.ui.menuManager.hideAll();
				Z._showSubMenu(this);
				jslet.ui.menuManager._inPopupMenu = true;
			}
		});
		
		var template = [];
/*		template.push('<span>');
		template.push(itemCfg.name);
		template.push('</span>');
		*/
		
		template.push('<a class="jl-focusable-item" href="javascript:void(0)">');
		template.push(itemCfg.name);
		template.push('</a>');
		
		omi.innerHTML = template.join('');
		obar.appendChild(omi);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		Z._activeMenuItem = null;
		Z._preHoverItem = null;
		Z._menubarclick = null;
		Z._onItemClick = null;
		var jqEl = jQuery(Z.el);
		jqEl.off();
		jqEl.find('.jl-menubar-item').off();
		jqEl.find('.jl-menubar-item').each(function(){
			var omi = this;
			if (omi.jsletvar){
				omi.jsletvar.subMenu = null;
				omi.jsletvar = null;
			}
		});
		$super();
	}
});
jslet.ui.register('MenuBar', jslet.ui.MenuBar);
jslet.ui.MenuBar.htmlTemplate = '<div></div>';

/**
 * @class Calendar. Example:
 * <pre><code>
 *  var jsletParam = { type: 'Menu', onItemClick: globalMenuItemClick, items: [
 *     { id: 'back', name: 'Backward', iconClass: 'icon1' },
 *     { id: 'go', name: 'Forward', disabled: true },
 *     { name: '-' }]};
 *
 *  //1. Declaring:
 *     &lt;div data-jslet='jsletParam' />
 *
 *  //2. Binding
 *     &lt;div id='menu1' />
 *     //js snippet:
 *     var el = document.getElementById('menu1');
 *     jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 * //Use the below code to show context menu
 * jslet('#ctrlId').showContextMenu(event);
 * //Show menu at the specified position
 * jslet('#ctrlId').show(left, top);
 * 
 * </code></pre>
 */
/***
* Popup Menu
*/
jslet.ui.Menu = jslet.Class.create(jslet.ui.Control, {
	_onItemClick: undefined,
	_items:undefined,
	_invoker: null,
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'onItemClick,items,invoker'; //'invoker' is used for inner
		//items is an array, menu item's properties: id, name, onClick,disabled,iconClass,disabledIconClass,itemType,checked,group,items
		$super(el, params);
		Z._activeSubMenu = null;
	},

	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('Menu.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
	},
	
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('Menu.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('Menu.items.name', item.name).isString().required();
		}
		this._items = items;
	},
	
	invoker: function(invoker) {
		if(invoker === undefined) {
			return this._invoker;
		}
		this._invoker = invoker;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el),
			ele = Z.el;
		if (!jqEl.hasClass('jl-menu')) {
			jqEl.addClass('jl-menu');
		}
		ele.style.display = 'none';

		if (!ele.id) {
			ele.id = jslet.nextId();
		}

		jslet.ui.menuManager.register(ele.id);
		Z._createMenuPopup();
		jqEl.on('mousedown',function (event) {
			event = jQuery.event.fix( event || window.event );
			event.stopPropagation();
			event.preventDefault();
			return false;
		});

		jqEl.on('mouseover', function (event) {
			jslet.ui.menuManager._inPopupMenu = true;
			if (jslet.ui.menuManager.timerId) {
				window.clearTimeout(jslet.ui.menuManager.timerId);
			}
		});

		jqEl.on('mouseout', function (event) {
			jslet.ui.menuManager._inPopupMenu = false;
			jslet.ui.menuManager.timerId = window.setTimeout(function () {
				if (!jslet.ui.menuManager._inPopupMenu) {
					jslet.ui.menuManager.hideAll();
				}
				jslet.ui.menuManager.timerId = null;
			}, 800);
		});
	},

	/**
	 * Show menu at specified position.
	 * 
	 * @param {Integer} left Position left
	 * @param {Integer} top Position top
	 */
	show: function (left, top) {
		var Z = this, 
			jqEl = jQuery(Z.el),
			width = jqEl.outerWidth(),
			height = jqEl.outerHeight(),
			jqWin = jQuery(window),
			winWidth = jqWin.scrollLeft() + jqWin.width(),
			winHeight = jqWin.scrollTop() + jqWin.height();
			
		left = left || Z.left || 10;
		top = top || Z.top || 10;
		if (jslet.locale.isRtl) {
			left -= width;
		}
		if(left + width > winWidth) {
			left += winWidth - left - width - 1;
		}
		if(top + height > winHeight) {
			top += winHeight - top - height - 1;
		}
		if(left < 0) {
			left = 0;
		}
		if(top < 0) {
			top = 0;
		}
		Z.el.style.left = left + 'px';
		Z.el.style.top = parseInt(top) + 'px';
		Z.el.style.display = 'block';
		if (!Z.shadow) {
			Z.shadow = document.createElement('div');
			jQuery(Z.shadow).addClass('jl-menu-shadow');
			Z.shadow.style.width = width + 'px';
			Z.shadow.style.height = height + 'px';
			document.body.appendChild(Z.shadow);
		}
		Z.shadow.style.left = left + 1 + 'px';
		Z.shadow.style.top = top + 1 + 'px';
		Z.shadow.style.display = 'block';
	},

	/**
	 * Hide menu item and all its sub menu item.
	 */
	hide: function () {
		this.ctxElement = null;
		this.el.style.display = 'none';
		if (this.shadow) {
			this.shadow.style.display = 'none';
		}
	},

	/**
	 * Show menu on context menu. Example:
	 * <pre><code>
	 *  <div id="popmenu" oncontextmenu="popMenu(event);">
	 *	function popMenu(event) {
	 *	jslet("#popmenu").showContextMenu(event);
	 *  }
	 * </code></pre>
	 */
	showContextMenu: function (event, contextObj) {
		jslet.ui.menuManager.hideAll();

		event = jQuery.event.fix( event || window.event );
		jslet.ui.menuManager._contextObject = contextObj;
		this.show(event.pageX, event.pageY);
		event.preventDefault();
	},

	_createMenuPopup: function () {
		var panel = this.el,
			items = this._items, itemCfg, name, i, cnt;
		cnt = items.length;
		for (i = 0; i < cnt; i++) {
			itemCfg = items[i];
			if (!itemCfg.name) {
				continue;
			}
			name = itemCfg.name.trim();
			if (name != '-') {
				this._createMenuItem(panel, itemCfg);
			} else {
				this._createLine(panel, itemCfg);
			}
		}

		var w = jQuery(panel).width() - 2 + 'px',
			arrMi = panel.childNodes, node;
		cnt = arrMi.length;
		for (i = 0; i < cnt; i++) {
			node = arrMi[i];
			if (node.nodeType == 1) {
				node.style.width = w;
			}
		}
		document.body.appendChild(panel);
	},

	_ItemClick: function (sender, cfg) {
		//has sub menu items
		if (cfg.items) {
			this._showSubMenu(sender, cfg);
			return;
		}
		if (cfg.disabled) {
			return;
		}
		var contextObj = jslet.ui.menuManager._contextObject || this;
		if (cfg.onClick) {
			cfg.onClick.call(contextObj, cfg.id || cfg.name, cfg.checked);
		} else {
			if (this._onItemClick) {
				this._onItemClick.call(contextObj, cfg.id || cfg.name, cfg.checked);
			}
		}
		if (cfg.itemType == 'check' || cfg.itemType == 'radio') {
			jslet.ui.Menu.setChecked(sender, !cfg.checked);
		}
		jslet.ui.menuManager.hideAll();
	},

	_hideSubMenu: function () {
		var Z = this;
		if (Z._activeSubMenu) {
			Z._activeSubMenu._hideSubMenu();
			Z._activeSubMenu.hide();
			Z._activeSubMenu.el.style.zIndex = parseInt(jQuery(Z.el).css('zIndex'));
		}
	},

	_showSubMenu: function (sender, cfg, delayTime) {
		var Z = this;
		var func = function () {
			Z._hideSubMenu();
			if (!cfg.subMenu) {
				return;
			}
			var jqPmi = jQuery(sender),
				pos = jqPmi.offset(), 
				x = pos.left;
			if (!jslet.locale.isRtl) {
				x += jqPmi.width();
			}

			cfg.subMenu.show(x - 2, pos.top);
			cfg.subMenu.el.style.zIndex = parseInt(jQuery(Z.el).css('zIndex')) + 1;
			Z._activeSubMenu = cfg.subMenu;
		};
		if (delayTime) {
			window.setTimeout(func, delayTime);
		} else {
			func();
		}
	},

	_ItemOver: function (sender, cfg) {
		if (this._activeSubMenu) {
			this._showSubMenu(sender, cfg, 200);
		}
	},

	_createMenuItem: function (container, itemCfg, defaultClickHandler) {
		//id, name, onClick,disabled,iconClass,disabledIconClass,itemType,checked,group,items,subMenuId
		var isCheckBox = false, 
			isRadioBox = false,
			itemType = itemCfg.itemType;
		if (itemType) {
			isCheckBox = (itemType == 'check');
			isRadioBox = (itemType == 'radio');
		}
		if (isCheckBox) {
			itemCfg.iconClass = 'jl-menu-check';
			itemCfg.disabledIconClass = 'jl-menu-check-disabled';
		}
		if (isRadioBox) {
			itemCfg.iconClass = 'jl-menu-radio';
			itemCfg.disabledIconClass = 'jl-menu-radio-disabled';
		}
		if (itemCfg.items) {
			itemCfg.disabled = false;
		}
		var mi = document.createElement('div'), Z = this, jqMi = jQuery(mi);
		jqMi.addClass('jl-menu-item ' + (itemCfg.disabled ? 'jl-menu-disabled' : 'jl-menu-enabled'));

		if (!itemCfg.id) {
			itemCfg.id = jslet.nextId();
		}
		mi.id = itemCfg.id;
		mi.jsletvar = itemCfg;
		jqMi.on('click', function (event) {
			Z._ItemClick(this, this.jsletvar);
			event.stopPropagation();
			event.preventDefault();
		});

		jqMi.on('mouseover', function (event) {
			Z._ItemOver(this, this.jsletvar);
			if (Z._preHoverItem) {
				jQuery(Z._preHoverItem).removeClass('jl-menu-item-hover');
			}
			Z._preHoverItem = this;
			if (!this.jsletvar.disabled) {
				jQuery(this).addClass('jl-menu-item-hover');
			}
		});

		jqMi.on('mouseout', function (event) {
			if (!this.jsletvar.subMenu) {
				jQuery(this).removeClass('jl-menu-item-hover');
			}
		});

		var template = [];
		//template.push('<a href="javascript:;" onClick="javascript:this.blur();" class="');
		//template.push(itemCfg.disabled ? 'jl-menu-disabled' : 'jl-menu-enabled');
		//template.push('">');
		template.push('<span class="jl-menu-icon-placeholder ');
		if ((isCheckBox || isRadioBox) && !itemCfg.checked) {
			//Empty 
		} else {
			if (itemCfg.iconClass) {
				template.push((!itemCfg.disabled || !itemCfg.disabledIconClass) ? itemCfg.iconClass : itemCfg.disabledIconClass);
			}
		}
		template.push('"></span>');

		if (itemCfg.items) {
			template.push('<div class="jl-menu-arrow"></div>');
		}

		template.push('<a  href="javascript:void(0)" class="jl-focusable-item jl-menu-content ');
		template.push(' jl-menu-content-left jl-menu-content-right');
		template.push('">');
		template.push(itemCfg.name);
		template.push('</a>');
		mi.innerHTML = template.join('');
		container.appendChild(mi);
		if (itemCfg.items) {
			var el = document.createElement('div');
			document.body.appendChild(el);
			itemCfg.subMenu = new jslet.ui.Menu(el, { onItemClick: Z._onItemClick, items: itemCfg.items, invoker: mi });
		}
	},

	_createLine: function (container, itemCfg) {
		var odiv = document.createElement('div');
		jQuery(odiv).addClass('jl-menu-line');
		container.appendChild(odiv);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this, 
			jqEl = jQuery(Z.el);
		Z._activeSubMenu = null;
		jslet.ui.menuManager.unregister(Z.el.id);
		jqEl.off();
		jqEl.find('.jl-menu-item').each(function(){
			this.onmouseover = null;
			this.onclick = null;
			this.onmouseout = null;
		});
		
		$super();
	}
});

jslet.ui.register('Menu', jslet.ui.Menu);
jslet.ui.Menu.htmlTemplate = '<div></div>';

jslet.ui.Menu.setDisabled = function (menuId, disabled) {
	var jqMi;
	if (Object.isString(menuId)) {
		jqMi = jQuery('#'+menuId);
	} else {
		jqMi = jQuery(menuId);
	}
	var cfg = jqMi.context.jsletvar;
	if (cfg.items) {
		return;
	}
	if (disabled) {
		jqMi.removeClass('jl-menu-enabled');
		jqMi.addClass('jl-menu-disabled');
	} else {
		jqMi.removeClass('jl-menu-disabled');
		jqMi.addClass('jl-menu-enabled');
	}
	cfg.disabled = disabled;
};

jslet.ui.Menu.setChecked = function (menuId, checked) {
	var jqMi;
	if (typeof(menuId)==='string') {
		jqMi = jQuery('#' + menuId);
	} else {
		jqMi = jQuery(menuId);
	}
	var mi = jqMi.context,
		cfg = mi.jsletvar,
		itemType = cfg.itemType;
	if (itemType != 'check' && itemType != 'radio') {
		return;
	}
	if (itemType == 'radio') {
		if (cfg.checked && checked || !checked) {
			return;
		}
		var group = mi.group;
		//uncheck all radio button in the same group
		var allMi = mi.parentNode.childNodes;

		for (var i = 0, node, cfg1, icon, cnt = allMi.length; i < cnt; i++) {
			node = allMi[i];
			if (node == mi) {
				continue;
			}
			cfg1 = node.jsletvar;
			if (cfg1 && cfg1.itemType == 'radio' && cfg1.group == group) {
				icon = node.childNodes[0];
				if (cfg1.disabled) {
					jQuery(icon).removeClass(cfg1.disabledIconClass);
				} else {
					jQuery(icon).removeClass(cfg1.iconClass);
				}
				cfg1.checked = false;
			}
		}
	}

	var jqIcon = jQuery(mi.childNodes[0]);

	if (cfg.checked && !checked) {
		if (cfg.disabled) {
			jqIcon.removeClass(cfg.disabledIconClass);
		} else {
			jqIcon.removeClass(cfg.iconClass);
		}
	}
	if (!cfg.checked && checked) {
		if (cfg.disabled) {
			jqIcon.addClass(cfg.disabledIconClass);
		}else {
			jqIcon.addClass(cfg.iconClass);
		}
	}
	cfg.checked = checked;
};
﻿/* ========================================================================
 * Jslet framework: jslet.splitpanel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class Split Panel. Example:
 * <pre><code>
 * var jsletParam = {type:"SplitPanel",direction:"hori",floatIndex: 1};
 * //1. Declaring:
 *     &lt;div data-jslet='jsletParam' style="width: 300px; height: 400px;">
 *     &lt;div>content1&lt;/div>
 *     &lt;div>content2&lt;/div>
 *     &lt;/div>
 *     
 *  //2. Binding
 *     &lt;div id='ctrlId'>
 *       &lt;div>content1&lt;/div>
 *       &lt;div>content2&lt;/div>
 *     &lt;/div>
 *     //Js snippet
 *     var el = document.getElementById('ctrlId');
 *     jslet.ui.bindControl(el, jsletParam);
 *	
 *  //3. Create dynamically
 *     jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.SplitPanel = jslet.Class.create(jslet.ui.Control, {
	directions: ['hori', 'vert'],
	
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'direction,floatIndex,onExpanded,onSize';//{size:100, align:-1/0/1,minSize:10}
		/**
		 * {String} Split direction, optional value: hori, vert
		 * Default value is 'hori'
		 */
		Z._direction = 'hori';
		/**
		 * {Integer} Float panel index, only one panel can be a floating panel
		 */
		Z._floatIndex = 1;
		
		/**
		 * {Event} Fired when user expand/collapse one panel.
		 *  Pattern: 
		 *	function(panelIndex){} 
		 *	//panelIndex: Integer
		 */
		Z._onExpanded = null;
		
		/**
		 * {Event} Fired after user change size of one panel.
		 *  Pattern: 
		 *	function(panelIndex, newSize){} 
		 *	//panelIndex: Integer
		 *	//newSize: Integer
		 */
		Z._onSize = null;
		
		Z.panels = null; //Array, panel configuration
		Z.splitter = null;
		Z._oldSize = 0;
		jslet.resizeEventBus.subscribe(Z);
		$super(el, params);
	},

	floatIndex: function(index) {
		if(index === undefined) {
			return this._floatIndex;
		}
		jslet.Checker.test('SplitPanel.floatIndex', index).isGTEZero();
		this._floatIndex = index;
	},
	
	direction: function(direction) {
		if(direction === undefined) {
			return this._direction;
		}
		direction = jQuery.trim(direction);
		var checker = jslet.Checker.test('SplitPanel.direction', direction).required().isString();
		direction = direction.toLowerCase();
		checker.inArray(this.directions);
		this._direction = direction;
	},
	
	onExpanded: function(onExpanded) {
		if(onExpanded === undefined) {
			return this._onExpanded;
		}
		jslet.Checker.test('SplitPanel.onExpanded', onExpanded).isFunction();
		this._onExpanded = onExpanded;
	},
	
	onSize: function(onSize) {
		if(onSize === undefined) {
			return this._onSize;
		}
		jslet.Checker.test('SplitPanel.onSize', onSize).isFunction();
		this._onSize = onSize;
	},
   
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this, jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-splitpanel')) {
			jqEl.addClass('jl-splitpanel jl-border-box jl-round5');
		}
		Z.isHori = (Z._direction == 'hori');
		
		Z.width = jqEl.innerWidth();
		Z.height = jqEl.innerHeight();
		Z._oldSize = Z.isHori ? Z.width: Z.height;
		
		var panelDivs = jqEl.find('>div'),
			lastIndex = panelDivs.length - 1;
		if (!Z._floatIndex || Z._floatIndex > lastIndex) {
			Z._floatIndex = lastIndex;
		}
		if (Z._floatIndex > lastIndex) {
			Z._floatIndex = lastIndex;
		}
		if (!Z.panels) {
			Z.panels = [];
		}
		var containerSize = (Z.isHori ? Z.width : Z.height), sumSize = 0;

		panelDivs.each(function(k){
			var jqPanel = jQuery(panelDivs[k]),
				oPanel = Z.panels[k];
			if (!oPanel){
				oPanel = {};
				Z.panels[k] = oPanel;
			}

			var minSize = parseInt(jqPanel.css(Z.isHori ?'min-width': 'min-height'));
			oPanel.minSize = minSize ? minSize : 5;
			
			var maxSize = parseInt(jqPanel.css(Z.isHori ?'max-width': 'max-height'));
			oPanel.maxSize = maxSize ? maxSize : Infinity;
			oPanel.expanded = jqPanel.css('display') != 'none';
			
			var size = oPanel.size;
			if (size === null || size === undefined) {
				size = Z.isHori ? jqPanel.outerWidth(): jqPanel.outerHeight();
			} else {
				if (Z.isHori) {
					jqPanel.width(size - 5);
				} else {
					jqPanel.height(size - 5);
				}
			}
				
			if (k != Z._floatIndex){
				sumSize += size;
				oPanel.size = size;
			}
		});
		Z.panels[Z._floatIndex].size = containerSize - sumSize;
		
		Z.splitterTracker = document.createElement('div');
		var jqTracker = jQuery(Z.splitterTracker);
		jqTracker.addClass('jl-sp-splitter-tracker');
		var fixedSize = 0,
			clsName = Z.isHori ? 'jl-sp-panel-hori': 'jl-sp-panel-vert';
		Z.splitterClsName = Z.isHori ? 'jl-sp-splitter-hori': 'jl-sp-splitter-vert';
		Z.el.appendChild(Z.splitterTracker);
		if (Z.isHori) {
			Z.splitterTracker.style.height = '100%';
		} else {
			Z.splitterTracker.style.width = '100%';
		}
		var splitterSize = parseInt(jslet.ui.getCssValue(Z.splitterClsName, Z.isHori? 'width' : 'height'));
		panelDivs.after(function(k){
			var panel = panelDivs[k],
			jqPanel = jQuery(panel),
			expanded = Z.panels[k].expanded;
			
			jqPanel.addClass(clsName);

			if (k == Z._floatIndex) {
				Z.floatPanel = panel;
			} else {
				if (expanded) {
					fixedSize += splitterSize + Z.panels[k].size;
				} else {
					jqPanel.css('display', 'none');
					fixedSize += splitterSize;
				}
			}
			if (k == lastIndex){
				if (Z.isHori) {
					return '<div style="clear:both;width:0px"></div>';
				}
				return '';
			}
			var id = jslet.nextId(),
				minBtnCls = Z.isHori ? 'jl-sp-button-left' : 'jl-sp-button-top';
				
			if (Z._floatIndex <= k || !expanded) {
				minBtnCls += Z.isHori ? ' jl-sp-button-right' : ' jl-sp-button-bottom';
			}
			return '<div class="'+ Z.splitterClsName + ' jl-unselectable" id = "' + id + 
			'" jsletindex="'+ (k >= Z._floatIndex ? k+1: k)+ '"><div class="jl-sp-button ' + 
			minBtnCls +'"' + (expanded ? '': ' jsletcollapsed="1"') +'></div></div>';
		});
		if (Z.isHori) {
			jQuery(Z.floatPanel).width(jqEl.innerWidth() - fixedSize - 4);
		} else {
			jQuery(Z.floatPanel).height(jqEl.innerHeight() - fixedSize);
		}
		var splitters = jqEl.find('.'+Z.splitterClsName);
		splitters.on('mousedown', Z._splitterMouseDown);
		var splitBtns = splitters.children();
		splitBtns.on('mousedown', function(event){
			var jqBtn = jQuery(event.target),
				jqSplitter = jqBtn.parent(),
				index = parseInt(jqSplitter.attr('jsletindex'));
			Z.expand(index);
			event.stopPropagation();
		});
		
		var oSplitter;
		for(var i = 0, cnt = splitters.length; i < cnt; i++){
			oSplitter = splitters[i];
			oSplitter._doDragStart = Z._splitterDragStart;
			oSplitter._doDragging = Z._splitterDragging;
			oSplitter._doDragEnd = Z._splitterDragEnd;
			oSplitter._doDragCancel = Z._splitterDragCancel;
		}
	},
	
	/**
	 * Get float panel
	 * 
	 * @return {Html Element} 
	 */
	floatPanel: function(){
		return Z.panels[Z._floatIndex];	
	},
	
	changeSize: function(k, size){
		
	},
	
	/**
	 * Expand or collapse the specified panel
	 * 
	 * @param {Integer} index Panel index
	 * @param {Boolean} expanded True for expanded, false otherwise.
	 */
	expand: function(index, expanded, notChangeSize){
		var Z = this, jqPanel, jqEl = jQuery(Z.el),
			splitters = jqEl.find('.'+Z.splitterClsName);
		if (index < 0 || index > splitters.length) {
			return;
		}
		var	jqSplitter = jQuery(splitters[(index >= Z._floatIndex ? index - 1: index)]),
			jqBtn = jqSplitter.find(':first-child');
			
		if (expanded === undefined) {
			expanded  = jqBtn.attr('jsletcollapsed')=='1';
		}
		if (index < Z._floatIndex) {
			jqPanel = jqSplitter.prev();
		} else {
			jqPanel = jqSplitter.next();
		}
		if (Z.isHori){
			if (jqBtn.hasClass('jl-sp-button-right')) {
				jqBtn.removeClass('jl-sp-button-right');
			} else {
				jqBtn.addClass('jl-sp-button-right');
			}
		} else {
			if (jqBtn.hasClass('jl-sp-button-bottom')) {
				jqBtn.removeClass('jl-sp-button-bottom');
			} else {
				jqBtn.addClass('jl-sp-button-bottom');
			}
		}

		if (expanded){
			jqPanel.css('display', 'block');
			jqBtn.attr('jsletcollapsed', '0');
		}else{
			jqPanel.css('display','none');
			jqBtn.attr('jsletcollapsed', '1');
		}
		if(notChangeSize) {
			return;
		}
		var jqFp = jQuery(Z.floatPanel);
		if (Z.isHori) {
			jqFp.width(jqFp.width()+jqPanel.width()*(expanded ? -1: 1));
		} else {
			jqFp.height(jqFp.height()+jqPanel.height()*(expanded ? -1: 1));
		}
		Z.panels[index].expanded = expanded;
		if (Z._onExpanded) {
			Z._onExpanded.call(Z, panelIndex);
		}
		jslet.resizeEventBus.resize(Z.el);
	},
	
	/**
	 * @private
	 */
	_splitterMouseDown: function(event){
		var pos = jQuery(this).position(),
			Z = this.parentNode.jslet;
		Z.splitterTracker.style.top = pos.top + 'px';
		Z.splitterTracker.style.left = pos.left + 'px';
		Z.draggingId = this.id;
		var jqSplitter = jQuery('#'+Z.draggingId);
		jqBtn = jqSplitter.find(':first-child');
		if(jqBtn.attr('jsletcollapsed')=='1') { //Collapsed
			jqBtn.click();
			return;
		}
		
		jslet.ui.dnd.bindControl(this);
	},
		
	/**
	 * @private
	 */
	_splitterDragStart: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z.splitterTracker),
			jqSplitter = jQuery('#'+Z.draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			cfg = Z.panels[index],
			jqFp = jQuery(Z.floatPanel);
		
		Z.dragRangeMin = cfg.size - cfg.minSize;
		Z.dragRangeMax = cfg.maxSize - cfg.size;
		var fpMax = (Z.isHori ? jqFp.width() : jqFp.height()) - Z.panels[Z._floatIndex].minSize;
		if (Z.dragRangeMax > fpMax) {
			Z.dragRangeMax = fpMax;
		}
		jqTracker.show();
	},
	
	/**
	 * @private
	 */
	_splitterDragging: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z.splitterTracker),
			jqSplitter = jQuery('#'+Z.draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			delta = Math.abs(Z.isHori ? deltaX : deltaY),
			expanded;
			
		if (Z.isHori) {
			expanded = index < Z._floatIndex && deltaX >= 0 || index > Z._floatIndex && deltaX < 0;
		} else {
			expanded = index < Z._floatIndex && deltaY >= 0 || index > Z._floatIndex && deltaY < 0;
		}
		if (expanded && delta > Z.dragRangeMax){
			Z.endDelta = Z.dragRangeMax;
			return;
		}
		
		if (!expanded && delta > Z.dragRangeMin){
			Z.endDelta = Z.dragRangeMin;
			return;
		}
		
		Z.endDelta = Math.abs(Z.isHori ? deltaX : deltaY);
		var pos = jqTracker.offset();
		if (Z.isHori) {
			pos.left = x;
		} else {
			pos.top = y;
		}
		jqTracker.offset(pos);
	},
	
	/**
	 * @private
	 */
	_splitterDragEnd: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z.splitterTracker),
			jqSplitter = jQuery('#'+Z.draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			jqPanel = index < Z._floatIndex ? jqSplitter.prev(): jqSplitter.next(),
			expanded,
			jqFp = jQuery(Z.floatPanel);

		if (Z.isHori) {
			expanded = index < Z._floatIndex && deltaX >= 0 || index > Z._floatIndex && deltaX < 0;
		} else {
			expanded = index < Z._floatIndex && deltaY >= 0 || index > Z._floatIndex && deltaY < 0;
		}
		var delta = Z.endDelta * (expanded ? 1: -1);
		var newSize = Z.panels[index].size + delta;
		Z.panels[index].size = newSize;
		
		if (Z.isHori){
			jqPanel.width(newSize);
			jqFp.width(jqFp.width() - delta);
		}else{
			jqPanel.height(newSize);
			jqFp.height(jqFp.height() - delta);
		}
		if (Z._onSize) {
			Z._onSize.call(Z, index, newSize);
		}
		jslet.resizeEventBus.resize(Z.el);
		jqTracker.hide();
	},
	
	/**
	 * @private
	 */
	_splitterDragCancel: function (oldX, oldY, x, y, deltaX, deltaY){
		var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z.splitterTracker);
		jqTracker.hide();
	},
	
	/**
	 * Run when container size changed, it's revoked by jslet.resizeeventbus.
	 * 
	 */
	checkSizeChanged: function(){
		var Z = this,
			jqEl = jQuery(Z.el),
			currSize = Z.isHori ? jqEl.width() : jqEl.height();
		if ( Z._oldSize != currSize){
			var delta = currSize - Z._oldSize;
			Z._oldSize = currSize;
			var oFp = Z.panels[Z._floatIndex],
				jqFp = jQuery(Z.floatPanel),
				newSize = delta + (Z.isHori ? jqFp.width(): jqFp.height());

			if (newSize < oFp.minSize) {
				newSize = oFp.minSize;
			}
			if (Z.isHori) {
				jqFp.width(newSize);
			} else {
				jqFp.height(newSize);
			}
		}
		jslet.resizeEventBus.resize(Z.floatPanel);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this,
		jqEl = jQuery(Z.el);
		Z.splitterTracker = null;
		Z.floatPanel = null;
		var splitters = jqEl.find('.'+Z.splitterClsName);
		splitters.off('mousedown', Z._splitterMouseDown);
		var item;
		for(var i = 0, cnt = splitters.length; i < cnt; i++){
			item = splitters[i];
			jslet.ui.dnd.unbindControl(item);
			item._doDragStart = null;
			item._doDragging = null;
			item._doDragEnd = null;
			item._doDragCancel = null;
		}
		jslet.resizeEventBus.unsubscribe(Z);
		$super();
	}
});

jslet.ui.register('SplitPanel', jslet.ui.SplitPanel);
jslet.ui.SplitPanel.htmlTemplate = '<div></div>';
/* ========================================================================
 * Jslet framework: jslet.tabcontrol.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class TabControl. Example:
 * <pre><code>
 * var jsletParam = {type: "TabControl", 
 *		selectedIndex: 1, 
 *		onCreateContextMenu: doCreateContextMenu, 
 *		items: [
 *			{header: "one", userIFrame: true, url: "http://www.google.com", iconClass: "tabIcon"},
 *			{header: "two", closable: true, divId: "p2"},
 *			{header:"three",closable:true,divId:"p3"},
 *		]};
 *  //1. Declaring:
 *		&lt;div data-jslet='jsletParam' style="width: 300px; height: 400px;" />
 *
 *  //2. Binding
 *		&lt;div id='ctrlId' />
 *		//Js snippet
 *		var el = document.getElementById('ctrlId');
 *		jslet.ui.bindControl(el, jsletParam);
 *	
 *  //3. Create dynamically
 *		jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.TabControl = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'selectedIndex,newable,closable,items,onAddTabItem,onSelectedChanged,onRemoveTabItem,onCreateContextMenu';
		
		/**
		 * {Integer} Selected tab item index.
		 */
		Z._selectedIndex = 0;
		
		/**
		 * Identify if user can add tab item on fly. 
		 */
		Z._newable = true;
		
		/**
		 * Identify if user can close tab item on fly
		 */
		Z._closable = true;
		
		/**
		 * {Event} Fire when user toggle tab item.
		 * Pattern: 
		 *   function(oldIndex, newIndex){}
		 *   //oldIndex: Integer
		 *   //newIndex: Integer
		 */
		Z._onSelectedChanged = null;
		
		/**
		 * Fire after add a new tab item.
		 * Pattern: 
		 *   function(){}
		 */
		Z._onAddTabItem = null;
		
		/**
		 * Fire after remove a tab item.
		 * Pattern: 
		 *  function(tabIndex, selected){}
		 *  //tabIndex: Integer
		 *  //selected: Boolean Identify if the removing item is active
		 *  //return: Boolean, false - cancel removing tab item, true - remove tab item. 
		 */
		Z._onRemoveTabItem = null;
		
		/**
		 * (Event) Fire before show context menu
		 * Pattern: 
		 *   function(menuItems){}
		 *   //menuItems: Array of MenuItem, @see menu item configuration in jslet.menu.js.
		 */
		Z._onCreateContextMenu = null;
		
		/**
		 * {Array of jslet.ui.TabItem} Tab item configuration.
		 */
		Z._items = [];
		
		Z._itemsWidth = [];
		Z._containerWidth = 0;
		Z._ready = false;
		
		Z._leftIndex = 0;
		Z._rightIndex = 0;

		Z._tabControlWidth = jQuery(Z.el).width();
		jslet.resizeEventBus.subscribe(this);
		$super(el, params);
	},

	selectedIndex: function(index) {
		if(index === undefined) {
			return this._selectedIndex;
		}
		jslet.Checker.test('TabControl.selectedIndex', index).isGTEZero();
		if(this._ready) {
			this._chgSelectedIndex(index);
		} else {
			this._selectedIndex = index;
		}
	},
	
	newable: function(newable) {
		if(newable === undefined) {
			return this._newable;
		}
		this._newable = newable? true: false;
	},
	
	closable: function(closable) {
		if(closable === undefined) {
			return this._closable;
		}
		this._closable = closable? true: false;
	},
	
	onAddTabItem: function(onAddTabItem) {
		if(onAddTabItem === undefined) {
			return this._onAddTabItem;
		}
		jslet.Checker.test('TabControl.onAddTabItem', onAddTabItem).isFunction();
		this._onAddTabItem = onAddTabItem;
	},
	
	onSelectedChanged: function(onSelectedChanged) {
		if(onSelectedChanged === undefined) {
			return this._onSelectedChanged;
		}
		jslet.Checker.test('TabControl.onSelectedChanged', onSelectedChanged).isFunction();
		this._onSelectedChanged = onSelectedChanged;
	},

	onRemoveTabItem: function(onRemoveTabItem) {
		if(onRemoveTabItem === undefined) {
			return this._onRemoveTabItem;
		}
		jslet.Checker.test('TabControl.onRemoveTabItem', onRemoveTabItem).isFunction();
		this._onRemoveTabItem = onRemoveTabItem;
	},

	onCreateContextMenu: function(onCreateContextMenu) {
		if(onCreateContextMenu === undefined) {
			return this._onCreateContextMenu;
		}
		jslet.Checker.test('TabControl.onCreateContextMenu', onCreateContextMenu).isFunction();
		this._onCreateContextMenu = onCreateContextMenu;
	},
	 
	items: function(items) {
		if(items === undefined) {
			return this._items;
		}
		jslet.Checker.test('TabControl.items', items).isArray();
		var item;
		for(var i = 0, len = items.length; i < len; i++) {
			item = items[i];
			jslet.Checker.test('TabControl.items.header', item.header).isString().required();
		}
		this._items = items;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			template = [
			'<div class="jl-tab-header jl-unselectable"><div class="jl-tab-container jl-unselectable"><ul class="jl-tab-list">',
			Z._newable ? '<li><a href="javascript:;" class="jl-tab-inner"><span class="jl-tab-new">+</span></a></li>' : '',
			'</ul></div><a class="jl-tab-left jl-hidden"><span class="jl-nav-btn glyphicon glyphicon-circle-arrow-left"></span></a><a class="jl-tab-right  jl-hidden"><span class="jl-nav-btn glyphicon glyphicon-circle-arrow-right"></span></a></div><div class="jl-tab-items jl-round5"></div>'];

		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-tabcontrol'))
			jqEl.addClass('jl-tabcontrol jl-round5');
		jqEl.html(template.join(''));
		if (Z._newable) {
			oul = jqEl.find('.jl-tab-list')[0];
			var newTab = oul.childNodes[oul.childNodes.length - 1];
			Z._newTabItem = newTab;
			
			newTab.onclick = function () {
				var itemCfg = null;
				if (Z._onAddTabItem) {
					itemCfg = Z._onAddTabItem.call(Z);
				}
				if (!itemCfg) {
					itemCfg = new jslet.ui.TabItem();
					itemCfg.header = 'new tab';
					itemCfg.closable = true;
				}
				Z.addTabItem(itemCfg);
				Z._calcItemsWidth();
				Z.selectedIndex(Z._items.length - 1);
			};
		}

		var jqNavBtn = jqEl.find('.jl-tab-left');
		
		jqNavBtn.on("click",function (event) {
			Z._setVisiTabItems(Z._leftIndex - 1)
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		jqNavBtn.on("mousedown",function (event) {
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		jqNavBtn = jqEl.find('.jl-tab-right');

		jqNavBtn.on("click",function (event) {
			Z._setVisiTabItems(Z._leftIndex + 1)
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		jqNavBtn.on("mousedown",function (event) {
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		
		if (Z._items && Z._items.length > 0) {
			var oitem, 
				cnt = Z._items.length;
			for (var i = 0; i < cnt; i++) {
				oitem = Z._items[i];
				Z.addTabItem(oitem, true);
			}
		}
		Z._calcItemsWidth();
		Z._ready = true;
		Z._chgSelectedIndex(Z._selectedIndex);
	},

	addItem: function (itemCfg) {
		this._items[this._items.length] = itemCfg;
	},

	tabLabel: function(index, label) {
		jslet.Checker.test('tabLabel#index', index).isGTEZero();
		jslet.Checker.test('tabLabel#label', label).required().isString();
		
		var Z = this;
		var itemCfg = Z._getTabItemCfg(index);
		if(!itemCfg) {
			return;
		}

		itemCfg.label(label);
		var jqEl = jQuery(Z.el);
		var panelContainer = jqEl.find('.jl-tab-items')[0];
		var nodes = panelContainer.childNodes;
		jQuery(nodes[index]).find('.jl-tab-title').html(label);
		Z._calcItemsWidth();
	},
	
	tabDisabled: function(index, disabled) {
		jslet.Checker.test('tabLabel#index', index).isGTEZero();
		var Z = this;
		var itemCfg = Z._getTabItemCfg(index);
		if(!itemCfg) {
			return;
		}
		if(index == Z._selectedIndex) {
			console.warn('Cannot set current tab item to disabled.');
			return;
		}
		itemCfg.disabled(disabled);
		var jqEl = jQuery(Z.el);
		var panelContainer = jqEl.find('.jl-tab-items')[0];
		var nodes = panelContainer.childNodes;
		var jqItem = jQuery(nodes[index]);
		if(disabled) {
			jqItem.addClass('jl-tab-disabled');
		} else {
			jqItem.removeClass('jl-tab-disabled');
		}
	},
	
	/**
	 * Change selected tab item.
	 * 
	 * @param {Integer} index Tab item index which will be toggled to.
	 */
	_chgSelectedIndex: function (index) {
		var Z = this;
	
		var itemCfg = Z._getTabItemCfg(index);
		if(!itemCfg || itemCfg.disabled) {
			return;
		}
		if (Z._onSelectedChanged) {
			var canChanged = Z._onSelectedChanged.call(Z, Z._selectedIndex, index);
			if (canChanged !== undefined && !canChanged) {
				return;
			}
		}
		
		var jqEl = jQuery(Z.el),
			oli, 
			oul = jqEl.find('.jl-tab-list')[0],
			nodes = oul.childNodes,
			cnt = nodes.length - (Z._newable ? 2 : 1);

		var itemContainer = jqEl.find('.jl-tab-items')[0],
			item, 
			items = itemContainer.childNodes;
		for (var i = 0; i <= cnt; i++) {
			oli = jQuery(nodes[i]);
			item = items[i];
			if (i == index) {
				oli.addClass('jl-tab-selected');
				item.style.display = 'block';
			}
			else {
				oli.removeClass('jl-tab-selected');
				item.style.display = 'none';
			}
		}
		Z._selectedIndex = index;
		if(index < Z._leftIndex || index >= Z._rightIndex) {
			Z._setVisiTabItems(null, Z._selectedIndex);
		}
	},
	
	_getTabItemCfg: function(index) {
		var Z = this;
		if(Z._items.length <= index) {
			return null;
		}
		return Z._items[index];
	},
	
	_calcItemsWidth: function() {
		var Z = this,
			jqEl =jQuery(Z.el),
			nodes = jqEl.find('.jl-tab-list').children();
		Z._itemsWidth = [];
		nodes.each(function(index){
			Z._itemsWidth[index] = jQuery(this).outerWidth() + 5;
		});

		Z._containerWidth = jqEl.find('.jl-tab-container').innerWidth();
	},
	
	_setVisiTabItems: function(leftIndex, rightIndex) {
		var Z = this, w;
		if(!leftIndex && leftIndex !== 0) {
			if(!rightIndex) {
				return;
			}
			if(Z._newable) {
				rightIndex++;
			}
			w = Z._itemsWidth[rightIndex];
			Z._leftIndex = rightIndex;
			for(var i = rightIndex - 1; i >= 0; i--) {
				w += Z._itemsWidth[i];
				if(w > Z._containerWidth) {
					Z._leftIndex = i + 1;
					break;
				}
				Z._leftIndex = i;
			}
			leftIndex = Z._leftIndex;
		} else {
			Z._leftIndex = leftIndex;
		}
		w = 0;
		Z._rightIndex = leftIndex;
		for(var i = leftIndex, len = Z._itemsWidth.length; i < len; i++) {
			w += Z._itemsWidth[i];
			if(w > Z._containerWidth) {
				Z._rightIndex = i - 1;
				break;
			}
			Z._rightIndex = i;
		}
		var leftPos = 0;
		for(var i = 0; i < Z._leftIndex; i++) {
			leftPos += Z._itemsWidth[i];
		}
		leftPos += 5;
		var jqEl = jQuery(Z.el);
		jqEl.find('.jl-tab-container').scrollLeft(jslet.locale.isRtl ? 50000 - leftPos: leftPos);
		Z._setNavBtnVisible();
	},
	
	_setNavBtnVisible: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			jqBtnLeft = jqEl.find('.jl-tab-left'),
			isHidden = jqBtnLeft.hasClass('jl-hidden');
		if(Z._leftIndex > 0) {
			if(isHidden) {
				jqBtnLeft.removeClass('jl-hidden');
			}
		} else {
			if(!isHidden) {
				jqBtnLeft.addClass('jl-hidden');
			}
		}
		var jqBtnRight = jqEl.find('.jl-tab-right');
		var isHidden = jqBtnRight.hasClass('jl-hidden');
		var totalCnt = Z._itemsWidth.length;
		if(Z._rightIndex < totalCnt - 1) {
			if(isHidden) {
				jqBtnRight.removeClass('jl-hidden');
			}
		} else {
			if(!isHidden) {
				jqBtnRight.addClass('jl-hidden');
			}
		}
	},
	
	_createHeader: function (parent, itemCfg) {
		var Z = this,
			tmpl = ['<a href="javascript:;" class="jl-tab-inner" onclick="javascript:this.blur();"><span class="jl-tab-title '],
			canClose = Z._closable && itemCfg.closable;
		if (canClose) {
			tmpl.push('jl-tab-close-loc ');
		}

		tmpl.push('">');
		tmpl.push(itemCfg.header);
		tmpl.push('</span>');
		tmpl.push('</a>');
		if (canClose) {
			tmpl.push('<a href="javascript:;" class="jl-tab-close glyphicon glyphicon-remove"></a>');
		}
		var oli = document.createElement('li');
		if(itemCfg.disabled) {
			jQuery(oli).addClass('jl-tab-disabled');	
		}
		oli.innerHTML = tmpl.join('');

		if (Z._newable) {
			var lastNode = parent.childNodes[parent.childNodes.length - 1];
			parent.insertBefore(oli, lastNode);
		} else {
			parent.appendChild(oli);
		}
		oli.jslet = Z;
		jQuery(oli).on('click', Z._changeTabItem);

		if (canClose) {
			jQuery(oli).find('.jl-tab-close').click(Z._doCloseBtnClick);
		}
	},

	_changeTabItem: function (event) {
		var nodes = this.parentNode.childNodes,
			index = -1;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] == this) {
				index = i;
				break;
			}
		}
		this.jslet._chgSelectedIndex(index);
	},

	_doCloseBtnClick: function (event) {
		var oli = this.parentNode,
			nodes = oli.parentNode.childNodes,
			index = -1;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] == oli) {
				index = i;
				break;
			}
		}
		oli.jslet.removeTabItem(index);
		event.preventDefault();
		return false;
	},

	_createBody: function (parent, itemCfg) {
		var Z = this,
			jqDiv = jQuery(document.createElement('div'));
		if (!jqDiv.hasClass('jl-tab-panel')) {
			jqDiv.addClass('jl-tab-panel');
		}
		var odiv = jqDiv[0];
		parent.appendChild(odiv);
		var padding = 4,
			jqEl = jQuery(Z.el),
			jqHead = jqEl.find('.jl-tab-header'),
			h = itemCfg.height;
		h = h ? h: 300;

		if (itemCfg.content || itemCfg.divId) {
			var ocontent = itemCfg.content ? itemCfg.content : jQuery('#'+itemCfg.divId)[0];
			if (ocontent) {
				var pNode = ocontent.parentNode;
				if (pNode && pNode != odiv) {
					pNode.removeChild(ocontent);
				}
				odiv.appendChild(ocontent);
				ocontent.style.display = 'block';
				return;
			}
		}

		if (itemCfg.url) {
			if (itemCfg.useIFrame) {
				var s = '<iframe scrolling="yes" frameborder="0" src="' + 
				itemCfg.url + 
				'" style="width: 100%;height:' + h  + 'px;"></iframe>';
				jqDiv.html(s);
			}
		}
	},


	/**
	 * Add tab item dynamically.
	 * 
	 * @param {Object} newItemCfg Tab item configuration
	 * @param {Boolean} notRefreshRightIdx Improve performance purpose. If you need add a lot of tab item, you can set this parameter to true. 
	 */
	addTabItem: function (newItemCfg, notRefreshRightIdx) {
		var Z = this,
			jqEl = jQuery(Z.el),
			oul = jqEl.find('.jl-tab-list')[0];
		Z._items.push(newItemCfg);
		Z._createHeader(oul, newItemCfg);

		var panelContainer = jqEl.find('.jl-tab-items')[0];
		Z._createBody(panelContainer, newItemCfg);
		if(!notRefreshRightIdx) {
			Z._calcItemsWidth();
			Z._chgSelectedIndex(Z._selectedIndex + 1);
		}
	},

	/**
	 * Remove tab item with tabIndex
	 * 
	 * @param {Integer} tabIndex Tab item index
	 */
	removeTabItem: function (tabIndex) {
		var Z = this,
			jqEl = jQuery(Z.el),
			oli, 
			oul = jqEl.find('.jl-tab-list')[0],
			nodes = oul.childNodes,
			cnt = nodes.length - (Z._newable ? 2 : 1);
		if (tabIndex > cnt || tabIndex < 0) {
			return;
		}
		oli = jQuery(nodes[tabIndex]);
		var selected = oli.hasClass('jl-tab-selected');
		if (Z._onRemoveTabItem) {
			var canRemoved = Z._onRemoveTabItem.call(Z, tabIndex, selected);
			if (!canRemoved) {
				return;
			}
		}
		oul.removeChild(oli[0]);
		Z._items.splice(tabIndex, 1);
		var panelContainer = jqEl.find('.jl-tab-items')[0];
		nodes = panelContainer.childNodes;
		panelContainer.removeChild(nodes[tabIndex]);
		Z._calcItemsWidth();

		if (selected) {
			cnt--;
			tabIndex = Z._getNextValidIndex(tabIndex, tabIndex >= cnt)
			if (tabIndex >= 0) {
				Z._chgSelectedIndex(tabIndex);
			}
		}
	},

	_getNextValidIndex: function(start, isLeft) {
		var Z = this;
		if(isLeft) {
			for(var i = start - 1; i >= 0; i--) {
				if(!Z._items[i].disabled) {
					return i;
				}
			}
		} else {
			for(var i = start + 1, len = Z._items.length; i < len; i++) {
				if(!Z._items[i].disabled) {
					return i;
				}
			}
		}
		return -1;
	},
	
	/**
	 * Close the current active tab item  if this tab item is closable.
	 */
	close: function () {
		var Z = this,
			k = Z._selectedIndex;
		if (k >= 0 && Z._items[k].closable) {
			Z.removeTabItem(k);
		}
		Z._calcItemsWidth();
	},

	/**
	 * Close all closable tab item except current active tab item.
	 */
	closeOther: function () {
		var Z = this;
		for (var i = Z._items.length - 1; i >= 0; i--) {
			if (Z._items[i].closable) {
				if (Z._selectedIndex == i) {
					continue;
				}
				Z.removeTabItem(i);
			}
		}
		Z._calcItemsWidth();
	},
	
	/**
	 * Run when container size changed, it's revoked by jslet.resizeeventbus.
	 * 
	 */
	checkSizeChanged: function(){
		var Z = this,
			currWidth = jQuery(Z.el).width();
		if ( Z._tabControlWidth != currWidth){
			Z._tabControlWidth = currWidth;
			Z._calcItemsWidth();
			Z._setVisiTabItems(Z._leftIndex);
		}
	},
	
	_createContextMenu: function () {
		var Z = this;
		if (!jslet.ui.Menu || !Z._closable) {
			return;
		}
		var menuCfg = { type: 'Menu', onItemClick: Z._menuItemClick, items: [
			{ id: 'close', name: jslet.locale.TabControl.close},
			{ id: 'closeOther', name: jslet.locale.TabControl.closeOther}]};
		if (Z._onCreateContextMenu) {
			Z._onCreateContextMenu.call(Z, menuCfg.items);
		}

		if (menuCfg.items.length === 0) {
			return;
		}
		Z.contextMenu = jslet.ui.createControl(menuCfg);

		var head = jQuery(Z.el).find('.jl-tab-container')[0];

		head.oncontextmenu = function (event) {
			var evt = event || window.event;
			Z.contextMenu.showContextMenu(evt, Z);
		};
	},

	_menuItemClick: function (menuid, checked) {
		if (menuid == 'close') {
			this.close();
		} else {
			if (menuid == 'closeOther') {
				this.closeOther();
			}
		}
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		if(Z._newTabItem) {
			Z._newTabItem.onclick = null;
			Z._newTabItem = null;
		}
		var jqEl = jQuery(Z.el), 
			head = jqEl.find('.jl-tab-header')[0];
		
		jqEl.find('.jl-tab-left').off();
		jqEl.find('.jl-tab-right').off();
		head.oncontextmenu = null;
		jqEl.find('.jl-tab-close').off();
		var items = jqEl.find('.jl-tab-list').find('li');
		items.off();
		items.each(function(){
			this.jslet = null;
		});
		jslet.resizeEventBus.unsubscribe(this);

		$super();
	}
});

jslet.ui.register('TabControl', jslet.ui.TabControl);
jslet.ui.TabControl.htmlTemplate = '<div></div>';

/**
* Tab Item
*/
jslet.ui.TabItem = function () {
	var Z = this;
	Z.id = null; //{String} Element Id
	Z.index = -1; //{Integer} TabItem index
	Z.header = null; //{String} Head of tab item
	Z.closable = false; //{Boolean} Can be closed or not
	Z.disabled = false; //{Boolean} 
	Z.useIFrame = false; //{Boolean}
	Z.height = 100;
	Z.url = null; //{String} 
	Z.divId = null; //{String} 
	Z.content = null; //{String} 
};


/* ========================================================================
 * Jslet framework: jslet.tippanel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
* @class TipPanel. Example:
* <pre><code>
*   var tipPnl = new jslet.ui.TipPanel();
*   tipPnl.show('Hello world', 10, 10);
* </code></pre>
*/
jslet.ui.TipPanel = function () {
	this._hideTimerId = null;
	this._showTimerId = null;
	this._oldElement = null;
	var p = document.createElement('div');
	jQuery(p).addClass('jl-tip-panel');
	document.body.appendChild(p);
	this._tipPanel = p;

	/**
	 * Show tips at specified position. Example:
	 * <pre><code>
	 *  tipPnl.show('foo...', event);
	 *  tipPnl.show('foo...', 100, 200);
	 * </code></pre>
	 * 
	 * @param {String} tips Tips text
	 * @param {Integer or Event} left Position left, if left is mouse event, then top argument can't be specified
	 * @param {Integer} top Position top
	 */
	this.show = function (tips, leftOrEvent, top) {
		var Z = this;
		var len = arguments.length;
		var isSameCtrl = false, left = leftOrEvent;
		if (len == 2) { //this.show(tips)
			var evt = left;
			evt = jQuery.event.fix( evt );

			top = evt.pageY + 16; left = evt.pageX + 2;
			var ele = evt.currentTarget;
			isSameCtrl = (ele === Z._oldElement);
			Z._oldElement = ele;
		} else {
			left = parseInt(left);
			top = parseInt(top);
		}

		if (Z._hideTimerId) {
			window.clearTimeout(Z._hideTimerId);
			if (isSameCtrl) {
				return;
			}
		}

		this._showTimerId = window.setTimeout(function () {
			var p = Z._tipPanel;
			p.innerHTML = tips;
			p.style.left = left + 'px';
			p.style.top = top + 'px';
			Z._tipPanel.style.display = 'block';
			Z._showTimerId = null;
		}, 300);
	};

	/**
	 * Hide tip panel
	 */
	this.hide = function () {
		var Z = this;
		if (Z._showTimerId) {
			window.clearTimeout(Z._showTimerId);
			return;
		}
		Z._hideTimerId = window.setTimeout(function () {
			Z._tipPanel.style.display = 'none';
			Z._hideTimerId = null;
			Z._oldElement = null;
		}, 300);
	};
};

/**
 * Global tip panel
 */
jslet.ui.globalTip = new jslet.ui.TipPanel();
/* ========================================================================
 * Jslet framework: jslet.waitingbox.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class WaitingBox. Example:
 * <pre><code>
 *   var wb = new jslet.ui.WaitingBox(document.getElementById("test"), "Gray", true);
 *	wb.show("Please wait a moment...");
 * 
 * </code></pre>
 * @param {Html Element} container The container which waitingbox reside on.
 * @param {String} overlayColor Overlay color
 * @param {Boolean} tipsAtNewLine Tips is at new line or not. If false, tips and waiting icon is at the same line.
 */
jslet.ui.WaitingBox = function (container, overlayColor, tipsAtNewLine) {
	var overlay = new jslet.ui.OverlayPanel(container);
	var s = '<div class="jl-waitingbox"><b class="jl-waitingbox-icon"></b>';
		s += '<span id="tips"></span></div>';

	jQuery(overlay.overlayPanel).html(s);

	/**
	 * Show wating box
	 * 
	 * @param {String} tips Tips
	 */
	this.show = function (tips) {
		var p = overlay.overlayPanel,
			box = p.firstChild,
			tipPanel = box.childNodes[1];
		tipPanel.innerHTML = tips ? tips : '';
		var jqPnl = jQuery(p),
			ph = jqPnl.height(),
			pw = jqPnl.width();

		setTimeout(function () {
			var jqBox = jQuery(box);
			box.style.top = Math.round((ph - jqBox.height()) / 2) + 'px';
			box.style.left = Math.round((pw - jqBox.width()) / 2) + 'px';
		}, 10);

		overlay.show();
	};

	/**
	 * Hide waiting box
	 */
	this.hide = function () {
		overlay.hide();
	};

	this.destroy = function () {
		overlay.overlayPanel.innerHTML = '';
		overlay.destroy();
	};
};
/* ========================================================================
 * Jslet framework: jslet.window.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class Window, it has the following function: 
 * 1. Show as modal or modeless;
 * 2. User can change window size;
 * 3. User can minimize/maximize/restore/close window;
 * 4. User can move window;
 * 
 * Example:
 * <pre><code>
	var oWin = jslet.ui.createControl({ type: "Window", iconClass:"winicon", caption: "test window", minimizable: false, maximizable:false,onActive: doWinActive, onPositionChanged: doPositionChanged });
	oWin.setContent("Open modeless window in the Body(with icon)!");
	oWin.show(350,250);
	//or oWin.showModel(350, 250);

 *
 * </code></pre>
 */
jslet.ui.Window = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.el = el;
		Z.allProperties = 'caption,resizable,minimizable,maximizable,closable,iconClass,onSizeChanged,onClosed,onPositionChanged,onActive,width,height,minWidth,maxWidth,minHeight,maxHeight,isCenter,stopEventBubling';
		/**
		 * {String} Window caption
		 */
		Z._caption = null;
		
		/**
		 * {Boolean} Identify if user can change window size with dragging.
		 */
		Z._resizable = true;
		
		/**
		 * {Boolean} Identify if window can be minimized or not.
		 */
		Z._minimizable = true;

		/**
		 * {Boolean} Identify if window can be maximized or not.
		 */
		Z._maximizable = true;
		
		/**
		 * {Boolean} Identify if window can be closed or not.
		 */
		Z._closable = true;
		
		/**
		 * Window caption icon style class.
		 */
		Z._iconClass = null;
		
		/**
		 * {Integer} Window width
		 */
		Z._width = 0;
		/**
		 * {Integer} Window width
		 */
		Z._height = 0;
		/**
		 * {Integer} Window height
		 */
		Z._minWidth = 20;
		/**
		 * {Integer} Window maximized width
		 */
		/**
		 * {Integer} Window minimized height
		 */
		Z._minHeight = 30;
		/**
		 * {Integer} Window maximized width
		 */
		Z._maxWidth = -1;
		/**
		 * {Integer} Window maximized height
		 */
		Z._maxHeight = -1;

		/**
		 * {Boolean} Identify if window is showing at center of offset parent or not.
		 */
		Z._isCenter = false;
 
		/**
		 * {Event} Fired when user changes the window's size.
		 * Pattern: 
		 *   function(width, height){}
		 *   //width: Integer Window width
		 *   //height: Integer Window height
		 */
		Z._onSizeChanged = null;
		
		/**
		 * {Event} Fired when user changes the window's position.
		 * Pattern: 
		 *   function(left, top){}
		 *   //left: Integer Window position left
		 *   //top: Integer Window position top 
		 */
		Z._onPositionChanged = null;
		
		/**
		 * {Event} Fired when uses activates window.
		 * Pattern: 
		 *	function(windObj){}
		 *	//windObj: jslet.ui.Window Window Object
		 */
		Z._onActive = null;
		
		/**
		 * {Event} Fired when uses closes window.
		 * Pattern: 
		 *	function(windObj){}
		 *	//windObj: jslet.ui.Window Window Object
		 *	//return: String If return value equals 'hidden', then hide window instead of closing.
		 */
		Z._onClosed = null;

		/**
		 * @private
		 */
		Z._stopEventBubling = false;
		
		//@private
		Z.isModal = false;
		//@private
		Z.state = null; //min,max
		$super(el, params);
	},

	caption: function(caption) {
		if(caption === undefined) {
			return this._caption;
		}
		jslet.Checker.test('Window.caption', caption).isString();
		this._caption = caption;
	},
	
	iconClass: function(iconClass) {
		if(iconClass === undefined) {
			return this._iconClass;
		}
		jslet.Checker.test('Window.iconClass', iconClass).isString();
		this._iconClass = iconClass;
	},
	
	resizable: function(resizable) {
		if(resizable === undefined) {
			return this._resizable;
		}
		this._resizable = resizable? true: false;
	},
	
	minimizable: function(minimizable) {
		if(minimizable === undefined) {
			return this._minimizable;
		}
		this._minimizable = minimizable? true: false;
	},
	
	maximizable: function(maximizable) {
		if(maximizable === undefined) {
			return this._maximizable;
		}
		this._maximizable = maximizable? true: false;
	},
	
	closable: function(closable) {
		if(closable === undefined) {
			return this._closable;
		}
		this._closable = closable? true: false;
	},
	
	isCenter: function(isCenter) {
		if(isCenter === undefined) {
			return this._isCenter;
		}
		this._isCenter = isCenter? true: false;
	},
	
	stopEventBubling: function(stopEventBubling) {
		if(stopEventBubling === undefined) {
			return this._stopEventBubling;
		}
		this._stopEventBubling = stopEventBubling? true: false;
	},
	
	width: function(width) {
		if(width === undefined) {
			return this._width;
		}
		jslet.Checker.test('Window.width', width).isGTZero();
		this._width = width;
	},

	height: function(height) {
		if(height === undefined) {
			return this._height;
		}
		jslet.Checker.test('Window.height', height).isGTZero();
		this._height = height;
	},

	minWidth: function(minWidth) {
		if(minWidth === undefined) {
			return this._minWidth;
		}
		jslet.Checker.test('Window.minWidth', minWidth).isGTZero();
		this._minWidth = minWidth;
	},

	minHeight: function(minHeight) {
		if(minHeight === undefined) {
			return this._minHeight;
		}
		jslet.Checker.test('Window.minHeight', minHeight).isGTZero();
		this._minHeight = minHeight;
	},

	maxWidth: function(maxWidth) {
		if(maxWidth === undefined) {
			return this._maxWidth;
		}
		jslet.Checker.test('Window.maxWidth', maxWidth).isNumber();
		this._maxWidth = maxWidth;
	},

	maxHeight: function(maxHeight) {
		if(maxHeight === undefined) {
			return this._maxHeight;
		}
		jslet.Checker.test('Window.maxHeight', maxHeight).isNumber();
		this._maxHeight = maxHeight;
	},

	onSizeChanged: function(onSizeChanged) {
		if(onSizeChanged === undefined) {
			return this._onSizeChanged;
		}
		jslet.Checker.test('Window.onSizeChanged', onSizeChanged).isFunction();
		this._onSizeChanged = onSizeChanged;
	},
	
	onPositionChanged: function(onPositionChanged) {
		if(onPositionChanged === undefined) {
			return this._onPositionChanged;
		}
		jslet.Checker.test('Window.onPositionChanged', onPositionChanged).isFunction();
		this._onPositionChanged = onPositionChanged;
	},

	onActive: function(onActive) {
		if(onActive === undefined) {
			return this._onActive;
		}
		jslet.Checker.test('Window.onActive', onActive).isFunction();
		this._onActive = onActive;
	},
	
	onClosed: function(onClosed) {
		if(onClosed === undefined) {
			return this._onClosed;
		}
		jslet.Checker.test('Window.onClosed', onClosed).isFunction();
		this._onClosed = onClosed;
	},
	
	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
	},

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		if (!Z._closable) {
			Z._minimizable = false;
			Z._maximizable = false;
		}
		if (Z._minWidth < 20) {
			Z._minWidth = 20;
		}
		if (Z.minHeight < 30) {
			Z.minheight = 30;
		}
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-window')) {
			jqEl.addClass('jl-window jl-border-box jl-unselectable jl-bgcolor jl-round5');
		}
		if (!Z._width) {
			Z._width = parseInt(Z.el.style.width);
		}
		if (!Z._height) {
			Z._height = parseInt(Z.el.style.height);
		}
		if (!Z._width) {
			Z._width = 300;
		}
		if (!Z._height) {
			Z._height = 300;
		}
		Z.el.style.width = Z._width + 'px';
		Z.el.style.height = Z._height + 'px';

		var template = [
		'<div class="jl-win-header jl-unselectable" style="position:relative;width: 100%;cursor:move">',
			Z._iconClass ? '<div class="jl-win-header-icon ' + Z._iconClass + '"></div>' : '',

			'<div class="jl-win-title jl-unselectable">', Z._caption ? Z._caption : '', '</div>',
			'<div class="jl-win-tool jl-unselectable">'];
		if (!jslet.locale.isRtl){
			template.push(Z._minimizable ? '<a href="javascript:;" class="jl-win-min" onfocus="this.blur();"></a>' : '');
			template.push(Z._maximizable ? '<a href="javascript:;" class="jl-win-max" onfocus="this.blur();"></a>' : '');
			template.push(Z._closable ? '<a href="javascript:;" class="jl-win-close" onfocus="this.blur();"></a>' : '');
		}else{
			template.push(Z._closable ? '<a href="javascript:;" class="jl-win-close" onfocus="this.blur();"></a>' : '');
			template.push(Z._maximizable ? '<a href="javascript:;" class="jl-win-max" onfocus="this.blur();"></a>' : '');
			template.push(Z._minimizable ? '<a href="javascript:;" class="jl-win-min" onfocus="this.blur();"></a>' : '');
		}
		template.push('</div></div>');
		template.push('<div class="jl-win-body jl-unselectable" title="" style="width: 100%;cursor:default"></div>');

		jqEl.html(template.join(''));
		jqEl.on('mousemove', Z._doWinMouseMove);
		jqEl.on('mousedown', Z._doWinMouseDown);
		jqEl.on('dblclick', function(event){
			event.stopPropagation();
			event.preventDefault();
		});

		jqEl.on('click', function(event){
			if(Z.isModal || Z._stopEventBubling) {
				event.stopPropagation();
				event.preventDefault();
			}
		});
		
		var jqHeader = jqEl.find('.jl-win-header'),
			header = jqHeader[0];
		Z._headerHeight = jqHeader.height();
		var bodyDiv = jqEl.find('.jl-win-body')[0],
			bh = Z._height - Z._headerHeight - 12;
		if (bh < 0) {
			bh = 0;
		}
		bodyDiv.style.height = bh + 'px';
		jqBody = jQuery(bodyDiv);
		jqBody.on('mouseenter',function (event) {
			window.setTimeout(function(){
				if (jslet.temp_dragging) {
					return;
				}
				Z.cursor = null;
			},300);
		});
		jqBody.on('dblclick',function (event) {
			event.stopPropagation();
			event.preventDefault();
		});
		
		jqHeader.on('mousedown',function (event) {
			Z.activate();
			if (Z.state == 'max') {
				return;
			}
			Z.cursor = null;
			jslet.ui.dnd.bindControl(this);
		});

		jqHeader.on('dblclick',function (event) {
			event.stopPropagation();
			event.preventDefault();
			if (!Z._maximizable) {
				return;
			}
			if (Z.state != 'max') {
				Z.maximize();
			} else {
				Z.restore();
			}
		});

		header._doDragStart = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._createTrackerMask(header);
			Z.trackerMask.style.cursor = header.style.cursor;
			jslet.temp_dragging = true;
		};

		header._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z.setPosition(Z.left + deltaX, Z.top + deltaY, true);
		};

		header._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
			var left = parseInt(Z.el.style.left);
			var top = parseInt(Z.el.style.top);
			Z.setPosition(left, top);
			Z._removeTrackerMask();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		header._doDragCancel = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z.setPosition(Z.left, Z.top);
			Z._removeTrackerMask();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		Z.el._doDragStart = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._createTrackerMask(this);
			Z._createTracker();
			Z.trackerMask.style.cursor = Z.el.style.cursor;
			jslet.temp_dragging = true;
		};

		Z.el._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._changeTrackerSize(deltaX, deltaY);
		};

		Z.el._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
			if (!Z.tracker) {
				return;
			}
			var left = parseInt(Z.tracker.style.left);
			var top = parseInt(Z.tracker.style.top);
			var width = parseInt(Z.tracker.style.width);
			var height = parseInt(Z.tracker.style.height);

			Z.setPosition(left, top);
			Z.changeSize(width, height);
			Z._removeTrackerMask();
			Z._removeTracker();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		Z.el._doDragCancel = function (oldX, oldY, x, y, deltaX, deltaY) {
			Z._removeTrackerMask();
			Z._removeTracker();
			Z.cursor = null;
			jslet.temp_dragging = false;
		};

		if (Z._closable) {
			var jqClose = jqEl.find('.jl-win-close');
			jqClose.click(function (event) {
				Z.close();
				event = jQuery.event.fix( event || window.event );
				event.stopPropagation();
				event.preventDefault();
			});
		}
		if (Z._minimizable) {
			var jqMin = jqEl.find('.jl-win-min');
			jqMin.click(function (event) {
				if (Z.state == 'max') {
					var btnMax = jqEl.find('.jl-win-restore')[0];
					if (btnMax) {
						btnMax.className = 'jl-win-max';
					}
				}
				Z.minimize();
				event = jQuery.event.fix( event || window.event );
				event.stopPropagation();
				event.preventDefault();
			});
		}
		if (Z._maximizable) {
			var jqMax = jqEl.find('.jl-win-max'),
				btnMax = jqMax[0];
			jqMax.click(function (event) {
				if (Z.state != 'max') {
					btnMax.className = 'jl-win-restore';
					Z.maximize();
				} else {
					btnMax.className = 'jl-win-max';
					Z.restore();
				}
				event = jQuery.event.fix( event || window.event );
				event.stopPropagation();
				event.preventDefault();
			});
		}
	},

	/**
	 * Show window at specified position
	 * 
	 * @param {Integer} left Position left.
	 * @param {Integer} top Position top.
	 */
	show: function (left, top) {
		var Z = this;
		if (Z._isCenter) {
			var offsetP = jQuery(Z.el).offsetParent()[0],
				jqOffsetP = jQuery(offsetP),
				pw = jqOffsetP.width(),
				ph = jqOffsetP.height();
			left = offsetP.scrollLeft + Math.round((pw - Z._width) / 2);
			top = offsetP.scrollTop + Math.round((ph - Z._height) / 2);
		}

		Z.top = top ? top : 0;
		Z.left = left ? left : 0;
		Z.el.style.left = Z.left + 'px';
		Z.el.style.top = Z.top + 'px';
		Z.el.style.display = 'block';

		if (Z.hasShadow) {
			Z._createShadow();
			Z.shadow.style.top = Z.top + 'px';
			Z.shadow.style.left = Z.left + 'px';
			Z.shadow.style.display = 'block';
		}
		Z.activate();
	},

	/**
	 * Show modal window at specified position
	 * 
	 * @param {Integer} left Position left.
	 * @param {Integer} top Position top.
	 */
	showModal: function (left, top) {
		var Z = this;
		Z.isModal = true;
		if (!Z.overlay) {
			Z.overlay = new jslet.ui.OverlayPanel(Z.el.parentNode);
		}
		jslet.ui.GlobalZIndex += 10;
		var k = jslet.ui.GlobalZIndex;
		Z.el.style.zIndex = k;
		if (Z.shadow) {
			Z.shadow.style.zIndex = k - 1; 
		}
		Z.show(left, top);
		Z.overlay.setZIndex(k - 2);
		Z.overlay.show();
	},

	/**
	 * Hide window
	 */
	hide: function () {
		var Z = this;
		Z.el.style.display = 'none';
		if (Z.shadow) {
			Z.shadow.style.display = 'none';
		}
		if (Z.overlay) {
			Z.overlay.hide();
		}
	},

	/**
	 * Close window, this will fire onClosed event.
	 * 
	 */
	close: function () {
		var Z = this;
		if (Z._onClosed) {
			var action = Z._onClosed.call(Z);
			if (action && action.toLowerCase() == 'hidden') {
				Z.hide();
				return;
			}
		}
		var pnode = Z.el.parentNode;
		if (Z.shadow) {
			pnode.removeChild(Z.shadow);
			Z.shadow = null;
		}
		pnode.removeChild(Z.el);
		if (Z.overlay) {
			Z.overlay.destroy();
			Z.overlay = null;
		}
		jslet.ui.GlobalZIndex -= 10;
		Z.destroy();
	},

	/**
	 * Minimize window
	 */
	minimize: function () {
		var Z = this;
		if (Z.state == 'min') {
			Z.restore();
			return;
		}
		if (Z.state == 'max') {
			Z.restore();
		}
		Z.changeSize(null, Z._headerHeight + 8, true);
		Z.state = 'min';
	},

	/**
	 * Maximize window
	 */
	maximize: function () {
		var Z = this;
		var offsetP = jQuery(Z.el).offsetParent();
		var width = offsetP.width(); // -12;
		var height = offsetP.height(); // -12;
		Z.setPosition(0, 0, true);
		Z.changeSize(width, height, true);
		Z.state = 'max';
	},

	/**
	 * Restore window
	 */
	restore: function () {
		var Z = this;
		Z.setPosition(Z.left, Z.top, true);
		Z.changeSize(Z._width, Z._height, true);
		Z.state = null;
	},

	/**
	 * Activate window, this will fire the 'OnActive' event
	 */
	activate: function () {
		var Z = this;
		if (!Z.overlay) {
			Z.bringToFront();
		}
		if (Z._onActive) {
			Z._onActive.call();
		}
	},

	/**
	 * Change window position.
	 * 
	 * @param {Integer} left Position left
	 * @param {Integer} top Position top
	 * @param {Boolean} notUpdateLeftTop True - Only change html element position, 
	 *		not change the inner position of Window object, it is usually use for moving action
	 */
	setPosition: function (left, top, notUpdateLeftTop) {
		var Z = this;
		if (!notUpdateLeftTop) {
			Z.left = left;
			Z.top = top;
		} else {
			if (Z._onPositionChanged) {
				var result = Z._onPositionChanged.call(Z, left, top);
				if (result) {
					if (result.left) {
						left = result.left;
					}
					if (result.top) {
						top = result.top;
					}
				}
			}
		}
		Z.el.style.left = left + 'px';
		Z.el.style.top = top + 'px';
		if (Z.shadow) {
			Z.shadow.style.top = top + 'px';
			Z.shadow.style.left = left + 'px';
		}
	},

	/**
	 * Change window size.
	 * 
	 * @param {Integer} width Window width
	 * @param {Integer} height Window height
	 * @param {Boolean} notUpdateSize True - Only change html element size, 
	 *		not change the inner size of Window object, it is usually use for moving action
	 */
	changeSize: function (width, height, notUpdateSize) {
		var Z = this;
		if (!width) {
			width = Z._width;
		}
		if (!height) {
			height = Z._height;
		}

		if (Z._onSizeChanged) {
			Z._onSizeChanged.call(Z, width, height);
		}

		if (!notUpdateSize) {
			Z._width = width;
			Z._height = height;
		}
		Z.el.style.width = width + 'px';
		Z.el.style.height = height + 'px';
		if (Z.shadow) {
			Z.shadow.style.width = width + 3 + 'px';
			Z.shadow.style.height = height + 3 + 'px';
		}

		var jqEl = jQuery(Z.el);
		var bodyDiv = jqEl.find('.jl-win-body')[0];
		var bh = height - Z._headerHeight - 12;
		if (bh < 0) {
			bh = 0;
		}
		bodyDiv.style.height = bh + 'px';
	},

	/**
	 * Get window caption element. You can use it to customize window caption.
	 * 
	 * @return {Html Element}
	 */
	getCaptionDiv: function () {
		return jQuery(this.el).find('.jl-win-title')[0];
	},

	/**
	 * Set window caption
	 * 
	 * @param {String} caption Window caption
	 */
	changeCaption: function (caption) {
		this.caption = caption;
		var captionDiv = jQuery(this.el).find('.jl-win-title');
		captionDiv.html(caption);
	},

	/**
	 * Get window content element. You can use it to customize window content.
	 * 
	 * @return {Html Element}
	 */
	getContentDiv: function () {
		return jQuery(this.el).find('.jl-win-body')[0];
	},

	/**
	 * Set window content
	 * 
	 * @param {String} html Html text for window content
	 */
	setContent: function (html) {
		if (!html){
			jslet.showError('Window content cannot be null!');
			return;
		}
		var bodyDiv = jQuery(this.el).find('.jl-win-body');
		if (html && html.toLowerCase) {
			bodyDiv.html(html);
		} else {
			bodyDiv.html('');
			
			html.parentNode.removeChild(html);
			bodyDiv[0].appendChild(html);
			if (html.style && html.style.display == 'none') {
				html.style.display = 'block';
			}
		}
	},

	/**
	 * Bring window to front
	 */
	bringToFront: function () {
		var Z = this;
		var p = Z.el.parentNode;
		var node, jqEl = jQuery(Z.el);
		var maxIndex = 0, jqNode;
		for (var i = 0, cnt = p.childNodes.length; i < cnt; i++) {
			node = p.childNodes[i];
			if (node.nodeType != 1 || node == Z.el) {
				if (!Z.isModal) {
					jqEl.addClass('jl-window-active');
				}
				continue;
			}
			jqNode = jQuery(node);
			if (jqNode.hasClass('jl-window')) {
				if (maxIndex < node.style.zIndex) {
					maxIndex = node.style.zIndex;
				}
				if (!Z.isModal) {
					jqNode.removeClass('jl-window-active');
				}
			}
		}
		if (Z.el.style.zIndex < maxIndex || maxIndex === 0) {
			Z.setZIndex(maxIndex + 3);
		}
	},

	/**
	 * Set window Z-Index
	 * 
	 * @param {Integer} zIndex Z-Index
	 */
	setZIndex: function (zIndex) {
		this.el.style.zIndex = zIndex;
		if (this.shadow) {
			this.shadow.style.zIndex = zIndex - 1;
		}
	},

	_checkSize: function (width, height) {
		var Z = this;
		if (width) {
			if (width < Z._minWidth || Z._maxWidth > 0 && width > Z._maxWidth) {
				return false;
			}
		}

		if (height) {
			if (height < Z.minHeight || Z._maxHeight > 0 && height > Z._maxHeight) {
				return false;
			}
		}
		return true;
	},

	_changeTrackerSize: function (deltaX, deltaY) {
		var Z = this;
		if (!Z.tracker || !Z.cursor) {
			return;
		}
		var w = Z.el.offsetWidth, h = Z.el.offsetHeight, top = null, left = null;

		if (Z.cursor == 'nw') {
			w = Z._width - deltaX;
			h = Z._height - deltaY;
			top = Z.top + deltaY;
			left = Z.left + deltaX;
		} else if (Z.cursor == 'n') {
			h = Z._height - deltaY;
			top = Z.top + deltaY;
		} else if (Z.cursor == 'ne') {
			h = Z._height - deltaY;
			w = Z._width + deltaX;
			top = Z.top + deltaY;
		} else if (Z.cursor == 'e') {
			w = Z._width + deltaX;
		} else if (Z.cursor == 'se') {
			w = Z._width + deltaX;
			h = Z._height + deltaY;
		} else if (Z.cursor == 's'){
			h = Z._height + deltaY;
		} else if (Z.cursor == 'sw') {
			h = Z._height + deltaY;
			w = Z._width - deltaX;
			left = Z.left + deltaX;
		} else if (Z.cursor == 'w') {
			w = Z._width - deltaX;
			left = Z.left + deltaX;
		}

		if (!Z._checkSize(w, h)) {
			return;
		}
		if (w) {
			Z.tracker.style.width = w + 'px';
		}
		if (h) {
			Z.tracker.style.height = h + 'px';
		}
		if (top) {
			Z.tracker.style.top = top + 'px';
		}
		if (left) {
			Z.tracker.style.left = left + 'px';
		}
	},

	_doWinMouseMove: function (event) {
		if (jslet.temp_dragging) {
			return;
		}
		event = jQuery.event.fix( event || window.event );
		
		var srcEl = event.target, jqSrcEl = jQuery(srcEl);
		
		if (!jqSrcEl.hasClass('jl-window')) {
			return;
		}
		if (!srcEl.jslet._resizable || srcEl.jslet.state) {
			srcEl.jslet.cursor = null;
			srcEl.style.cursor = 'default';
			return;
		}

		var pos = jqSrcEl.offset(),
			x = event.pageX - pos.left,
			y = event.pageY - pos.top,
			w = jqSrcEl.width(),
			h = jqSrcEl.height();
		var delta = 8, wdelta = w - delta, hdelta = h - delta, cursor = null;
		if (x <= delta && y <= delta) {
			cursor = 'nw';
		} else if (x > delta && x < wdelta && y <= delta) {
			cursor = 'n';
		} else if (x >= wdelta && y <= delta) {
			cursor = 'ne';
		} else if (x >= wdelta && y > delta && y <= hdelta) {
			cursor = 'e';
		} else if (x >= wdelta && y >= hdelta) {
			cursor = 'se';
		} else if (x > delta && x < wdelta && y >= hdelta) {
			cursor = 's';
		} else if (x <= delta && y >= hdelta) {
			cursor = 'sw';
		} else if (x <= delta && y > delta && y < hdelta) {
			cursor = 'w';
		}
		
		srcEl.jslet.cursor = cursor;
		srcEl.style.cursor = cursor ? cursor + '-resize' : 'default';
	},

	_doWinMouseDown: function (event) {
		var ojslet = this.jslet;
		ojslet.activate();
		if (ojslet.cursor) {
			jslet.ui.dnd.bindControl(this);
		}
	},

	_createTrackerMask: function (holder) {
		var Z = this;
		if (Z.trackerMask) {
			return;
		}
		var jqBody = jQuery(document.body);

		Z.trackerMask = document.createElement('div');
		jQuery(Z.trackerMask).addClass('jl-win-tracker-mask');
		Z.trackerMask.style.top = '0px';
		Z.trackerMask.style.left = '0px';
		Z.trackerMask.style.zIndex = 99998;
		Z.trackerMask.style.width = jqBody.width() + 'px';
		Z.trackerMask.style.height = jqBody.height() + 'px';
		Z.trackerMask.style.display = 'block';
		Z.trackerMask.onmousedown = function () {
			if (holder && holder._doDragCancel) {
				holder._doDragCancel();
			}
		};
		jqBody[0].appendChild(Z.trackerMask);
	},

	_removeTrackerMask: function () {
		var Z = this;
		if (Z.trackerMask) {
			Z.trackerMask.onmousedown = null;
			document.body.removeChild(Z.trackerMask);
		}
		Z.trackerMask = null;
	},

	_createTracker: function () {
		var Z = this;
		if (Z.tracker) {
			return;
		}
		Z.tracker = document.createElement('div');
		jQuery(Z.tracker).addClass('jl-win-tracker');
		Z.tracker.style.top = Z.top + 'px';
		Z.tracker.style.left = Z.left + 'px';
		Z.tracker.style.zIndex = 99999;
		Z.tracker.style.width = Z._width + 'px';
		Z.tracker.style.height = Z._height + 'px';
		Z.tracker.style.display = 'block';
		Z.el.parentNode.appendChild(Z.tracker);
	},

	_removeTracker: function () {
		var Z = this;
		if (Z.tracker) {
			Z.el.parentNode.removeChild(Z.tracker);
		}
		Z.tracker = null;
	},

	_createShadow: function () {
		var Z = this;
		if (Z.shadow) {
			return;
		}
		Z.shadow = document.createElement('div');
		jQuery(Z.shadow).addClass('jl-win-shadow');
		Z.shadow.style.zIndex = Z.el.style.zIndex - 1;
		Z.shadow.style.width = Z._width + 3 + 'px';
		Z.shadow.style.height = Z._height + 3 + 'px';

		Z.el.parentNode.appendChild(Z.shadow);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this,
			jqEl = jQuery(Z.el);
		jqEl.find('.jl-win-max').off();
		jqEl.find('.jl-win-min').off();
		jqEl.find('.jl-win-close').off();

		var jqHeader = jqEl.find('.jl-win-header'),
			header = jqHeader[0];
		jqHeader.off();
		jqEl.find('.jl-win-body').off();
		if (Z.trackerMask) {
			Z.trackerMask.onmousedown = null;
		}
		Z.trackerMask = null;
		Z.shadow = null;
		Z.el._doDragCancel = null;
		Z.el._doDragEnd = null;
		Z.el._doDragging = null;
		Z.el._doDragStart = null;
		header._doDragCancel = null;
		header._doDragEnd = null;
		header._doDragging = null;
		header._doDragStart = null;
		
		if ($super) {
			$super();
		}
	}
});
jslet.ui.register('Window', jslet.ui.Window);
jslet.ui.Window.htmlTemplate = '<div></div>';


/**
* @class MessageBox
*/
jslet.ui.MessageBox = function () {

	//hasInput-0:none,1-single line input, 2:multiline input
	/**
	 * Show message box
	 * 
	 * @param {String} message Message text
	 * @param {String} caption Caption text
	 * @param {String} iconClass Caption icon class
	 * @param {String[]} buttons Array of button names, like : ['ok','cancel']
	 * @param {Fucntion} callbackFn Callback function when user click one button, 
	 *	Pattern: 
	 *	function({String}button, {String} value){}
	 *	//button: String, button name;
	 *	//value: String, the alue inputed by user;
	 * @param {Integer} hasInput There is input or not, value options: 0 - none, 1 - single line input, 2 - multiline input
	 * @param {String} defaultValue The default value of Input element, if hasInput = 0, this argument is be igored.
	 * @param {Fucntion} validateFn Validate function of input element, if hasInput = 0, this argument is be igored.
	 *   Pattern: 
	 *   function(value){}
	 *   //value: String, the value which need to be validated.
	 * 
	 */
	this.show = function (message, caption, iconClass, buttons, callbackFn, hasInput, defaultValue, validateFn) {
		jslet.ui.textMeasurer.setElement(document.body);
		var mw = jslet.ui.textMeasurer.getWidth(message);
		var mh = jslet.ui.textMeasurer.getHeight(message) + 100;
		jslet.ui.textMeasurer.setElement();
		if (mw < 200) {
			mw = 200;
		}

		var btnWidth = parseInt(jslet.ui.getCssValue('jl-msg-button', 'width'));
		var btnCount = buttons.length;
		var toolWidth = (btnWidth + 10) * btnCount - 10;
		if (mw < toolWidth) {
			mw = toolWidth;
		}
		mw += 100;
		if (hasInput == 1)  {
			mh += 25;
		} else if (hasInput == 2) {
				mh += 100;
		}
		var opt = { type: 'window', caption: caption, isCenter: true, resizable: false, minimizable: false, maximizable: false, stopEventBubling: true, height: mh, width: mw };
		var owin = jslet.ui.createControl(opt);
		var iconHtml = '';
		if (iconClass) {
			iconHtml = '<div class="jl-msg-icon ';
			if (iconClass == 'info' || iconClass == 'error' || iconClass == 'question' || iconClass == 'warning') {
				iconHtml += 'jl-msg-icon-' + iconClass;
			} else {
				iconHtml += iconClass;
			}
			iconHtml += '"></div>';
		}

		var btnHtml = [], btnName, left, k = 0, i;
		if (jslet.locale.isRtl){
			for (i = btnCount - 1; i >=0; i--) {
				btnName = buttons[i];
				left = (k++) * (btnWidth + 10);
				btnHtml.push('<button class="jl-msg-button" ');
				btnHtml.push(' data-jsletname="');
				btnHtml.push(btnName);
				btnHtml.push('" style="left: ');
				btnHtml.push(left);
				btnHtml.push('px">');
				btnHtml.push(jslet.locale.MessageBox[btnName]);
				btnHtml.push('</button>');
			}
		} else {
			for (i = 0; i < btnCount; i++) {
				btnName = buttons[i];
				left = i * (btnWidth + 10);
				btnHtml.push('<button class="jl-msg-button" ');
				btnHtml.push('" data-jsletname="');
				btnHtml.push(btnName);
				btnHtml.push('" style="left: ');
				btnHtml.push(left);
				btnHtml.push('px">');
				btnHtml.push(jslet.locale.MessageBox[btnName]);
				btnHtml.push('</button>');
			}
		}
		var inputHtml = ['<br />'];
		if (hasInput) {
			if (hasInput == 1) {
				inputHtml.push('<input type="text"');
			} else {
				inputHtml.push('<textarea rows="5"');
			}
			inputHtml.push(' style="width:');
			inputHtml.push('98%"');
			if (defaultValue !== null && defaultValue !== undefined) {
				inputHtml.push(' value="');
				inputHtml.push(defaultValue);
				inputHtml.push('"');
			}
			if (hasInput == 1) {
				inputHtml.push(' />');
			} else {
				inputHtml.push('></textarea>');
			}
		}
		var html = ['<div class="jl-msg-container">', iconHtml, '<div class="jl-msg-message">',
					message, inputHtml.join(''), '</div>', '</div>',
					'<div class="jl-msg-tool"><div style="position:relative;width:', toolWidth, 'px;margin:0px auto;">', btnHtml.join(''), '</div></div>'
		];

		owin.setContent(html.join(''));
		var jqEl = jQuery(owin.el);
		var toolBar = jqEl.find('.jl-msg-tool')[0].firstChild;
		var inputCtrl = null;
		if (hasInput == 1) {
			inputCtrl = jqEl.find('.jl-msg-container input')[0];
		} else {
			inputCtrl = jqEl.find('.jl-msg-container textarea')[0];
		}
		var obtn;
		for (i = 0; i < btnCount; i++) {
			obtn = toolBar.childNodes[i];
			obtn.onclick = function () {
				btnName = jQuery(this).attr('data-jsletname');
				var value = null;
				if (hasInput && btnName == 'ok') {
					value = inputCtrl.value;
					if (validateFn && !validateFn(value)) {
						inputCtrl.focus();
						return;
					}
				}
				owin.close();
				if (callbackFn) {
					callbackFn(btnName, value);
				}
			};
		}

		owin.onClosed(function () {
			if (callbackFn) {
				callbackFn(btnName);
			}
		});
		
		owin.showModal();
		owin.setZIndex(99981);
		k = 0;
		if (jslet.locale.isRtl) {
			k = btnCount - 1;
		}
		toolBar.childNodes[k].focus();
	};
};

/**
 * Show alert message. Example:
 * <pre><code>
 * jslet.ui.MessageBox.alert('Finished!', 'Tips');
 * </code></pre>
 */
jslet.ui.MessageBox.alert = function (message, caption, callbackFn) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jslet.locale.MessageBox.info;
	}
	omsgBox.show(message, caption, 'info', ['ok'], callbackFn);
};

/**
 * Show error message. Example:
 * <pre><code>
 * jslet.ui.MessageBox.alert('You have made a mistake!', 'Error');
 * </code></pre>
 */
jslet.ui.MessageBox.error = function (message, caption, callbackFn) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jslet.locale.MessageBox.error;
	}
	omsgBox.show(message, caption, 'error', ['ok'], callbackFn);
};

/**
 * Show warning message. Example:
 * <pre><code>
 * jslet.ui.MessageBox.warn('Program will be shut down!', 'Warning');
 * </code></pre>
 */
jslet.ui.MessageBox.warn = function (message, caption, callbackFn) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jslet.locale.MessageBox.warn;
	}
	omsgBox.show(message, caption, 'warning', ['ok'], callbackFn);
};

/**
 * Show confirm message. Example:
 * <pre><code>
 * var callbackFn = function(button, value){
 * alert('Button: ' + button + ' clicked!');
 * }
 * jslet.ui.MessageBox.warn('Are you sure?', 'Confirm', callbackFn);//show Ok/Cancel
 * jslet.ui.MessageBox.warn('Are you sure?', 'Confirm', callbackFn, true);//show Yes/No/Cancel
 * </code></pre>
 */
jslet.ui.MessageBox.confirm = function(message, caption, callbackFn, isYesNo){
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jslet.locale.MessageBox.confirm;
	}
	if (!isYesNo) {
		omsgBox.show(message, caption, 'question',['ok', 'cancel'], callbackFn);	
	} else {
		omsgBox.show(message, caption, 'question', ['yes', 'no', 'cancel'], callbackFn);
	}
};

/**
 * Prompt user to input some value. Example:
 * <pre><code>
 * var callbackFn = function(button, value){
 * alert('Button: ' + button + ' clicked!');
 * }
 * var validateFn = function(value){
 *  if (!value){
 *    alert('Please input some thing!');
 * return false;
 *  }
 *  return true;
 * }
 * jslet.ui.MessageBox.prompt('Input your name: ', 'Prompt', callbackFn, 'Bob', validateFn);
 * jslet.ui.MessageBox.warn('Input your comments: ', 'Prompt', callbackFn, null, validateFn, true);
 * </code></pre>
 */
jslet.ui.MessageBox.prompt = function (message, caption, callbackFn, defaultValue, validateFn, isMultiLine) {
	var omsgBox = new jslet.ui.MessageBox();
	if (!caption) {
		caption = jslet.locale.MessageBox.prompt;
	}
	if (!isMultiLine) {
		omsgBox.show(message, caption, null, ['ok', 'cancel'], callbackFn, 1, defaultValue, validateFn);
	} else {
		omsgBox.show(message, caption, null, ['ok', 'cancel'], callbackFn, 2, defaultValue, validateFn);
	}
};
/* ========================================================================
 * Jslet framework: jslet.listviewmodel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * Inner Class for DBTable and DBTreeView control
 */
jslet.ui.ListViewModel = function (dataset, isTree) {// boolean, identify if it's tree model
	var visibleCount = 0;
	var visibleStartRow = 0;
	var visibleEndRow = 0;
	var needShowRows = null;//Array of all rows that need show, all of these rows's status will be 'expanded'
	var allRows = null;//Array of all rows, include 'expanded' and 'collapsed' rows
	var currentRowno = 0;
	this.onTopRownoChanged = null; //Event handler: function(rowno){}
	this.onVisibleCountChanged = null; //Event handler: function(visibleRowCount){}
	this.onCurrentRownoChanged = null; //Event handler: function(rowno){}
	this.onNeedShowRowsCountChanged = null; //Event handler: function(needShowCount){}
	this.onCheckStateChanged = null;  //Event handler: function(){}
		
	this.fixedRows = 0;
	var initial = function () {
		if (!isTree) {
			return false;
		}
		var ds = dataset;
		if (!ds._parentField || !ds._keyField) {
			return false;
		}
		return true;
	};
	initial();
		
	this.refreshModel = function (expandLevel) {
		if (!isTree) {
			return;
		}
		if(expandLevel === undefined) {
			expandLevel = -1;
		}
		var ds = dataset, hiddenCnt = 0, recno, allCnt = ds.recordCount(), childCnt, result = [], pId;
		var context = ds.startSilenceMove();
		try {
			ds.recno(this.fixedRows);
			var level = 0, pnodes = [], node, pnode, tmpNode, currRec, state;
			while (!ds.isEof()) {
				recno = ds.recno();
				keyValue = ds.keyValue();
				level = 0;
				pnode = null;
				pId = ds.parentValue();
				for(var m = pnodes.length - 1; m>=0; m--) {
					tmpNode = pnodes[m];
					if (tmpNode.keyvalue == pId) {
						level = tmpNode.level + 1;
						pnode = tmpNode;
						break;
					}
				}
				if (pnode){
					for(var k = pnodes.length - 1; k > m; k--) {
						pnodes.pop();
					}
				}
				currRec = ds.getRecord();
				state = ds.selected();
				if (!state) {
					state = 0;
				}
				var expanded = true;
				if(expandLevel >= 0 && level <= expandLevel) {
					expanded = true;
				} else { 
					expanded = currRec._expanded_;
				}
				node = { parent: pnode, recno: recno, keyvalue: keyValue, expanded: expanded, state: state, isbold: 0, level: level };
				pnodes.push(node);
								
				if (pnode){
					if (!pnode.children) {
						pnode.children = [];
					}
					pnode.children.push(node);
					this._updateParentNodeBoldByChecked(node);
				} else {
					result.push(node);
				}
				
				ds.next();
			} //end while
			allRows = result;
			this._setLastFlag(result);
			this._refreshNeedShowRows();
		} finally {
			ds.endSilenceMove(context);
		}
	};
		
	this._updateParentNodeBoldByChecked = function(node){
		if (!node.state || !node.parent) {
			return;
		}
		var pnode = node.parent;
		while(true){
			if (pnode.isbold) {
				return;
			}
			pnode.isbold = 1;
			pnode = pnode.parent;
			if (!pnode) {
				return;
			}
		}
	};

	this._updateParentNodeBoldByNotChecked = function(node){
		if (node.state || !node.parent) {
			return;
		}
		var pnode = node.parent, cnode;
		while(true){
			if (pnode.children){
				for(var i = 0, cnt = pnode.children.length; i < cnt; i++){
					cnode = pnode.children[i];
					if (cnode.state) {
						return;
					}
				}
				pnode.isbold = 0;
			}
			pnode = pnode.parent;
			if (!pnode) {
				return;
			}
		}
	};
		
	this._setLastFlag = function (nodes) {
		if (!nodes || nodes.length === 0) {
			return;
		}
		var node;
		nodes[nodes.length - 1].islast = true;
		for (var i = 0, cnt = nodes.length; i < cnt; i++) {
			node = nodes[i];
			if (node.children && node.children.length > 0) {
				this._setLastFlag(node.children);
			}
		}
		return null;
	};
	
	this._refreshNeedShowRows = function (notFireChangedEvent) {
		if (!isTree) {
			return;
		}
		var result = [], node;
		if (!allRows) {
			this.refreshModel();
			return;
		}
		var preCnt = needShowRows ? needShowRows.length: 0;
		needShowRows = [];
		this._findVisibleNode(allRows);
		var currCnt = needShowRows.length;
		if (!notFireChangedEvent && this.onNeedShowRowsCountChanged){
			this.onNeedShowRowsCountChanged(currCnt);
		}
	};
	
	this.hasChildren = function (recno) {
		if (!isTree) {
			return false;
		}
		if (!recno) {
			recno = dataset.recno();
		}
		var node = this._innerFindNode(allRows, recno);
		if (node === null) {
			return;
		}
		return node.children && node.children.length > 0;
	};
	
	this.getLevel = function (recno) {
		if (!isTree) {
			return false;
		}
		if (!recno) {
			recno = dataset.recno();
		}
		var node = this._innerFindNode(allRows, recno);
		if (node === null) {
			return;
		}
		return node.level;
	};
	
	this._findVisibleNode = function (nodes) {
		if (!nodes) {
			return;
		}
		var node;
		for (var i = 0, cnt = nodes.length; i < cnt; i++) {
			node = nodes[i];
			needShowRows.push(node);
			if (node.expanded){
				this._findVisibleNode(node.children);
			}
		}
	};
	
	this.rownoToRecno = function (rowno) {
		if (!isTree) {
			return rowno + this.fixedRows;
		}
		if (rowno < 0) {
			rowno = rowno + this.fixedRows;
			return rowno >= 0 ? rowno : -1;
		}
		if (rowno >= needShowRows.length) {
			return -1;
		}
		return needShowRows[rowno].recno;
	};
	
	this.recnoToRowno = function (recno) {
		if (!isTree) {
			return recno - this.fixedRows;
		}
		for(var i = 0, cnt = needShowRows.length; i < cnt; i++){
			if (needShowRows[i].recno == recno) {
				return i;
			}
		}
		return -1;
	};
	
	this.setVisibleStartRow = function (rowno, notFireEvt) {
		if (rowno >= 0) {
			var maxVisibleNo = this.getNeedShowRowCount() - visibleCount;
			if (rowno > maxVisibleNo) {
				rowno = maxVisibleNo;
			}
		}
		if (rowno < 0) {
			rowno = 0;
		}
		if (visibleStartRow == rowno) {
			return;
		}
		visibleStartRow = rowno;
		visibleEndRow = rowno + visibleCount - 1;
		if (!notFireEvt && this.onTopRownoChanged) {
			this.onTopRownoChanged(rowno);
		}
	};
	
	this.getVisibleStartRow = function () {
		return visibleStartRow;
	};
	
	this.setVisibleEndRow = function(endRow){
		visibleEndRow = endRow;
	};
	
	this.getVisibleEndRow = function(){
		return visibleEndRow;
	};
	
	this.setVisibleCount = function (count, notFireEvt) {
		if (visibleCount == count) {
			return;
		}
		visibleCount = count;
		visibleEndRow = visibleStartRow + count - 1;
		if (!notFireEvt && this.onVisibleCountChanged) {
			this.onVisibleCountChanged(count);
		}
	};
	
	this.getVisibleCount = function () {
		return visibleCount;
	};
	
	this.getNeedShowRowCount = function () {
		if (!isTree) {
			return dataset.recordCount()- this.fixedRows;
		}
		return needShowRows.length;
	};
	
	this.getCurrentRow = function(){
		return needShowRows[currentRowno];
	};
		
	this.setCurrentRowno = function (rowno, notFireEvt, checkVisible) {
	//	if (currentRowno == rowno)
	//		return needShowRows ? needShowRows[rowno]: null;
		if(rowno === undefined) {
			return null;
		}
		var preRowno = currentRowno, recno = 0, currRow=null;
		if (rowno < 0){//In the fixed row area
			var lowestRowno = -1 * this.fixedRows;
			if (rowno < lowestRowno) {
				rowno = lowestRowno;
			}
			recno = this.fixedRows + rowno;
		} else {
			var maxRow = this.getNeedShowRowCount();
			if(maxRow === 0) {
				return null;
			}
			if (rowno >= maxRow) {
				rowno = maxRow - 1;
			}
			if (!isTree) {
				recno = rowno + this.fixedRows;
			} else {
				currRow = needShowRows[rowno];
				recno = currRow.recno;
			}
			if (checkVisible) {
				if (rowno >= 0 && rowno < visibleStartRow){
					this.setVisibleStartRow(rowno);
				} else {
					if (rowno >= visibleStartRow + visibleCount) {
						this.setVisibleStartRow(rowno - visibleCount + 1);
					}
				}
			}
		}
		if (recno >= 0){
			dataset.recno(recno);
			if (dataset.aborted()) {
				return null;
			}
		}
		currentRowno = rowno;
		if (!notFireEvt && this.onCurrentRownoChanged) {
			this.onCurrentRownoChanged(preRowno, currentRowno);
		}
		return currRow;
	};
	
	this.getCurrentRowno = function () {
		return currentRowno;
	};
	
	this.nextRow = function () {
		this.setCurrentRowno(currentRowno + 1, false, true);
	};
	
	this.priorRow = function (num) {
		this.setCurrentRowno(currentRowno - 1, false, true);
	};
	
	this.nextPage = function () {
		this.setVisibleStartRow(visibleStartRow + visibleCount);
		this.setCurrentRowno(visibleStartRow);
	};
	
	this.priorPage = function () {
		this.setVisibleStartRow(visibleStartRow - visibleCount);
		this.setCurrentRowno(visibleStartRow);
	};
	
	this._innerFindNode = function (nodes, recno) {
		var node, nextNode;
		for (var i = 0, cnt = nodes.length - 1; i <= cnt; i++) {
			node = nodes[i];
			if (node.recno == recno) {
				return node;
			}
			if (node.children) {
				var result = this._innerFindNode(node.children, recno);
				if (result) {
					return result;
				}
			}
		}
		return null;
	};
	
	this.expand = function (callbackFn) {
		if (!isTree) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno());
		if (node === null) {
			return;
		}
		var context = dataset.startSilenceMove();
		try {
			node.expanded = node.children ? true : false;
			dataset.recno(node.recno);
			dataset.getRecord()._expanded_ = node.expanded;
			var p = node;
			while (true) {
				p = p.parent;
				if (!p) {
					break;
				}
				if (!p.expanded) {
					dataset.recno(p.recno);
					dataset.getRecord()._expanded_ = true;
					p.expanded = true;
				}
			}
		} finally {
			dataset.endSilenceMove(context);
		}
		this._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this.collapse = function (callbackFn) {
		if (!isTree) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno());
		if (node === null) {
			return;
		}
		var context = dataset.startSilenceMove();
		try {
			dataset.recno(node.recno);
			dataset.getRecord()._expanded_ = false;
			node.expanded = false;
		} finally {
			dataset.endSilenceMove(context);
		}
		
		this._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this._iterateNode = function (nodes, callbackFn) {
		var node;
		for (var i = 0, cnt = nodes.length; i < cnt; i++) {
			node = nodes[i];
			if (node.children) {
				if (callbackFn) {
					callbackFn(node);
				}
				if (node.children && node.children.length > 0) {
					this._iterateNode(node.children, callbackFn);
				}
			}
		}
		return null;
	};
	
	this._callbackFn = function (node, state) {
		var context = dataset.startSilenceMove();
		try {
			dataset.recno(node.recno);
			dataset.getRecord()._expanded_ = state;
			node.expanded = state;
		} finally {
			dataset.endSilenceMove(context);
		}
	};
	
	this.expandAll = function (callbackFn) {
		if (!isTree) {
			return;
		}
		
		var Z = this;
		Z._iterateNode(allRows, function (node) {
			Z._callbackFn(node, true); 
		});
		Z._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this.collapseAll = function (callbackFn) {
		if (!isTree) {
			return;
		}
		var Z = this;
		Z._iterateNode(allRows, function (node) {
			Z._callbackFn(node, false); 
		});
		Z._refreshNeedShowRows();
		if (callbackFn) {
			callbackFn();
		}
	};
	
	this.syncDataset = function(){
		var recno = dataset.recno();
		if(recno < 0) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno()),
			pnode = node.parent;
		if (pnode && !pnode.expanded){
			while(true){
				if (!pnode.expanded) {
					pnode.expanded = true;
				} else {
						break;
				}
				pnode = pnode.parent;
				if (!pnode) {
					break;
				}
			}
		}
		this._refreshNeedShowRows();
		var rowno = this.recnoToRowno(recno);
		this.setCurrentRowno(rowno, false, true);
	};
	
	this.checkNode = function(state, relativeCheck){
		var node = this.getCurrentRow();
//		if (node.state == state) {
//			return;
//		}
		node.state = state ? 1 : 0;
		dataset.selected(node.state);

		if (relativeCheck){
			if (node.children && node.children.length > 0) {
				this._updateChildState(node, state);
			}
			if (node.parent) {
				this._updateParentState(node, state);
			}
		}

		if (state) {
			this._updateParentNodeBoldByChecked(node);
		} else {
			this._updateParentNodeBoldByNotChecked(node);
		}
		
		if (this.onCheckStateChanged) {
			this.onCheckStateChanged();
		}
	};
	
	this._updateChildState = function(node, state){
		var b = dataset.startSilenceMove(),
			childNode;
		try{
			for(var i = 0, cnt = node.children.length; i < cnt; i++){
				childNode = node.children[i];
				childNode.state = state;
				dataset.recno(childNode.recno);
				dataset.selected(state);
				if (childNode.children && childNode.children.length > 0) {
					this._updateChildState(childNode, state);
				}
			}
		} finally {
			dataset.endSilenceMove(b);
		}
	};
	
	this._updateParentState = function(node, state){
		var pNode = node.parent;
		if (!pNode) {
			return;
		}
		var childNode, newState;
		if (state != 2){
			for(var i = 0, cnt = pNode.children.length; i < cnt; i++){
				childNode = pNode.children[i];
				if (childNode.state == 2){
					newState = 2;
					break;
				}
				if (i === 0){
					newState = childNode.state;
				} else if (newState != childNode.state){
						newState =2;
						break;
				}
				
			}//end for
		} else {
			newState = state;
		}
		if (pNode.state != newState){
			pNode.state = newState;
			var b = dataset.startSilenceMove();
			try{
				dataset.recno(pNode.recno);
				dataset.selected(newState);
			}finally{
				dataset.endSilenceMove(b);
			}
		}
		this._updateParentState(pNode, newState);
	};
	
	this.destroy = function(){
		dataset = null;
		allRows = null;
	
		this.onTopRownoChanged = null;
		this.onVisibleCountChanged = null;
		this.onCurrentRownoChanged = null;
		this.onNeedShowRowsCountChanged = null;
		this.onCheckStateChanged = null;
	};
};
﻿/* ========================================================================
 * Jslet framework: jslet.dbchart.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBChart, show data as a chart. There are five chart type: column, bar, line, area, pie  
 * Example:
 * <pre><code>
 *		var jsletParam = {type:"dbchart", dataset:"summary", chartType:"column",categoryField:"month",valueFields:"amount"};
 * 
 * //1. Declaring:
 *		&lt;div id="chartId" data-jslet='type:"dbchart",chartType:"column",categoryField:"month",valueFields:"amount,netProfit", dataset:"summary"' />
 *		or
 *		&lt;div data-jslet='jsletParam' />
 *
 *  //2. Binding
 *		&lt;div id="ctrlId"  />
 *		//Js snippet
 *		var el = document.getElementById('ctrlId');
 *		jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *		jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBChart = jslet.Class.create(jslet.ui.DBControl, {
	chartTypes: ['line', 'bar', 'stackbar', 'pie'],
	legendPositions: ['none', 'top', 'bottom', 'left', 'right'],
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,chartType,chartTitle,categoryField,valueFields,legendPos';
		Z.requiredProperties = 'valueFields,categoryField';
		
		/**
		 * {String} Chart type. Optional value is: column, bar, line, area, pie
		 */
		Z._chartType = "line";
		/**
		 * {String} Category field, use comma(,) to separate multiple fields.
		 */
		Z._categoryFields = null;
		/**
		 * {Number} Value field, only one field allowed.
		 */
		Z._valueFields = null;
		/**
		 * {String} Chart title
		 */
		Z._chartTitle = null;

		/**
		 * {String} Legend position, optional value: none, top, bottom, left, right
		 */
		Z._legendPos = 'top';
		
		Z._fieldValidated = false;
		
		$super(el, params);
	},

	chartType: function(chartType) {
		if(chartType === undefined) {
			return this._chartType;
		}
		chartType = jQuery.trim(chartType);
		var checker = jslet.Checker.test('DBChart.chartType', chartType).isString().required();
		checker.testValue(chartType.toLowerCase()).inArray(this.chartTypes);
		this._chartType = chartType;
	},
	
	categoryField: function(categoryField) {
		if(categoryField === undefined) {
			return this._categoryField;
		}
		jslet.Checker.test('DBChart.categoryField', categoryField).isString().required();
		categoryField = jQuery.trim(categoryField);
		this._categoryField = categoryField;
		this._fieldValidated = false;
	},
	
	valueFields: function(valueFields) {
		if(valueFields === undefined) {
			return this._valueFields;
		}
		jslet.Checker.test('DBChart.valueFields', valueFields).isString().required();
		valueFields = jQuery.trim(valueFields);
		this._valueFields = valueFields.split(',');
		this._fieldValidated = false;
	},
	
	chartTitle: function(chartTitle) {
		if(chartTitle === undefined) {
			return this._chartTitle;
		}
		jslet.Checker.test('DBChart.chartTitle', chartTitle).isString();
		this._chartTitle = chartTitle;
	},
	
	legendPos: function(legendPos) {
		if(legendPos === undefined) {
			return this._legendPos;
		}
		legendPos = jQuery.trim(legendPos);
		var checker = jslet.Checker.test('DBChart.legendPos', legendPos).isString().required();
		checker.testValue(legendPos.toLowerCase()).inArray(this.legendPositions);
		this._legendPos = legendPos;
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
		if(!this.el.id) {
			this.el.id = jslet.nextId();
		}
		this.renderAll();
	}, // end bind

	_validateFields: function() {
		var Z = this;
		if(Z._fieldValidated) {
			return;
		}
		var dsObj = Z._dataset,
			fldName = Z._categoryField;
		if (!dsObj.getField(fldName)) {
			throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
		}
		
		for(var i = 0, len = Z._valueFields.length; i < len; i++) {
			fldName = Z._valueFields[i];
			if(!dsObj.getField(fldName)) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
		}
		Z._fieldValidated = true;
	},
	
	_getLineData: function() {
		var Z = this,
			dsObj = Z._dataset;
		if (dsObj.recordCount() === 0) {
			return {xLabels: [], yValues: []};
		}
		var context = dsObj.startSilenceMove();
		var oldRecno = dsObj.recno(),
			xLabels = [],
			yValues = [];
			
		try {
			dsObj.first();
			var isInit = false, valueFldName,
				valueFldCnt = Z._valueFields.length,
				valueArr,
				legendLabels = [];
			while(!dsObj.isEof()) {
				xLabels.push(dsObj.getFieldText(Z._categoryField));
				for(var i = 0; i < valueFldCnt; i++) {
					valueFldName = Z._valueFields[i];
					if(!isInit) {
						valueArr = [];
						yValues.push(valueArr);
						legendLabels.push(dsObj.getField(valueFldName).label());
					} else {
						valueArr = yValues[i];
					}
					valueArr.push(dsObj.getFieldValue(valueFldName));
				}
				isInit = true;
				dsObj.next();
			}
		} finally {
			dsObj.recno(oldRecno);
			dsObj.endSilenceMove(context);
		}
		return {xLabels: xLabels, yValues: yValues, legendLabels: legendLabels};
	},

	_getPieData: function() {
		var Z = this,
			dsObj = Z._dataset;
		if (dsObj.recordCount() === 0) {
			return [];
		}
		var context = dsObj.startSilenceMove();
		var oldRecno = dsObj.recno(),
			result = [];
			
		try {
			dsObj.first();
			var valueFldName = Z._valueFields[0],
				label, value;
			while(!dsObj.isEof()) {
				label = dsObj.getFieldText(Z._categoryField);
				value = dsObj.getFieldValue(valueFldName);
				result.push([label, value]);
				dsObj.next();
			}
		} finally {
			dsObj.recno(oldRecno);
			dsObj.endSilenceMove(context);
		}
		return result;
	},

	_drawLineChart: function() {
		var Z = this;
		var chartData = Z._getLineData();
		
		jQuery.jqplot(Z.el.id, chartData.yValues, 
		{ 
			title: Z._chartTitle, 
            animate: !jQuery.jqplot.use_excanvas,
			// Set default options on all series, turn on smoothing.
			seriesDefaults: {
				rendererOptions: {smooth: true},
				pointLabels: {show: true, formatString: '%d'}				
			},
			
			legend:{ show:true,
				labels: chartData.legendLabels
			},
			
            axes: {
				xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					ticks: chartData.xLabels
				}
			}
		});
	},
		
	_drawPieChart: function() {
		var Z = this;
		var chartData = Z._getPieData();
		
		jQuery.jqplot(Z.el.id, [chartData], {
			title: Z._chartTitle, 
            animate: !jQuery.jqplot.use_excanvas,
			seriesDefaults:{
				renderer: $.jqplot.PieRenderer ,
				pointLabels: {show: true, formatString: '%d'}				
			},
			legend:{ show:true }
		});
	},
	
	_drawBarChart: function(isStack) {
		var Z = this;
		var chartData = Z._getLineData();

        jQuery.jqplot(Z.el.id, chartData.yValues, {
			title: Z._chartTitle,
			stackSeries: isStack,
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !jQuery.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
				pointLabels: {show: true, formatString: '%d'}				
            },

			legend:{ show:true,
				labels: chartData.legendLabels
			},
			
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: chartData.xLabels
                }
            },
            highlighter: { show: false }
        });	
	},
	
	drawChart: function () {
		var Z = this,
			dsObj = Z._dataset;
			
		Z.el.innerHTML = '';
		Z._validateFields();
		if(Z._chartType == 'pie') {
			Z._drawPieChart();
			return;
		}
		if(Z._chartType == 'line') {
			Z._drawLineChart();
			return;
		}
		if(Z._chartType == 'bar') {
			Z._drawBarChart(false);
			return;
		}
		if(Z._chartType == 'stackbar') {
			Z._drawBarChart(true);
			return;
		}
		
		
	}, // end draw chart

	refreshControl: function (evt) {
		var evtType = evt.eventType;
		if (evtType == jslet.data.RefreshEvent.UPDATEALL || 
			evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN || 
			evtType == jslet.data.RefreshEvent.INSERT || 
			evtType == jslet.data.RefreshEvent.DELETE) {
			this.drawChart()
		}
	},
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		this.swf = null;
		$super();
	}
});

jslet.ui.register('DBChart', jslet.ui.DBChart);
jslet.ui.DBChart.htmlTemplate = '<div></div>';
﻿/* ========================================================================
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
			var fldName, found, editFld, maxFld, 
				layoutcnt = Z._fields ? Z._fields.length : 0;
			for (var i = 0, fcnt = allFlds.length; i < fcnt; i++) {
				fldObj = allFlds[i];
				fldName = fldObj.name();
				found = false;
				for (var j = 0; j < layoutcnt; j++) {
					editFld = Z._fields[j];
					if (fldName == editFld.field) {
						found = true;
						fldLayouts.push(editFld);
					}
				}
				
				if (!found && fldObj.visible()) {
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
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-editpanel')) {
			jqEl.addClass('jl-editpanel form-horizontal');
		}
		jqEl.html('');
		var allFlds = Z._dataset.getNormalFields(),
			fcnt = allFlds.length;
		var layouts = Z._calcLayout();
		//calc max label width
			
		var r = -1, oLabel, editorCfg, fldName, fldObj, ohr, octrlDiv, opanel, ctrlId;
		for (var i = 0, cnt = layouts.length; i < cnt; i++) {
			layout = layouts[i];
			if (layout.showLine) {
				ohr = document.createElement('hr');
				Z.el.appendChild(ohr);
			}
			if (layout.row != r) {
				opanel = document.createElement('div');
				opanel.className = 'form-group';
				Z.el.appendChild(opanel);
				r = layout.row;

			}
			fldName = layout.field;
			fldObj = Z._dataset.getField(fldName);
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
				
				oLabel = document.createElement('label');
				octrlDiv.appendChild(oLabel);
				new jslet.ui.DBLabel(oLabel, {
					type: 'DBLabel',
					dataset: Z._dataset,
					field: fldName
				});
				
				ctrlId = jslet.nextId();
				editor.el.id = ctrlId;
				jQuery(oLabel).attr('for', ctrlId);
			} else {
				oLabel = document.createElement('label');
				opanel.appendChild(oLabel);
				oLabel.className = 'col-sm-' + layout._innerLabelCols;
				new jslet.ui.DBLabel(oLabel, {
					type: 'DBLabel',
					dataset: Z._dataset,
					field: fldName
				});
				
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
			}
		}
	}, // render All
	
	/**
	 * @override
	 */
	refreshControl: function (evt) {
	}
});

jslet.ui.register('DBEditPanel', jslet.ui.DBEditPanel);
jslet.ui.DBEditPanel.htmlTemplate = '<div></div>';
﻿/* ========================================================================
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
		Z.allProperties = 'dataset,columnCount,rowHeight';
		
		/**
		 * {Integer} Column count
		 */
		Z._columnCount = 1;
		/**
		 * {Integer} Row height
		 */
		Z._rowHeight = 30;
		
		$super(el, params);
	},
	
	columnCount: function(columnCount) {
		if(columnCount === undefined) {
			return this._columnCount;
		}
		jslet.Checker.test('DBEditPanel.columnCount', columnCount).isGTZero();
		this._columnCount = parseInt(columnCount);
	},
	
	rowHeight: function(rowHeight) {
		if(rowHeight === undefined) {
			return this._rowHeight;
		}
		jslet.Checker.test('DBEditPanel.rowHeight', rowHeight).isGTZero();
		this._rowHeight = parseInt(rowHeight);
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
		if (!jqEl.hasClass('jl-inspector'))
			jqEl.addClass('jl-inspector jl-round5');
		var totalWidth = jqEl.width(),
			allFlds = Z._dataset.getFields();
		jqEl.html('<table cellpadding=0 cellspacing=0 style="margin:0;padding:0;table-layout:fixed;width:100%;height:100%"><tbody></tbody></table>');
		var oCol, fldObj, i,
			fcnt = allFlds.length,
			visibleFlds = [];
		for (i = 0; i < fcnt; i++) {
			fldObj = allFlds[i];
			if (fldObj.visible()) {
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
		
		var oldRowNo = -1, oldC = -1, rowNo, odiv, oLabel, fldName, editor, fldCtrl;
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
			new jslet.ui.DBLabel(oLabel, {
				type: 'DBLabel',
				dataset: Z._dataset,
				field: fldName
			});
			
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
		} // end for
	},
	
	/**
	 * @override
	 */
	refreshControl: function (evt) {
		//if (!evt) {
		//evt = jslet.data.RefreshEvent.CHANGEMETA;
		//}
		//if (evt.eventType == jslet.data.RefreshEvent.CHANGEMETA) {
		//this.renderAll();
		//}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		$super();
	}
});

jslet.ui.htmlclass.DBINSPECTOR = {
	labelColCls: 'jl-inspector-label',
	editorColCls: 'jl-inspector-editor'
};

jslet.ui.register('DBInspector', jslet.ui.DBInspector);
jslet.ui.DBInspector.htmlTemplate = '<div></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dbtable.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

jslet.ui.htmlclass.TABLECLASS = {
	currentrow: 'jl-tbl-current',
	celldiv: 'jl-tbl-cell',
	scrollBarWidth: 17,
	selectColWidth: 30,
	hoverrow: 'jl-tbl-row-hover',
	
	sortAscChar: '&#8593;',
	sortDescChar: '&#8595;'
};

/**
 * Table column
 */
jslet.ui.TableColumn = function () {
	var Z = this;
	Z.field = null;   //String, field name
	Z.colNum = null;  //Integer, column number
	Z.label = null;   //String, column header label
	Z.title = null;   //String, column header title
	Z.width = null;   //Integer, column display width
	Z.colSpan = null; //Integer, column span
	Z.disableHeadSort = false; //Boolean, true - user sort this column by click column header
	Z.mergeSame = false; //Boolean, true - if this column value of adjoined rows is same then merge these rows 
	Z.noRefresh = false; //Boolean, true - do not refresh for customized column
	Z.visible = true; //Boolean, identify specified column is visible or not 
	Z.cellRender = null; //Function, column cell render for customized column  
};

/**
 * Sub group, use this class to implement complex requirement in one table row, like master-detail style row
 */
jslet.ui.TableSubgroup = function(){
var Z = this;
	Z.hasExpander = true; //Boolean, true - will add a new column automatically, click this column will expand or collapse subgroup panel
	Z.template = null;//String, html template 
	Z.height = 0; //Integer, subgroup panel height
};

/**
 * Table column header, use this class to implement hierarchical header
 */
jslet.ui.TableHead = function(){
	var Z = this;
	Z.label = null; //String, Head label
	Z.title = null; //String, Head title
	Z.id = null;//String, Head id
	Z.rowSpan = 0;  //@private
	Z.colSpan = 0;  //@private
	
	Z.subHeads = null; //array of jslet.ui.TableHead
};

jslet.ui.AbstractDBTable = jslet.Class.create(jslet.ui.DBControl, {
		/**
		 * @override
		 */
	initialize: function ($super, el, params) {
		var Z = this;
		
		Z.allProperties = 'dataset,fixedRows,fixedCols,hasSeqCol,hasSelectCol,noborder,readOnly,hideHead,disableHeadSort,onlySpecifiedCol,selectBy,rowHeight,onRowClick,onRowDblClick,onSelect,onSelectAll,onCustomSort,onFillRow,onFillCell,treeField,columns,subgroup,totalFields';
		
		/**
		 * {Integer} Fixed row count.
		 */
		Z._fixedRows = 0;
		/**
		 * {Integer} Fixed column count.
		 */
		Z._fixedCols = 0;
		/**
		 * {Boolean} Identify if there is sequence column in DBTable.
		 */
		Z._hasSeqCol = true;
		/**
		 * {Boolean} Identify if there is select column in DBTable.
		 */
		Z._hasSelectCol = false;
		
		/**
		 * {Boolean} Identify if table cell has border
		 */
		Z._noborder = false;
		
		/**
		 * {Boolean} Identify if DBTable is readonly.
		 */
		Z._readOnly = true;
		/**
		 * {Boolean} Identify if there is table header in DBTable.
		 */
		Z._hideHead = false;
		/**
		 * {Boolean} Identify if DBTable disable user to click header to sort.
		 */
		Z._disableHeadSort = false;
		/**
		 * {String} one or more fields' name concatenated with ','
		 * @see jslet.data.Dataset.select(selected, selectBy).
		 */
		Z._selectBy = null;
		/**
		 * {Integer} Row height.
		 */
		Z._rowHeight = 35;
		/**
		 * {Integer} Row height of table header.
		 */
		Z._headRowHeight = 35;
		/**
		 * {String} Display table as tree style, only one field name allowed. If this property is set, the dataset must be a tree style dataset, 
		 *  means dataset.parentField() and dataset.levelField() can not be empty.
		 * Only one field allowed.
		 */
		Z._treeField = null;
		/**
		 * {jslet.ui.TableColumn[]} Array of jslet.ui.TableColumn
		 */
		Z._columns = null;
		
		/**
		 * {String} One or more number fields concatenated with ',', 
		 * If this property is set, the "total" section will be shown at the bottom of DBTable.
		 */
		Z._totalFields = null;
		
		/**
		 * {Event} Fired when user clicks table row.
		 *  Pattern: 
		 *function(event}{}
		 *  //event: Js mouse event
		 */
		Z._onRowClick = null;
		/**
		 * {Event} Fired when user double clicks table row.
		 * Pattern: 
		 *function(event}{}
		 *  //event: Js mouse event
		 */
		Z._onRowDblClick = null;
		/**
		 * {Event} Fired when user click table header to sort data. You can use it to sort data instead of default, like sending request to server to sort data.  
		 * Pattern: 
		 *   function(indexFlds}{}
		 *   //indexFlds: String, format: fieldName desc/asce(default), fieldName,..., desc - descending order, asce - ascending order, like: "field1 desc,field2,field3"
		 */
		Z._onCustomSort = null; 
		
		/**
		 * {Event} Fired when user selects one row.
		 * Pattern: 
		 *   function(selected}{}
		 *   //selected: Boolean
		 *   //return: true - allow user to select this row, false - otherwise.
		 */
		Z._onSelect = null;
		/**
		 * {Event} Fired when user click select all by clicking "Select Column" header.
		 * Pattern: 
		 *   function(dataset, Selected}{}
		 *   //dataset: jslet.data.Dataset
		 *   //Selected: Boolean
		 *   //return: true - allow user to select, false - otherwise.
		 */
		Z._onSelectAll = null;
		
		/**
		 * {Event} Fired when fill row, user can use this to customize each row style like background color, font color
		 * Pattern:
		 *   function(otr, dataset){)
		 *   //otr: Html element: TR
		 *   //dataset: jslet.data.Dataset
		 */
		Z._onFillRow = null;
		
		/**
		 * {Event} Fired when fill cell, user can use this to customize each cell style like background color, font color
		 * Pattern:
		 *   function(otd, dataset, fieldName){)
		 *   //otd: Html element: TD
		 *   //dataset: jslet.data.Dataset
		 *   //fieldName: String
		 */
		Z._onFillCell = null;		
		
		//@private
		Z.contentHeight = 0;
		Z.subgroup = null;//jslet.ui.TableSubgroup
		
		Z._sysColumns = null;//all system column like sequence column, select column, sub-group column
		Z._isHoriOverflow = false;
		Z._hoverRowIndex = -1;
		Z._oldHoverRowClassName;
		Z._oldHeight = null;
		$super(el, params);
	},
	
	/**
	 * Get or set Fixed row count.
	 * 
	 * @param {Integer or undefined} rows fixed rows.
	 * @return {Integer or this}
	 */
	fixedRows: function(rows) {
		if(rows === undefined) {
			return this._fixedRows;
		}
			jslet.Checker.test('DBTable.fixedRows', rows).isNumber();
		this._fixedRows = parseInt(rows);
	},
	
	/**
	 * Get or set Fixed column count.
	 * 
	 * @param {Integer or undefined} cols fixed cols.
	 * @return {Integer or this}
	 */
	fixedCols: function(cols) {
		if(cols === undefined) {
			return this._fixedCols;
		}
		jslet.Checker.test('DBTable.fixedCols', cols).isNumber();
		this._fixedCols = parseInt(cols);
	},
	
	rowHeight: function(rowHeight) {
		if(rowHeight === undefined) {
			return this._rowHeight;
		}
		jslet.Checker.test('DBTable.rowHeight', rowHeight).isGTZero();
		this._rowHeight = parseInt(rowHeight);
	},
	
	headRowHeight: function(rowHeight) {
		if(headRowHeight === undefined) {
			return this._headRowHeight;
		}
		jslet.Checker.test('DBTable.headRowHeight', headRowHeight).isGTZero();
		this._headRowHeight = parseInt(headRowHeight);
	},
	
	hasSeqCol: function(hasSeqCol) {
		if(hasSeqCol === undefined) {
			return this._hasSeqCol;
		}
		this._hasSeqCol = hasSeqCol ? true: false;
	},
	
	hasSelectCol: function(hasSelectCol) {
		if(hasSelectCol === undefined) {
			return this._hasSelectCol;
		}
		this._hasSelectCol = hasSelectCol ? true: false;
	},
	
	noborder: function(noborder) {
		if(noborder === undefined) {
			return this._noborder;
		}
		this._noborder = noborder ? true: false;
	},
	
	readOnly: function(readOnly) {
		if(readOnly === undefined) {
			return this._readOnly;
		}
		this._readOnly = readOnly ? true: false;
	},
	
	hideHead: function(hideHead) {
		if(hideHead === undefined) {
			return this._hideHead;
		}
		this._hideHead = hideHead ? true: false;
	},
	
	disableHeadSort: function(disableHeadSort) {
		if(disableHeadSort === undefined) {
			return this._disableHeadSort;
		}
		this._disableHeadSort = disableHeadSort ? true: false;
	},
	
	onlySpecifiedCol: function(onlySpecifiedCol) {
		if(onlySpecifiedCol === undefined) {
			return this._onlySpecifiedCol;
		}
		this._onlySpecifiedCol = onlySpecifiedCol ? true: false;
	},
	
	selectBy: function(selectBy) {
		if(selectBy === undefined) {
			return this._selectBy;
		}
			jslet.Checker.test('DBTable.selectBy', selectBy).isString();
		this._selectBy = selectBy;
	},
	
	treeField: function(treeField) {
		if(treeField === undefined) {
			return this._treeField;
		}
			jslet.Checker.test('DBTable.treeField', treeField).isString();
		this._treeField = treeField;
	},
	
	totalFields: function(totalFields) {
		if(totalFields === undefined) {
			return this._totalFields;
		}
		jslet.Checker.test('DBTable.totalFields', totalFields).isString();
		this._totalFields = totalFields;
	},
	
	onRowClick: function(onRowClick) {
		if(onRowClick === undefined) {
			return this._onRowClick;
		}
		jslet.Checker.test('DBTable.onRowClick', onRowClick).isFunction();
		this._onRowClick = onRowClick;
	},
	
	onRowDblClick: function(onRowDblClick) {
		if(onRowDblClick === undefined) {
			return this._onRowDblClick;
		}
		jslet.Checker.test('DBTable.onRowDblClick', onRowDblClick).isFunction();
		this._onRowDblClick = onRowDblClick;
	},
	
	onSelect: function(onSelect) {
		if(onSelect === undefined) {
			return this._onSelect;
		}
		jslet.Checker.test('DBTable.onSelect', onSelect).isFunction();
		this._onSelect = onSelect;
	},
	
	onSelectAll: function(onSelectAll) {
		if(onSelectAll === undefined) {
			return this._onSelectAll;
		}
		jslet.Checker.test('DBTable.onSelectAll', onSelectAll).isFunction();
		this._onSelectAll = onSelectAll;
	},
	
	onCustomSort: function(onCustomSort) {
		if(onCustomSort === undefined) {
			return this._onCustomSort;
		}
		jslet.Checker.test('DBTable.onCustomSort', onCustomSort).isFunction();
		this._onCustomSort = onCustomSort;
	},
	
	onFillRow: function(onFillRow) {
		if(onFillRow === undefined) {
			return this._onFillRow;
		}
		jslet.Checker.test('DBTable.onFillRow', onFillRow).isFunction();
		this._onFillRow = onFillRow;
	},
	
	onFillCell: function(onFillCell) {
		if(onFillCell === undefined) {
			return this._onFillCell;
		}
		jslet.Checker.test('DBTable.onFillCell', onFillCell).isFunction();
		this._onFillCell = onFillCell;
	},
	
	columns: function(columns) {
		if(columns === undefined) {
			return this._columns;
		}
		jslet.Checker.test('DBTable.columns', columns).isArray();
			var colObj;
			for(var i = 0, len = columns.length; i < len; i++) {
				colObj = columns[i];
				jslet.Checker.test('DBTable.Column.field', colObj.field).isString();
				jslet.Checker.test('DBTable.Column.label', colObj.label).isString();
				jslet.Checker.test('DBTable.Column.colNum', colObj.colNum).isGTZero();
				jslet.Checker.test('DBTable.Column.width', colObj.width).isGTZero();
				jslet.Checker.test('DBTable.Column.colSpan', colObj.colSpan).isGTZero();
				colObj.disableHeadSort = colObj.disableHeadSort ? true: false;
				colObj.mergeSame = colObj.mergeSame ? true: false;
				colObj.noRefresh = colObj.noRefresh ? true: false;
				jslet.Checker.test('DBTable.Column.cellRender', colObj.cellRender).isObject();
			}
		this._columns = columns;
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
		jslet.resizeEventBus.subscribe(Z);
		
		jslet.ui.textMeasurer.setElement(Z.el);
		Z.charHeight = jslet.ui.textMeasurer.getHeight('M')+4;
		jslet.ui.textMeasurer.setElement();
		Z.charWidth = 12;
				
		Z._initializeVm();
		Z.renderAll();
		Z._updateSortFlag(true);
		var jqEl = jQuery(Z.el);
		var ti = jqEl.attr('tabindex');
		if (!ti) {
			jqEl.attr('tabindex', 0);
		}
		
		jqEl.on('keydown', function (event) {
			var keyCode = event.which;
			if (keyCode == 38) {//KEY_UP
				Z.listvm.priorRow();
				event.preventDefault();
			} else if (keyCode == 40) {//KEY_DOWN
				Z.listvm.nextRow();
				event.preventDefault();
			} else if (keyCode == 33) {//KEY_PAGEUP
				Z.listvm.priorPage();
				event.preventDefault();
			} else if (keyCode == 34) {//KEY_PAGEDOWN
				Z.listvm.nextPage();
				event.preventDefault();
			}
		});		
	}, // end bind
	
	_initializeVm: function () {
		var Z = this;
						
		Z.listvm = new jslet.ui.ListViewModel(Z._dataset, Z._treeField ? true : false);
		
		Z.listvm.onTopRownoChanged = function (rowno) {
			if (rowno < 0) {
				return;
			}
			var context = Z._dataset.startSilenceMove();
			try {
				Z._fillData();
			} finally {
				Z._dataset.endSilenceMove(context);
			}
			
			Z._syncScrollBar(rowno);
			Z._showCurrentRow();
		};
	
		Z.listvm.onVisibleCountChanged = function () {
			Z.renderAll();
		};
		
		Z.listvm.onCurrentRownoChanged = function (preRowno, rowno) {
			if (Z._dataset.recordCount() === 0) {
				return;
			}
			Z._oldHoverRowClassName = '';
			if (Z.prevRow) {
				if (Z.prevRow.fixed) {
					jQuery(Z.prevRow.fixed).removeClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
				}
				jQuery(Z.prevRow.content).removeClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
			}
			var currRow = Z._getTrByRowno(rowno), otr;
			if (!currRow) {
				return;
			}
			otr = currRow.fixed;
			var recno = Z._dataset.recno();
			if (otr) {
				jQuery(otr).addClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
				if(Z._hoverRowIndex == otr.rowIndex) {
					Z._oldHoverRowClassName = jslet.ui.htmlclass.TABLECLASS.currentrow;
				}
			}
			
			otr = currRow.content;
			jQuery(otr).addClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
			if(Z._hoverRowIndex == otr.rowIndex) {
				Z._oldHoverRowClassName = jslet.ui.htmlclass.TABLECLASS.currentrow;
			}
			Z.prevRow = currRow;
		};
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		Z.listvm.fixedRows = Z._fixedRows;
		Z._calcParams();
		Z.listvm.refreshModel();
		Z._createFrame();
		Z._fillData();
		Z._showCurrentRow();
		Z._oldHeight = jQuery(Z.el).height();
	}, // end renderAll

	_prepareColumn: function(){
		var Z = this, cobj;
		Z._sysColumns = [];
		//prepare system columns
		if (Z._hasSeqCol){
			cobj = {label:'&nbsp;',width: Z.seqColWidth, disableHeadSort:true,isSeq:true, cellRender:jslet.ui.DBTable.sequenceCellRender};
			Z._sysColumns.push(cobj);
		}
		if (Z._hasSelectCol){
			cobj = {label:'<input type="checkbox" />', width: Z.selectColWidth, disableHeadSort:true,isSelect:true, cellRender:jslet.ui.DBTable.selectCellRender};
			Z._sysColumns.push(cobj);
		}
		
		if (Z.subgroup && Z.subgroup.hasExpander){
			cobj = {label:'&nbsp;', width: Z.selectColWidth, disableHeadSort:true, isSubgroup: true, cellRender:jslet.ui.DBTable.subgroupCellRender};
			Z._sysColumns.push(cobj);
		}
		//prepare data columns
		var tmpColumns = [];
		if (!Z._onlySpecifiedCol) {
			var fldObj, fldName,fields = Z._dataset.getFields();
			for (var i = 0, fldcnt = fields.length; i < fldcnt; i++) {
				fldObj = fields[i];
				fldName = fldObj.name();
				if (fldObj.visible()) { 
					cobj = new jslet.ui.TableColumn();
					cobj.field = fldObj.name();
					tmpColumns.push(cobj);
				} // end if visible
			} // end for
			if (Z._columns){
				for(var i = 0, colCnt = Z._columns.length; i < colCnt; i++){
					cobj = Z._columns[i];
					if (!cobj.field){
						tmpColumns.push(cobj);
						continue;
					}
					fldObj = Z._dataset.getTopField(cobj.field);
					if (!fldObj) {
						throw new Error("Field: " + cobj.field + " doesn't exist!");
					}
					if (fldObj.getType() == jslet.data.DataType.GROUP){
						fldName = fldObj.name();
						var isUnique = true;
						// cobj.field is not a child of a groupfield, we need check if the topmost parent field is duplicate or not 
						if (cobj.field != fldName){
							for(var k = 0; k < tmpColumns.length; k++){
								if (tmpColumns[k].field == fldName){
									isUnique = false;
									break;
								}
							} // end for k
						}
						if (isUnique){
							cobj = new jslet.ui.TableColumn();
							cobj.field = fldName;
							tmpColumns.push(cobj);
						}
					}
				} //end for i
			} //end if Z.columns
		} else{
			for(var i = 0, colCnt = Z._columns.length; i < colCnt; i++){
				tmpColumns.push(Z._columns[i]);
			}
		}
		Z.innerHeads = [];
		Z.innerColumns = [];
		var ohead, fldName, label, context = {lastColNum: 0, depth: 0};
		
		for(var i = 0, colCnt = tmpColumns.length; i < colCnt; i++){
			colObj = tmpColumns[i];
			fldName = colObj.field;
			if (!fldName){
				ohead = new jslet.ui.TableHead();
				label = colObj.label;
				ohead.label = label? label: "";
				ohead.level = 0;
				ohead.colNum = context.lastColNum++;
				colObj.colNum = ohead.colNum;
				ohead.id = jslet.nextId();
				Z.innerHeads.push(ohead);
				Z.innerColumns.push(colObj);
				continue;
			}
			fldObj = Z._dataset.getField(fldName);
			Z._convertField2Head(context, fldObj);
		}

		Z.maxHeadRows = context.depth + 1;
		Z._calcHeadSpan();
	
		//check fixedCols property
		var colCnt = 0, preColCnt = 0, 
		fixedColNum = Z._fixedCols - Z._sysColumns.length;
		for(var i = 1, len = Z.innerHeads.length; i < len; i++){
			ohead = Z.innerHeads[i];
			colCnt += ohead.colSpan;
			if (fixedColNum <= preColCnt || fixedColNum == colCnt) {
				break;
			}
			if (fixedColNum < colCnt && fixedColNum > preColCnt) {
				Z._fixedCols = preColCnt + Z._sysColumns.length;
			}
			
			preColCnt = colCnt;
		}
	},
	
	_calcHeadSpan: function(heads){
		var Z = this;
		if (!heads) {
			heads = Z.innerHeads;
		}
		var ohead, childCnt = 0;
		for(var i = 0, len = heads.length; i < len; i++ ){
			ohead = heads[i];
			ohead.rowSpan = Z.maxHeadRows - level;
			if (ohead.subHeads){
				ohead.colSpan = Z._calcHeadSpan(ohead.subHeads);
				childCnt += ohead.colSpan;
			} else {
				ohead.colSpan = 1;
				childCnt++;
			}
		}
		return childCnt;
	},
	
	_convertField2Head: function(context, fldObj, parentHeadObj){
		var Z = this;
		if (!fldObj.visible()) {
			return false;
		}
		if (!parentHeadObj){
			level = 0;
			heads = Z.innerHeads;
		} else {
			level = parentHeadObj.level + 1;
			heads = parentHeadObj.subHeads;
		}
		var ohead, fldName = fldObj.name();
		ohead = new jslet.ui.TableHead();
		ohead.label = fldObj.label();
		ohead.field = fldName;
		ohead.level = level;
		ohead.colNum = context.lastColNum;
		ohead.id = jslet.nextId();
		heads.push(ohead);
		context.depth = Math.max(level, context.depth);
		if (fldObj.getType() == jslet.data.DataType.GROUP){
			ohead.subHeads = [];
			var fldChildren = fldObj.children(), added = false;
			for(var i = 0, cnt = fldChildren.length; i< cnt; i++){
				Z._convertField2Head(context, fldChildren[i], ohead);
			}
		} else {
			context.lastColNum ++;
			var cobj, found = false;
			var len = Z._columns ? Z._columns.length: 0;
			for(var i = 0; i < len; i++){
				cobj = Z._columns[i];
				if (cobj.field == fldName){
					found = true;
					break;
				}
			}
			if (!found){
				cobj = new jslet.ui.TableColumn();
				cobj.field = fldName;
			}
			if (!cobj.label){
				cobj.label = fldObj.label();
			}
			cobj.mergeSame = fldObj.mergeSame();
			cobj.aggrateType = fldObj.aggrateType();
			cobj.aggrateBy = fldObj.aggrateBy();
			cobj.colNum = ohead.colNum;
			if (!cobj.width){
				maxWidth = fldObj ? fldObj.displayWidth() : 0;
				if (cobj.label) {
					maxWidth = Math.max(maxWidth, cobj.label.length);
				}
				cobj.width = maxWidth ? (maxWidth * Z.charWidth) : 10;
			}
			//check and set cell render
			if (!cobj.cellRender) {
				if (fldObj.getType() == jslet.data.DataType.BOOLEAN){//data type is boolean
					if (!Z._isCellEditable(cobj)) {// Not in edit mode
						cobj.cellRender = jslet.ui.DBTable.boolCellRender;
					}
				} else {
					if (cobj.field == Z._treeField) {
						cobj.cellRender = jslet.ui.DBTable.treeCellRender;
					}
				}
			}
			Z.innerColumns.push(cobj);
		}
		return true;
	},
	
	_calcParams: function () {
		var Z = this;
		if (Z._treeField) {//if tree table, then can't sort by clicking column header
			Z._disableHeadSort = true;
		}
		// calculate Sequence column width
		if (Z._hasSeqCol) {
			Z.seqColWidth = ('' + Z._dataset.recordCount()).length * Z.charWidth + 5;
			var sWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
			Z.seqColWidth = Z.seqColWidth > sWidth ? Z.seqColWidth: sWidth;
		} else {
			Z.seqColWidth = 0;
		}
		// calculate Select column width
		if (Z._hasSelectCol) {
			Z.selectColWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
		} else {
			Z.selectColWidth = 0;
		}
		//calculate Fixed row section's height
		if (Z._fixedRows > 0) {
			Z.fixedSectionHt = Z._fixedRows * Z._rowHeight;
		} else {
			Z.fixedSectionHt = 0;
		}
		//Calculate Foot section's height
		Z.innerTotalFields = null;
		if (Z._totalFields){
			Z.footSectionHt = Z._rowHeight;
			Z.innerTotalFields = Z._totalFields.split(',');
		} else {
			Z.footSectionHt = 0;
		}
		Z._prepareColumn();

		// fixed Column count must be less than total columns
		if (Z._fixedCols) {
			if (Z._fixedCols > Z.innerColumns.length) {
				Z._fixedCols = Z.innerColumns.length;
			}
		}
		Z.hasFixedCol = Z._sysColumns.length > 0 || Z._fixedCols > 0;
		if (Z.hasFixedCol){
			var w = 0;
			for(var i = 0, cnt = Z._sysColumns.length; i < cnt; i++){
				w += Z._sysColumns[i].width;
			}
			for(var i = 0; i < Z._fixedCols; i++){
				w += Z.innerColumns[i].width;
			}
			Z.fixedColWidth = w+3;
		} else {
			Z.fixedColWidth = 0;
		}
	}, // end _calcParams

	_setScrollBarMaxValue: function (maxValue) {
		var Z = this,
			v = maxValue + Z._repairHeight;
		Z.jqVScrollBar.find('div').height(v);
	},

	_changeColWidth: function (index, deltaW) {
		var Z = this;
		var ocol = Z.innerColumns[index];
		if (ocol.width + deltaW <= 0) {
			return;
		}
		ocol.width += deltaW;
		var w = ocol.width + 'px',
			k = ocol.colNum - Z._fixedCols,
			oheadRow = jQuery(Z.rightHeadTbl).find('.jl-tbl-row4width')[0];
		oheadRow.cells[k].style.width = w;

		if (Z.rightFixedTbl){
			oheadRow = jQuery(Z.rightFixedTbl).find('.jl-tbl-row4width')[0];
			oheadRow.cells[k].style.width = w;
		}
		oheadRow = jQuery(Z.rightContentTbl).find('.jl-tbl-row4width')[0];
		oheadRow.cells[k].style.width = w;

		if (Z.footSectionHt) {
			oheadRow = jQuery(Z.rightFootTbl).find('.jl-tbl-row4width')[0];
			oheadRow.cells[k].style.width = w;
		}
		Z._changeContentWidth(deltaW);
	},

	_changeContentWidth: function (deltaW) {
		var Z = this,
			totalWidth = Z.getTotalWidth(),
			totalWidthStr = totalWidth + 'px';
		Z.setRightHeadWidth(totalWidth);
		if (Z.footSectionHt) {
			Z.rightFootTbl.style.width = totalWidthStr;
		}
		Z.rightFixedTbl.parentNode.style.width = totalWidthStr;
		Z.rightContentTbl.parentNode.style.width = totalWidthStr;
		Z._checkHoriOverflow();
	},

	_createFrame: function () {
		var Z = this;
		Z.el.style.position = 'relative';
		var jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-table')) {
			jqEl.addClass('jl-table jl-border-box jl-round5');
		}
		if(Z._noborder){
			jqEl.addClass('jl-tbl-noborder');
		}

		var dbtableframe = [
			'<div class="jl-tbl-splitter" style="display: none"></div>',
			'<div class="jl-tbl-norecord">',
			jslet.locale.DBTable.norecord,
			'</div>',
			'<table class="jl-tbl-container" style="width:100%"><tr>',
			'<td class="jl-tbl-fixedcol-td"><div class="jl-tbl-fixedcol"><table class="jl-tbl-data"><tbody /></table><table class="jl-tbl-data"><tbody /></table><div class="jl-tbl-content-div"><table class="jl-tbl-data"><tbody /></table></div><table><tbody /></table></div></td>',
			'<td><div class="jl-tbl-contentcol"><div><table class="jl-tbl-data jl-tbl-content-table" border="0" cellpadding="0" cellspacing="0"><tbody /></table></div><div><table class="jl-tbl-data jl-tbl-content-table"><tbody /></table></div><div class="jl-tbl-content-div"><table class="jl-tbl-data jl-tbl-content-table"><tbody /></table></div><table class="jl-tbl-content-table jl-tbl-fixedcol-td"><tbody /></table></div></td>',
			'<td class="jl-scrollbar-width"><div class="jl-tbl-vscroll-head"></div><div class="jl-tbl-vscroll"><div /></div></td></tr></table>'];

		
		jqEl.html(dbtableframe.join(''));

		var children = jqEl.find('.jl-tbl-fixedcol')[0].childNodes;
		Z.leftHeadTbl = children[0];
		Z.leftFixedTbl = children[1];
		Z.leftContentTbl = children[2].firstChild;
		Z.leftFootTbl = children[3];
		
		children = jqEl.find('.jl-tbl-contentcol')[0].childNodes;
		Z.rightHeadTbl = children[0].firstChild;
		Z.rightFixedTbl = children[1].firstChild;
		Z.rightContentTbl = children[2].firstChild;
		Z.rightFootTbl = children[3];

		Z.height = jqEl.height();
		if (Z._hideHead){
			Z.leftHeadTbl.style.display = 'none';
			Z.rightHeadTbl.style.display = 'none';
			jqEl.find('.jl-tbl-vscroll-head').css('display', 'none');
		}
		if (Z._fixedRows <= 0){
			Z.leftFixedTbl.style.display = 'none';
			Z.rightFixedTbl.style.display = 'none';
		}
		if (!Z._totalFields){
			Z.leftFootTbl.style.display = 'none';
			Z.rightFootTbl.style.display = 'none';
		}
		Z.leftHeadTbl.parentNode.parentNode.style.width = Z.fixedColWidth + 'px';
		
		var jqRightHead = jQuery(Z.rightHeadTbl);
		jqRightHead.off();
		var x = jqRightHead.on('mousedown', Z._doSplitHookDown);
		var y = jqRightHead.on('mouseup', Z._doSplitHookUp);
		
		jQuery(Z.leftHeadTbl).on('mousedown', '.jl-tbl-header-cell', function(event){
			event = jQuery.event.fix(event || window.event);
			var el = event.target;
			if (el.className == 'jl-tbl-splitter-hook') {
				return;
			}
			if (Z._head_label_cliecked){
				Z._head_label_cliecked = false;
				return;
			}
			Z._doHeadClick(this.jsletcolcfg, event.ctrlKey);
		});
		
		jqRightHead.on('mousedown', '.jl-tbl-header-cell', function(event){
			event = jQuery.event.fix(event || window.event);
			var el = event.target;
			if (el.className == 'jl-tbl-splitter-hook') {
				return;
			}
			if (Z._head_label_cliecked){
				Z._head_label_cliecked = false;
				return;
			}
			Z._doHeadClick(this.jsletcolcfg, event.ctrlKey);
		});

		jQuery(Z.leftHeadTbl).on('mousedown', '.jl-focusable-item', function(event){
			event = jQuery.event.fix(event || window.event);
			Z._doHeadClick(this.parentNode.parentNode.parentNode.jsletcolcfg, event.ctrlKey);
			Z._head_label_cliecked = true;
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		
		jqRightHead.on('mousedown', '.jl-focusable-item', function(event){
			event = jQuery.event.fix(event || window.event);
			Z._doHeadClick(this.parentNode.parentNode.parentNode.jsletcolcfg, event.ctrlKey);
			Z._head_label_cliecked = true;
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;
		});
		
		var jqLeftFixedTbl = jQuery(Z.leftFixedTbl),
			jqRightFixedTbl = jQuery(Z.rightFixedTbl),
			jqLeftContentTbl = jQuery(Z.leftContentTbl),
			jqRightContentTbl = jQuery(Z.rightContentTbl);
		
		jqLeftFixedTbl.off();
		jqLeftFixedTbl.on('mouseenter', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
				
			Z._oldHoverRowClassName = this.className;
			Z._hoverRowIndex = this.rowIndex;
			this.className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
			jqRightFixedTbl[0].rows[this.rowIndex].className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
		});
		jqLeftFixedTbl.on('mouseleave', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			this.className = Z._oldHoverRowClassName;
			jqRightFixedTbl[0].rows[this.rowIndex].className = Z._oldHoverRowClassName;
		});

		jqRightFixedTbl.off();
		jqRightFixedTbl.on('mouseenter', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			Z._oldHoverRowClassName = this.className;
			Z._hoverRowIndex = this.rowIndex;
			this.className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
			jqLeftFixedTbl[0].rows[this.rowIndex].className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
		});
		jqRightFixedTbl.on('mouseleave', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			this.className = Z._oldHoverRowClassName;
			jqLeftFixedTbl[0].rows[this.rowIndex].className = Z._oldHoverRowClassName;
		});
		
		jqLeftContentTbl.off();
		jqLeftContentTbl.on('mouseenter', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			Z._oldHoverRowClassName = this.className;
			Z._hoverRowIndex = this.rowIndex;
			this.className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
			jqRightContentTbl[0].rows[this.rowIndex].className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
		});
		jqLeftContentTbl.on('mouseleave', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			this.className = Z._oldHoverRowClassName;
			jqRightContentTbl[0].rows[this.rowIndex].className = Z._oldHoverRowClassName;
		});
		
		jqRightContentTbl.off();
		jqRightContentTbl.on('mouseenter', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			Z._oldHoverRowClassName = this.className;
			Z._hoverRowIndex = this.rowIndex;
			this.className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
			var hasLeft = (Z._fixedRows > 0 || Z._sysColumns.length > 0);
			if(hasLeft) {
				jqLeftContentTbl[0].rows[this.rowIndex].className = jslet.ui.htmlclass.TABLECLASS.hoverrow;
			}
		});
		jqRightContentTbl.on('mouseleave', 'tr', function(){
			if(this.className == 'jl-tbl-row4width') {
				return;
			}
			this.className = Z._oldHoverRowClassName;
			var hasLeft = (Z._fixedRows > 0 || Z._sysColumns.length > 0);
			if(hasLeft) {
				jqLeftContentTbl[0].rows[this.rowIndex].className = Z._oldHoverRowClassName;
			}
		});
		
		Z.jqVScrollBar = jqEl.find('.jl-tbl-vscroll');

		Z.noRecordDiv = jqEl.find('.jl-tbl-norecord')[0];
		//The scrollbar width must be set explicitly, otherwise it doesn't work in IE. 
		Z.jqVScrollBar.width(jslet.scrollbarSize()+1);
		
		Z.jqVScrollBar.on('scroll', function () {
			if (Z._keep_silence_) {
				return;
			}
			var num = Math.round(this.scrollTop / Z._rowHeight);// + Z._fixedRows;
			if (num != Z.listvm.getVisibleStartRow()) {
				Z._keep_silence_ = true;
				try {
					Z.listvm.setVisibleStartRow(num);
				} finally {
					Z._keep_silence_ = false;
				}
			}
		});

		var splitter = jqEl.find('.jl-tbl-splitter')[0];
		splitter._doDragStart = function(){
			this.style.display = 'block';
		};
		
		splitter._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
			var bodyMleft = parseInt(jQuery(document.body).css('margin-left'));

			var ojslet = splitter.parentNode.jslet;
			var ocol = ojslet.innerColumns[ojslet.currColId];
			if (ocol.width + deltaX <= 40) {
				return;
			}
			splitter.style.left = x - jQuery(splitter.parentNode).offset().left - bodyMleft + 'px';
		};

		splitter._doDragEnd = function (oldX, oldY, x, y, deltaX,
			deltaY) {
			var Z = splitter.parentNode.jslet;
			Z._changeColWidth(Z.currColId, deltaX);
			splitter.style.display = 'none';
			splitter.parentNode.jslet.isDraggingColumn = false;
		};

		splitter._doDragCancel = function () {
			splitter.style.display = 'none';
			splitter.parentNode.jslet.isDraggingColumn = false;
		};

		Z._setScrollBarMaxValue(Z.listvm.getNeedShowRowCount() * Z._rowHeight);
		Z._createWidthHiddenRow(Z.leftHeadTbl, true);
		Z._createWidthHiddenRow(Z.leftFixedTbl, true);
		Z._createWidthHiddenRow(Z.leftContentTbl, true);
		Z._createWidthHiddenRow(Z.leftFootTbl, true);

		Z._createWidthHiddenRow(Z.rightHeadTbl, false, true);
		Z._createWidthHiddenRow(Z.rightFixedTbl);
		Z._createWidthHiddenRow(Z.rightContentTbl);
		Z._createWidthHiddenRow(Z.rightFootTbl);
		if (Z._totalFields){
			Z.leftFootTbl.style.display = '';
			Z.rightFootTbl.style.display = '';
		}
		Z._renderHeader();
		
		if (Z._hideHead) {
			Z.headSectionHt = 0;
		} else {
			Z.headSectionHt = Z.maxHeadRows * Z._headRowHeight;
		}
		Z._checkHoriOverflow();
		Z._calcAndSetContentHeight();

		Z.noRecordDiv.style.top = Z.headSectionHt + 'px';
		Z.noRecordDiv.style.left = jqEl.find('.jl-tbl-fixedcol').width() + 5 + 'px';
		jqEl.find('.jl-tbl-vscroll-head').height(Z.headSectionHt + Z.fixedSectionHt + 2);
		Z._renderBody();
	},

	_calcAndSetContentHeight: function(){
		var Z = this,
			jqEl = jQuery(Z.el);

		Z.contentSectionHt = Z.height - Z.headSectionHt - Z.fixedSectionHt - Z.footSectionHt;
		if (Z._isHoriOverflow){
			Z.contentSectionHt -= jslet.ui.htmlclass.TABLECLASS.scrollBarWidth;
		}
		
		Z.listvm.setVisibleCount(Math.floor((Z.contentSectionHt) / Z._rowHeight), true);
		Z._repairHeight = Z.contentSectionHt - Z.listvm.getVisibleCount() * Z._rowHeight;
		
		jqEl.find('.jl-tbl-contentcol').height(Z.height);
		jqEl.find('.jl-tbl-content-div').height(Z.contentSectionHt);

		Z.jqVScrollBar.height(Z.contentSectionHt + Z.footSectionHt);
	},
	
	_checkHoriOverflow: function(){
		var Z = this,
			contentWidth = Z.getTotalWidth();

		if(Z._hideHead) {
			Z._isHoriOverflow = contentWidth > jQuery(Z.rightContentTbl.parentNode.parentNode).innerWidth();
		} else {
			Z._isHoriOverflow = contentWidth > Z.rightHeadTbl.parentNode.parentNode.clientWidth;
		}
		Z._calcAndSetContentHeight();
	},
	
	_createWidthHiddenRow: function(oTable, isFixedCol, isHead){
		var Z = this;
		if (isFixedCol && !Z.hasFixedCol) {
			return;
		}
		var oTHead = oTable.createTHead(),
			otr = oTHead.insertRow(-1),
			colCfg, oth, start, end;
		jQuery(otr).addClass('jl-tbl-row4width');
		
		if (isFixedCol && Z._sysColumns.length > 0){
			for (var j = 0, cnt = Z._sysColumns.length; j < cnt; j++) {
				colCfg = Z._sysColumns[j];
				oth = document.createElement('th');
				oth.style.width = colCfg.width + 'px';
				otr.appendChild(oth);
			}
		}
		if (isFixedCol){
			start = 0;
			end = Z._fixedCols;
		} else {
			start = Z._fixedCols;
			end = Z.innerColumns.length;
		}
		
		for (var j = start; j < end; j++) {
			colCfg = Z.innerColumns[j];
			oth = document.createElement('th');
			oth.style.width = colCfg.width + 'px';
			otr.appendChild(oth);
		}
		
		if(!isFixedCol && isHead) {
			oth = document.createElement('th');
			Z.rightHeadTbl.rows[0].appendChild(oth);
		}

	},
	
	_createHeadCell: function (otr, cobj) {
		var Z = this,
			rowSpan = 0, colSpan = 0;
		
		if (!cobj.subHeads) {
			rowSpan = Z.maxHeadRows - (cobj.level ? cobj.level: 0);
		} else {
			colSpan = cobj.colSpan;
		}
		var oth = document.createElement('th');
		oth.className = 'jl-tbl-header-cell jl-unselectable';
		oth.noWrap = true;
		oth.jsletcolcfg = cobj;
		if (rowSpan && rowSpan > 1) {
			oth.rowSpan = rowSpan;
		}
		if (colSpan && colSpan > 1) {
			oth.colSpan = colSpan;
		}
		if (cobj.cellRender && cobj.cellRender.createHeader){
			cobj.cellRender.createHeader.call(Z, oth, cobj);
		} else {
			var sh = cobj.label || '&nbsp;';
			oth.innerHTML = ['<div style="position: relative" unselectable="on" class="jl-unselectable jl-tbl-cell jl-border-box"><span id="',
				cobj.id, 
				'" unselectable="on" style="width:100%;padding:0px 2px">',
				((!Z._disableHeadSort && !cobj.disableHeadSort) ? '<a class="jl-focusable-item" href="javascript:void(0)" >' + sh +'</a>': sh),
				'</span><span unselectable="on" class="jl-tbl-sorter" title="',
				jslet.locale.DBTable.sorttitle,
				'">&nbsp;</span><div  unselectable="on" class="jl-tbl-splitter-hook" colid="',
				cobj.colNum,
				'">&nbsp;</div></div>'].join('');
		}
		otr.appendChild(oth);	
	}, // end _createHeadCell

	_renderHeader: function () {
		var Z = this;
		if (Z._hideHead) {
			return;
		}
		var otr, otrLeft = null, cobj, otrRight, otd, oth,
			leftHeadObj = Z.leftHeadTbl.createTHead(),
			rightHeadObj = Z.rightHeadTbl.createTHead();
		for(var i = 0; i < Z.maxHeadRows; i++){
			leftHeadObj.insertRow(-1);
			rightHeadObj.insertRow(-1);
		}
		otr = leftHeadObj.rows[1];
		for(var i = 0, cnt = Z._sysColumns.length; i < cnt; i++){
			cobj = Z._sysColumns[i];
			cobj.rowSpan = Z.maxHeadRows;
			Z._createHeadCell(otr, cobj);
		}
		function travHead(arrHeadCfg){
			var cobj, otr;
			for(var m = 0, ccnt = arrHeadCfg.length; m < ccnt; m++){
				cobj = arrHeadCfg[m];
				if (cobj.colNum < Z._fixedCols) {
					otr = leftHeadObj.rows[cobj.level + 1];
				} else {
					otr = rightHeadObj.rows[cobj.level + 1];
				}
				Z._createHeadCell(otr, cobj);
				if (cobj.subHeads) {
					travHead(cobj.subHeads);
				}
			}
		}
		travHead(Z.innerHeads);
		var jqTr1, jqTr2, h= Z._headRowHeight;
		for(var i = 1; i <= Z.maxHeadRows; i++){
			jqTr1 = jQuery(leftHeadObj.rows[i]);
			jqTr2 = jQuery(rightHeadObj.rows[i]);
			jqTr1.height(h);
			jqTr2.height(h);
		}
		
		var extraCell = document.createElement('th');
		extraCell.colSpan = Z.maxHeadRows;
		extraCell.className = 'jl-tbl-extra-head jl-unselectable';
		extraCell.innerHTML = '<div style="position: relative" unselectable="on" class="jl-unselectable jl-tbl-cell jl-border-box">&nbsp;</div>';
		Z.rightHeadTbl.rows[1].appendChild(extraCell);
		
		var totalWidth = Z.getTotalWidth();
		Z.setRightHeadWidth(totalWidth);
		jQuery(Z.rightFixedTbl.parentNode).width(totalWidth);
		jQuery(Z.rightContentTbl.parentNode).width(totalWidth);
		jQuery(Z.rightTotalTbl).width(totalWidth);
		Z.sortedCell = null;
		Z.indexField = null;
	}, // end renderHead

	setRightHeadWidth: function(width) {
		var Z = this,
			jqEl = jQuery(Z.el);
		var headColWidth = Z.rightHeadTbl.parentNode.parentNode.clientWidth;
		if(width < headColWidth) {
			jQuery(Z.rightHeadTbl.parentNode).width(headColWidth);
		} else {
			jQuery(Z.rightHeadTbl.parentNode).width(width);
		}
	},
	
	getTotalWidth: function(){
		var Z= this,
		totalWidth = 0;
		for(var i = Z._fixedCols, cnt = Z.innerColumns.length; i < cnt; i++){
			totalWidth += Z.innerColumns[i].width;
		}
		return totalWidth;
	},
	
	_adjustTableBorder: function () {
		var Z = this;
	
		function clearTableBorder(tblObj, noTopBorder, noBottomBorder, noLeftBorder,noRightBorder) {
			var rows = tblObj.rows;
			if(rows.length < 2) {
				return;
			}
			var row, cell, cells, i, cellCnt, rowCnt;
			cells = rows[1].cells;
			cellCnt = cells.length;
			for(i = 0; i < cellCnt; i++) {
				cell = cells[i];
				cell.style.borderTopWidth = 0;
			}
			row = rows[rows.length - 1];
			cells = row.cells;
			cellCnt = cells.length;
			for(i = 0; i < cellCnt; i++) {
				cell = cells[i];
				cell.style.borderBottomWidth = 0;
			}

			rowCnt = rows.length;
			cellCnt--;
			for(i = 1; i < rowCnt; i++) {
				row = rows[i];
				cellCnt = row.cells.length;
				if(cellCnt == 0) {
					continue;
				}
				cell = row.cells[0];
				cell.style.borderLeftWidth = 0;
				cell = row.cells[cellCnt - 1];
				cell.style.borderRightWidth = 0;
			}
			if(noTopBorder) {
				tblObj.style.borderTopWidth = 0;
			}
			if(noBottomBorder) {
				tblObj.style.borderBottomWidth = 0;
			}
			if(noLeftBorder) {
				tblObj.style.borderLeftWidth = 0;
			}
			if(noRightBorder) {
				tblObj.style.borderRightWidth = 0;
			}
		}
		
		clearTableBorder(Z.leftHeadTbl, false, false, true, true);
		clearTableBorder(Z.rightHeadTbl, false, false, false, false);

		clearTableBorder(Z.leftFixedTbl, true, true, true, true);
		clearTableBorder(Z.rightFixedTbl, true, true, false, false);
		
		clearTableBorder(Z.leftContentTbl, false, false, true, true);
		clearTableBorder(Z.rightContentTbl, false, false, false, false);
	},

	_doSplitHookDown: function (event) {
		event = jQuery.event.fix( event || window.event );
		var ohook = event.target;
		if (ohook.className != 'jl-tbl-splitter-hook') {
			return;
		}
		var tblContainer = jslet.ui.findFirstParent(ohook, function (el) {
			return el.tagName.toLowerCase() == 'div' && el.jslet && el.jslet._dataset;
		});
		var jqTblContainer = jQuery(tblContainer);
		
		var jqBody = jQuery(document.body); 
		var bodyMTop = parseInt(jqBody.css('margin-top'));
		var bodyMleft = parseInt(jqBody.css('margin-left'));
		var y = jqTblContainer.position().top - bodyMTop;
		var jqHook = jQuery(ohook);
		var h = jqTblContainer.height() - 20;
		var currLeft = jqHook.offset().left - jqTblContainer.offset().left - bodyMleft;
		var splitDiv = jqTblContainer.find('.jl-tbl-splitter')[0];
		splitDiv.style.left = currLeft + 'px';
		splitDiv.style.top = '1px';
		splitDiv.style.height = h + 'px';
		jslet.ui.dnd.bindControl(splitDiv);
		tblContainer.jslet.currColId = parseInt(jqHook.attr('colid'));
		tblContainer.jslet.isDraggingColumn = true;
	},

	_doSplitHookUp: function (event) {
		event = jQuery.event.fix( event || window.event );
		var ohook = event.target.lastChild;
		if (ohook.className != 'jl-tbl-splitter-hook') {
			return;
		}
		var tblContainer = jslet.ui.findFirstParent(ohook, function (el) {
			return el.tagName.toLowerCase() == 'div' && el.jslet && el.jslet._dataset;
		});

		var jqTblContainer = jQuery(tblContainer),
			jqBody = jQuery(document.body); 
		jqBody.css('cursor','auto');

		var splitDiv = jqTblContainer.find('.jl-tbl-splitter')[0];
		if (splitDiv.style.display != 'none') {
			splitDiv.style.display = 'none';
		}
		tblContainer.jslet.isDraggingColumn = false;
	},

	_getColumnByField: function (fieldName) {
		var Z = this;
		if (!Z.innerColumns) {
			return null;
		}
		var cobj;
		for (var i = 0, cnt = Z.innerColumns.length; i < cnt; i++) {
			cobj = Z.innerColumns[i];
			if (cobj.field == fieldName) {
				return cobj;
			}
		}
		return null;
	},

	_doHeadClick: function (colCfg, ctrlKeyPressed) {
		var Z = this;
		if (Z._disableHeadSort || colCfg.disableHeadSort || Z.isDraggingColumn) {
			return;
		}
		Z._doSort(colCfg.field, ctrlKeyPressed);
	}, // end _doHeadClick

	_doSort: function (sortField, isMultiSort) {
		var Z = this;
		Z._dataset.disableControls();
		try {
			if (!Z._onCustomSort) {
				Z._dataset.toggleIndexField(sortField, !isMultiSort);
			} else {
				Z._onCustomSort.call(Z, indexFlds);
			}
			Z.listvm.refreshModel();
		} finally {
			Z._dataset.enableControls();
		}
	},

	_updateSortFlag: function () {
		var Z = this;
		if (Z._hideHead) {
			return;
		}

		var sortFields = Z._dataset.mergedIndexFields();
		
		var leftHeadObj = Z.leftHeadTbl.createTHead(),
			rightHeadObj = Z.rightHeadTbl.createTHead(),
			leftHeadCells = jQuery(leftHeadObj).find('th'),
			rightHeadCells = jQuery(rightHeadObj).find('th'),
			allHeadCells = [], oth;

		for (var i = 0, cnt = leftHeadCells.length; i < cnt; i++){
			oth = leftHeadCells[i];
			if (oth.jsletcolcfg) {
				allHeadCells[allHeadCells.length] = oth;
			}
		}

		for (var i = 0, cnt = rightHeadCells.length; i < cnt; i++){
			oth = rightHeadCells[i];
			if (oth.jsletcolcfg) {
				allHeadCells[allHeadCells.length] = oth;
			}
		}

		var len = sortFields.length, sortDiv, 
			cellCnt = allHeadCells.length;
		for (var i = 0; i < cellCnt; i++) {
			oth = allHeadCells[i];
			sortDiv = jQuery(oth).find('.jl-tbl-sorter')[0];
			if (sortDiv) {
				sortDiv.innerHTML = '&nbsp;';
			}
		}
		var fldName, sortFlag, sortObj, 
			k = 1;
		for (var i = 0; i < len; i++) {
			sortObj = sortFields[i];
			for (var j = 0; j < cellCnt; j++) {
				oth = allHeadCells[j];
				fldName = oth.jsletcolcfg.field;
				if (!fldName) {
					continue;
				}
				sortDiv = jQuery(oth).find('.jl-tbl-sorter')[0];
				sortFlag = '&nbsp;';
				if (fldName == sortObj.fieldName) {
					sortFlag = sortObj.order === 1 ? jslet.ui.htmlclass.TABLECLASS.sortAscChar : jslet.ui.htmlclass.TABLECLASS.sortDescChar;
					if (len > 1) {
						sortFlag += k++;
					}
					break;
				}
			}
			sortDiv.innerHTML = sortFlag;
			if (!oth) {
				continue;
			}
		}
	},

	_doSelectBoxClick: function (event) {
		var ocheck = null;
		if (event){
			event = jQuery.event.fix( event || window.event );
			ocheck = event.target;
		} else {
			ocheck = this;
		}
		var otr = jslet.ui.getParentElement(ocheck, 2);
		try {
			jQuery(otr).click();// tr click
		} finally {
			var otable = jslet.ui.findFirstParent(otr, function (node) {
				return node.jslet? true: false;
			});
			var oJslet = otable.jslet;

			if (oJslet._onSelect) {
				var flag = oJslet._onSelect.call(oJslet, ocheck.checked);
				if (flag !== undefined && !flag) {
					ocheck.checked = !ocheck.checked;
					return;
				}
			}

			oJslet._dataset.select(ocheck.checked ? 1 : 0, oJslet._selectBy);
		}
	}, // end _doSelectBoxClick

	_doRowDblClick: function (event) {
		var otable = jslet.ui.findFirstParent(this, function (node) {
			return node.jslet? true: false;
		});

		var Z = otable.jslet;
		if (Z._onRowDblClick) {
			Z._onRowDblClick.call(Z, event);
		}
	},

	_doRowClick: function (event) {
		var otable = jslet.ui.findFirstParent(this, function (node) {
			return node.jslet ? true: false;
		});

		var Z = otable.jslet;
		var rowno = Z.listvm.recnoToRowno(this.jsletrecno);
		Z.listvm.setCurrentRowno(rowno);
		if (Z._onRowClick) {
			Z._onRowClick.call(Z, event);
		}
	},

	_renderCell: function (otr, colCfg, isFirstCol) {
		var Z = this;
		var otd = document.createElement('td');
		otd.noWrap = true;
		otd.jsletColCfg = colCfg;
		if (colCfg.cellRender) {
			colCfg.cellRender.createCell.call(Z, otd, colCfg);
		} else if (!Z._isCellEditable(colCfg)) {
				jslet.ui.DBTable.defaultCellRender.createCell.call(Z, otd, colCfg);
		} else {
				jslet.ui.DBTable.editableCellRender.createCell.call(Z, otd, colCfg);
		}
		otr.appendChild(otd);
	},

	_renderRow: function (sectionNum, onlyRefreshContent) {
		var Z = this;
		var rowCnt = 0, leftBody = null, rightBody,
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;
		switch (sectionNum) {
			case 1:
				{//fixed data
					rowCnt = Z._fixedRows;
					if (hasLeft) {
						leftBody = Z.leftFixedTbl.tBodies[0];
					}
					rightBody = Z.rightFixedTbl.tBodies[0];
					break;
				}
			case 2:
				{//data content
					rowCnt = Z.listvm.getVisibleCount();
					if (hasLeft) {
						leftBody = Z.leftContentTbl.tBodies[0];
					}
					rightBody = Z.rightContentTbl.tBodies[0];
					break;
				}
			case 3:
				{ //footer
					if (!Z.footSectionHt) {
						return;
					}
					rowCnt = 1;
					if (hasLeft) {
						leftBody = Z.leftFootTbl.tBodies[0];
					}
					rightBody = Z.rightFootTbl.tBodies[0];
					break;
				}
		}
		var otr, oth, colCfg, isfirstCol, 
			startRow = 0,
			fldCnt = Z.innerColumns.length;
		if (onlyRefreshContent){
			startRow = rightBody.rows.length;
		}
		// create date content table row
		for (var i = startRow; i < rowCnt; i++) {
			if (hasLeft) {
				otr = leftBody.insertRow(-1);
				otr.style.height = Z._rowHeight + 'px';

				if (sectionNum != 3) {//Not total section
					otr.ondblclick = Z._doRowDblClick;
					otr.onclick = Z._doRowClick;
				}
				var sysColLen = Z._sysColumns.length;
				for(var j = 0; j < sysColLen; j++){
					colCfg = Z._sysColumns[j];
					Z._renderCell(otr, colCfg, j === 0);
				}
				
				isfirstCol = sysColLen === 0;
				for (var j = 0; j < Z._fixedCols; j++) {
					colCfg = Z.innerColumns[j];
					Z._renderCell(otr, colCfg, isfirstCol && j === 0);
				}
			}
			isfirstCol = !hasLeft;
			otr = rightBody.insertRow(-1);
			otr.style.height = Z._rowHeight + 'px';
			if (sectionNum != 3) {//Not total section
				otr.ondblclick = Z._doRowDblClick;
				otr.onclick = Z._doRowClick;
			}
			for (var j = Z._fixedCols; j < fldCnt; j++) {
				colCfg = Z.innerColumns[j];
				Z._renderCell(otr, colCfg, j == Z._fixedCols);
			}
		}
	},

	_sumTotal: function () {
		var Z = this, cobj, fldName, 
			len = Z.innerColumns.length;
		for (var i = 0; i < len; i++) {
			cobj = Z.innerColumns[i];
			if (Z.innerTotalFields.indexOf(cobj.field) < 0) {
				continue;
			}
			cobj.totalValue = 0;
		}
		var recCnt = Z._dataset.recordCount(),
			preRecno = Z._dataset.recno();
		try {
			for (var i = 0; i < recCnt; i++) {
				Z._dataset.recnoSilence(i);
				for (var j = 0; j < len; j++) {
					cobj = Z.innerColumns[j];
					fldName = cobj.field;
					if (Z.innerTotalFields.indexOf(fldName) >= 0){
						cobj.totalValue += Z._dataset.getFieldValue(fldName);
					}
				}
			}
		} finally {
			Z._dataset.recnoSilence(preRecno);
		}
	},

	_renderBody: function (onlyRefreshContent) {
		var Z = this;
		if (onlyRefreshContent){
			Z._renderRow(2, true);
		} else {
			Z._renderRow(1);
			Z._renderRow(2);
			Z._renderRow(3);
		}
		Z._adjustTableBorder();
	}, // end _renderBody

	_fillTotalSection: function () {
		var Z = this;
		if (!Z.footSectionHt) {
			return;
		}
		var hasLeft = Z._fixedCols > 0 && Z._sysColumns.length > 0,
			otrLeft, otrRight;
		if (hasLeft) {
			otrLeft = Z.leftFootTbl.tBodies[0].rows[0];
		}
		otrRight = Z.rightFootTbl.tBodies[0].rows[0];
		Z._sumTotal();

		var otd, k = 0, fldObj, cobj;
		for (var i = 0, len = Z.innerColumns.length; i < len; i++) {
			cobj = Z.innerColumns[i];

			if (i < Z._fixedCols) {
				otd = otrLeft.cells[i];
			} else {
				otd = otrRight.cells[i - Z._fixedCols];
			}
			if (Z.innerTotalFields.indexOf(cobj.field) < 0) {
				otd.innerHTML = '&nbsp;';
				continue;
			}
			fldObj = Z._dataset.getField(cobj.field);
			otd.innerHTML =jslet.formatNumber(cobj.totalValue, fldObj.displayFormat());
			otd.style.textAlign = fldObj.alignment();
		}
	},

	_fillData: function () {
		var Z = this;
		var preRecno = Z._dataset.recno(),
			allCnt = Z.listvm.getNeedShowRowCount(),
			h = allCnt * Z._rowHeight;
		Z._setScrollBarMaxValue(h);
		Z.noRecordDiv.style.display = (allCnt === 0 ?'block':'none');
		var context = Z._dataset.startSilenceMove();
		try {
			Z._fillRow(true);
			Z._fillRow(false);
			if (Z.footSectionHt) {
				Z._fillTotalSection();
			}
		} finally {
			Z._dataset.endSilenceMove(context);
		}
	},
	
	_fillRow: function (isFixed) {
		var Z = this,
		rowCnt = 0, start = 0, leftBody = null, rightBody,
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;
			
		if (isFixed) {
			rowCnt = Z._fixedRows;
			start = -1 * Z._fixedRows;
			if (rowCnt === 0) {
				return;
			}
			if (hasLeft) {
				leftBody = Z.leftFixedTbl.tBodies[0];
			}
			rightBody = Z.rightFixedTbl.tBodies[0];
		} else {
			rowCnt = Z.listvm.getVisibleCount();
			start = Z.listvm.getVisibleStartRow();
			if (hasLeft) {
				leftBody = Z.leftContentTbl.tBodies[0];
			}
			rightBody = Z.rightContentTbl.tBodies[0];
		}
		
		var otr, colCfg, isfirstCol, recNo = -1, cells, clen, otd,
		fldCnt = Z.innerColumns.length,
			allCnt = Z.listvm.getNeedShowRowCount() - Z.listvm.getVisibleStartRow(),
			fixedRows = hasLeft ? leftBody.rows : null,
			contentRows = rightBody.rows,
			sameValueNodes = {},
			isFirst = true;

		for (var i = 0; i < rowCnt; i++) {
			if (i >= allCnt) {
				if (hasLeft) {
					otr = fixedRows[i];
					otr.style.display = 'none';
				}
				otr = contentRows[i];
				otr.style.display = 'none';
				continue;
			}

			Z.listvm.setCurrentRowno(i + start, true);
			recNo = Z._dataset.recno();
			if (hasLeft) {
				otr = fixedRows[i];
				otr.jsletrecno = recNo;
				otr.style.display = '';
				cells = otr.childNodes;
				clen = cells.length;
				for (var j = 0; j < clen; j++) {
					otd = cells[j];
					Z._fillCell(recNo, otd, sameValueNodes, isFirst);
				}
			}

			otr = contentRows[i];
			otr.jsletrecno = recNo;
			otr.style.display = '';
			if (Z._onFillRow) {
				Z._onFillRow.call(Z, otr, Z._dataset);
			}
			// fill content table
			otr = contentRows[i];
			cells = otr.childNodes;
			clen = cells.length;
			for (var j = 0; j < clen; j++) {
				otd = cells[j];
				Z._fillCell(recNo, otd, sameValueNodes, isFirst);
			} //end for data content field
			isFirst = 0;
		} //end for records
	},

	_fillCell: function (recNo, otd, sameValueNodes, isFirst) {
		var Z = this,
		colCfg = otd.jsletColCfg;
		if (!colCfg)
			return;
		var fldName = colCfg.field;
		if (Z._onFillCell) {
			Z._onFillCell.call(Z, otd, Z._dataset, fldName);
		}
		if (fldName && colCfg.mergeSame) {
			if (isFirst || !Z._dataset.isSameAsPrevious(fldName)) {
				sameValueNodes[fldName] = { cell: otd, count: 1 };
				jQuery(otd).attr('rowspan', 1);
				otd.style.display = '';
			}
			else {
				var sameNode = sameValueNodes[fldName];
				sameNode.count++;
				otd.style.display = 'none';
				jQuery(sameNode.cell).attr('rowspan', sameNode.count);
			}
		}

		if (colCfg.cellRender && colCfg.cellRender.refreshCell) {
			colCfg.cellRender.refreshCell.call(Z, otd, colCfg, recNo);
		} else if (!Z._isCellEditable(colCfg)) {
			jslet.ui.DBTable.defaultCellRender.refreshCell.call(Z, otd, colCfg, recNo);
		} else {
			jslet.ui.DBTable.editableCellRender.refreshCell.call(Z, otd, colCfg, recNo);
		}
	},

	refreshCurrentRow: function () {
		var Z = this,
			hasLeft = Z._fixedCols > 0,
			fixedBody = null, contentBody, idx,
			recno = Z._dataset.recno();

		if (recno < Z._fixedRows) {
			if (hasLeft) {
				fixedBody = Z.leftFixedTbl.tBodies[0];
			}
			contentBody = Z.rightFixedTbl.tBodies[0];
			idx = recno;
		}
		else {
			if (hasLeft) {
				fixedBody = Z.leftContentTbl.tBodies[0];
			}
			contentBody = Z.rightContentTbl.tBodies[0];
			idx = Z.listvm.recnoToRowno(Z._dataset.recno()) - Z.listvm.getVisibleStartRow();
		}

		var otr, cells, otd, recNo;

		if (hasLeft) {
			otr = fixedBody.rows[idx];
			if (!otr) {
				return;
			}
			cells = otr.childNodes;
			recNo = otr.jsletrecno;
			for (var j = 0, clen = cells.length; j < clen; j++) {
				otd = cells[j];
				if (otd.isSeqCol) {
					otd.firstChild.innerHTML = recno + 1;
					continue;
				}
				if (otd.isSelectCol) {
					ocheck = otd.firstChild;
					ocheck.checked = Z._dataset.selected();
					continue;
				}
				Z._fillCell(recNo, otd);
			}
		}

		otr = contentBody.rows[idx];
		if (!otr) {
			return;
		}
		recNo = otr.jsletrecno;
		// fill content table
		cells = otr.childNodes;
		for (var j = 0, clen = cells.length; j < clen; j++) {
			otd = cells[j];
			Z._fillCell(recNo, otd);
		}
	},

	_getLeftRowByRecno: function (recno) {
		var Z = this;
		if (recno < Z._fixedRows) {
			return Z.leftFixedTbl.tBodies[0].rows[recno];
		}
		var rows = Z.leftContentTbl.tBodies[0].rows, row;
		for (var i = 0, cnt = rows.length; i < cnt; i++) {
			row = rows[i];
			if (row.jsletrecno == recno) {
				return row;
			}
		}
		return null;
	}, // end _getLeftRowByRecno

	_showCurrentRow: function (checkVisible) {//Check if current row is in visible area
		var Z = this;
		rowno = Z.listvm.recnoToRowno(Z._dataset.recno());
		Z.listvm.setCurrentRowno(rowno, false, checkVisible);
	},

	_getTrByRowno: function (rowno) {
		var Z = this, 
			hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0,
			idx, otr, k, rows, row, fixedRow;

		if (rowno < 0) {//fixed rows
			rows = Z.rightFixedTbl.tBodies[0].rows;
			k = Z._fixedRows + rowno;
			row = rows[k];
			fixedRow = (hasLeft ? Z.leftFixedTbl.tBodies[0].rows[k] : null);
			return { fixed: fixedRow, content: row };
		}
		//data content
		rows = Z.rightContentTbl.tBodies[0].rows;
		k = rowno - Z.listvm.getVisibleStartRow();
		if (k >= 0) {
			row = rows[k];
			if (!row) {
				return null;
			}
			fixedRow = hasLeft ? Z.leftContentTbl.tBodies[0].rows[k] : null;
			return { fixed: fixedRow, content: row };
		}
		return null;
	},

	_syncScrollBar: function (rowno) {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var	sw = rowno * Z._rowHeight;
		Z._keep_silence_ = true;
		try {
			Z.jqVScrollBar[0].scrollTop = sw;
		} finally {
			Z._keep_silence_ = false;
		}
	},

	expandAll: function () {
		var Z = this;
		Z.listvm.expandAll(function () {
			Z._fillData(); 
		});
	},

	collapseAll: function () {
		var Z = this;
		Z.listvm.collapseAll(function () {
			Z._fillData(); 
		});
	},

	refreshControl: function (evt) {
		var Z = this, 
			evtType = evt.eventType;
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			
		} else if (evtType == jslet.data.RefreshEvent.BEFORESCROLL) {
			
		} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
			if (Z._dataset.recordCount() === 0) {
				return;
			}
			Z._showCurrentRow(true);
		} else if (evtType == jslet.data.RefreshEvent.UPDATEALL) {
			Z.listvm.refreshModel();
			Z.listvm.setVisibleStartRow(0, true);
			Z._updateSortFlag(true);
			Z._fillData();
			Z._showCurrentRow(true);
			//Clear "Select all" checkbox
			if(Z._hasSelectCol) {
				jQuery(Z.el).find('.jl-tbl-select-all')[0].checked = false;
			}
		} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD) {
			Z.refreshCurrentRow();
		} else if (evtType == jslet.data.RefreshEvent.UPDATECOLUMN) {
			Z._fillData();
		} else if (evtType == jslet.data.RefreshEvent.INSERT) {
			Z.listvm.refreshModel();
			var recno = Z._dataset.recno(),
				preRecno = evt.preRecno;
			Z._fillData();

			Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(recno, preRecno));
		} else if (evtType == jslet.data.RefreshEvent.DELETE) {
			Z.listvm.refreshModel();
			Z._fillData();
			var recno = Z._dataset.recno(),
			preRecno = evt.preRecno;
			Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(recno, preRecno));			
		} else if (evtType == jslet.data.RefreshEvent.SELECTRECORD) {
			if (!Z._hasSelectCol) {
				return;
			}
			var col = 0;
			if (Z._hasSeqCol) {
				col++;
			}
			var recno = evt.recno, otr, otd, checked, ocheckbox;
			for(var i = 0, cnt = recno.length; i < cnt; i++){
				otr = Z._getLeftRowByRecno(recno[i]);
				if (!otr) {
					continue;
				}
				otd = otr.cells[col];
				checked = evt.selected ? true : false;
				ocheckbox = otd.firstChild;
				ocheckbox.checked = checked;
				ocheckbox.defaultChecked = checked;
			}
		} else if (evtType == jslet.data.RefreshEvent.SELECTALL) {
			if (!Z._hasSelectCol) {
				return;
			}
			var col = 0;
			if (Z._hasSeqCol) {
				col++;
			}
			var leftFixedBody = Z.leftFixedTbl.tBodies[0],
				leftContentBody = Z.leftContentTbl.tBodies[0],
				checked, recno, otr, otd, ocheckbox, rec,
				oldRecno = Z._dataset.recno();

			try {
				for (var i = 0, cnt = leftFixedBody.rows.length; i < cnt; i++) {
					otr = leftFixedBody.rows[i];
					if (otr.style.display == 'none') {
						break;
					}
					Z._dataset.recnoSilence(otr.jsletrecno);
					checked = Z._dataset.selected() ? true : false;
					otd = otr.cells[col];
					ocheckbox = otd.firstChild;
					ocheckbox.checked = checked;
					ocheckbox.defaultChecked = checked;
				}

				for (var i = 0, cnt = leftContentBody.rows.length; i < cnt; i++) {
					otr = leftContentBody.rows[i];
					if (otr.style.display == 'none') {
						break;
					}
					Z._dataset.recnoSilence(otr.jsletrecno);
					checked = Z._dataset.selected() ? true : false;
					otd = otr.cells[col];
					ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
					ocheckbox.checked = checked;
					ocheckbox.defaultChecked = checked;
				}
			} finally {
				Z._dataset.recnoSilence(oldRecno);
			}
		}
	}, // refreshControl

	_isCellEditable: function(colCfg){
		var Z = this;
		if (Z._readOnly) {
			return false;
		}
		var fldName = colCfg.field;
		if (!fldName) {
			return false;
		}
		var fldObj = Z._dataset.getField(fldName),
			isEditable = !fldObj.disabled() && !fldObj.readOnly() ? 1 : 0;
		return isEditable;
	},
	
	_createEditControl: function (colCfg) {
		var Z = this,
			fldName = colCfg.field;
		if (!fldName) {
			return null;
		}
		var fldObj = Z._dataset.getField(fldName),
		isEditable = !fldObj.disabled() && !fldObj.readOnly() ? 1 : 0;
		if (!isEditable) {
			return null;
		}
		var param, w, h, fldCtrlCfg = fldObj.editControl();
		fldCtrlCfg.dataset = Z._dataset;
		fldCtrlCfg.field = fldName;
		var editCtrl = jslet.ui.createControl(fldCtrlCfg);
		editCtrl = editCtrl.el;
		editCtrl.id = jslet.nextId();
		return editCtrl;
	}, // end editControl

	/**
	 * Run when container size changed, it's revoked by jslet.resizeeventbus.
	 * 
	 */
	checkSizeChanged: function(){
		var Z = this,
			jqEl = jQuery(Z.el),
			newHeight = jqEl.height();
		if (newHeight == Z._oldHeight) {
			return;
		}
		Z.height = newHeight;
		Z._calcAndSetContentHeight();
		Z._renderBody(true);
		Z._fillData();
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this, jqEl = jQuery(Z.el);
		jslet.resizeEventBus.unsubscribe(Z);
		jqEl.off();
		Z.listvm.onTopRownoChanged = null;
		Z.listvm.onVisibleCountChanged = null;
		Z.listvm.onCurrentRownoChanged = null;
		Z.listvm = null;
		
		Z.prevRow = null;
		Z.leftHeadTbl = null;
		Z.rightHeadTbl = null;
		jQuery(Z.rightHeadTbl).off();

		Z.leftFixedTbl = null;
		Z.rightFixedTbl = null;

		Z.leftContentTbl = null;
		Z.rightContentTbl = null;

		Z.leftFootTbl = null;
		Z.rightFootTbl = null;
		
		Z.noRecordDiv = null;
		Z.jqVScrollBar.off();
		Z.jqVScrollBar = null;

		var splitter = jqEl.find('.jl-tbl-splitter')[0];
		splitter._doDragging = null;
		splitter._doDragEnd = null;
		splitter._doDragCancel = null;

		Z.parsedHeads = null;
		jqEl.find('tr').each(function(){
			this.ondblclick = null;
			this.onclick = null;
		});
		
		jqEl.find('.jl-tbl-select-check').off();
		$super();
	} 
});

jslet.ui.DBTable = jslet.Class.create(jslet.ui.AbstractDBTable, {});


jslet.ui.register('DBTable', jslet.ui.DBTable);
jslet.ui.DBTable.htmlTemplate = '<div></div>';

jslet.ui.CellRender = jslet.Class.create({
	createCell: function (otd, colCfg) {
	
	},
	
	refreshCell: function (otd, colCfg) {
	
	}
});

jslet.ui.DefaultCellRender =  jslet.Class.create(jslet.ui.CellRender, {
	createCell: function (otd, colCfg) {
		var Z = this,
			fldName = colCfg.field,
			fldObj = Z._dataset.getField(fldName);
		otd.noWrap = true;
		otd.style.textAlign = fldObj.alignment();
		otd.innerHTML = '';
		var odiv = document.createElement('div');
		otd.appendChild(odiv);
		jQuery(odiv).addClass(jslet.ui.htmlclass.TABLECLASS.celldiv);
	},
								
	refreshCell: function (otd, colCfg) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var jqDiv = jQuery(otd.firstChild);
			jqDiv.html('');
		var Z = this,
			fldName = colCfg.field;
		if (!fldName) {
			return;
		}
		var fldObj = Z._dataset.getField(fldName), text;
		try {
			text = Z._dataset.getFieldText(fldName);
		} catch (e) {
			text = 'error: ' + e.message;
		}
		
		otd.title = text;
		if (fldObj.urlExpr()) {
			var url = '<a href=' + fldObj.calcUrl(),
				target = fldObj.urlTarget();
			if (target) {
				url += ' target=' + target;
			}
			url += '>' + text + '</a>';
			text = url;
		}
		jqDiv.html(text);
	} 
});

jslet.ui.EditableCellRender =  jslet.Class.create(jslet.ui.CellRender, {
	createCell: function (otd, colCfg, rowNum) {
		var Z = this,
			fldName = colCfg.field,
			fldObj = Z._dataset.getField(fldName);
		
		otd.noWrap = true;
		otd.style.textAlign = fldObj.alignment();
		otd.innerHTML = '';
		var editCtrl = Z._createEditControl(colCfg);
		jQuery(editCtrl).css('width', '100%').on('focus', function(){
			this.jslet._dataset.recno(this.jslet.currRecno());
		});
		editCtrl.style.border = '0px';
		otd.style.paddingLeft = '2px';
		otd.style.paddingRight = '2px';
		otd.appendChild(editCtrl);
	},
	
	refreshCell: function (otd, colCfg, recNo) {
		if (!colCfg) {
			return;
		}
		var editCtrl = otd.firstChild.jslet;
		editCtrl.currRecno(recNo);
		editCtrl.forceRefreshControl();
	} 

});

jslet.ui.SequenceCellRender = jslet.Class.create(jslet.ui.CellRender, {
	createHeader: function(otd, colCfg) {
		otd.innerHTML = '<div class="jl-tbl-cell">&nbsp;</div>';
	},
	
	createCell: function (otd, colCfg) {
		var Z = this;
		otd.noWrap = true;
		otd.innerHTML = '';
		var odiv = document.createElement('div');
		otd.appendChild(odiv);
		odiv.className = jslet.ui.htmlclass.TABLECLASS.celldiv;
	},
	
	refreshCell: function (otd, colCfg) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var jqDiv = jQuery(otd.firstChild);
		jqDiv.html('');
		var Z = this, text = Z._dataset.recno() + 1;
		otd.title = text;
		jqDiv.html(text);
	}
});

jslet.ui.SelectCellRender = jslet.Class.create(jslet.ui.CellRender, {
	createHeader: function(otd, colCfg) {
		otd.noWrap = true;
		otd.style.textAlign = 'center';
		var ocheckbox = document.createElement('input');
		ocheckbox.type = 'checkbox';
		var Z = this;
		jQuery(ocheckbox).addClass('jl-tbl-select-check jl-tbl-select-all').on('click', function (event) {
			Z._dataset.selectAll(this.checked ? 1 : 0, Z._onSelectAll);
		});
		otd.appendChild(ocheckbox);
	},
	
   createCell: function (otd, colCfg) {
		otd.noWrap = true;
		otd.style.textAlign = 'center';
		var Z = this, 
		ocheck = document.createElement('input'),
		jqCheck = jQuery(ocheck);
		jqCheck.attr('type', 'checkbox').addClass('jl-tbl-select-check');
		jqCheck.click(Z._doSelectBoxClick);
		otd.appendChild(ocheck);
	},

	refreshCell: function (otd, colCfg) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var Z = this,
			ocheck = otd.firstChild;
		if(Z._dataset.checkSelectable()) {
			ocheck.checked = Z._dataset.selected();
			ocheck.style.display = '';
		} else {
			ocheck.style.display = 'none';
		}
	}
});

jslet.ui.SubgroupCellRender = jslet.Class.create(jslet.ui.CellRender, {
	createCell: function(otd, colCfg){
		//TODO
	}
});

jslet.ui.BoolCellRender = jslet.Class.create(jslet.ui.DefaultCellRender, {
	refreshCell: function (otd, colCfg) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		otd.style.textAlign = 'center';
		var jqDiv = jQuery(otd.firstChild);
		jqDiv.html('&nbsp;');
		var Z = this,
			fldName = colCfg.field, 
			fldObj = Z._dataset.getField(fldName);
		if (fldObj.trueValue() == Z._dataset.getFieldValue(fldName)) {
			jqDiv.addClass('jl-tbl-checked');
			jqDiv.removeClass('jl-tbl-unchecked');
		}
		else {
			jqDiv.removeClass('jl-tbl-checked');
			jqDiv.addClass('jl-tbl-unchecked');
		}
	}
});
		
jslet.ui.TreeCellRender = jslet.Class.create(jslet.ui.CellRender, {
	initialize: function () {
	},
		
	createCell: function (otd, colCfg) {
		var Z = this;
		otd.noWrap = true;
		jQuery(otd).html('');
		var odiv = document.createElement('div'),
			jqDiv = jQuery(odiv);
		jqDiv.addClass(jslet.ui.htmlclass.TABLECLASS.celldiv);
		odiv.style.height = Z._rowHeight - 2 + 'px';
		jqDiv.html('<span class="jl-tbltree-indent"></span><span class="jl-tbltree-node"></span><span class="jl-tbltree-icon"></span><span class="jl-tbltree-text"></span>');
		
		var obtn = odiv.childNodes[1];
		obtn.onclick = function (event) {
			var otr = jslet.ui.findFirstParent(this,
			function(node){
				return node.tagName && node.tagName.toLowerCase() == 'tr';
			});
			
			event.stopImmediatePropagation();
			event.preventDefault();
			Z._dataset.recno(otr.jsletrecno);
			if(Z._dataset.aborted()) {
				return false;
			}
			if (this.expanded) {
				Z.listvm.collapse(function(){
					Z._fillData();
				});
			} else {
				Z.listvm.expand(function(){
					Z._fillData();
				});
			}
			return false;
		};
		
		obtn.onmouseover = function (event) {
			var jqBtn = jQuery(this);
			if (jqBtn.hasClass('jl-tbltree-collapse')) {
				jqBtn.addClass('jl-tbltree-collapse-hover');
			} else {
				jqBtn.addClass('jl-tbltree-expand-hover');
			}
		};
		
		obtn.onmouseout = function (event) {
			var jqBtn = jQuery(this);
			jqBtn.removeClass('jl-tbltree-collapse-hover');
			jqBtn.removeClass('jl-tbltree-expand-hover');
		};
		
		otd.appendChild(odiv);
	},
	
	refreshCell: function (otd, colCfg) {
		if (!colCfg || colCfg.noRefresh) {
			return;
		}
		var odiv = otd.firstChild,
			arrSpan = odiv.childNodes,
			Z = this,
			level = Z.listvm.getLevel();
		
		if (!jslet.ui.TreeCellRender.iconWidth) {
			jslet.ui.TreeCellRender.iconWidth = parseInt(jslet.ui.getCssValue('jl-tbltree-indent', 'width'));
		}
		var hasChildren = Z.listvm.hasChildren(),
			indentWidth = (!hasChildren ? level + 1 : level) * jslet.ui.TreeCellRender.iconWidth,
			oindent = arrSpan[0];
		oindent.style.width = indentWidth + 'px';
		var expBtn = arrSpan[1]; //expand button
		expBtn.style.display = hasChildren ? 'inline-block' : 'none';
		if (hasChildren) {
			expBtn.expanded = Z._dataset.getRecord()._expanded_;
			var jqExpBtn = jQuery(expBtn);
			jqExpBtn.removeClass('jl-tbltree-expand');
			jqExpBtn.removeClass('jl-tbltree-collapse');
			jqExpBtn.addClass((expBtn.expanded ? 'jl-tbltree-expand' : 'jl-tbltree-collapse'));
		}
		if (colCfg.getIconClass) {
			var iconCls = colCfg.getIconClass(level, hasChildren);
			if (iconCls) {
				var jqIcon = jQuery(arrSpan[2]);
				jqIcon.addClass('jl-tbltree-icon ' + iconCls);
			}
		}
		
		var otext = arrSpan[3];
		
		var fldName = colCfg.field, fldObj = Z._dataset.getField(fldName), text;
		try {
			text = Z._dataset.getFieldText(fldName);
		} catch (e) {
			text = 'error: ' + e.message;
		}
		otd.title = text;
		if (fldObj.urlExpr()) {
			var url = '<a href=' + fldObj.calcUrl();
			var target = fldObj.urlTarget();
			if (target) {
				url += ' target=' + target;
			}
			url += '>' + text + '</a>';
			text = url;
		}
		otext.innerHTML = text;
	}
});

jslet.ui.DBTable.defaultCellRender = new jslet.ui.DefaultCellRender();
jslet.ui.DBTable.editableCellRender = new jslet.ui.EditableCellRender();

jslet.ui.DBTable.treeCellRender = new jslet.ui.TreeCellRender();
jslet.ui.DBTable.boolCellRender = new jslet.ui.BoolCellRender();
jslet.ui.DBTable.sequenceCellRender = new jslet.ui.SequenceCellRender();
jslet.ui.DBTable.selectCellRender = new jslet.ui.SelectCellRender();
jslet.ui.DBTable.subgroupCellRender = new jslet.ui.SubgroupCellRender();

/**
* Splitter: used in jslet.ui.DBTable
*/
jslet.ui.Splitter = function () {
	if (!jslet.ui._splitDiv) {
		var odiv = document.createElement('div');
		odiv.className = 'jl-split-column';
		odiv.style.display = 'none';
		jslet.ui._splitDiv = odiv;
		document.body.appendChild(odiv);
		odiv = null;
	}
	
	this.isDragging = false;
	
	this.attach = function (el, left, top, height) {
		if (!height) {
			height = jQuery(el).height();
		}
		var odiv = jslet.ui._splitDiv;
		odiv.style.height = height + 'px';
		odiv.style.left = left + 'px';
		odiv.style.top = top + 'px';
		odiv.style.display = 'block';
		jslet.ui.dnd.bindControl(this);
		this.isDragging = false;
	};
	
	this.unattach = function () {
		jslet.ui._splitDiv.style.display = 'none';
		this.onSplitEnd = null;
		this.onSplitCancel = null;
	};
	
	this.onSplitEnd = null;
	this.onSplitCancel = null;
	
	this._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
		jslet.ui.dnd.unbindControl();
		if (this.onSplitEnd) {
			this.onSplitEnd(x - oldX);
		}
		this.unattach();
		this.isDragging = false;
	};
	
	this._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
		this.isDragging = true;
		jslet.ui._splitDiv.style.left = x + 'px';
	};
	
	this._doDragCancel = function () {
		jslet.ui.dnd.unbindControl();
		if (this.onSplitCancel) {
			this.onSplitCancel();
		}
		this.unattach();
		this.isDragging = false;
	};
};
﻿/* ========================================================================
 * Jslet framework: jslet.dbtreeview.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBTreeView. 
 * Functions:
 * 1. Perfect performance, you can load unlimited data;
 * 2. Checkbox on tree node;
 * 3. Relative check, when you check one tree node, its children and its parent will check too;
 * 4. Many events for you to customize tree control;
 * 5. Context menu supported and you can customize your context menu;
 * 6. Icon supported on each tree node.
 * 
 * Example:
 * <pre><code>
 *	var jsletParam = { type: "DBTreeView", 
 *	dataset: "dsAgency", 
 *	displayFields: "[code]+'-'+[name]",
 *  keyField: "id", 
 *	parentField: "parentid",
 *  hasCheckBox: true, 
 *	iconClassField: "iconcls", 
 *	onCreateContextMenu: doCreateContextMenu, 
 *	correlateCheck: true
 * };
 * //1. Declaring:
 *  &lt;div id="ctrlId" data-jslet="jsletParam">
 *  or
 *  &lt;div data-jslet='jsletParam' />
 *  
 *  //2. Binding
 *  &lt;div id="ctrlId"  />
 *  //Js snippet
 *	var el = document.getElementById('ctrlId');
 *  jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *  jslet.ui.createControl(jsletParam, document.body);
 *		
 * </code></pre>
 */
jslet.ui.DBTreeView = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,displayFields,hasCheckBox,correlateCheck,readOnly,expandLevel,codeField,codeFormat,onItemClick,onItemDblClick,iconClassField,onGetIconClass,onCreateContextMenu';
		Z.requiredProperties = 'displayFields';
		
		/**
		 * {String} Display fields, it's a js expresssion, like: "[code]+'-'+[name]"
		 */
		Z._displayFields = null;
		/**
		 * {Boolean} Identify if there is checkbox on tree node.
		 */
		Z._hasCheckBox = false;
		/**
		 * {Boolean} Checkbox is readonly or not, ignored if hasCheckBox = false
		 */
		Z._readOnly = false;
		
		/**
		 * {Boolean} if true, when you check one tree node, its children and its parent will check too;
		 */
		Z._correlateCheck = false;
		///**
		// * {String} Key field, it will use 'keyField' and 'parentField' to construct tree nodes.
		// */
		//Z._keyField = null;
		///**
		// * {String} Parent field, it will use 'keyField' and 'parentField' to construct tree nodes.
		// */
		//Z._parentField = null;
		/**
		 * {String} If icon class is stored one field, you can set this property to display different tree node icon.
		 */
		Z._iconClassField = null;
		
		/**
		 * {Integer} Identify the nodes which level is from 0 to "expandLevel" will be expanded when initialize tree.
		 */
		Z._expandLevel = -1;
		
		Z._onItemClick = null;
		
		Z._onItemDblClick = null;
		/**
		 * {Event} You can use this event to customize your tree node icon flexibly.
		 * Pattern: 
		 *   function(keyValue, level, isLeaf){}
		 *   //keyValue: String, key value of tree node;
		 *   //level: Integer, tree node level;
		 *   //isLeaf: Boolean, Identify if the tree node is the leaf node.
		 */
		Z._onGetIconClass = null;
		
		Z._onCreateContextMenu = null;
		
		Z.iconWidth = null;
		
		$super(el, params);
	},
	
	//keyField: function(keyField) {
	//	if(keyField === undefined) {
	//		return this._keyField;
	//	}
	//	keyField = jQuery.trim(keyField);
	//		jslet.Checker.test('DBTreeView.keyField', keyField).required().isString();
	//	this._keyField = keyField;
	//},
	//
	//parentField: function(parentField) {
	//	if(parentField === undefined) {
	//		return this._parentField;
	//	}
	//	parentField = jQuery.trim(parentField);
	//		jslet.Checker.test('DBTreeView.parentField', parentField).required().isString();
	//	this._parentField = parentField;
	//},
	//
	displayFields: function(displayFields) {
		if(displayFields === undefined) {
			return this._displayFields;
		}
		displayFields = jQuery.trim(displayFields);
		jslet.Checker.test('DBTreeView.displayFields', displayFields).required().isString();
		this._displayFields = displayFields;
	},
	
	iconClassField: function(iconClassField) {
		if(iconClassField === undefined) {
			return this._iconClassField;
		}
		iconClassField = jQuery.trim(iconClassField);
		jslet.Checker.test('DBTreeView.iconClassField', iconClassField).isString();
		this._iconClassField = iconClassField;
	},
	
	hasCheckBox: function(hasCheckBox) {
		if(hasCheckBox === undefined) {
			return this._hasCheckBox;
		}
		this._hasCheckBox = hasCheckBox ? true: false;
	},
	
	correlateCheck: function(correlateCheck) {
		if(correlateCheck === undefined) {
			return this._correlateCheck;
		}
		this._correlateCheck = correlateCheck ? true: false;
	},
	
	readOnly: function(readOnly) {
		if(readOnly === undefined) {
			return this._readOnly;
		}
		this._readOnly = readOnly ? true: false;
	},
	
	expandLevel: function(expandLevel) {
		if(expandLevel === undefined) {
			return this._expandLevel;
		}
		jslet.Checker.test('DBTreeView.expandLevel', expandLevel).isGTEZero();
		this._expandLevel = parseInt(expandLevel);
	},
	
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('DBTreeView.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
	},
	
	onItemDblClick: function(onItemDblClick) {
		if(onItemDblClick === undefined) {
			return this._onItemDblClick;
		}
		jslet.Checker.test('DBTreeView.onItemDblClick', onItemDblClick).isFunction();
		this._onItemDblClick = onItemDblClick;
	},
	
	onGetIconClass: function(onGetIconClass) {
		if(onGetIconClass === undefined) {
			return this._onGetIconClass;
		}
		jslet.Checker.test('DBTreeView.onGetIconClass', onGetIconClass).isFunction();
		this._onGetIconClass = onGetIconClass;
	},
	
	onCreateContextMenu: function(onCreateContextMenu) {
		if(onCreateContextMenu === undefined) {
			return this._onCreateContextMenu;
		}
		jslet.Checker.test('DBTreeView.onCreateContextMenu', onCreateContextMenu).isFunction();
		this._onCreateContextMenu = onCreateContextMenu;
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
		var Z = this,
			jqEl = jQuery(Z.el);
		Z.scrBarSize = jslet.scrollbarSize() + 1;
		
		if (Z._keyField === undefined) {
			Z._keyField = Z._dataset.keyField();
		}
		var ti = jqEl.attr('tabindex');
		if (!ti) {
			jqEl.attr('tabindex', 0);
		}
		jqEl.keydown(function(event){
			if (Z._doKeydown(event.which)) {
				event.preventDefault();
			}
		});
		jqEl.on('mouseenter', 'table.jl-tree-nodes', function(event){
			jQuery(this).addClass('jl-tree-nodes-hover');
		});
		jqEl.on('mouseleave', 'table.jl-tree-nodes', function(event){
			jQuery(this).removeClass('jl-tree-nodes-hover');
		});
		if (!jqEl.hasClass('jl-tree')) {
			jqEl.addClass('jl-tree');
		}
		Z.renderAll();
		Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(this._dataset.recno()));
		Z._createContextMenu();		
		jslet.resizeEventBus.subscribe(Z);
	}, // end bind
	
		/**
		 * @override
		 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		Z.evaluator = new jslet.Expression(Z._dataset, Z._displayFields);
		
		jqEl.html('');
		Z.oldWidth = jqEl.width();
		Z.oldHeight = jqEl.height();
		Z.nodeHeight = Z.iconWidth =  parseInt(jslet.ui.getCssValue('jl-tree-lines', 'width'));
		Z.treePanelHeight = jqEl.height();
		Z.treePanelWidth = jqEl.width();
		Z.nodeCount = Math.floor(Z.treePanelHeight / Z.nodeHeight) - 1;

		Z._initVm();
		Z._initFrame();
	}, // end renderAll
	
	_initFrame: function(){
		var Z = this,
			jqEl = jQuery(Z.el);
			
		jqEl.find('.jl-tree-container').off();
		jqEl.find('.jl-tree-scrollbar').off();
			
		var lines = [];
		for(var i = 0; i < 5; i++){//Default cells for lines is 5
			lines.push('<td class="jl-tree-lines" ');
			lines.push(jslet.ui.DBTreeView.NODETYPE);
			lines.push('="0"></td>');
		}
		var s = lines.join(''),
			tmpl = ['<table border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed;width:100%;height:100%"><tr><td style="vertical-align:top"><div class="jl-tree-container">'];
		for(var i = 0, cnt = Z.nodeCount; i < cnt; i++){
			tmpl.push('<table class="jl-tree-nodes" cellpadding="0" cellspacing="0"><tr>');
			tmpl.push(s);
			tmpl.push('<td class="jl-tree-expander" ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//expander
			tmpl.push('="1"></td><td ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//checkbox
			tmpl.push('="2"></td><td ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//icon
			tmpl.push('="3"></td><td class="jl-tree-text" ');
			tmpl.push(jslet.ui.DBTreeView.NODETYPE);//text
			tmpl.push('="9" nowrap="nowrap"></td></tr></table>');
		}
		tmpl.push('</div></td><td class="jl-tree-scroll-col"><div class="jl-tree-scrollbar"><div class="jl-tree-tracker"></div></div></td></tr></table>');
		jqEl.html(tmpl.join(''));
		
		var treePnl = jqEl.find('.jl-tree-container');
		treePnl.on('click', function(event){
			Z._doRowClick(event.target);
		});
		treePnl.on('dblclick', function(event){
			Z._doRowDblClick(event.target);
		});
		Z.listvm.setVisibleCount(Z.nodeCount);
		var sb = jqEl.find('.jl-tree-scrollbar');
		
		sb.on('scroll',function(){
			var numb=Math.round(this.scrollTop/Z.nodeHeight);
			if (numb!=Z.listvm.getVisibleStartRow()){
				Z._skip_ = true;
				try {
					Z.listvm.setVisibleStartRow(numb);
				} finally {
					Z._skip_ = false;
				}
			}
		});	
		
	},
	
	resize: function(){
		var Z = this,
			jqEl = jQuery(Z.el),
			height = jqEl.height(),
			width = jqEl.width();
		if (width != Z.oldWidth){
			Z.oldWidth = width;
			Z.treePanelWidth = jqEl.innerWidth();
			Z._fillData();
		}
		if (height != Z.oldHeight){
			Z.oldHeight = height;
			Z.treePanelHeight = jqEl.innerHeight();
			Z.nodeCount = Math.floor(height / Z.nodeHeight) - 1;
			Z._initFrame();
		}
	},
	
	hasChildren: function() {
		return this.listvm.hasChildren();
	},
	
	_initVm:function(){
		var Z=this;
		Z.listvm = new jslet.ui.ListViewModel(Z._dataset, true);
		Z.listvm.refreshModel(Z._expandLevel);
		Z.listvm.fixedRows=0;
		
		Z.listvm.onTopRownoChanged=function(rowno){
			var rowno = Z.listvm.getCurrentRowno();
			Z._fillData();
			Z._doCurrentRowChanged(rowno);
			Z._syncScrollBar(rowno);
		};
		
		Z.listvm.onVisibleCountChanged=function(){
			Z._fillData();
			var allCount = Z.listvm.getNeedShowRowCount();
			jQuery(Z.el).find('.jl-tree-tracker').height(Z.nodeHeight * allCount);
		};
		
		Z.listvm.onCurrentRownoChanged=function(prevRowno, rowno){
			Z._doCurrentRowChanged(rowno);
		};
		
		Z.listvm.onNeedShowRowsCountChanged = function(allCount){
			Z._fillData();
			jQuery(Z.el).find('.jl-tree-tracker').height(Z.nodeHeight * allCount);
		};
		
		Z.listvm.onCheckStateChanged = function(){
			Z._fillData();
		};
	},
	
	_doKeydown: function(keyCode){
		var Z = this, result = false;
		if (keyCode == 32){//space
			Z._doCheckBoxClick();
			result = true;
		} else if (keyCode == 38) {//KEY_UP
			Z.listvm.priorRow();
			result = true;
		} else if (keyCode == 40) {//KEY_DOWN
			Z.listvm.nextRow();
			result = true;
		} else if (keyCode == 37) {//KEY_LEFT
			if (jslet.locale.isRtl) {
				Z.listvm.expand();
			} else {
				Z.listvm.collapse();
			}
			result = true;
		} else if (keyCode == 39) {//KEY_RIGHT
			if (jslet.locale.isRtl) {
				Z.listvm.collapse();
			} else {
				Z.listvm.expand();
			}
			result = true;
		} else if (keyCode == 33) {//KEY_PAGEUP
			Z.listvm.priorPage();
			result = true;
		} else if (keyCode == 34) {//KEY_PAGEDOWN
			Z.listvm.nextPage();
			result = true;
		}
		return result;
	},
	
	_getTrByRowno: function(rowno){
		var nodes = jQuery(this.el).find('.jl-tree-nodes'), row;
		for(var i = 0, cnt = nodes.length; i < cnt; i++){
			row = nodes[i].rows[0];
			if (row.jsletrowno == rowno) {
				return row;
			}
		}
		return null;
	},
	
	_doCurrentRowChanged: function(rowno){
		var Z = this;
		if (Z.prevRow){
			jQuery(Z._getTextTd(Z.prevRow)).removeClass(jslet.ui.htmlclass.TREENODECLASS.selected);
		}
		var otr = Z._getTrByRowno(rowno);
		if (otr) {
			jQuery(Z._getTextTd(otr)).addClass(jslet.ui.htmlclass.TREENODECLASS.selected);
		}
		Z.prevRow = otr;
	},
	
	_getTextTd: function(otr){
		return otr.cells[otr.cells.length - 1];
	},
	
	_doExpand: function(){
		this.expand();
	},
	
	_doRowClick: function(node){
		var Z = this,
			nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
		if(!nodeType) {
			return;
		}
		if (nodeType != '0') {
			Z._syncToDs(node);
		}
		if (nodeType == '1' || nodeType == '2'){ //expander
			var item = Z.listvm.getCurrentRow();
			if (nodeType == '1' && item.children && item.children.length > 0){
				if (item.expanded) {
					Z.collapse();
				} else {
					Z.expand();
				}
			}
			if (nodeType == '2'){//checkbox
				Z._doCheckBoxClick();
			}
		}
		if(nodeType == '9' && Z._onItemClick) {
			Z._onItemClick.call(Z);
		}
	},
	
	_doRowDblClick: function(node){
		this._syncToDs(node);
		var nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
		if (this._onItemDblClick && nodeType == '9') {
			this._onItemDblClick.call(this);
		}
	},
	
	_doCheckBoxClick: function(){
		var Z = this;
		if (Z._readOnly) {
			return;
		}
		if (Z.beforeCheckBoxClick) {
			if (!Z.beforeCheckBoxClick()) {
				return;
			}
		}
		var node = Z.listvm.getCurrentRow();
		Z.listvm.checkNode(!node.state? 1:0, Z._correlateCheck);
	},
	
	_syncToDs: function(otr){
		var rowno = -1, k;
		while(true){
			k = otr.jsletrowno;
			if (k === 0 || k){
				rowno = k;
				break;
			}
			otr = otr.parentNode;
			if (!otr) {
				break;
			}
		}
		if (rowno < 0) {
			return;
		}
		this.listvm.setCurrentRowno(rowno);
	},
	
	_fillData: function(){
		var Z = this,
			vCnt = Z.listvm.getVisibleCount(), 
			topRowno = Z.listvm.getVisibleStartRow(),
			allCnt = Z.listvm.getNeedShowRowCount(),
			availbleCnt = vCnt + topRowno,
			index = 0,
			jqEl = jQuery(Z.el),
			nodes = jqEl.find('.jl-tree-nodes'), node;
		if (Z._isRendering) {
			return;
		}

		Z._isRendering = true;
		Z._skip_ = true;
		var b=Z._dataset.startSilenceMove(),
			preRowNo = Z.listvm.getCurrentRowno(),
			ajustScrBar = true, maxNodeWidth = 0, nodeWidth;
		try{
			if (allCnt < availbleCnt){
				for(var i = availbleCnt - allCnt; i > 0; i--){
					node = nodes[vCnt - i];
					node.style.display = 'none';
				}
				ajustScrBar = false; 
			} else {
				allCnt = availbleCnt;
			}
			var endRow = allCnt - 1;
			
			for(var k = topRowno; k <= endRow; k++){
				node = nodes[index++];
				nodeWidth = Z._fillNode(node, k);
				if (ajustScrBar && maxNodeWidth < Z.treePanelWidth){
					if (k == endRow && nodeWidth < Z.treePanelWidth) {
						ajustScrBar = false;
					} else {
						maxNodeWidth = Math.max(maxNodeWidth, nodeWidth);
					}
				}
				if (k == endRow && ajustScrBar){
					node.style.display = 'none';
				} else {
					node.style.display = '';
					node.jsletrowno = k;
				}
			}
			var sb = jqEl.find('.jl-tree-scrollbar');
			if (ajustScrBar) {
				sb.height(Z.treePanelHeight - Z.scrBarSize - 2);
			} else {
				sb.height(Z.treePanelHeight - 2);
			}
		} finally {
			Z.listvm.setCurrentRowno(preRowNo, false);
			Z._dataset.endSilenceMove(b);
			Z._isRendering = false;
			Z._skip_ = false;
		}
	},

	_getCheckClassName: function(expanded){
		if (!expanded) {
			return jslet.ui.htmlclass.TREECHECKBOXCLASS.unChecked;
		}
		if (expanded == 2) { //mixed checked
			return jslet.ui.htmlclass.TREECHECKBOXCLASS.mixedChecked;
		}
		return jslet.ui.htmlclass.TREECHECKBOXCLASS.checked;
	},
	
	_fillNode: function(node, rowNo){
		var row = node.rows[0],
			Z = this,
			item = Z.listvm.setCurrentRowno(rowNo, true),
			cells = row.cells, 
			cellCnt = cells.length, 
			reqiredCnt = item.level + 4,
			otd;
		row.jsletrowno = rowNo;
		if (cellCnt < reqiredCnt){
			for(var i = 1, cnt = requiredCnt - cellCnt; i < cnt; i++){
				otd = row.insertCell(0);
				jQuery(otd).addClass('jl-tree-lines').attr('jsletline', 1);
			}
		}
		if (cellCnt > reqiredCnt){
			for( var i = 0, cnt = cellCnt - reqiredCnt; i < cnt; i++){
				cells[i].style.display = 'none';
			}
			for(var i = cellCnt - reqiredCnt; i < reqiredCnt; i++){
				cells[i].style.display = '';
			}
		}
		cellCnt = cells.length;
		//Line
		var pitem = item, k = 1, totalWidth = Z.iconWidth * item.level;
		for(var i = item.level; i >0; i--){
			otd = row.cells[cellCnt- 4 - k++];
			pitem = pitem.parent;
			if (pitem.islast) {
				otd.className = jslet.ui.htmlclass.TREELINECLASS.empty;
			} else {
				otd.className = jslet.ui.htmlclass.TREELINECLASS.line;
			}
		}

		//expander
		var oexpander = row.cells[cellCnt- 4];
		oexpander.noWrap = true;
		oexpander.style.display = '';
		if (item.children && item.children.length > 0) {
			if (!item.islast) {
				oexpander.className = item.expanded ? jslet.ui.htmlclass.TREELINECLASS.minus : jslet.ui.htmlclass.TREELINECLASS.plus;
			} else {
				oexpander.className = item.expanded ? jslet.ui.htmlclass.TREELINECLASS.minusBottom : jslet.ui.htmlclass.TREELINECLASS.plusBottom;
			}
		} else {
			if (!item.islast) {
				oexpander.className = jslet.ui.htmlclass.TREELINECLASS.join;
			} else {
				oexpander.className = jslet.ui.htmlclass.TREELINECLASS.joinBottom;
			}
		}
		totalWidth += Z.iconWidth;
				
		// CheckBox
		var flag = Z._hasCheckBox && Z._dataset.checkSelectable();
		var ocheckbox = row.cells[cellCnt- 3];
		if (flag) {
			ocheckbox.noWrap = true;
			ocheckbox.className = Z._getCheckClassName(Z._dataset.selected());
			ocheckbox.style.display = '';
			totalWidth += Z.iconWidth;
		} else {
			ocheckbox.style.display = 'none';
		}
		//Icon
		var oicon = row.cells[cellCnt- 2],
			clsName = 'jl-tree-icon',
			iconClsId = null;

		if(Z._iconClassField || Z._onGetIconClass) {
			if(Z._iconClassField) {
				iconClsId = Z._dataset.getFieldValue(Z._iconClassField);
			} else if (Z._onGetIconClass) {
				var isLeaf = !(item.children && item.children.length > 0);
				iconClsId = Z._onGetIconClass.call(Z, Z._dataset.keyValue(), item.level, isLeaf); //keyValue, level, isLeaf
			}
			if (iconClsId) {
							clsName += ' '+ iconClsId;
			}
			if (oicon.className != clsName) {
				oicon.className = clsName;
			}
			oicon.style.display = '';
			totalWidth += Z.iconWidth;
		} else {
			oicon.style.display = 'none';
		}
				//Text
		var text = Z.evaluator.eval();
		jslet.ui.textMeasurer.setElement(Z.el);
		var width = Math.round(jslet.ui.textMeasurer.getWidth(text)) + text.length;
		totalWidth += width + 10;
		//node.style.width = totalWidth + 'px';
		jslet.ui.textMeasurer.setElement();
		var otd = row.cells[cellCnt- 1];
		otd.style.width = width + 'px';
		var jqTd = jQuery(otd);
		jqTd.html(text);
		if (item.isbold) {
			jqTd.addClass('jl-tree-child-checked');
		} else {
			jqTd.removeClass('jl-tree-child-checked');
		}
		return totalWidth;
	},
		
	_updateCheckboxState: function(){
		var Z = this, b=Z._dataset.startSilenceMove(),
			jqEl = jQuery(Z.el),
			nodes = jqEl.find('.jl-tree-nodes'),
			rowNo, cellCnt, row;
		try{
			for(var i = 0, cnt = nodes.length; i < cnt; i++){
				row = nodes[i].rows[0];
				cellCnt = row.cells.length;
	
				rowNo = row.jsletrowno;
				if(rowNo) {
					Z.listvm.setCurrentRowno(rowNo, true);
					row.cells[cellCnt- 3].className = Z._getCheckClassName(Z._dataset.selected());
				}
			}
		} finally {
			Z._dataset.endSilenceMove(b);
		}
	},
	
	_syncScrollBar: function(){
		var Z = this;
		if (Z._skip_) {
			return;
		}
		jQuery(Z.el).find('.jl-tree-scrollbar').scrollTop(Z.nodeHeight * Z.listvm.getVisibleStartRow());
	},
		
	expand: function () {
		this.listvm.expand();
	},
	
	collapse: function () {
		this.listvm.collapse();
	},
	
	expandAll: function () {
		this.listvm.expandAll();
	},
	
	collapseAll: function () {
		this.listvm.collapseAll();
	},
	
	_createContextMenu: function () {
		if (!jslet.ui.Menu) {
			return;
		}
		var Z = this;
		var menuCfg = { type: 'Menu', onItemClick: Z._menuItemClick, items: [
			{ id: 'expandAll', name: jslet.locale.DBTreeView.expandAll },
			{ id: 'collapseAll', name: jslet.locale.DBTreeView.collapseAll}]
		};
		if (Z._hasCheckBox && !Z._correlateCheck) {
			menuCfg.items.push({ name: '-' });
			menuCfg.items.push({ id: 'checkAll', name: jslet.locale.DBTreeView.checkAll });
			menuCfg.items.push({ id: 'uncheckAll', name: jslet.locale.DBTreeView.uncheckAll });
		}
		if (Z._onCreateContextMenu) {
			Z._onCreateContextMenu.call(Z, menuCfg.items);
		}
		if (menuCfg.items.length === 0) {
			return;
		}
		Z.contextMenu = jslet.ui.createControl(menuCfg);
		jQuery(Z.el).on('contextmenu', function (event) {
			var node = event.target,
				nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
				if(!nodeType || nodeType == '0') {
					return;
				}
					Z._syncToDs(node);
		Z.contextMenu.showContextMenu(event, Z);
		});
	},
	
	_menuItemClick: function (menuid, checked) {
		if (menuid == 'expandAll') {
			this.expandAll();
		} else if (menuid == 'collapseAll') {
			this.collapseAll();
		} else if (menuid == 'checkAll') {
			this.listvm.checkNode(true, true);
		} else if (menuid == 'uncheckAll') {
			this.listvm.checkNode(false, true);
		}
	},
	
	refreshControl: function (evt) {
		var Z = this,
			evtType = evt.eventType;
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			//empty
		} else if (evtType == jslet.data.RefreshEvent.UPDATEALL ||
			evtType == jslet.data.RefreshEvent.INSERT ||
			evtType == jslet.data.RefreshEvent.DELETE){
			Z.listvm.refreshModel();
			if(evtType == jslet.data.RefreshEvent.INSERT) {
				Z.listvm.syncDataset();
			}
		} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN){
			Z._fillData();
		} else if (evtType == jslet.data.RefreshEvent.SELECTALL || 
			evtType == jslet.data.RefreshEvent.SELECTRECORD) {
			if (Z._hasCheckBox) {
				Z._updateCheckboxState();
			}
		} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
			Z.listvm.syncDataset();
		}
	}, // end refreshControl
		
	/**
	 * Run when container size changed, it's revoked by jslet.resizeeventbus.
	 * 
	 */
	checkSizeChanged: function(){
		this.resize();
	},

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this,
			jqEl = jQuery(Z.el);
		
		jslet.resizeEventBus.unsubscribe(Z);
		jqEl.find('.jl-tree-nodes').off();
		Z.listvm.destroy();
		Z.listvm = null;
		Z.prevRow = null;
		
		$super();
	}
});

jslet.ui.htmlclass.TREELINECLASS = {
		line : 'jl-tree-lines jl-tree-line',// '|'
		join : 'jl-tree-lines jl-tree-join',// |-
		joinBottom : 'jl-tree-lines jl-tree-join-bottom',// |_
		minus : 'jl-tree-lines jl-tree-minus',// O-
		minusBottom : 'jl-tree-lines jl-tree-minus-bottom',// o-_
		noLineMinus : 'jl-tree-lines jl-tree-noline-minus',// o-
		plus : 'jl-tree-lines jl-tree-plus',// o+
		plusBottom : 'jl-tree-lines jl-tree-plus-bottom',// o+_
		noLinePlus : 'jl-tree-lines jl-tree-noline-plus',// o+
		empty : 'jl-tree-empty'
};
jslet.ui.htmlclass.TREECHECKBOXCLASS = {
//		checkbox : 'jl-tree-checkbox',
	checked : 'jl-tree-checkbox jl-tree-checked',
	unChecked : 'jl-tree-checkbox jl-tree-unchecked',
	mixedChecked : 'jl-tree-checkbox jl-tree-mixedchecked'
};

jslet.ui.htmlclass.TREENODECLASS = {
	selected : 'jl-tree-selected',
	childChecked : 'jl-tree-child-checked',
	treeNodeLevel : 'jl-tree-child-level'
};

jslet.ui.DBTreeView.NODETYPE = 'data-nodetype';

jslet.ui.register('DBTreeView', jslet.ui.DBTreeView);
jslet.ui.DBTreeView.htmlTemplate = '<div></div>';


﻿/* ========================================================================
 * Jslet framework: jslet.dbtext.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBText is a powerful control, it can input any data type, like:
 *		number, date etc. Example:
 * 
 * <pre><code>
 * var jsletParam = {type:&quot;DBText&quot;,field:&quot;name&quot;};
 * //1. Declaring:
 * &lt;input id=&quot;ctrlId&quot; type=&quot;text&quot; data-jslet='jsletParam' /&gt;
 * or
 * &lt;input id=&quot;ctrlId&quot; type=&quot;text&quot; data-jslet='{type:&quot;DBText&quot;,field:&quot;name&quot;}' /&gt;
 * 
 *  //2. Binding
 * &lt;input id=&quot;ctrlId&quot; type=&quot;text&quot; data-jslet='jsletParam' /&gt;
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 * 
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBText = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,beforeUpdateToDataset,enableInvalidTip,onKeyDown';

		/**
		 * @protected
		 */
		Z._beforeUpdateToDataset = null;
		Z._enableInvalidTip = true;
		
		/**
		 * @private
		 */
		Z.oldValue = null;
		Z.editMask = null;
		$super(el, params);
	},

	beforeUpdateToDataset: function(beforeUpdateToDataset) {
		if(beforeUpdateToDataset === undefined) {
			return this._beforeUpdateToDataset;
		}
		jslet.Checker.test('DBText.beforeUpdateToDataset', beforeUpdateToDataset).isFunction();
		this._beforeUpdateToDataset = beforeUpdateToDataset;
	},

	enableInvalidTip: function(enableInvalidTip) {
		if(enableInvalidTip === undefined) {
			return this._enableInvalidTip;
		}
		this._enableInvalidTip = enableInvalidTip? true: false;
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
	bind: function () {
		var Z = this;
		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.addClass('form-control');
		
		if (Z.doFocus) {
			jqEl.on('focus', Z.doFocus);
		}
		if (Z.doBlur) {
			jqEl.on('blur', Z.doBlur);
		}
		if (Z.doKeydown) {
			jqEl.on('keydown', Z.doKeydown);
		}
		if (Z.doKeypress) {
			jqEl.on('keypress', Z.doKeypress);
		}
		if (Z._enableInvalidTip && jslet.ui.globalTip) {
			jqEl.on('mouseover', Z.doMouseOver);
			jqEl.on('mouseout', Z.doMouseOut);
		}
	}, // end bind

	doFocus: function (event) {
		var Z = this.jslet;
		if (Z._skipFocusEvent) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._field);
		if(!fldObj.message()) {
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		}
		jslet.ui.textutil.selectText(this);
	},

	doBlur: function (event) {
		var Z = this.jslet,
			fldObj = Z._dataset.getField(Z._field);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		var jqEl = jQuery(this.el);
		if(jqEl.attr('readOnly') || jqEl.attr('disabled')) {
			return;
		}

		Z.updateToDataset();
		Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
	},

	doKeydown: null,

	doKeypress: function (event) {
		var Z = this.jslet,
		fldObj = Z._dataset.getField(Z._field);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		event = jQuery.event.fix( event || window.event );
		var keyCode = event.which;
		if (!Z._dataset.fieldValidator.checkInputChar(fldObj, String.fromCharCode(keyCode))) {
			event.preventDefault();
		}
		//When press 'enter', write data to dataset.
		if(keyCode == 13) {
			Z.updateToDataset();
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
		}
	},

	doChange: function (event) {
		this.jslet.updateToDataset();
	},

	doMouseOver: function (event) {
		var Z = this.jslet,
			fldObj = Z._dataset.getField(Z._field),
			invalidMsg = fldObj.message();
		
		if (invalidMsg) {
			jslet.ui.globalTip.show(invalidMsg, event);
		}
	},

	doMouseOut: function (event) {
		jslet.ui.globalTip.hide();
	},

	focus: function() {
		var jqEl = jQuery(this.el);
		if(!jqEl.attr('disabled')) {
			this.el.focus();
		}
	},
	
	/**
	 * @override
	 */
	refreshControl: function ($super, evt, isForce) {
		if($super(evt, isForce) && this.afterRefreshControl) {
			this.afterRefreshControl(evt);
		}
	}, // end refreshControl

	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			jslet.ui.setEditableStyle(Z.el, fldObj.disabled(), fldObj.readOnly());
		}
		
		if(!metaName || metaName == 'editMask') {
			var editMaskCfg = fldObj.editMask();
			if (editMaskCfg) {
				if(!Z.editMask) {
					Z.editMask = new jslet.ui.EditMask();
					Z.editMask.attach(Z.el);
				}
				mask = editMaskCfg.mask;
				keepChar = editMaskCfg.keepChar;
				transform = editMaskCfg.transform;
				Z.editMask.setMask(mask, keepChar, transform);
			} else {
				if(Z.editMask) {
					Z.editMask.detach();
					Z.editMask = null;
				}
			}
		}
		
		if(metaName == 'message') {
			if(Z._enableInvalidTip) {
				Z.renderInvalid();
			}
		}
		Z.el.maxLength = fldObj.getEditLength();
	},
	
	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._field);
		if(fldObj.message(Z._valueIndex)) { 
			return;
		}
		var align = fldObj.alignment();
	
		if (jslet.locale.isRtl){
			if (align == 'left') {
				align= 'right';
			} else {
				align = 'left';
			}
		}
		Z.el.style.textAlign = align;

		var value;
		if (document.activeElement != Z.el || Z.el.readOnly) {
			value = Z._dataset.getFieldText(Z._field, false, Z._valueIndex);
		} else {
			value = Z._dataset.getFieldText(Z._field, true, Z._valueIndex);
		}
		if (Z.editMask){
			Z.editMask.setValue(value);
		}else {
			Z.el.value = value;
		}
		Z.oldValue = Z.el.value;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}, // end renderAll

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return true;
		}
		var value = Z.el.value;
		Z._dataset.editRecord();
		if (this.editMask && !this.editMask.validateValue()) {
			return false;
		}
		if (Z._beforeUpdateToDataset) {
			if (!Z._beforeUpdateToDataset.call(Z)) {
				return false;
			}
		}

		Z._keep_silence_ = true;
		try {
			if (Z.editMask) {
				value = Z.editMask.getValue();
			}
			Z._dataset.setFieldText(Z._field, value, Z._valueIndex);
		} finally {
			Z._keep_silence_ = false;
		}
		return true;
	}, // end updateToDataset

	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		jQuery(Z.el).off();
		if (Z.editMask){
			Z.editMask.detach();
			Z.editMask = null;
		}
		Z._beforeUpdateToDataset = null;
		Z.onKeyDown = null;
		$super();
	}
});
jslet.ui.register('DBText', jslet.ui.DBText);
jslet.ui.DBText.htmlTemplate = '<input type="text"></input>';

/**
 * DBPassword
 */
jslet.ui.DBPassword = jslet.Class.create(jslet.ui.DBText, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		$super(el, params);
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input' &&
			el.type.toLowerCase() == 'password';
	}
});

jslet.ui.register('DBPassword', jslet.ui.DBPassword);
jslet.ui.DBPassword.htmlTemplate = '<input type="password"></input>';

/**
 * DBTextArea
 */
jslet.ui.DBTextArea = jslet.Class.create(jslet.ui.DBText, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		$super(el, params);
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'textarea';
	}
});

jslet.ui.register('DBTextArea', jslet.ui.DBTextArea);
jslet.ui.DBTextArea.htmlTemplate = '<textarea></textarea>';

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
	currRecno: function($super, currRecno) {
		var result = $super(currRecno);
		if(currRecno !== undefined) {
			this.textCtrl.currRecno(currRecno);
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
    	'<div class="jl-comb-btn-group"><button class="btn btn-default"><i class="fa ' + btnCls + '"></i></button></div>'; 
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
		
		var dbbtn = jqEl.find('button')[0];
		if (this.buttonClick) {
			jQuery(dbbtn).on('click', function(event){
				Z.buttonClick();
			});
		}
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.bind();
	},
	
	popupUp: function(event) {
		if(event.keyCode == jslet.ui.KeyCode.DOWN) {
			var el = jslet.ui.findJsletParent(this.parentNode);
			el.jslet.buttonClick();
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



﻿/* ========================================================================
 * Jslet framework: jslet.dbautocomplete.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBAutoCompleteBox. Example:
 * <pre><code>
 * var jsletParam = {type:"DBAutoCompleteBox",field:"department", matchType:"start"};
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
			Z.allProperties = 'dataset,field,lookupField,minChars,minDelay,displayTemplate,matchMode,beforePopup,onGetFilterField';
		}
		
		Z._lookupField = null;
		
		Z._minChars = 0;

		Z._minDelay = 0;
		
		Z._beforePopup = null;
		
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
		jslet.Checker.test('DBAutoComplete.beforePopup', beforePopup).isFunction();
		this._beforePopup = beforePopup;
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
		jslet.Checker.test('DBAutoComplete.onGetFilterField', onGetFilterField).isFunction();
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
	doBlur: function (event) {
		if (this.disabled || this.readOnly) {
			return;
		}
		var Z = this.jslet,
			fldObj = Z._dataset.getField(Z._field);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		if (Z.contentPanel && Z.contentPanel.isShowing()) {
			window.setTimeout(function(){
				if(Z._isSelecting) {
					return;
				}
				if (Z.contentPanel && Z.contentPanel.isShowing()) {
					Z.contentPanel.closePopup();
				}
				Z.updateToDataset();
				Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
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
		if ((keyCode == 38 || keyCode == 40) && Z.contentPanel && Z.contentPanel.isPop) {
			var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
			lkf = fldObj.lookup(),
			lkds = lkf.dataset();
			if (keyCode == 38) { //up arrow
				lkds.prior();
			}
			if (keyCode == 40) {//down arrow
				lkds.next();
			}
		}

		if (keyCode == 8 || keyCode == 46 || keyCode == 229) {//delete/backspace/ime
			this.jslet._invokePopup();
		}
	},

	/**
	 * @override
	 */
	doKeypress: function (event) {
		if (this.disabled || this.readOnly) {
			return;
		}
		var keyCode = event.keyCode ? event.keyCode : 
			event.which	? event.which: event.charCode;

		if (keyCode != 13 && keyCode != 9) {
			this.jslet._invokePopup();
		} else if (this.jslet.contentPanel) {
			this.jslet.contentPanel.confirmSelect();
		}
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

	_populate: function (inputValue) {
		var Z = this;
		if (Z._minChars > 0 && inputValue && inputValue.length < Z._minChars) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
			lkf = fldObj.lookup();
		if (!lkf) {
			jslet.showError(Z._field + ' is NOT a lookup field!');
			return;
		}

		var lkds = lkf.dataset();
		if (Z._beforePopup) {
			Z._beforePopup.call(Z, lkds, inputValue);
		} else if (inputValue) {
			var fldName;
			if (Z._onGetFilterField) {
				fldName = Z._onGetFilterField.call(Z, lkds, inputValue);
			}
			if (!fldName) {
				fldName = lkf.codeField();
			}
			var s = inputValue;
			if (Z._matchMode == 'start') {
				s = s + '%';
			} else {
				if (Z._matchMode == 'end') {
					s = '%' + s;
				} else {
					s = '%' + s + '%';
				}
			}
			lkds.filter('like([' + fldName + '],"' + s + '")');
			lkds.filtered(true);
		} else {
			lkds.filtered(false);
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
	Z.dlgWidth = 500;
	Z.dlgHeight = 200;

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

		Z.panel.innerHTML = '';

		var cntw = Z.dlgWidth - 4,
			cnth = Z.dlgHeight - 4,
			tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, noborder:true, hasSelectCol: false, hasSeqCol: false, hideHead: true };
		tableparam.onRowClick = Z.confirmSelect;

		Z.otable = jslet.ui.createControl(tableparam, Z.panel, cntw, cnth);
		Z.otable.el.focus();
		Z.otable.el.style.border = "0";
		
		return Z.panel;
	};

	Z.confirmSelect = function () {
		Z.comboCfg._isSelecting = true;
		var fldValue = Z.lkDataset.keyValue();
		if (fldValue) {
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
		Z.lkDataset.filtered(false);
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
﻿/* ========================================================================
 * Jslet framework: jslet.dbbetweenedit.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBBetweenEdit. 
 * It implements "From ... To ..." style editor. This editor usually use in query parameter editor.
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBBetweenEdit","field":"dateFld"};
 *
 * //1. Declaring:
 *  &lt;div data-jslet='jsletParam' />
 *
 *  //2. Binding
 *  &lt;div id="ctrlId"  />
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBBetweenEdit = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'dataset,field';
		$super(el, params);
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
	},

	/**
	 * @override
	 */
	refreshControl: function (evt) {
		return;
	}, // end refreshControl

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		jslet.ui.textMeasurer.setElement(Z.el);
		var lbl = jslet.locale.Dataset.betweenLabel;
		if (!lbl) {
			lbl = '-';
		}
		lbl = '&nbsp;' + lbl + '&nbsp;';
		var w = jslet.ui.textMeasurer.getWidth(lbl);

		var template = ['<table style="width:100%;margin:0px" cellspacing="0" cellpadding="0"><col /><col width="', w,
				'px" /><col /><tbody><tr><td></td><td>', lbl,
				'</td><td></td></tr></tbody></table>'];
		Z.el.innerHTML = template.join('');
		var arrTd = jQuery(Z.el).find('td'),
			minTd = arrTd[0],
			maxTd = arrTd[2],
			fldObj = Z._dataset.getField(Z._field),
			param = fldObj.editControl();

		param.dataset = Z._dataset;
		param.field = Z._field;
		param.valueIndex = 0;
		var tag = jslet.ui.createControl(param, minTd);
		tag.el.style.width = '98%';
		Z.minElement = tag;
		param.valueIndex = 1;
		tag = jslet.ui.createControl(param, maxTd);
		tag.el.style.width = '98%';
	},
	
	focus: function() {
		this.minElement.focus();
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		this.minElement = null;
		$super();
	}
	
});

jslet.ui.register('DBBetweenEdit', jslet.ui.DBBetweenEdit);
jslet.ui.DBBetweenEdit.htmlTemplate = '<div></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dbcheckbox.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBCheckBox. 
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBCheckBox", dataset:"employee", field:"married"};
 * 
 * //1. Declaring:
 * &lt;input type='checkbox' data-jslet='type:"DBCheckBox",dataset:"employee", field:"married"' />
 * or
 * &lt;div data-jslet='jsletParam' />
 *
 *  //2. Binding
 * &lt;input id="ctrlId" type="checkbox" />
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 * 
 * </code></pre>
 */

/**
* DBCheckBox
*/
jslet.ui.DBCheckBox = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.isCheckBox = true;
		Z.allProperties = 'dataset,field,beforeClick';
		Z._beforeClick = null;
		$super(el, params);
	},

	beforeClick: function(beforeClick) {
		if(beforeClick === undefined) {
			return this._beforeClick;
		}
		jslet.Checker.test('DBCheckBox.beforeClick', beforeClick).isFunction();
		this._beforeClick = beforeClick;
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'input' &&
			el.type.toLowerCase() == 'checkbox';
	},

	/**
	 * @override
	 */
	bind: function () {
		var Z = this;

		Z.renderAll();
		var jqEl = jQuery(Z.el);
		jqEl.on('click', Z._doClick);
		jqEl.addClass('checkbox-inline');
	}, // end bind

	_doClick: function (event) {
		var Z = this.jslet;
		if (Z._beforeClick) {
			var result = Z._beforeClick.call(Z, Z.el);
			if (!result) {
				return;
			}
		}
		Z.updateToDataset();
	},
	
	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			jslet.ui.setEditableStyle(Z.el, disabled, disabled);
		}
		if(metaName == 'message') {
			if(Z._enableInvalidTip) {
				Z.renderInvalid();
			}
		}
	},
	
	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		try {
			var value = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
			if (value !== null && value == fldObj.trueValue()) {
				Z.el.checked = true;
			} else {
				Z.el.checked = false;
			}
		} catch (e) {
			jslet.showError(e);
		} // end try
	},
	
	focus: function() {
		this.el.focus();
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}, // end renderAll

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._field),
			value;
		if (Z.el.checked) {
			value = fldObj.trueValue();
		} else {
			value = fldObj.falseValue();
		}
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
		} catch (e) {
			jslet.showError(e);
		} finally {
			Z._keep_silence_ = false;
		}
	}, // end updateToDataset
	
	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
	}
});

jslet.ui.register('DBCheckBox', jslet.ui.DBCheckBox);
jslet.ui.DBCheckBox.htmlTemplate = '<input type="checkbox"></input>';

﻿/* ========================================================================
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
		Z.allProperties = 'dataset,field,columnCount';
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
		this.renderAll();
		var jqEl = jQuery(this.el);
		jqEl.on('click', 'input[type="checkbox"]', function (event) {
			event.delegateTarget.jslet.updateToDataset(this);
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
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled(),
				readOnly = fldObj.readOnly();
			disabled = disabled || readOnly;
			var chkBoxes = jQuery(Z.el).find('input[type="checkbox"]');
			for(var i = 0, cnt = chkBoxes.length; i < cnt; i++){
				jslet.ui.setEditableStyle(chkBoxes[i], disabled, readOnly);
			}
		}
		if(metaName == 'message') {
			Z.renderInvalid();
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
		var fldObj = Z._dataset.getField(Z._field);
		if(fldObj.message(Z._valueIndex)) { 
			return;
		}
		try {
			var checkboxs = jQuery(Z.el).find('input[type="checkbox"]'),
				chkcnt = checkboxs.length, 
				checkbox, i;
			for (i = 0; i < chkcnt; i++) {
				checkbox = checkboxs[i];
				checkbox.checked = false;
			}
			var values = Z._dataset.getFieldValue(Z._field);
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
		} catch (e) {
			jslet.showError(e);
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
			jslet.showError(jslet.formatString(jslet.locale.Dataset.lookupNotFound,
					[fldObj.name()]));
			return;
		}
		if(fldObj.valueStyle() != jslet.data.FieldValueStyle.MULTIPLE) {
			fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
		}
		
		var lkds = lkf.dataset(),
			cnt = lkds.recordCount(),
			context = lkds.startSilenceMove(),
			itemId;
		Z._itemIds = [];
		try {
			var template = ['<table cellpadding="0" cellspacing="0">'],
			isNewRow = false;

			for (var k = 0; k < cnt; k++) {
				lkds.recnoSilence(k);
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
				template.push('" /><label for="');
				template.push(itemId);
				template.push('">');
				template.push(lkf.getCurrentDisplayValue());
				template.push('</label></td>');
				isNewRow = (k % Z._columnCount === 0);
			} // end for
			if (cnt > 0) {
				template.push('</tr>');
			}
			template.push('</table>');
			Z.el.innerHTML = template.join('');
		} finally {
			lkds.endSilenceMove(context);
		}
	}, // end renderOptions

	updateToDataset: function(currCheckBox) {
		var Z = this;
		if (Z._is_silence_) {
			return;
		}
		var fldObj = Z._dataset.getField(Z._field),
			limitCount = fldObj.valueCountLimit();
		
		var values = [], count = 0;
		var allBoxes = jQuery(Z.el).find('input[type="checkbox"]'),chkBox;
		for(var j = 0, allCnt = allBoxes.length; j < allCnt; j++){
			chkBox = allBoxes[j];
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

﻿/* ========================================================================
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
		Z.allProperties = 'dataset,field,textField,searchField,popupHeight,popupWidth,showStyle,textReadOnly,onGetSearchField';
		Z._textField = null;
		
		Z._showStyle = 'auto';
		
		Z._popupWidth = 500;

		Z._popupHeight = 300;
		
		Z._contentPanel = null;
		
		Z._pickupField = null;
		
		$super(el, params);
	},

	/**
	 * Get or set popup panel width.
	 * 
	 * @param popupHeight {Integer} Popup panel width.
	 * @return {Integer or this}
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
		jslet.Checker.test('DBComboSelect.onGetSearchField', onGetSearchField).isFunction();
		this._onGetSearchField = onGetSearchField;
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

	buttonClick: function () {
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
		jslet.ui.PopupPanel.excludedElement = el;
		var r = jqEl.offset(), h = jqEl.outerHeight(), x = r.left, y = r.top + h;
		if (jslet.locale.isRtl){
			x = x + jqEl.outerWidth();
		}
		Z._contentPanel.showPopup(x, y, 0, h);
	},
	
	closePopup: function(){
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
		if (!Z.panel) {
			Z.panel = Z._create();
		} else {
			var ojslet = Z.otree ? Z.otree : Z.otable;
			ojslet.dataset().addLinkedControl(ojslet);
			window.setTimeout(function(){
				ojslet.renderAll();
			}, 1);
		}
		Z.popup.setContent(Z.panel, '100%', '100%');
		Z.popup.show(left, top, Z.popupWidth, Z.popupHeight, ajustX, ajustY);
		jQuery(Z.panel).find(".jl-combopnl-head select").focus();
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

		var template = ['<div class="jl-combopnl-head row"><div class="col-xs-12">',
		                '<input class="form-control" type="text" size="20"></input></div></div>',
			'<div class="jl-combopnl-content',
			Z.isMultiple() ? ' jl-combopnl-multiselect': '',
			'"></div>',
			'<div class="jl-combopnl-footer" style="display:none"><button class="jl-combopnl-footer-cancel btn btn-default" >',
			jslet.locale.MessageBox.cancel,
			'</button><button type="button" class="jl-combopnl-footer-ok btn btn-default" >',
			jslet.locale.MessageBox.ok,
			'</button></div>'];

		Z.panel.innerHTML = template.join('');
		var jqPanel = jQuery(Z.panel),
			jqPh = jqPanel.find('.jl-combopnl-head');
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
			window.setTimeout(function(){
				Z.otree = jslet.ui.createControl(treeparam, contentPanel, '100%', '100%');
			}, 1);
		} else {
			var tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, hasSelectCol: Z.isMultiple(), hasSeqCol: false };
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
		var fldValue = Z.dataset.getFieldValue(Z.field, Z._valueIndex), 
			lkds = Z.lookupDs();

		if (!Z.isMultiple()) {
			if (fldValue) {
				lkds.findByKey(fldValue);
			}
			return;
		}
		var fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup();
		lkds.selectAll(false);
		if(lkfld.onlyLeafLevel()) {
			lkds.onCheckSelectable(function(){
				return !this.hasChildren();
			});
		}
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
		if(Z.comboSelectObj.onGetSearchField) {
			findFldName = Z.comboSelectObj.onGetSearchField(findValue);
		}
		if(!findFldName) {
			var lkFldObj = Z.fieldObject.lookup();
			findFldName = lkFldObj.nameField();
		}
		if(!findFldName) {
			console.warn('Search field NOT specified! Can\'t search data!')
			return;
		}
		var lkds = Z.lookupDs(), 
			fldObj = lkds.getField(findFldName);
		if(!fldObj) {
			console.warn('Field Name: ' + findFldName + ' NOT exist!')
			return;
		}
		lkds.find('like([' + findFldName + '],"%' + findValue + '%")');
	},

	_confirmSelect: function () {
		var Z = this;
		var fldValue = Z.dataset.getFieldValue(Z.field, Z._valueIndex),
			fldObj = Z.dataset.getField(Z.field),
			lkfld = fldObj.lookup(),
			isMulti = Z.isMultiple(),
			lookupDs = Z.lookupDs();

		if (isMulti) {
			fldValue = lookupDs.selectedKeyValues();
		} else {
			fldValue = lookupDs.keyValue();
		}

		if (fldValue) {
			Z.dataset.setFieldValue(Z.field, fldValue, Z._valueIndex);
		}
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
﻿/* ========================================================================
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
			content = fldObj.label();
			if (fldObj.required()) {
				content += '<span class="jl-lbl-required">' + 
					jslet.ui.DBLabel.REQUIREDCHAR + '<span>';
			}
			Z.el.innerHTML = content || '';
			return;
		}
		if(subType && subType == 'tip' && 
			(!metaName || metaName == subType)) {
			content = fldObj.tip();
			Z.el.innerHTML = content || '';
			return;
		}
		if(subType  && subType == 'message' && 
			(metaName && metaName == subType)) {
			content = fldObj.message();
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
		if(subType == 'message') {
			if(!jqEl.hasClass('jl-lbl-message')) {
				jqEl.addClass('jl-lbl-message');
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
jslet.ui.DBLabel.METANAMES = ['label', 'required', 'tip', 'message'];
jslet.ui.register('DBLabel', jslet.ui.DBLabel);
jslet.ui.DBLabel.htmlTemplate = '<label></label>';

﻿/* ========================================================================
 * Jslet framework: jslet.dbdatalabel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBDataLabel. 
 * Show field value in a html label. 
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBDataLabel",dataset:"employee",field:"department"};
 * 
 * //1. Declaring:
 * &lt;label data-jslet='type:"DBDataLabel",dataset:"employee",field:"department"' />
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
jslet.ui.DBDataLabel = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'dataset,field';
		$super(el, params);
	},

	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('form-control-static jl-datalabel');//Bootstrap class
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'label';
	},

	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		var text = Z._dataset.getFieldText(Z._field, Z._valueIndex);
		Z.el.innerHTML = text;
		Z.el.title = text;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}
});

jslet.ui.register('DBDataLabel', jslet.ui.DBDataLabel);
jslet.ui.DBDataLabel.htmlTemplate = '<label></label>';

﻿/* ========================================================================
 * Jslet framework: jslet.dbdatepicker.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBDatePicker. Example:
 * <pre><code>
 * var jsletParam = {type:"DBDatePicker",dataset:"employee",field:"birthday", textReadOnly:true};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBDatePicker",dataset:"employee",field:"birthday", textReadOnly:true' />
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
jslet.ui.DBDatePicker = jslet.Class.create(jslet.ui.DBCustomComboBox, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,textReadOnly,popupWidth, popupHeight';
		
		/**
		 * {Integer} Popup panel width
		 */
		Z._popupWidth = 260;

		/**
		 * {Integer} Popup panel height
		 */
		Z._popupHeight = 226;

		Z.popup = new jslet.ui.PopupPanel();
		
		Z.popup.onHidePopup = function() {
			Z.focus();
		};
		
		Z.comboButtonCls = 'fa-calendar';

		$super(el, params);
	},

	popupHeight: function(popupHeight) {
		if(popupHeight === undefined) {
			return this._popupHeight;
		}
		jslet.Checker.test('DBDatePicker.popupHeight', popupHeight).isGTEZero();
		this._popupHeight = parseInt(popupHeight);
	},

	popupWidth: function(popupWidth) {
		if(popupWidth === undefined) {
			return this._popupWidth;
		}
		jslet.Checker.test('DBDatePicker.popupWidth', popupWidth).isGTEZero();
		this._popupWidth = parseInt(popupWidth);
	},
		
	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return true;
	},

	buttonClick: function () {
		var el = this.el, 
			Z = this, 
			fldObj = Z._dataset.getField(Z._field),
			jqEl = jQuery(el);
		if (fldObj.readOnly() || fldObj.disabled()) {
			return;
		}
		var width = Z._popupWidth,
			height = Z._popupHeight,
			dateValue = Z._dataset.getFieldValue(Z._field, Z._valueIndex),
			range = fldObj.dataRange(),
			minDate = null,
			maxDate = null;
		
		if (range){
			if (range.min) {
				minDate = range.min;
			}
			if (range.max) {
				maxDate = range.max;
			}
		}
		if (!Z.contentPanel)
			Z.contentPanel = jslet.ui.createControl({ type: 'Calendar', value: dateValue, minDate: minDate, maxDate: maxDate,
				onDateSelected: function (date) {
					Z.popup.hide();
					Z.el.focus();
					var value = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
					if(!value) {
						value = date;
					} else {
						value.setFullYear(date.getFullYear());
						value.setMonth(date.getMonth());
						value.setDate(date.getDate());
					}
					Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
				}
			}, null, width + 'px', height + 'px');

		jslet.ui.PopupPanel.excludedElement = el;//event.element();
		var r = jqEl.offset(), 
			h = jqEl.outerHeight(), 
			x = r.left, y = r.top + h;
		if (jslet.locale.isRtl){
			x = x + jqEl.outerWidth();
		}
		Z.popup.setContent(Z.contentPanel.el, '100%', '100%');
		Z.contentPanel.el.style.display = 'block';
		Z.contentPanel.setValue(dateValue);
		Z.popup.show(x, y, width + 3, height + 3, 0, h);
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		if(Z.contentPanel) {
			Z.contentPanel.destroy();
			Z.contentPanel = null;
		}
		Z.popup.destroy();
		Z.popup = null;
		$super();
	}
	
});

jslet.ui.register('DBDatePicker', jslet.ui.DBDatePicker);
jslet.ui.DBDatePicker.htmlTemplate = '<div></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dbtimepicker.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBTimePicker is used for time inputting. Example:
 * <pre><code>
 * var jsletParam = {type:"DBTimePicker",field:"time"};
 * //1. Declaring:
 *  &lt;input id="ctrlId" type="text" data-jslet='jsletParam' />
 *  or
 *  &lt;input id="ctrlId" type="text" data-jslet='{type:"DBTimePicker",field:"time"}' />
 *  
 *  //2. Binding
 *  &lt;input id="ctrlId" type="text" data-jslet='jsletParam' />
 *  //Js snippet
 *  var el = document.getElementById('ctrlId');
 *  jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *  jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBTimePicker = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,is12Hour,hasSecond';
		Z._is12Hour = false;
		Z._hasSecond = false;
		$super(el, params);
	},

	is12Hour: function(is12Hour) {
		if(is12Hour === undefined) {
			return this._is12Hour;
		}
		this._is12Hour = is12Hour? true: false;
	},

	hasSecond: function(hasSecond) {
		if(hasSecond === undefined) {
			return this._hasSecond;
		}
		this._hasSecond = hasSecond? true: false;
	},

	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		var tagName = el.tagName.toLowerCase();
		return tagName == 'div' || tagName == 'span';
	},

	/**
	 * @override
	 */
	bind: function () {
		var Z = this,
			jqEl = jQuery(Z.el);
		if(!jqEl.hasClass('jl-timepicker')) {
			jqEl.addClass('form-control jl-timepicker');
		}
		Z.renderAll();
		jqEl.on('change', 'select', function(event){
			Z.updateToDataset();
		});
	}, // end bind

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this,
			jqEl = jQuery(Z.el),
			fldObj = Z._dataset.getField(Z._field),
			range = fldObj.dataRange(),
			minTimePart = {hour: 0, minute: 0, second: 0},
			maxTimePart = {hour: 23, minute: 59, second: 59};
		
		if(range) {
			if(range.min) {
				minTimePart = Z._splitTime(range.min);
			}
			if(range.max) {
				maxTimePart = Z._splitTime(range.max);
			}
		}
		var	tmpl = [];
		
		tmpl.push('<select class="jl-time-hour">');
		if(Z._is12Hour) {
			var minHour = minTimePart.hour;
			var maxHour = maxTimePart.hour;
			var min = 100, max = 0, hour;
			for(var k = minHour; k < maxHour; k++) {
				hour = k;
				if( k > 11) {
					hour = k - 12;
				}
				min = Math.min(min, hour);
				max = Math.max(max, hour);
			}
			tmpl.push(Z._getOptions(min, max));
		} else {
			tmpl.push(Z._getOptions(minTimePart.hour, maxTimePart.hour || 23));
		}
		tmpl.push('</select>');
		
		tmpl.push('<select class="jl-time-minute">');
		tmpl.push(Z._getOptions(0, 59));
		tmpl.push('</select>');
		
		if(Z._hasSecond) {
			tmpl.push('<select class="jl-time-second">');
			tmpl.push(Z._getOptions(0, 59));
			tmpl.push('</select>');
		}
		
		if(Z._is12Hour) {
			tmpl.push('<select class="jl-time-ampm"><option value="am">AM</option><option value="pm">PM</option></select>');
		}
		jqEl.html(tmpl.join(''));
		Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}, // end renderAll

	_getOptions: function(begin, end) {
		var result = [], value;
		for(var i = begin; i <= end; i++) {
			if( i < 10) {
				value = '0' + i;
			} else {
				value = '' + i;
			}
			result.push('<option value="');
			result.push(i);
			result.push('">');
			result.push(value);
			result.push('</option>');
		}
		return result.join('');
	},
	
	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName){
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled() || fldObj.readOnly();
			var items = jQuery(Z.el).find("select"), item;
			for(var i = 0, cnt = items.length; i < cnt; i++){
				item = items[i];
				item.disabled = disabled;
				jslet.ui.setEditableStyle(item, disabled, disabled, true);
			}
		}
		if(metaName == 'message') {
			Z.renderInvalid();
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
		var fldObj = Z._dataset.getField(Z._field);
		if(fldObj.message(Z._valueIndex)) { 
			return;
		}
		var value = Z._dataset.getFieldValue(Z._field, Z._valueIndex),
			timePart = Z._splitTime(value),
			hour = timePart.hour,
			jqEl = jQuery(Z.el),
			jqHour = jqEl.find('.jl-time-hour'),
			jqMinute = jqEl.find('.jl-time-minute');
		
		if(Z._is12Hour) {
			jqAmPm = jqEl.find('.jl-time-ampm');
			jqAmPm.prop('selectedIndex', hour < 12 ? 0: 1);
			if(hour > 11) {
				hour -= 12;
			}
		}
		jqHour.val(hour);
		jqMinute.val(timePart.minute);
		if(Z._hasSecond) {
			jqMinute = jqEl.find('.jl-time-second');
			jqMinute.val(timePart.second);
		}
	},
	 
	_splitTime: function(value) {
		var	hour = 0,
			minute = 0,
			second = 0;
		if(value) {
			if(jslet.isDate(value)) {
				hour = value.getHours();
				minute = value.getMinutes();
				second = value.getSeconds();
			} else if(jslet.isString(value)) {
				var parts = value.split(":");
				hour = parseInt(parts[0]);
				if(parts.length > 1) {
					minute = parseInt(parts[1]);
				}
				if(parts.length > 2) {
					second = parseInt(parts[2]);
				}
			}
		}
		return {hour: hour, minute: minute, second: second};
	},
	
	_prefix: function(value) {
		if(parseInt(value) < 10) {
			return '0' + value;
		}
		return value;
	},
	
	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return true;
		}

		Z._keep_silence_ = true;
		try {
			var jqEl = jQuery(Z.el),
				fldObj = Z._dataset.getField(Z._field),
				value = null, hour;
			if(fldObj.getType() != jslet.data.DataType.DATE) {
				value = [];
				if(Z._is12Hour && jqEl.find('.jl-time-ampm').prop("selectedIndex") > 0) {
					hour = parseInt(jqEl.find('.jl-time-hour').val()) + 12;
					value.push(hour);
				} else {
					value.push(Z._prefix(jqEl.find('.jl-time-hour').val()));
				}
				value.push(':');
				value.push(Z._prefix(jqEl.find('.jl-time-minute').val()));
				if(Z._hasSecond) {
					value.push(':');
					value.push(Z._prefix(jqEl.find('.jl-time-second').val()));
				}
				value = value.join('');
			} else {
				value = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
				if(!value) {
					value = new Date();
				}
				hour = parseInt(jqEl.find('.jl-time-hour').val());
				if(Z._is12Hour && jqEl.find('.jl-time-ampm').prop("selectedIndex") > 0) {
					hour += 12;
				}
				var minute = parseInt(jqEl.find('.jl-time-minute').val());
				var second = 0;
				if(Z._hasSecond) {
					second = parseInt(jqEl.find('.jl-time-second').val());
				}
				
				value.setHours(hour);
				value.setMinutes(minute);
				value.setSeconds(second);
			}
			Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
		} finally {
			Z._keep_silence_ = false;
		}
		return true;
	}, // end updateToDataset

	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
		$super();
	}
});
jslet.ui.register('DBTimePicker', jslet.ui.DBTimePicker);
jslet.ui.DBTimePicker.htmlTemplate = '<div></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dblookuplabel.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBLookupLabel. 
 * Display field value according to another field and its value.
 * Example:
 * <pre><code>
 * 		var jsletParam = {type:"DBLookupLabel",dataset:"department",lookupField:"deptcode", lookupValue: '0101', returnField: 'name'};
 * 
 * //1. Declaring:
 *	  &lt;label data-jslet='{type:"DBLookupLabel",dataset:"department",lookupField:"deptcode", lookupValue: "0101", returnField: "name"}' />
 *	  or
 *	  &lt;label data-jslet='jsletParam' />
 *	  
 *  //2. Binding
 *	  &lt;label id="ctrlId"  />
 *  	//Js snippet
 * 		var el = document.getElementById('ctrlId');
 *  	jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *  	jslet.ui.createControl(jsletParam, document.body);
 *  	
 * </code></pre>
 */
jslet.ui.DBLookupLabel = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,lookupField,returnField,lookupValue';
		Z.requiredProperties = 'lookupValue,lookupField,returnField';

		/**
		 * {String} Lookup field name.
		 */
		Z.lookupField;
		/**
		 * {String} Lookup field value.
		 */
		Z.lookupValue;
		/**
		 * {String} Return field name.
		 */
		Z.returnField;
		$super(el, params);
	},

	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('form-control');
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
	refreshControl: function (evt, isForce) {
		if (evt.eventType != jslet.data.RefreshEvent.UPDATEALL) {
			return;
		}
		if (!isForce && !Z.isActiveRecord()) {
			return;
		}
		var Z = this;
		var result = Z.dataset.lookup(Z.lookupField, Z.lookupValue,
				Z.returnField);
		if (result == null) {
			result = 'NOT found: ' + Z.lookupValue;
		}
		Z.el.innerHTML = result;
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent, true);
	}
});
jslet.ui.register('DBLookupLabel', jslet.ui.DBLookupLabel);
jslet.ui.DBLookupLabel.htmlTemplate = '<label></label>';

﻿/* ========================================================================
 * Jslet framework: jslet.dbimage.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBImage. 
 * Display an image which store in database or which's path store in database. 
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBImage",dataset:"employee",field:"photo"};
 * 
 * //1. Declaring:
 * &lt;img data-jslet='{type:"DBImage",dataset:"employee",field:"photo"}' />
 * or
 * &lt;img data-jslet='jsletParam' />
 *
 *  //2. Binding
 * &lt;img id="ctrlId"  />
 * //Js snippet
 * var el = document.getElementById('ctrlId');
 * jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 * jslet.ui.createControl(jsletParam, document.body);
 *
 * </code></pre>
 */
jslet.ui.DBImage = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,locked,baseUrl,altField';
		/**
		 * Stop refreshing image when move dataset's cursor.
		 */
		Z._locked = false;
		/**
		 * {String} The base url
		 */
		Z._baseUrl = null;
		
		Z._altField = null;
		$super(el, params);
	},

	baseUrl: function(baseUrl) {
		if(baseUrl === undefined) {
			return this._baseUrl;
		}
		baseUrl = jQuery.trim(baseUrl);
		jslet.Checker.test('DBImage.baseUrl', baseUrl).isString();
		this._baseUrl = baseUrl;
	},
   
	altField: function(altField) {
		if(altField === undefined) {
			return this._altField;
		}
		altField = jQuery.trim(altField);
		jslet.Checker.test('DBImage.altField', altField).isString();
		this._altField = altField;
	},
   
	locked: function(locked) {
		if(locked === undefined) {
			return this._locked;
		}
		this._locked = locked;
	},
   
	/**
	 * @override
	 */
	isValidTemplateTag: function (el) {
		return el.tagName.toLowerCase() == 'img';
	},

	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('img-responsive img-rounded')
		
	}, // end bind

	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if (Z._locked) {
			Z.el.alt = jslet.locale.DBImage.lockedImageTips;
			Z.el.src = '';
			return;
		}
		try {
			var srcURL = Z._dataset.getFieldValue(Z._field);
			if (!srcURL) {
				srcURL = '';
			} else {
				if (Z._baseUrl) {
					srcURL = Z._baseUrl + srcURL;
				}
			}
			if (Z.el.src != srcURL) {
				var altText = srcURL;
				if(Z._altField) {
					altText = Z._dataset.getFieldText(Z._altField);
				}
				Z.el.alt = altText;
				Z.el.src = srcURL;
			}
		} catch (e) {
			jslet.showError(e);
		}
	},

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}
});

jslet.ui.register('DBImage', jslet.ui.DBImage);
jslet.ui.DBImage.htmlTemplate = '<img></img>';
﻿/* ========================================================================
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
		if(Z.el.multiple) {
			jqEl.on('click', 'option', Z._doCheckLimitCount);
		}
		jqEl.addClass('form-control');//Bootstrap class
	}, // end bind

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
					jslet.showError(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
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
			oldRecno = lkds.recno(),
			groupIsLookup = false,
			groupLookup, groupFldObj, extraIndex;

		try {
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
			var preGroupValue, groupValue, groupDisplayValue, content = [];

			if (!Z.el.multiple && !fldObj.required()){
				content.push('<option value="_null_">');
				content.push(fldObj.nullText());
				content.push('</option>');
			}
			for (var i = 0, cnt = lkds.recordCount(); i < cnt; i++) {
				lkds.recnoSilence(i);
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
				content.push(lkds.getFieldValue(lkf.keyField()));
				content.push('">');
				content.push(lkf.getCurrentDisplayValue());
				content.push('</option>');
			} // end while
			if (preGroupValue !== null) {
				content.push('</optgroup>');
			}
			jQuery(Z.el).html(content.join(''));
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
			jslet.ui.setEditableStyle(Z.el, disabled, disabled, true);
		}
		if(metaName == 'message') {
			Z.renderInvalid();
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
		var fldObj = Z._dataset.getField(Z._field);
		if(fldObj.message(Z._valueIndex)) { 
			return;
		}
		try {
			var optCnt = Z.el.options.length, 
				opt, i;
			for (i = 0; i < optCnt; i++) {
				opt = Z.el.options[i];
				if (opt) {
					opt.selected = false;
				}
			}
			
			if (!Z.el.multiple) {
				var value = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
				if (value === null){
					if (!fldObj.required()) {
						value = '_null_';
					}
				}
				Z.el.value = value;
			} else {
				var arrValue = Z._dataset.getFieldValue(Z._field);
				if(arrValue === null || arrValue.length === 0) {
					return;
				}
					
				var vcnt = arrValue.length - 1, selected;
				Z._keep_silence_ = true;
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
					Z._keep_silence_ = false;
				}
			}
		} catch (e) {
			jslet.showError(e);
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
	}, // end renderAll

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
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

		Z._keep_silence_ = true;
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
			
		} catch (e) {
			jslet.showError(e);
		} finally {
			Z._keep_silence_ = false;
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
﻿/* ========================================================================
 * Jslet framework: jslet.dbradiogroup.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBRadioGroup. 
 * Display a group of radio that user can select one option. Example:
 * <pre><code>
 * var jsletParam = {type:"DBRadioGroup",dataset:"employee",field:"department"};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBRadioGroup",dataset:"employee",field:"department"'' />
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
jslet.ui.DBRadioGroup = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,columnCount';
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
		jslet.Checker.test('DBRadioGroup.columnCount', columnCount).isGTEZero();
		this._columnCount = parseInt(columnCount);
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
		this.renderAll();
		var jqEl = jQuery(this.el);
		jqEl.on('click', 'input[type="radio"]', function(event){
			event.delegateTarget.jslet.updateToDataset(this);
		});
		jqEl.addClass('form-control');//Bootstrap class
		jqEl.css('height', 'auto');
	},

	/**
	 * @override
	 */
	doMetaChanged: function($super, metaName) {
		$super(metaName);
		var Z = this,
			fldObj = Z._dataset.getField(Z._field);
		if(!metaName || metaName == "disabled" || metaName == "readOnly") {
			var disabled = fldObj.disabled(),
				readOnly = fldObj.readOnly();
		
			Z.disabled = disabled || readOnly;
			disabled = Z.disabled;
			var radios = jQuery(Z.el).find('input[type="radio"]');
			for(var i = 0, cnt = radios.length; i < cnt; i++){
				jslet.ui.setEditableStyle(radios[i], disabled, readOnly);
			}
		}
		if(metaName == 'message') {
			Z.renderInvalid();
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
		var fldObj = Z._dataset.getField(Z._field);
		if(fldObj.message(Z._valueIndex)) { 
			return;
		}
		try {
			var value = Z._dataset.getFieldValue(Z._field),
				radios = jQuery(Z.el).find('input[type="radio"]'), 
				radio;
			for(var i = 0, cnt = radios.length; i < cnt; i++){
				radio = radios[i];
				radio.checked = (value == jQuery(radio.parentNode).attr('value'));
			}
		} catch (e) {
			jslet.showError(e);
		}
	},
	
	/**
	 * @override
	 */
	doLookupChanged: function () {
		var Z = this;
		var fldObj = Z._dataset.getField(Z._field), lkf = fldObj.lookup();
		if (!lkf) {
			jslet.showError(jslet.formatString(jslet.locale.Dataset.lookupNotFound,
					[fldObj.name()]));
			return;
		}
		var lkds = lkf.dataset();
		var oldRecno = lkds.recno();
		try {
			var template = ['<table cellpadding="0" cellspacing="0">'],
				isNewRow = false, 
				cnt = lkds.recordCount(),
				itemId;
			Z._itemIds = [];
			for (var k = 0; k < cnt; k++) {
				lkds.recnoSilence(k);
				isNewRow = (k % Z._columnCount === 0);
				if (isNewRow) {
					if (k > 0) {
						template.push('</tr>');
					}
					template.push('<tr>');
				}
				itemId = jslet.nextId();
				Z._itemIds.push(itemId);
				template.push('<td style="white-space: nowrap" value="');
				template.push(lkds.getFieldValue(lkf.keyField()));
				template.push('"><input name="');
				template.push(Z._field);
				template.push('" type="radio"  id="');
				template.push(itemId);
				template.push('" /><label for="');
				template.push(itemId);
				template.push('">');
				template.push(lkf.getCurrentDisplayValue());
				template.push('</label></td>');
			} // end while
			if (cnt > 0) {
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
		if (Z._keep_silence_ || Z.disabled) {
			return;
		}
		Z._keep_silence_ = true;
		try {
			Z._dataset.setFieldValue(Z._field, jQuery(currCheckBox.parentNode).attr('value'));
			currCheckBox.checked = true;
		} catch (e) {
			jslet.showError(e);
		} finally {
			Z._keep_silence_ = false;
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
		if(!jqEl.hasClass("jl-radiogroup")) {
			jqEl.addClass("jl-radiogroup");
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

jslet.ui.register('DBRadioGroup', jslet.ui.DBRadioGroup);
jslet.ui.DBRadioGroup.htmlTemplate = '<div></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dbrangeselect.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBRangeSelect. 
 * Display a select which options produce with 'beginItem' and 'endItem'. Example:
 * <pre><code>
 * var jsletParam = {type:"DBRangeSelect",dataset:"employee",field:"age",beginItem:10,endItem:100,step:5};
 * 
 * //1. Declaring:
 * &lt;select data-jslet='type:"DBRangeSelect",dataset:"employee",field:"age",beginItem:10,endItem:100,step:5' />
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
jslet.ui.DBRangeSelect = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,field,beginItem,endItem,step';
		if (!Z.requiredProperties) {
			Z.requiredProperties = 'field,beginItem,endItem,step';
		}

		/**
		 * {Integer} Begin item 
		 */
		Z._beginItem = 0;
		/**
		 * {Integer} End item
		 */
		Z._endItem = 10;
		/**
		 * {Integer} Step
		 */
		Z._step = 1;
		$super(el, params);
	},

	beginItem: function(beginItem) {
		if(beginItem === undefined) {
			return this._beginItem;
		}
		jslet.Checker.test('DBRangeSelect.beginItem', beginItem).isNumber();
		this._beginItem = parseInt(beginItem);
	},

	endItem: function(endItem) {
		if(endItem === undefined) {
			return this._endItem;
		}
		jslet.Checker.test('DBRangeSelect.endItem', endItem).isNumber();
		this._endItem = parseInt(endItem);
	},

	step: function(step) {
		if(step === undefined) {
			return this._step;
		}
		jslet.Checker.test('DBRangeSelect.step', step).isNumber();
		this._step = parseInt(step);
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
		jqEl.on('change', Z._doChanged);// end observe
		if(Z.el.multiple) {
			jqEl.on('click', 'option', function () {
				Z._currOption = this;
			});// end observe
		}
		jqEl.addClass('form-control');//Bootstrap class
	}, // end bind

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
					jslet.showError(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
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
		
	renderOptions: function () {
		var Z = this,
			arrhtm = [];
		
		var fldObj = Z._dataset.getField(Z._field);
		if (!fldObj.required()){
			arrhtm.push('<option value="_null_">');
			arrhtm.push(fldObj.nullText());
			arrhtm.push('</option>');
		}

		for (var i = Z._beginItem; i <= Z._endItem; i += Z._step) {
			arrhtm.push('<option value="');
			arrhtm.push(i);
			arrhtm.push('">');
			arrhtm.push(i);
			arrhtm.push('</option>');
		}
		jQuery(Z.el).html(arrhtm.join(''));
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
			jslet.ui.setEditableStyle(Z.el, disabled, disabled, true);
		}
		if(metaName == 'message') {
			Z.renderInvalid();
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
		var fldObj = Z._dataset.getField(Z._field);
		if(fldObj.message(Z._valueIndex)) { 
			return;
		}
		try {
			if (!Z.el.multiple) {
				var value = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
				if (value !== null) {
					Z.el.value = value;
				} else {
					Z.el.value = null;
				}
			} else {
				var arrValue = Z._dataset.getFieldValue(Z._field),
					optCnt = Z.el.options.length, opt, selected, i;
				Z._keep_silence_ = true;
				try {
					for (i = 0; i < optCnt; i++) {
						opt = Z.el.options[i];
						if (opt) {
							opt.selected = false;
						}
					}

					var vcnt = arrValue.length - 1;
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
					Z._keep_silence_ = false;
				}
			}
		} catch (e) {
			jslet.showError(e);
		}
	},
	
	focus: function() {
		this.el.focus();
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.renderOptions();
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	},

	updateToDataset: function () {
		var Z = this;
		if (Z._keep_silence_) {
			return;
		}
		var value,
			isMulti = Z.el.multiple;
		if (!isMulti) {
			value = Z.el.value;
			var fldObj = Z._dataset.getField(Z._field);
			if (value == '_null_' && !fldObj.required()) {
				value = null;
			}
		} else {
			var opts = jQuery(Z.el).find('option'),
				optCnt = opts.length - 1;
			value = [];
			for (var i = 0; i <= optCnt; i++) {
				opt = opts[i];
				if (opt.selected) {
					value.push(opt.value);
				}
			}
		}
		Z._keep_silence_ = true;
		try {
			if (!isMulti) {
				Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
			} else {
				Z._dataset.setFieldValue(Z._field, value);
			}
		} catch (e) {
			jslet.showError(e);
		} finally {
			Z._keep_silence_ = false;
		}
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		jQuery(this.el).off();
		$super();
	}
});

jslet.ui.register('DBRangeSelect', jslet.ui.DBRangeSelect);
jslet.ui.DBRangeSelect.htmlTemplate = '<select></select>';
﻿/* ========================================================================
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
jslet.ui.DBSpinEdit = jslet.Class.create(jslet.ui.DBText, {
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
			jqEl.attr('role', 'spinbutton');
		}
		Z._createControl();
		Z.renderAll();
	}, // end bind

	_createControl: function() {
		var Z = this,
			jqEl = jQuery(Z.el),
			s = '<input type="text" class="form-control">' + 
		    	'<div class="jl-spinedit-btn-group">' +
		    	'<button class="btn btn-default jl-spinedit-up"><i class="fa fa-caret-up"></i></button>' + 
		    	'<button class="btn btn-default jl-spinedit-down"><i class="fa fa-caret-down"></i></button>';
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
		
		jQuery(downButton).on('click', function () {
			Z.decValue();
		});
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
		} catch (e) {
			jslet.showError(e);
		} finally {
			Z.silence = false;
		}
	}, // end setValueToDataset

	incValue: function () {
		var Z = this,
			val = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
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
			val = Z._dataset.getFieldValue(Z._field, Z._valueIndex);
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

﻿/* ========================================================================
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
		if(metaName == 'message') {
			Z.renderInvalid();
		}
	},
	
	/**
	 * @override
	 */
	doValueChanged: function() {
		var Z = this;
		try {
			var fldObj = Z._dataset.getField(Z._field),
				value = Z._dataset.getFieldValue(Z._field, Z._valueIndex),
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
		} catch (e) {
			jslet.showError(e);
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
﻿/* ========================================================================
 * Jslet framework: jslet.dbhtml.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBHtml. 
 * Display html text from one field. 
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBHtml",dataset:"employee",field:"comment"};
 * 
 * //1. Declaring:
 * &lt;div data-jslet='type:"DBHtml",dataset:"employee",field:"comment"' />
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
jslet.ui.DBHtml = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'dataset,field';
		$super(el, params);
	},

	/**
	 * @override
	 */
	bind: function () {
		this.renderAll();
		jQuery(this.el).addClass('form-control');
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
	doValueChanged: function() {
		var content = this._dataset.getFieldText(this._field);
		this.el.innerHTML = content;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
	}
});

jslet.ui.register('DBHtml', jslet.ui.DBHtml);
jslet.ui.DBHtml.htmlTemplate = '<div style="width:200px;height:200px"></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dbpagebar.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBPageBar. 
 * Functions:
 * 1. First page, Prior Page, Next Page, Last Page;
 * 2. Can go to specified page;
 * 3. Can specify page size on runtime;
 * 4. Need not write any code;
 * 
 * Example:
 * <pre><code>
 *  var jsletParam = {type:"DBPageBar",dataset:"bom",pageSizeList:[20,50,100,200]};
 *  
 * //1. Declaring:
 *  &lt;div data-jslet='type:"DBPageBar",dataset:"bom",pageSizeList:[20,50,100,200]' />
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
jslet.ui.DBPageBar = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		var Z = this;
		Z.allProperties = 'dataset,showPageSize,showGotoButton,pageSizeList';
		/**
		 * {Boolean} Identify if the "Page Size" part shows or not
		 */
		Z._showPageSize = true;
		/**
		 * {Boolean} Identify if the "GoTo" part shows or not
		 */
		Z._showGotoButton = true;
		
		/**
		 * {Integer[]) Array of integer, like: [50,100,200]
		 */
		Z._pageSizeList = [100, 200, 500];

		$super(el, params);
	},

	showPageSize: function(showPageSize) {
		if(showPageSize === undefined) {
			return this._showPageSize;
		}
		this._showPageSize = showPageSize ? true: false;
	},
	
	showGotoButton: function(showGotoButton) {
		if(showGotoButton === undefined) {
			return this._showGotoButton;
		}
		this._showGotoButton = showGotoButton ? true: false;
	},
	
	pageSizeList: function(pageSizeList) {
		if(pageSizeList === undefined) {
			return this._pageSizeList;
		}
		jslet.Checker.test('DBPageBar.pageSizeList', pageSizeList).isArray();
		var size;
		for(var i = 0, len = pageSizeList.length; i < len; i++) {
			size = pageSizeList[i];
			jslet.Checker.test('DBPageBar.pageSizeList', size).isGTZero();
		}
		this._pageSizeList = pageSizeList;
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
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-pagebar')) {
			jqEl.addClass('jl-pagebar');
		}
		var template = ['<select class="jl-pb-item"></select><label class="jl-pb-item jl-pb-label">', jslet.locale.DBPageBar.pageSizeLabel,
						'</label><a class="jl-pb-item jl-pb-button jl-pb-first" href="javascript:;"></a><a class="jl-pb-item jl-pb-button jl-pb-prior" href="javascript:;"></a><label class="jl-pb-item jl-pb-label">',
						jslet.locale.DBPageBar.pageNumLabel,
						'</label><input class="jl-pb-item jl-pb-pagenum" value="1" size="2" ></input><a class="jl-pb-item jl-pb-button jl-pb-goto" href="javascript:;"></a><label class="jl-pb-item jl-pb-label">',
						jslet.formatString(jslet.locale.DBPageBar.pageCountLabel, [0]),
						'</label><a class="jl-pb-item jl-pb-button jl-pb-next" href="javascript:;"></a><a class="jl-pb-item jl-pb-button jl-pb-last" href="javascript:;"></a></div>'
						];
		jqEl.html(template.join(''));

		var oPageSize = Z.el.childNodes[0];
		if (Z._showPageSize) {
			var rows = Z._pageSizeList;
			var cnt = rows.length, s = '';
			for (var i = 0; i < cnt; i++) {
				s += '<option value=' + rows[i] + '>' + rows[i] + '</option>';
			}

			oPageSize.innerHTML = s;
			Z._dataset.pageSize(parseInt(oPageSize.value));
		}

		jQuery(oPageSize).on('change', function (event) {
			var ds = this.parentElement.jslet.dataset();
			ds.pageNo(1);
			ds.pageSize(parseInt(this.value));
			ds.requery();
		});

		Z._firstBtn = Z.el.childNodes[2];
		Z._priorBtn = Z.el.childNodes[3];

		Z._pageNoTxt = Z.el.childNodes[5];
		Z._gotoBtn = Z.el.childNodes[6];

		Z._pageCountLbl = Z.el.childNodes[7];

		Z._nextBtn = Z.el.childNodes[8];
		Z._lastBtn = Z.el.childNodes[9];

		jQuery(Z._firstBtn).on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var ds = this.parentElement.jslet.dataset();
			ds.pageNo(1);
			ds.requery();
		});

		jQuery(Z._priorBtn).on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var ds = this.parentElement.jslet.dataset(),
				num = ds.pageNo();
			if (num == 1) {
				return;
			}
			ds.pageNo(num - 1);
			ds.requery();
		});

		jQuery(Z._gotoBtn).on('click', function (event) {
			var oJslet = this.parentElement.jslet;
			var ds = oJslet.dataset();
			var num = parseInt(oJslet._pageNoTxt.value);
			if (num < 1) {
				num = 1;
			}
			if (num > ds.pageCount()) {
				num = ds.pageCount();
			}
			ds.pageNo(num);
			ds.requery();
		});

		jQuery(Z._nextBtn).on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var oJslet = this.parentElement.jslet,
				ds = oJslet.dataset(),
				num = ds.pageNo();
			if (num >= ds.pageCount()) {
				return;
			}
			ds.pageNo(++num);
			ds.requery();
		});

		jQuery(Z._lastBtn).on('click', function (event) {
			if(this.disabled) {
				return;
			}
			var oJslet = this.parentElement.jslet,
				ds = oJslet.dataset();

			if (ds.pageCount() < 1) {
				return;
			}
			ds.pageNo(ds.pageCount());
			ds.requery();
		});

		jQuery(Z._pageNoTxt).on('keypress', function (event) {
			event = jQuery.event.fix( event || window.event );
			var keyCode = event.which;

			var validChars = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
			if (validChars.indexOf(String.fromCharCode(keyCode)) < 0) {
				event.preventDefault();
			}
		});

		Z.renderAll();
	},

	/**
	 * @override
	 */
	refreshControl: function (evt) {
		if (evt && evt.eventType != jslet.data.RefreshEvent.CHANGEPAGE) {
			return;
		}
		var Z = this,
			num = Z._dataset.pageNo(), 
			count = Z._dataset.pageCount();
		Z._pageNoTxt.value = num;
		Z._pageCountLbl.innerHTML = jslet.formatString(jslet.locale.DBPageBar.pageCountLabel, [count]);
		Z._refreshButtonStatus();
	}, // end refreshControl

	_refreshButtonStatus: function() {
		var Z = this, 
			ds = Z._dataset,
			pageNo = ds.pageNo(),
			pageCnt = ds.pageCount(),
			prevDisabled = true,
			nextDisabled = true;
		if(pageNo > 1) {
			prevDisabled = false;
		}
		if(pageNo < pageCnt) {
			nextDisabled = false;
		}
		if(prevDisabled) {
			jQuery(Z._firstBtn).addClass('jl-pb-first-disabled jl-pb-button-disabled');
			jQuery(Z._priorBtn).addClass('jl-pb-prior-disabled jl-pb-button-disabled');
		}
		else {
			jQuery(Z._firstBtn).removeClass('jl-pb-first-disabled jl-pb-button-disabled');
			jQuery(Z._priorBtn).removeClass('jl-pb-prior-disabled jl-pb-button-disabled');
		}
		if(nextDisabled) {
			jQuery(Z._nextBtn).addClass('jl-pb-next-disabled jl-pb-button-disabled');
			jQuery(Z._lastBtn).addClass('jl-pb-last-disabled jl-pb-button-disabled');
		}
		else {
			jQuery(Z._nextBtn).removeClass('jl-pb-next-disabled jl-pb-button-disabled');
			jQuery(Z._lastBtn).removeClass('jl-pb-last-disabled jl-pb-button-disabled');
		}
		Z._firstBtn.disabled = prevDisabled;
		Z._priorBtn.disabled = prevDisabled;
		Z._nextBtn.disabled = nextDisabled;
		Z._lastBtn.disabled = nextDisabled;
	},
	
	/**
	 * @override
	 */
	renderAll: function () {
		var displayStyle = this._showPageSize ? 'inline' : 'none';
		var oel = this.el;
		oel.childNodes[0].style.display = displayStyle;
		oel.childNodes[1].style.display = displayStyle;

		this.refreshControl();
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
		
		jQuery(Z._firstBtn).off();
		jQuery(Z._priorBtn).off();
		jQuery(Z._pageNoTxt).off();
		jQuery(Z._gotoBtn).off();
		jQuery(Z._pageCountLbl).off();
		jQuery(Z._nextBtn).off();
		jQuery(Z._lastBtn).off();
		
		Z._firstBtn = null;
		Z._priorBtn = null;
		Z._pageNoTxt = null;
		Z._gotoBtn = null;
		Z._pageCountLbl = null;
		Z._nextBtn = null;
		Z._lastBtn = null;
		
		$super();
	}

});

jslet.ui.register('DBPageBar', jslet.ui.DBPageBar);
jslet.ui.DBPageBar.htmlTemplate = '<div></div>';
﻿/* ========================================================================
 * Jslet framework: jslet.dberror.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBError. 
 * Display dataset error.
 * 
 * Example:
 * <pre><code>
 *  var jsletParam = {type:"DBError",dataset:"employee"};
 *  
 * //1. Declaring:
 *  &lt;div data-jslet='type:"DBError",dataset:"employee"' />
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
jslet.ui.DBError = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'dataset';
		$super(el, params);
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
		var Z = this,
			jqEl = jQuery(Z.el);
		if (!jqEl.hasClass('jl-errorpanel')) {
			jqEl.addClass('jl-errorpanel');
		}

		Z.renderAll();
	},

	/**
	 * @override
	 */
	refreshControl: function (evt) {
		if (evt && evt.eventType == jslet.data.RefreshEvent.ERROR) {
			this.el.innerHTML = evt.message || '';
		}
	}, // end refreshControl

	/**
	 * @override
	 */
	renderAll: function () {
		this.refreshControl();
	},
	
	/**
	 * @override
	 */
	destroy: function($super){
		var Z = this;
				
		$super();
	}

});

jslet.ui.register('DBError', jslet.ui.DBError);
jslet.ui.DBError.htmlTemplate = '<div></div>';
