/* ========================================================================
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
