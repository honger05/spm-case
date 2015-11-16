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

jslet.ui.setEditableStyle = function(formElement, disabled, readOnly, onlySetStyle, required) {
	if(!onlySetStyle) {
		formElement.disabled = disabled;
		formElement.readOnly = readOnly;
	}
	var jqEl = jQuery(formElement);
	if(disabled || readOnly) {
		if (!jqEl.hasClass('jl-readonly')) {
			jqEl.addClass('jl-readonly');
			jqEl.removeClass('jl-ctrl-required');
		}
	} else {
		jqEl.removeClass('jl-readonly');
		if(required) {
			jqEl.addClass('jl-ctrl-required');
		}
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

/**
 * Control focus manager.
 * 
 * @param containerId {String} container id, if containerid is not specified, container is document.
 */
jslet.ui.FocusManager = function(containerId) {
	this._onChangingFocus = null;
	this._focusKeyCode = null;
	this._containerId = containerId;
	
	this.initialize();
}

jslet.ui.FocusManager.prototype = {
	/**
	 * Get or set onChangingFocus event handler. 
	 * 
	 * @param onChangingFocus {Function} event handler, pattern:
	 * function doChangingFocus(element, reserve, datasetObj, fieldName) {
	 * 		console.log('Changind focus');
	 * }
	 * 
	 * focusManager.onChangingFocus(doChangingFocus);
	 * 
	 */
	onChangingFocus: function(onChangingFocus) {
		if(onChangingFocus === undefined) {
			return this._onChangingFocus;
		}
		jslet.Checker.test('FocusManager.onChangingFocus', onChangingFocus).isFunction();
		this._onChangingFocus = onChangingFocus;
	},
	
	/**
	 * Get or set 'focusKeyCode'
	 * 
	 * @param {Integer} focusKeyCode - Key code for changing focus.
	 * 
	 */
	focusKeyCode: function(focusKeyCode) {
		if(focusKeyCode === undefined) {
			return this._focusKeyCode;
		}
		jslet.Checker.test('FocusManager.focusKeyCode', focusKeyCode).isNumber();
		this._focusKeyCode = focusKeyCode;
	},
	
	initialize: function() {
		function isTabableElement(ele) {
			var tagName = ele.tagName;
			if(tagName == 'TEXTAREA' || tagName == 'A' || tagName == 'BUTTON') {
				return false;
			}
			if(tagName == 'INPUT') {
				var typeAttr = ele.type;
				if(typeAttr == 'button' || typeAttr == 'image' || typeAttr == 'reset' || typeAttr == 'submit' || typeAttr == 'url' || typeAttr == 'file') {
					return false;
				}
			}
			return true;
		}
		
		var Z = this;
		
		function doChangingFocus(ele, reverse) {
			var ojslet = jslet(ele), 
				dsObj = null, fldName = null, valueIndex = null;
			if(ojslet) {
				if(ojslet.dataset) {
					dsObj = ojslet.dataset();	
				}
				
				if(ojslet.field) {
					fldName = ojslet.field();	
				}
				
				if(ojslet.valueIndex) {
					valueIndex = ojslet.valueIndex();
				}
			}
			if(!Z._onChangingFocus) {
				return true;
			}
			return Z._onChangingFocus(ele, reverse, dsObj, fldName, valueIndex);
		}
		
		function handleHostKeyDown(event) {
			var focusKeyCode = Z._focusKeyCode || jslet.global.defaultFocusKeyCode || 9;
			var keyCode = event.which;
			if(keyCode === focusKeyCode || keyCode === 9) {
				if(keyCode !== 9 && !isTabableElement(event.target)) {
					return;
				}
				if(this._containerId) {
					jqHost = jQuery('#' + this._containerId);
					if(jqHost.length === 0) {
						throw new Error('Not found container: ' + this._containerId);
					}
				} else {
					jqHost = jQuery(document);
				}
				
				if(event.shiftKey){
					jQuery.tabPrev(jqHost, true, doChangingFocus);
				}
				else{
					jQuery.tabNext(jqHost, true, doChangingFocus);
				}
				event.preventDefault();
	       		event.stopImmediatePropagation();
	       		return false;
			}
		}
		var jqHost;
		if(this._containerId) {
			jqHost = jQuery('#' + this._containerId);
			if(jqHost.length === 0) {
				throw new Error('Not found container: ' + this._containerId);
			}
		} else {
			jqHost = jQuery(document);
		}
		jqHost.keydown(handleHostKeyDown);
	}
}

jslet.ui.rootFocusManager = new jslet.ui.FocusManager();

