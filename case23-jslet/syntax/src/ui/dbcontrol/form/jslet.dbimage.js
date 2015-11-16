/* ========================================================================
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

		var srcURL = Z.getValue();
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
				var ctrlRecno = Z.ctrlRecno();
				if(ctrlRecno < 0) {
					altText = Z._dataset.getFieldText(Z._altField);
				} else {
					altText = Z._dataset.getFieldTextByRecno(ctrlRecno, Z._altField);
				}
			}
			Z.el.alt = altText;
			Z.el.src = srcURL;
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
