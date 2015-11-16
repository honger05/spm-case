/* ========================================================================
 * Jslet framework: jslet.dbplace.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * @class DBPlace. 
 * It's an placeholder for other dbcontrols.
 * Example:
 * <pre><code>
 * var jsletParam = {type:"DBPlace",dataset: "dataset", "field":"fieldName"};
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
jslet.ui.DBPlace = jslet.Class.create(jslet.ui.DBFieldControl, {
	/**
	 * @override
	 */
	initialize: function ($super, el, params) {
		this.allProperties = 'dataset,field';
		this.editControl = null;
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
		var Z = this,
			evtType = evt.eventType;
		// Meta changed 
		if (evtType == jslet.data.RefreshEvent.CHANGEMETA &&
			Z._field == evt.fieldName && 
			evt.metaName == 'editControl') {
			Z.renderAll();
			return true;
		}
	}, // end refreshControl

	/**
	 * @override
	 */
	renderAll: function () {
		var Z = this;
		Z.removeAllChildControls();
		var	fldObj = Z._dataset.getField(Z._field),
			param = fldObj.editControl();
		param.dataset = Z._dataset;
		param.field = Z._field;
		var dbCtrl = jslet.ui.createControl(param, Z.el);
		dbCtrl.el.style.width = '100%';
		Z.addChildControl(dbCtrl);
	}
});

jslet.ui.register('DBPlace', jslet.ui.DBPlace);
jslet.ui.DBPlace.htmlTemplate = '<div></div>';
