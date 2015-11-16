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
		
		Z._selectedIndex = 0;
		
		Z._newable = true;
		
		Z._closable = true;
		
		Z._onSelectedChanged = null;
		
		Z._onAddTabItem = null;
		
		Z._onRemoveTabItem = null;
		
		Z._onCreateContextMenu = null;
		
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

	/**
	 * Get or set selected tab item index.
	 * 
	 * @param {Integer or undefined} index selected tabItem index.
	 * @param {this or Integer}
	 */
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
	
	/**
	 * Identify if user can add tab item on fly.
	 * 
	 * @param {Boolean or undefined} newable true(default) - user can add tab item on fly, false - otherwise.
	 * @return {this or Boolean} 
	 */
	newable: function(newable) {
		if(newable === undefined) {
			return this._newable;
		}
		this._newable = newable? true: false;
	},
	
	/**
	 * Identify if user can close tab item on fly.
	 * 
	 * @param {Boolean or undefined} closable true(default) - user can close tab item on fly, false - otherwise.
	 * @return {this or Boolean} 
	 */
	closable: function(closable) {
		if(closable === undefined) {
			return this._closable;
		}
		this._closable = closable? true: false;
	},
	
	/**
	 * Fired after add a new tab item.
	 * Pattern: 
	 *   function(){}
	 *   
	 * @param {Function or undefined} onAddTabItem tab item added event handler.
	 * @return {this or Function} 
	 */
	onAddTabItem: function(onAddTabItem) {
		if(onAddTabItem === undefined) {
			return this._onAddTabItem;
		}
		jslet.Checker.test('TabControl.onAddTabItem', onAddTabItem).isFunction();
		this._onAddTabItem = onAddTabItem;
	},
	
	/**
	 * Fired when user toggle tab item.
	 * Pattern: 
	 *   function(oldIndex, newIndex){}
	 *   //oldIndex: Integer
	 *   //newIndex: Integer
	 *   
	 * @param {Function or undefined} onSelectedChanged tab item selected event handler.
	 * @return {this or Function} 
	 */
	onSelectedChanged: function(onSelectedChanged) {
		if(onSelectedChanged === undefined) {
			return this._onSelectedChanged;
		}
		jslet.Checker.test('TabControl.onSelectedChanged', onSelectedChanged).isFunction();
		this._onSelectedChanged = onSelectedChanged;
	},

	/**
	 * Fired after remove a tab item.
	 * Pattern: 
	 *  function(tabIndex, selected){}
	 *  //tabIndex: Integer
	 *  //selected: Boolean Identify if the removing item is active
	 *  //return: Boolean, false - cancel removing tab item, true - remove tab item. 
	 *   
	 * @param {Function or undefined} onRemoveTabItem tab item removed event handler.
	 * @return {this or Function} 
	 */
	onRemoveTabItem: function(onRemoveTabItem) {
		if(onRemoveTabItem === undefined) {
			return this._onRemoveTabItem;
		}
		jslet.Checker.test('TabControl.onRemoveTabItem', onRemoveTabItem).isFunction();
		this._onRemoveTabItem = onRemoveTabItem;
	},

	/**
	 * Fired before show context menu
	 * Pattern: 
	 *   function(menuItems){}
	 *   //menuItems: Array of MenuItem, @see menu item configuration in jslet.menu.js.
	 *   
	 * @param {Function or undefined} onCreateContextMenu creating context menu event handler.
	 * @return {this or Function} 
	 */
	onCreateContextMenu: function(onCreateContextMenu) {
		if(onCreateContextMenu === undefined) {
			return this._onCreateContextMenu;
		}
		jslet.Checker.test('TabControl.onCreateContextMenu', onCreateContextMenu).isFunction();
		this._onCreateContextMenu = onCreateContextMenu;
	},
	 
	/**
	 * Get or set tab item configuration.
	 * 
	 * @param {jslet.ui.TabItem[] or undefined} items tab items.
	 * @return {this or jslet.ui.TabItem[]}
	 */
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
				Z._renderTabItem(oitem);
			}
		}
		Z._calcItemsWidth();
		Z._ready = true;
		Z._chgSelectedIndex(Z._selectedIndex);
		Z._createContextMenu();
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
			canClose = Z._closable && itemCfg.closable,
			tmpl = ['<a href="javascript:;" class="jl-tab-inner' + (canClose? ' jl-tab-close-loc': '')
			        + '" onclick="javascript:this.blur();"><span class="jl-tab-title '];

		tmpl.push('">');
		tmpl.push(itemCfg.header);
		tmpl.push('</span>');
		tmpl.push('<span href="javascript:;" class="close jl-tab-close' + (!canClose || itemCfg.disabled? ' jl-hidden': '') + '">x</span>');
		tmpl.push('</a>');
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
		var oli = this.parentNode.parentNode,
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
		var Z = this;
		Z._items.push(newItemCfg);
		Z._renderTabItem(newItemCfg);
		if(!notRefreshRightIdx) {
			Z._calcItemsWidth();
			Z._chgSelectedIndex(Z._selectedIndex + 1);
		}
	},

	_renderTabItem: function(itemCfg) {
		var Z = this,
			jqEl = jQuery(Z.el),
			oul = jqEl.find('.jl-tab-list')[0],
			panelContainer = jqEl.find('.jl-tab-items')[0];
		Z._createHeader(oul, itemCfg);
		Z._createBody(panelContainer, itemCfg);
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
			currIdx = Z._selectedIndex,
			oitem = Z._items[currIdx];
		if (oitem && currIdx >= 0 && oitem.closable && !oitem.disabled) {
			Z.removeTabItem(currIdx);
			Z._calcItemsWidth();
		}
	},

	/**
	 * Close all closable tab item except current active tab item.
	 */
	closeOther: function () {
		var Z = this, oitem;
		for (var i = Z._items.length - 1; i >= 0; i--) {
			oitem = Z._items[i];
			if (oitem.closable && !oitem.disabled) {
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


