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

		this._childControls = null;
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
		var ctrlType = ctrlParams.type;
		
		for(var name in ctrlParams) {
			var prop = this[name];
			if(name == 'type') {
				continue;
			}
			if(prop && prop.call) {
				prop.call(this, ctrlParams[name]);
			} else {
				throw new Error(ctrlType +  " NOT support control property: " + name);
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
	
	addChildControl: function(childCtrl) {
		var Z = this;
		if(!Z._childControls) {
			Z._childControls = [];
		}
		if(childCtrl) {
			Z._childControls.push(childCtrl);
		}
	},
	
	removeAllChildControls: function() {
		var Z = this, childCtrl;
		if(!Z._childControls) {
			return;
		}
		for(var i = 0, len = Z._childControls.length; i < len; i++) {
			childCtrl = Z._childControls[i];
			childCtrl.destroy();
		}
		Z._childControls = null;
	},
	
	/**
	 * Destroy method
	 */
	destroy: function(){
		if(this.el) {
			this.el.jslet = null;
			this.el = null;
		}
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
		var Z = this,
			evtType = evt.eventType;
		// Meta changed 
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
			var metaName = evt.metaName,
				changeAllRows = evt.changeAllRows;
			if(Z._field && Z._field == evt.fieldName) {
				if (!changeAllRows && !isForce && !Z.isActiveRecord()) {
					return false;
				}
				Z.doMetaChanged(metaName);
			} else {
				if(!Z._field && (metaName == 'visible' || metaName == 'editControl')) {
					Z.doMetaChanged(metaName);
				}
			}
			return true;
		}
		//Lookup data changed
		if(evtType == jslet.data.RefreshEvent.UPDATELOOKUP && evt.fieldName == Z._field) {
			if(Z._ctrlRecno >= 0 && (evt.recno || evt.recno === 0)) {
				if(Z._ctrlRecno === evt.recno) {
					Z.doLookupChanged();
				}
			} else {
				Z.doLookupChanged();
			}
			return true;
		}

		if (!isForce && Z.isActiveRecord && !Z.isActiveRecord()) {
			return false;
		}
		//Value changed
		if (evtType == jslet.data.RefreshEvent.SCROLL || 
				evtType == jslet.data.RefreshEvent.INSERT ||
				evtType == jslet.data.RefreshEvent.DELETE) {
			Z.doValueChanged();
			return true;
		}
		if((evtType == jslet.data.RefreshEvent.UPDATERECORD ||
			evtType == jslet.data.RefreshEvent.UPDATECOLUMN) && 
			evt.fieldName === undefined || evt.fieldName == Z._field){
			Z.doValueChanged();
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

	destroy: function ($super) {
		this.removeAllChildControls();
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
	
	/**Inner use**/
	_ctrlRecno: -1,
	
	_inTableCtrl: false,
	
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
	
	setTabIndex: function(tabIdx) {
		var Z = this;
		if(Z._inTableCtrl) {
			return;
		}
		if(tabIdx !== 0 && !tabIdx) {
			fldObj = Z._dataset.getField(Z._field);
			if(fldObj) {
				tabIdx = fldObj.tabIndex();
			}
		}
		if(tabIdx === 0 || tabIdx) {
			Z.el.tabIndex = tabIdx;
		}
	},
	
	existField: function(fldName) {
		var fldObj = this._dataset.getField(fldName);
		return fldObj ? true: false;
	},
	
	/**
	 * DBTable uses this property.
	 */
	ctrlRecno: function(ctrlRecno) {
		if(ctrlRecno === undefined) {
			return this._ctrlRecno;
		}

		jslet.Checker.test('DBFieldControl.ctrlRecno', ctrlRecno).isGTEZero();
		this._ctrlRecno = ctrlRecno;
		this.doValueChanged();
	},
	
	inTableCtrl: function(inTable) {
		if(inTable === undefined) {
			return this._inTableCtrl;
		}
		this._inTableCtrl = inTable;
	},
	
	getValue: function() {
		var Z = this;
		if(Z._ctrlRecno < 0) {
			return Z._dataset.getFieldValue(Z._field, Z._valueIndex); 
		} else {
			return Z._dataset.getFieldValueByRecno(Z._ctrlRecno, Z._field, Z._valueIndex);
		}
	},
	
	getText: function(isEditing) {
		var Z = this;
		if(Z._ctrlRecno < 0) {
			return Z._dataset.getFieldText(Z._field, isEditing, Z._valueIndex); 
		} else {
			return Z._dataset.getFieldTextByRecno(Z._ctrlRecno, Z._field, isEditing, Z._valueIndex);
		}
	},
	
	/**
	 * Check if this control is in current record.
	 * In DBTable edit mode, one field corresponds many edit control(one row one edit control), but only one edit control is in active record.
	 * Normally, only edit control in active record will refresh.  
	 */
	isActiveRecord: function(){
		return this._ctrlRecno < 0 || this._ctrlRecno == this._dataset.recno();
	},
	
	/**
	 * Force refresh control, regardless of which in active record or not.
	 */
	forceRefreshControl: function(){
		this.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(this._field), true);
	},
	
	getFieldError: function() {
		var Z = this,
			errObj;
		if(Z._ctrlRecno < 0) {
			errObj = Z._dataset.getFieldError(Z._field, Z._valueIndex);
		} else {
			errObj = Z._dataset.getFieldErrorByRecno(Z._ctrlRecno, Z._field, Z._valueIndex);
		}
		return errObj;
	},
	
	/**
	 * @protected
	 * Render invalid message and change the control to "invalid" style.
	 * 
	 *  @param {String} errObj error object: {code: xxx, message}, if it's null, clear the 'invalid' style. 
	 */
	renderInvalid: function (errObj) {
		var Z = this;
		if (!Z._field) {
			return;
		}
		if (errObj){
			jQuery(Z.el).parent().addClass('has-error');
			Z.el.title = errObj.message || '';
		} else {
			jQuery(Z.el).parent().removeClass('has-error');
			Z.el.title = '';
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
* @param {Boolean} hidden Hide control or not;
*  
* @return {jslet control}
*/
jslet.ui.createControl = function (jsletparam, parent, width, height, hidden) {
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
	if(hidden) {
		el.style.display = 'none';
	}	
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
	if(el.jslet) {
		console.warn('Control has installed! Don\'t install it again!');
		return;
	}
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
* Unbind jslet control and clear jslet property.
* 
* @param {Html Element} el Html element
*/
jslet.ui.unbindControl = function(el) {
	if (el.jslet && el.jslet.destroy) {
		el.jslet.destroy();
	}
	el.jslet = null;
};

/**
* re-bind jslet control.
* 
* @param {Html Element} el Html element
*/
jslet.ui.rebindControl = function(el) {
	jslet.ui.unbindControl(el);
	jslet.ui.bindControl(el);
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
