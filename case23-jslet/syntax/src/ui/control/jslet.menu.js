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

		Z._onItemClick = null;
		
		Z._items = null;
		$super(el, params);
	},

	/**
	 * Get or set menuItem click event handler
	 * Pattern: 
	 * function(menuId){}
	 *   //menuId: String
	 * 
	 * @param {Function or undefined} onItemClick menuItem click event handler
	 * @param {this or Function}
	 */
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('MenuBar.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
	},
	
	/**
	 * Get or set menu items configuration.
	 * 
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
	 * 
	 * @param {PlanObject[] or undefined} items menu items.
	 * @param {this or PlanObject[]}
	 */
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

	/**
	 * Get or set menuItem click event handler
	 * Pattern: 
	 * function(menuId){}
	 *   //menuId: String
	 * 
	 * @param {Function or undefined} onItemClick menuItem click event handler
	 * @param {this or Function}
	 */
	onItemClick: function(onItemClick) {
		if(onItemClick === undefined) {
			return this._onItemClick;
		}
		jslet.Checker.test('Menu.onItemClick', onItemClick).isFunction();
		this._onItemClick = onItemClick;
	},
	
	/**
	 * Get or set menu items configuration.
	 * 
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
	 * 
	 * @param {PlanObject[] or undefined} items menu items.
	 * @param {this or PlanObject[]}
	 */
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
