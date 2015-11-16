/* ========================================================================
 * Jslet framework: jslet.loader-dist.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * Jslet Loader
 */
if (window.jslet === undefined || jslet === undefined){
	jslet=window.jslet = function(id){
		var ele = jQuery(id)[0];
		return (ele && ele.jslet)?ele.jslet:null;
	};
}

/////////////////////////////////////////////////////////////
//jslet module configuration 
/////////////////////////////////////////////////////////////

//Distribution configuration begin
jslet._initialModules = [
//css
	{name: 'jslet-style', src: '../dist/asset/{theme}/jslet-min.css', baseOnLoader: true },
//message for i18n
	{ name: 'locale', src: '../dist/locale/{lang}/locale.js', baseOnLoader: true },
	   //js-lib
	{name: 'jquery', src: '../dist/lib/jquery-1.11.0.js', baseOnLoader: true },

	//Bootstrap
	{name: 'bootstrap-js', src: '../dist/lib/bootstrap-3.2.0-dist/js/bootstrap.min.js', deps: ['jquery'], baseOnLoader: true },
	{name: 'bootstrap-css', src: '../dist/lib/bootstrap-3.2.0-dist/css/bootstrap.min.css', baseOnLoader: true },
	{name: 'bootstrap-theme', src: '../dist/lib/bootstrap-3.2.0-dist/css/bootstrap-theme.min.css', baseOnLoader: true },

	//fontawesome
	{name: 'fontawesome', src: '../dist/lib/fontawesome/css/font-awesome.min.css', baseOnLoader: true },

	{ name: 'bootstrap', deps: ['bootstrap-js','bootstrap-css','bootstrap-theme','fontawesome']},
		
//jqPlot	
	{name: 'jqplotjs', src: '../dist/lib/jqplot/jquery.jqplot.min.js', deps: ['jquery'], baseOnLoader: true },
	{name: 'jqplotcss', src: '../dist/lib/jqplot/jquery.jqplot.min.css', baseOnLoader: true },
	{name: 'categoryaxisrenderer', src: '../dist/lib/jqplot/plugins/jqplot.categoryaxisrenderer.min.js', deps: ['jqplotjs'], baseOnLoader: true },
	{name: 'pierenderer', src: '../dist/lib/jqplot/plugins/jqplot.pierenderer.min.js', deps: ['jqplotjs'], baseOnLoader: true },
	{name: 'barrenderer', src: '../dist/lib/jqplot/plugins/jqplot.barrenderer.min.js', deps: ['jqplotjs'], baseOnLoader: true },
	{name: 'jqplotplugs', deps: 'categoryAxisRenderer,pierenderer,barrenderer', baseOnLoader: true },
	{name: 'jqplot', deps: ['jqplotcss','jqplotplugs'], baseOnLoader: true },	
	
//jslet
	{name: 'jslet-data', src: '../dist/jslet-data.min.js', deps: ['locale','jquery',], baseOnLoader: true },
	{name: 'jslet-ui', src: '../dist/jslet-ui.min.js', deps: ['jslet-data','jslet-style','bootstrap'], baseOnLoader: true },
	{name: 'jslet', deps: ['jslet-data','jslet-ui'], baseOnLoader: true }
];
//Distribution configuration end
/////////////////////////////////////////////////////////////////
//End jslet module configuration 
/////////////////////////////////////////////////////////////////


//default theme and lang,used for css and message text
jslet._theme = 'default';
jslet._lang = 'en';


if (!jslet.loaderUri) {
	var ohead = document.getElementsByTagName('head')[0], uri = ohead.lastChild.src;
	uri = uri.substring(0, uri.lastIndexOf('/') + 1);
	jslet.loaderUri = uri;
}

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	};
}

jslet.ModuleManager = function () {
	var _modules = [];

	var _sortfunc = function (mod1, mod2) {
		return mod1.level - mod2.level;
	};

	var _checkModule = function (omod) {
		var src = omod.src;
		if (src) {
			omod.isCss = src.slice(-4).toLowerCase() == '.css';
			omod.isTheme = (src.indexOf('{theme}') >= 0);
			omod.isI18n = (src.indexOf('{lang}') >= 0);
		}
	};


	this.define = function (name, src, deps, baseOnLoader) {
		var omod;
		if (name && Object.prototype.toString.apply(name) === '[object Array]') {
			var initialModules = name, len = initialModules.length;
			for (var i = 0; i < len; i++) {
				omod = initialModules[i];
				_checkModule(omod);
				_modules[_modules.length] = omod;
			}
		}
		else {
			if(deps && typeof deps == 'string') {
				deps = deps.trim().split(',');
			}
			omod = { 'name': name.toLowerCase().trim(), 'deps': deps, 'src': src?src.trim():null, 'baseOnLoader': baseOnLoader ? true : false };
			_checkModule(omod);
			_modules[_modules.length] = omod;
		}
	};

	this.require = function (moduleNames, onLoaded, onJsletReady) {
		if (typeof (moduleNames) == 'string') {
			moduleNames = moduleNames.split(',');
		}
		jslet.ModuleManager._runingCount = 0;
		var uniqueModules = [];
		this._getModuleWithChild(moduleNames, uniqueModules, 0);
		uniqueModules.sort(_sortfunc);

		this._loadCss(uniqueModules);

		this._loadScripts(uniqueModules, -99, onLoaded, onJsletReady);
	};

	var self = this;

	this._loadScripts = function (uniqueModules, level, onLoaded, onJsletReady) {
		var len = uniqueModules.length - 1, module, loadingModules = [];
		for (var i = len; i >= 0; i--) {
			module = uniqueModules[i];
			if (module.isCss) {
				continue;
			}
			if (level == -99) {
				level = module.level;
			}

			if (level < module.level) {
				continue;
			}
			if (level > module.level) {
				break;
			}
			var src = module.src;
			if (src) {
				if (module.isI18n) {
					src = src.replace(/{lang}/g, jslet._lang);
				}
				loadingModules.push(module.baseOnLoader ? jslet.loaderUri + src : src);
			}
		}

		if (loadingModules.length === 0) {
			level--;
			if (level >= 0) {
				self._loadScripts(uniqueModules, level, onLoaded, onJsletReady);
			} else {
				if (onLoaded) {
					onLoaded();
				}
				if(jslet.ui) {
					jslet.ui.install(onJsletReady);
				}
			}
		} else {
			this._innerloadjs(loadingModules, function () {
				level--;
				if (level >= 0) {
					self._loadScripts(uniqueModules, level, onLoaded, onJsletReady);
				} else {
					if (onLoaded) {
						onLoaded();
					}
					if(jslet.ui) {
						jslet.ui.install(onJsletReady);
					}
				}
			});
		}
	};
	
	this.getHead = function () {
		return document.getElementsByTagName('head')[0] || document.documentElement;
	};

	function DownCounter(size, callback) {
		var counter = size,
			fcallback = callback;

		this.down = function () {
			counter--;
			if (counter === 0) {
				window.setTimeout(callback, 5);
			}
		};
	}

	this._innerloadjs = function (jsfiles, callback) {
		var counter = new DownCounter(jsfiles.length, callback), 
			url, 
			scriptTag,
			ohead = this.getHead();
		for (var i = 0, len = jsfiles.length; i < len; i++) {
			url = jsfiles[i];
			scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'text/javascript');
			scriptTag.setAttribute('src', url);
			scriptTag.onload = scriptTag.onreadystatechange = function () {
				if ((!this.readyState ||
					this.readyState == 'loaded' || 
					this.readyState == 'complete')) {
					counter.down();
				}
			};
			scriptTag.onerror = function () {
				counter.down();
			};
			ohead.appendChild(scriptTag);
		}
	};

	this._loadCss = function (uniqueModules) {
		var ohead = this.getHead(), len = uniqueModules.length - 1, ocss;
		for (var i = len; i >= 0; i--) {
			module = uniqueModules[i];
			if (module.isCss) {
				ocss = document.createElement('link');
				ocss.type = 'text/css';
				ocss.rel = 'stylesheet';
				var src = module.src;
				if (module.isTheme) {
					src = src.replace(/{theme}/g, jslet._theme);
				}
				ocss.href = module.baseOnLoader ? jslet.loaderUri + src : src;
				ohead.appendChild(ocss);
			}
		}
	};

	this._getModuleWithChild = function (moduleNames, uniqueModules, level) {
		if (typeof (moduleNames) == 'string')
			moduleNames = moduleNames.split(',');
		jslet.ModuleManager._runingCount++;
		if (jslet.ModuleManager._runingCount > 20000) {
			throw new Error('Cycle reference in module configuration!');
		}
		var len = moduleNames.length, m, name, um, omod, cnt;
		for (var i = 0; i < len; i++) {
			name = moduleNames[i].trim();
			omod = this._findModule(name);
			if (!omod) {
				continue;
			}
			um = null;
			cnt = uniqueModules.length;
			for (var j = 0; j < cnt; j++) {
				if (uniqueModules[j].name == name) {
					um = uniqueModules[j];
					break;
				}
			}
			if (um === null) {
				omod.level = omod.isCss ? 0 : level;
				uniqueModules.push(omod);
			} else {
				if (um.level < level && !omod.isCss) {
					um.level = level;
				}
			}
			if (omod.deps && omod.deps.length > 0) {
				this._getModuleWithChild(omod.deps, uniqueModules, level + 1);
			}
		}
	};

	this._findModule = function (name) {
		var len = _modules.length;
		for (var i = 0; i < len; i++) {
			m = _modules[i];
			if (m.name == name.toLowerCase()) {
				return m;
			}
		}
		return null;
	};
};

jslet.getCookie = function( name ) {
	var start = document.cookie.indexOf( name + '=' );
	var len = start + name.length + 1;
	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
		return null;
	}
	if ( start == -1 ) {
		return null;
	}
	var end = document.cookie.indexOf( ';', len );
	if ( end == -1 ) {
		end = document.cookie.length;
	}
	return unescape( document.cookie.substring( len, end ) );
};

jslet.setCookie = function(name, value, expires, path, domain, secure) {
	var today = new Date();
	today.setTime(today.getTime());
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date(today.getTime() + (expires));
	document.cookie = name + '=' + escape(value) +
	((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
	((path) ? ';path=' + path : '') +
	((domain) ? ';domain=' + domain : '') +
	((secure) ? ';secure' : '');
};

jslet.module = new jslet.ModuleManager();

jslet.define = function (name, src, deps, baseOnLoader) {
	if(deps === undefined)
		deps = "jslet";
	
	jslet.module.define(name, src, deps, baseOnLoader);
};

jslet.require = function (moduleNames, onLoaded, onJsletReady) {
	jslet.module.require(moduleNames, onLoaded, onJsletReady);
};

jslet.setTheme = function (theme, saveToCookie) {
	if (theme){
		jslet._theme = theme.trim();
		if(saveToCookie) {
			jslet.setCookie('jslet.theme', jslet._theme);
		}
	}
};

jslet.setLang = function (lang, saveToCookie) {
	if (lang){
		jslet._lang = lang.trim();
		if(saveToCookie) {
			jslet.setCookie('jslet.lang', jslet._lang);
		}
	}
};

(function () {
	jslet.module.define(jslet._initialModules);
	jslet._initialModules = null;
	delete jslet._initialModules;

	var lang = jslet.getCookie('jslet.lang');
	if (lang)
		jslet._lang = lang;
	var theme = jslet.getCookie('jslet.theme');
	if (theme)
		jslet._theme = theme;
})();
