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

		Z._caption = null; 
		
		Z._collapsed = false;
		
		$super(el, params);
	},

	/**
	 * Set or get caption of fieldset.
	 * 
	 * @param {String or undefined} caption caption of fieldset. 
	 * @return {this or String}
	 */
	caption: function(caption) {
		if(caption === undefined) {
			return this._caption;
		}
		jslet.Checker.test('FieldSet.caption', caption).isString();
		this._caption = caption;
	},

	/**
	 * Identify fieldset is collapsed or not.
	 * 
	 * @param {Boolean or undefined} collapsed true - fieldset is collapsed, false(default) - otherwise. 
	 * @return {this or Boolean}
	 */
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
