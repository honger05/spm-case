/* ========================================================================
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
		Z.removeAllChildControls();
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
		var dbctrl = jslet.ui.createControl(param, minTd);
		dbctrl.el.style.width = '98%';
		Z.minElement = dbctrl;
		Z.addChildControl(dbctrl);
		
		param.valueIndex = 1;
		dbctrl = jslet.ui.createControl(param, maxTd);
		dbctrl.el.style.width = '98%';
		Z.addChildControl(dbctrl);
	},
	
	focus: function() {
		this.minElement.focus();
	}
	
});

jslet.ui.register('DBBetweenEdit', jslet.ui.DBBetweenEdit);
jslet.ui.DBBetweenEdit.htmlTemplate = '<div></div>';
