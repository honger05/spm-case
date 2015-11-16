/* ========================================================================
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

		Z._selectedIndex = 0;
		
		Z._onChanged = null;
		
		/**
		 * Array of accordion items,like: [{caption: 'cap1'},{caption: 'cap2'}]
		 */
		Z._items = null;
		
		$super(el, params);
	},

	/**
	 * Selected index.
	 * 
	 * @param {Integer or undefined} index selected index.
	 * @return {this or Integer}
	 */
	selectedIndex: function(index) {
		if(index === undefined) {
			return this._selectedIndex;
		}
		jslet.Checker.test('Accordion.selectedIndex', index).isGTEZero();
		this._selectedIndex = index;
	},
	
	/**
	 * Fired when user changes accordion panel.
	 * Pattern: 
	 *	function(index){}
	 *	//index: Integer
	 *
	 * @param {Function or undefined} onChanged Accordion panel changed event handler.
	 * @return {this or Function}
	 */
	onChanged: function(onChanged) {
		if(onChanged === undefined) {
			return this._onChanged;
		}
		jslet.Checker.test('Accordion.onChanged', onChanged).isFunction();
		this._onChanged = onChanged;
	},
	
	/**
	 * Accordion items.
	 * Pattern:
	 * [{caption:'item1'},...]
	 * 
	 * @param {PlanObject[] or undefined} items
	 * @return {this or PlanObject[]} 
	 */
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
			return '<button class="btn btn-default jl-accordion-head btn-sm" jsletindex = "' + index + '">' + caption + '</button>';
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
