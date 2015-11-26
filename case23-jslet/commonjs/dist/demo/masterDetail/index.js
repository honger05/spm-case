/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(27);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(3);
	var Exception = __webpack_require__(2)["default"];
	
	var VERSION = "1.3.0";
	exports.VERSION = VERSION;var COMPILER_REVISION = 4;
	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '>= 1.0.0'
	};
	exports.REVISION_CHANGES = REVISION_CHANGES;
	var isArray = Utils.isArray,
	    isFunction = Utils.isFunction,
	    toString = Utils.toString,
	    objectType = '[object Object]';
	
	function HandlebarsEnvironment(helpers, partials) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	
	  registerDefaultHelpers(this);
	}
	
	exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,
	
	  logger: logger,
	  log: log,
	
	  registerHelper: function(name, fn, inverse) {
	    if (toString.call(name) === objectType) {
	      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
	      Utils.extend(this.helpers, name);
	    } else {
	      if (inverse) { fn.not = inverse; }
	      this.helpers[name] = fn;
	    }
	  },
	
	  registerPartial: function(name, str) {
	    if (toString.call(name) === objectType) {
	      Utils.extend(this.partials,  name);
	    } else {
	      this.partials[name] = str;
	    }
	  }
	};
	
	function registerDefaultHelpers(instance) {
	  instance.registerHelper('helperMissing', function(arg) {
	    if(arguments.length === 2) {
	      return undefined;
	    } else {
	      throw new Exception("Missing helper: '" + arg + "'");
	    }
	  });
	
	  instance.registerHelper('blockHelperMissing', function(context, options) {
	    var inverse = options.inverse || function() {}, fn = options.fn;
	
	    if (isFunction(context)) { context = context.call(this); }
	
	    if(context === true) {
	      return fn(this);
	    } else if(context === false || context == null) {
	      return inverse(this);
	    } else if (isArray(context)) {
	      if(context.length > 0) {
	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      return fn(context);
	    }
	  });
	
	  instance.registerHelper('each', function(context, options) {
	    var fn = options.fn, inverse = options.inverse;
	    var i = 0, ret = "", data;
	
	    if (isFunction(context)) { context = context.call(this); }
	
	    if (options.data) {
	      data = createFrame(options.data);
	    }
	
	    if(context && typeof context === 'object') {
	      if (isArray(context)) {
	        for(var j = context.length; i<j; i++) {
	          if (data) {
	            data.index = i;
	            data.first = (i === 0);
	            data.last  = (i === (context.length-1));
	          }
	          ret = ret + fn(context[i], { data: data });
	        }
	      } else {
	        for(var key in context) {
	          if(context.hasOwnProperty(key)) {
	            if(data) { 
	              data.key = key; 
	              data.index = i;
	              data.first = (i === 0);
	            }
	            ret = ret + fn(context[key], {data: data});
	            i++;
	          }
	        }
	      }
	    }
	
	    if(i === 0){
	      ret = inverse(this);
	    }
	
	    return ret;
	  });
	
	  instance.registerHelper('if', function(conditional, options) {
	    if (isFunction(conditional)) { conditional = conditional.call(this); }
	
	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });
	
	  instance.registerHelper('unless', function(conditional, options) {
	    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
	  });
	
	  instance.registerHelper('with', function(context, options) {
	    if (isFunction(context)) { context = context.call(this); }
	
	    if (!Utils.isEmpty(context)) return options.fn(context);
	  });
	
	  instance.registerHelper('log', function(context, options) {
	    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
	    instance.log(level, context);
	  });
	}
	
	var logger = {
	  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },
	
	  // State enum
	  DEBUG: 0,
	  INFO: 1,
	  WARN: 2,
	  ERROR: 3,
	  level: 3,
	
	  // can be overridden in the host environment
	  log: function(level, obj) {
	    if (logger.level <= level) {
	      var method = logger.methodMap[level];
	      if (typeof console !== 'undefined' && console[method]) {
	        console[method].call(console, obj);
	      }
	    }
	  }
	};
	exports.logger = logger;
	function log(level, obj) { logger.log(level, obj); }
	
	exports.log = log;var createFrame = function(object) {
	  var obj = {};
	  Utils.extend(obj, object);
	  return obj;
	};
	exports.createFrame = createFrame;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];
	
	function Exception(message, node) {
	  var line;
	  if (node && node.firstLine) {
	    line = node.firstLine;
	
	    message += ' - ' + line + ':' + node.firstColumn;
	  }
	
	  var tmp = Error.prototype.constructor.call(this, message);
	
	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }
	
	  if (line) {
	    this.lineNumber = line;
	    this.column = node.firstColumn;
	  }
	}
	
	Exception.prototype = new Error();
	
	exports["default"] = Exception;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint -W004 */
	var SafeString = __webpack_require__(4)["default"];
	
	var escape = {
	  "&": "&amp;",
	  "<": "&lt;",
	  ">": "&gt;",
	  '"': "&quot;",
	  "'": "&#x27;",
	  "`": "&#x60;"
	};
	
	var badChars = /[&<>"'`]/g;
	var possible = /[&<>"'`]/;
	
	function escapeChar(chr) {
	  return escape[chr] || "&amp;";
	}
	
	function extend(obj, value) {
	  for(var key in value) {
	    if(Object.prototype.hasOwnProperty.call(value, key)) {
	      obj[key] = value[key];
	    }
	  }
	}
	
	exports.extend = extend;var toString = Object.prototype.toString;
	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	var isFunction = function(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	if (isFunction(/x/)) {
	  isFunction = function(value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	var isFunction;
	exports.isFunction = isFunction;
	var isArray = Array.isArray || function(value) {
	  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
	};
	exports.isArray = isArray;
	
	function escapeExpression(string) {
	  // don't escape SafeStrings, since they're already safe
	  if (string instanceof SafeString) {
	    return string.toString();
	  } else if (!string && string !== 0) {
	    return "";
	  }
	
	  // Force a string conversion as this will be done by the append regardless and
	  // the regex test will do this transparently behind the scenes, causing issues if
	  // an object's to string has escaped characters in it.
	  string = "" + string;
	
	  if(!possible.test(string)) { return string; }
	  return string.replace(badChars, escapeChar);
	}
	
	exports.escapeExpression = escapeExpression;function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}
	
	exports.isEmpty = isEmpty;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	// Build out our basic SafeString type
	function SafeString(string) {
	  this.string = string;
	}
	
	SafeString.prototype.toString = function() {
	  return "" + this.string;
	};
	
	exports["default"] = SafeString;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	exports.push([module.id, "\r\n.fn-relative {\r\n\tposition: relative;\r\n}\r\n\r\n.fn-toolbar {\r\n\tposition: absolute;\r\n\ttop: 4px;\r\n\tright: 10px;\r\n}\r\n\r\n.jl-comb-btn-group > .btn {\r\n\theight: 30px;\r\n}\r\n\r\n.jl-msg-button {\r\n    line-height: 1;\r\n}\r\n\r\n.jl-overlay {\r\n  background-color: #000;\r\n}\r\n\r\n.panel-title {\r\n\tdisplay: inline;\r\n}\r\n\r\n.options {\r\n\twidth: 100%;\r\n\tdisplay: inline-block;\r\n}", ""]);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(10);
	module.exports = (Handlebars["default"] || Handlebars).template(function (Handlebars,depth0,helpers,partials,data) {
	  this.compilerInfo = [4,'>= 1.0.0'];
	helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
	  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;
	
	function program1(depth0,data) {
	  
	  var buffer = "", stack1;
	  buffer += "\r\n		<div class=\"options form-horizontal\">\r\n			";
	  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.inputs), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
	  if(stack1 || stack1 === 0) { buffer += stack1; }
	  buffer += "\r\n			";
	  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 && depth0.options)),stack1 == null || stack1 === false ? stack1 : stack1.buttons), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
	  if(stack1 || stack1 === 0) { buffer += stack1; }
	  buffer += "\r\n		</div>\r\n		";
	  return buffer;
	  }
	function program2(depth0,data) {
	  
	  var buffer = "";
	  buffer += "\r\n				<label class=\"col-sm-1 control-label\">"
	    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
	    + "</label>\r\n				<div class=\"col-sm-3\">\r\n					<input type=\"text\" class=\"form-control\" id="
	    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
	    + "Option>\r\n				</div>\r\n			";
	  return buffer;
	  }
	
	function program4(depth0,data) {
	  
	  var buffer = "";
	  buffer += "\r\n				<div class=\"col-sm-3\">\r\n					<button class=\"btn btn-default\" id=\""
	    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
	    + "Btn\">"
	    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
	    + "</button>\r\n				</div>\r\n			";
	  return buffer;
	  }
	
	function program6(depth0,data) {
	  
	  var buffer = "";
	  buffer += "\r\n				<button class=\"btn btn-default\" id=\""
	    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
	    + "Btn\">"
	    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
	    + "</button>\r\n			";
	  return buffer;
	  }
	
	  buffer += "<div class=\"panel panel-default\">\r\n\r\n	<div class=\"panel-heading fn-relative\">\r\n\r\n		<div class=\"panel-title\">";
	  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
	  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
	  buffer += escapeExpression(stack1)
	    + "</div>\r\n\r\n		";
	  stack1 = helpers['if'].call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
	  if(stack1 || stack1 === 0) { buffer += stack1; }
	  buffer += "\r\n\r\n		<div class=\"btn-group fn-toolbar\">\r\n			";
	  stack1 = helpers.each.call(depth0, (depth0 && depth0.toolbar), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
	  if(stack1 || stack1 === 0) { buffer += stack1; }
	  buffer += "\r\n		</div>\r\n\r\n	</div>\r\n\r\n	<div class=\"panel-body\">\r\n		";
	  if (helper = helpers.bodyTpl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
	  else { helper = (depth0 && depth0.bodyTpl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
	  if(stack1 || stack1 === 0) { buffer += stack1; }
	  buffer += "\r\n	</div>\r\n\r\n</div>";
	  return buffer;
	  });

/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*globals Handlebars: true */
	var base = __webpack_require__(1);
	
	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)
	var SafeString = __webpack_require__(4)["default"];
	var Exception = __webpack_require__(2)["default"];
	var Utils = __webpack_require__(3);
	var runtime = __webpack_require__(9);
	
	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	var create = function() {
	  var hb = new base.HandlebarsEnvironment();
	
	  Utils.extend(hb, base);
	  hb.SafeString = SafeString;
	  hb.Exception = Exception;
	  hb.Utils = Utils;
	
	  hb.VM = runtime;
	  hb.template = function(spec) {
	    return runtime.template(spec, hb);
	  };
	
	  return hb;
	};
	
	var Handlebars = create();
	Handlebars.create = create;
	
	exports["default"] = Handlebars;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(3);
	var Exception = __webpack_require__(2)["default"];
	var COMPILER_REVISION = __webpack_require__(1).COMPILER_REVISION;
	var REVISION_CHANGES = __webpack_require__(1).REVISION_CHANGES;
	
	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = COMPILER_REVISION;
	
	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = REVISION_CHANGES[currentRevision],
	          compilerVersions = REVISION_CHANGES[compilerRevision];
	      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
	            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
	            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
	    }
	  }
	}
	
	exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial
	
	function template(templateSpec, env) {
	  if (!env) {
	    throw new Exception("No environment passed to template");
	  }
	
	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
	    var result = env.VM.invokePartial.apply(this, arguments);
	    if (result != null) { return result; }
	
	    if (env.compile) {
	      var options = { helpers: helpers, partials: partials, data: data };
	      partials[name] = env.compile(partial, { data: data !== undefined }, env);
	      return partials[name](context, options);
	    } else {
	      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
	    }
	  };
	
	  // Just add water
	  var container = {
	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,
	    programs: [],
	    program: function(i, fn, data) {
	      var programWrapper = this.programs[i];
	      if(data) {
	        programWrapper = program(i, fn, data);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = program(i, fn);
	      }
	      return programWrapper;
	    },
	    merge: function(param, common) {
	      var ret = param || common;
	
	      if (param && common && (param !== common)) {
	        ret = {};
	        Utils.extend(ret, common);
	        Utils.extend(ret, param);
	      }
	      return ret;
	    },
	    programWithDepth: env.VM.programWithDepth,
	    noop: env.VM.noop,
	    compilerInfo: null
	  };
	
	  return function(context, options) {
	    options = options || {};
	    var namespace = options.partial ? options : env,
	        helpers,
	        partials;
	
	    if (!options.partial) {
	      helpers = options.helpers;
	      partials = options.partials;
	    }
	    var result = templateSpec.call(
	          container,
	          namespace, context,
	          helpers,
	          partials,
	          options.data);
	
	    if (!options.partial) {
	      env.VM.checkRevision(container.compilerInfo);
	    }
	
	    return result;
	  };
	}
	
	exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
	  var args = Array.prototype.slice.call(arguments, 3);
	
	  var prog = function(context, options) {
	    options = options || {};
	
	    return fn.apply(this, [context, options.data || data].concat(args));
	  };
	  prog.program = i;
	  prog.depth = args.length;
	  return prog;
	}
	
	exports.programWithDepth = programWithDepth;function program(i, fn, data) {
	  var prog = function(context, options) {
	    options = options || {};
	
	    return fn(context, options.data || data);
	  };
	  prog.program = i;
	  prog.depth = 0;
	  return prog;
	}
	
	exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
	  var options = { partial: true, helpers: helpers, partials: partials, data: data };
	
	  if(partial === undefined) {
	    throw new Exception("The partial " + name + " could not be found");
	  } else if(partial instanceof Function) {
	    return partial(context, options);
	  }
	}
	
	exports.invokePartial = invokePartial;function noop() { return ""; }
	
	exports.noop = noop;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(8);


/***/ },
/* 11 */
/***/ function(module, exports) {

	/* ========================================================================
	 * Jslet framework: jslet.global.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	if (!jslet.rootUri) {
	    var ohead = document.getElementsByTagName('head')[0], 
	        uri = ohead.lastChild.src;
	    if(uri) {
		    uri = uri.substring(0, uri.lastIndexOf('/') + 1);
		    jslet.rootUri = uri;
	    }
	}
	jslet.global = {
		version: '3.0.0',
		
		//Used in jslet.data.Dataset_applyChanges
		changeStateField: 'rs',
		
		//Used in jslet.data.Dataset_selected
		selectStateField: '_sel_',
		
		//Value separator
		valueSeparator: ',',
		
		defaultRecordClass: null,
		
		defaultFocusKeyCode: 9,
		
		defaultCharWidth: 12,
		
		debugMode: true
	};
	
	/**
	 * Global server error handler
	 * 
	 * @param {String} errCode, error code
	 * @param {String} errMsg,  error message
	 * 
	 * @return {Boolean} Identify if handler catch this error, if catched, the rest handler will not process it.
	 */
	jslet.global.serverErrorHandler = function(errCode, errMsg) {
		return false;
	}
	
	/**
	 * Global event handler for jQuery.ajax, you can set settings here.
	 * 
	 * @param {Plan Object} settings jQuery.ajax settings.
	 * 
	 * @return {Plan Object} jQuery.ajax settings, @see http://api.jquery.com/jQuery.ajax/.
	 * 			Attension: 
	 * 			the following attributes can not be set: type, contentType, mimeType, dataType, data, context.
	 */
	jslet.global.beforeSubmit = function(settings) {
		
		return settings;
	}
	
	
	
	/* ========================================================================
	 * Jslet framework: jslet.class.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * the below code from prototype.js(http://prototypejs.org/) 
	 */
	jslet.toArray = function(iterable) {
		if (!iterable) {
			return [];
		}
		if ('toArray' in Object(iterable)) {
			return iterable.toArray();
		}
		var length = iterable.length || 0, results = new Array(length);
		while (length--) {
			results[length] = iterable[length];
		}
		return results;
	};
	
	jslet.extend = function(destination, source) {
		for ( var property in source) {
			destination[property] = source[property];
		}
		return destination;
	};
	
	jslet.emptyFunction = function() {
	};
	
	jslet.keys = function(object) {
		if ((typeof object) != 'object') {
			return [];
		}
		var results = [];
		for ( var property in object) {
			if (object.hasOwnProperty(property)) {
				results.push(property);
			}
		}
		return results;
	};
	
	jslet.extend(Function.prototype,
			(function() {
				var slice = Array.prototype.slice;
	
				function update(array, args) {
					var arrayLength = array.length, length = args.length;
					while (length--) {
						array[arrayLength + length] = args[length];
					}
					return array;
				}
	
				function merge(array, args) {
					array = slice.call(array, 0);
					return update(array, args);
				}
	
				function argumentNames() {
					var names = this.toString().match(
							/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(
							/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(
							/\s+/g, '').split(',');
					return names.length == 1 && !names[0] ? [] : names;
				}
	
				function bind(context) {
					if (arguments.length < 2 && (typeof arguments[0] === 'undefined')) {
						return this;
					}
					var __method = this, args = slice.call(arguments, 1);
					return function() {
						var a = merge(args, arguments);
						return __method.apply(context, a);
					};
				}
	
				function bindAsEventListener(context) {
					var __method = this, args = slice.call(arguments, 1);
					return function(event) {
						var a = update( [ event || window.event ], args);
						return __method.apply(context, a);
					};
				}
	
				function curry() {
					if (!arguments.length) {
						return this;
					}
					var __method = this, args = slice.call(arguments, 0);
					return function() {
						var a = merge(args, arguments);
						return __method.apply(this, a);
					};
				}
	
				function delay(timeout) {
					var __method = this, args = slice.call(arguments, 1);
					timeout = timeout * 1000;
					return window.setTimeout(function() {
						return __method.apply(__method, args);
					}, timeout);
				}
	
				function defer() {
					var args = update( [ 0.01 ], arguments);
					return this.delay.apply(this, args);
				}
	
				function wrap(wrapper) {
					var __method = this;
					return function() {
						var a = update( [ __method.bind(this) ], arguments);
						return wrapper.apply(this, a);
					};
				}
	
				function methodize() {
					if (this._methodized) {
						return this._methodized;
					}
					var __method = this;
					this._methodized = function() {
						var a = update( [ this ], arguments);
						return __method.apply(null, a);
					};
					return this._methodized;
				}
	
				return {
					argumentNames : argumentNames,
					bind : bind,
					bindAsEventListener : bindAsEventListener,
					curry : curry,
					delay : delay,
					defer : defer,
					wrap : wrap,
					methodize : methodize
				};
			})());
	
	/* Based on Alex Arnell's inheritance implementation. */
	jslet.Class = (function() {
	
		var IS_DONTENUM_BUGGY = (function() {
			for ( var p in {
				toString : 1
			}) {
				if (p === 'toString') {
					return false;
				}
			}
			return true;
		})();
	
		function subclass() {
		}
		
		function create() {
			var parent = null, properties = jslet.toArray(arguments);
			if (jQuery.isFunction(properties[0])) {
				parent = properties.shift();
			}
			function klass() {
				this.initialize.apply(this, arguments);
			}
	
			jslet.extend(klass, jslet.Class.Methods);
			klass.superclass = parent;
			klass.subclasses = [];
	
			if (parent) {
				subclass.prototype = parent.prototype;
				klass.prototype = new subclass();
				parent.subclasses.push(klass);
			}
	
			for ( var i = 0, length = properties.length; i < length; i++) {
				klass.addMethods(properties[i]);
			}
			if (!klass.prototype.initialize) {
				klass.prototype.initialize = jslet.emptyFunction;
			}
			klass.prototype.constructor = klass;
			return klass;
		}
	
		function addMethods(source) {
			var ancestor = this.superclass && this.superclass.prototype, properties = jslet
					.keys(source);
	
			if (IS_DONTENUM_BUGGY) {
				if (source.toString != Object.prototype.toString) {
					properties.push('toString');
				}
				if (source.valueOf != Object.prototype.valueOf) {
					properties.push('valueOf');
				}
			}
	
			for ( var i = 0, length = properties.length; i < length; i++) {
				var property = properties[i], value = source[property];
				if (ancestor && jQuery.isFunction(value) && value.argumentNames()[0] == '$super') {
					var method = value;
					value = (function(m) {
						return function() {
							return ancestor[m].apply(this, arguments);
						};
					})(property).wrap(method);
	
					value.valueOf = method.valueOf.bind(method);
					value.toString = method.toString.bind(method);
				}
				this.prototype[property] = value;
			}
	
			return this;
		}
	
		return {
			create : create,
			Methods : {
				addMethods : addMethods
			}
		};
	})();
	/* end Prototype code */
	
	/* ========================================================================
	 * Jslet framework: jslet.common.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	if (window.jslet === undefined || jslet === undefined){
		/**
		 * Root object/function of jslet framework. Example:
		 * <pre><code>
		 * var jsletObj = jslet('#tab');
		 * </code></pre>
		 * @param {String} Html tag id, like '#id'
		 * 
		 * @return {Object} jslet object of the specified Html tag
		 */
	    jslet=window.jslet = function(id){
	        var ele = jQuery(id)[0];
	        return (ele && ele.jslet) ? ele.jslet : null;
	    };
	}
	
	jslet._AUTOID = 0;
	jslet.nextId = function(){
		return 'jslet' + (jslet._AUTOID++);
	};
	
	/**
	 * Namespace
	 */
	if(!jslet.data) {
		jslet.data = {};
	}
	
	if(!jslet.locale) {
		jslet.locale={};
	}
	if(!jslet.temp) {
		jslet.temp = {};
	}
	
	//if (!jslet.rootUri) {
	//    var ohead = document.getElementsByTagName('head')[0], uri = ohead.lastChild.src;
	//    uri = uri.substring(0, uri
	//					.lastIndexOf('/')
	//					+ 1);
	//    jslet.rootUri = uri
	//}
	
	/**
	 * Javascript language enhancement
	 */
	if(!Array.indexOf){
		Array.prototype.indexOf = function(value){
			for(var i = 0, cnt = this.length; i < cnt; i++){
				if(this[i] == value)
					return i;
			}
			return -1;
		};
	}
	
	if(!Object.deepClone){
		
		/**
		 * Deep clone object.
		 * <pre><code>
	     *     var obj = {attr1: 'aaa', attr2: 123, attr3: {y1: 12, y2:'test'}};
	     *  var objClone = obj.deepClone();
	     * </code></pre>
	     * 
	     */
		/*
	    Object.prototype.deepClone = function(){
	        var objClone;
	        if (this.constructor == Object){
	            objClone = new this.constructor(); 
	        }else{
	            objClone = new this.constructor(this.valueOf()); 
	        }
	        for(var key in this){
	            if ( objClone[key] != this[key] ){ 
	                if ( typeof(this[key]) == 'object' ){ 
	                    objClone[key] = this[key].deepClone();
	                }else{
	                    objClone[key] = this[key];
	                }
	            }
	        }
	        objClone.toString = this.toString;
	        objClone.valueOf = this.valueOf;
	        return objClone; 
	    } */
	}
	
	if(!String.prototype.trim){
		String.prototype.trim = function(){
			this.replace(/^\s+/, '').replace(/\s+$/, '');
		}	;
	}
	
	if(!String.prototype.startsWith){
		String.prototype.startsWith = function(pattern) {
			return this.lastIndexOf(pattern, 0) === 0;
		};
	}
	
	if(!String.prototype.endsWith){
		//From Prototype.js
		String.prototype.endsWith = function(pattern){
	        var d = this.length - pattern.length;
	        return d >= 0 && this.indexOf(pattern, d) === d;
		};
	}
	
	
	jslet.debounce = function(func, wait, immediate) {
		var timeoutHander;
		return function() {
			var context = this, args = arguments;
			if(!wait) {
				func.apply(context, args);
				return;
			}
			var later = function() {
				timeoutHander = null;
				func.apply(context, args);
			};
			if(timeoutHander) {
				clearTimeout(timeoutHander);
			}
			timeoutHander = setTimeout(later, wait);
		};
	};
	
	/*
	 * Javascript language enhancement(end)
	 */
	
	jslet.deepClone = function(srcObj){
	    var objClone;
	    if (srcObj.constructor == Object){
	        objClone = new srcObj.constructor(); 
	    } else {
	        objClone = new srcObj.constructor(srcObj.valueOf()); 
	    }
	    for(var key in srcObj){
	        if ( objClone[key] != srcObj[key] ){ 
	            if ( typeof(srcObj[key]) == 'object' ){ 
	                objClone[key] = srcObj[key].deepClone();
	            } else {
	                objClone[key] = srcObj[key];
	            }
	        }
	    }
	    objClone.toString = srcObj.toString;
	    objClone.valueOf = srcObj.valueOf;
	    return objClone; 
	};
	                                        
	/**
	 * A simple map for Key/Value data. Example:
	 * <pre><code>
	 * var map = new jslet.SimpleMap();
	 * map.set('background', 'red');
	 * var color = map.get('background');//return 'red'
	 * </code></pre>
	 */
	jslet.SimpleMap = function () {
	    var _keys = [], _values = [];
	    this.get = function (key) {
	        var len = _keys.length;
	        for (var i = 0; i < len; i++) {
	            if (key == _keys[i]) {
	                return _values[i];
	            }
	        }
	        return null;
	    };
	
	    this.set = function (key, value) {
	        var k = _keys.indexOf(key);
	        if(k >=0){
	            _values[k] = value;
	        } else {
	            _keys.push(key);
	            _values.push(value);
	        }
	    };
	
	    this.clear = function () {
	        _keys.length = 0;
	        _values.length = 0;
	    };
	
	    this.unset = function (key) {
	        var len = _keys.length;
	        for (var i = 0; i < len; i++) {
	            if (_keys[i] == key) {
	                _keys.splice(i, 1);
	                _values.splice(i, 1);
	                return;
	            }
	        }
	    };
	
	    this.count = function () {
	        return _keys.length;
	    };
	
	    this.keys = function () {
	        return _keys;
	    };
	    
	    this.values = function() {
	    	return _values;
	    }
	};
	
	/**
	 * format message with argument. Example:
	 * <pre><code>
	 * var msg = jslet.formatString('Your name is:{0}', 'Bob');//return: your name is: Bob
	 * var msg = jslet.formatString('They are:{0} and {1}', ['Jerry','Mark']);
	 * </code></pre>
	 * 
	 * @param {String} Initial message, placeholder of argument is {n}, n is number 
	 * @param {String/Array of String} args arguments
	 * @return formatted message
	 */
	jslet.formatString = function (msg, args) {
		jslet.Checker.test('jslet.formatString#msg', msg).required().isString();
	    if(args === undefined || args === null) {
	    	return msg; 
	    }
	    if(args === false) {
	    	args = 'false';
	    }
	    if(args === true) {
	    	args = 'true';
	    }
	    var result = msg, cnt, i;
	    if (jslet.isArray(args)) {// array
	        cnt = args.length;
	        for (i = 0; i < cnt; i++) {
	            result = result.replace('{' + i + '}', args[i]);
	        }
	    } else if(args.keys){// Hash
	        var arrKeys = args.keys(), sKey;
	        cnt = arrKeys.length;
	        for (i = 0; i < cnt; i++) {
	            sKey = arrKeys[i];
	            result = result.replace('{' + sKey + '}', args.get(sKey));
	        }
	    } else {
	    	return msg.replace('{0}', args);
	    }
	    return result;
	};
	
	/**
	 * private constant value
	 */
	jslet._SCALEFACTOR = '100000000000000000000000000000000000';
	
	/**
	 * Format a number. Example:
	 * <pre><code>
	 * var strNum = formatNumber(12345.999,'#,##0.00'); //return '12,346.00'
	 * var strNum = formatNumber(12345.999,'#,##0.##'); //return '12,346'
	 * var strNum = formatNumber(123,'000000'); //return '000123'
	 * </code></pre>
	 * 
	 * 
	 * @param {Number} num number that need format 
	 * @param {String} pattern pattern for number, like '#,##0.00'
	 *  # - not required
	 *  0 - required, if the corresponding digit of the number is empty, fill in with '0'
	 *  . - decimal point
	 *
	 * @return {String}
	 */
	jslet.formatNumber = function(num, pattern) {
		if (!pattern) {
			return num;
		}
		if(!num && num !== 0) {
			return '';
		}
		var preFix = '', c, i;
		for (i = 0; i < pattern.length; i++) {
			c = pattern.substr(i, 1);
			if (c == '#' || c == '0' || c == ',') {
				if (i > 0) {
					preFix = pattern.substr(0, i);
					pattern = pattern.substr(i);
				}
				break;
			}
		}
	
		var suffix = '';
		for (i = pattern.length - 1; i >= 0; i--) {
			c = pattern.substr(i, 1);
			if (c == '#' || c == '0' || c == ',') {
				if (i > 0) {
					suffix = pattern.substr(i + 1);
					pattern = pattern.substr(0, i + 1);
				}
				break;
			}
		}
	
		var fmtarr = pattern ? pattern.split('.') : [''],fmtDecimalLen = 0;
		if (fmtarr.length > 1) {
			fmtDecimalLen = fmtarr[1].length;
		}
		var strarr = num ? num.toString().split('.') : ['0'],dataDecimalLen = 0;
		if (strarr.length > 1) {
			dataDecimalLen = strarr[1].length;
		}
		if (dataDecimalLen > fmtDecimalLen) {
			var factor = parseInt(jslet._SCALEFACTOR.substring(0, fmtDecimalLen + 1));
			num = Math.round(num * factor) / factor;
			strarr = num ? num.toString().split('.') : ['0'];
		}
		var retstr = '',
		str = strarr[0],
		fmt = fmtarr[0],
		comma = false,
		k = str.length - 1,
		f;
		for (f = fmt.length - 1; f >= 0; f--) {
			switch (fmt.substr(f, 1)) {
				case '#' :
					if (k >= 0) {
						retstr = str.substr(k--, 1) + retstr;
					}
					break;
				case '0' :
					if (k >= 0) {
						retstr = str.substr(k--, 1) + retstr;
					} else {
						retstr = '0' + retstr;
					}
					break;
				case ',' :
					comma = true;
					retstr = ',' + retstr;
					break;
			}
		}
		if (k >= 0) {
			if (comma) {
				var l = str.length;
				for (; k >= 0; k--) {
					retstr = str.substr(k, 1) + retstr;
					if (k > 0 && ((l - k) % 3) === 0) {
						retstr = ',' + retstr;
					}
				}
			} else {
				retstr = str.substr(0, k + 1) + retstr;
			}
		}
	
		retstr = retstr + '.';
	
		str = strarr.length > 1 ? strarr[1] : '';
		fmt = fmtarr.length > 1 ? fmtarr[1] : '';
		k = 0;
		for (f = 0; f < fmt.length; f++) {
			switch (fmt.substr(f, 1)) {
				case '#' :
					if (k < str.length) {
						retstr += str.substr(k++, 1);
					}
					break;
				case '0' :
					if (k < str.length) {
						retstr += str.substr(k++, 1);
					} else {
						retstr += '0';
					}
					break;
			}
		}
		return preFix + retstr.replace(/^,+/, '').replace(/\.$/, '') + suffix;
	};
	
	/**
	 * Format date with specified format. Example:
	 * <pre><code>
	 * var date = new Date();
	 * console.log(jslet.formatDate(date, 'yyyy-MM-dd'));//2012-12-21
	 * </code></pre>
	 * 
	 * @param {Date} date value.
	 * @param {String} date format.
	 * @return {String} String date after format
	 */
	jslet.formatDate = function(date, format) {
		if(!date) {
			return '';
		}
		jslet.Checker.test('jslet.formatDate#date', date).isDate();
		jslet.Checker.test('jslet.formatDate#format', format).required().isString();
		var o = {
			'M+' : date.getMonth() + 1, // month
			'd+' : date.getDate(), // day
			'h+' : date.getHours(), // hour
			'm+' : date.getMinutes(), // minute
			's+' : date.getSeconds(), // second
			'q+' : Math.floor((date.getMonth() + 3) / 3), // quarter
			'S' : date.getMilliseconds()
			// millisecond
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, 
					(date.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(RegExp.$1, 
					RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return format;
	};
	
	/**
	 * Parse a string to Date object. Example
	 * <pre><code>
	 * var date = jslet.parseDate('2013-03-25', 'yyyy-MM-dd');
	 * var date = jslet.parseDate('2013-03-25 15:20:18', 'yyyy-MM-dd hh:mm:ss');
	 * 
	 * </code></pre>
	 * 
	 * @param {String} strDate String date
	 * @param {String} format Date format, like: 'yyyy-MM-dd hh:mm:ss'
	 * @return Date Object
	 */
	jslet.parseDate = function(strDate, format) {
		if(!strDate) {
			return null;
		}
		jslet.Checker.test('jslet.parseDate#strDate', strDate).isString();
		jslet.Checker.test('jslet.parseDate#format', format).required().isString();
		
		var preChar = null, ch, v, 
			begin = -1, 
			end = 0;
		var dateParts = {'y': 0, 'M': 0,'d': 0, 'h': 0,	'm': 0, 's': 0, 'S': 0};
		
		for(var i = 0, len = format.length; i < len; i++) {
			ch = format.charAt(i);
		
			if(ch != preChar) {
				if(preChar && dateParts[preChar] !== undefined && begin >= 0) {
					end = i;
					v = parseInt(strDate.substring(begin, end));
					dateParts[preChar] = isNaN(v)?0:v;
				}
				begin = i;
				preChar = ch;
			}
		}
		if(begin >= 0) {
			v = parseInt(strDate.substring(begin));
			dateParts[ch] = isNaN(v)?0:v;
		}
		var year = dateParts.y;
		if(year < 100) {
			year += 2000;
		}
		var result = new Date(year, dateParts.M - 1, dateParts.d, dateParts.h, dateParts.m, dateParts.s, dateParts.S);
		return result;
	};
	
	/**
	 * Convert Date to SO8601
	 */
	Date.prototype.toJSON = function() {
		return jslet.formatDate(this, 'yyyy-MM-ddThh:mm:ss');
	}
	
	/**
	 * Convert string(ISO date format) to date
	 * 
	 * @param {String} dateStr date string with ISO date format. Example: 2012-12-21T09:30:24Z
	 * @return {Date} 
	 */
	jslet.convertISODate= function(dateStr) {
		if(!dateStr) {
			return null;
		}
		if(jslet.isDate(dateStr)) {
			return dateStr;
		}
		var flag = dateStr.substr(10,1);
		if('T' == flag) {
			var year = dateStr.substr(0,4),
			month = dateStr.substr(5,2),
			day = dateStr.substr(8,2),
			hour = dateStr.substr(11,2),
			minute = dateStr.substr(14,2),
			second = dateStr.substr(17,2);
			if('Z' == dateStr.substr(-1,1)) {
				return new Date(Date.UTC(+year, +month - 1, +day, +hour,
						+minute, +second));
			}
			return new Date(+year, +month - 1, +day, +hour,
					+minute, +second);
		}
	    return dateStr;
	};
	
	/**
	 * private variable for convertToJsPattern,don't use it in your program
	 */
	jslet._currentPattern = {};
	
	/**
	 * private variable for convertToJsPattern,don't use it in your program
	 * Convert sql pattern to javascript pattern
	 * 
	 * @param {String} pattern sql pattern
	 * @param {String} escapeChar default is '\'
	 * @return {String} js regular pattern
	 */
	jslet._convertToJsPattern = function(pattern, escapeChar) {
		if (jslet._currentPattern.pattern == pattern && 
				jslet._currentPattern.escapeChar == escapeChar) {
			return jslet._currentPattern.result;
		}
		jslet._currentPattern.pattern = pattern;
		jslet._currentPattern.escapeChar = escapeChar;
	
		var jsPattern = [],
			len = pattern.length - 1,
			c, 
			nextChar,
			bgn = 0, 
			end = len,
			hasLeft = false,
			hasRight = false;
		if (pattern.charAt(0) == '%'){
	       bgn = 1;
	       hasLeft = true;
	    }
	    if (pattern.charAt(len) == '%'){
	       end = len - 1;
	       hasRight = true;
	    }
	    if (hasLeft && hasRight){
	       jsPattern.push('.*');
	    }
	    else if (hasRight){
	       jsPattern.push('^');
	    }
		for (var i = bgn; i <= end; i++) {
			c = pattern.charAt(i);
			if (c == '\\' && i < len) {
				nextChar = pattern.charAt(i + 1);
				if (nextChar == '%' || nextChar == '_') {
					jsPattern.push(nextChar);
					i++;
					continue;
				}
			} else if (c == '_') {
				jsPattern.push('.');
			} else {
				if (c == '.' || c == '*' || c == '[' || c == ']' || 
						c == '{' || c == '}' || c == '+' || c == '(' || 
						c == ')' || c == '\\' || c == '?' || c == '$' || c == '^')
					jsPattern.push('\\');
				jsPattern.push(c);
			}
		}// end for
		if (hasLeft && hasRight || hasRight){
	       jsPattern.push('.*');
	    } else if (hasLeft){
	       jsPattern.push('$');
	    }
	
	    jslet._currentPattern.result = new RegExp(jsPattern.join(''), 'ig');
		return jslet._currentPattern.result;
	};
	
	/**
	 *  Test if  the value to match pattern or not,for example:
	 *  like('abc','%b%') -> true, like('abc','%b') -> false 
	 *  
	 *  @param {String} testValue need to test value
	 *  @param {String} pattern sql pattern, syntax like SQL
	 *  @return {Boolean} True if matched, false otherwise
	 */
	jslet.like = like = window.like = function(testValue, pattern, escapeChar) {
		if (!testValue || !pattern) {
			return false;
		}
		if (pattern.length === 0) {
			return false;
		}
		if (!escapeChar) {
			escapeChar = '\\';
		}
		var jsPattern = jslet._convertToJsPattern(pattern, escapeChar);
		if(!jslet.isString(testValue)) {
			testValue += '';
		}
		return testValue.match(jsPattern) !== null;
	};
	
	/**
	 * Between function, all parameters' type must be same. Example:
	 * <pre><code>
	 * return between(4,2,5) //true
	 * return between('c','a','b') // false
	 * </code></pre>
	 * 
	 * @param {Object} testValue test value
	 * @param {Object} minValue minimum value
	 * @param {Object} maxValue maximum value
	 * @return {Boolean} True if matched, false otherwise
	 */
	jslet.between = between = window.between = function(testValue, minValue, maxValue) {
		if (arguments.length != 3) {
			return false;
		}
		return testValue >= minValue && testValue <= maxValue;
	};
	
	/**
	 * Test if the value is in the following list. Example:
	 * <pre><code>
	 * return inlist('a','c','d','e') // false
	 * 
	 * </code></pre>
	 * @param {Object} testValue test value
	 * @param {Object} valueList - one or more arguments
	 * @return {Boolean} True if matched, false otherwise
	 */
	jslet.inlist = inlist = window.inlist = function(testValue, valueList) {
		var cnt = arguments.length;
		if (cnt <= 2) {
			return false;
		}
		for (var i = 1; i < cnt; i++) {
			if (testValue == arguments[i]) {
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Test if the given value is an array.
	 * 
	 * @param {Object} testValue test value
	 * @return {Boolean} True if the given value is an array, false otherwise
	 */
	jslet.isArray = function (testValue) {
	    return !testValue || Object.prototype.toString.apply(testValue) === '[object Array]';
	};
	
	/**
	 * Test if the given value is date object.
	 * 
	 * @param {Object} testValue test value
	 * @return {Boolean} True if the given value is date object, false otherwise
	 */
	jslet.isDate = function(testValue) {
		return !testValue || testValue.constructor == Date;
	};
	
	/**
	 * Test if the given value is a string object.
	 * 
	 * @param {Object} testValue test value
	 * @return {Boolean} True if the given value is String object, false otherwise
	 */
	jslet.isString = function(testValue) {
		return testValue === null || testValue === undefined || typeof testValue == 'string';
	};
	
	jslet.isObject = function(testValue) {
		return testValue === null || testValue === undefined || jQuery.type(this.varValue) !== "object";	
	}
	
	jslet.setTimeout = function(obj, func, time) {
	    jslet.delayFunc = function () {
	        func.call(obj);
	    };
	    setTimeout(jslet.delayFunc, time);
	};
	
	/**
	 * Encode html string. Example:
	 * <pre><code>
	 * return jslet.htmlEncode('<div />') // 'lt;div /gt;'
	 * </code></pre>
	 * 
	 * @param {String} htmlText html text
	 * @return {String}
	 */
	jslet.htmlEncode = function(htmlText){
	    if (htmlText) {
	        return jQuery('<div />').text(htmlText).html();
	    } else {
	        return '';
	    }
	};
	
	/**
	 * Decode html string. Example:
	 * <pre><code>
	 * return jslet.htmlDecode('lt;div /gt;') // '<div />'
	 * </code></pre>
	 * 
	 * @param {String} htmlText encoded html text
	 * @return {String}
	 */
	jslet.htmlDecode = function(htmlText) {
	    if (htmlText) {
	        return jQuery('<div />').html(htmlText).text();
	    } else {
	        return '';
	    }
	};
	
	/**
	 * Get a array item safely. Example:
	 * <pre><code>
	 * var arrValues = ['a','b'];
	 * jslet.getArrayValue(arrValues, 1); // return 'b'
	 * jslet.getArrayValue(arrValues, 3); // return null
	 * </code></pre>
	 * 
	 * @param {Array of Object} arrValues  a array of values
	 * @param {Integer} index index of wanted to get item
	 * @return {Object}
	 */
	jslet.getArrayValue = function(arrValues, index) {
		if(!arrValues) {
			return null;
		}
			
	    if(jslet.isArray(arrValues)){
	        var len = arrValues.length;
	        if(index < len) {
	            return arrValues[index];
	        } else {
	            return null;
	        }
	    } else {
	        if(index === 0) {
	            return arrValues;
	        } else {
	            return null;
	        }
	    }
	};
	
	jslet.Checker = {
		varName: null,
		varValue: null,
		
		test: function(varName, varValue) {
			this.varName = varName;
			this.varValue = varValue;
			return this;
		},
		
		testValue: function(varValue) {
			this.varValue = varValue;
			return this;
		},
		
		required: function() {
			if(this.varValue === null || this.varValue === undefined || this.varValue === '') {
				throw new Error('[' + this.varName + '] is Required!');
			}
			return this;
		},
		
		isBoolean: function() {
			if(this.varValue !== null && 
			   this.varValue !== undefined &&
			   this.varValue !== '' &&
			   this.varValue !== 0 && 
			   this.varValue !== true && 
			   this.varValue !== false) {
				throw new Error('[' + this.varName + '] must be a boolean value!');
			}
			return this;
		},
		
		isString: function() {
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				!jslet.isString(this.varValue)) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be a String!');
			}
			return this;
		},
		
		isDate: function() {
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				!jslet.isDate(this.varValue)) {
				throw new Error('[' + this.varName + '] must be a Date!');
			}
			return this;
		},
		
		isNumber: function() {
			if(this.varValue !== null && 
				this.varValue !== undefined && 
				this.varValue !== false &&
				!jQuery.isNumeric(this.varValue)) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be a Numberic!');
			}
			return this;
		},
		
		isGTZero: function() {
			this.isNumber();
			if(this.varValue <= 0) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be great than zero!');
			}
		},
		
		isGTEZero: function() {
			this.isNumber();
			if(this.varValue < 0) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be great than or equal zero!');
			}
		},
		between: function(minValue, maxValue) {
			var checkMin = minValue !== null && minValue !== undefined;
			var checkMax = maxValue !== null && maxValue !== undefined;
			if(checkMin && checkMax && (this.varValue < minValue || this.varValue > maxValue)) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be between [' + 
						minValue + '] and [' + maxValue + ']!');
			}
			if(!checkMin && checkMax && this.varValue > maxValue) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be less than [' + maxValue + ']!');
			}
			if(checkMin && !checkMax && this.varValue < minValue) {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be great than [' + minValue + ']!');
			}
		},
		
		isArray: function() {
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				!jslet.isArray(this.varValue)) {
				throw new Error('[' + this.varName + '] must be an Array!');
			}
			return this;
		},
		
		isObject: function() {
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				jQuery.type(this.varValue) !== "object") {
				throw new Error('[' + this.varName + '] must be a Object!');
			}
			return this;
		},
		
		isPlanObject: function() {
			if(this.varValue !== null && 
					this.varValue !== undefined &&
					this.varValue !== false &&
					!jQuery.isPlainObject(this.varValue)) {
					throw new Error('[' + this.varName + '] must be a plan object!');
			}
			return this;
					
		},
		
		isFunction: function() {
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
	//			(typeof this.varValue == 'function') ){
				!jQuery.isFunction(this.varValue)) {
				throw new Error('[' + this.varName + '] must be a Function!');
			}
			return this;
		},
		
		isClass: function(className) {
			this.isObject();
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				this.varValue.className != className)   {
				throw new Error('[' + this.varName + '] must be instance of [' + className+ ']!');
			}
			return this;
		},
		
		isDataType: function(dataType) {
			if(dataType == 'S') {
				this.isString();
			}
			if(dataType == 'N') {
				this.isNumber();
			}
			if(dataType == 'D') {
				this.isDate();
			}
			return this;
		},
		
		inArray: function(arrlist) {
			if(this.varValue !== null && 
				this.varValue !== undefined &&
				this.varValue !== false &&
				arrlist.indexOf(this.varValue) < 0)   {
				throw new Error('[' + this.varName + ':' + this.varValue + '] must be one of [' + arrlist.join(',') + ']!');
			}
			return this;
		}
	
	};
	
	jslet.JSON = {
		normalize: function (json) {
			//json = jQuery.trim(json);
			var result = [], c, next, isKey = false, isArray = false, isObj = true, last = '', quoteChar = null;
			var c = json.charAt(0), append = false;
			if(c != '{' && c != '[') {
				result.push('{"');
				append = true;
			}		
			for(var i = 0, len = json.length; i< len; i++) {
				c = json.charAt(i);
				
				if(quoteChar) {//Not process any char in a String value. 
					if(c == quoteChar) {
						quoteChar = null;
						result.push('"');
						last = '"';
					} else {
						result.push(c);
					}
					continue;
				}
				if(c == '[') {
					isArray = true;
					isObj = false;
				}
				if(c == ']' || c == '{') {
					isArray = false;
					isObj = true;
				}
				if(isKey && (c == ' ' || c == '\b')) {//Trim blank char in a key.
					continue;
				}
				if(isObj && (c == '{' || c == ',')) {
					isKey = true;
					result.push(c);
					last = c;
					continue;
				}
				if(last == '{' || last == ',') {
					result.push('"');
				}
				if(isKey && c == "'") {
					result.push('"');
					continue;
				}
				if(c == ':') {
					isKey = false;
					if(last != '"') {
						result.push('"');
					}
				}
				if(!isKey) {
					if(c == "'" || c == '"') {
						quoteChar = c;
						result.push('"');
						continue;
					}
				}
				last = c;
				result.push(c);
			}
			if(append) {
				result.push('}');
			}
			return result.join('');
		},
		
		parse: function(json) {
			try {
	//			return JSON.parse(this.normalize(json));//has bug
				return JSON.parse(json);
			} catch(e) {
				throw new Error(jslet.formatString(jslet.locale.Common.jsonParseError, [json]));
			}
		},
		
		stringify: function(value, replacer, space) {
			return JSON.stringify(value, replacer, space);
		}
	
	};
	
	/**
	 * Get specified function with function object or function name.
	 * 
	 * @param {String or function} funcOrFuncName If its value is function name, find this function in window context.
	 * @param {Object} context the context which looking for function in.
	 * @return {function}
	 */
	jslet.getFunction = function(funcOrFuncName, context) {
		if(!funcOrFuncName) {
			return null;
		}
		if(jQuery.isFunction(funcOrFuncName)) {
			return funcOrFuncName;
		}
		if(!context) {
			context = window;
		}
		
		var result = context[funcOrFuncName];
		if(!result) {
			console.warn('NOT found function:' + funcOrFuncName);
		}
		return result;
	}
	
	jslet.getRemainingString = function(wholeStr, cuttingStr) {
		if(!wholeStr || !cuttingStr) {
			return wholeStr;
		}
		return wholeStr.replace(cuttingStr, '');
	}
	
	/**
	* Show error message.
	*  
	* @param {Error object or String} e - error object or error message
	* @param {Function} callBackFn - call back function, pattern:
	* 	function() {
	* 	
	* 	}
	* @param {Integer} timeout - timeout for close this dialog. 
	*/
	jslet.showError = function (e, callBackFn, timeout) {
		var msg;
		if (typeof (e) == 'string') {
			msg = e;
		} else {
			msg = e.message;
		}
		if (jslet.ui && jslet.ui.MessageBox) {
			jslet.ui.MessageBox.error(msg, null, callBackFn);
		} else {
			alert(msg);
		}
	};
	
	/**
	* Show Info message.
	* 
	* @param {Error object or String} e - error object or error message
	* @param {Function} callBackFn - call back function, pattern:
	* 	function() {
	* 	
	* 	}
	* @param {Integer} timeout - timeout for close this dialog. 
	*/
	jslet.showInfo = function (e, callBackFn, timeout) {
		var msg;
		if (typeof (e) == 'string') {
			msg = e;
		} else {
			msg = e.message;
		}
		if (jslet.ui && jslet.ui.MessageBox) {
			jslet.ui.MessageBox.alert(msg, jslet.locale.MessageBox.Info, callBackFn, timeout);
		} else {
			alert(msg);
		}
	};
	
	jslet.Clipboard = function() {
		var clipboard = document.getElementById('jsletClipboard');
		if(!clipboard) {
			jQuery('<textarea id="jsletClipboard" style="position:absolute;top:-1000px" tabindex="-1"></textarea>').appendTo(document.body);
		
		    window.addEventListener('copy', function (event) {
		        var text = jQuery('#jsletClipboard').val();
		        if(text) {
			        if(event.clipboardData) {
			        	event.clipboardData.setData('text/plain', text);
			        } else {
			        	window.clipboardData.setData('text', text);
			        }
			        jQuery('#jsletClipboard').val(null);
			        event.preventDefault();
			        return false;
		        }
		    });
		}
	}
	
	jslet.Clipboard.putText = function(text) {
		var clipboard = jQuery('#jsletClipboard').val(text);
		clipboard[0].select();
	}
	
	jslet.Clipboard();
	
	/* ========================================================================
	 * Jslet framework: jslet.cookie.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * Cookie Utils
	 */
	if(!jslet.getCookie){
		/**
		 * Get cookie value with cookie name. Example:
		 * <pre><code>
		 * console.log(jslet.getCookie('name'));
		 * </code></pre>
		 * 
		 * @param {String} name Cookie name
		 * @return {String} Cookie value
		 */
		jslet.getCookie = function(name) {
			var start = document.cookie.indexOf(name + '=');
			var len = start + name.length + 1;
			if ((!start) && (name != document.cookie.substring(0, name.length))) {
				return null;
			}
			if (start == -1){
				return null;
			}
			var end = document.cookie.indexOf(';', len);
			if (end == -1){
				end = document.cookie.length;
			}
			return unescape(document.cookie.substring(len, end));
		};
	}
	
	if (!jslet.setCookie){
		/**
		 * Set cookie. Example:
		 * <pre><code>
		 * jslet.setCookie('name', 'value', 1, '/', '.foo.com', true);
		 * </code></pre>
		 * 
		 * @param {String} name Cookie name
		 * @param {String} value Cookie value
		 * @param {String} expires Cookie expires(day)
		 * @param {String} path Cookie path
		 * @param {String} domain Cookie domain
		 * @param {Boolean} secure Cookie secure flag
		 * 
		 */
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
	}
	if (!jslet.deleteCookie){
		/**
		 * Delete specified cookie. Example:
		 * <pre><code>
		 * jslet.deleteCookie('name', '/', '.foo.com');
		 * </code></pre>
		 * 
		 * @param {String} name Cookie name
		 * @param {String} name Cookie path
		 * @param {String} name Cookie domain
		 * 
		 */
		jslet.deleteCookie = function(name, path, domain) {
			if (getCookie(name)) document.cookie = name + '=' +
				((path) ? ';path=' + path : '') +
				((domain) ? ';domain=' + domain : '') +
				';expires=Thu, 01-Jan-1970 00:00:01 GMT';
		};
	}
	/* ========================================================================
	 * Jslet framework: jslet.messagebus.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	* Message bus. Example:
	* <pre><code>
	*	var myCtrlObj = {
	*		onReceiveMessage: function(messageName, messageBody){
	*			alert(messageBody.x);
	*		}
	*	}
	* 
	*   //Subcribe a message from MessageBus
	*   jslet.messageBus.subcribe('MyMessage', myCtrlObj);
	*   
	*   //Unsubcribe a message from MessageBus
	*	jslet.messageBus.unsubcribe('MyMessage', myCtrlObj);
	*	
	*	//Send a mesasge to MessageBus
	*	jslet.messageBus.sendMessage('MyMessage', {x: 10, y:10});
	* 
	* </code></pre>
	* 
	*/
	jslet.MessageBus = function () {
		var _messages = {};
		//SizeChanged is predefined message
		_messages[jslet.MessageBus.SIZECHANGED] = [];
		
		var _timeoutHandlers = [];
		/**
		 * Send a message.
		 * 
		 * @param {String} messageName Message name.
		 * @param {Object} mesageBody Message body.
		 */
		this.sendMessage = function (messageName, messageBody, sender) {
			if(!_messages[messageName]) {
				return;
			}
			var handler = _timeoutHandlers[messageName];
			
			if (handler){
				window.clearTimeout(handler);
			}
			handler = setTimeout(function(){
				_timeoutHandlers[messageName] = null;
				var ctrls = _messages[messageName], ctrl;
				for(var i = 0, cnt = ctrls.length; i < cnt; i++){
					ctrl = ctrls[i];
					if (ctrl && ctrl.onReceiveMessage){
						ctrl.onReceiveMessage(messageName, messageBody);
					}
				}
			}, 30);
			_timeoutHandlers[messageName] = handler;
		};
	
		/**
		* Subscribe a message.
		* 
		* @param {String} messageName message name.
		* @param {Object} ctrlObj control object which need subscribe a message, 
		*   there must be a function: onReceiveMessage in ctrlObj.
		*	onReceiveMessage: function(messageName, messageBody){}
		*   //messageName: String, message name;
		*   //messageBody: Object, message body;
		*/
		this.subscribe = function(messageName, ctrlObj){
			if (!messageName || !ctrlObj) {
				throw new Error("MessageName and ctrlObj required!");
			}
			var ctrls = _messages[messageName];
			if (!ctrls){
				ctrls = [];
				_messages[messageName] = ctrls;
			}
			ctrls.push(ctrlObj);
		};
		
		/**
		 * Subscribe a message.
		 * 
		 * @param {String} messageName message name.
		 * @param {Object} ctrlObj control object which need subscribe a message.
		 */
		this.unsubscribe = function(messageName, ctrlObj){
			var ctrls = _messages[messageName];
			if (!ctrls) {
				return;
			}
			var k = ctrls.indexOf(ctrlObj);
			if (k >= 0) {
				ctrls.splice(k,1);
			}
		};
	};
	
	jslet.MessageBus.SIZECHANGED = "SIZECHANGED";
	
	jslet.messageBus = new jslet.MessageBus();
	
	jQuery(window).on("resize",function(){
		jslet.messageBus.sendMessage(jslet.MessageBus.SIZECHANGED, null, window);
	});
	
	/* ========================================================================
	 * Jslet framework: jslet.contextrule.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	jslet.data.ContextRule = function() {
		var Z = this;
		Z._name = '';
		Z._description = '';
		Z._status = undefined;
		Z._condition = undefined;
		Z._rules = [];
	};
	
	jslet.data.ContextRule.className = 'jslet.data.ContextRule';
	
	jslet.data.ContextRule.prototype = {
		className: jslet.data.ContextRule.className,
		
		dataStatus: ['insert','update','other'],
		
		name: function(name) {
			if(name === undefined) {
				return this._name;
			}
			
			jslet.Checker.test('ContextRule.name', name).isString();
			this._name = jQuery.trim(name);
			return this;
		},
	
		status: function(status) {
			if(status === undefined) {
				return this._status;
			}
			
			jslet.Checker.test('ContextRule.status', status).isArray();
			if(status) {
				var item, checker;
				for(var i = 0, len = status.length; i < len; i++) {
					item = jQuery.trim(status[i]);
					checker = jslet.Checker.test('ContextRule.status' + i, item).isString().required();
					item = item.toLowerCase();
					checker.testValue(item).inArray(this.dataStatus);
					status[i] = item;
				}
			}
			this._status = status;
			return this;
		},
		
		condition: function(condition) {
			if(condition === undefined) {
				return this._condition;
			}
			
			jslet.Checker.test('ContextRule.status', condition).isString();
			this._condition = jQuery.trim(condition);
			return this;
		},
		
		rules: function(rules) {
			if(rules === undefined) {
				return this._rules;
			}
	
			jslet.Checker.test('ContextRule.rules', rules).isArray();
			this._rules = rules;
			return this;
		}
	};
	
	jslet.data.ContextRuleItem = function(fldName) {
		var Z = this;
		jslet.Checker.test('ContextRule.field', fldName).isString();
		fldName = jQuery.trim(fldName);
		jslet.Checker.test('ContextRule.field', fldName).required();
		Z._field = fldName;
		
		Z._meta = undefined;
		Z._value = undefined;
		Z._lookup = undefined;
	};
	
	jslet.data.ContextRuleItem.className = 'jslet.data.ContextRuleItem';
	
	jslet.data.ContextRuleItem.prototype = {
		className: jslet.data.ContextRuleItem.className,
		
		field: function() {
			return this._field;
		},
		
		meta: function(meta) {
			if(meta === undefined) {
				return this._meta;
			}
			
			jslet.Checker.test('ContextRuleItem.meta', meta).isClass(jslet.data.ContextRuleMeta.className);
			this._meta = meta;
			return this;
		},
	
		lookup: function(lookup) {
			if(lookup === undefined) {
				return this._lookup;
			}
			
			jslet.Checker.test('ContextRuleItem.lookup', lookup).isClass(jslet.data.ContextRuleLookup.className);
			this._lookup = lookup;
			return this;
		},
	
		value: function(value) {
			if(value === undefined) {
				return this._value;
			}
			
			this._value = value;
			return this;
		}
	};
	
	jslet.data.ContextRuleMeta = function() {
		var Z = this;
		Z._label = undefined;
		Z._tip = undefined;
		Z._nullText = undefined;
		
		Z._required = undefined;
		Z._disabled = undefined;
		Z._readOnly = undefined;
		Z._visible = undefined;
		Z._formula = undefined;
		Z._scale = undefined;
		Z._defaultValue = undefined;
		Z._displayFormat = undefined;
		Z._editMask = undefined;
		Z._editControl = undefined;
		
		Z._range = undefined;
		Z._regularExpr = undefined;
		Z._valueCountLimit = undefined;
		Z._validChars = undefined;
		Z._customValidator = undefined;
	};
	
	jslet.data.ContextRuleMeta.className = 'jslet.data.ContextRuleMeta';
	
	jslet.data.ContextRuleMeta.prototype = {
		className: jslet.data.ContextRuleMeta.className,
		
		properties: ['label', 'tip','nullText', 'required','disabled','readOnly','visible',
		             'formula','scale','defaultValue','displayFormat','editMask','editControl',
		             'range','regularExpr','valueCountLimit','validChars','customValidator'],
		/**
		 * Get or set field label.
		 * 
		 * @param {String or undefined} label Field label.
		 * @return {String or this}
		 */
		label: function (label) {
			if (label === undefined) {
				return this._label;
			}
			jslet.Checker.test('ContextRuleMeta.label', label).isString();
			this._label = label;
			return this;
		},
	
		/**
		 * Get or set field tip.
		 * 
		 * @param {String or undefined} tip Field tip.
		 * @return {String or this}
		 */
		tip: function(tip) {
			if (tip === undefined) {
				return this._tip;
			}
			jslet.Checker.test('ContextRuleMeta.tip', tip).isString();
			this._tip = tip;
			return this;
		},
	
		/**
		 * Get or set the display text if the field value is null.
		 * 
		 * @param {String or undefined} nullText Field null text.
		 * @return {String or this}
		 */
		nullText: function (nullText) {
			if (nullText === undefined) {
				return this._nullText;
			}
			
			jslet.Checker.test('ContextRuleMeta.nullText', nullText).isString();
			this._nullText = jQuery.trim(nullText);
			return this;
		},
		
		/**
		 * Get or set flag required.
		 * 
		 * @param {Boolean or undefined} required Field is required or not.
		 * @return {Boolean or this}
		 */
		required: function (required) {
			var Z = this;
			if (required === undefined) {
				return Z._required;
			}
			Z._required = required ? true: false;
			return this;
		},
		
		/**
		 * Get or set field is visible or not.
		 * 
		 * @param {Boolean or undefined} visible Field is visible or not.
		 * @return {Boolean or this}
		 */
		visible: function (visible) {
			var Z = this;
			if (visible === undefined){
				return Z._visible;
			}
			Z._visible = visible ? true: false;
			return this;
		},
	
		/**
		 * Get or set field is disabled or not.
		 * 
		 * @param {Boolean or undefined} disabled Field is disabled or not.
		 * @return {Boolean or this}
		 */
		disabled: function (disabled) {
			var Z = this;
			if (disabled === undefined) {
				return Z._disabled;
			}
			Z._disabled = disabled ? true: false;
			return this;
		},
	
		/**
		 * Get or set field is readOnly or not.
		 * 
		 * @param {Boolean or undefined} readOnly Field is readOnly or not.
		 * @return {Boolean or this}
		 */
		readOnly: function (readOnly) {
			var Z = this;
			if (readOnly === undefined){
				return Z._readOnly;
			}
			
			Z._readOnly = readOnly? true: false;
			return this;
		},
	
		/**
		 * Get or set field edit mask.
		 * 
		 * @param {jslet.data.EditMask or String or undefined} mask Field edit mask.
		 * @return {jslet.data.EditMask or this}
		 */
		editMask: function (mask) {
			var Z = this;
			if (mask === undefined) {
				return Z._editMask;
			}
			Z._editMask = mask;
			return this;
		},
		
		/**
		 * Get or set field decimal length.
		 * 
		 * @param {Integer or undefined} scale Field decimal length.
		 * @return {Integer or this}
		 */
		scale: function (scale) {
			var Z = this;
			if (scale === undefined) {
				return Z._scale;
			}
			jslet.Checker.test('ContextRuleMeta.scale', scale).isNumber();
			Z._scale = parseInt(scale);
			return this;
		},
		
		/**
		 * Get or set field formula. Example: 
		 * <pre><code>
		 *  obj.formula('[price]*[num]');
		 * </code></pre>
		 * 
		 * @param {String or undefined} formula Field formula.
		 * @return {String or this}
		 */
		formula: function (formula) {
			var Z = this;
			if (formula === undefined) {
				return Z._formula;
			}
			
			jslet.Checker.test('ContextRuleMeta.formula', formula).isString();
			Z._formula = jQuery.trim(formula);
			return this;
		},
	
		/**
		 * Get or set field display format.
		 * For number field like: #,##0.00
		 * For date field like: yyyy/MM/dd
		 * 
		 * @param {String or undefined} format Field display format.
		 * @return {String or this}
		 */
		displayFormat: function (format) {
			var Z = this;
			if (format === undefined) {
				return Z._displayFormat;
			}
			
			jslet.Checker.test('ContextRuleMeta.format', format).isString();
			Z._displayFormat = jQuery.trim(format);
			return this;
		},
	
		/**
		 * Get or set field edit control. It is similar as DBControl configuration.
		 * Here you need not set 'dataset' and 'field' property.   
		 * Example:
		 * <pre><code>
		 * //Normal DBControl configuration
		 * //var normalCtrlCfg = {type:"DBSpinEdit",dataset:"employee",field:"age",minValue:10,maxValue:100,step:5};
		 * 
		 * var editCtrlCfg = {type:"DBSpinEdit",minValue:10,maxValue:100,step:5};
		 * fldObj.displayControl(editCtrlCfg);
		 * </code></pre>
		 * 
		 * @param {DBControl Config or String} editCtrl If String, it will convert to DBControl Config.
		 * @return {DBControl Config or this}
		 */
		editControl: function (editCtrl) {
			var Z = this;
			if (editCtrl=== undefined){
				return Z._editControl;
			}
	
			Z._editControl = (typeof (editCtrl) === 'string') ? { type: editCtrl } : editCtrl;
		},
	
		/**
		 * Get or set field default value.
		 * The data type of default value must be same as Field's.
		 * Example:
		 *   Number field: fldObj.defauleValue(100);
		 *   Date field: fldObj.defaultValue(new Date());
		 *   String field: fldObj.defaultValue('test');
		 * 
		 * @param {Object or undefined} dftValue Field default value.
		 * @return {Object or this}
		 */
		defaultValue: function (dftValue) {
			var Z = this;
			if (dftValue === undefined) {
				return Z._defaultValue;
			}
			Z._defaultValue = dftValue;
			return this;
		},
		
		/**
		 * Get or set field rang.
		 * Range is an object as: {min: x, max: y}. Example:
		 * <pre><code>
		 * //For String field
		 *	var range = {min: 'a', max: 'z'};
		 *  //For Date field
		 *	var range = {min: new Date(2000,1,1), max: new Date(2010,12,31)};
		 *  //For Number field
		 *	var range = {min: 0, max: 100};
		 *  fldObj.range(range);
		 * </code></pre>
		 * 
		 * @param {Range or Json String} range Field range;
		 * @return {Range or this}
		 */
		range: function (range) {
			var Z = this;
			if (range === undefined) {
				return Z._range;
			}
			if (jslet.isString(range)) {
				Z._range = new Function('return ' + range);
			} else {
				Z._range = range;
			}
			return this;
		},
	
		/**
		 * Get or set regular expression.
		 * You can specify your own validator with regular expression. If regular expression not specified, 
		 * The default regular expression for Date and Number field will be used. Example:
		 * <pre><code>
		 * fldObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, 'Invalid phone number!');//like: 0755-12345678
		 * </code></pre>
		 * 
		 * @param {String or JSON object} expr Regular expression, format: {expr: xxx, message: yyy};
		 * @return {Object} An object like: { expr: expr, message: message }
		 */
		regularExpr: function (regularExpr) {
			var Z = this;
			if (regularExpr === undefined){
				return Z._regularExpr;
			}
			
			if (jslet.isString(regularExpr)) {
				Z._range = new Function('return ' + regularExpr);
			} else {
				Z._regularExpr = regularExpr;
			}
			return this;
		},
		
		/**
		 * Get or set allowed count when valueStyle is multiple.
		 * 
		 * @param {String or undefined} count.
		 * @return {String or this}
		 */
		valueCountLimit: function (count) {
			var Z = this;
			if (count === undefined) {
				return Z._valueCountLimit;
			}
			jslet.Checker.test('ContextRuleMeta.valueCountLimit', count).isNumber();
			Z._valueCountLimit = parseInt(count);
			return this;
		},
	
		/**
		 * Get or set customized validator.
		 * 
		 * @param {Function} validator Validator function.
		 * Pattern:
		 *   function(fieldObj, fldValue){}
		 *   //fieldObj: jslet.data.Field, Field object
		 *   //fldValue: Object, Field value
		 *   //return: String, if validate failed, return error message, otherwise return null; 
		 */
		customValidator: function (validator) {
			var Z = this;
			if (validator === undefined) {
				return Z._customValidator;
			}
			jslet.Checker.test('ContextRuleMeta.customValidator', validator).isFunction();
			Z._customValidator = validator;
			return this;
		},
		
		/**
		 * Valid characters for this field.
		 */
		validChars: function(chars){
			var Z = this;
			if (chars === undefined){
				return Z._validChars;
			}
			
			jslet.Checker.test('ContextRuleMeta.validChars', chars).isString();
			Z._validChars = jQuery.trim(chars);
		}
		
	};
	
	jslet.data.ContextRuleLookup = function() {
		var Z = this;
		Z._dataset = undefined;
		Z._filter = undefined;
		Z._fixedFilter = undefined;
		Z._criteria = undefined;
		Z._displayFields = undefined;
		Z._onlyLeafLevel = undefined;
	};
	
	jslet.data.ContextRuleLookup.className = 'jslet.data.ContextRuleLookup';
	
	jslet.data.ContextRuleLookup.prototype ={
		className: jslet.data.ContextRuleLookup.className,
		
		properties: ['dataset', 'filter', 'fixedFilter', 'criteria', 'displayFields', 'onlyLeafLevel'],
		
		dataset: function(datasetName){
			var Z = this;
			if (datasetName === undefined){
				return Z._dataset;
			}
			jslet.Checker.test('ContextRuleLookup.dataset', datasetName).isString();
			Z._dataset = jQuery.trim(datasetName);
		},
	
		filter: function(filter){
			var Z = this;
			if (filter === undefined){
				return Z._filter;
			}
			jslet.Checker.test('ContextRuleLookup.filter', filter).isString();
			Z._filter = jQuery.trim(filter);
		},
	
		fixedFilter: function(fixedFilter){
			var Z = this;
			if (fixedFilter === undefined){
				return Z._fixedFilter;
			}
			jslet.Checker.test('ContextRuleLookup.fixedFilter', fixedFilter).isString();
			Z._fixedFilter = jQuery.trim(fixedFilter);
		},
	
		criteria: function(criteria){
			var Z = this;
			if (criteria === undefined){
				return Z._criteria;
			}
			jslet.Checker.test('ContextRuleLookup.criteria', criteria).isString();
			Z._criteria = jQuery.trim(criteria);
		},
	
		displayFields: function(displayFields){
			var Z = this;
			if (displayFields === undefined){
				return Z._displayFields;
			}
			jslet.Checker.test('ContextRuleLookup.displayFields', displayFields).isString();
			Z._displayFields = jQuery.trim(displayFields);
		},
	
		onlyLeafLevel: function(onlyLeafLevel){
			var Z = this;
			if (onlyLeafLevel === undefined){
				return Z._onlyLeafLevel;
			}
			Z._onlyLeafLevel = onlyLeafLevel ? true: false;
		}
	};
	
	jslet.data.createContextRule = function(cxtRuleCfg) {
		if(!cxtRuleCfg) {
			return null;
		}
		var ruleObj = new jslet.data.ContextRule();
		if(cxtRuleCfg.status !== undefined) {
			ruleObj.status(cxtRuleCfg.status);
		}
		if(cxtRuleCfg.condition !== undefined) {
			ruleObj.condition(cxtRuleCfg.condition);
		}
		if(cxtRuleCfg.rules !== undefined) {
			jslet.Checker.test('ContextRule.rules', rules).isArray();
			var rules = [];
			ruleObj.rules(rules);
			for(var i = 0, len = cxtRuleCfg.rules.length; i < len; i++) {
				rules.push(createContextRuleItem(cxtRuleCfg.rules[i]));
			}
		}
		
		function createContextRuleItem(itemCfg) {
			var item = new jslet.data.ContextRuleItem(itemCfg.field);
			if(itemCfg.meta !== undefined) {
				item.meta(createContextRuleMeta(itemCfg.meta));
			}
			
			if(itemCfg.value !== undefined) {
				item.value(itemCfg.value);
			}
			
			if(itemCfg.lookup !== undefined) {
				item.lookup(createContextRuleLookup(itemCfg.lookup));
			}
			return item;
		}
		
		function createContextRuleMeta(metaCfg) {
			var meta = new jslet.data.ContextRuleMeta();
			if(metaCfg.label !== undefined) {
				meta.label(metaCfg.label);
			}
			
			if(metaCfg.tip !== undefined) {
				meta.tip(metaCfg.tip);
			}
			
			if(metaCfg.nullText !== undefined) {
				meta.nullText(metaCfg.nullText);
			}
			
			if(metaCfg.required !== undefined) {
				meta.required(metaCfg.required);
			}
			
			if(metaCfg.disabled !== undefined) {
				meta.disabled(metaCfg.disabled);
			}
			
			if(metaCfg.readOnly !== undefined) {
				meta.readOnly(metaCfg.readOnly);
			}
			
			if(metaCfg.visible !== undefined) {
				meta.visible(metaCfg.visible);
			}
			
			if(metaCfg.formula !== undefined) {
				meta.formula(metaCfg.formula);
			}
			
			if(metaCfg.scale !== undefined) {
				meta.scale(metaCfg.scale);
			}
			
			if(metaCfg.required !== undefined) {
				meta.required(metaCfg.required);
			}
			
			if(metaCfg.displayFormat !== undefined) {
				meta.displayFormat(metaCfg.displayFormat);
			}
			
			if(metaCfg.editMask !== undefined) {
				meta.editMask(metaCfg.editMask);
			}
			
			if(metaCfg.editControl !== undefined) {
				meta.editControl(metaCfg.editControl);
			}
			
			if(metaCfg.range !== undefined) {
				meta.range(metaCfg.range);
			}
			
			if(metaCfg.regularExpr !== undefined) {
				meta.regularExpr(metaCfg.regularExpr);
			}
			
			if(metaCfg.valueCountLimit !== undefined) {
				meta.valueCountLimit(metaCfg.valueCountLimit);
			}
			
			if(metaCfg.validChars !== undefined) {
				meta.validChars(metaCfg.validChars);
			}
			
			if(metaCfg.customValidator !== undefined) {
				meta.customValidator(metaCfg.customValidator);
			}
			
			return meta;
		}
	
		function createContextRuleLookup(lookupCfg) {
			var lookup = new jslet.data.ContextRuleLookup();
			if(lookupCfg.dataset !== undefined) {
				lookup.dataset(lookupCfg.dataset);
			}
			
			if(lookupCfg.filter !== undefined) {
				lookup.filter(lookupCfg.filter);
			}
			
			if(lookupCfg.fixedFilter !== undefined) {
				lookup.fixedFilter(lookupCfg.fixedFilter);
			}
			
			if(lookupCfg.criteria !== undefined) {
				lookup.criteria(lookupCfg.criteria);
			}
			
			if(lookupCfg.displayFields !== undefined) {
				lookup.displayFields(lookupCfg.displayFields);
			}
			
			if(lookupCfg.onlyLeafLevel !== undefined) {
				lookup.onlyLeafLevel(lookupCfg.onlyLeafLevel);
			}
			
			return lookup;
		}
		return ruleObj;
	};
	
	jslet.data.ContextRuleEngine = function(dataset) {
		this._dataset = dataset;
		this._matchedRules = [];
		this._ruleEnv = {};
	};
	
	jslet.data.ContextRuleEngine.prototype = {
	
		compile: function() {
			var contextRules = this._dataset.contextRules();
			for(var i = 0, len = contextRules.length; i < len; i++) {
				this._compileOneRule(contextRules[i]);
			}
		},
	
		evalStatus: function() {
			var contextRules = this._dataset.contextRules(),
				status = 'other', 
				dsStatus = this._dataset.changedStatus();
			if(dsStatus == jslet.data.DataSetStatus.INSERT) {
				status = 'insert';
			} else if(dsStatus == jslet.data.DataSetStatus.UPDATE) {
				status = 'update';
			}
	
			this._matchedRules = [];
			var ruleObj, ruleStatus;
			for(var i = 0, len = contextRules.length; i < len; i++) {
				ruleObj = contextRules[i];
				ruleStatus = ruleObj.status();
				if(ruleStatus && ruleStatus.indexOf(status) >= 0) {
					this._evalRuleItems(ruleObj.rules(), status == 'insert' || status == 'update');
				}
			}
			this._syncMatchedRules();
		},
		
		evalRule: function(changingFldName){
			var contextRules = this._dataset.contextRules();
			var ruleObj;
			this._matchedRules = [];
			this._ruleEnv = {};
			for(var i = 0, len = contextRules.length; i < len; i++) {
				ruleObj = contextRules[i];
				if(!ruleObj.status()) {
					this._evalOneRule(ruleObj, changingFldName);
				}
			}
			this._syncMatchedRules();
		},
		
		_compileOneRule: function(ruleObj) {
			var condition = ruleObj.condition;
			this._compileExpr(ruleObj, 'condition', true);
			var rules = ruleObj.rules();
			for(var i = 0, len = rules.length; i < len; i++) {
				this._compileRuleItem(rules[i]);
			}
		},
		
		_compileRuleItem: function(ruleItem) {
			this._compileExpr(ruleItem, 'value');
			var metaObj = ruleItem.meta();
			var props, propName, i, len;
			if(metaObj) {
				props = metaObj.properties;
				len = props.length;
				for(i = 0; i < len; i++) {
					propName = props[i];
					this._compileExpr(metaObj, propName);
				}
			}
			var lookupObj = ruleItem.lookup();
			if(lookupObj) {
				props = lookupObj.properties;
				len = props.length;
				for(i = 0; i < len; i++) {
					propName = props[i];
					this._compileExpr(lookupObj, propName);
				}
			}
		},
		
		_compileExpr: function(itemObj, propName, isExpr) {
			var setting = itemObj[propName].call(itemObj),
				exprName = propName +'Expr';
			
			if(setting !== null && setting !== undefined && jslet.isString(setting)) {
				if(setting.indexOf('expr:') === 0) {
					setting = setting.substring(5);
					isExpr = true;
				}
				if(isExpr) {
					itemObj[exprName] = new jslet.Expression(this._dataset, setting);
				}
			}
		},
		
		_evalOneRule: function(ruleObj, changingFldName) {
			var matched = false;
			var exprObj = ruleObj.conditionExpr;
			var mainFields = null;
			if(exprObj) {
				mainFields = exprObj.mainFields();
				if(changingFldName) {
					if(mainFields && mainFields.indexOf(changingFldName) < 0) {
						return;
					}
				}
				matched = ruleObj.conditionExpr.eval();
			} else {
				matched = ruleObj.condition();
			}
			if(matched) {
				var ruleEnv = null;
				if(mainFields) {
					var fldName;
					for(var i = 0, len = mainFields.length; i < len; i++) {
						fldName = mainFields[i];
						if(this._ruleEnv[fldName] === undefined) {
							this._ruleEnv[fldName] = this._dataset.getFieldValue(fldName);
						}
					}
				}
				this._evalRuleItems(ruleObj.rules(), changingFldName? true: false)
			}
		},
		
		_evalRuleItems: function(rules, isValueChanged) {
			var fldName, ruleItem, matchedRule;
			for(var i = 0, len = rules.length; i < len; i++) {
				ruleItem = rules[i];
				fldName = ruleItem.field();
				matchedRule = this._findMatchedRule(fldName);
				if(!matchedRule) {
					matchedRule = new jslet.data.ContextRuleItem(fldName);
				}
				
				var meta = ruleItem.meta(); 
				if(meta) {
					matchedRule.meta(new jslet.data.ContextRuleMeta());
					this._copyProperties(meta, matchedRule.meta());
				}
				
				var lookup = ruleItem.lookup(); 
				if(lookup) {
					matchedRule.lookup(new jslet.data.ContextRuleLookup());
					this._copyProperties(lookup, matchedRule.lookup());
				}
	
				if(isValueChanged && ruleItem.value() !== undefined) {
					matchedRule.value(this._evalExpr(ruleItem, 'value'));
				}
				this._matchedRules.push(matchedRule);
			}
		},
		
		_copyProperties: function(srcObject, descObject) {
			var props = srcObject.properties, propName, propValue;
			for(var i = 0, len = props.length; i < len; i++) {
				propName = props[i];
				propValue = this._evalExpr(srcObject, propName);
				if(propValue !== undefined) {
					descObject[propName].call(descObject, propValue);
				}
			}
		},
		
		_evalExpr: function(evalObj, propName) {
			var exprObj = evalObj[propName + 'Expr'];
			if(exprObj) {
				return exprObj.eval();
			} else {
				return evalObj[propName].call(evalObj);
			}
		},
		
		_findMatchedRule: function(fldName) {
			var item;
			for(var i = 0, len = this._matchedRules.length; i < len; i++) {
				item = this._matchedRules[i];
				if(fldName == item.field()) {
					return item;
				}
			}
			return null;
		},
		
		_syncMatchedRules: function() {
			var matchedRules = this._matchedRules,
				ruleObj, fldName, fldObj;
			
			for(var i = 0, len = matchedRules.length; i < len; i++) {
				ruleObj = matchedRules[i];
				fldName = ruleObj.field();
				fldObj = this._dataset.getField(fldName);
				if(fldObj) {
					this._syncMatchedRuleMeta(fldObj, ruleObj.meta());
					this._syncMatchedRuleLookup(fldObj, ruleObj.lookup());
					this._syncMatchedRuleValue(fldObj, ruleObj.value());
				}
			}
		},
		
		_syncMatchedRuleMeta: function(fldObj, ruleMeta) {
			if(!ruleMeta) {
				return;
			}
			var props = ruleMeta.properties, 
				propName, propValue;
			for(var i = 0, len = props.length; i < len; i++) {
				propName = props[i];
				propValue = ruleMeta[propName].call(ruleMeta);
				if(propValue !== undefined) {
					fldObj[propName].call(fldObj, propValue);
				}
			}
		},
		
		_syncMatchedRuleLookup: function(fldObj, ruleLookup) {
			if(!ruleLookup) {
				return;
			}
			var fieldLookup = fldObj.lookup();
			if(!fieldLookup) {
				return;
			}
			var ruleDs = ruleLookup.dataset();
			if(ruleDs) {
				fieldLookup.dataset(ruleDs);
			}
			var lkDsObj = fieldLookup.dataset();
			lkDsObj.autoRefreshHostDataset(true);
			var ruleFilter = ruleLookup.filter();
			if(ruleFilter !== undefined) {
				for(var fldName in this._ruleEnv) {
					ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
				}
				lkDsObj.filter(ruleFilter);
				lkDsObj.filtered(true);
			}
			var ruleFilter = ruleLookup.fixedFilter();
			if(ruleFilter !== undefined) {
				for(var fldName in this._ruleEnv) {
					ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
				}
				lkDsObj.fixedFilter(ruleFilter);
				lkDsObj.filtered(true);
			}
			var ruleCriteria = ruleLookup.criteria();
			if(ruleCriteria !== undefined) {
				lkDsObj.query(ruleCriteria);
			}
			var ruleDisplayFields = ruleLookup.displayFields();
			if(ruleDisplayFields !== undefined) {
				fieldLookup.displayFields(ruleDisplayFields);
			}
			var ruleOnlyLeafLevel = ruleLookup.onlyLeafLevel();
			if(ruleOnlyLeafLevel !== undefined) {
				fieldLookup.onlyLeafLevel(ruleOnlyLeafLevel);
			}
		},
		
		_syncMatchedRuleValue: function(fldObj, value) {
			if(value !== undefined) {
				fldObj.setValue(value);
			}
		}
	};
	
	
	
	
	
	
	
	
	
	/* ========================================================================
	 * Jslet framework: jslet.datacommon.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * keep all dataset object,
	 * key for dataset name, value for dataset object
	 */
	
	jslet.data.dataModule = new jslet.SimpleMap();
	/**
	 * Get dataset object with dataset name.
	 * 
	 * @param {String} dsName dataset name;
	 * @return {jslet.data.Dataset} Dataset object.
	 */
	jslet.data.getDataset = function (dsName) {
		return jslet.data.dataModule.get(dsName);
	};
	
	jslet.data.DatasetType = {
		NORMAL: 0, //Normal dataset
		LOOKUP: 1, //Lookup dataset
		DETAIL: 2  //Detail dataset	 
	};
	
	jslet.data.onCreatingDataset = function(dsName, dsCatalog, realDsName, hostDatasetName) { };
	
	
	jslet.data.DataType = {
		NUMBER: 'N', //Number
		STRING: 'S', //String
		DATE: 'D',  //Date
		TIME: 'T',  //Time
		BOOLEAN: 'B', //Boolean
		DATASET: 'V', //Dataset field
		CROSS: 'C'   //Cross Field
	};
	
	jslet.data.FieldValueStyle = {
		NORMAL: 0,	//Single value
		BETWEEN: 1, //Between style value
		MULTIPLE: 2 //Multile value
	};
	
	/**
	 * @class Edit Mask 
	 */
	jslet.data.EditMask = function(mask, keepChar, transform){
		/**
		 * {String} Mask String, rule:
		 *  '#': char set: 0-9 and -, not required
		 *  '0': char set: 0-9, required
		 *  '9': char set: 0-9, not required
		 *  'L': char set: A-Z,a-z, required
		 *  'l': char set: A-Z,a-z, not required
		 *  'A': char set: 0-9,a-z,A-Z, required
		 *  'a': char set: 0-9,a-z,A-Z, not required
		 *  'C': char set: any char, required
		 *  'c': char set: any char, not required
		 */
		this.mask = mask; 
		/**
		 * {Boolean} keepChar Keep the literal character or not
		 */
		this.keepChar = (keepChar !== undefined ? keepChar: true);
		/**
		 * {String} transform Transform character into UpperCase or LowerCase,
		 *  optional value: upper, lower or null.
		 */
		this.transform = transform;
		
		this.clone = function(){
			return new jslet.data.EditMask(this.mask, this.keepChar, this.transform);
		};
	};
	
	jslet.data.DatasetEvent = {
		BEFORESCROLL: 'beforeScroll',
		AFTERSCROLL: 'afterScroll',
		
		BEFOREINSERT: 'beforeInsert',
		AFTERINSERT: 'afterInsert',
		
		BEFOREUPDATE: 'beforeUpdate',
		AFTERUPDATE: 'afterUpdate',
		
		BEFOREDELETE: 'beforeDelete',
		AFTERDELETE: 'afterDelete',
		
		BEFORECONFIRM: 'beforeConfirm',
		AFTERCONFIRM: 'afterConfirm',
		
		BEFORECANCEL: 'beforeCancel',
		AFTERCANCEL: 'afterCancel',
		
		BEFORESELECT: 'beforeSelect',
		AFTERSELECT: 'afterSelect'
	};
	
	jslet.data.DataSetStatus = {BROWSE:0, INSERT: 1, UPDATE: 2, DELETE: 3};
	
	jslet.data.RefreshEvent = {
		updateRecordEvent: function(fldName) {
			return {eventType: jslet.data.RefreshEvent.UPDATERECORD, fieldName: fldName};
		},
		
		updateColumnEvent: function(fldName) {
			return {eventType: jslet.data.RefreshEvent.UPDATECOLUMN, fieldName: fldName};
		},
		
		updateAllEvent: function() {
			return this._updateAllEvent;
		},
		
		changeMetaEvent: function(metaName, fieldName, changeAllRows) {
			var result = {eventType: jslet.data.RefreshEvent.CHANGEMETA, metaName: metaName, fieldName: fieldName};
			if(changeAllRows !== undefined) {
				result.changeAllRows = changeAllRows;
			}
			return result;
		},
		
		beforeScrollEvent: function(recno) {
			return {eventType: jslet.data.RefreshEvent.BEFORESCROLL, recno: recno};
		},
		
		scrollEvent: function(recno, prevRecno) {
			return {eventType: jslet.data.RefreshEvent.SCROLL, prevRecno: prevRecno, recno: recno};
		},
		
		insertEvent: function(prevRecno, recno, needUpdateAll) {
			return {eventType: jslet.data.RefreshEvent.INSERT, prevRecno: prevRecno, recno: recno, updateAll: needUpdateAll};
		},
		
		deleteEvent: function(recno) {
			return {eventType: jslet.data.RefreshEvent.DELETE, recno: recno};
		},
		
		selectRecordEvent: function(recno, selected) {
			return {eventType: jslet.data.RefreshEvent.SELECTRECORD, recno: recno, selected: selected};
		},
		
		selectAllEvent: function(selected) {
			return {eventType: jslet.data.RefreshEvent.SELECTALL, selected: selected};
		},
		
		changePageEvent: function() {
			return this._changePageEvent;
		},
		
		errorEvent: function(errMessage) {
			return {eventType: jslet.data.RefreshEvent.ERROR, message: errMessage};
		},
		
		lookupEvent: function(fieldName, recno) {
			return {eventType: jslet.data.RefreshEvent.UPDATELOOKUP, fieldName: fieldName, recno: recno};
		},
		
		aggradedEvent: function() {
			return {eventType: jslet.data.RefreshEvent.AGGRADED};		
		}
	};
	
	jslet.data.RefreshEvent.CHANGEMETA = 'changeMeta';// fieldname, metatype(title, readonly,disabled,format)
	jslet.data.RefreshEvent.UPDATEALL = 'updateAll';
	jslet.data.RefreshEvent.UPDATERECORD = 'updateRecord';// fieldname
	jslet.data.RefreshEvent.UPDATECOLUMN = 'updateColumn';// fieldname
	jslet.data.RefreshEvent.BEFORESCROLL = 'beforescroll';
	jslet.data.RefreshEvent.SCROLL = 'scroll';// preRecno, recno
	
	jslet.data.RefreshEvent.SELECTRECORD = 'selectRecord';//
	jslet.data.RefreshEvent.SELECTALL = 'selectAll';//
	jslet.data.RefreshEvent.INSERT = 'insert';
	jslet.data.RefreshEvent.DELETE = 'delete';// recno
	jslet.data.RefreshEvent.CHANGEPAGE = 'changePage';
	jslet.data.RefreshEvent.UPDATELOOKUP = 'updateLookup';
	jslet.data.RefreshEvent.AGGRADED = 'aggraded';
	
	jslet.data.RefreshEvent.ERROR = 'error';
	
	jslet.data.RefreshEvent._updateAllEvent = {eventType: jslet.data.RefreshEvent.UPDATEALL};
	jslet.data.RefreshEvent._changePageEvent = {eventType: jslet.data.RefreshEvent.CHANGEPAGE};
	
	/**
	 * Field Validator
	 */
	jslet.data.FieldValidator = function() {
	};
	
	jslet.data.FieldValidator.prototype = {
		
		intRegular: { expr: /^(-)?[1-9]*\d+$/ig},
		
		floatRegular: { expr: /((^-?[1-9])|\d)\d*(\.[0-9]*)?$/ig},
	
	   /**
		 * Check the specified character is valid or not.
		 * Usually use this when user presses a key down.
		 * 
		 * @param {String} inputChar Single character
		 * @param {Boolean} True for passed, otherwise failed.
		 */
		checkInputChar: function (fldObj, inputChar, existText, cursorPos) {
			var validChars = fldObj.validChars();
			var valid = true;
			if (validChars && inputChar) {
				var c = inputChar.charAt(0);
				valid = validChars.indexOf(c) >= 0;
			}
			if(existText && valid && fldObj.getType() == jslet.data.DataType.NUMBER){
				var scale = fldObj.scale();
				var k = existText.lastIndexOf('.');
				if(inputChar == '.') {
					if(k >= 0) {
						return false;
					} else {
						return true;
					}
				}
				if(scale > 0 && k >= 0) {
					if(existText.length - k - 1 === scale && cursorPos - 1 > k) {
						return false;
					}
				}
				
			}
			return valid;
		},
		
		/**
		 * Check the specified text is valid or not
		 * Usually use this when a field loses focus.
		 * 
		 * @param {jslet.data.Field} fldObj Field Object
		 * @param {String} inputText Input text, it is original text that user inputed. 
		 * @return {String} If input text is valid, return null, otherwise return error message.
		 */
		checkInputText: function (fldObj, inputText) {
			var result = this.checkRequired(fldObj, inputText);
			if(result) {
				return result;
			}
			if(inputText === "") {
				return null;
			}
			var fldType = fldObj.getType();
			
			//Check with regular expression
			var regular = fldObj.regularExpr();
			if (!regular) {
				if (fldType == jslet.data.DataType.DATE) {
					regular = fldObj.dateRegular();
				} else {
					if (fldType == jslet.data.DataType.NUMBER) {
						if (!this.intRegular.message) {
							this.intRegular.message = jslet.locale.Dataset.invalidInt;
							this.floatRegular.message = jslet.locale.Dataset.invalidFloat;
						}
						if (!fldObj.scale()) {
							regular = this.intRegular;
						} else {
							regular = this.floatRegular;
						}
					}
				}
			}
			
			if (regular) {
				var regExpObj = regular.expr;
				if (typeof regExpObj == 'string') {
					regExpObj = new RegExp(regular.expr, 'ig');
				}
				regExpObj.lastIndex = 0;
				if (!regExpObj.test(inputText)) {
					return regular.message;
				}
			}
			
			var value = inputText;
			if (!fldObj.lookup()) {//Not lookup field
				if (fldType == jslet.data.DataType.NUMBER) {
					var scale = fldObj.scale() || 0;
					var length = fldObj.length();
					if (scale === 0) {
						value = parseInt(inputText);
					} else {
						var k = inputText.indexOf('.');
						var actual = k > 0? k: inputText.length,
							expected = length - scale;
						if(actual > expected) {
							return jslet.formatString(jslet.locale.Dataset.invalidIntegerPart, [expected, actual]);
						}
						actual = k > 0 ? inputText.length - k - 1: 0;
						if(actual > scale) {
							return jslet.formatString(jslet.locale.Dataset.invalidDecimalPart, [scale, actual]);
						}
						value = parseFloat(inputText);
					}
				}
				if (fldType == jslet.data.DataType.DATE) {// Date convert
					value = jslet.parseDate(inputText, fldObj.displayFormat());
				}
			}
			
			return this.checkValue(fldObj, value);
		},
	
		/**
		 * Check the required field's value is empty or not
		 * 
		 * @param {jslet.data.Field} fldObj Field Object
		 * @param {Object} value field value.
		 * @return {String} If input text is valid, return null, otherwise return error message.
		 */
		checkRequired: function(fldObj, value) {
			if (fldObj.required()) {
				var valid = true;
				if (value === null || value === undefined) {
					valid = false;
				}
				if(valid && jslet.isString(value) && jQuery.trim(value).length === 0) {
					valid = false;
				}
				if(valid && jslet.isArray(value) && value.length === 0) {
					valid = false;
				}
				if(fldObj.getType() === jslet.data.DataType.BOOLEAN && !value) {
					valid = false;
				}
				if(!valid) {
					return jslet.formatString(jslet.locale.Dataset.fieldValueRequired, [fldObj.label()]);
				} else {
					return null;
				}
			}
			return null;
		},
		
		/**
		 * Check the specified field value is valid or not
		 * It will check required, range and custom validation
		 * 
		 * @param {jslet.data.Field} fldObj Field Object
		 * @param {Object} value field value. 
		 * @return {String} If input text is valid, return null, otherwise return error message.
		 */
		checkValue: function(fldObj, value) {
			var fldType = fldObj.getType();
			//Check range
			var fldRange = fldObj.dataRange(),
				hasLookup = fldObj.lookup()? true: false;
			
			if (hasLookup) {//lookup field need compare code value of the Lookup
				value = fldObj.dataset().getFieldText(fldObj.name(), true);
			}
				
			if (fldRange) {
				var min = fldRange.min,
					strMin = min,
					max = fldRange.max,
					strMax = max;
				var fmt = fldObj.displayFormat();
				
				if (fldType == jslet.data.DataType.DATE) {
					if (min) {
						strMin = jslet.formatDate(min, fmt);
					}
					if (max) {
						strMax = jslet.formatDate(max, fmt);
					}
				}
				
				if (!hasLookup && fldType == jslet.data.DataType.NUMBER) {
					strMin = jslet.formatNumber(min, fmt);
					strMax = jslet.formatNumber(max, fmt);
				}
				
				if (min !== undefined && max !== undefined && (value < min || value > max)) {
					return jslet.formatString(jslet.locale.Dataset.notInRange, [strMin, strMax]);
				}
				if (min !== undefined && max === undefined && value < min) {
					return jslet.formatString(jslet.locale.Dataset.moreThanValue, [strMin]);
				}
				if (min === undefined && max !== undefined && value > max) {
					return jslet.formatString(jslet.locale.Dataset.lessThanValue, [strMax]);
				}
			}
			
			//Check unique in local data, if need check at server side, use 'customValidator' instead.
			if(fldObj.unique()) {
				var currDs = fldObj.dataset(),
					dataList = currDs.dataList();
				
				if(value !== null && value !== undefined && dataList && dataList.length > 1) {
					var currRec = currDs.getRecord(), 
						fldName = fldObj.name(),
						rec;
					for(var i = 0, len = dataList.length; i < len; i++) {
						rec = dataList[i];
						if(rec === currRec) {
							continue;
						}
						if(rec[fldName] == value) {
							return jslet.locale.Dataset.notUnique;
						}
					}
				}
			}
			//Customized validation
			if (fldObj.customValidator()) {
				return fldObj.customValidator().call(fldObj.dataset(), fldObj, value);
			}
			
			return null;
		}
	};
	
	/*Start of field value converter*/
	jslet.data.FieldValueConverter = jslet.Class.create({
		className: 'jslet.data.FieldValueConverter',
		
		textToValue: function(fldObj, inputText) {
			var value = inputText;
			return value;
		},
		
		valueToText: function(fldObj, value, isEditing) {
			var text = value;
			return text;
		}
	});
	jslet.data.FieldValueConverter.className = 'jslet.data.FieldValueConverter';
	
	jslet.data.NumberValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
		textToValue: function(fldObj, inputText) {
			var value = null;
			if (inputText) {
				if (fldObj.scale() === 0) {
					value = parseInt(inputText);
				} else {
					value = parseFloat(inputText);
				}
			}
			return value;
		},
	
		valueToText: function(fldObj, value, isEditing) {
			var Z = this;
			if (fldObj.unitConverted()) {
				value = value * Z._unitConvertFactor;
			}
	
			if (!isEditing) {
				var rtnText = jslet.formatNumber(value, fldObj.displayFormat());
				if (fldObj.unitConverted() && Z._unitName) {
					rtnText += Z._unitName;
				}
				return rtnText;
			} else {
				return value;
			}
		}
	});
	
	jslet.data.DateValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
		textToValue: function(fldObj, inputText) {
			var value = jslet.parseDate(inputText, fldObj.displayFormat());
			return value; 
		},
		
		valueToText: function(fldObj, value, isEditing) {
			if (!(value instanceof Date)) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.invalidDateFieldValue, [fldObj.name()]));
			}
	
			return value ? jslet.formatDate(value, fldObj.displayFormat()): '';
		}
	});
	
	jslet.data.StringValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
		textToValue: function(fldObj, inputText) {
			var value = inputText;
			if (fldObj.antiXss()) {
				value = jslet.htmlEncode(value);
			}
			return value;
		}
	});
	
	jslet.data.BooleanValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
		textToValue: function(fldObj, inputText) {
			if(!inputText) {
				return false;
			}
			return inputText.toLowerCase() == 'true';
		},
		
		valueToText: function(fldObj, value, isEditing) {
			return value ? fldObj.trueText(): fldObj.falseText();
		}
	});
	
	jslet.data.LookupValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
		textToValue: function(fldObj, inputText, valueIndex) {
			if(!inputText) {
				return null;
			}
			var value = '',
				lkFldObj = fldObj.lookup(),
				lkDs = lkFldObj.dataset();
			
			value = lkDs._convertFieldValue(
					lkFldObj.codeField(), inputText, lkFldObj.keyField());
			if (value === null) {
				var invalidMsg = jslet.formatString(jslet.locale.Dataset.valueNotFound);
				fldObj.dataset().setFieldError(fldObj.name(), invalidMsg, valueIndex, inputText);
				lkDs.first();
				return undefined;
			}
			if(fldObj.valueStyle() === jslet.data.FieldValueStyle.NORMAL) {
				var fieldMap = lkFldObj.returnFieldMap(),
					lookupDs = lkFldObj.dataset();
				mainDs = this;
				if(lookupDs.findByKey(value)) {
					var fldName, lkFldName;
					for(var fldName in fieldMap) {
						lkFldName = fieldMap[fldName];
						mainDs.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
					}
				}
			}
			return value;
		},
		
		valueToText: function(fldObj, value, isEditing) {
			var lkFldObj = fldObj.lookup(),
				lkds = lkFldObj.dataset(),
				result;
			if (!isEditing) {
				result = lkds._convertFieldValue(lkFldObj.keyField(), value,
						lkFldObj.displayFields());
			} else {
				result = lkds._convertFieldValue(lkFldObj.keyField(), value, 
						'[' + lkFldObj.codeField() + ']');
			}
			return result;
		}
	});
	
	jslet.data._valueConverters = {};
	jslet.data._valueConverters[jslet.data.DataType.NUMBER] = new jslet.data.NumberValueConverter();
	jslet.data._valueConverters[jslet.data.DataType.STRING] = new jslet.data.StringValueConverter();
	jslet.data._valueConverters[jslet.data.DataType.DATE] = new jslet.data.DateValueConverter();
	jslet.data._valueConverters[jslet.data.DataType.BOOLEAN] = new jslet.data.BooleanValueConverter();
	
	jslet.data._valueConverters.lookup = new jslet.data.LookupValueConverter();
	
	/**
	 * Get appropriate field value converter.
	 * 
	 * @param {jslet.data.Field} fldObj field object.
	 * 
	 * @return {jslet.data.FieldValueConverter} field value converter;
	 */
	jslet.data.getValueConverter = function(fldObj) {
		if(fldObj.lookup()) {
			return jslet.data._valueConverters.lookup;
		}
		
		return jslet.data._valueConverters[fldObj.getType()];
	};
	/* End of field value converter */
	
	/**
	 * Convert dataset record to json.
	 * 
	 * @param {Array of Object} records Dataset records, required.
	 * @param {Array of String} excludeFields Excluded field names,optional.
	 * 
	 * @return {String} Json String. 
	 */
	jslet.data.record2Json = function(records, excludeFields) {
		if(!window.JSON || !JSON) {
			alert('Your browser does not support JSON!');
			return;
		}
		if(excludeFields) {
			jslet.Checker.test('record2Json#excludeFields', excludeFields).isArray();		
		}
		
		function record2JsonFilter(key, value) {
			if(key == '_jl_') {
				return undefined;
			}
			if(excludeFields) {
				var fldName;
				for(var i = 0, len = excludeFields.length; i < len; i++) {
					fldName = excludeFields[i];
					if(key == fldName) {
						return undefined;
					}
				}
			}
			return value;		
		}
		
		return JSON.stringify(records, record2JsonFilter);
	};
	
	jslet.data.getRecInfo = function(record) {
		if(!record) {
			return null;
		}
		var recInfo = record._jl_;
		if(!recInfo) {
			recInfo = {};
			record._jl_ = recInfo;
		}
		return recInfo;
	}
	
	/*Field value cache manager*/
	jslet.data.FieldValueCache = {
		
		put: function(record, fieldName, value, valueIndex) {
			var recInfo = jslet.data.getRecInfo(record), 
				cacheObj = recInfo.cache;
			if(!cacheObj) {
				cacheObj = {};
				record._jl_.cache = cacheObj;
			}
			if(valueIndex || valueIndex === 0) {
				var fldCacheObj = cacheObj[fieldName];
				if(!fldCacheObj || !jslet.isObject(fldCacheObj)){
					fldCacheObj = {};
					cacheObj[fieldName] = fldCacheObj;
				}
				fldCacheObj[valueIndex+""] = value;
			} else {
				cacheObj[fieldName] = value;
			}
		},
		
		get: function(record, fieldName, valueIndex) {
			var recInfo = jslet.data.getRecInfo(record), 
				cacheObj = recInfo.cache;
			if(cacheObj) {
				if(valueIndex || valueIndex === 0) {
					var fldCacheObj = cacheObj[fieldName];
					if(fldCacheObj && jslet.isObject(fldCacheObj)){
						return fldCacheObj[valueIndex+""];
					}
					return undefined;
				} else {
					return cacheObj[fieldName];
				}
			} else {
				return undefined;
			}
		},
		
		clear: function(record, fieldName) {
			var recInfo = jslet.data.getRecInfo(record), 
				cacheObj = recInfo.cache;
			if(cacheObj) {
				delete cacheObj[fieldName];
			}
		},
		
		clearAll: function(dataset, fieldName) {
			var dataList = dataset.dataList();
			if(!dataList) {
				return;
			}
			var rec, cacheObj, recInfo;
			for(var i = 0, len = dataList.length; i < len; i++) {
				rec = dataList[i];
				var recInfo = jslet.data.getRecInfo(rec), 
					cacheObj = recInfo.cache;
				if(cacheObj) {
					delete cacheObj[fieldName];
				}
			}
		},
		
		removeCache: function(record) {
			var recInfo = jslet.data.getRecInfo(record);
			delete recInfo['cache'];
		},
		
		removeAllCache: function(dataset) {
			var dataList = dataset.dataList();
			if(!dataList) {
				return;
			}
			var rec, cacheObj, recInfo;
			for(var i = 0, len = dataList.length; i < len; i++) {
				rec = dataList[i];
				if(!rec) {
					continue;
				}
				recInfo = jslet.data.getRecInfo(rec); 
				delete recInfo['cache'];
			}
		}
	};
	/*End of field value cache manager*/
	
	/*Field value cache manager*/
	jslet.data.FieldError = {
		
		put: function(record, fldName, errorMsg, valueIndex, inputText) {
			if(!errorMsg) {
				jslet.data.FieldError.clear(record, fldName, valueIndex);
				return;
			}
			var recInfo = jslet.data.getRecInfo(record), 
				errObj = recInfo.error;
			if(!errObj) {
				errObj = {};
				recInfo.error = errObj;
			}
			var fldErrObj = errObj[fldName];
			if(!fldErrObj) {
				fldErrObj = {};
				errObj[fldName] = fldErrObj;
			}
			var errMsgObj = {message: errorMsg};
			if(inputText !== undefined) {
				errMsgObj.inputText = inputText;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			fldErrObj[valueIndex+""] = errMsgObj;
		},
		
		putDetailError: function(record, fldName, errorCount) {
			var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
			if(!errObj) {
				errObj = {};
				recInfo.error = errObj;
			}
			var fldErrObj = errObj[fldName];
			if(!fldErrObj) {
				fldErrObj = {};
				errObj[fldName] = fldErrObj;
			}
			if(!valueIndex) {
				valueIndex = 0;
			}
			var errMsgObj = fldErrObj[valueIndex+""];
			if(!errMsgObj) {
				errMsgObj = {errorCount: 0};
				fldErrObj[valueIndex+""] = errMsgObj;
			}
			errMsgObj.errorCount += errorCount;
			if(errMsgObj.errorCount <= 0) {
				jslet.data.FieldError.clear(record, fldName);
			}
			
		},
		
		get: function(record, fldName, valueIndex) {
			var recInfo = jslet.data.getRecInfo(record), 
				errObj = recInfo.error;
			if(errObj) {
				var fldErrObj = errObj[fldName];
				if(!fldErrObj) {
					return null;
				}
				if(!valueIndex) {
					valueIndex = 0;
				}
				return fldErrObj[valueIndex+""];
			} else {
				return null;
			}
		},
		
		clear: function(record, fldName, valueIndex) {
			var recInfo = jslet.data.getRecInfo(record), 
				errObj = recInfo.error;
			if(errObj) {
				var fldErrObj = errObj[fldName];
				if(!fldErrObj) {
					return;
				}
				if(!valueIndex) {
					valueIndex = 0;
				}
				delete fldErrObj[valueIndex+""];
				var found = false;
				for(var idx in fldErrObj) {
					foutnd = true;
					break;
				}
				if(!found) {
					delete errObj[fldName];
				} 
			}
		},
		
		existFieldError: function(record, fldName, valueIndex) {
			var recInfo = jslet.data.getRecInfo(record), 
			errObj = recInfo.error;
			if(errObj) {
				var fldErrObj = errObj[fldName];
				if(!fldErrObj){
					return false;
				}
				if(!valueIndex) {
					valueIndex = 0;
				}
				return fldErrObj[valueIndex+""] ? true: false;
			}
			return false;
		},
		
		existRecordError: function(record) {
			var recInfo = jslet.data.getRecInfo(record);
			if(!recInfo) {
				return false;
			}
			var errObj = recInfo.error;
			if(errObj) {
				for(var fldName in errObj) {
					if(errObj[fldName]) {
						return true;
					}
				}
			}
			return false;
		},
		
		clearFieldError: function(dataset, fldName) {
			var dataList = dataset.dataList();
			if(!dataList) {
				return;
			}
			var rec, errObj, recInfo;
			for(var i = 0, len = dataList.length; i < len; i++) {
				rec = dataList[i];
				var recInfo = jslet.data.getRecInfo(rec), 
					errObj = recInfo.error;
				if(errObj) {
					delete errObj[fldName];
				}
			}
		},
		
		clearRecordError: function(record) {
			var recInfo = jslet.data.getRecInfo(record);
			if(recInfo) {
				delete recInfo['error'];
			}
		},
		
		clearDatasetError: function(dataset) {
			var dataList = dataset.dataList();
			if(!dataList) {
				return;
			}
			var rec, errObj, recInfo;
			for(var i = 0, len = dataList.length; i < len; i++) {
				rec = dataList[i];
				recInfo = jslet.data.getRecInfo(rec); 
				delete recInfo['error'];
			}
		}
	};
	/*End of field value error manager*/
	
	jslet.data.DatasetRelationManager = function() {
		var relations= [];
		
		/**
		 * Add dataset relation.
		 * 
		 * @param {String} hostDsName host dataset name;
		 * @param {String} hostFldName field name of host dataset;
		 * @param {String} lookupOrDetailDsName lookup or detail dataset name;
		 * @param {jslet.data.DatasetType} relationType, optional value: jslet.data.DatasetType.LOOKUP, jslet.data.DatasetType.DETAIL
		 */
		this.addRelation = function(hostDsName, hostFldName, lookupOrDetailDsName, relationType) {
			for(var i = 0, len = relations.length; i < len; i++) {
				var relation = relations[i];
				if(relation.hostDataset == hostDsName && 
					relation.hostField == hostFldName && 
					relation.lookupDataset == lookupOrDetailDsName) {
					return;
				}
			}
			relations.push({hostDataset: hostDsName, hostField: hostFldName, lookupOrDetailDataset: lookupOrDetailDsName, relationType: relationType});
			//If reation type is DETAIL, set 'datasetField' property of detail dataset.
			if(relationType == jslet.data.DatasetType.DETAIL) {
				var detailDs = jslet.data.getDataset(lookupOrDetailDsName);
				if(detailDs) {
					var fldObj = this.getHostFieldObject(lookupOrDetailDsName);
					if(fldObj) {
						detailDs.datasetField(fldObj);
					}
				}
			}
		};
		
		this.removeRelation = function(hostDsName, hostFldName, lookupOrDetailDsName) {
			for(var i = relations.length - 1; i >= 0; i--) {
				var relation = relations[i];
				if(relation.hostDataset == hostDsName && 
					relation.hostField == hostFldName && 
					relation.lookupOrDetailDataset == lookupOrDetailDsName) {
					relations.splice(i,1);
				}
			}
		};
		
		this.removeDataset = function(datasetName) {
			for(var i = relations.length - 1; i >= 0; i--) {
				var relation = relations[i];
				if(relation.hostDataset == datasetName || relation.lookupOrDetailDataset == datasetName) {
					relations.splice(i,1);
				}
			}
		};
		
		this.changeDatasetName = function(oldName, newName) {
			if(!oldName || !newName) {
				return;
			}
			for(var i = 0, len = relations.length; i < len; i++) {
				var relation = relations[i];
				if(relation.hostDataset == oldName) {
					relation.hostDataset = newName;
				}
				if(relation.lookupOrDetailDataset == oldName) {
					relation.lookupOrDetailDataset = newName;
				}
			}
		};
		
		this.refreshLookupHostDataset = function(lookupDsName) {
			var relation, hostDataset;
			for(var i = 0, len = relations.length; i < len; i++) {
				relation = relations[i];
				if(relation.lookupOrDetailDataset == lookupDsName &&
					relation.relationType == jslet.data.DatasetType.LOOKUP) {
					hostDataset = jslet.data.getDataset(relation.hostDataset);
					if(hostDataset) {
						hostDataset.handleLookupDatasetChanged(relation.hostField);
					} else {
						throw new Error('NOT found Host dataset: ' + relation.hostDataset);
					}
				}
			}
		};
		
		this.getHostFieldObject = function(lookupOrDetailDsName) {
			var relation, hostDataset;
			for(var i = 0, len = relations.length; i < len; i++) {
				relation = relations[i];
				if(relation.lookupOrDetailDataset == lookupOrDetailDsName &&
					relation.relationType == jslet.data.DatasetType.DETAIL) {
					hostDataset = jslet.data.getDataset(relation.hostDataset);
					if(hostDataset) {
						return hostDataset.getField(relation.hostField);
					} else {
						throw new Error('NOT found Host dataset: ' + relation.hostDataset);
					}
				}
			} //end for i	
		}
	};
	jslet.data.datasetRelationManager = new jslet.data.DatasetRelationManager();
	
	jslet.data.convertDateFieldValue = function(dataset, records) {
		var Z = dataset;
		if(!records) {
			records = Z.dataList();
		}
		if (!records || records.length === 0) {
			return;
		}
	
		var dateFlds = [], subFlds = [],
			fields = Z.getNormalFields(),
			fldObj;
		for (var i = 0, len = fields.length; i < len; i++) {
			fldObj = fields[i];
			if (fldObj.getType() == jslet.data.DataType.DATE) {
				dateFlds.push(fldObj.name());
			}
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				subFlds.push(fldObj);
			}
		}
		if (dateFlds.length === 0 && subFlds.length === 0) {
			return;
		}
	
		var rec, fname, value,
			fcnt = dateFlds.length,
			subCnt = subFlds.length;
		for (var i = 0, recCnt = records.length; i < recCnt; i++) {
			rec = records[i];
			for (var j = 0; j < fcnt; j++) {
				fname = dateFlds[j];
				value = rec[fname];
				if (!jslet.isDate(value)) {
					value = jslet.parseDate(value,'yyyy-MM-ddThh:mm:ss');
					if (value) {
						rec[fname] = value;
					} else {
						throw new Error(jslet.formatString(jslet.locale.Dataset.invalidDateFieldValue,[fldName]));
					}
				} //end if
			} //end for j
			for(var j = 0; j < subCnt; j++) {
				fldObj = subFlds[j];
				fname = fldObj.name();
				jslet.data.convertDateFieldValue(fldObj.subDataset(), rec[fname]);
			}
		} //end for i
		
	}
	
	jslet.emptyPromise = {
		done: function(callBackFn) {
			if(callBackFn) {
				callBackFn();
			}
			return this;
		},
		
		fail: function(callBackFn) {
			if(callBackFn) {
				callBackFn();
			}
			return this;
		},
		
		always: function(callBackFn) {
			if(callBackFn) {
				callBackFn();
			}
			return this;
		}
	}
	
	jslet.data.displayOrderComparator = function(fldObj1, fldObj2) {
		return fldObj1.displayOrder() - fldObj2.displayOrder();
	}
	
	/**
	 * Data selection class.
	 */
	jslet.data.DataSelection = function(dataset) {
		this._dataset = dataset;
		this._selection = [];
		this._onChanged;
	}
	
	jslet.data.DataSelection.prototype = {
		/**
		 * Select all data.
		 * 
		 * @param {String[]} fields An array of field name to be selected.
		 * @param {Boolean} fireEvent Identify firing event or not.
		 */
		selectAll: function(fields, fireEvent) {
			jslet.Checker.test('DataSelection.add#fields', fields).isArray();
			this.removeAll();
			if(!fields) {
				var arrFldObj = this._dataset.getNormalFields(), fldName;
				fields = [];
				for(var i = 0, len = arrFldObj.length; i < len; i++) {
					fldName = arrFldObj[i].name();
					fields.push(fldName);
				}
			}
			this.add(0, this._dataset.recordCount() - 1, fields, fireEvent)
		},
		
		/**
		 * Remove all selected data.
		 */
		removeAll: function() {
			this._selection = [];
		},
		
		/**
		 * Add data into selection.
		 * 
		 * @param {Integer} startRecno The start recno to be selected.
		 * @param {Integer} endRecno The end recno to be selected.
		 * @param {String[]} fields An array of field name to be selected.
		 * @param {Boolean} fireEvent Identify firing event or not.
		 */
		add: function(startRecno, endRecno, fields, fireEvent) {
			jslet.Checker.test('DataSelection.add#startRecno', startRecno).required().isNumber();
			jslet.Checker.test('DataSelection.add#endRecno', endRecno).required().isNumber();
			jslet.Checker.test('DataSelection.add#fields', fields).required().isArray();
	
			if(endRecno === undefined) {
				endRecno = startRecno;
			}
			var fldName;
			for(var recno = startRecno; recno <= endRecno; recno++) {
				for(var i = 0, len = fields.length; i < len; i++) {
					fldName = fields[i];
					this._selectCell(recno, fldName, true);
				}
			}
			if(fireEvent && this._onChanged) {
				this._onChanged(startRecno, endRecno, fields, true);
			}
		},
	
		/**
		 * Unselect data.
		 * 
		 * @param {Integer} startRecno The start recno to be unselected.
		 * @param {Integer} endRecno The end recno to be selected.
		 * @param {String[]} fields An array of field name to be unselected.
		 * @param {Boolean} fireEvent Identify firing event or not.
		 */
		remove: function(startRecno, endRecno, fields, fireEvent) {
			jslet.Checker.test('DataSelection.remove#startRecno', startRecno).required().isNumber();
			jslet.Checker.test('DataSelection.remove#endRecno', endRecno).required().isNumber();
			jslet.Checker.test('DataSelection.remove#fields', fields).required().isArray();
	
			if(endRecno === undefined) {
				endRecno = startRecno;
			}
			if(startRecno > endRecno) {
				var tmp = startRecno;
				startRecno = endRecno;
				endRecno = tmp;
			}
			var fldName;
			for(var recno = startRecno; recno <= endRecno; recno++) {
				for(var i = 0, len = fields.length; i < len; i++) {
					fldName = fields[i];
					this._selectCell(recno, fldName, false);
				}
			}
			if(fireEvent && this._onChanged) {
				this._onChanged(startRecno, endRecno, fields, false);
			}
		},
	
		/**
		 * Fired when the selection area is changed.
		 * 
		 * @param {Function} onChanged The event handler, format:
		 * 	function(startRecno, endRecno, fields, selected) {
		 * 		//startRecno - Integer, start recno;
		 * 		//endRecno - Integer, end recno;
		 * 		//fields - String[], field names;
		 * 		//selected - Boolean, selected or not;	
		 * 	}
		 * 	
		 */
		onChanged: function(onChanged) {
			if(onChanged === undefined) {
				return this._onChanged;
			}
			jslet.Checker.test('DataSelection.onChanged', onChanged).isFunction();
			this._onChanged = onChanged;
		},
		
		/**
		 * Check the specified cell is selected or not.
		 * 
		 * @param {Integer} recno Record no.
		 * @param {String} fldName Field name.
		 * 
		 * @return {Boolean}
		 */
		isSelected: function(recno, fldName) {
			jslet.Checker.test('DataSelection.isSelected#recno', recno).required().isNumber();
			jslet.Checker.test('DataSelection.isSelected#fldName', fldName).required().isString();
			var selObj;
			for(var i = 0, len = this._selection.length; i < len; i++) {
				selObj = this._selection[i];
				if(selObj._recno_ === recno && selObj[fldName]) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Get selected text.
		 * 
		 * @param {String} seperator Seperator for fields.
		 * 
		 * @return {String}
		 */
		getSelectionText: function(seperator) {
			if(!seperator) {
				seperator = '\t';
			}
			var dataset = this._dataset,
				result = [], 
				context = dataset.startSilenceMove(),
				fields = dataset.getNormalFields(),
				fldCnt = fields.length,
				fldName, textRec = '', fldObj, text;
			try {
				dataset.first();
				while(!dataset.isEof()) { 
					for(var i = 0; i < fldCnt; i++) {
						fldObj = fields[i];
						fldName = fldObj.name();
						if(this.isSelected(dataset.recno(), fldName)) {
							//If Number field does not have lookup field, return field value, not field text. 
							//Example: 'amount' field
							if(fldObj.getType() === 'N' && !fldObj.lookup()) {
								text = fldObj.getValue();
							} else {
								text = dataset.getFieldText(fldName);
								if(text === null || text === undefined) {
									text = '';
								}
							}
							textRec += text + seperator; 
						}
					}
					if(textRec) {
						result.push(textRec);
					}
					textRec = '';
					dataset.next(); 
				} 
			} finally { 
				dataset.endSilenceMove(context); 
			}
			if(result.length > 0) {
				return result.join('\n');
			} else {
				return null;
			}
		},
		
		_selectCell: function(recno, fldName, selected) {
			var selObj
				found = false;
			for(var i = 0, len = this._selection.length; i < len; i++) {
				selObj = this._selection[i];
				if(selObj._recno_ === recno) {
					found = true;
					selObj[fldName] = selected;
				}
			}
			if(selected && !found) {
				selObj = {_recno_: recno};
				selObj[fldName] = true;
				this._selection.push(selObj);
			}
		}
	}
	
	jslet.data.GlobalDataHandler = function() {
		var Z = this;
		Z._datasetMetaChanged = null;
		Z._fieldMetaChanged = null;
		Z._fieldValueChanged = null;
	}
	
	jslet.data.GlobalDataHandler.prototype = {
			
		/**
		 * Fired when dataset created.
		 *  Pattern: 
		 *	function(dataset}{}
		 *  	//dataset:{jslet.data.Dataset} Dataset Object
		 *  
		 * @param {Function or undefined} datasetCreated dataset created event handler.
		 * @return {this or Function}
		 */
		datasetCreated: function(datasetCreated) {
			var Z = this;
			if(datasetCreated === undefined) {
				return Z._datasetCreated;
			}
			jslet.Checker.test('globalDataHandler.datasetCreated', datasetCreated).isFunction();
			Z._datasetCreated = datasetCreated;
		},
		
		/**
		 * Fired when dataset meta is changed.
		 *  Pattern: 
		 *	function(dataset, metaName}{}
		 *  	//dataset:{jslet.data.Dataset} Dataset Object
		 *  	//metaName: {String} dataset's meta name
		 *  
		 * @param {Function or undefined} datasetMetaChanged dataset meta changed event handler.
		 * @return {this or Function}
		 */
		datasetMetaChanged: function(datasetMetaChanged) {
			var Z = this;
			if(datasetMetaChanged === undefined) {
				return Z._datasetMetaChanged;
			}
			jslet.Checker.test('globalDataHandler.datasetMetaChanged', datasetMetaChanged).isFunction();
			Z._datasetMetaChanged = datasetMetaChanged;
		},
		
		/**
		 * Fired when field meta is changed.
		 *  Pattern: 
		 *	function(dataset, fieldName, metaName}{}
		 *  	//dataset:{jslet.data.Dataset} Dataset Object
		 *  	//fieldName: {String} field name
		 *  	//metaName: {String} dataset's meta name
		 *  
		 * @param {Function or undefined} fieldMetaChanged dataset meta changed event handler.
		 * @return {this or Function}
		 */
		fieldMetaChanged: function(fieldMetaChanged) {
			var Z = this;
			if(fieldMetaChanged === undefined) {
				return Z._fieldMetaChanged;
			}
			jslet.Checker.test('globalDataHandler.fieldMetaChanged', fieldMetaChanged).isFunction();
			Z._fieldMetaChanged = fieldMetaChanged;
		},
		
		/**
		 * Fired when field value is changed.
		 *  Pattern: 
		 *	function(dataset, metaName}{}
		 *  	//dataset:{jslet.data.Dataset} Dataset Object
		 *  	//fieldName: {String} field name
		 *  	//fieldValue: {Object} field value
		 *  	//valueIndex: {Integer} value index
		 *  
		 * @param {Function or undefined} fieldValueChanged field value changed event handler.
		 * @return {this or Function}
		 */
		fieldValueChanged: function(fieldValueChanged) {
			var Z = this;
			if(fieldValueChanged === undefined) {
				return Z._fieldValueChanged;
			}
			jslet.Checker.test('globalDataHandler.fieldValueChanged', fieldValueChanged).isFunction();
			Z._fieldValueChanged = fieldValueChanged;
		}
		
	}
	
	jslet.data.globalDataHandler = new jslet.data.GlobalDataHandler();
	/* ========================================================================
	 * Jslet framework: jslet.dataset.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class Dataset
	 * 
	 * @param {String} name dataset's name that must be unique in jslet.data.dataModule variable.
	 */
	jslet.data.Dataset = function (name) {
		
		var Z = this;
		Z._name = null; //Dataset name
		Z._recordClass = jslet.global.defaultRecordClass; //Record class, used for serialized/deserialize
		Z._dataList = null; //Array of data records
		Z._oriDataList = null;
		Z._fields = []; //Array of jslet.data.Field
		Z._oriFields = null;
		
		Z._normalFields = []; //Array of jslet.data.Field except the fields with children.
		Z._recno = -1;
		Z._filteredRecnoArray = null;
	
		Z._unitConvertFactor = 1;
		Z._unitName = null;
		Z._aborted = false;
	
		Z._status = 0; // dataset status, optional values: 0:browse;1:created;2:updated;3:deleted;
		Z._subDatasetFields = null; //Array of dataset field object
		
		Z._fixedFilter = null;	
		Z._filter = null;
		Z._filtered = false;
		Z._innerFilter = null; //inner variable
		Z._findCondition = null;
		Z._innerFindCondition = null; //inner variable
	
		Z._innerFormularFields = null; //inner variable
	
		Z._bof = false;
		Z._eof = false;
		Z._igoreEvent = false;
		Z._logChanges = true;
	
		Z._modiObject = null;
		Z._inputtingRecord = {};
		Z._lockCount = 0;
	
		Z._fixedIndexFields = null;
		Z._innerFixedIndexFields = [];
		Z._indexFields = '';
		Z._innerIndexFields = [];
		Z._sortingFields = null;
	
		Z._convertDestFields = null;
		Z._innerConvertDestFields = null;
	
		Z._masterDataset = null;
		Z._detailDatasets = null; // array
	
		Z._datasetField = null; //jslet.data.Field 
	
		Z._linkedControls = []; //Array of DBControl except DBLabel
		Z._linkedLabels = []; //Array of DBLabel
		Z._silence = 0;
		Z._keyField = null;
		Z._codeField = null;
		Z._nameField = null;
		Z._parentField = null;
		Z._levelOrderField = null;
		Z._selectField = null;
		
		Z._contextRules = null;
		Z._contextRuleEngine = null;
		Z._contextRuleEnabled = false;
	
		Z._dataProvider = jslet.data.DataProvider ? new jslet.data.DataProvider() : null;
	
		Z._queryCriteria = null; //String query parameters 
		Z._queryUrl = null; //String query URL 
		Z._submitUrl = null; //String submit URL
		Z._pageSize = 500;
		Z._pageNo = 0;  
		Z._pageCount = 0;
		//The following attributes are used for private.
		Z._ignoreFilter = false;
		Z._ignoreFilterRecno = 0;
		
		Z._fieldValidator = new jslet.data.FieldValidator();
		
		Z._onFieldChanged = null;  
		
		Z._onCheckSelectable = null;
		
		Z._datasetListener = null; //
		
		Z._designMode = false;
		
		Z._autoShowError = true;
		Z._autoRefreshHostDataset = false;
		Z._readOnly = false;
		Z._aggradedValues = null;
		Z._afterScrollDebounce = jslet.debounce(Z._innerAfterScrollDebounce, 30);
		Z._onlyChangedSubmitted = false;
		Z.selection = new jslet.data.DataSelection(Z);
		Z._changeLog = new jslet.data.ChangeLog(Z);
		Z._dataTransformer = new jslet.data.DataTransformer(Z);
		Z._followedValue = null;
	
		Z._lastFindingValue = null;
		Z._inContextRule = false;
		
		Z._errRecordCount = 0;
		this.name(name);
	};
	jslet.data.Dataset.className = 'jslet.data.Dataset';
	
	jslet.data.Dataset.prototype = {
	
		className: jslet.data.Dataset.className,
		/**
		* Set dataset's name.
		* 
		* @param {String} name Dataset's name that must be unique in jslet.data.dataModule variable.
		* @return {String or this}
		*/
		name: function(name) {
			var Z = this;
			if(name === undefined) {
				return Z._name;
			}
			jslet.Checker.test('Dataset.name', name).required().isString();
			name = jQuery.trim(name);
			
			var dsName = this._name;
			if (dsName) {
				jslet.data.dataModule.unset(dsName);
				jslet.data.datasetRelationManager.changeDatasetName(dsName, name);
			}
			jslet.data.dataModule.unset(name);
			jslet.data.dataModule.set(name, this);
			this._name = name;
			Z._datasetField = jslet.data.datasetRelationManager.getHostFieldObject(name); //jslet.data.Field 
			return this;
		},
			
		/**
		* Set dataset's record class, recordClass is the server entity class quantified name.
		* It's used for automated serialization.
		* 
		* @param {String} clazz Server entity class name.
		* @return {String or this}
		*/
		recordClass: function(clazz) {
			var Z = this;
			if (clazz === undefined) {
				return Z._recordClass;
			}
			jslet.Checker.test('Dataset.recordClass', clazz).isString();
			Z._recordClass = clazz ? clazz.trim() : null;
			return this;
		},
			
		/**
		* Clone this dataset's structure and return new dataset object..
		* 
		* @param {String} newDsName New dataset's name.
		* @param {Array of String} fieldNames a list of field names which will be cloned to new dataset.
		* 
		* @return {jslet.data.Dataset} Cloned dataset object
		*/
		clone: function (newDsName, fieldNames) {
			var Z = this;
			if (!newDsName) {
				newDsName = Z._name + '_clone';
			}
			var result = new jslet.data.Dataset(newDsName);
			result._datasetListener = Z._datasetListener;
	
			result._unitConvertFactor = Z._unitConvertFactor;
			result._unitName = Z._unitName;
	
			result._fixedFilter = Z._fixedFilter;
			result._filter = Z._filter;
			result._filtered = Z._filtered;
			result._logChanges = Z._logChanges;
			result._fixedIndexFields = Z._fixedIndexFields;
			result._indexFields = Z._indexFields;
			result._onlyChangedSubmitted = Z._onlyChangedSubmitted;
			
			var keyFldName = Z._keyField,
				codeFldName = Z._codeField,
				nameFldName = Z._nameField,
				parentFldName = Z._parentField,
				levelOrderField = Z._levelOrderField,
				selectFldName = Z._selectField;
			if (fieldNames) {
				keyFldName = keyFldName && fieldNames.indexOf(keyFldName) >= 0 ? keyFldName: null;
				codeFldName = codeFldName && fieldNames.indexOf(codeFldName) >= 0 ? codeFldName: null;
				nameFldName = nameFldName && fieldNames.indexOf(nameFldName) >= 0 ? nameFldName: null;
				parentFldName = parentFldName && fieldNames.indexOf(parentFldName) >= 0 ? parentFldName: null;
				levelOrderField = levelOrderField && fieldNames.indexOf(levelOrderField) >= 0 ? levelOrderField: null;
				selectFldName = selectFldName && fieldNames.indexOf(selectFldName) >= 0 ? selectFldName: null;
			}
			result._keyField = keyFldName;
			result._codeField = codeFldName;
			result._nameField = nameFldName;
			result._parentField = parentFldName;
			result._levelOrderField = levelOrderField;
			result._selectField = selectFldName;
	
			result._contextRules = Z._contextRules;
			var fldObj, fldName;
			for(var i = 0, cnt = Z._fields.length; i < cnt; i++) {
				fldObj = Z._fields[i];
				fldName = fldObj.name();
				if (fieldNames) {
					if (fieldNames.indexOf(fldName) < 0) {
						continue;
					}
				}
				result.addField(fldObj.clone(fldName, result));
			}
			return result;
		},
	
		/**
		 * Clone one record to another
		 * 
		 * @param {Plan Object} srcRecord source record
		 * @param {Plan Object} destRecord destination record
		 */
		cloneRecord: function(srcRecord, destRecord) {
			var result = destRecord || {}, 
				fldName, fldObj, fldValue, newValue, 
				arrFieldObj = this.getNormalFields();
	
			for(var i = 0, len = arrFieldObj.length; i < len; i++) {
				fldObj = arrFieldObj[i];
				fldName = fldObj.name();
				fldValue = srcRecord[fldName];
				if(fldValue === undefined) {
					continue;
				}
				if(fldValue && jslet.isArray(fldValue)) {
					newValue = [];
					for(var j = 0, cnt = fldValue.length; j < cnt; j++) {
						newValue.push(fldValue[j]);
					}
				} else {
					newValue = fldValue;
				}
				result[fldName] = newValue;
			}
			jslet.data.FieldValueCache.removeCache(result);
			return result;
		},
		
		/**
		 * Add specified fields of source dataset into this dataset.
		 * 
		 * @param {jslet.data.Dataset} srcDataset New dataset's name.
		 * @param {Array of String} fieldNames a list of field names which will be copied to this dataset.
		 */
		addFieldFromDataset: function(srcDataset, fieldNames) {
			jslet.Checker.test('Dataset.addFieldFromDataset#srcDataset', srcDataset).required().isClass(jslet.data.Dataset.className);
			jslet.Checker.test('Dataset.addFieldFromDataset#fieldNames', fieldNames).isArray();
			var fldObj, fldName, 
				srcFields = srcDataset.getFields();
			for(var i = 0, cnt = srcFields.length; i < cnt; i++) {
				fldObj = srcFields[i];
				fldName = fldObj.name();
				if (fieldNames) {
					if (fieldNames.indexOf(fldName) < 0) {
						continue;
					}
				}
				this.addField(fldObj.clone(fldName, this));
			}
		},
		
		/**
		 * Set or get dataset is readonly or not.
		 * 
		 * @param {Boolean} readOnly.
		 * @return {Boolean or this}
		 */
		readOnly: function(readOnly) {
			var Z = this;
			if (readOnly === undefined) {
				return Z._readOnly;
			}
			
			Z._readOnly = readOnly? true: false;
			var fields = Z.getNormalFields(),
				fldObj;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				fldObj._fireMetaChangedEvent('readOnly', true);
			}
			return this;
		},
		
		/**
		 * Only submit the changed record to server.
		 * 
		 * @param {Boolean} onlyChangedSubmitted.
		 * @return {Boolean or this}
		 */
		onlyChangedSubmitted: function(onlyChangedSubmitted) {
			if(onlyChangedSubmitted === undefined) {
				return this._onlyChangedSubmitted;
			}
			this._onlyChangedSubmitted = onlyChangedSubmitted? true: false;
		},
		
		/**
		 * Set or get page size.
		 * 
		 * @param {Integer} pageSize.
		 * @return {Integer or this}
		 */
		pageSize: function(pageSize) {
			if (pageSize === undefined) {
				return this._pageSize;
			}
			
			jslet.Checker.test('Dataset.pageSize#pageSize', pageSize).isGTZero();
			this._pageSize = pageSize;
			return this;
		},
	
		/**
		 * Set or get page number.
		 * 
		 * @param {Integer} pageNo.
		 * @return {Integer or this}
		 */
		pageNo: function(pageNo) {
			if (pageNo === undefined) {
				return this._pageNo;
			}
			
			jslet.Checker.test('Dataset.pageNo#pageNo', pageNo).isGTZero();
			this._pageNo = pageNo;
			return this;
		},
		
		/**
		 * Get page count.
		 * 
		 * @return {Integer}
		 */
		pageCount: function() {
			return this._pageCount;
		},
		
		/**
		 * Identify whether dataset is in desin mode.
		 * 
		 * @param {boolean} designMode.
		 * @return {boolean or this}
		 */
		designMode: function(designMode) {
			if (designMode === undefined) {
				return this._designMode;
			}
			
			this._designMode = designMode ? true: false;
			return this;
		},
		
		/**
		 * Identify whether alerting the error message when confirm or apply to server.
		 * 
		 * @param {boolean} autoShowError.
		 * @return {boolean or this}
		 */
		autoShowError: function(autoShowError) {
			if (autoShowError === undefined) {
				return this._autoShowError;
			}
			
			this._autoShowError = autoShowError ? true: false;
			return this;
		},
		
		/**
		 * Update the host dataset or not if this dataset is a lookup dataset and its data has changed.
		 * If true, all datasets which host this dataset as a lookup dataset will be refreshed.
		 * 
		 * @param {boolean} flag.
		 * @return {boolean or this}
		 */
		autoRefreshHostDataset: function(flag) {
			if(flag === undefined) {
				return this._autoRefreshHostDataset;
			}
			this._autoRefreshHostDataset = flag ? true: false;
			return this;
		},
		
		/**
		 * Set unit converting factor.
		 * 
		 * @param {Double} factor When changed this value, the field's display value will be changed by 'fldValue/factor'.
		 * @param {String} unitName Unit name that displays after field value.
		 * @return {Double or this}
		 */
		unitConvertFactor: function (factor, unitName) {
			var Z = this;
			if (arguments.length === 0) {
				return Z._unitConvertFactor;
			}
			
			jslet.Checker.test('Dataset.unitConvertFactor#factor', factor).isGTZero();
			jslet.Checker.test('Dataset.unitConvertFactor#unitName', unitName).isString();
			if (factor > 0) {
				Z._unitConvertFactor = factor;
			}
			else{
				Z._unitConvertFactor = 1;
			}
	
			Z._unitName = unitName;
			for (var i = 0, cnt = Z._normalFields.length, fldObj; i < cnt; i++) {
				fldObj = Z._normalFields[i];
				if (fldObj.getType() == jslet.data.DataType.NUMBER && fldObj.unitConverted()) {
					var fldName = fldObj.name();
					jslet.data.FieldValueCache.clearAll(Z, fldName);
					var evt = jslet.data.RefreshEvent.updateColumnEvent(fldName);
					Z.refreshControl(evt);
				}
			} //end for
			return Z;
		},
	
		/**
		 * Set or get dataset event listener.
		 * Pattern:
		 * function(eventType, dataset) {}
		 * //eventType: jslet.data.DatasetEvent
		 * //dataset: jslet.data.Dataset
		 * 
		 * Example:
		 * <pre><code>
		 *   dsFoo.datasetListener(function(eventType, dataset) {
		 *		console.log(eventType);
		 *   });
		 * </code></pre>
		 * 
		 * @param {Function} listener Dataset event listener
		 * @return {Function or this}
		 */
		datasetListener: function(listener) {
			if (arguments.length === 0) {
				return this._datasetListener;
			}
			
			this._datasetListener = listener;
			return this;
		},
		
		/**
		 * Fired when check a record if it's selectable or not.
		 * Pattern:
		 *   function() {}
		 *   //return: Boolean, true - record can be selected, false - otherwise.
		 */
		onCheckSelectable: function(onCheckSelectable) {
			if (onCheckSelectable === undefined) {
				return this._onCheckSelectable;
			}
			
			this._onCheckSelectable = onCheckSelectable;
			return this;
		},
		
		fieldValidator: function() {
			return this._fieldValidator;
		},
		
		/**
		 * Set or get dataset onFieldChanged event handler.
		 * Pattern:
		 * function(fldName, value, valueIndex) {}
		 * //fldName: {String} field name
		 * //value: {Object} field value
		 * //valueIndex: {Integer} value index, has value when field value style is BETWEEN or MULTIPLE.
		 * 
		 * Example:
		 * <pre><code>
		 *   dsFoo.onFieldChanged(function(fldName, value, valueIndex) {
		 *		
		 *   });
		 * </code></pre>
		 * 
		 * @param {Function} onFieldChanged Dataset on field change event handler
		 * @return {Function or this}
		 */
		onFieldChanged: function(onFieldChanged) {
			if (onFieldChanged === undefined) {
				return this._onFieldChanged;
			}
			
			this._onFieldChanged = onFieldChanged;
			return this;
		},
		
		/**
		 * @deprecated
		 * Use onFieldChanged instead.
		 */
		onFieldChange: function(onFieldChanged) {
			if (onFieldChanged === undefined) {
				return this._onFieldChanged;
			}
			
			this._onFieldChanged = onFieldChanged;
			return this;
		},
		
		/**
		 * Get dataset fields.
		 * @return {Array of jslet.data.Field}
		 */
		getFields: function () {
			return this._fields;
		},
	
		/**
		 * Get fields except the fields with children.
		 * @return {Array of jslet.data.Field}
		 */
		getNormalFields: function() {
			return this._normalFields;
		},
		
		getEditableFields: function() {
			var fields = this._normalFields,
				fldObj,
				result = [];
			
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(fldObj.visible() && !fldObj.disabled() && !fldObj.readOnly()) {
					result.push(fldObj.name());
				}
			}
			return result;
		},
		
		/**
		 * Set the specified fields to be visible, others to be hidden.
		 * 
		 * Example:
		 * <pre><code>
		 *   dsFoo.setVisibleFields(['field1', 'field3']);
		 * </code></pre>
		 * 
		 * @param {String[]} fieldNameArray array of field name
		 */
		setVisibleFields: function(fieldNameArray) {
			jslet.Checker.test('Dataset.setVisibleFields#fieldNameArray', fieldNameArray).isArray();
			this._travelField(this._fields, function(fldObj) {
				fldObj.visible(false);
				return false; //Identify if cancel traveling or not
			});
			if(!fieldNameArray) {
				return;
			}
			for(var i = 0, len = fieldNameArray.length; i < len; i++) {
				var fldName = jQuery.trim(fieldNameArray[i]);
				var fldObj = this.getField(fldName);
				if(fldObj) {
					fldObj.visible(true);
				}
			}
		},
		
		/**
		 * @private
		 */
		_travelField: function(fields, callBackFn) {
			if (!callBackFn || !fields) {
				return;
			}
			var isBreak = false;
			for(var i = 0, len = fields.length; i < len; i++) {
				var fldObj = fields[i];
				isBreak = callBackFn(fldObj);
				if (isBreak) {
					break;
				}
				
				var children = fldObj.children();
				if(children && children.length > 0) {
					isBreak = this._travelField(fldObj.children(), callBackFn);
					if (isBreak) {
						break;
					}
				}
			}
			return isBreak;
		},
		
		/**
		 * @private
		 */
		_cacheNormalFields: function() {
			var arrFields = this._normalFields = [];
			this._travelField(this._fields, function(fldObj) {
				var children = fldObj.children();
				if(!children || children.length === 0) {
					arrFields.push(fldObj);
				}
				return false; //Identify if cancel traveling or not
			});
		},
		
		/**
		 * Set or get datasetField object, use internally.
		 * 
		 * @param {Field} datasetField, "dataset field" in master dataset.
		 * @return {jslet.data.Field or this}
		 */
		datasetField: function(fldObj) {
			if (fldObj === undefined) {
				return this._datasetField;
			}
			jslet.Checker.test('Dataset.datasetField#fldObj', fldObj).isClass(jslet.data.Field.className);
			this._datasetField = fldObj;
			return this;
		},
	
		/**
		* Add a new field object.
		* 
		* @param {jslet.data.Field} fldObj: field object.
		*/
		addField: function (fldObj) {
			jslet.Checker.test('Dataset.addField#fldObj', fldObj).required().isClass(jslet.data.Field.className);
			var Z = this,
				fldName = fldObj.name();
			if(Z.getField(fldName)) {
				Z.removeField(fldName);
			}
			Z._fields.push(fldObj);
			fldObj.dataset(Z);
			var dispOrder = fldObj.displayOrder(); 
			if (dispOrder) {
				Z._fields.sort(jslet.data.displayOrderComparator);
			} else {
				fldObj.displayOrder(Z._fields.length - 1);
			}
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				if (!Z._subDatasetFields) {
					Z._subDatasetFields = [];
				}
				Z._subDatasetFields.push(fldObj);
			}
			
			Z._cacheNormalFields();
			
			function addFormulaField(fldObj) {
				var children = fldObj.children();
				if(!children || children.length === 0) {
					Z.addInnerFormulaField(fldObj.name(), fldObj.formula());
					return;
				}
				for(var i = 0, len = children.length; i < len; i++) {
					addFormulaField(children[i]);
				}
			}
			
			addFormulaField(fldObj);
			return Z;
		},
		
		refreshDisplayOrder: function() {
			this._fields.sort(jslet.data.displayOrderComparator);
			this._cacheNormalFields();
		},
		
		moveField: function(fromFldName, toFldName) {
			var Z = this,
				fromFldObj = Z.getField(fromFldName),
				toFldObj = Z.getField(toFldName),
				fromParent = fromFldObj.parent(),
				toParent = toFldObj.parent();
			if(!fromFldObj || !toFldObj || fromParent != toParent) {
				return;
			}
			var fields;
			if(fromParent) {
				fields = fromParent.children();
			} else {
				fields = Z._fields;
			}
			var fldObj, fldName,
				fromOrder = fromFldObj.displayOrder(),
				toOrder = toFldObj.displayOrder(),
				fromIndex = fields.indexOf(fromFldObj),
				toIndex = fields.indexOf(toFldObj),
				oldDesignMode = Z.designMode();
			Z.designMode(false);
			try {
				fromFldObj.displayOrder(toFldObj.displayOrder());
				if(fromIndex < toIndex) {
					for(var i = fromIndex + 1; i <= toIndex; i++) {
						fldObj = fields[i];
						fldObj.displayOrder(fldObj.displayOrder() - 1);
					}
				} else {
					for(var i = toIndex; i < fromIndex; i++) {
						fldObj = fields[i];
						fldObj.displayOrder(fldObj.displayOrder() + 1);
					}
				}
			} finally {
				Z.designMode(oldDesignMode);
			}
			Z.refreshDisplayOrder();
			if(Z.designMode()) {
				var handler = jslet.data.globalDataHandler.fieldMetaChanged();
				if(handler) {
					handler.call(this, Z, null, 'displayOrder');
				}
			}
		},
		
		/**
		 * Remove field by field name.
		 * 
		 * @param {String} fldName: field name.
		 */
		removeField: function (fldName) {
			jslet.Checker.test('Dataset.removeField#fldName', fldName).required().isString();
			fldName = jQuery.trim(fldName);
			var Z = this,
				fldObj = Z.getField(fldName);
			if (fldObj) {
				if (fldObj.getType() == jslet.data.DataType.DATASET) {
					var k = Z._subDatasetFields.indexOf(fldObj);
					if (k >= 0) {
						Z._subDatasetFields.splice(k, 1);
					}
				}
				var i = Z._fields.indexOf(fldObj);
				Z._fields.splice(i, 1);
				fldObj.dataset(null);
				Z.removeInnerFormulaField(fldName);
				Z._cacheNormalFields();
				jslet.data.FieldValueCache.clearAll(Z, fldName);
	
				function removeFormulaField(fldObj) {
					var children = fldObj.children();
					if(!children || children.length === 0) {
						Z.removeInnerFormulaField(fldObj.name());
						return;
					}
					for(var i = 0, len = children.length; i < len; i++) {
						removeFormulaField(children[i]);
					}
				}
				
				removeFormulaField(fldObj);
				
			}
			return Z;
		},
	
		/**
		 * Get field object by name.
		 * 
		 * @param {String} fldName: field name.
		 * @return jslet.data.Field
		 */
		getField: function (fldName) {
			jslet.Checker.test('Dataset.getField#fldName', fldName).isString().required();
			fldName = jQuery.trim(fldName);
	
			var arrField = fldName.split('.'), fldName1 = arrField[0];
			var fldObj = null;
			this._travelField(this._fields, function(fldObj1) {
				var cancelTravel = false;
				if (fldObj1.name() == fldName1) {
					fldObj = fldObj1;
					cancelTravel = true;
				}
				return cancelTravel; //Identify if cancel traveling or not
			});
	
			if (!fldObj) {
				return null;
			}
			
			if (arrField.length == 1) {
				return fldObj;
			}
			else {
				arrField.splice(0, 1);
				var lkf = fldObj.lookup();//Lookup dataset
				if (lkf) {
					var lkds = lkf.dataset();
					if (lkds) {
						return lkds.getField(arrField.join('.'));
					}
				} else {
					var subDs = fldObj.subDataset(); //Detail dataset
					if(subDs) {
						return subDs.getField(arrField.join('.'));
					}
				}
			}
			return null;
		},
	
		/**
		 * Get field object by name.
		 * 
		 * @param {String} fldName: field name.
		 * @return jslet.data.Field
		 */
		getTopField: function (fldName) {
			jslet.Checker.test('Dataset.getField#fldName', fldName).isString().required();
			fldName = jQuery.trim(fldName);
			
			var fldObj = this.getField(fldName);
			if (fldObj) {
				while(true) {
					if (fldObj.parent() === null) {
						return fldObj;
					}
					fldObj = fldObj.parent();
				}
			}
			return null;
		},
		
		/**
		 * @Private,Sort function.
		 * 
		 * @param {Object} rec1: dataset record.
		 * @param {Object} rec2: dataset record.
		 */
		sortFunc: function (rec1, rec2) {
			var dsObj = jslet.temp.sortDataset;
			
			var indexFlds = dsObj._sortingFields,
				strFields = [],
				fname, idxFldCfg;
			for (var i = 0, cnt = indexFlds.length; i < cnt; i++) {
				idxFldCfg = indexFlds[i];
				fname = idxFldCfg.fieldName;
				if(idxFldCfg.useTextToSort || dsObj.getField(fname).getType() === jslet.data.DataType.STRING) {
					strFields.push(fname);
				}
			}
			var  v1, v2, flag = 1;
			for (var i = 0, cnt = indexFlds.length; i < cnt; i++) {
				idxFldCfg = indexFlds[i];
				fname = idxFldCfg.fieldName;
				if(idxFldCfg.useTextToSort) {
					v1 = dsObj.getFieldTextByRecord(rec1, fname);
					v2 = dsObj.getFieldTextByRecord(rec2, fname);
				} else {
					v1 = dsObj.getFieldValueByRecord(rec1, fname);
					v2 = dsObj.getFieldValueByRecord(rec2, fname);
				}
				if (v1 == v2) {
					continue;
				}
				if (v1 !== null && v2 !== null) {
					if(strFields.indexOf(fname) >= 0) {
						v1 = v1.toLowerCase();
						v2 = v2.toLowerCase();
						flag = (v1.localeCompare(v2) < 0? -1: 1);
					} else {
						flag = (v1 < v2 ? -1: 1);
					}
				} else if (v1 === null && v2 !== null) {
					flag = -1;
				} else {
					if (v1 !== null && v2 === null) {
						flag = 1;
					}
				}
				return flag * idxFldCfg.order;
			} //end for
			return 0;
		},
		
		/**
		 * Set fixed index fields, field names separated by comma(',')
		 * 
		 * @param {String} indFlds: fixed index field name.
		 * @return {String or this}
		 */
		fixedIndexFields: function (fixedIndexFields) {
			var Z = this;
			if (fixedIndexFields === undefined) {
				return Z._fixedIndexFields;
			}
			
			jslet.Checker.test('Dataset.fixedIndexFields', fixedIndexFields).isString();
			
			Z._fixedIndexFields = fixedIndexFields;
			Z._innerFixedIndexFields = fixedIndexFields? Z._parseIndexFields(fixedIndexFields): [];
			var idxFld, fixedIdxFld;
			for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
				idxFld = Z._innerIndexFields[i];
				for(var j = 0, len = Z._innerFixedIndexFields.length; j < len; j++) {
					fixedIdxFld = Z._innerFixedIndexFields[j];
					if(idxFld.fieldName === fixedIdxFld.fieldName) {
						Z._innerIndexFields.splice(i, 1);
					}
				}
			}
			
			Z._sortByFields();
			return this;
		},
		
		/**
		 * Set index fields, field names separated by comma(',')
		 * 
		 * @param {String} indFlds: index field name.
		 * @return {String or this}
		 */
		indexFields: function (indFlds) {
			var Z = this;
			if (indFlds === undefined) {
				return Z._indexFields;
			}
			
			jslet.Checker.test('Dataset.indexFields', indFlds).isString();
			indFlds = jQuery.trim(indFlds);
			if(!indFlds && !Z._indexFields && !Z._fixedIndexFields) {
				return this;
			}
	
			Z._indexFields = indFlds;
			Z._innerIndexFields = indFlds? Z._parseIndexFields(indFlds): [];
			var idxFld, fixedIdxFld;
			for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
				idxFld = Z._innerIndexFields[i];
				for(var j = 0, len = Z._innerFixedIndexFields.length; j < len; j++) {
					fixedIdxFld = Z._innerFixedIndexFields[j];
					if(idxFld.fieldName === fixedIdxFld.fieldName) {
						fixedIdxFld.order = idxFld.order;
						Z._innerIndexFields.splice(i, 1);
					}
				}
			}
			Z._sortByFields();
			return this;
		},
	
		mergedIndexFields: function() {
			var Z = this,
				result = [];
			for(var i = 0, len = Z._innerFixedIndexFields.length; i < len; i++) {
				result.push(Z._innerFixedIndexFields[i]);
			}
			for(var i = 0, len = Z._innerIndexFields.length; i < len; i++) {
				result.push(Z._innerIndexFields[i]);
			}
			return result;
		},
		
		toggleIndexField: function(fldName, emptyIndexFields) {
			var Z = this,
				idxFld, 
				found = false;
			//Check fixed index fields
			for(var i = Z._innerFixedIndexFields.length - 1; i>=0; i--) {
				idxFld = Z._innerFixedIndexFields[i];
				if(idxFld.fieldName === fldName) {
					idxFld.order = (idxFld.order === 1 ? -1: 1);
					found = true;
					break;
				}
			}
			if(found) {
				if(emptyIndexFields) {
					Z._innerIndexFields = [];
				}
				Z._sortByFields();
				return;
			}
			//Check index fields
			found = false;
			for(var i = Z._innerIndexFields.length - 1; i>=0; i--) {
				idxFld = Z._innerIndexFields[i];
				if(idxFld.fieldName === fldName) {
					idxFld.order = (idxFld.order === 1 ? -1: 1);
					found = true;
					break;
				}
			}
			if(found) {
				if(emptyIndexFields) {
					Z._innerIndexFields = [];
					Z._innerIndexFields.push(idxFld);
				}
			} else {
				if(emptyIndexFields) {
					Z._innerIndexFields = [];
				}
				idxFld = {fieldName: fldName, order: 1};
				Z._innerIndexFields.push(idxFld);
			}
			Z._sortByFields();
		},
		
		_parseIndexFields: function(indexFields) {
			var arrFields = indexFields.split(','), 
				fname, fldObj, arrFName, indexNameObj, 
				order = 1;//asce
			var result = [];
			for (i = 0, cnt = arrFields.length; i < cnt; i++) {
				fname = jQuery.trim(arrFields[i]);
				arrFName = fname.split(' ');
				if (arrFName.length == 1) {
					order = 1;
				} else if (arrFName[1].toLowerCase() == 'asce') {
					order = 1; //asce
				} else {
					order = -1; //desc
				}
				result.push({fieldName: arrFName[0], order: order});
			} //end for
			return result;
		},
		
		_sortByFields: function() {
			var Z = this;
			if (!Z.hasRecord()) {
				return;
			}
			Z.selection.removeAll();
	
			Z._sortingFields = [];
			var idxFld;
			for (var i = 0, cnt = Z._innerFixedIndexFields.length; i < cnt; i++) {
				idxFld = Z._innerFixedIndexFields[i];
				Z._createIndexCfg(idxFld.fieldName, idxFld.order);
			} //end for
			for (var i = 0, cnt = Z._innerIndexFields.length; i < cnt; i++) {
				idxFld = Z._innerIndexFields[i];
				Z._createIndexCfg(idxFld.fieldName, idxFld.order);
			} //end for
	
			var currRec = Z.getRecord(), 
			flag = Z.isContextRuleEnabled();
			if (flag) {
				Z.disableContextRule();
			}
			Z.disableControls();
			jslet.temp.sortDataset = Z;
			try {
				Z.dataList().sort(Z.sortFunc);
				Z._refreshInnerRecno();
			} finally {
				jslet.temp.sortDataset = null;
				Z.moveToRecord(currRec);
				if (flag) {
					Z.enableContextRule();
				}
				Z.enableControls();
			}		
		},
		
		/**
		 * @private
		 */
		_createIndexCfg: function(fname, order) {
			var Z = this,
				fldObj = fname;
			if(jslet.isString(fname)) {
				fldObj = Z.getField(fname);
			}
			if (!fldObj) {
				return;
			}
			if(fldObj.dataset() !== Z) {
				Z._combineIndexCfg(fname, order);
				return;
			}
			var children = fldObj.children();
			if (!children || children.length === 0) {
				var useTextToSort = true;
				if(fldObj.getType() === 'N' && !fldObj.lookup()) {
					useTextToSort = false;
				}
				Z._combineIndexCfg(fldObj.name(), order, useTextToSort);
			} else {
				for(var k = 0, childCnt = children.length; k < childCnt; k++) {
					Z._createIndexCfg(children[k], order);
				}
			}		
		},
		
		/**
		 * @private
		 */
		_combineIndexCfg: function(fldName, order, useTextToSort) {
			for(var i = 0, len = this._sortingFields.length; i < len; i++) {
				if (this._sortingFields[i].fieldName == fldName) {
					this._sortingFields.splice(i,1);//remove duplicated field
				}
			}
			var indexNameObj = {
					fieldName: fldName,
					order: order,
					useTextToSort: useTextToSort
				};
			this._sortingFields.push(indexNameObj);
		},
		
		_getWholeFilter: function() {
			var Z = this, 
				result = Z._fixedFilter;
			if(result) {
				if(Z._filter) {
					return '(' + result + ') && (' + Z._filter + ')';
				}
			} else {
				result = Z._filter;
			}
			return result;
		},
		
		/**
		 * Set or get dataset fixed filter expression
		 * Fixed filter is the global filter expression for dataset.
		 * <pre><code>
		 *   dsFoo.fixedFilter('[age] > 20');
		 * </code></pre>
		 * 
		 * @param {String} fixedFilter: fixed filter expression.
		 * @return {String or this}
		 */
		fixedFilter: function (fixedFilter) {
			var Z = this;
			if (fixedFilter === undefined) {
				return Z._fixedFilter;
			}
			
			jslet.Checker.test('dataset.fixedFilter', fixedFilter).isString();
			if(fixedFilter) {
				fixedFilter = jQuery.trim(fixedFilter);
			}
			var oldFilter = Z._getWholeFilter();
			Z._fixedFilter = fixedFilter;
			var newFilter = Z._getWholeFilter();
			
			if (!newFilter) {
				Z._innerFilter = null;
				Z._filtered = false;
				Z._filteredRecnoArray = null;
			} else {
				if(oldFilter == newFilter) {
					return this;
				} else {
					Z._innerFilter = new jslet.Expression(Z, newFilter);
				}
			}
			Z._doFilterChanged();
			return this;
		},
		
		/**
		 * Set or get dataset filter expression
		 * Filter can work depending on property: filtered, filtered must be true.
		 * <pre><code>
		 *   dsFoo.filter('[name] like "Bob%"');
		 *   dsFoo.filter('[age] > 20');
		 * </code></pre>
		 * 
		 * @param {String} filterExpr: filter expression.
		 * @return {String or this}
		 */
		filter: function (filterExpr) {
			var Z = this;
			if (filterExpr === undefined) {
				return Z._filter;
			}
			
			jslet.Checker.test('dataset.filter#filterExpr', filterExpr).isString();
			if(filterExpr) {
				filterExpr = jQuery.trim(filterExpr);
			}
	
			var oldFilter = Z._getWholeFilter();
			Z._filter = filterExpr;
			var newFilter = Z._getWholeFilter();
			
			if (!newFilter) {
				Z._innerFilter = null;
				Z._filtered = false;
				Z._filteredRecnoArray = null;
			} else {
				if(oldFilter == newFilter) {
					return this;
				} else {
					Z._innerFilter = new jslet.Expression(Z, newFilter);
				}
			}
			Z._doFilterChanged();
			return this;
		},
	
		/**
		 * Set or get filtered flag
		 * Only filtered is true, the filter can work
		 * 
		 * @param {Boolean} afiltered: filter flag.
		 * @return {Boolean or this}
		 */
		filtered: function (afiltered) {
			var Z = this;
			if (afiltered === undefined) {
				return Z._filtered;
			}
			
			var oldFilter = Z._getWholeFilter(), 
				oldFiltered = Z._filtered;
			if (afiltered && !oldFilter) {
				Z._filtered = false;
			} else {
				Z._filtered = afiltered ? true: false;
			}
	
			if(oldFiltered == Z._filtered) {
				return this;
			}
			this._doFilterChanged();
			return this;
		},
		
		_doFilterChanged: function() {
			var Z = this;
			Z.selection.removeAll();
			Z.disableControls();
			try {
				if (!Z._filtered) {
					Z._filteredRecnoArray = null;
				} else {
					Z._refreshInnerRecno();
				}
				Z.first();
				Z.calcAggradedValue();		
			}
			finally {
				Z.enableControls();
			}
			Z.refreshLookupHostDataset();
	
			return this;
		},
		
		/**
		 * @private, filter data
		 */
		_filterData: function () {
			var Z = this,
			 	filter = Z._getWholeFilter();
			if (!Z._filtered || !filter || 
					Z._status == jslet.data.DataSetStatus.INSERT || 
					Z._status == jslet.data.DataSetStatus.UPDATE) {
				return true;
			}
			var result = Z._innerFilter.eval();
			return result;
		},
	
		/**
		 * @private
		 */
		_refreshInnerRecno: function () {
			var Z = this;
			if (!Z.hasData()) {
				Z._filteredRecnoArray = null;
				return;
			}
			Z._filteredRecnoArray = null;
			var tempRecno = [];
			var oldRecno = Z._recno;
			try {
				for (var i = 0, cnt = Z.dataList().length; i < cnt; i++) {
					Z._recno = i;
					if (Z._filterData()) {
						tempRecno.push(i);
					}
				}
			}
			finally {
				Z._recno = oldRecno;
			}
			Z._filteredRecnoArray = tempRecno;
		},
	
		_innerAfterScrollDebounce: function() {
			var Z = this,
				eventFunc = jslet.getFunction(Z._datasetListener);
			if(eventFunc) {
				eventFunc.call(Z, jslet.data.DatasetEvent.AFTERSCROLL);
			}
		},
		
		/**
		 * @private
		 */
		_fireDatasetEvent: function (evtType) {
			var Z = this;
			if (Z._silence || Z._igoreEvent || !Z._datasetListener) {
				return;
			}
			if(evtType == jslet.data.DatasetEvent.AFTERSCROLL) {
				Z._afterScrollDebounce.call(Z);
			} else {
				var eventFunc = jslet.getFunction(Z._datasetListener);
				if(eventFunc) {
					eventFunc.call(Z, evtType);
				}
			}
		},
	
		/**
		 * Get record count
		 * 
		 * @return {Integer}
		 */
		recordCount: function () {
			var records = this.dataList();
			if (records) {
				if (!this._filteredRecnoArray) {
					return records.length;
				} else {
					return this._filteredRecnoArray.length;
				}
			}
			return 0;
		},
	
		hasRecord: function () {
			return this.recordCount() > 0;
		},
		
		hasData: function() {
			var records = this.dataList();
			return records && records.length > 0;
		},
		
		/**
		 * Set or get record number
		 * 
		 * @param {Integer}record number
		 * @return {Integer or this}
		 */
		recno: function (recno) {
			var Z = this;
			if (recno === undefined) {
				return Z._recno;
			}
			jslet.Checker.test('dataset.recno#recno', recno).isGTEZero();
			recno = parseInt(recno);
			if(!Z.hasRecord()) {
				Z._bof = Z._eof = true;
				return true;
			}
			
			if (recno == Z._recno) {
				return true;
			}
			Z.confirm();
			Z._gotoRecno(recno);
			Z._bof = Z._eof = false;
			return true;
		},
		
		/**
		 * Set record number silently, it will not fire any event.
		 * 
		 * @param {Integer}recno - record number
		 */
		recnoSilence: function (recno) {
			var Z = this;
			if (recno === undefined) {
				return Z._recno;
			}
			Z._recno = recno;
			return this;
		},
	
		/**
		 * @private
		 * Goto specified record number(Private)
		 * 
		 * @param {Integer}recno - record number
		 */
		_gotoRecno: function (recno) {
			var Z = this,
				recCnt = Z.recordCount();
			if(recCnt == 0) {
				return false;
			}
			if (recno >= recCnt) {
				recno = recCnt - 1;
			} else if (recno < 0) {
				recno = 0;
			}
			
			if (Z._recno == recno) {
				return false;
			}
			var evt;
			if (!Z._silence) {
				Z._aborted = false;
				try {
					Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESCROLL);
					if (Z._aborted) {
						return false;
					}
				} finally {
					Z._aborted = false;
				}
				if (!Z._lockCount) {
					evt = jslet.data.RefreshEvent.beforeScrollEvent(Z._recno);
					Z.refreshControl(evt);
				}
			}
	
			var preno = Z._recno;
			Z._recno = recno;
			
			if (Z._recno != preno && Z._subDatasetFields && Z._subDatasetFields.length > 0) {
				var fldObj, subds;
				for (var i = 0, len = Z._subDatasetFields.length; i < len; i++) {
					fldObj = Z._subDatasetFields[i];
					subds = fldObj.subDataset();
					if (subds) {
						subds._initialize(true);
					}
				} //end for
			} //end if
			if (!Z._silence) {
				if (Z._contextRuleEnabled) {
					this.calcContextRule();
				}
				Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
				if (!Z._lockCount) {
					evt = jslet.data.RefreshEvent.scrollEvent(Z._recno, preno);
					Z.refreshControl(evt);
				}
			}
			return true;
		},
	
		/**
		 * Abort insert/update/delete action before insert/update/delete.
		 * 
		 */
		abort: function () {
			this._aborted = true;
		},
	
		/**
		 * Get aborted status.
		 * 
		 * @return {Boolean}
		 */
		aborted: function() {
			return this._aborted;
		},
		
		/**
		 * @private
		 * Move cursor back to startRecno(Private)
		 * 
		 * @param {Integer}startRecno - record number
		 */
		_moveCursor: function (recno) {
			var Z = this;
			Z.confirm();
			Z._gotoRecno(recno);
		},
	
		/**
		 * Move record cursor by record object
		 * 
		 * @param {Object}recordObj - record object
		 * @return {Boolean} true - Move successfully, false otherwise. 
		 */
		moveToRecord: function (recordObj) {
			var Z = this;
			Z.confirm();
			if (!Z.hasRecord() || !recordObj) {
				return false;
			}
			jslet.Checker.test('dataset.moveToRecord#recordObj', recordObj).isObject();
			var k = Z.dataList().indexOf(recordObj);
			if (k < 0) {
				return false;
			}
			if (Z._filteredRecnoArray) {
				k = Z._filteredRecnoArray.indexOf(k);
				if (k < 0) {
					return false;
				}
			}
			Z._gotoRecno(k);
			return true;
		},
	
		/**
		 * @private
		 */
		startSilenceMove: function (notLogPos) {
			var Z = this;
			var context = {};
			if (!notLogPos) {
				context.recno = Z._recno;
			} else {
				context.recno = -999;
			}
	
			Z._silence++;
			return context;
		},
	
		/**
		 * @private
		 */
		endSilenceMove: function (context) {
			var Z = this;
			if (context.recno != -999 && context.recno != Z._recno) {
				Z._gotoRecno(context.recno);
			}
			Z._silence--;
		},
	
		/**
		 * Check dataset cursor at the last record
		 * 
		 * @return {Boolean}
		 */
		isBof: function () {
			return this._bof;
		},
	
		/**
		 * Check dataset cursor at the first record
		 * 
		 * @return {Boolean}
		 */
		isEof: function () {
			return this._eof;
		},
	
		/**
		 * Move cursor to first record
		 */
		first: function () {
			var Z = this;
			if(!Z.hasRecord()) {
				Z._bof = Z._eof = true;
				return;
			}
			Z._moveCursor(0);
			Z._bof = Z._eof = false;
		},
	
		/**
		 * Move cursor to last record
		 */
		next: function () {
			var Z = this;
			var recCnt = Z.recordCount();
			if(recCnt === 0) {
				Z._bof = Z._eof = true;
				return;
			}
			if(Z._recno == recCnt - 1) {
				Z._bof = false;
				Z._eof = true;
				return;
			}
			Z._bof = Z._eof = false;
			Z._moveCursor(Z._recno + 1);
		},
	
		/**
		 * Move cursor to prior record
		 */
		prior: function () {
			var Z = this;
			if(!Z.hasRecord()) {
				Z._bof = Z._eof = true;
				return;
			}
			if(Z._recno === 0) {
				Z._bof = true;
				Z._eof = false;
				return;
			}
			Z._bof = Z._eof = false;
			Z._moveCursor(Z._recno - 1);
		},
	
		/**
		 * Move cursor to next record
		 */
		last: function () {
			var Z = this;
			if(!Z.hasRecord()) {
				Z._bof = Z._eof = true;
				return;
			}
			Z._bof = Z._eof = false;
			Z._moveCursor(Z.recordCount() - 1);
			Z._bof = Z._eof = false;
		},
	
		/**
		 * @private
		 * Check dataset status and cancel dataset 
		 */
		checkStatusByCancel: function () {
			if (this._status != jslet.data.DataSetStatus.BROWSE) {
				this.cancel();
			}
		},
	
		/**
		 * Insert child record by parentId, and move cursor to the newly record.
		 * 
		 * @param {Object} parentId - key value of parent record
		 */
		insertChild: function (parentId) {
			var Z = this;
			if (!Z._parentField || !Z.keyField()) {
				throw new Error('parentField and keyField not set,use insertRecord() instead!');
			}
	
			if (!Z.hasRecord()) {
				Z.innerInsert();
				return;
			}
	
			var context = Z.startSilenceMove(true);
			try {
				Z.expanded(true);
				if (parentId) {
					if (!Z.findByKey(parentId)) {
						return;
					}
				} else {
					parentId = Z.keyValue();
				}
	
				var pfldname = Z.parentField(), 
					parentParentId = Z.getFieldValue(pfldname);
				while (true) {
					Z.next();
					if (Z.isEof()) {
						break;
					}
					if (parentParentId == Z.getFieldValue(pfldname)) {
						Z.prior();
						break;
					}
				}
			} finally {
				Z.endSilenceMove(context);
			}
	
			Z.innerInsert(function (newRec) {
				newRec[Z._parentField] = parentId;
			});
		},
	
		/**
		 * Insert sibling record of current record, and move cursor to the newly record.
		 */
		insertSibling: function () {
			var Z = this;
			if (!Z._parentField || !Z._keyField) {
				throw new Error('parentField and keyField not set,use insertRecord() instead!');
			}
	
			if (!Z.hasRecord()) {
				Z.innerInsert();
				return;
			}
	
			var parentId = Z.getFieldValue(Z.parentField()),
				context = Z.startSilenceMove(true),
				found = false,
				parentKeys = [],
				currPKey, lastPKey = prePKey = Z.keyValue();
			try {
				Z.next();
				while (!Z.isEof()) {
					currPKey = Z.parentValue();
					if(currPKey == prePKey) {
						parentKeys.push(prePKey);
						lastPKey = prePKey;
					} else {
						if(lastPKey != currPKey) {
							if(parentKeys.indexOf(currPKey) < 0) {
								Z.prior();
								found = true;
								break;
							}
						}
					}
					prePKey = currPKey;
					Z.next();
				}
				if (!found) {
					Z.last();
				}
			} finally {
				Z.endSilenceMove(context);
			}
	
			Z.innerInsert(function (newRec) {
				newRec[Z._parentField] = parentId;
			});
		},
	
		/**
		 * Insert record after current record, and move cursor to the newly record.
		 */
		insertRecord: function () {
			var Z = this;
			Z.confirm();
	
			Z.innerInsert();
		},
	
		/**
		 * Add record after last record, and move cursor to the newly record.
		 */
		appendRecord: function () {
			var Z = this;
			Z.confirm();
	
			Z._silence++;
			try {
				Z.last();
			} finally {
				Z._silence--;
			}
			Z.insertRecord();
		},
	
		/**
		 * @private
		 */
		status: function(status) {
			if(status === undefined) {
				return this._status;
			}
			this._status = status;
			return this;
		},
		
		expanded: function(expanded) {
			this.expandedByRecno(this.recno(), expanded);
		},
		
		expandedByRecno: function(recno, expanded) {
			jslet.Checker.test('dataset.expandedByRecno', recno).required().isNumber();
			var record = this.getRecord(recno);
			var recInfo = jslet.data.getRecInfo(record);
			if(expanded === undefined) {
				var result = recInfo && recInfo.expanded;
				return result? true: false;
			}
			if(recInfo == null) {
				return this;
			}
			recInfo.expanded = expanded;
			return this;
		},
		
		/**
		 * @private
		 */
		changedStatus: function(status) {
			var record = this.getRecord();
			if(!record) {
				return null;
			}
			var recInfo = jslet.data.getRecInfo(record);		
			if(status === undefined) {
				if(!recInfo) {
					return jslet.data.DataSetStatus.BROWSE;
				}
				return recInfo.status;
			}
			var	oldStatus = recInfo.status;
			if(status === jslet.data.DataSetStatus.DELETE) {
				recInfo.status = status;
				return;
			}
			if(oldStatus === jslet.data.DataSetStatus.INSERT) {
				return;
			}
			if(oldStatus != status) {
				if(this._contextRuleEngine) {
					this._contextRuleEngine.evalStatus();
				}
				recInfo.status = status;
			}
		},
		
		/**
		 * @Private
		 */
		innerInsert: function (beforeInsertFn) {
			var Z = this;
			Z.confirm();
	
			Z.selection.removeAll();
			var mfld = Z._datasetField, mds = null;
			if (mfld) {
				mds = mfld.dataset();
				if (!mds.hasRecord()) {
					throw new Error(jslet.locale.Dataset.insertMasterFirst);
				}
				mds.editRecord();
			}
	
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREINSERT);
				if (Z._aborted) {
					return;
				}
			} finally {
				Z._aborted = false;
			}
	
			var records = Z.dataList();
			if (records === null) {
				records = [];
				Z.dataList(records);
			}
			var preRecno = Z.recno(), k;
			if (Z.hasRecord()) {
				k = records.indexOf(this.getRecord()) + 1;
			} else {
				k = 0;
			}
	
			var newRecord = {};
			records.splice(k, 0, newRecord);
	
			if (Z._filteredRecnoArray && Z._filteredRecnoArray.length > 0) {
				for (var i = Z._filteredRecnoArray.length - 1; i >= 0; i--) {
					if (Z._filteredRecnoArray[i] < k) {
						Z._filteredRecnoArray.splice(i + 1, 0, k);
						Z._recno = k;
						break;
					}
					Z._filteredRecnoArray[i] += 1;
				}
			} else {
				Z._recno = k;
			}
			
			Z.status(jslet.data.DataSetStatus.INSERT);
			Z.changedStatus(jslet.data.DataSetStatus.INSERT);
			Z._calcDefaultValue();
			if (beforeInsertFn) {
				beforeInsertFn(newRecord);
			}
	
			//calc other fields' range to use context rule
			if (Z._contextRuleEnabled) {
				Z.calcContextRule();
			}
	
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERINSERT);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			var evt = jslet.data.RefreshEvent.insertEvent(preRecno, Z.recno(), Z._recno < Z.recordCount() - 1);
			Z.refreshControl(evt);
		},
	
		/**
		 * Insert all records of source dataset into current dataset;
		 * Source dataset's structure must be same as current dataset 
		 * 
		 * @param {Integer}srcDataset - source dataset
		 */
		insertDataset: function (srcDataset) {
			var Z = this;
			var oldFiltered = Z.filtered();
			var thisContext = Z.startSilenceMove(true);
			var srcContext = srcDataset.startSilenceMove(true), rec;
			try {
				Z.filtered(false);
				srcDataset.first();
				while (!srcDataset.isEof()) {
					Z.insertRecord();
					Z.cloneRecord(srcDataset.getRecord(), Z.getRecord());
					Z.confirm();
					srcDataset.next();
				}
			} finally {
				srcDataset.endSilenceMove(srcContext);
				Z.filtered(oldFiltered);
				Z.endSilenceMove(thisContext);
			}
		},
	
		/**
		 * Append all records of source dataset into current dataset;
		 * Source dataset's structure must be same as current dataset 
		 * 
		 * @param {Integer}srcDataset - source dataset
		 */
		appendDataset: function (srcDataset) {
			var Z = this;
			Z._silence++;
			try {
				Z.last();
			} finally {
				Z._silence--;
			}
			Z.insertDataset(srcDataset);
		},
	
		/**
		 * Append records into dataset.
		 * 
		 * @param {Array} records An array of object which need to append to dataset
		 * @param {Boolean} replaceExists true - replace the record if it exists, false - skip to append if it exists. 
		 */
		batchAppendRecords: function(records, replaceExists) {
			jslet.Checker.test('dataset.records', records).required().isArray();
			var Z = this;
			Z.confirm();
			
			Z.selection.removeAll();
			Z.disableControls();
			try{
				var keyField = Z.keyField(), rec, found,
					keyValue;
				for(var i = 0, len = records.length; i < len; i++) {
					rec = records[i];
					found = false;
					if(keyField) {
						keyValue = rec[keyField];
						if(keyValue && Z.findByKey(keyValue)) {
							found = true;
						}
					}
					if(found) {
						if(replaceExists) {
							Z.editRecord();
							Z.cloneRecord(rec, Z.getRecord());
							Z.confirm();
						} else {
							continue;
						}
					} else {
						Z.appendRecord();
						Z.cloneRecord(rec, Z.getRecord());
						Z.confirm();
					}
				}
			} finally {
				Z.enableControls();
				Z.refreshControl(jslet.data.RefreshEvent._updateAllEvent);
				Z.refreshLookupHostDataset();
			}
		},
		
		/**
		 * @rivate
		 * Calculate default value.
		 */
		_calcDefaultValue: function () {
			var Z = this, fldObj, expr, value, fldName;
			for (var i = 0, fldcnt = Z._normalFields.length; i < fldcnt; i++) {
				fldObj = Z._normalFields[i];
				fldName = fldObj.name();
				if (fldObj.getType() == jslet.data.DataType.DATASET) {
					continue;
				}
				
				if(fldObj.valueFollow() && Z._followedValue) {
					var fValue = Z._followedValue[fldName];
					if(fValue !== undefined) {
						fldObj.setValue(fValue);
						continue;
					}
				}
				value = fldObj.defaultValue();
				if (value === undefined || value === null || value === '') {
					expr = fldObj.defaultExpr();
					if (!expr) {
						continue;
					}
					value = window.eval(expr);
				} else {
					if(fldObj.getType() === jslet.data.DataType.NUMBER) {
						value = fldObj.scale() > 0 ? parseFloat(value): parseInt(value);
					}
				}
				var valueStyle = fldObj.valueStyle();
				if(value && jslet.isDate(value)) {
					value = new Date(value.getTime());
				}
				if(valueStyle == jslet.data.FieldValueStyle.BETWEEN) {
					if(value) {
						value = [value, value];
					} else {
						value = [null, null];
					}
				} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE) {
					value = [value];
				}
				Z.setFieldValue(fldName, value);		
			}
		},
	
		/**
		 * @rivate
		 * Calculate default value.
		 */
		checkAggraded: function(fldName) {
			var Z = this,
				fldObj;
			if(fldName) {
				fldObj = Z.getField(fldName);
				return fldObj.aggraded();
			}
			var fields = Z.getNormalFields();
			for(var i = 0, len = fields.length; i< len; i++) {
				fldObj = fields[i];
				if(fldObj.aggraded()) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * 
		 * Calculate aggraded value.
		 */
		calcAggradedValue: function(fldName) {
			var Z = this;
			if(!Z.checkAggraded(fldName)) {
				return;
			}
			var fields = Z.getNormalFields(), 
				fldObj, aggradedBy,
				aggradedFields = [],
				arrAggradeBy = [],
				aggradedValues = null;
			for(var i = 0, len = fields.length; i< len; i++) {
				fldObj = fields[i];
				if(fldObj.aggraded()) {
					aggradedBy = fldObj.aggradedBy();
					if(fldObj.getType() !== jslet.data.DataType.NUMBER && !aggradedBy) {
						if(!aggradedValues) {
							aggradedValues = {};
						}
						aggradedValues[fldObj.name()] = {count: Z.recordCount(), sum: 0};
					} else {
						aggradedFields.push(fldObj);
					}
					if(aggradedBy && arrAggradeBy.indexOf(aggradedBy) === -1) {
						arrAggradeBy.push({aggradedBy: aggradedBy, values: [], exists: false});
					}
				}
			}
			if(aggradedFields.length === 0) {
				Z.aggradedValues(aggradedValues);			
				return;
			}
			if(!aggradedValues) {
				aggradedValues = {};
			}
			
			function getAggradeByValue(aggradedBy) {
				if(aggradedBy.indexOf(',') < 0) {
					return Z.getFieldValue(aggradedBy);
				}
				var fieldNames = aggradedBy.split(',');
				var values = [];
				for(var i = 0, len = fieldNames.length; i < len; i++) {
					values.push(Z.getFieldValue(fieldNames[i]));
				}
				return values.join(',')
			}
			
			function updateAggrByValues(arrAggradeBy) {
				var aggrByObj, 
					aggrByValue,
					arrAggrByValues;			
				for(var i = 0, len = arrAggradeBy.length; i < len; i++) {
					aggrByObj = arrAggradeBy[i];
					arrAggrByValues = aggrByObj.values;
					aggrByValue = getAggradeByValue(aggrByObj.aggradedBy);
					if(arrAggrByValues.indexOf(aggrByValue) < 0) {
						arrAggrByValues.push(aggrByValue);
						aggrByObj.exists = false;
					} else {
						aggrByObj.exists = true;
					}
				}
			}
			
			function existAggrBy(arrAggradeBy, aggradedBy) {
				var aggrByObj;			
				for(var i = 0, len = arrAggradeBy.length; i < len; i++) {
					aggrByObj = arrAggradeBy[i];
					if(aggrByObj.aggradedBy == aggradedBy) {
						return aggrByObj.exists;
					}
				}
				console.warn('Not found aggradedBy value!');
				return false;
			}
			
			var oldRecno = Z.recnoSilence(),
				fldCnt = aggradedFields.length, 
				fldName, value, totalValue,
				aggradedValueObj;
			try{
				for(var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
					Z.recnoSilence(k);
					updateAggrByValues(arrAggradeBy);
					
					for(var i = 0; i < fldCnt; i++) {
						fldObj = aggradedFields[i];
						fldName = fldObj.name();
						aggradedBy = fldObj.aggradedBy();
						if(aggradedBy && existAggrBy(arrAggradeBy, aggradedBy)) {
							continue;
						}
						aggradedValueObj = aggradedValues[fldName];
						if(!aggradedValueObj) {
							aggradedValueObj = {count: 0, sum: 0};
							aggradedValues[fldName] = aggradedValueObj; 
						}
						aggradedValueObj.count = aggradedValueObj.count + 1;
						if(fldObj.getType() === jslet.data.DataType.NUMBER) {
							value = Z.getFieldValue(fldName) || 0;
							if(jslet.isString(value)) {
								throw new Error('Field: ' + fldName + ' requires Number value!');
							}
							aggradedValueObj.sum = aggradedValueObj.sum + value;
						}
					} //end for i
				} //end for k
			}finally{
				Z.recnoSilence(oldRecno);
			}
			var scale;
			for(var i = 0; i < fldCnt; i++) {
				fldObj = aggradedFields[i];
				fldName = fldObj.name();
				scale = fldObj.scale() || 0;
				aggradedValueObj = aggradedValues[fldName];
				if(!aggradedValueObj ) {
					aggradedValueObj = {count: 0, sum: 0};
					aggradedValues[fldName] = aggradedValueObj;
				}
				var sumValue = aggradedValueObj.sum;
				if(sumValue) {
					var pow = Math.pow(10, scale);
					sumValue = Math.round(sumValue * pow) / pow;
					aggradedValueObj.sum = sumValue;
				}
			} //end for i
			Z.aggradedValues(aggradedValues);			
		},
		
		aggradedValues: function(aggradedValues) {
			var Z = this;
			if(aggradedValues === undefined) {
				return Z._aggradedValues;
			}
			var Z = this;
			Z._aggradedValues = aggradedValues;
			if(!Z._aggradedValues && !aggradedValues) {
				return;
			}
	
			evt = jslet.data.RefreshEvent.aggradedEvent();
			Z.refreshControl(evt);
		},
		
		/**
		 * Get record object by record number.
		 * 
		 * @param {Integer} recno Record Number.
		 * @return {Object} Dataset record.
		 */
		getRecord: function (recno) {
			var Z = this, k;
			if(!Z.hasData()) {
				return null;
			}
			var records = Z.dataList();
			//Used to convert field value for performance purpose. 
			if(Z._ignoreFilter) {
				return records[Z._ignoreFilterRecno || 0];
			}
			
			if (Z.recordCount() === 0) {
				return null;
			}
			if (recno === undefined || recno === null) {
				recno = Z._recno >= 0 ? Z._recno : 0;
			} else {
				if (recno < 0 || recno >= Z.recordCount()) {
					return null;
				}
			}
			
			if (Z._filteredRecnoArray) {
				k = Z._filteredRecnoArray[recno];
			} else {
				k = recno;
			}
	
			return records[k];
		},
	
		/**
		 * @private
		 */
		getRelativeRecord: function (delta) {
			return this.getRecord(this._recno + delta);
		},
	
		/**
		 * @private
		 */
		isSameAsPrevious: function (fldName) {
			var Z = this,
				preRec = Z.getRelativeRecord(-1);
			if (!preRec) {
				return false;
			}
			var currRec = Z.getRecord(),
				preValue = preRec[fldName],
				currValue = currRec[fldName],
				isSame = false;
			if(!preValue && preValue !== 0 && !currValue && currValue !== 0) {
				isSame = true;
			} else if(preValue && currValue) {
				if(jslet.isDate(preValue)) { //Date time comparing
					isSame = (preValue.getTime() == currValue.getTime());
				} else {
					isSame = (preValue == currValue);
				}
			}
			if(!isSame) {
				return isSame;
			}
			var	fldObj = Z.getField(fldName),
				mergeSameBy = fldObj.mergeSameBy();
			if(mergeSameBy) {
				var arrFlds = mergeSameBy.split(','), groupFldName;
				for(var i = 0, len = arrFlds.length; i < len; i++) {
					groupFldName = jQuery.trim(arrFlds[i]);
					if(preRec[groupFldName] != currRec[groupFldName]) {
						return false;
					}
				}
			}
			return isSame;
		},
	
		/**
		 * Check the current record has child records or not
		 * 
		 * @return {Boolean}
		 */
		hasChildren: function () {
			var Z = this;
			if (!Z._parentField) {
				return false;
			}
			var context = Z.startSilenceMove();
			var keyValue = Z.keyValue();
			try {
				Z.next();
				if (!Z.isEof()) {
					var pValue = Z.parentValue();
					if (pValue == keyValue) {
						return true;
					}
				}
				return false;
			} finally {
				Z.endSilenceMove(context);
			}
		},
		
		/** 
		* Iterate the child records of current record, and run the specified callback function. 
		* Example: 
		* 
		* dataset.iterateChildren(function(){
		* 	var fldValue = this.getFieldValue('xxx');
		* 	this.setFieldValue('xxx', fldValue);
		* }); 
		* 
		*/ 
		iterateChildren: function() {
			
		},
		
		/**
		 * Update record and send dataset to update status.
		 * You can use cancel() or confirm() method to return browse status.
		 */
		editRecord: function () {
			var Z = this;
			if (Z._status == jslet.data.DataSetStatus.UPDATE ||
				Z._status == jslet.data.DataSetStatus.INSERT) {
				return;
			}
	
			Z.selection.removeAll();
			if (!Z.hasRecord()) {
				Z.insertRecord();
			} else {
				Z._aborted = false;
				try {
					Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREUPDATE);
					if (Z._aborted) {
						return;
					}
				} finally {
					Z._aborted = false;
				}
	
				Z._modiObject = {};
				jQuery.extend(Z._modiObject, Z.getRecord());
				var mfld = Z._datasetField;
				if (mfld && mfld.dataset()) {
					mfld.dataset().editRecord();
				}
	
				Z.status(jslet.data.DataSetStatus.UPDATE);
	//			Z.changedStatus(jslet.data.DataSetStatus.UPDATE);
				Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERUPDATE);
			}
		},
	
		/**
		 * Delete record
		 */
		deleteRecord: function () {
			var Z = this;
			var recCnt = Z.recordCount();
			if (recCnt === 0 || Z.changedStatus() === jslet.data.DataSetStatus.DELETE) {
				return;
			}
			Z.selection.removeAll();
			if (Z._status == jslet.data.DataSetStatus.INSERT) {
				Z.cancel();
				return;
			}
	
			Z._silence++;
			try {
				Z.checkStatusByCancel();
			} finally {
				Z._silence--;
			}
	
			if (Z.hasChildren()) {
				jslet.showInfo(jslet.locale.Dataset.cannotDelParent);
				return;
			}
	
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREDELETE);
				if (Z._aborted) {
					return;
				}
			} finally {
				Z._aborted = false;
			}
			var preRecno = Z.recno(), 
				isLast = preRecno == (recCnt - 1), 
				k = Z._recno;
			if(Z.changedStatus() === jslet.data.DataSetStatus.INSERT) {
				Z._changeLog.unlog();
			} else {
				Z.changedStatus(jslet.data.DataSetStatus.DELETE);
				Z._changeLog.log();
			}
			Z.dataList().splice(k, 1);
			Z._refreshInnerRecno();
			
			var mfld = Z._datasetField;
			if (mfld && mfld.dataset()) {
				mfld.dataset().editRecord();
			}
	
			Z.status(jslet.data.DataSetStatus.BROWSE);
			
			if (isLast) {
				Z._silence++;
				try {
					Z.prior();
				} finally {
					Z._silence--;
				}
			}
			Z.calcAggradedValue();
			var evt = jslet.data.RefreshEvent.deleteEvent(preRecno);
			Z.refreshControl(evt);
			
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);	
			Z.refreshLookupHostDataset();
			var detailFields = Z._subDatasetFields;
			if(detailFields) {
				var subFldObj, subDs;
				for(var i = 0, len = detailFields.length; i < len; i++) {
					subFldObj = detailFields[i];
					subDs = subFldObj.subDataset();
					if(subDs) {
						subDs.refreshControl();
					}
				}
			}
			if (Z.isBof() && Z.isEof()) {
				return;
			}
			evt = jslet.data.RefreshEvent.scrollEvent(Z._recno);
			Z.refreshControl(evt);
			
		},
	
		/**
		 * Delete all selected records;
		 */
		deleteSelected: function() {
			var Z = this, 
				records = Z.selectedRecords(),
				recObj;
			Z.disableControls();
			try {
				for(var i = records.length - 1; i >= 0; i--) {
					recObj = records[i];
					Z.moveToRecord(recObj);
					Z.deleteRecord();
				}
			} finally {
				Z.enableControls();
			}
		},
		
		/**
		 * @private
		 */
		_innerValidateData: function () {
			var Z = this;
			if (Z._status == jslet.data.DataSetStatus.BROWSE || Z.recordCount() === 0) {
				return;
			}
			var fldObj, fldName, fldValue, invalidMsg, firstInvalidField = null;
	
			for (var i = 0, cnt = Z._normalFields.length; i < cnt; i++) {
				fldObj = Z._normalFields[i];
				if (fldObj.disabled() || fldObj.readOnly() || !fldObj.visible()) {
					continue;
				}
				fldName = fldObj.name();
				fldValue = Z.getFieldValue(fldName);
				if(fldObj.valueStyle() == jslet.data.FieldValueStyle.NORMAL && Z.existFieldError(fldName)) {
					invalidMsg = Z._fieldValidator.checkRequired(fldObj, fldValue);
					invalidMsg = invalidMsg || Z._fieldValidator.checkValue(fldObj, fldValue);
					if (invalidMsg) {
						Z.setFieldError(fldName, invalidMsg);
						if(!firstInvalidField) {
							firstInvalidField = fldName;
						}
					}
				} else {
					invalidMsg = Z._fieldValidator.checkRequired(fldObj, fldValue);
					if (invalidMsg) {
						Z.setFieldError(fldName, invalidMsg)
						if(!firstInvalidField) {
							firstInvalidField = fldName;
						}
					}
					if(fldObj.valueStyle() == jslet.data.FieldValueStyle.BETWEEN) {
						var v1 = null, v2 = null;
						if(fldValue && fldValue.length === 2) {
							v1 = fldValue[0];
							v2 = fldValue[1];
						}
						if(v1 && v2) {
							invalidMsg = null;
							if(jslet.isDate(v1) && v1.getTime() > v2.getTime() || v1 > v2) {
								invalidMsg = jslet.locale.Dataset.betwwenInvalid;
							}
							if (invalidMsg) {
								Z.setFieldError(fldName, invalidMsg, 0);
								if(!firstInvalidField) {
									firstInvalidField = fldName;
								}
							}
						}
					}
					if(fldValue) {
						var recObj = Z.getRecord();
						for(var k = 0, len = fldValue.length; k < len; k++) {
							if(Z.existFieldError(fldName, k)) {
								invalidMsg = invalidMsg || Z._fieldValidator.checkValue(fldObj, fldValue);
								if (invalidMsg) {
									Z.setFieldError(fldName, invalidMsg, k)
									if(!firstInvalidField) {
										firstInvalidField = fldName;
									}
								}
							}
						} //end for k
					}
				}
				
			} //end for i
			if(firstInvalidField) {
				Z.focusEditControl(firstInvalidField);
			}
		},
	
		/**
		 * @private
		 */
		errorMessage: function(errMessage) {
			var evt = jslet.data.RefreshEvent.errorEvent(errMessage || '');
			this.refreshControl(evt);
		},
		
		addFieldError: function(fldName, errorMsg, valueIndex, inputText) {
			jslet.data.FieldError.put(this.getRecord(), fldName, errorMsg, valueIndex, inputText);
		},
		
		addDetailFieldError: function(fldName, errorCount) {
			jslet.data.putDetailError.put(this.getRecord(), fldName, errorCount);
		},
		
		existRecordError: function(recno) {
			return jslet.data.FieldError.existRecordError(this.getRecord(recno));
		},
		
		checkAndShowError: function() {
			var Z = this;
			if(Z.existDatasetError()) {
				if (Z._autoShowError) {
					jslet.showError(jslet.locale.Dataset.cannotConfirm, null, 2000);
				} else {
					console.warn(jslet.locale.Dataset.cannotConfirm);
				}
				return true;
			}
			return false;
		},
		
		existDatasetError: function() {
			var Z = this, isError = false,
				dataList = Z.dataList();
			if(!dataList) {
				return false;
			}
			for(var i = 0, len = dataList.length; i < len; i++) {
				isError = jslet.data.FieldError.existRecordError(dataList[i]);
				if(isError) {
					return true;
				}
			}
			return false;
		},
		
		/**
		 * Confirm insert or update
		 */
		confirm: function () {
			var Z = this;
			if (Z._status == jslet.data.DataSetStatus.BROWSE) {
				return true;
			}
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECONFIRM);
			Z._innerValidateData();
			Z._confirmSubDataset();
	
			if(Z.status() == jslet.data.DataSetStatus.UPDATE) {
				Z.changedStatus(jslet.data.DataSetStatus.UPDATE);
			}
			
			var evt, hasError = Z.existRecordError();
			var rec = Z.getRecord();
			Z._modiObject = null;
			Z.status(jslet.data.DataSetStatus.BROWSE);
			if(!hasError) {
				Z._changeLog.log();
			}
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCONFIRM);
			Z.calcAggradedValue();
			evt = jslet.data.RefreshEvent.updateRecordEvent();
			Z.refreshControl(evt);
			if(hasError) {
				Z.errorMessage(jslet.locale.Dataset.cannotConfirm);			
			} else {
				jslet.data.FieldError.clearRecordError(Z.getRecord());
				Z.errorMessage();
			}
			var masterFld = Z._datasetField;
			if (masterFld) {
				var masterDs = masterFld.dataset();
				var masterFldName = masterFld.name();
				if(hasError) {
					masterDs.addFieldError(masterFldName, 'Detail Dataset Error');
				} else {
					masterDs.addFieldError(masterFldName, null);
				}
				masterDs.refreshControl(evt);
			}
	
			return !hasError;
		},
	
		/*
		 * @private
		 */
		_confirmSubDataset: function() {
			var Z = this,
				fldObj, 
				subDatasets = [],
				subFields = [];
			for (var i = 0, len = Z._normalFields.length; i < len; i++) {
				fldObj = Z._normalFields[i];
				if(fldObj.getType() === jslet.data.DataType.DATASET) {
					subDatasets.push(fldObj.subDataset());
					subFields.push(fldObj.name());
				}
			}
			var subDs, oldShowError;
			for(var i = 0, len = subDatasets.length; i < len; i++) {
				subDs = subDatasets[i];
				subDs.confirm();
				if(subDs.existDatasetError()) {
					Z.addFieldError(subFields[i], 'Detail Dataset Error');
				} else {
					Z.addFieldError(subFields[i], null);
				}
			}
		},
		
		/**
		 * Cancel insert or update
		 */
		cancel: function () {
			var Z = this;
			if (Z._status == jslet.data.DataSetStatus.BROWSE) {
				return;
			}
			if (Z.recordCount() === 0) {
				return;
			}
			Z._aborted = false;
			try {
				Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECANCEL);
				if (Z._aborted) {
					return;
				}
			} finally {
				Z._aborted = false;
			}
	//		var rec = Z.getRecord();
	//		jslet.data.FieldError.clearRecordError(rec);
			 Z._cancelSubDataset();
			 var evt, 
				k = Z._recno,
				records = Z.dataList();
			if (Z._status == jslet.data.DataSetStatus.INSERT) {
				Z.selection.removeAll();
				var no = Z.recno();
				records.splice(k, 1);
				Z._refreshInnerRecno();
				if(no >= Z.recordCount()) {
					Z._recno = Z.recordCount() - 1;
				}
				Z.calcAggradedValue();		
				evt = jslet.data.RefreshEvent.deleteEvent(no);
				Z.refreshControl(evt);
				Z.status(jslet.data.DataSetStatus.BROWSE);
				Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
				evt = jslet.data.RefreshEvent.scrollEvent(Z._recno); 
				Z.refreshControl(evt); 
				return;
			} else {
				if (Z._filteredRecnoArray) {
					k = Z._filteredRecnoArray[Z._recno];
				}
	//			jslet.data.FieldValueCache.removeCache(Z._modiObject);
				records[k] = Z._modiObject;
				Z._modiObject = null;	
			}
	
			Z.calcAggradedValue();		
			Z.status(jslet.data.DataSetStatus.BROWSE);
	//		Z.changedStatus(jslet.data.DataSetStatus.BROWSE);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCANCEL);
	//		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
	
			evt = jslet.data.RefreshEvent.updateRecordEvent();
			Z.refreshControl(evt);
		},
	
		restore: function() {
			
		},
		
	    /*
	     * @private
	     */
	    _cancelSubDataset: function() {
	        var Z = this,
	            fldObj, 
	            subDatasets = [];
	        for (var i = 0, len = Z._normalFields.length; i < len; i++) {
	            fldObj = Z._normalFields[i];
	            if(fldObj.getType() === jslet.data.DataType.DATASET) {
	                subDatasets.push(fldObj.subDataset());
	            }
	        }
	        var subDs;
	        for(var i = 0, len = subDatasets.length; i < len; i++) {
	            subDs = subDatasets[i];
	            subDs.cancel();
	        }
	    },
	     
		/**
		 * Set or get logChanges
		 * if NOT need send changes to Server, can set logChanges to false  
		 * 
		 * @param {Boolean} logChanges
		 */
		logChanges: function (logChanges) {
			if (logChanges === undefined) {
				return this._logChanges;
			}
	
			this._logChanges = logChanges;
		},
	
		/**
		 * Disable refreshing controls, you often use it in a batch operation;
		 * After batch operating, use enableControls()
		 */
		disableControls: function () {
			this._lockCount++;
			var fldObj, subDs;
			for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
				fldObj = this._normalFields[i];
				subDs = fldObj.subDataset();
				if (subDs !== null) {				
					subDs.disableControls();
				}
			}
		},
	
		/**
		 * Enable refreshing controls.
		 * 
		 * @param {Boolean} refreshCtrl true - Refresh control immediately, false - Otherwise.
		 */
		enableControls: function (needRefreshCtrl) {
			if (this._lockCount > 0) {
				this._lockCount--;
			}
			if (!needRefreshCtrl) {
				this.refreshControl();
			}
	
			var fldObj, subDs;
			for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
				fldObj = this._normalFields[i];
				subDs = fldObj.subDataset();
				if (subDs !== null) {				
					subDs.enableControls();
				}
			}
		},
	
		/**
		 * Check the specified field which value is valid.
		 * 
		 * @param fldName {String} - field name;
		 * @param valueIndex {Integer} - value index.
		 * @return {Boolean} true - exists invalid data.
		 */
		existFieldError: function(fldName, valueIndex) {
			if (this.recordCount() === 0) {
				return false;
			}
	
			var currRec = this.getRecord();
			if (!currRec) {
				return false;
			}
			return jslet.data.FieldError.existFieldError(currRec, fldName, valueIndex);
		},
		
		getFieldError: function(fldName, valueIndex) {
			return this.getFieldErrorByRecno(null, fldName, valueIndex);
		},
		
		getFieldErrorByRecno: function(recno, fldName, valueIndex) {
			if (this.recordCount() === 0) {
				return null;
			}
	
			var currRec = this.getRecord(recno);
			if (!currRec) {
				return null;
			}
			return jslet.data.FieldError.get(currRec, fldName, valueIndex);
		},
		
		setFieldError: function(fldName, errorMsg, valueIndex, inputText) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return Z;
			}
	
			var currRec = Z.getRecord();
			if (!currRec) {
				return Z;
			}
			jslet.data.FieldError.put(currRec, fldName, errorMsg, valueIndex, inputText);
			return this;
		},
			
		/**
		 * Get field value of specified record number
		 * 
		 * @param {Object} recno - specified record number
		 * @param {String} fldName - field name
		 * @return {Object} field value
		 */
		getFieldValueByRecno: function(recno, fldName, valueIndex) {
			var dataRec = this.getRecord(recno);
			if(!dataRec) {
				return null;
			}
			return this.getFieldValueByRecord(dataRec, fldName, valueIndex);
		},
		
		/**
		 * Get field value of specified record
		 * 
		 * @param {Object} dataRec - specified record
		 * @param {String} fldName - field name
		 * @return {Object} field value
		 */
		getFieldValueByRecord: function (dataRec, fldName, valueIndex) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return null;
			}
	
			if (!dataRec) {
				dataRec = Z.getRecord();
			}
	
			var k = fldName.indexOf('.'), 
				subfldName, fldValue = null,
				fldObj = Z.getField(fldName),
				value, lkds;
			if (k > 0) { //field chain
				subfldName = fldName.substr(0, k);
				fldObj = Z.getField(subfldName);
				var lkf = fldObj.lookup(),
					subDs = fldObj.subDataset();
				
				if (!lkf && !subDs) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [subfldName]));
				}
				if(lkf) {
					value = dataRec[subfldName];
					lkds = lkf.dataset();
					if(value === undefined || value === null || value === '') {
						fldValue = null;
					} else {
						if (lkds.findByField(lkds.keyField(), value)) {
							fldValue = lkds.getFieldValue(fldName.substr(k + 1));
						} else {
							throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,
										[lkds.name(),lkds.keyField(), value]));
						}
					}
				} else {
					fldValue = subDs.getFieldValue(fldName.substr(k + 1));
				}
				
			} else { //single field
				if (!fldObj) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
				}
				var formula = fldObj.formula();
				if (!formula) {
					value = dataRec[fldName];
					fldValue = value !== undefined ? value :null;
				} else {
					if(dataRec[fldName] === undefined) {
						fldValue = Z._calcFormula(dataRec, fldName);
						dataRec[fldName] = fldValue;
					} else {
						value = dataRec[fldName];
						fldValue = value !== undefined ? value :null;
					}
				}
			}
	
			if(!fldObj.valueStyle() || valueIndex === undefined) { //jslet.data.FieldValueStyle.NORMAL
				if(fldObj.getType() === jslet.data.DataType.BOOLEAN) {
					return fldValue === fldObj.trueValue();
				}
				return fldValue;
			}
			return jslet.getArrayValue(fldValue, valueIndex);
		},
	
		/**
		 * Get field value of current record
		 * 
		 * @param {String} fldName - field name
		 * @param {Integer or undefined} valueIndex get the specified value if a field has multiple values.
		 *		if valueIndex is not specified, all values(Array of value) will return.
		 * @return {Object}
		 */
		getFieldValue: function (fldName, valueIndex) {
			if (this.recordCount() === 0) {
				return null;
			}
	
			var currRec = this.getRecord();
			if (!currRec) {
				return null;
			}
			return this.getFieldValueByRecord(currRec, fldName, valueIndex);
		},
	
		/**
		 * Set field value of current record.
		 * 
		 * @param {String} fldName - field name
		 * @param {Object} value - field value
		 * @param {Integer or undefined} valueIndex set the specified value if a field has multiple values.
		 *		if valueIndex is not specified, Array of value will be set.
		 * @return {this}
		 */
		setFieldValue: function (fldName, value, valueIndex) {
			var Z = this,
				fldObj = Z.getField(fldName);
			if(Z._status == jslet.data.DataSetStatus.BROWSE) {
				Z.editRecord();
			}
			var currRec = Z.getRecord();
			if(!fldObj.valueStyle() || valueIndex === undefined) { //jslet.data.FieldValueStyle.NORMAL
				if(value && fldObj.getType() === jslet.data.DataType.NUMBER && !jslet.isArray(value)) {
					value = fldObj.scale() > 0 ? parseFloat(value): parseInt(value);
				}
				var realValue = value;
				if(fldObj.getType() === jslet.data.DataType.BOOLEAN) {
					if(value) {
						realValue = fldObj.trueValue();
					} else {
						realValue = fldObj.falseValue();
					}
				}
	
				currRec[fldName] = realValue;
				if (fldObj.getType() == jslet.data.DataType.DATASET) {//dataset field
					return this;
				}
			} else {
				var arrValue = currRec[fldName];
				if(!arrValue || !jslet.isArray(arrValue)) {
					arrValue = [];
					currRec[fldName] = arrValue;
				}
				var len = arrValue.length;
				if(valueIndex < len) {
					arrValue[valueIndex] = value;
				} else {
					for(var i = len; i < valueIndex; i++) {
						arrValue.push(null);
					}
					arrValue.push(value);
				}
			}
			Z.setFieldError(fldName, null, valueIndex);
			if (Z._onFieldChanged) {
				var eventFunc = jslet.getFunction(Z._onFieldChanged);
				if(eventFunc) {
					eventFunc.call(Z, fldName, value, valueIndex);
				}
			}
			var globalHandler = jslet.data.globalDataHandler.fieldValueChanged();
			if(globalHandler) {
				globalHandler.call(Z, Z, fldName, value, valueIndex);
			}
	
			if(fldObj.valueFollow()) {
				if(!Z._followedValue) {
					Z._followedValue = {};
				}
				Z._followedValue[fldName] = value;
			}
			//calc other fields' range to use context rule
			if (Z._contextRuleEnabled) {
				Z.calcContextRule(fldName);
			}	
			jslet.data.FieldValueCache.clear(Z.getRecord(), fldName);
			var evt = jslet.data.RefreshEvent.updateRecordEvent(fldName);
			Z.refreshControl(evt);
			Z.updateFormula(fldName);
			Z.calcAggradedValue(fldName);
			return this;
		},
	
		_calcFormulaRelation: function() {
			var Z = this;
			if(!Z._innerFormularFields) {
				return;
			}
			var fields = Z._innerFormularFields.keys(),
				fldName, formulaFields, formulaFldName, fldObj;
			var relation = new jslet.SimpleMap();
			for(var i = 0, len = fields.length; i < len; i++) {
				fldName = fields[i];
				var evaluator = Z._innerFormularFields.get(fldName);
				formulaFields = evaluator.mainFields();
				relation.set(fldName, formulaFields);
			} //end for i
			Z._innerFormulaRelation = relation.count() > 0? relation: null;
		},
		
		/**
		 * @rivate
		 */
		addInnerFormulaField: function(fldName, formula) {
			var Z = this;
			if(!formula) {
				return;
			}
			if (!Z._innerFormularFields) {
				Z._innerFormularFields = new jslet.SimpleMap();
			}
			evaluator = new jslet.Expression(Z, formula);
			Z._innerFormularFields.set(fldName, evaluator);
			Z._calcFormulaRelation();
		},
		
		/**
		 * @rivate
		 */
		removeInnerFormulaField: function (fldName) {
			if (this._innerFormularFields) {
				this._innerFormularFields.unset(fldName);
				this._calcFormulaRelation();
			}
		},
	
		_calcFormula: function(currRec, fldName) {
			var Z = this,
				evaluator = Z._innerFormularFields.get(fldName),
				result = null;
			if(evaluator) {
				evaluator.context.dataRec = currRec;
				result = evaluator.eval();
			}
			return result;
		},
		
		/**
		 * @private
		 */
		updateFormula: function (changedFldName) {
			var Z = this;
			if(!Z._innerFormulaRelation) {
				return;
			}
			var fmlFields = Z._innerFormulaRelation.keys(),
				fmlFldName, fields, fldObj,
				currRec = this.getRecord();
			for(var i = 0, len = fmlFields.length; i < len; i++) {
				fmlFldName = fmlFields[i];
				fields = Z._innerFormulaRelation.get(fmlFldName);
				fldObj = Z.getField(fmlFldName);
				if(!fields || fields.length === 0) {
					fldObj.setValue(Z._calcFormula(currRec, fmlFldName));
					continue;
				}
				var found = false;
				for(var j = 0, cnt = fields.length; j < cnt; j++) {
					if(fields[j] == changedFldName) {
						found = true;
						break;
					}
				}
				if(found) {
					fldObj.setValue(Z._calcFormula(currRec, fmlFldName));
				}
			}
		},
		
		/**
		 * Get field display text. 
		 * 
		 * @param {String} fldName Field name
		 * @param {Boolean} isEditing In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
		 * @param {Integer} valueIndex identify which item will get if the field has multiple values.
		 * @return {String} 
		 */
		getFieldText: function (fldName, isEditing, valueIndex) {
			if (this.recordCount() === 0) {
				return null;
			}
	
			var currRec = this.getRecord();
			if (!currRec) {
				return null;
			}
			return this.getFieldTextByRecord(currRec, fldName, isEditing, valueIndex);
		},
		
		/**
		 * Get field display text by record number.
		 * 
		 * @param {Object} recno - record number.
		 * @param {String} fldName - Field name
		 * @param {Boolean} isEditing - In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
		 * @param {Integer} valueIndex - identify which item will get if the field has multiple values.
		 * @return {String} 
		 */
		getFieldTextByRecno: function (recno, fldName, isEditing, valueIndex) {
			var dataRec = this.getRecord(recno);
			if(!dataRec) {
				return null;
			}
			return this.getFieldTextByRecord(dataRec, fldName, isEditing, valueIndex);
		},
		
		/**
		 * Get field display text by data record.
		 * 
		 * @param {Object} dataRec - data record.
		 * @param {String} fldName - Field name
		 * @param {Boolean} isEditing - In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
		 * @param {Integer} valueIndex - identify which item will get if the field has multiple values.
		 * @return {String} 
		 */
		getFieldTextByRecord: function (dataRec, fldName, isEditing, valueIndex) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return '';
			}
			var currRec = dataRec, 
				k = fldName.indexOf('.'), 
				fldObj, value;
			if (k > 0) { //Field chain
				var subFldName = fldName.substr(0, k);
				fldName = fldName.substr(k + 1);
				fldObj = Z.getField(subFldName);
				if (!fldObj) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
				}
				var lkf = fldObj.lookup(),
					subDs = fldObj.subDataset();
				if (!lkf && !subDs) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [fldName]));
				}
				if(lkf) {
					value = currRec[subFldName];
					if (value === null || value === undefined) {
						return '';
					}
					var lkds = lkf.dataset();
					if (lkds.findByField(lkds.keyField(), value)) {
						if (fldName.indexOf('.') > 0) {
							return lkds.getFieldValue(fldName);
						} else {
							return lkds.getFieldText(fldName, isEditing, valueIndex);
						}
					} else {
						throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,
								[lkds.name(), lkds.keyField(), value]));
					}
				}
				else {
					//Can't use it in sort function.
					return subDs.getFieldText(fldName, isEditing, valueIndex);
				}
			}
			//Not field chain
			fldObj = Z.getField(fldName);
			if (!fldObj) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [fldName]));
			}
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				return '[dataset]';
			}
			var valueStyle = fldObj.valueStyle(),
				result = [];
			if(valueStyle == jslet.data.FieldValueStyle.BETWEEN && valueIndex === undefined)
			{
				var minVal = Z.getFieldTextByRecord(currRec, fldName, isEditing, 0),
					maxVal = Z.getFieldTextByRecord(currRec, fldName, isEditing, 1);
				if(!isEditing && !minVal && !maxVal){
					return '';
				}
				result.push(minVal);
				if(isEditing) {
					result.push(jslet.global.valueSeparator);
				} else {
					result.push(jslet.locale.Dataset.betweenLabel);
				}
				result.push(maxVal);
				return result.join('');
			}
			
			if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && valueIndex === undefined)
			{
				var arrValues = Z.getFieldValue(fldName), 
					len = 0;
				if(arrValues && jslet.isArray(arrValues)) {
					len = arrValues.length - 1;
				}
				
				for(var i = 0; i <= len; i++) {
					result.push(Z.getFieldTextByRecord(currRec, fldName, isEditing, i));
					if(i < len) {
						result.push(jslet.global.valueSeparator);
					}
				}
				return result.join('');
			}
			//Get cached display value if exists.
			if(!isEditing) {
				var cacheValue = jslet.data.FieldValueCache.get(currRec, fldName, valueIndex);
				if(cacheValue !== undefined) {
					return cacheValue;
				}
			}
			value = Z.getFieldValueByRecord(currRec, fldName, valueIndex);
			if (value === null || value === undefined) {
				var fixedValue = fldObj.fixedValue();
				if(fixedValue) {
					return fixedValue;
				}
				return '';
			}
	
			var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
			if(!convert) {
				throw new Error('Can\'t find any field value converter!');
			}
			var text = convert.valueToText.call(Z, fldObj, value, isEditing);
			//Put display value into cache
			if(!isEditing) {
				jslet.data.FieldValueCache.put(currRec, fldName, text, valueIndex);
			}
			return text;
		},
		
		/**
		 * @private
		 */
		setFieldValueLength: function(fldObj, valueLength) {
			if(!fldObj.valueStyle()) { //jslet.data.FieldValueStyle.NORMAL
				return;
			}
			var value = this.getFieldValue(fldObj.name());
			if(value && jslet.isArray(value)) {
				value.length = valueLength;
			}
		},
		
		/**
		 * Set field value by input value. There are two forms to use:
		 *   1. setFieldText(fldName, inputText, valueIndex)
		 *   2. setFieldText(fldName, inputText, keyValue, displayValue, valueIndex)
		 *   
		 * @param {String} fldName - field name
		 * @param {String} inputText - String value inputed by user
		 * @param {Object} keyValue - key value
		 * @param {String} displayValue - display value
		 * @param {Integer} valueIndex identify which item will set if the field has multiple values.
		 */
		setFieldText: function (fldName, inputText, valueIndex) {
			var Z = this,
			fldObj = Z.getField(fldName);
			if (fldObj === null) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			var fType = fldObj.getType();
			if (fType == jslet.data.DataType.DATASET) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.datasetFieldNotBeSetValue, [fldName]));
			}
			var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
			if(!convert) {
				throw new Error('Can\'t find any field value converter!');
			}
			
			var value = Z._textToValue(fldObj, inputText, valueIndex);
			if(value !== undefined) {
				Z.setFieldValue(fldName, value, valueIndex);
			}
		},
	
		_textToValue: function(fldObj, inputText, valueIndex) {
			var Z = this,
				fType = fldObj.getType();
			
			if((fldObj.valueStyle() === jslet.data.FieldValueStyle.BETWEEN ||
				fldObj.valueStyle() === jslet.data.FieldValueStyle.MULTIPLE)				
					&& valueIndex === undefined) {
				//Set an array value
				if(!jslet.isArray(inputText)) {
					inputText = inputText.split(jslet.global.valueSeparator);
				}
				var len = inputText.length, 
					values = [], value,
					invalid = false;
				for(var k = 0; k < len; k++ ) {
					value = Z._textToValue(fldObj, inputText[k], k);
					if(value === undefined) {
						invalid = true;
					} else {
						if(!invalid) {
							values.push(value);
						}
					}
				}
				if(!invalid) {
					return values;
				}
				return undefined;
			}
			var invalidMsg = Z._fieldValidator.checkInputText(fldObj, inputText);
			if (invalidMsg) {
				Z.setFieldError(fldObj.name(), invalidMsg, valueIndex, inputText);
				return undefined;
			} else {
				Z.setFieldError(fldObj.name(), null, valueIndex);
			}
			
			var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
			var value = convert.textToValue.call(Z, fldObj, inputText, valueIndex);
			return value;
		},
		
		/**
		 * Get key value of current record
		 * 
		 * @return {Object} Key value
		 */
		keyValue: function () {
			if (!this._keyField || this.recordCount() === 0) {
				return null;
			}
			return this.getFieldValue(this._keyField);
		},
	
		/**
		 * Get parent record key value of current record
		 * 
		 * @return {Object} Parent record key value.
		 */
		parentValue: function () {
			if (!this._parentField || this.recordCount() === 0) {
				return null;
			}
			return this.getFieldValue(this._parentField);
		},
	
		/**
		 * Find record with specified condition
		 * if found, then move cursor to that record
		 * <pre><code>
		 *   dsFoo.find('[name] like "Bob%"');
		 *   dsFoo.find('[age] > 20');
		 * </code></pre>
		 * @param {String} condition condition expression.
		 * @param {Boolean} fromCurrentPosition Identify whether finding data from current position or not.
		 * @return {Boolean} 
		 */
		find: function (condition, fromCurrentPosition) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return false;
			}
			Z.confirm();
			if (condition === null) {
				Z._findCondition = null;
				Z._innerFindCondition = null;
				return false;
			}
	
			if (condition != Z._findCondition) {
				Z._innerFindCondition = new jslet.Expression(this, condition);
			}
			if (Z._innerFindCondition.eval()) {
				return true;
			}
			Z._silence++;
			var foundRecno = -1, 
				oldRecno = Z._recno;
			try {
				if(!fromCurrentPosition) {
					Z.first();
				}
				while (!Z.isEof()) {
					if (Z._innerFindCondition.eval()) {
						foundRecno = Z._recno;
						break;
					}
					Z.next();
				}
			} finally {
				Z._silence--;
				Z._recno = oldRecno;
			}
			if (foundRecno >= 0) {// can fire scroll event
				Z._gotoRecno(foundRecno);
				return true;
			}
			return false;
		},
	
		/**
		 * Find record with specified field name and value
		 * 
		 * @param {String} fldName - field name
		 * @param {Object} findingValue - finding value
		 * @param {Boolean} fromCurrentPosition Identify whether finding data from current position or not.
		 * @param {Boolean} findingByText - Identify whether finding data with field text, default is with field value
		 * @param {String} matchType null or undefined - match whole value, 'first' - match first, 'last' - match last, 'any' - match any
		 * @return {Boolean} 
		 */
		findByField: function (fldName, findingValue, fromCurrentPosition, findingByText, matchType) {
			var Z = this,
				fldObj = Z.getField(fldName);
			if(!fldObj) {
				throw new Error('Field name: ' + fldName + ' NOT Found!');
			}
			Z.confirm();
			
			function matchValue(matchType, value, findingValue) {
				if(!matchType) {
					return value == findingValue;
				}
				if(matchType == 'first') {
					return jslet.like(value, findingValue + '%');
				}
				if(matchType == 'any') {
					return jslet.like(value, '%' + findingValue + '%');
				}
				if(matchType == 'last') {
					return jslet.like(value, '%' + findingValue);
				}
			}
			
			var byText = true;
			if(fldObj.getType() === 'N' && !fldObj.lookup()) {
				byText = false;
			}
			var value, i;
			if(Z._ignoreFilter) {
				if(!Z.hasData()) {
					return false;
				}
				var records = Z.dataList(),
					len = records.length,
					dataRec;
				var start = 0;
				if(fromCurrentPosition) {
					var currRec = Z.getRecord();
					if(Z._lastFindingValue && Z._lastFindingValue === findingValue) {
						start = records.indexOf(currRec) + 1;
					}
					Z._lastFindingValue = findingValue;
				}
				for(i = start; i < len; i++) {
					dataRec = records[i];
					if(findingByText && byText) {
						value = Z.getFieldTextByRecord(dataRec, fldName);
					} else {
						value = Z.getFieldValueByRecord(dataRec, fldName);
					}
					if (matchValue(matchType, value, findingValue)) {
						Z._ignoreFilterRecno = i;
						return true;
					}
				}
				return false;
			}
			if (Z.recordCount() === 0) {
				return false;
			}
	
			var foundRecno = -1, oldRecno = Z.recno();
			try {
				var cnt = Z.recordCount(),
					start = 0;
				if(fromCurrentPosition) {
					start = Z.recno();
					if(Z._lastFindingValue && Z._lastFindingValue === findingValue) {
						start =  Z.recno() + 1;
					}
					Z._lastFindingValue = findingValue;
				}
				for (i = start; i < cnt; i++) {
					Z.recnoSilence(i);
					if(findingByText && byText) {
						value = Z.getFieldText(fldName);
					} else {
						value = Z.getFieldValue(fldName);
					}
					if (matchValue(matchType, value, findingValue)) {
						foundRecno = Z._recno;
						break;
					}
				}
			} finally {
				Z.recnoSilence(oldRecno);
			}
			if (foundRecno >= 0) {// can fire scroll event
				Z._gotoRecno(foundRecno);
				return true;
			}
			return false;
		},
	
		/**
		 * Find record with key value.
		 * 
		 * @param {Object} keyValue Key value.
		 * @return {Boolean}
		 */
		findByKey: function (keyValue) {
			var keyField = this.keyField();
			if (!keyField) {
				return false;
			}
			return this.findByField(keyField, keyValue);
		},
	
		/**
		 * Find record and return specified field value
		 * 
		 * @param {String} fldName - field name
		 * @param {Object} findingValue - finding field value
		 * @param {String} returnFieldName - return value field name
		 * @return {Object} 
		 */
		lookup: function (fldName, findingValue, returnFieldName) {
			if (this.findByField(fldName, findingValue)) {
				return this.getFieldValue(returnFieldName);
			} else {
				return null;
			}
		},
	
		lookupByKey: function(keyValue, returnFldName) {
			if (this.findByKey(keyValue)) {
				return this.getFieldValue(returnFldName);
			} else {
				return null;
			}
		},
		
		/**
		 * Copy dataset's data. Example:
		 * <pre><code>
		 * var list = dsFoo.copyDataset(true);
		 * 
		 * </code></pre>
		 * 
		 * @param {Boolean} underCurrentFilter - if true, copy data under dataset's {@link}filter
		 * @return {Object[]} Array of records. 
		 */
		copyDataset: function (underCurrentFilter) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return null;
			}
			var result = [];
	
			if ((!underCurrentFilter || !Z._filtered)) {
				return Z.dataList().slice(0);
			}
	
			var foundRecno = -1, 
				oldRecno = Z._recno, 
				oldFiltered = Z._filtered;
			if (!underCurrentFilter) {
				Z._filtered = false;
			}
	
			Z._silence++;
			try {
				Z.first();
				while (!Z.isEof()) {
					result.push(Z.getRecord());
					Z.next();
				}
			} finally {
				Z._silence--;
				Z._recno = oldRecno;
				if (!underCurrentFilter) {
					Z._filtered = oldFiltered;
				}
			}
			return result;
		},
	
		/**
		 * Set or get 'key' field name
		 * 
		 * @param {String} keyFldName Key field name.
		 * @return {String or this}
		 */
		keyField: function (keyFldName) {
			if (keyFldName === undefined) {
				return this._keyField;
			}
			jslet.Checker.test('Dataset.keyField', keyFldName).isString();
			this._keyField = jQuery.trim(keyFldName);
			return this;
		},
	
		/**
		 * Set or get 'code' field name
		 * 
		 * @param {String} codeFldName Code field name.
		 * @return {String or this}
		 */
		codeField: function (codeFldName) {
			if (codeFldName === undefined) {
				return this._codeField;
			}
			
			jslet.Checker.test('Dataset.codeField', codeFldName).isString();
			this._codeField = jQuery.trim(codeFldName);
			return this;
		},
		
		/**
		 * Set or get 'name' field name
		 * 
		 * @param {String} nameFldName Name field name
		 * @return {String or this}
		 */
		nameField: function (nameFldName) {
			if (nameFldName === undefined) {
				return this._nameField;
			}
			
			jslet.Checker.test('Dataset.nameField', nameFldName).isString();
			this._nameField = jQuery.trim(nameFldName);
			return this;
		},
	
		/**
		 * Set or get 'parent' field name
		 * 
		 * @param {String} parentFldName Parent field name.
		 * @return {String or this}
		 */
		parentField: function (parentFldName) {
			if (parentFldName === undefined) {
				return this._parentField;
			}
			
			jslet.Checker.test('Dataset.parentField', parentFldName).isString();
			this._parentField = jQuery.trim(parentFldName);
			return this;
		},
		
		levelOrderField: function(fldName) {
			if (fldName === undefined) {
				return this._levelOrderField;
			}
			
			jslet.Checker.test('Dataset.levelOrderField', fldName).isString();
			this._levelOrderField = jQuery.trim(fldName);
			return this;
		},
		
		/**
		 * Set or get 'select' field name. "Select field" is a field to store the selected state of a record. 
		 * 
		 * @param {String} parentFldName Parent field name.
		 * @return {String or this}
		 */
		selectField: function (selectFldName) {
			if (selectFldName === undefined) {
				return this._selectField;
			}
			
			jslet.Checker.test('Dataset.selectField', selectFldName).isString();
			this._selectField = jQuery.trim(selectFldName);
			return this;
		},
		
		/**
		 * @private
		 */
		_convertFieldValue: function (srcField, srcValues, destFields) {
			var Z = this;
	
			if (destFields === null) {
				throw new Error('NOT set destFields in method: ConvertFieldValue');
			}
			var isExpr = destFields.indexOf('[') > -1;
			if (isExpr) {
				if (destFields != Z._convertDestFields) {
					Z._innerConvertDestFields = new jslet.Expression(this,
							destFields);
					Z._convertDestFields = destFields;
				}
			}
			if (typeof (srcValues) != 'string') {
				srcValues += '';
			}
			var separator = jslet.global.valueSeparator;
			var values = srcValues.split(separator), valueCnt = values.length - 1;
			Z._ignoreFilter = true;
			try {
				if (valueCnt === 0) {
					if (!Z.findByField(srcField, values[0])) {
						return null;
						//throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,[Z._name, srcField, values[0]]));
					}
					if (isExpr) {
						return Z._innerConvertDestFields.eval();
					} else {
						return Z.getFieldValue(destFields);
					}
				}
		
				var fldcnt, destValue = '';
				for (var i = 0; i <= valueCnt; i++) {
					if (!Z.findByField(srcField, values[i])) {
						return null;
					}
					if (isExpr) {
						destValue += Z._innerConvertDestFields.eval();
					} else {
						destValue += Z.getFieldValue(destFields);
					}
					if (i != valueCnt) {
						destValue += separator;
					}
				}
				return destValue;
			} finally {
				Z._ignoreFilter = false;
			}
		},
	
		/**
		 * Set or get context rule
		 * 
		 * @param {jslet.data.ContextRule[]} contextRule Context rule;
		 * @return {jslet.data.ContextRule[] or this}
		 */
		contextRules: function (rules) {
			if (rules === undefined) {
				return this._contextRules;
			}
			if(jslet.isString(rules)) {
				rules = rules? jslet.JSON.parse(rules): null;
			}
			jslet.Checker.test('Dataset.contextRules', rules).isArray();
			if(!rules || rules.length === 0) {
				this._contextRules = null;
				this._contextRuleEngine = null;
			} else {
				var ruleObj;
				for(var i = 0, len = rules.length; i < len; i++) {
					ruleObj = rules[i];
					if(!ruleObj.className || 
							ruleObj.className != jslet.data.ContextRule.className) {
						
						jslet.Checker.test('Dataset.contextRules#ruleObj', ruleObj).isPlanObject();
						rules[i] = jslet.data.createContextRule(ruleObj);
					}
				}
				this._contextRules = rules;
				this._contextRuleEngine = new jslet.data.ContextRuleEngine(this);
				this._contextRuleEngine.compile();
				this.enableContextRule();
			}
			return this;
		},
		
		/**
		 * Disable context rule
		 */
		disableContextRule: function () {
			this._contextRuleEnabled = false;
	//		this.restoreContextRule();
		},
	
		/**
		 * Enable context rule, any context rule will be calculated.
		 */
		enableContextRule: function () {
			this._contextRuleEnabled = true;
			this.calcContextRule();
		},
	
		/**
		 * Check context rule enable or not.
		 * 
		 * @return {Boolean}
		 */
		isContextRuleEnabled: function () {
			return this._contextRuleEnabled;
		},
	
		/**
		 * @private
		 */
		calcContextRule: function (changedField) {
			var Z = this;
			if(Z.recordCount() === 0) {
				return;
			}
			
			if(Z._contextRuleEngine) {
				Z._inContextRule = true;
				try {
					if(!changedField) {
						Z._contextRuleEngine.evalStatus();
					}
					Z._contextRuleEngine.evalRule(changedField);
				} finally {
					Z._inContextRule = false;
				}
			}
		},
	
		/**
		 * Check current record if it's selectable.
		 */
		checkSelectable: function (recno) {
			if(this.recordCount() === 0) {
				return false;
			}
			if(this._onCheckSelectable) {
				var eventFunc = jslet.getFunction(this._onCheckSelectable);
				if(eventFunc) {
					return eventFunc.call(this, recno);
				}
			}
			return true;
		},
		
		/**
		 * Get or set selected state of current record.
		 */
		selected: function (selected) {
			var Z = this;
			var selFld = Z._selectField || jslet.global.selectStateField,
				rec = Z.getRecord();
			
			if(selected === undefined) {
				return rec && rec[selFld];
			}
			
			if(rec) {
				if(Z.checkSelectable()) {
					Z._aborted = false;
					try {
						Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESELECT);
						if (Z._aborted) {
							return Z;
						}
					} finally {
						Z._aborted = false;
					}
					rec[selFld] = selected;
					Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSELECT);
				}
			}
			return Z;
		},
		
		selectedByRecno: function(recno) {
			var Z = this,
				selFld = Z._selectField || jslet.global.selectStateField,
				rec = Z.getRecord(recno);
			
			return rec && rec[selFld];
		},
		
		/**
		 * Select/unselect all records.
		 * 
		 * @param {Boolean}selected  true - select records, false otherwise.
		 * @param {Function)onSelectAll Select event handler.
		 *	Pattern: function(dataset, Selected}{}
		 *	//dataset: jslet.data.Dataset
		 *	//Selected: Boolean
		 *	//return: true - allow user to select, false - otherwise.
	
		 * @param {Boolean}noRefresh Refresh controls or not.
		 */
		selectAll: function (selected, onSelectAll, noRefresh) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return;
			}
	
			jslet.Checker.test('Dataset.selectAll#onSelectAll', onSelectAll).isFunction();
			var oldRecno = Z.recno();
			try {
				for (var i = 0, cnt = Z.recordCount(); i < cnt; i++) {
					Z.recnoSilence(i);
	
					if (onSelectAll) {
						var flag = onSelectAll(this, selected);
						if (flag !== undefined && !flag) {
							continue;
						}
					}
					Z.selected(selected);
				}
			} finally {
				Z.recnoSilence(oldRecno);
			}
			if (!noRefresh) {
				var evt = jslet.data.RefreshEvent.selectAllEvent(selected);
				Z.refreshControl(evt);
			}
		},
	
		/**
		 * Select/unselect record by key value.
		 * 
		 * @param {Boolean} selected true - select records, false otherwise.
		 * @param {Object) keyValue Key value.
		 * @param {Boolean} noRefresh Refresh controls or not.
		 */
		selectByKeyValue: function (selected, keyValue, noRefresh) {
			var Z = this,
				oldRecno = Z.recno(),
				cnt = Z.recordCount(),
				v, changedRecNum = [];
			try {
				for (var i = 0; i < cnt; i++) {
					Z.recnoSilence(i);
					v = Z.getFieldValue(Z._keyField);
					if (v == keyValue) {
						Z.selected(selected);
						changedRecNum.push(i);
						break;
					}
				} //end for
			} finally {
				Z.recnoSilence(oldRecno);
			}
			if (!noRefresh) {
				var evt = jslet.data.RefreshEvent.selectRecordEvent(changedRecNum, selected);
				Z.refreshControl(evt);
			}
		},
	
		/**
		 * Select current record or not.
		 * If 'selectBy' is not empty, select all records which value of 'selectBy' field is same as the current record.
		 * <pre><code>
		 * dsEmployee.select(true, 'gender');
		 * //if the 'gender' of current value is female, all female employees will be selected.  
		 * </code></pre>
		 * 
		 * @param {Boolean}selected - true: select records, false:unselect records
		 * @param {String)selectBy - field names, multiple fields concatenated with ',' 
		 */
		select: function (selected, selectBy) {
			var Z = this;
			if (Z.recordCount() === 0) {
				return;
			}
	
			var changedRecNum = [];
			if (!selectBy) {
				Z.selected(selected);
				changedRecNum.push(Z.recno());
			} else {
				var arrFlds = selectBy.split(','), 
					arrValues = [], i, 
					fldCnt = arrFlds.length;
				for (i = 0; i < fldCnt; i++) {
					arrValues[i] = Z.getFieldValue(arrFlds[i]);
				}
				var v, preRecno = Z.recno(), flag;
				try {
					for (var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
						Z.recnoSilence(k);
						flag = 1;
						for (i = 0; i < fldCnt; i++) {
							v = Z.getFieldValue(arrFlds[i]);
							if (v != arrValues[i]) {
								flag = 0;
								break;
							}
						}
						if (flag) {
							Z.selected(selected);
							changedRecNum.push(Z.recno());
						}
					}
				} finally {
					Z.recnoSilence(preRecno);
				}
			}
	
			var evt = jslet.data.RefreshEvent.selectRecordEvent(changedRecNum, selected);
			Z.refreshControl(evt);
		},
	
		/**
		 * Set or get data provider
		 * 
		 * @param {jslet.data.Provider} provider - data provider
		 * @return {jslet.data.Provider or this}
		 */
		dataProvider: function (provider) {
			if (provider === undefined) {
				return this._dataProvider;
			}
			this._dataProvider = provider;
			return this;
		},
		
		/**
		 * @private
		 */
		_checkDataProvider: function () {
			if (!this._dataProvider) {
				throw new Error('DataProvider required, use: yourDataset.dataProvider(yourDataProvider);');
			}
		},
	
		/**
		 * Get selected records
		 * 
		 * @return {Object[]} Array of records
		 */
		selectedRecords: function () {
			var Z = this;
			if (!Z.hasRecord()) {
				return null;
			}
	
			var preRecno = Z.recno(), result = [];
			try {
				for (var k = 0, recCnt = Z.recordCount(); k < recCnt; k++) {
					Z.recnoSilence(k);
					if(Z.selected()) {
						result.push(Z.getRecord());
					}
				}
			} finally {
				Z.recnoSilence(preRecno);
			}
			
			return result;
		},
	
		/**
		 * Get key values of selected records.
		 * 
		 * @return {Object[]} Array of selected record key values
		 */
		selectedKeyValues: function () {
			var oldRecno = this.recno(), result = [];
			try {
				for (var i = 0, cnt = this.recordCount(); i < cnt; i++) {
					this.recnoSilence(i);
					var state = this.selected();
					if (state && state !== 2) { // 2: partial select
						result.push(this.getFieldValue(this._keyField));
					}
				}
			} finally {
				this.recnoSilence(oldRecno);
			}
			if (result.length > 0) {
				return result;
			} else {
				return null;
			}
		},
	
		queryUrl: function(url) {
			if(url === undefined) {
				return this._queryUrl;
			}
			jslet.Checker.test('Dataset.queryUrl', url).isString();
			this._queryUrl = jQuery.trim(url);
			return this;
		},
		
		/**
		 * Query data from server. Example:
		 * <pre><code>
		 * dsEmployee.queryUrl('../getemployee.do');
		 * var criteria = {name:'Bob', age:25};
		 * dsEmployee.query(condition);
		 * </code></pre>
		 * @param {Plan Object or jslet.data.Dataset} criteria Condition should be a JSON object or criteria dataset.
		 */
		query: function (criteria) {
			if(criteria && criteria instanceof jslet.data.Dataset) {
				var criteriaDataset = criteria;
				criteriaDataset.confirm();
				if(criteriaDataset.checkAndShowError()) {
					return jslet.emptyPromise;
				}
				criteria = criteriaDataset.getRecord();
			}
			this._queryCriteria = criteria;
			return this.requery();
		},
	
		_doQuerySuccess: function(result, dataset) {
			var Z = dataset;
			if (!result) {
				Z.dataList([]);
				if(result && result.info) {
					jslet.showInfo(result.info);
				}
				return;
			}
			var mainData = result.main;
			if (mainData) {
				Z.dataList(mainData);
			}
			var extraData = result.extraEntities;
			if(extraData) {
				var dsName, ds;
				for (var dsName in extraData) {
					ds = jslet.data.getDataset(dsName);
					if (ds) {
						ds.dataList(extraData[dsName]);
					} else {
						console.warn(dsName + ' is returned from server, but this datase does not exist!');
					}
				}
			}
			if (result.pageNo) {
				Z._pageNo = result.pageNo;
			}
			if (result.pageCount) {
				Z._pageCount = result.pageCount;
			}
	
			var evt = jslet.data.RefreshEvent.changePageEvent();
			Z.refreshControl(evt);
			if(result && result.info) {
				jslet.showInfo(result.info);
			}
		},
		
		_doApplyError: function(result, dataset) {
			var Z = dataset,
				errCode = result.errorCode,
				errMsg = result.errorMessage;
			if(jslet.global.serverErrorHandler) {
				var catched = jslet.global.serverErrorHandler(errCode, errMsg);
				if(catched) {
					return;
				}
			}
			errMsg = errMsg + "[" + errCode + "]";
			Z.errorMessage(errMsg);
			if(Z._autoShowError) {
				jslet.showError(errMsg);
			}
		},
		
		/**
		 * Send request to refresh with current condition.
		 */
		requery: function () {
			var Z = this;
			Z._checkDataProvider();
	
			if(!this._queryUrl) {
				throw new Error('QueryUrl required! Use: yourDataset.queryUrl(yourUrl)');
			}
			if(Z._querying) { //Avoid duplicate submitting
				return;
			}
			Z._querying = true;
			try {
				var reqData = {};
				if(Z._pageNo > 0) {
					reqData.pageNo = Z._pageNo;
					reqData.pageSize = Z._pageSize;
				}
				var criteria = Z._queryCriteria;
				if(criteria) {
					if(jslet.isArray(criteria)) {
						reqData.criteria = criteria;
					} else {
						reqData.simpleCriteria = criteria;
					}
				}
				if(Z.csrfToken) {
					reqData.csrfToken = Z.csrfToken;
				}
				var reqData = jslet.data.record2Json(reqData);
				var url = Z._queryUrl;
				return Z._dataProvider.sendRequest(Z, url, reqData)
				.done(Z._doQuerySuccess)
				.fail(Z._doApplyError)
				.always(function(){Z._querying = false})
			} catch(e) {
				Z._querying = false
			}
		},
	
		_setChangedState: function(flag, chgRecs, pendingRecs) {
			if(!chgRecs || chgRecs.length === 0) {
				return;
			}
			var result = this._addRecordClassFlag(chgRecs, flag, this._recordClass || jslet.global.defaultRecordClass);
			for(var i = 0, len = result.length; i < len; i++) {
				pendingRecs.push(result[i]);
			}
		},
	
		_addRecordClassFlag: function(records, changeFlag, recClazz) {
			var fields = this.getFields(),
				fldObj,
				subRecordClass = null;
			
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(fldObj.getType() === jslet.data.DataType.DATASET) {
					if(!subRecordClass) {
						subRecordClass = {};
					}
					subRecordClass[fldObj.name()] = fldObj.subDataset().recordClass();
				}
			}
			var result = [], rec, pRec, subRecClazz;
			for (var i = 0, cnt = records.length; i < cnt; i++) {
				rec = records[i];
				pRec = {};
				if(recClazz) {
					pRec["@type"] = recClazz;
				}
				rec[jslet.global.changeStateField] = changeFlag + i;
				var fldValue;
				for(var prop in rec) {
					fldValue = rec[prop];
					if(fldValue && subRecordClass) {
						subRecClazz = subRecordClass[prop];
						if(subRecClazz) {
							fldValue = this._addRecordClassFlag(fldValue, changeFlag, subRecClazz);
						}
					}
					pRec[prop] = fldValue;
				}
				result.push(pRec);
			}
			return result;
		},
		
		_doSaveSuccess: function(result, dataset) {
			if (!result) {
				if(result && result.info) {
					jslet.showInfo(result.info);
				}
				return;
			}
			var mainData = result.main;
			var Z = dataset;
			Z._dataTransformer.refreshSubmittedData(mainData);
	
			Z.calcAggradedValue();
			Z.selection.removeAll();
			
			Z.refreshControl();
			Z.refreshLookupHostDataset();
			if(result && result.info) {
				jslet.showInfo(result.info);
			}
		},
		
		submitUrl: function(url) {
			if(url === undefined) {
				return this._submitUrl;
			}
	
			jslet.Checker.test('Dataset.submitUrl', url).isString();
			this._submitUrl = jQuery.trim(url);
			return this;
		},
		
		/**
		 * Identify dataset has changed records.
		 */
		hasChangedData: function() {
			var Z = this;
			Z.confirm();
			var dataList = Z.dataList(), record, recInfo;
			if(!dataList) {
				return false;
			}
			for(var i = 0, len = dataList.length; i < len; i++) {
				record = dataList[i];
				recInfo = jslet.data.getRecInfo(record);
				return recInfo && recInfo.status && recInfo.status !== jslet.data.DataSetStatus.BROWSE;
			}
			return false;
		},
		
		/**
		 * Submit changed data to server. 
		 * If server side save data successfully and return the changed data, Jslet can refresh the local data automatically.
		 * 
		 * Cause key value is probably generated at server side(like sequence), we need an extra field which store an unique value to update the key value,
		 * this extra field is named '_s_', its value will start a letter 'i', 'u' or 'd', and follow a sequence number, like: i1, i2, u1, u2, d1, d3,....
		 * You don't care about it in client side, it is generated by Jslet automatically.
		 * 
		 * At server side, you can use the leading letter to distinguish which action will be sent to DB('i' for insert, 'u' for update and 'd' for delete)
		 * If the records need be changed in server(like sequence key or other calculated fields), you should return them back.Notice:
		 * you need not to change this value of extra field: '_s_', just return it. Example:
		 * <pre><code>
		 * dsFoo.insertRecord();
		 * dsFoo.setFieldValue('name','Bob');
		 * dsFoo.setFieldValue('code','A01');
		 * dsFoo.confirm();
		 * dsFoo.submitUrl('../foo_save.do');
		 * dsFoo.submit();
		 * </code></pre>
		 * 
		 * @param {Object} extraInfo extraInfo to send to server
		 * @param {Array of String} excludeFields Array of field names which need not be sent to server;
		 */
		submit: function(extraInfo, excludeFields) {
			var Z = this;
			Z.confirm();
			if(Z.checkAndShowError()) {
				return jslet.emptyPromise;
			}
			Z._checkDataProvider();
	
			if(!Z._submitUrl) {
				throw new Error('SubmitUrl required! Use: yourDataset.submitUrl(yourUrl)');
			}
			var changedRecs = Z._dataTransformer.getSubmittingChanged();
			if (!changedRecs || changedRecs.length === 0) {
				jslet.showInfo(jslet.locale.Dataset.noDataSubmit);
				return jslet.emptyPromise;
			}
			if(Z._submitting) { //Avoid duplicate submitting
				return;
			}
			Z._submitting = true;
			try {
				var reqData = {main: changedRecs};
				if(extraInfo) {
					reqData.extraInfo = extraInfo;
				}
				if(Z.csrfToken) {
					reqData.csrfToken = Z.csrfToken;
				}
				reqData = jslet.data.record2Json(reqData, excludeFields);
				var url = Z._submitUrl;
				return Z._dataProvider.sendRequest(Z, url, reqData)
				.done(Z._doSaveSuccess)
				.fail(Z._doApplyError)
				.always(function(){
					Z._submitting = false;
				});
			} catch(e) {
				Z._submitting = false
			}
		},
		
		_doSubmitSelectedSuccess: function(result, dataset) {
			if(!result) {
				return;
			}
			var mainData = result.main;
			if (!mainData || mainData.length === 0) {
				if(result.info) {
					jslet.showInfo(result.info);
				}
				return;
			}
			var Z = dataset,
				deleteOnSuccess = Z._deleteOnSuccess_,
				arrRecs = Z.selectedRecords() || [],
				i, k,
				records = Z.dataList();
			Z.selection.removeAll();
			if(deleteOnSuccess) {
				for(i = arrRecs.length; i >= 0; i--) {
					rec = arrRecs[i];
					k = records.indexOf(rec);
					records.splice(k, 1);
				}
				Z._refreshInnerRecno();
			} else {
				var newRec, oldRec, len;
				Z._dataTransformer.refreshSubmittedData(mainData);
			}
			Z.calcAggradedValue();
			Z.refreshControl();
			Z.refreshLookupHostDataset();
			if(result && result.info) {
				jslet.showInfo(result.info);
			}
		},
		
		/**
		 * Send selected data to server whether or not the records have been changed. 
		 * Under some special scenarios, we need send user selected record to server to process. 
		 * Sever side need not send back the processed records. Example:
		 * 
		 * <pre><code>
		 * //Audit the selected records, if successful, delete the selected records.
		 * dsFoo.submitSelected('../foo_audit.do', true);
		 * 
		 * </code></pre>
		 * @param {String} url Url
		 * @param {Boolean} deleteOnSuccess If processing successfully at server side, delete the selected record or not.
		 * @param {Object} extraInfo extraInfo
		 * @param {Array of String} excludeFields Array of field names which need not be sent to server;
		 */
		submitSelected: function (url, deleteOnSuccess, extraInfo, excludeFields) {
			var Z = this;
			Z.confirm();
			if(Z.checkAndShowError()) {
				return jslet.emptyPromise;
			}
			Z._checkDataProvider();
			if(!url) {
				throw new Error('Url required! Use: yourDataset.submitSelected(yourUrl)');
			}
			if(Z._submitting) { //Avoid duplicate submitting
				return;
			}
			Z._submitting = true;
			try {
				var changedRecs = Z._dataTransformer.getSubmittingSelected() || [];
		
				Z._deleteOnSuccess_ = deleteOnSuccess;
				var reqData = {main: changedRecs};
				if(Z.csrfToken) {
					reqData.csrfToken = Z.csrfToken;
				}
				if(extraInfo) {
					reqData.extraInfo = extraInfo;
				}
				reqData = jslet.data.record2Json(reqData, excludeFields);
				return Z._dataProvider.sendRequest(Z, url, reqData)
				.done(Z._doSubmitSelectedSuccess)
				.fail(Z._doApplyError)
				.always(function(){
					Z._submitting = false;
				});
			} catch(e) {
				Z._submitting = false
			}
		},
	
		/**
		 * @private
		 */
		_refreshInnerControl: function (updateEvt) {
			var i, cnt, ctrl;
			if (updateEvt.eventType == jslet.data.RefreshEvent.UPDATEALL || 
					updateEvt.eventType == jslet.data.RefreshEvent.CHANGEMETA) {
				cnt = this._linkedLabels.length;
				for (i = 0; i < cnt; i++) {
					ctrl = this._linkedLabels[i];
					if (ctrl.refreshControl) {
						ctrl.refreshControl(updateEvt);
					}
				}
			}
			cnt = this._linkedControls.length;
			for (i = 0; i < cnt; i++) {
				ctrl = this._linkedControls[i];
				if (ctrl.refreshControl) {
					ctrl.refreshControl(updateEvt);
				}
			}
		},
	
		/**
		 * Focus on the edit control that link specified field name.
		 * 
		 * @param {String} fldName Field name
		 */
		focusEditControl: function (fldName) {
			var Z = this,
				ctrl, el, fldObj;
			for (var i = Z._linkedControls.length - 1; i >= 0; i--) {
				ctrl = Z._linkedControls[i];
				if(!ctrl.field) {
					continue;
				}
				if (ctrl.field() == fldName) {
					fldObj = Z.getField(fldName);
					if(!fldObj || !fldObj.visible() || fldObj.disabled()|| !ctrl.isActiveRecord()) {
						continue;
					}
					el = ctrl.el;
					if (el.focus) {
						try {
							el.focus();
							if(ctrl.selectText) {
								ctrl.selectText();
							}
							return;
						} catch (e) {
							console.warn('Can\' focus into a disabled control!');
						}
					}
				} //end if
			} //end for
		},
	
		/**
		 * Refresh whole field.
		 * 
		 * @param {String} fldName field name.
		 */
		refreshField: function(fldName) {
			this.refreshControl(jslet.data.RefreshEvent.updateColumnEvent(fldName));
		},
		
		/**
		 * Refresh lookup field.
		 * 
		 * @param {String} fldName field name.
		 * @param {Integer} recno (Optional) if recno >=0, only refresh the current record control specified by 'recno', otherwise refresh whole field. 
		 */
		refreshLookupField: function(fldName, recno) {
			var lookupEvt;
			if(recno === undefined) {
				lookupEvt = jslet.data.RefreshEvent.lookupEvent(fldName);
			} else {
				lookupEvt = jslet.data.RefreshEvent.lookupEvent(fldName, recno);
			}
			this.refreshControl(lookupEvt);
		},
		
		/**
		 * @private 
		 */
		refreshControl: function (updateEvt) {
			if (this._lockCount) {
				return;
			}
	
			if (!updateEvt) {
				updateEvt = jslet.data.RefreshEvent.updateAllEvent();
			}
			this._refreshInnerControl(updateEvt);
		},
	
		/**
		 * @private 
		 */
		addLinkedControl: function (linkedControl) {
			if (linkedControl.isLabel) {
				this._linkedLabels.push(linkedControl);
			} else {
				this._linkedControls.push(linkedControl);
			}
		},
	
		/**
		 * @private 
		 */
		removeLinkedControl: function (linkedControl) {
			var arrCtrls = linkedControl.isLabel ? this._linkedLabels : this._linkedControls;
			
			var k = arrCtrls.indexOf(linkedControl);
			if (k >= 0) {
				arrCtrls.splice(k, 1);
			}
		},
	
		refreshLookupHostDataset: function() {
			if(this._autoRefreshHostDataset) {
				jslet.data.datasetRelationManager.refreshLookupHostDataset(this._name);
			}
		},
		
		handleLookupDatasetChanged: function(fldName) {
			var Z = this;
			if(Z._inContextRule) {
				Z.refreshLookupField(fldName, Z.recno());
			} else {
				jslet.data.FieldValueCache.clearAll(Z, fldName);
				Z.refreshLookupField(fldName);
			}
			//Don't use the following code, is will cause DBAutoComplete control issues.
			//this.refreshControl(jslet.data.RefreshEvent.updateColumnEvent(fldName));
		},
		
		/**
		 * Export data with CSV format.
		 * 
		 * Export option pattern:
		 * {exportHeader: true|false, //export with field labels
		 *  exportDisplayValue: true|false, //true: export display value of field, false: export actual value of field
		 *  onlySelected: true|false, //export selected records or not
		 *  includeFields: ['fldName1', 'fldName2',...], //Array of field names which to be exported
		 *  excludeFields: ['fldName1', 'fldName2',...]  //Array of field names which not to be exported
		 *  }
		 *  
		 * @param exportOption {PlanObject} export options
		 * 
		 * @return {String} Csv Text. 
		 */
		exportCsv: function(exportOption) {
			var Z = this;
			Z.confirm();
			if(Z.existDatasetError()) {
				console.warn(jslet.locale.Dataset.cannotConfirm);
			}
	
			var exportHeader = true,
				exportDisplayValue = true,
				onlySelected = false,
				includeFields = null,
				excludeFields = null;
			
			if(exportOption && jQuery.isPlainObject(exportOption)) {
				if(exportOption.exportHeader !== undefined) {
					exportHeader = exportOption.exportHeader? true: false;
				}
				if(exportOption.exportDisplayValue !== undefined) {
					exportDisplayValue = exportOption.exportDisplayValue? true: false;
				}
				if(exportOption.onlySelected !== undefined) {
					onlySelected = exportOption.onlySelected? true: false;
				}
				if(exportOption.includeFields !== undefined) {
					includeFields = exportOption.includeFields;
					jslet.Checker.test('Dataset.exportCsv#exportOption.includeFields', includeFields).isArray();
				}
				if(exportOption.excludeFields !== undefined) {
					excludeFields = exportOption.excludeFields;
					jslet.Checker.test('Dataset.exportCsv#exportOption.excludeFields', excludeFields).isArray();
				}
			}
			var fldSeperator = ',', surround='"';
			var context = Z.startSilenceMove();
			try{
				Z.first();
				var result = [], 
					arrRec, 
					fldCnt = Z._normalFields.length, 
					fldObj, fldName, value, i,
					exportFields = [];
				for(i = 0; i < fldCnt; i++) {
					fldObj = Z._normalFields[i];
					fldName = fldObj.name();
					if(includeFields && includeFields.length > 0) {
						if(includeFields.indexOf(fldName) < 0) {
							continue;
						}
					} else {
						if(!fldObj.visible()) {
							continue;
						}
					}
					if(excludeFields && excludeFields.length > 0) {
						if(excludeFields.indexOf(fldName) >= 0) {
							continue;
						}
					} 
					
					exportFields.push(fldObj);
				}
				fldCnt = exportFields.length;
				if (exportHeader) {
					arrRec = [];
					for(i = 0; i < fldCnt; i++) {
						fldObj = exportFields[i];
						fldName = fldObj.label() || fldObj.name();
						fldName = surround + fldName + surround;
						arrRec.push(fldName);
					}
					result.push(arrRec.join(fldSeperator));
				}
				while(!Z.isEof()) {
					if (onlySelected && !Z.selected()) {
						Z.next();
						continue;
					}
					arrRec = [];
					for(i = 0; i < fldCnt; i++) {
						fldObj = exportFields[i];
						fldName = fldObj.name();
						if (exportDisplayValue) {
							//If Number field does not have lookup field, return field value, not field text. 
							//Example: 'amount' field
							if(fldObj.getType() === 'N' && !fldObj.lookup()) {
								value = Z.getFieldValue(fldName);
							} else {
								value = Z.getFieldText(fldName);
							}
						} else {
							value = Z.getFieldValue(fldName);
						}
						if (!value && value !== 0) {
							value = '';
						} else {
							value += '';
						}
						value = value.replace(/"/,'');
						value = surround + value + surround;
						arrRec.push(value);
					}
					result.push(arrRec.join(fldSeperator));
					Z.next();
				}
				return result.join('\n');
			}finally{
				Z.endSilenceMove(context);
			}
		},
	
		/**
		 * Export data to CSV file.
		 * 
		 * @param {fileName}fileName - CSV file name.
		 * @param {String}includeFieldLabel - export with field labels, can be null  
		 * @param {Boolean}dispValue - true: export display value of field, false: export actual value of field 
		 * @param {Boolean}onlySelected - export selected records or not.
		 * @param {String[]} onlyFields - specified the field name to export.
		 */
		exportCsvFile: function(fileName, includeFieldLabel, dispValue, onlySelected, onlyFields) {
			jslet.Checker.test('Dataset.exportCsvFile#fileName', fileName).required().isString();
	    	var str = this.exportCsv(includeFieldLabel, dispValue, onlySelected, onlyFields);
	        var a = document.createElement('a');
			
	        var blob = new Blob([str], {'type': 'text\/csv'});
	        a.href = window.URL.createObjectURL(blob);
	        a.download = fileName;
	        a.click();
	    },
	    
		/** 
		* Get filtered data list. 
		* 
		*/ 
		filteredDataList: function() { 
			var Z= this, 
				result = [], 
				oldRecno = Z.recnoSilence(); 
			Z.confirm();
			try { 
				for(var i = 0, len = Z.recordCount(); i < len; i++) {
					Z.recnoSilence(i); 
					result.push(Z.getRecord()); 
				} 
			} finally { 
				Z.recnoSilence(oldRecno); 
			} 
			return result; 
		}, 
	
		/** 
		* Iterate the whole dataset, and run the specified callback function. 
		* Example: 
		* 
		* dataset.iterate(function(){
		* 	var fldValue = this.getFieldValue('xxx');
		* 	this.setFieldValue('xxx', fldValue);
		* }); 
		* 
		*/ 
		iterate: function(callBackFn, startRecno, endRecno) { 
			jslet.Checker.test('Dataset.iterate#callBackFn', callBackFn).required().isFunction(); 
			var Z= this, 
				result = [], 
				context = Z.startSilenceMove(); 
			try{
				startRecno = startRecno || 0;
				if(endRecno !== 0 && !endRecno) {
					endRecno = Z.recordCount() - 1;
				}
				for(var k = startRecno; k <= endRecno; k++) {
					Z.recno(k);
					if(callBackFn) { 
						callBackFn.call(Z); 
					} 
				} 
			}finally{ 
				Z.endSilenceMove(context); 
			} 
			return result; 
		}, 
		
		/**
		 * Set or get raw data list
		 * 
		 * @param {Object[]} datalst - raw data list
		 */
		dataList: function (datalst) {
			var Z = this;
			if (datalst === undefined) {
				if(Z._datasetField) {
					return Z._datasetField.getValue();
				}
				return Z._dataList;
			}
			jslet.Checker.test('Dataset.dataList', datalst).isArray();
			if(Z._datasetField) {
				if(datalst === null) {
					datalst = [];
				}
				Z._datasetField.setValue(datalst);
			} else {
				Z._dataList = datalst;
			}
			Z._initialize();
			var fields = Z._subDatasetFields;
			if(fields) {
				var fldObj, subDs;
				for(var i = 0, len = fields.length; i < len; i++) {
					fldObj = fields[i];
					subDs = fldObj.subDataset();
					if(subDs) {
						subDs.confirm();
						subDs._initialize();
					}
				}
			}
			return this;
		},
		
		_initialize: function(isDetailDs) {
			var Z = this;
			if(!isDetailDs) { //Master dataset
				jslet.data.FieldValueCache.removeAllCache(Z);
				jslet.data.FieldError.clearDatasetError(Z);
				jslet.data.convertDateFieldValue(Z);
				Z._changeLog.clear();
			}
			Z.status(jslet.data.DataSetStatus.BROWSE);
			Z._recno = -1;
			Z.indexFields(Z.indexFields());
			Z.filter(null);
			if(Z.filtered() || Z.fixedFilter()) {
				Z._doFilterChanged();			
			}
			Z.first();
			Z.calcAggradedValue();	
			Z.refreshControl(jslet.data.RefreshEvent._updateAllEvent);
			Z.refreshLookupHostDataset();
		},
		
		/**
		 * Return dataset data with field text, field text is formatted or calculated field value.
		 * You can use them to do your special processing like: use them in jquery template.
		 */
		textList: function() {
			var Z = this;
			Z.confirm();
			
			var	oldRecno = Z.recno(), 
				result = [],
				fldCnt = Z._normalFields.length,
				fldObj, fldName, textValue, textRec;
			try {
				for (var i = 0, cnt = Z.recordCount(); i < cnt; i++) {
					Z.recnoSilence(i);
					textRec = {};
					for(var j = 0; j < fldCnt; j++) {
						fldObj = Z._normalFields[j];
						fldName = fldObj.name();
						textValue = Z.getFieldText(fldName);
						textRec[fldName] = textValue;
					}
					result.push(textRec);
				}
				return result;
			} finally {
				this.recnoSilence(oldRecno);
			}
		},
		
		/**
		 * Export dataset snapshot. Dataset snapshot can be used for making a backup when inputing a lot of data. 
		 * 
		 * @return {Object} Dataset snapshot.
		 */
		exportSnapshot: function() {
			var Z = this,
				mainDs = {name: Z.name(), recno: Z.recno(), status: Z.status(), dataList: Z.dataList(), changedRecords: Z._changeLog._changedRecords};
			var indexFields = Z.indexFields();
			if(indexFields) {
				mainDs.indexFields = indexFields;
			}
			var filter = Z.filter();
			if(filter) {
				mainDs.filter = filter;
				mainDs.filtered = Z.filtered();
			}
			var result = {master: mainDs};
			var details = null, detail;
			var detailFields = Z._subDatasetFields;
			if(detailFields) {
				var subFldObj, subDs;
				for(var i = 0, len = detailFields.length; i < len; i++) {
					subFldObj = detailFields[i];
					subDs = subFldObj.subDataset();
					if(subDs) {
						if(!details) {
							details = [];
						}
						detail = {name: subDs.name(), recno: subDs.recno(), status: subDs.status()};
						indexFields = subDs.indexFields();
						if(indexFields) {
							subDs.indexFields = indexFields;
						}
						filter = subDs.filter();
						if(filter) {
							subDs.filter = filter;
							subDs.filtered = subDs.filtered();
						}
						details.push(detail);
					}
				}
			}
			if(details) {
				result.details = details;
			}
			
			return result;
		},
		
		/**
		 * Import a dataset snapshot.
		 * 
		 * @param {Object} snapshot Dataset snapshot.
		 */
		importSnapshot: function(snapshot) {
			jslet.Checker.test('Dataset.importSnapshot#snapshot', snapshot).required().isPlanObject();
			var master = snapshot.master;
			jslet.Checker.test('Dataset.importSnapshot#snapshot.master', master).required().isPlanObject();
			var Z = this,
				dsName = master.name;
			if(dsName != Z._name) {
				throw new Error('Snapshot does not match the current dataset name!');
			}
			Z._dataList = master.dataList;
			Z._changeLog._changedRecords = master.changedRecords;
			if(master.indexFields !== undefined) {
				Z.indexFields(master.indexFields);
			}
			if(master.filter != undefined) {
				Z.filter(master.filter);
				Z.filtered(master.filtered);
			}
			if(master.recno >= 0) {
				Z._silence++;
				try {
					Z.recno(master.recno);
				} finally {
					Z._silence--;
				}
			}
			Z.refreshControl();
			var details = snapshot.details;
			if(!details || details.length === 0) {
				return;
			}
			var detail, subDs;
			for(var i = 0, len = details.length; i < len; i++) {
				detail = details[i];
				subDs = jslet.data.getDataset(detail.name);
				if(subDs) {
					if(detail.indexFields !== undefined) {
						subDs.indexFields(detail.indexFields);
					}
					if(detail.filter !== undefined) {
						subDs.filter(detail.filter);
						subDs.filtered(detail.filtered);
					}
					if(detail.recno >= 0) {
						subDs._silence++;
						try {
							subDs.recno(detail.recno);
						} finally {
							subDs._silence--;
						}
					}
					subDs.refreshControl();
				}
			}
		},
		
		destroy: function () {
			var Z = this;
			Z._masterDataset = null;
			Z._detailDatasets = null;
			Z._fields = null;
			Z._linkedControls = null;
			Z._innerFilter = null;
			Z._innerFindCondition = null;
			Z._sortingFields = null;
			Z._innerFormularFields = null;
			Z._datasetField = null;
			
			jslet.data.dataModule.unset(Z._name);
			jslet.data.datasetRelationManager.removeDataset(Z._name);		
		}
		
	};
	// end Dataset
	
	/**
	 * Create Enum Dataset. Example:
	 * <pre><code>
	 * var dsGender = jslet.data.createEnumDataset('gender', 'F:Female,M:Male');
	 * dsGender.getFieldValue('code');//return 'F'
	 * dsGender.getFieldValue('name');//return 'Female'
	 * dsGender.next();
	 * dsGender.getFieldValue('code');//return 'M'
	 * dsGender.getFieldValue('name');//return 'Male'
	 * </code></pre>
	 * 
	 * @param {String} dsName dataset name;  
	 * @param {String or Object} enumStrOrObject a string or an object which stores enumeration data; if it's a string, the format must be:<code>:<name>,<code>:<name>
	 * @return {jslet.data.Dataset}
	 */
	jslet.data.createEnumDataset = function(dsName, enumStrOrObj) {
		jslet.Checker.test('createEnumDataset#enumStrOrObj', enumStrOrObj).required();
			
		var dsObj = new jslet.data.Dataset(dsName);
		dsObj.addField(jslet.data.createStringField('code', 10));
		dsObj.addField(jslet.data.createStringField('name', 20));
	
		dsObj.keyField('code');
		dsObj.codeField('code');
		dsObj.nameField('name');
	
		var dataList = [];
		if(jslet.isString(enumStrOrObj)) {
			var enumStr = jQuery.trim(enumStrOrObj);
			var recs = enumStr.split(','), recstr;
			for (var i = 0, cnt = recs.length; i < cnt; i++) {
				recstr = jQuery.trim(recs[i]);
				rec = recstr.split(':');
		
				dataList[dataList.length] = {
					'code' : jQuery.trim(rec[0]),
					'name' : jQuery.trim(rec[1])
				};
			}
		} else {
			for(var key in enumStrOrObj) {
				dataList[dataList.length] = {code: key, name: enumStrOrObj[key]};
			}
		}
		dsObj.dataList(dataList);
		dsObj.indexFields('code');
		return dsObj;
	};
	
	/**
	 * Create dataset with field configurations. Example:
	 * <pre><code>
	 *   var fldCfg = [{
	 *     name: 'deptid',
	 *     type: 'S',
	 *     length: 10,
	 *     label: 'ID'
	 *   }, {
	 *     name: 'name',
	 *     type: 'S',
	 *     length: 20,
	 *     label: 'Dept. Name'
	 *   }];
	 *   var dsCfg = {keyField: 'deptid', codeField: 'deptid', nameField: 'name'};
	 *   var dsDepartment = jslet.data.createDataset('department', fldCfg, dsCfg);
	 * </code></pre>
	 * 
	 * @param {String} dsName - dataset name
	 * @param {jslet.data.Field[]} field configuration
	 * @param {Object} dsCfg - dataset configuration
	 * @return {jslet.data.Dataset}
	 */
	jslet.data.createDataset = function(dsName, fieldConfig, dsCfg) {
		jslet.Checker.test('createDataset#fieldConfig', fieldConfig).required().isArray();
		jslet.Checker.test('Dataset.createDataset#datasetCfg', dsCfg).isPlanObject();
		var dsObj = new jslet.data.Dataset(dsName),
			fldObj, 
			fldCfg;
		for (var i = 0, cnt = fieldConfig.length; i < cnt; i++) {
			fldCfg = fieldConfig[i];
			jslet.Checker.test('Dataset.createDataset#fieldCfg', fldCfg).isPlanObject();
			
			fldCfg.dsName = dsName;
			fldObj = jslet.data.createField(fldCfg);
			dsObj.addField(fldObj);
		}
		
		function setPropValue(propName) {
			var propValue = dsCfg[propName];
			if(propValue === undefined) {
				propValue = dsCfg[propName.toLowerCase()];
			}
			if (propValue !== undefined) {
				dsObj[propName](propValue);
			}
		}
		
		function setIntPropValue(propName) {
			var propValue = dsCfg[propName];
			if(propValue === undefined) {
				propValue = dsCfg[propName.toLowerCase()];
			}
			if (propValue !== undefined) {
				dsObj[propName](parseInt(propValue));
			}
		}
		
		function setBooleanPropValue(propName) {
			var propValue = dsCfg[propName];
			if(propValue === undefined) {
				propValue = dsCfg[propName.toLowerCase()];
			}
			if (propValue !== undefined) {
				if(jslet.isString(propValue)) {
					if(propValue) {
						propValue = propValue != '0' && propValue != 'false';
					}
				}
				dsObj[propName](propValue? true: false);
			}
		}
		
		if(dsCfg) {
			setPropValue('keyField');
			setPropValue('codeField');
			setPropValue('nameField');
			setPropValue('parentField');
			setPropValue('levelOrderField');
			setPropValue('selectField');
			setPropValue('recordClass');
	
			setPropValue('queryUrl');
			setPropValue('submitUrl');
			setIntPropValue('pageNo');
			setIntPropValue('pageSize');
			setPropValue('fixedIndexFields');
			setPropValue('indexFields');
			setPropValue('fixedFilter');
			setPropValue('filter');
			setBooleanPropValue('filtered');
			setBooleanPropValue('autoShowError');
			setBooleanPropValue('autoRefreshHostDataset');
			setBooleanPropValue('readOnly');
			setBooleanPropValue('logChanges');
			setPropValue('datasetListener');
			setPropValue('onFieldChange');
			setPropValue('onCheckSelectable');
			setPropValue('contextRules');
		}
		var globalHandler = jslet.data.globalDataHandler.datasetCreated();
		if(globalHandler) {
			globalHandler(dsObj);
		}
		return dsObj;
	};
	
	//
	//jslet.data.createCrossDataset = function(sourceDataset, labelField, valueField, crossDsName) {
	//	if(!crossDsName) { 
	//		crossDsName = sourceDataset.name()+'_cross'; 
	//	} 
	//	jslet.Checker.test('createCrossDataset#labelField', labelField).required().isString();
	//	jslet.Checker.test('createCrossDataset#valueField', valueField).required().isString();
	//
	//	if(jslet.isString(sourceDataset)) {
	//		sourceDataset = jslet.data.getDataset(sourceDataset);
	//	}
	//	jslet.Checker.test('createCrossDataset#sourceDataset', sourceDataset).required().isClass(jslet.data.Dataset.className);
	//	
	//	var lblFldObj = sourceDataset.getField(labelField);
	//	if(!lblFldObj) {
	//		throw new Error('Not found field: ' + labelField);
	//	}
	//	var lblLkFld = lblFldObj.lookup(); 
	//	if(!lblLkFld) { 
	//		throw new Error(sourceDataset.name() + '.' + labelField + ' must have lookup dataset!'); 
	//	} 
	//	var valueFldObj = sourceDataset.getField(valueField); 
	//	if(!valeFldObj) {
	//		throw new Error('Not found field: ' + valeFldObj);
	//	}
	//	if(valeFldObj.getType() != jslet.data.DataType.NUMBER) {
	//		hasTotalField = false;
	//	}
	//	
	//	var labelFldNames = labelField.split(',');
	//		
	//	{name: '', horiFields:[{field:'', subTotal: false, showAll:false}, 
	//	           vertFields:[{field:'', subTotal: false, showAll:false}], 
	//	           cellFields:'',
	//	           totalPosition: 'before/after',
	//	           indent: true}
	//	
	//	
	//}
	
	jslet.data.ChangeLog = function(dataset) {
		this._dataset = dataset;
		this._changedRecords = null;
	}
	
	jslet.data.ChangeLog.prototype = {
		changedRecords: function(changedRecords) {
			if(changedRecords === undefined) {
				return this._changedRecords;
			}
			this._changedRecords = changedRecords;
		},
		
		log: function(recObj) {
			if(!this._dataset.logChanges()) {
				return;
			}
			if(!recObj) {
				recObj = this._dataset.getRecord();
			}
			var recInfo = jslet.data.getRecInfo(recObj);
			if(!recInfo.status) {
				return;
			}
			var chgRecords = this._getChangedRecords();
			if(chgRecords.indexOf(recObj) < 0) {
				chgRecords.push(recObj);
			}
		},
		
		unlog: function(recObj) {
			if(!this._dataset.logChanges()) {
				return;
			}
			if(!recObj) {
				recObj = this._dataset.getRecord();
			}
			var chgRecords = this._getChangedRecords(recObj);
			var k = chgRecords.indexOf(recObj);
			if(k >= 0) {
				chgRecords.splice(k, 1);
			}
		},
		
		clear: function() {
			this._changedRecords = null;
		},
		
		_getChangedRecords: function() {
			var dsObj = this._dataset;
			var masterFldObj = dsObj.datasetField(),
			  	chgRecords;
			if(masterFldObj) {
				var masterFldName = masterFldObj.name(),
					masterDsObj = masterFldObj.dataset();
					masterRecInfo = jslet.data.getRecInfo(masterDsObj.getRecord());
					if(!masterRecInfo.subLog) {
						masterRecInfo.subLog = {};
					}
					chgRecords = masterRecInfo.subLog[masterFldName];
					if(!chgRecords) {
						chgRecords = [];
						masterRecInfo.subLog[masterFldName] = chgRecords;
					}
			} else {
				if(!this._changedRecords) {
					this._changedRecords = [];
				}
				chgRecords = this._changedRecords;
			}
			return chgRecords;
		}
		
	}
	
	jslet.data.DataTransformer = function(dataset) {
		this._dataset = dataset;
	}
	
	jslet.data.DataTransformer.prototype = {
			
		hasChangedData: function() {
			var chgRecList = this._dataset._changeLog._changedRecords;
			if(!chgRecList || chgRecList.length === 0) {
				return false;
			}
			return true;
		},
		
		getSubmittingChanged: function() {
			var chgRecList = this._dataset._changeLog._changedRecords;
			if(!chgRecList || chgRecList.length === 0) {
				return null;
			}
			var result = this._convert(this._dataset, chgRecList);
			return result;
		},
		
		getSubmittingSelected: function() {
			var chgRecList = this._dataset.selectedRecords();
			if(!chgRecList || chgRecList.length === 0) {
				return null;
			}
			var result = this._convert(this._dataset, chgRecList, true);
			return result;
		},
		
		_convert: function(dsObj, chgRecList, submitAllSubData) {
			if(!chgRecList || chgRecList.length === 0) {
				return null;
			}
			var chgRec, recInfo, status, newRec,
				recClazz = dsObj._recordClass || jslet.global.defaultRecordClass,
				result = [],
				subLog;
			for(var i = 0, len = chgRecList.length; i < len; i++) {
				chgRec = chgRecList[i];
				recInfo = jslet.data.getRecInfo(chgRec);
				newRec = {};
				if(recClazz) {
					newRec["@type"] = recClazz;
				}
				subLog = recInfo.subLog;
				chgRec[jslet.global.changeStateField] = this._getStatusPrefix(recInfo.status) + i;
				var fldObj, subList;
				for(var fldName in chgRec) {
					if(fldName === '_jl_') {
						continue;
					}
					fldObj = dsObj.getField(fldName);
					if(fldObj && fldObj.getType() === jslet.data.DataType.DATASET) {
						var subDsObj = fldObj.subDataset();
						if(submitAllSubData === undefined) {
							submitAllSubData = !subDsObj._onlyChangedSubmitted;
						}
						var allList = chgRec[fldName];
						if(!submitAllSubData) { //add deleted record
							var subChgList = subLog? subLog[fldName]: null;
							if(subChgList) {
								var subChgRec, subRecInfo;
								for(var k = 0, chgLen = subChgList.length; k < chgLen; k++) {
									subChgRec = subChgList[k];
									subRecInfo = jslet.data.getRecInfo(subChgRec);
									if(subRecInfo && subRecInfo.status === jslet.data.DataSetStatus.DELETE) {
										allList.push(subChgRec);
									}
								}
							}
						}
						subList = this._convert(subDsObj, allList);
						if(subList) {
							newRec[fldName] = subList;
						}
					} else {
						newRec[fldName] = chgRec[fldName];
					}
				}
				result.push(newRec);
			}
			return result;
		},
		
		_getStatusPrefix: function(status) {
			return  status === jslet.data.DataSetStatus.INSERT ? 'i' : 
				(status === jslet.data.DataSetStatus.UPDATE? 'u':
				 status === jslet.data.DataSetStatus.DELETE? 'd':'s');
		},
				
		refreshSubmittedData: function(submittedData) {
			if(!submittedData || submittedData.length === 0) {
				return;
			}
			this._refreshDataset(this._dataset, submittedData);
		},
		
		_refreshDataset: function(dsObj, submittedData, isDetailDataset) {
			if(!submittedData || submittedData.length === 0) {
				return;
			}
			if(!isDetailDataset) {
				jslet.data.convertDateFieldValue(dsObj, submittedData);
			}
			var masterFldObj = dsObj.datasetField(), chgLogs;
			if(!masterFldObj) {
				chgLogs = dsObj._changeLog._changedRecords;
			} else {
				var masterRec = masterFldObj.dataset().getRecord();
				var masterRecInfo = jslet.data.getRecInfo(masterRec);
				chgLogs = masterRecInfo.subLog? masterRecInfo.subLog[masterFldObj.name()]: null;
			}
	
			var newRec, oldRec, flag;
			for(var i = 0, len = submittedData.length; i < len; i++) {
				newRec = submittedData[i];
				if(!newRec) {
					console.warn('The return record exists null. Please check it.');
					continue;
				}
				this._refreshRecord(dsObj, newRec, chgLogs);
			}
		},
			
		_refreshRecord: function(dsObj, newRec, chgLogs) {
			var recState = newRec[jslet.global.changeStateField];
			if(!recState) {
				return;
			}
			if(chgLogs && recState.charAt(0) == 'd') {
				for(var i = 0, len = chgLogs.length; i < len; i++) {
					if(recState == chgLogs[i][jslet.global.changeStateField]) {
						chgLogs.splice(i, 1);
						break;
					}
				}
				return;
			}
			var oldRec, fldObj,
				records = dsObj.dataList() || [];
			for(var i = records.length - 1; i >= 0; i--) {
				oldRec = records[i];
				if(oldRec[jslet.global.changeStateField] != recState) {
					continue;
				}
				for(var fldName in newRec) {
					if(!fldName) {
						continue;
					}
					fldObj = dsObj.getField(fldName);
					if(fldObj && fldObj.subDataset()) {
						this._refreshDataset(fldObj.subDataset(), newRec[fldName], true);
					} else {
						oldRec[fldName] = newRec[fldName];
					}
				} // end for fldName
				if(chgLogs) {
					for(var i = 0, len = chgLogs.length; i < len; i++) {
						if(recState == chgLogs[i][jslet.global.changeStateField]) {
							chgLogs.splice(i, 1);
							break;
						}
					}
				}
				oldRec[jslet.global.changeStateField] = null;
				var recInfo = jslet.data.getRecInfo(oldRec);
				if(recInfo && recInfo.status) {
					recInfo.status = 0;
				}
				jslet.data.FieldValueCache.removeCache(oldRec);
			} // end for i
		}
		
	}
	/* ========================================================================
	 * Jslet framework: jslet.expression.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class Expression. Example:
	 * <pre><code>
	 * var expr = new jslet.Expression(dsEmployee, '[name] == "Bob"');
	 * expr.eval();//return true or false
	 * 
	 * </code></pre>
	 * 
	 * @param {jselt.data.Dataset} dataset dataset that use to evalute.
	 * @param {String} expre Expression
	 */
	jslet.Expression = function(dataset, expr) {
		jslet.Checker.test('jslet.Expression#dataset', dataset).required();
		jslet.Checker.test('jslet.Expression#expr', expr).required().isString();
		this._fields = [];
		this._otherDatasetFields = [];
		this._expr = expr;
		this._parsedExpr = '';
		if (typeof dataset == 'string') {
			this._dataset = jslet.data.getDataset(dataset);
			if (!this._dataset) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.datasetNotFound, [dsName]));
			}
		}else{
			jslet.Checker.test('jslet.Expression#dataset', dataset).isClass(jslet.data.Dataset.className);
			this._dataset = dataset;
		}
		
		this.context = {mainds: dataset};
		this.parse();
	};
	
	jslet.Expression.prototype = {
		_ParserPattern: /\[[_a-zA-Z][\.!\w]*(,\d){0,1}]/gim,
		
		parse: function() {
			
			var start = 0, end, k, 
				dsName, fldName, 
				otherDs, stag, dsObj,
				tmpExpr = [], 
				valueIndex = null;
			this._ParserPattern.lastIndex = 0;
			while ((stag = this._ParserPattern.exec(this._expr)) !== null) {
				fldName = stag[0];
	
				if (!fldName || fldName.endsWith('(')) {
					continue;
				}
	
				dsName = null;
				fldName = fldName.substr(1, fldName.length - 2);
				k = fldName.indexOf(',');
				if(k > 0) {
					valueIndex = parseInt(fldName.substr(k + 1));
					if(isNaN(valueIndex)) {
						valueIndex = null;
					}
					fldName = fldName.substr(0, k);
				}
				k = fldName.indexOf('!');
				if (k > 0) {
					dsName = fldName.substr(0, k);
					fldName = fldName.substr(k + 1);
				}
	
				end = stag.index;
				dsObj = this._dataset;
				if(dsName) {
					otherDs = jslet.data.dataModule.get(dsName);
					if (!otherDs) {
						throw new Error(jslet.formatString(jslet.locale.Dataset.datasetNotFound, [dsName]));
					}
					this.context[dsName] = otherDs;
					dsObj = otherDs;
				}
	
				if (!dsName) {
					tmpExpr.push(this._expr.substring(start, end));
					tmpExpr.push('context.mainds.getFieldValueByRecord(context.dataRec, "');
					this._fields.push(fldName);
				} else {
					tmpExpr.push(this._expr.substring(start, end));
					tmpExpr.push('context.');
					tmpExpr.push(dsName);
					tmpExpr.push('.getFieldValue("');
					this._otherDatasetFields.push({
								dataset : dsName,
								fieldName : fldName
							});
				}
				tmpExpr.push(fldName);
				tmpExpr.push('"');
				if(valueIndex !== null) {
					tmpExpr.push(',');
					tmpExpr.push(valueIndex);
				}
				tmpExpr.push(')');
				
				start = end + stag[0].length;
			}//end while
			tmpExpr.push(this._expr.substr(start));
			this._parsedExpr = tmpExpr.join('');
		}, //end function
	
		/**
		 * Get fields included in the expression.
		 * 
		 * @return {Array of String}
		 */
		mainFields: function() {
			return this._fields;
		},
	
		/**
		 * Get fields of other dataset included in the expression.
		 * Other dataset fields are identified with 'datasetName!fieldName', like: department!deptName
		 * 
		 * @return {Array of Object} the return value like:[{dataset : 'dsName', fieldName: 'fldName'}]
		 */
		otherDatasetFields: function() {
			return this._otherDatasetFields;
		},
	
		/**
		 * Evaluate the expression.
		 * 
		 * @param {Object} dataRec Data record object, this argument is used in parsedExpr 
		 * @return {Object} The value of Expression.
		 */
		eval: function() {
			var context = this.context;
			context.mainds = this._dataset;
			return eval(this._parsedExpr);
		},
		
		destroy: function() {
			this._dataset = null;
			this._fields = null;
			this._otherDatasetFields = [];
			this._parsedExpr = null;
			this._expr = null;
			this.context = null;
		}
	
		
	};
	
	
	/* ========================================================================
	 * Jslet framework: jslet.field.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class Field 
	 * 
	 * @param {String} fieldName Field name
	 * @param {jslet.data.DataType} dataType Data type of field
	 */
	jslet.data.Field = function (fieldName, dataType) {
		jslet.Checker.test('Field#fieldName', fieldName).isString();
		fieldName = jQuery.trim(fieldName);
		jslet.Checker.test('Field#fieldName', fieldName).required();
		jslet.Checker.test('Field#dataType', dataType).isString().required();
	
		var Z = this;
		Z._dataset = null;
		Z._dsName = null;
		Z._displayOrder = 0;
		Z._tabIndex = null;
		Z._fieldName = fieldName;
		Z._dataType = dataType;
		Z._length = 0;
		Z._scale = 0;
		Z._unique = false;
		
		Z._defaultExpr = null;
		Z._defaultValue = null;
		Z._label = null;
		Z._tip = null;
		Z._message = null;
		Z._displayWidth = 0;
		Z._editMask = null;
		Z._displayFormat = null;
		Z._dateFormat = null;
		Z._formula = null;
		Z._readOnly = false;
		Z._visible = true;
		Z._disabled = false;
		Z._customValueConverter = null;
		Z._unitConverted = false;
	
		Z._lookup = null;
		
		Z._displayControl = null;
		Z._editControl = null;
		Z._subDataset = null;
		Z._urlExpr = null;
		Z._innerUrlExpr = null;
		Z._urlTarget = null;
		Z._valueStyle = jslet.data.FieldValueStyle.NORMAL; //0 - Normal, 1 - Between style value, 2 - Multiple value
		Z._valueCountLimit = 0;
		Z._required = false;
		Z._nullText = jslet.locale.Dataset.nullText;
		Z._dataRange= null;
		Z._regularExpr = null;
		Z._antiXss = true;
		Z._customValidator = null;
		Z._validChars = null; //Array of characters
		Z._dateChar = null;
		Z._dateRegular = null;
		Z._parent = null; //parent field object
		Z._children = null; //child field object
		Z._trueValue = true;
		Z._falseValue = false;
		Z._trueText = null;
		Z._falseText = null;
		Z._mergeSame = false;
		Z._mergeSameBy = null;
		Z._fixedValue = null;
		Z._valueFollow = false;
		Z._aggraded = false; //optional value: sum, count, avg
		Z._aggradedBy = null;
		
		Z._crossSource = null;
	};
	
	jslet.data.Field.className = 'jslet.data.Field';
	
	jslet.data.Field.prototype = {
		className: jslet.data.Field.className,
		
		/**
		 * {jslet.data.Dataset}
		 */
		dataset: function (dataset) {
			var Z = this;
			if (dataset === undefined) {
				if(Z._parent) {
					return Z._parent.dataset();
				}
				return Z._dataset;
			}
			
			if(jslet.isString(dataset)) {
				dataset = jslet.data.getDataset(dataset); 
			} else {
				jslet.Checker.test('Field.dataset', dataset).isClass(jslet.data.Dataset.className);
			}
			if(dataset) {
				Z._dsName = dataset.name();
			}
			Z._removeRelation();
			Z._dataset = dataset;
			Z._clearFieldCache();
			Z._addRelation();
			return this;
		},
		
		/**
		 * Get or set field name
		 * 
		 * @param {String or undefined} fldName Field name.
		 * @return {String}
		 */
		name: function () {
			if(arguments.length >0) {
				alert("Can't change field name!");
			}
			return this._fieldName;
		},
	
		/**
		 * Get or set field label.
		 * 
		 * @param {String or undefined} label Field label.
		 * @return {String or this}
		 */
		label: function (label) {
			var Z = this;
			if (label === undefined) {
				return Z._label || Z._fieldName;
			}
			jslet.Checker.test('Field.label', label).isString();
			Z._label = label;
			Z._fireMetaChangedEvent('label');
			Z._fireGlobalMetaChangedEvent('label');
			return this;
		},
	
		/**
		 * Get or set field tip.
		 * 
		 * @param {String or undefined} tip Field tip.
		 * @return {String or this}
		 */
		tip: function(tip) {
			var Z = this;
			if (tip === undefined) {
				return Z._tip;
			}
			jslet.Checker.test('Field.tip', tip).isString();
			Z._tip = tip;
			Z._fireMetaChangedEvent('tip');
			Z._fireGlobalMetaChangedEvent('tip');
			return this;
		},
		
		/**
		 * Get field data type.
		 * 
		 * @param {jslet.data.DataType}
		 */
		getType: function () {
			return this._dataType;
		},
	
		/**
		 * Get or set parent field object.
		 * 
		 * @param {jslet.data.Field or undefined} parent Parent field object.
		 * @return {jslet.data.Field or this}
		 */
		parent: function (parent) {
			var Z = this;
			if (parent === undefined) {
				return Z._parent;
			}
			jslet.Checker.test('Field.parent', parent).isClass(this.className);
			Z._parent = parent;
			return this;
		},
	
		/**
		 * Get or set child fields of this field.
		 * 
		 * @param {jslet.data.Field[] or undefined} children Child field object.
		 * @return {jslet.data.Field or this}
		 */
		children: function (children) {
			var Z = this;
			if (children === undefined) {
				return Z._children;
			}
			jslet.Checker.test('Field.children', children).isArray();
			for(var i = 0, len = children.length; i < len; i++) {
				jslet.Checker.test('Field.children#childField', children[i]).isClass(this.className);
			}
			Z._children = children;
			return this;
		},
		
		/**
		 * Get or set field display order.
		 * Dataset uses this property to resolve field order.
		 * 
		 * @param {Integer or undefined} displayOrder Field display order.
		 * @return {Integer or this}
		 */
		displayOrder: function (displayOrder) {
			var Z = this;
			if (displayOrder === undefined) {
				return Z._displayOrder;
			}
			jslet.Checker.test('Field.displayOrder', displayOrder).isNumber();
			Z._displayOrder = parseInt(displayOrder);
			Z._fireGlobalMetaChangedEvent('displayOrder');
			return this;
		},
	
		/**
		 * Get or set the edit control tab index of this field.
		 * 
		 * @param {Integer or undefined} tabIndex the edit control tab index of this field.
		 * @return {Integer or this}
		 */
		tabIndex: function(tabIndex) {
			var Z = this;
			if (tabIndex === undefined) {
				return Z._tabIndex;
			}
			jslet.Checker.test('Field.tabIndex', tabIndex).isNumber();
			Z._tabIndex = parseInt(tabIndex);
			Z._fireMetaChangedEvent('tabIndex');
			Z._fireGlobalMetaChangedEvent('tabIndex');
			return this;
		},
		
		/**
		 * Get or set field stored length.
		 * If it's a database field, it's usually same as the length of database.  
		 * 
		 * @param {Integer or undefined} len Field stored length.
		 * @return {Integer or this}
		 */
		length: function (len) {
			var Z = this;
			if (len === undefined) {
				return Z._length;
			}
			jslet.Checker.test('Field.length', len).isGTEZero();
			Z._length = parseInt(len);
			Z._fireGlobalMetaChangedEvent('length');
			return this;
		},
		
		/**
		 * Get edit length.
		 * Edit length is used in editor to input data.
		 * 
		 * @return {Integer}
		 */
		getEditLength: function () {
			var Z = this;
			if (Z._lookup) {
				var codeFld = Z._lookup.codeField();
				var lkds = Z._lookup.dataset();
				if (lkds && codeFld) {
					var lkf = lkds.getField(codeFld);
					if (lkf) {
						return lkf.getEditLength();
					}
				}
			}
			if(Z._dataType === jslet.data.DataType.NUMBER && Z._scale > 0) {
				return Z._length + 1; // 1 for decimal point
			}
			return Z._length > 0 ? Z._length : 10;
		},
	
		/**
		 * Get or set field decimal length.
		 * 
		 * @param {Integer or undefined} scale Field decimal length.
		 * @return {Integer or this}
		 */
		scale: function (scale) {
			var Z = this;
			if (scale === undefined) {
				return Z._scale;
			}
			jslet.Checker.test('Field.scale', scale).isGTEZero();
			Z._scale = parseInt(scale);
			Z._fireGlobalMetaChangedEvent('scale');
			return this;
		},
	
		/**
		 * Get or set field alignment.
		 * 
		 * @param {String or undefined} alignment Field alignment.
		 * @return {String or this}
		 */
		alignment: function (alignment) {
			var Z = this;
			if (alignment === undefined){
				if(Z._alignment) {
					return Z._alignment;
				}
				
				if(Z._lookup) {
					return 'left';
				}
				if(Z._dataType == jslet.data.DataType.NUMBER) {
					return 'right';
				}
				
				if(Z._dataType == jslet.data.DataType.BOOLEAN) {
					return 'center';
				}
				return 'left';
			}
			
			jslet.Checker.test('Field.alignment', alignment).isString();
			Z._alignment = jQuery.trim(alignment);
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('alignment');
			return this;
		},
	
		/**
		 * Get or set the display text if the field value is null.
		 * 
		 * @param {String or undefined} nullText Field null text.
		 * @return {String or this}
		 */
		nullText: function (nullText) {
			var Z = this;
			if (nullText === undefined) {
				return Z._nullText;
			}
			jslet.Checker.test('Field.nullText', nullText).isString();
			nullText = jQuery.trim(nullText);
			Z._nullText = nullText;
			Z._clearFieldCache();
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('nullText');
			return this;
		},
	
		/**
		 * Get or set field display width.
		 * Display width is usually used in DBTable column.
		 * 
		 * @param {Integer or undefined} displayWidth Field display width.
		 * @return {Integer or this}
		 */
		displayWidth: function (displayWidth) {
			var Z = this;
			if (displayWidth === undefined){
				if (Z._displayWidth <= 0) {
					return Z._length > 0 ? Z._length : 12;
				} else {
					return Z._displayWidth;
				}
			}
			jslet.Checker.test('Field.displayWidth', displayWidth).isGTEZero();
			Z._displayWidth = parseInt(displayWidth);
			Z._fireGlobalMetaChangedEvent('displayWidth');
			return this;
		},
		
		/**
		 * Get or set field default expression.
		 * This expression will be calculated when inserting a record.
		 * 
		 * @param {String or undefined} defaultExpr Field default expression.
		 * @return {String or this}
		 */
		defaultExpr: function (defaultExpr) {
			var Z = this;
			if (defaultExpr === undefined) {
				return Z._defaultExpr;
			}
			jslet.Checker.test('Field.defaultExpr', defaultExpr).isString();
			Z._defaultExpr = defaultExpr;
			Z._fireGlobalMetaChangedEvent('defaultExpr');
			return this;
		},
	
		/**
		 * Get or set field display format.
		 * For number field like: #,##0.00
		 * For date field like: yyyy/MM/dd
		 * 
		 * @param {String or undefined} format Field display format.
		 * @return {String or this}
		 */
		displayFormat: function (format) {
			var Z = this;
			if (format === undefined) {
				if (Z._displayFormat) {
					return Z._displayFormat;
				} else {
					if (Z._dataType == jslet.data.DataType.DATE) {
						return jslet.locale.Date.format;
					} else {
						return Z._displayFormat;
					}
				}
			}
			
			jslet.Checker.test('Field.displayFormat', format).isString();
			Z._displayFormat = jQuery.trim(format);
			Z._dateFormat = null;
			Z._dateChar = null;
			Z._dateRegular = null;
			Z._clearFieldCache();		
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('displayFormat');
			return this;
		},
	
		/**
		 * Get or set field default value.
		 * The data type of default value must be same as Field's.
		 * Example:
		 *   Number field: fldObj.defauleValue(100);
		 *   Date field: fldObj.defaultValue(new Date());
		 *   String field: fldObj.defaultValue('test');
		 * 
		 * @param {Object or undefined} dftValue Field default value.
		 * @return {Object or this}
		 */
		defaultValue: function (dftValue) {
			var Z = this;
			if (dftValue === undefined) {
				return Z._defaultValue;
			}
			jslet.Checker.test('Field.defaultValue', Z.dftValue).isDataType(Z._dateType);
			Z._defaultValue = dftValue;
			Z._fireGlobalMetaChangedEvent('defaultValue');
			return this;
		},
	
		/**
		 * Get or set field is unique or not.
		 * 
		 * @param {Boolean or undefined} unique Field is unique or not.
		 * @return {Boolean or this}
		 */
		unique: function (unique) {
			var Z = this;
			if (unique === undefined) {
				return Z._unique;
			}
			Z._unique = unique ? true: false;
			Z._fireGlobalMetaChangedEvent('unique');
			return this;
		},
		
		/**
		 * Get or set field is required or not.
		 * 
		 * @param {Boolean or undefined} required Field is required or not.
		 * @return {Boolean or this}
		 */
		required: function (required) {
			var Z = this;
			if (required === undefined) {
				return Z._required;
			}
			Z._required = required ? true: false;
			Z._fireMetaChangedEvent('required');
			Z._fireGlobalMetaChangedEvent('required');
			return this;
		},
		
		/**
		 * Get or set field edit mask.
		 * 
		 * @param {jslet.data.EditMask or undefined} mask Field edit mask.
		 * @return {jslet.data.EditMask or this}
		 */
		editMask: function (mask) {
			var Z = this;
			if (mask === undefined) {
				return Z._editMask;
			}
			if(mask) {
				if (jslet.isString(mask)) {
					mask = {mask: mask,keepChar:true};
				}
			} else {
				mask = null;
			}
			Z._editMask = mask;
			Z._clearFieldCache();		
			Z._fireMetaChangedEvent('editMask');
			Z._fireGlobalMetaChangedEvent('required');
			return this;
		},
		
		dateFormat: function(){
			var Z = this;
			if (Z._dateFormat) {
				return Z._dateFormat;
			}
			if (this.getType() != jslet.data.DataType.DATE) {
				return null;
			}
			var displayFmt = this.displayFormat().toUpperCase();
			Z._dateFormat = '';
			var c;
			for(var i = 0, len = displayFmt.length; i < len; i++){
				c = displayFmt.charAt(i);
				if ('YMD'.indexOf(c) < 0) {
					continue;
				}
				if (Z._dateFormat.indexOf(c) < 0) {
					Z._dateFormat += c;
				}
			}
			return Z._dateFormat;
		},
		
		dateSeparator: function(){
			var Z = this;
			if (Z._dateChar) {
				return Z._dateChar;
			}
			if (this.getType() != jslet.data.DataType.DATE) {
				return null;
			}
			var displayFmt = this.displayFormat().toUpperCase();
			for(var i = 0, c, len = displayFmt.length; i < len; i++){
				c = displayFmt.charAt(i);
				if ('YMD'.indexOf(c) < 0){
					Z._dateChar = c;
					return c;
				}
			}
		},
		
		dateRegular: function(){
			var Z = this;
			if (Z._dateRegular) {
				return Z._dateRegular;
			}
			var dateFmt = this.dateFormat(),
				dateSeparator = this.dateSeparator(),
				result = ['^'];
			for(var i = 0, c; i < dateFmt.length; i++){
				if (i > 0){
					result.push('\\');
					result.push(dateSeparator);
				}
				c = dateFmt.charAt(i);
				if (c == 'Y') {
					result.push('(\\d{4}|\\d{2})');
				} else if (c == 'M'){
					result.push('(0?[1-9]|1[012])');
				} else {
					result.push('(0?[1-9]|[12][0-9]|3[01])');
				}
			}
			result.push('(\\s+\\d{2}:\\d{2}:\\d{2}(\\.\\d{3}){0,1}){0,1}');
			result.push('$');
			Z._dateRegular = {expr: new RegExp(result.join(''), 'gim'), message: jslet.locale.Dataset.invalidDate};
			return Z._dateRegular;
		},
		
		/**
		 * Get or set field formula. Example: 
		 * <pre><code>
		 *  fldObj.formula('[price]*[num]');
		 * </code></pre>
		 * 
		 * @param {String or undefined} formula Field formula.
		 * @return {String or this}
		 */
		formula: function (formula) {
			var Z = this;
			if (formula === undefined) {
				return Z._formula;
			}
			
			jslet.Checker.test('Field.formula', formula).isString();
			Z._formula = jQuery.trim(formula);
			Z._clearFieldCache();
			var dataset = Z.dataset(); 
			if (dataset) {
				dataset.removeInnerFormulaField(Z._fieldName);
				dataset.addInnerFormulaField(Z._fieldName, Z._formula);		
				Z._fireColumnUpdatedEvent();
			}
			Z._fireGlobalMetaChangedEvent('formula');
			return this;
		},
	
		/**
		 * Get or set field is visible or not.
		 * 
		 * @param {Boolean or undefined} visible Field is visible or not.
		 * @return {Boolean or this}
		 */
		visible: function (visible) {
			var Z = this;
			if (visible === undefined){
				if (Z._visible){
					var p = this.parent();
					while(p){
						if (!p.visible()) { //if parent is invisible
							return false;
						}
						p = p.parent();
					}
				}
				return Z._visible;
			}
			Z._visible = visible ? true: false;
			Z._fireMetaChangedEvent('visible');
			Z._fireGlobalMetaChangedEvent('visible');
			return this;
		},
	
		/**
		 * Get or set field is disabled or not.
		 * 
		 * @param {Boolean or undefined} disabled Field is disabled or not.
		 * @return {Boolean or this}
		 */
		disabled: function (disabled) {
			var Z = this;
			if (disabled === undefined) {
				return Z._disabled;
			}
			Z._disabled = disabled ? true: false;
			Z._fireMetaChangedEvent('disabled');
			Z._fireGlobalMetaChangedEvent('disabled');
			return this;
		},
	
		/**
		 * Get or set field is readOnly or not.
		 * 
		 * @param {Boolean or undefined} readOnly Field is readOnly or not.
		 * @return {Boolean or this}
		 */
		readOnly: function (readOnly) {
			var Z = this;
			if (readOnly === undefined){
				if (Z._dataType == jslet.data.DataType.DATASET) {
					return true;
				}
				var children = Z.children();
				if (children && children.length === 0) {
					return true;
				}
	
				return Z._readOnly || Z._dataset.readOnly();
			}
			
			Z._readOnly = readOnly? true: false;
			Z._fireMetaChangedEvent('readOnly');
			Z._fireGlobalMetaChangedEvent('readOnly');
			return this;
		},
		
		fieldReadOnly: function() {
			var Z = this;
			if (Z._dataType == jslet.data.DataType.DATASET) {
				return true;
			}
			var children = Z.children();
			if (children && children.length === 0) {
				return true;
			}
	
			return Z._readOnly;
		},
		
		fieldDisabled: function() {
			return this._disabled;
		},
		
		_fireGlobalMetaChangedEvent: function(metaName) {
			var ds = this.dataset();
			if (ds && ds.designMode()) {
				var handler = jslet.data.globalDataHandler.fieldMetaChanged();
				if(handler) {
					handler.call(this, ds, this._fieldName, metaName)
				}
			}
		},
		
		_fireMetaChangedEvent: function(metaName, changeAllRows) {
			var ds = this.dataset();
			if (ds) {
				var evt = jslet.data.RefreshEvent.changeMetaEvent(metaName, this._fieldName, changeAllRows);
				ds.refreshControl(evt);
			}
		},
		
		_fireColumnUpdatedEvent: function() {
			var ds = this.dataset();
			if (ds) {
				var evt = jslet.data.RefreshEvent.updateColumnEvent(this._fieldName);
				ds.refreshControl(evt);
			}
		},
		
		/**
		 * Get or set if field participates unit converting.
		 * 
		 * @param {Boolean or undefined} unitConverted .
		 * @return {Boolean or this}
		 */
		unitConverted: function (unitConverted) {
			var Z = this;
			if (unitConverted === undefined) {
				return Z._dataType == jslet.data.DataType.NUMBER? Z._unitConverted:false;
			}
			Z._unitConverted = unitConverted ? true : false;
			var ds = this.dataset();
			Z._clearFieldCache();		
			if (Z._dataType == jslet.data.DataType.NUMBER && ds && ds.unitConvertFactor() != 1) {
				Z._fireColumnUpdatedEvent();
			}
			Z._fireGlobalMetaChangedEvent('unitConverted');
			return this;
		},
	
		/**
		 * Get or set value style of this field. Optional value: 0 - Normal, 1 - Between style, 2 - Multiple value
		 * 
		 * @param {Integer or undefined} mvalueStyle.
		 * @return {Integer or this}
		 */
		valueStyle: function (mvalueStyle) {
			var Z = this;
			if (mvalueStyle === undefined) {
				if(Z._dataType == jslet.data.DataType.DATASET ||  
						Z._children && Z._children.length > 0) 
					return jslet.data.FieldValueStyle.NORMAL;
				
				return Z._valueStyle;
			}
	
			if(mvalueStyle) {
				mvalueStyle = parseInt(mvalueStyle);
			} else {
				mvalueStyle = 0;
			}
			jslet.Checker.test('Field.valueStyle', mvalueStyle).isNumber().inArray([0,1,2]);
			Z._valueStyle = mvalueStyle;
			Z._clearFieldCache();		
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('valueStyle');
			return this;
		},
	
		/**
		 * Get or set allowed count when valueStyle is multiple.
		 * 
		 * @param {String or undefined} count.
		 * @return {String or this}
		 */
		valueCountLimit: function (count) {
			var Z = this;
			if (count === undefined) {
				return Z._valueCountLimit;
			}
			if(count) {
				jslet.Checker.test('Field.valueCountLimit', count).isNumber();
			} else {
				count = 0;
			}
			Z._valueCountLimit = parseInt(count);
			Z._fireGlobalMetaChangedEvent('valueCountLimit');
			return this;
		},
	
		/**
		 * Get or set field display control. It is similar as DBControl configuration.
		 * Here you need not set 'dataset' and 'field' property.   
		 * Example:
		 * <pre><code>
		 * //Normal DBControl configuration
		 * //var normalCtrlCfg = {type:"DBSpinEdit",dataset:"employee",field:"age",minValue:10,maxValue:100,step:5};
		 * 
		 * var displayCtrlCfg = {type:"DBSpinEdit",minValue:10,maxValue:100,step:5};
		 * fldObj.displayControl(displayCtrlCfg);
		 * </code></pre>
		 * 
		 * @param {DBControl Config or String} dispCtrl If String, it will convert to DBControl Config.
		 * @return {DBControl Config or this}
		 */
		displayControl: function (dispCtrl) {
			var Z = this;
			if (dispCtrl === undefined){
				if (Z._dataType == jslet.data.DataType.BOOLEAN && !Z._displayControl) {
					return {
						type: 'dbcheckbox'
					};
				}
				return Z._displayControl;
			}
			 
			Z._displayControl = (typeof (Z._fieldName) == 'string') ? { type: dispCtrl } : dispCtrl;
			Z._fireGlobalMetaChangedEvent('displayControl');
			return this;
		},
	
		/**
		 * Get or set field edit control. It is similar as DBControl configuration.
		 * Here you need not set 'dataset' and 'field' property.   
		 * Example:
		 * <pre><code>
		 * //Normal DBControl configuration
		 * //var normalCtrlCfg = {type:"DBSpinEdit",dataset:"employee",field:"age",minValue:10,maxValue:100,step:5};
		 * 
		 * var editCtrlCfg = {type:"DBSpinEdit",minValue:10,maxValue:100,step:5};
		 * fldObj.displayControl(editCtrlCfg);
		 * </code></pre>
		 * 
		 * @param {DBControl Config or String} editCtrl If String, it will convert to DBControl Config.
		 * @return {DBControl Config or this}
		 */
		editControl: function (editCtrl) {
			var Z = this;
			if (editCtrl=== undefined){
				if (Z._editControl) {
					return Z._editControl;
				}
	
				if (Z._dataType == jslet.data.DataType.BOOLEAN) {
					return {type: 'dbcheckbox'};
				}
				if (Z._dataType == jslet.data.DataType.DATE) {
					return {type: 'dbdatepicker'};
				}
				
				return (Z._lookup !== null)? {type: 'dbselect'}:{type: 'dbtext'};
			}
			if(typeof (editCtrl) === 'string') {
				editCtrl = jQuery.trim(editCtrl);
				if(editCtrl) {
					if(editCtrl.indexOf(':') > 0) {
						editCtrl = jslet.JSON.parse(editCtrl);
					} else {
						editCtrl =  {type: editCtrl};
					}
				} else {
					editCtrl = null;
				}
			}
			Z._editControl = editCtrl;
			Z._fireMetaChangedEvent('editControl');
			Z._fireGlobalMetaChangedEvent('editControl');
			return this;
		},
	
		/**
		 * {Event} Get customized field text.
		 * Pattern: function(fieldName, value){}
		 *   //fieldName: String, field name;
		 *   //value: Object, field value, the value type depends on field type;
		 *   //return: String, field text;
		 */
		onCustomFormatFieldText: null, // (fieldName, value)
	
		_addRelation: function() {
			var Z = this,
				lkDsName;
			if(!Z._dataset || (Z.getType() != jslet.data.DataType.DATASET && !Z._lookup)) {
				return;
			}
			
			var hostDs = Z._dataset.name(),
				hostField = Z._fieldName,
				relationType;
			if(Z.getType() == jslet.data.DataType.DATASET) {
				if(Z._subDataset) {
					lkDsName = Z._getDatasetName(Z._subDataset);
					relationType = jslet.data.DatasetType.DETAIL;
					jslet.data.datasetRelationManager.addRelation(hostDs, hostField, lkDsName, relationType);
				}
			} else {
				lkDsName = Z._getDatasetName(Z._lookup._dataset);
				relationType = jslet.data.DatasetType.LOOKUP;
				jslet.data.datasetRelationManager.addRelation(hostDs, hostField, lkDsName, relationType);
			}
		},
		
		_removeRelation: function() {
			var Z = this;
			if(!Z._dataset || (!Z._subDataset && !Z._lookup)) {
				return;
			}
			var hostDs = Z._dataset.name(),
				hostField = Z._fieldName,
				relationType;
	
			if(Z._subDataset) {
				lkDsName = Z._getDatasetName(Z._subDataset);
			} else {
				lkDsName = Z._getDatasetName(Z._lookup._dataset);
			}
			jslet.data.datasetRelationManager.removeRelation(hostDs, hostField, lkDsName);
		},
			
		/**
		 * Get or set lookup field object
		 * 
		 * @param {jslet.data.FieldLookup or undefined} lkFld lookup field Object.
		 * @return {jslet.data.FieldLookup or this}
		 */
		lookup: function (lkFldObj) {
			var Z = this;
			if (lkFldObj === undefined){
				return Z._lookup;
			}
			jslet.Checker.test('Field.lookup', lkFldObj).isClass(jslet.data.FieldLookup.className);		
			Z._removeRelation();
			
			Z._lookup = lkFldObj;
			if(lkFldObj) {
				lkFldObj.hostField(Z);
				Z._addRelation();
			}
			Z._clearFieldCache();		
			Z._fireColumnUpdatedEvent();
			return this;
		},
		
		_getDatasetName: function(dsObjOrName) {
			return jslet.isString(dsObjOrName)? dsObjOrName: dsObjOrName.name();
		},
		
		_subDsParsed: false,
		
		/**
		 * Set or get sub dataset.
		 * 
		 * @param {jslet.data.Dataset or undefined} subdataset
		 * @return {jslet.data.Dataset or this}
		 */
		subDataset: function (subdataset) {
			var Z = this;
			if (subdataset === undefined) {
				if(!Z._subDsParsed && Z._subDataset) {
					Z.subDataset(Z._subDataset);
					if(!Z._subDsParsed) {
						throw new Error(jslet.formatString(jslet.locale.Dataset.datasetNotFound, [Z._subDataset]));
					}			
				}
				return Z._subDataset;
			}
			
			var oldSubDsName = Z._getDatasetName(Z._subDataset),
			 	newSubDsName = Z._getDatasetName(subdataset),
			 	needProcessRelation = (oldSubDsName != newSubDsName);
			var subDsObj = subdataset;
			if (jslet.isString(subDsObj)) {
				subDsObj = jslet.data.getDataset(subDsObj);
				if(!subDsObj && jslet.data.onCreatingDataset) {
					jslet.data.onCreatingDataset(subdataset, jslet.data.DatasetType.DETAIL, null, Z._dsName); //1 - sub dataset
				}
			}
			if(needProcessRelation) {
				Z._removeRelation();
			}
			if(subDsObj) {
				jslet.Checker.test('Field.subDataset', subDsObj).isClass(jslet.data.Dataset.className);		
				if (Z._subDataset && Z._subDataset.datasetField) {
					Z._subDataset.datasetField(null);
				}
				Z._subDataset = subDsObj;
				Z._subDsParsed = true;
			} else {
				Z._subDataset = subdataset;
				Z._subDsParsed = false;
			}
			if(needProcessRelation) {
				Z._addRelation();
			}
			return this;
		},
	
		urlExpr: function (urlExpr) {
			var Z = this;
			if (urlExpr === undefined) {
				return Z._urlExpr;
			}
	
			jslet.Checker.test('Field.urlExpr', urlExpr).isString();
			Z._urlExpr = jQuery.trim(urlExpr);
			Z._innerUrlExpr = null;
			Z._clearFieldCache();		
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('urlExpr');
			return this;
		},
	
		urlTarget: function (target) {
			var Z = this;
			if (target === undefined){
				return !Z._urlTarget ? jslet.data.Field.URLTARGETBLANK : Z._urlTarget;
			}
	
			jslet.Checker.test('Field.urlTarget', target).isString();
			Z._urlTarget = jQuery.trim(target);
			Z._clearFieldCache();
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('urlTarget');
			return this;
		},
	
		calcUrl: function () {
			var Z = this;
			if (!this.dataset() || !Z._urlExpr) {
				return null;
			}
			if (!Z._innerUrlExpr) {
				Z._innerUrlExpr = new jslet.Expression(this.dataset(), Z._urlExpr);
			}
			return Z._innerUrlExpr.eval();
		},
	
		/**
		 * Get or set if field need be anti-xss.
		 * If true, field value will be encoded.
		 * 
		 * @param {Boolean or undefined} isXss.
		 * @return {Boolean or this}
		 */
		antiXss: function(isXss){
			var Z = this;
			if (isXss === undefined) {
				return Z._antiXss;
			}
			Z._antiXss = isXss ? true: false;
			Z._fireGlobalMetaChangedEvent('antiXss');
			return this;
		},
	
		/**
		 * Get or set field rang.
		 * Range is an object as: {min: x, max: y}. Example:
		 * <pre><code>
		 *	//For String field
		 *	var range = {min: 'a', max: 'z'};
		 *  //For Date field
		 *	var range = {min: new Date(2000,1,1), max: new Date(2010,12,31)};
		 *  //For Number field
		 *	var range = {min: 0, max: 100};
		 *  fldObj.dataRange(range);
		 * </code></pre>
		 * 
		 * @param {Range or Json String} range Field range;
		 * @return {Range or this}
		 */
		dataRange: function (range) {
			var Z = this;
			if (range === undefined) {
				return Z._dataRange;
			}
			if(range && jslet.isString(range)) {
				range = jslet.JSON.parse(range);
			}
			if(range) {
				jslet.Checker.test('Field.dataRange', range).isObject();
				if(range.min) {
					jslet.Checker.test('Field.dataRange.min', range.min).isDataType(Z._dateType);
				}
				if(range.max) {
					jslet.Checker.test('Field.dataRange.max', range.max).isDataType(Z._dateType);
				}
			}
			Z._dataRange = range;
			Z._fireGlobalMetaChangedEvent('dataRange');
			return this;
		},
	
		/**
		 * Get or set regular expression.
		 * You can specify your own validator with regular expression. If regular expression not specified, 
		 * The default regular expression for Date and Number field will be used. Example:
		 * <pre><code>
		 *	fldObj.regularExpr(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{8}/ig, 'Invalid phone number!');//like: 0755-12345678
		 * </code></pre>
		 * 
		 * @param {String} expr Regular expression;
		 * @param {String} message Message for invalid.
		 * @return {Object} An object like: { expr: expr, message: message }
		 */
		regularExpr: function (expr, message) {
			var Z = this;
			var argLen = arguments.length;
			if (argLen === 0){
				return Z._regularExpr;
			}
			
			if (argLen == 1) {
				Z._regularExpr = expr;
			} else {
				Z._regularExpr = { expr: expr, message: message };
			}
			Z._fireGlobalMetaChangedEvent('regularExpr');
			return this;
		},
		
		
		/**
		 * Get or set customized field value converter.
		 * 
		 * @param {jslet.data.FieldValueConverter} converter converter object, sub class of jslet.data.FieldValueConverter.
		 */
		customValueConverter: function (converter) {
			var Z = this;
			if (converter === undefined) {
				return Z._customValueConverter;
			}
			Z._customValueConverter = converter;
			Z._clearFieldCache();
			Z._fireColumnUpdatedEvent();
			Z._fireGlobalMetaChangedEvent('customValueConverter');
			return this;
		},
	
		/**
		 * Get or set customized validator.
		 * 
		 * @param {Function} validator Validator function.
		 * Pattern:
		 *   function(fieldObj, fldValue){}
		 *   //fieldObj: jslet.data.Field, Field object
		 *   //fldValue: Object, Field value
		 *   //return: String, if validate failed, return error message, otherwise return null; 
		 */
		customValidator: function (validator) {
			var Z = this;
			if (validator === undefined) {
				return Z._customValidator;
			}
			if(validator) {
				jslet.Checker.test('Field.customValidator', validator).isFunction();
			}
			Z._customValidator = validator;
			Z._fireGlobalMetaChangedEvent('customValidator');
			return this;
		},
		
		/**
		 * Valid characters for this field.
		 */
		validChars: function(chars){
			var Z = this;
			if (chars === undefined){
				if (Z._validChars) {
					return Z._validChars;
				}
				if (Z._dataType == jslet.data.DataType.NUMBER){
					return Z._scale ? '+-0123456789.' : '+-0123456789';
				}
				if (Z._dataType == jslet.data.DataType.DATE){
					var displayFormat = Z.displayFormat();
					var chars = '0123456789';
					for(var i = 0, len = displayFormat.length; i < len; i++) {
						var c = displayFormat.charAt(i);
						if(c === 'y' || c === 'M' || c === 'd' || c === 'h' || c === 'm' || c === 's') {
							continue;
						}
						chars += c;
					}
					return chars;
				}
				return null;
			}
			
			Z._validChars = chars;
			Z._fireGlobalMetaChangedEvent('validChars');
			return this;
		},
		
		/**
		 * Use for Boolean field, actual value for 'true'
		 */
		trueValue: function(value) {
			var Z = this;
			if (value === undefined) {
				return Z._trueValue;
			}
			Z._trueValue = value;
			return this;		
		},
		
		/**
		 * Use for Boolean field, actual value for 'false'
		 */
		falseValue: function(value) {
			var Z = this;
			if (value === undefined) {
				return Z._falseValue;
			}
			Z._falseValue = value;
			return this;		
		},
		
		/**
		 * Use for Boolean field, display text for 'true'
		 */
		trueText: function(trueText) {
			var Z = this;
			if (trueText === undefined) {
				return Z._trueText || jslet.locale.Dataset.trueText;
			}
			Z._trueText = trueText;
			return this;		
		},
		
		/**
		 * Use for Boolean field, display text for 'false'
		 */
		falseText: function(falseText) {
			var Z = this;
			if (falseText === undefined) {
				return Z._falseText || jslet.locale.Dataset.falseText;
			}
			Z._falseText = falseText;
			return this;		
		},
		
		/**
		 * Get or set if the same field value will be merged.
		 * 
		 * @param {Boolean or undefined} mergeSame.
		 * @return {Boolean or this}
		 */
		mergeSame: function(mergeSame){
			var Z = this;
			if (mergeSame === undefined) {
				return Z._mergeSame;
			}
			Z._mergeSame = mergeSame ? true: false;
			Z._fireGlobalMetaChangedEvent('mergeSame');
			return this;
		},
	
		/**
		 * Get or set the field names to "mergeSame".
		 * Multiple field names are separated by ','.
		 * 
		 * @param {String or undefined} mergeSameBy.
		 * @return {String or this}
		 */
		mergeSameBy: function(mergeSameBy){
			var Z = this;
			if (mergeSameBy === undefined) {
				return Z._mergeSameBy;
			}
			jslet.Checker.test('Field.mergeSameBy', mergeSameBy).isString();
			Z._mergeSameBy = jQuery.trim(mergeSameBy);
			Z._fireGlobalMetaChangedEvent('mergeSameBy');
			return this;
		},
		
		/**
		 * Get or set if the field is following the value which append before.
		 * 
		 * @param {Boolean or undefined} valueFollow true - the default value is same as the value which appended before, false -otherwise.
		 * @return {Boolean or this}
		 */
		valueFollow: function(valueFollow) {
			var Z = this;
			if(valueFollow === undefined) {
				return Z._valueFollow;
			}
			Z._valueFollow = valueFollow? true: false;
			if(!Z._valueFollow && Z._dataset) {
				Z._dataset._followedValue = null;
			}
			Z._fireGlobalMetaChangedEvent('valueFollow');
			return this;
		},
	
		/**
		 * Get or set the type of aggraded value.
		 * 
		 * @param {String or undefined} aggraded optional value is: count,sum,avg.
		 * @return {String or this}
		 */
		aggraded: function (aggraded) {
			var Z = this;
			if (aggraded === undefined){
				return Z._aggraded;
			}
			
			Z._aggraded = aggraded? true: false;
			Z._fireGlobalMetaChangedEvent('aggraded');
			return this;
		},
	
		/**
		 * Get or set the field names to aggrade field value. 
		 * Multiple field names are separated by ','.
		 * 
		 * 
		 * @param {String or undefined} aggrBy.
		 * @return {String or this}
		 */
		aggradedBy: function(aggradedBy){
			var Z = this;
			if (aggradedBy === undefined) {
				return Z._aggradedBy;
			}
			jslet.Checker.test('Field.aggradedBy', aggradedBy).isString();
			Z._aggradedBy = jQuery.trim(aggradedBy);
			Z._fireGlobalMetaChangedEvent('aggradedBy');
			return this;
		},
	
		crossSource: function(crossSource) {
			var Z = this;
			if(crossSource === undefined) {
				return Z._crossSource;
			}
			jslet.Checker.test('Field.crossSource', crossSource).isClass(jslet.data.CrossFieldSource.className);
			Z._crossSource = crossSource;
			return this;
		},
		
		/**
		 * Get or set fixed field value, if field value not specified, fixed field value used.
		 * 
		 * @param {String or undefined} fixedValue.
		 * @return {String or this}
		 */
		fixedValue: function(fixedValue){
			var Z = this;
			if (fixedValue === undefined) {
				return Z._fixedValue;
			}
			jslet.Checker.test('Field.fixedValue', fixedValue).isString();
			Z._fixedValue = jQuery.trim(fixedValue);
			Z._fireGlobalMetaChangedEvent('fixedValue');
			return this;
		},
		
		getValue: function(valueIndex) {
			return this._dataset.getFieldValue(this._fieldName, valueIndex);
		},
		
		setValue: function(value, valueIndex) {
			this._dataset.setFieldValue(this._fieldName, value, valueIndex);
		},
	
		getTextValue: function(isEditing, valueIndex) {
			return this._dataset.getFieldText(this._fieldName, isEditing, valueIndex);
		},
		
		setTextValue: function(value, valueIndex) {
			this._dataset.setFieldText(this._fieldName, inputText, valueIndex);
		},
		
		clone: function(fldName, newDataset){
			var Z = this;
			jslet.Checker.test('Field.clone#fldName', fldName).required().isString();
			var result = new jslet.data.Field(fldName, Z._dataType);
			result.dataset(newDataset ? newDataset : this.dataset());
			result.length(Z._length);
			result.scale(Z._scale);
			result.alignment(Z._alignment);
			result.defaultExpr(Z._defaultExpr);
			result.defaultValue(Z._defaultValue);
			result.label(Z._label);
			result.tip(Z._tip);
			result.displayWidth(Z._displayWidth);
			if (Z._editMask) {
				result.editMask(Z._editMask.clone());
			}
			result.displayOrder(Z._displayOrder);
			result.tabIndex(Z._tabIndex);
			result.displayFormat(Z._displayFormat);
			result.dateFormat(Z._dateFormat);
			result.formula(Z._formula);
			result.unique(Z._unique);
			result.required(Z._required);
			result.readOnly(Z._readOnly);
			result.visible(Z._visible);
			result.disabled(Z._disabled);
			result.unitConverted(Z._underted);
			if (Z._lookup) {
				result.lookup(Z._lookup.clone());
			}
			
			result.displayControl(Z._displayControl);
			result.editControl(Z._editControl);
			result.urlExpr(Z._urlExpr);
			result.urlTarget(Z._urlTarget);
			result.valueStyle(Z._valueStyle);
			result.valueCountLimit(Z._valueCountLimit);
			result.nullText(Z._nullText);
			result.dataRange(Z._dataRange);
			if (Z._regularExpr) {
				result.regularExpr(Z._regularExpr);
			}
			result.antiXss(Z._antiXss);
			result.customValidator(Z._customValidator);
			result.customValueConverter(Z._customValueConverter);
			result.validChars(Z._validChars);
			if (Z._parent) {
				result.parent(Z._parent.clone(newDataset));
			}
			if (Z._children && Z._children.length > 0){
				var childFlds = [];
				for(var i = 0, cnt = Z._children.length; i < cnt; i++){
					childFlds.push(Z._children[i].clone(newDataset));
				}
				result.children(childFlds);
			}
			
			result.mergeSame(Z._mergeSame);
			result.mergeSameBy(Z._mergeSameBy);
			result.fixedValue(Z._fixedValue);
			
			result.valueFollow(Z._valueFollow);
			result.aggraded(Z._aggraded);
			result.aggradedBy(Z._aggradedBy);
	
			result.trueValue(Z._trueValue);
			result.falseValue(Z._falseValue);
			result.trueText(Z._trueText);
			result.falseText(Z._falseText);
	
			return result;
		},
		
		_clearFieldCache: function() {
			var Z = this;
			if(Z._dataset && Z._fieldName) {
				jslet.data.FieldValueCache.clearAll(Z._dataset, Z._fieldName);
			}
		}
		
	};
	
	jslet.data.Field.URLTARGETBLANK = '_blank';
	
	/**
	 * Create field object. Example:
	 * <pre><code>
	 * var fldObj = jslet.data.createField({name:'field1', type:'N', label: 'field1 label'});
	 * </code></pre>
	 * 
	 * @param {Json Object} fieldConfig A json object which property names are same as jslet.data.Field. Example: {name: 'xx', type: 'N', ...}
	 * @param {jslet.data.Field} parent Parent field object.
	 * @return {jslet.data.Field}
	 */
	jslet.data.createField = function (fieldConfig, parent) {
		jslet.Checker.test('createField#fieldConfig', fieldConfig).required().isObject();
		var cfg = fieldConfig;
		if (!cfg.name) {
			throw new Error('Property: name required!');
		}
		var dtype = cfg.type;
		if (dtype === null) {
			dtype = jslet.data.DataType.STRING;
		} else {
			dtype = dtype.toUpperCase();
			if (dtype != jslet.data.DataType.STRING && 
					dtype != jslet.data.DataType.NUMBER && 
					dtype != jslet.data.DataType.DATE && 
					dtype != jslet.data.DataType.BOOLEAN && 
					dtype != jslet.data.DataType.CROSS && 
					dtype != jslet.data.DataType.DATASET)
			dtype = jslet.data.DataType.STRING;
		}
	
		var fldObj = new jslet.data.Field(cfg.shortName || cfg.name, dtype);
	
		if(fieldConfig.dsName) {
			fldObj._dsName = fieldConfig.dsName;
		}
		function setPropValue(propName) {
			var propValue = cfg[propName];
	//		if(propValue === undefined) {
	//			propValue = cfg[propName.toLowerCase()];
	//		}
			if (propValue !== undefined) {
				fldObj[propName](propValue);
			}
		}
		
		fldObj.parent(parent);
		if(parent) {
			fldObj.dataset(parent.dataset());
		}
		if(cfg.crossSource) {
	 		var crossSrc = jslet.data.createCrossFieldSource(cfg.crossSource);
	 		fldObj.crossSource(crossSrc);
		}
		setPropValue('tabIndex');
		setPropValue('displayOrder');
		setPropValue('label');
		setPropValue('tip');
	
		if (dtype == jslet.data.DataType.DATASET){
			var subds = cfg.subDataset || cfg.subdataset;
			if (subds) {
				fldObj.subDataset(subds);
			} else {
				throw new Error('subDataset NOT set when field data type is Dataset');
			}
			fldObj.visible(false);
			return fldObj;
		}
		
		setPropValue('visible');
	
		setPropValue('unique');
		setPropValue('required');
		setPropValue('readOnly');
		setPropValue('disabled');
		setPropValue('length');
		setPropValue('scale');
		setPropValue('alignment');
		setPropValue('formula');
		setPropValue('defaultExpr');
		setPropValue('defaultValue');
		setPropValue('displayWidth');
		setPropValue('editMask');
		setPropValue('displayFormat');
		setPropValue('nullText');
		setPropValue('unitConverted');
		setPropValue('editControl');
		setPropValue('urlExpr');
		setPropValue('urlTarget');
		setPropValue('valueStyle');
		
		setPropValue('valueCountLimit');
		setPropValue('dataRange');
		setPropValue('customValidator');
		setPropValue('customValueConverter');
		setPropValue('trueValue');
		setPropValue('falseValue');
		setPropValue('mergeSame');
		setPropValue('mergeSameBy');
		setPropValue('aggraded');
	
		setPropValue('valueFollow');
		setPropValue('aggradedBy');
		setPropValue('mergeSameBy');
		setPropValue('fixedValue');
		setPropValue('antiXss');
		setPropValue('validChars');
		
		setPropValue('trueValue');
		setPropValue('falseValue');
		setPropValue('trueText');
		setPropValue('falseText');
	
		var regularExpr = cfg.regularExpr;
		var regularMessage = cfg.regularMessage;
		if(regularExpr) {
			fldObj.regularExpr(regularExpr, regularMessage);
		}
		
		var lkfCfg = cfg.lookup;
		if(lkfCfg === undefined) {
			var lkDataset = cfg.lookupSource || cfg.lookupsource || cfg.lookupDataset || cfg.lookupdataset;
				lkParam = cfg.lookupParam || cfg.lookupparam,
				realDataset = cfg.realSource || cfg.realsource || cfg.realDataset || cfg.realdataset;
			if(lkDataset) {
				if(lkParam) {
					if (jslet.isString(lkParam)) {
						lkfCfg = jslet.JSON.parse(lkParam);
					} else {
						lkfCfg = lkParam;
					}
				} else {
					lkfCfg = {};
				}
				lkfCfg.dataset = lkDataset;
				if(realDataset) {
					lkfCfg.realDataset = realDataset;
				}
			}
		}
		if (lkfCfg !== undefined && lkfCfg) {
			if (jslet.isString(lkfCfg)) {
				lkfCfg = lkfCfg.trim();
				if(lkfCfg) {
					if(lkfCfg.trim().startsWith('{')) {
						lkfCfg = jslet.JSON.parse(lkfCfg);
					} else {
						lkfCfg = {dataset: lkfCfg};
					}
				}
			}
			fldObj.lookup(jslet.data.createFieldLookup(lkfCfg, fldObj._dsName));
		}
		if (cfg.children){
			var fldChildren = [], 
				childFldObj;
			for(var i = 0, cnt = cfg.children.length; i < cnt; i++){
				childFldObj = jslet.data.createField(cfg.children[i], fldObj);
				childFldObj.displayOrder(i);
				fldChildren.push(childFldObj);
			}
			fldObj.children(fldChildren);
			fldObj.alignment('center');
		}
		
		return fldObj;
	};
	
	/**
	 * Create string field object.
	 * 
	 * @param {String} fldName Field name.
	 * @param {Integer} length Field length.
	 * @param {jslet.data.Field} parent (Optional)Parent field object.
	 * @return {jslet.data.Field}
	 */
	jslet.data.createStringField = function(fldName, length, parent) {
		var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.STRING, parent);
		fldObj.length(length);
		return fldObj;
	};
	
	/**
	 * Create number field object.
	 * 
	 * @param {String} fldName Field name.
	 * @param {Integer} length Field length.
	 * @param {Integer} scale Field scale.
	 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
	 * @return {jslet.data.Field}
	 */
	jslet.data.createNumberField = function(fldName, length, scale, parent) {
		var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.NUMBER, parent);
		fldObj.length(length);
		fldObj.scale(scale);
		return fldObj;
	};
	
	/**
	 * Create boolean field object.
	 * 
	 * @param {String} fldName Field name.
	 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
	 * @return {jslet.data.Field}
	 */
	jslet.data.createBooleanField = function(fldName, parent) {
		return new jslet.data.Field(fldName, jslet.data.DataType.BOOLEAN, parent);
	};
	
	/**
	 * Create date field object.
	 * 
	 * @param {String} fldName Field name.
	 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
	 * @return {jslet.data.Field}
	 */
	jslet.data.createDateField = function(fldName, parent) {
		var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.DATE, parent);
		return fldObj;
	};
	
	/**
	 * Create dataset field object.
	 * 
	 * @param {String} fldName Field name.
	 * @param {jslet.data.Dataset} subDataset Detail dataset object.
	 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
	 * @return {jslet.data.Field}
	 */
	jslet.data.createDatasetField = function(fldName, subDataset, parent) {
		if (!subDataset) {
			throw new Error('expected property:dataset in DatasetField!');
		}
		var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.DATASET, parent);
		fldObj.subDataset(subDataset);
		fldObj.visible(false);
		return fldObj;
	};
	
	/**
	 * Create group field object.
	 * 
	 * @param {String} fldName Field name.
	 * @param {String} fldName Field label.
	 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
	 * @return {jslet.data.Field}
	 */
	//jslet.data.createGroupField = function(fldName, label, parent) {
	//	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.GROUP, parent);
	//	fldObj.label(label);
	//	return fldObj;
	//};
	
	jslet.data.createCrossField = function(fldName, crossSource, parent) {
		var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.CROSS, parent);
		fldObj.crossSource(crossSource);
	};
	
	/**
	 * @class FieldLookup
	 * 
	 * A lookup field represents a field value is from another dataset named "Lookup Dataset";
	 */
	jslet.data.FieldLookup = function() {
		var Z = this;
		Z._hostDatasetName = null;
		Z._hostField = null;//The field which contains this lookup field object.
		Z._dataset = null;
		Z._realDataset = null;
		Z._dsParsed = false;
		Z._keyField = null;
		Z._codeField = null;
		Z._nameField = null;
		Z._codeFormat = null;
		Z._displayFields = null;
		Z._innerdisplayFields = null;
		Z._parentField = null;
		Z._onlyLeafLevel = true;
		Z._returnFieldMap = null;
		Z._editFilter = null;
		Z._editItemDisabled = false;
	};
	jslet.data.FieldLookup.className = 'jslet.data.FieldLookup';
	
	jslet.data.FieldLookup.prototype = {
		className: jslet.data.FieldLookup.className,
		
		clone: function(){
			var Z = this, 
				result = new jslet.data.FieldLookup();
			result.dataset(Z._dataset);
			result.keyField(Z._keyField);
			result.codeField(Z._codeField);
			result.nameField(Z._nameField);
			result.displayFields(Z._displayFields);
			result.parentField(Z._parentField);
			result.onlyLeafLevel(Z._onlyLeafLevel);
			result.returnFieldMap(Z._returnFieldMap);
			result.editFilter(Z._editFilter);
			result.editItemDisabled(Z._editItemDisabled);
			return result;
		},
		
		hostField: function(fldObj) {
			var Z = this;
			if (fldObj === undefined) {
				return Z._hostField;
			}
			jslet.Checker.test('FieldLookup.hostField', fldObj).isClass(jslet.data.Field.className);
			Z._hostField = fldObj;
			return this;
		},
		
		/**
		 * Get or set lookup dataset.
		 * 
		 * @param {jslet.data.Dataset or undefined} dataset Lookup dataset.
		 * @return {jslet.data.Dataset or this}
		 */
		dataset: function(lkdataset) {
			var Z = this;
			if (lkdataset === undefined) {
				if(!Z._dsParsed) {
					Z.dataset(Z._dataset);
					if(!Z._dsParsed) {
						throw new Error('Not found lookup dataset: ' + Z._dataset);
					}			}
				
				return Z._dataset;
			}
			var lkDsName;
			if(lkdataset) {
				if (typeof(lkdataset) == 'string') {
					lkDsName = lkdataset;
				} else {
					lkDsName = lkdataset.name();
				}
				if(lkDsName == Z._hostDatasetName) {
					throw new Error(jslet.locale.Dataset.LookupDatasetNotSameAsHost);
				}
			}
			var lkDsObj = lkdataset;
			if (typeof(lkDsObj) == 'string') {
				lkDsObj = jslet.data.getDataset(lkDsObj);
				if(!lkDsObj && jslet.data.onCreatingDataset) {
					jslet.data.onCreatingDataset(lkdataset, jslet.data.DatasetType.LOOKUP, Z._realDataset, Z._hostDatasetName); //1 - lookup dataset, 2 - subdataset
				}
			}
			if(lkDsObj) {
				Z._dataset = lkDsObj;
				Z._dsParsed = true;
			} else {
				Z._dataset = lkdataset;
				Z._dsParsed = false;
			}
			return this;
		},
	
		/**
		 * Get or set key field.
		 * Key field is optional, if it is null, it will use LookupDataset.keyField instead. 
		 * 
		 * @param {String or undefined} keyFldName Key field name.
		 * @return {String or this}
		 */
		realDataset: function(realDataset) {
			var Z = this;
			if (realDataset === undefined){
				return Z._realDataset;
			}
	
			jslet.Checker.test('FieldLookup.realDataset', realDataset).isString();
			Z._realDataset = realDataset;
			return this;
		},
		
		/**
		 * Get or set key field.
		 * Key field is optional, if it is null, it will use LookupDataset.keyField instead. 
		 * 
		 * @param {String or undefined} keyFldName Key field name.
		 * @return {String or this}
		 */
		keyField: function(keyFldName) {
			var Z = this;
			if (keyFldName === undefined){
				return Z._keyField || Z.dataset().keyField();
			}
	
			jslet.Checker.test('FieldLookup.keyField', keyFldName).isString();
			Z._keyField = jQuery.trim(keyFldName);
			return this;
		},
	
		/**
		 * Get or set code field.
		 * Code field is optional, if it is null, it will use LookupDataset.codeField instead. 
		 * 
		 * @param {String or undefined} codeFldName Code field name.
		 * @return {String or this}
		 */
		codeField: function(codeFldName) {
			var Z = this;
			if (codeFldName === undefined){
				return Z._codeField || Z.dataset().codeField();
			}
	
			jslet.Checker.test('FieldLookup.codeField', codeFldName).isString();
			Z._codeField = jQuery.trim(codeFldName);
			return this;
		},
		
		codeFormat: function(format) {
			var Z = this;
			if (format === undefined) {
				return Z._codeFormat;
			}
	
			jslet.Checker.test('FieldLookup.codeFormat', format).isString();
			Z._codeFormat = jQuery.trim(format);
			return this;
		},
	
		/**
		 * Get or set name field.
		 * Name field is optional, if it is null, it will use LookupDataset.nameField instead. 
		 * 
		 * @param {String or undefined} nameFldName Name field name.
		 * @return {String or this}
		 */
		nameField: function(nameFldName) {
			var Z = this;
			if (nameFldName === undefined){
				return Z._nameField || Z.dataset().nameField();
			}
	
			jslet.Checker.test('FieldLookup.nameField', nameFldName).isString();
			Z._nameField = jQuery.trim(nameFldName);
			return this;
		},
	
		/**
		 * Get or set parent field.
		 * Parent field is optional, if it is null, it will use LookupDataset.parentField instead. 
		 * 
		 * @param {String or undefined} parentFldName Parent field name.
		 * @return {String or this}
		 */
		parentField: function(parentFldName) {
			var Z = this;
			if (parentFldName === undefined){
				return Z._parentField || Z.dataset().parentField();
			}
	
			jslet.Checker.test('FieldLookup.parentField', parentFldName).isString();
			Z._parentField = jQuery.trim(parentFldName);
			return this;
		},
	
		/**
		 * An expression for display field value. Example:
		 * <pre><code>
		 * lookupFldObj.displayFields('[code]-[name]'); 
		 * </code></pre>
		 */
		displayFields: function(fieldExpr) {
			var Z = this;
			if (fieldExpr === undefined) {
				return Z._displayFields? Z._displayFields: this.getDefaultDisplayFields();
			}
			jslet.Checker.test('FieldLookup.displayFields', fieldExpr).isString();
			fieldExpr = jQuery.trim(fieldExpr);
			if (Z._displayFields != fieldExpr) {
				Z._displayFields = fieldExpr;
				Z._innerdisplayFields = null;
				if(Z._hostField) {
					Z._hostField._clearFieldCache();
				}
			}
			return this;
		},
		
		/**
		 * Return extra field values of lookup dataset into main dataset:
		 * <pre><code>
		 * lookupFldObj.returnFieldMap({"main dataset field name":"lookup dataset field name", ...}); 
		 * </code></pre>
		 */
		returnFieldMap: function(returnFieldMap) {
			if(returnFieldMap === undefined) {
				return this._returnFieldMap;
			}
			jslet.Checker.test('FieldLookup.returnFieldMap', returnFieldMap).isObject();
			this._returnFieldMap = returnFieldMap;
		},
		
		/**
		 * @private
		 */
		getDefaultDisplayFields: function() {
	//		var expr = '[',fldName = this.codeField();
	//		if (fldName) {
	//			expr += fldName + ']';
	//		}
	//		fldName = this.nameField();
	//
	//		if (fldName) {
	//			expr += '+"-"+[';
	//			expr += fldName + ']';
	//		}
	//		if (expr === '') {
	//			expr = '"Not set displayFields"';
	//		}
	//		
			var expr = '[' + this.nameField() + ']';
			return expr;
		},
	
		/**
		 * @private
		 */
		getCurrentDisplayValue: function() {
			var Z = this;
			if (Z._displayFields === null) {
				this.displayFields(this.getDefaultDisplayFields());
			}
			if(!Z._innerdisplayFields) {
				Z._innerdisplayFields = new jslet.Expression(Z.dataset(), Z.displayFields());
			}
			
			return Z._innerdisplayFields.eval();
		},
	
		/**
		 * Identify whether user can select leaf level item if lookup dataset is a tree-style dataset.
		 * 
		 * @param {Boolean or undefined} flag True - Only leaf level item user can selects, false - otherwise.
		 * @return {Boolean or this}
		 */
		onlyLeafLevel: function(flag) {
			var Z = this;
			if (flag === undefined) {
				return Z._onlyLeafLevel;
			}
			Z._onlyLeafLevel = flag ? true: false;
			return this;
		},
	
		/**
		 * An expression for display field value. Example:
		 * <pre><code>
		 * lookupFldObj.editFilter('like([code], "101%" '); 
		 * </code></pre>
		 * 
		 * @param {String or undefined} flag True - Only leaf level item user can selects, false - otherwise.
		 * @return {String or this}
		 */
		editFilter: function(editFilter) {
			var Z = this;
			if (editFilter === undefined) {
				return Z._editFilter;
			}
			jslet.Checker.test('FieldLookup.editFilter', editFilter).isString();
			
			if (Z._editFilter != editFilter) {
				Z._editFilter = editFilter;
			}
			return this;
		},
		
		/**
		 * Disable or hide the edit item which not match the 'editFilter'.
		 * editItemDisabled is true, the non-matched item will be disabled, not hidden.
		 * 
		 * @param {Boolean or undefined} editItemDisabled - true: disable edit item, false: hide edit item, default is true.
		 * @return {Boolean or this}
		 */
		editItemDisabled: function(editItemDisabled) {
			var Z = this;
			if (editItemDisabled === undefined) {
				return Z._editItemDisabled;
			}
			
			Z._editItemDisabled = editItemDisabled? true: false;
			return this;
		}
		
	};
	
	/**
	 * Create lookup field object.
	 * 
	 * @param {Json Object} param A json object which property names are same as jslet.data.FieldLookup. Example: {dataset: fooDataset, keyField: 'xxx', ...}
	 * @return {jslet.data.FieldLookup}
	 */
	jslet.data.createFieldLookup = function(param, hostDsName) {
		jslet.Checker.test('createFieldLookup#param', param).required().isObject();
		var lkds = param.dataset;
		if (!lkds) {
			throw new Error('Property: dataset required!');
		}
		var lkFldObj = new jslet.data.FieldLookup();
			lkFldObj._hostDatasetName = hostDsName;
		if (param.realDataset !== undefined) {
			lkFldObj.realDataset(param.realDataset);
		}
		lkFldObj.dataset(lkds);
		if (param.keyField !== undefined) {
			lkFldObj.keyField(param.keyField);
		}
		if (param.codeField !== undefined) {
			lkFldObj.codeField(param.codeField);
		}
		if (param.nameField !== undefined) {
			lkFldObj.nameField(param.nameField);
		}
		if (param.codeFormat !== undefined) {
			lkFldObj.codeFormat(param.codeFormat);
		}
		if (param.displayFields !== undefined) {
			lkFldObj.displayFields(param.displayFields);
		}
		if (param.parentField !== undefined) {
			lkFldObj.parentField(param.parentField);
		}
		if (param.onlyLeafLevel !== undefined) {
			lkFldObj.onlyLeafLevel(param.onlyLeafLevel);
		}
		if (param.returnFieldMap !== undefined) {
			lkFldObj.returnFieldMap(param.returnFieldMap);
		}
		if (param.editFilter !== undefined) {
			lkFldObj.editFilter(param.editFilter);
		}
		if (param.editItemDisabled !== undefined) {
			lkFldObj.editItemDisabled(param.editItemDisabled);
		}
		
		return lkFldObj;
	};
	
	jslet.data.CrossFieldSource = function() {
		var Z = this;
		
		Z._sourceType = 0; //Optional value: 0-field, 1-custom'
		Z._sourceField = null;
		Z._lookupLevel = 1;
		
		Z._labels = null;
		Z._values = null;
		Z._matchExpr = null;
		
		Z._hideEmptyValue = false;
		Z._hasSubtotal = true;
		Z._subtotalPosition = 1; //Optional value: 0-first, 1-end
		Z._subtotalLabel = null;		
	};
	jslet.data.CrossFieldSource.className = 'jslet.data.CrossFieldSource';
	
	jslet.data.CrossFieldSource.prototype = {
		className: jslet.data.CrossFieldSource.className,
		
		clone: function(){
			var Z = this, 
				result = new jslet.data.CrossFieldSource();
			result.sourceType(Z._sourceType);
			result.sourceField(Z._sourceField);
			result.lookupLevel(Z._lookupLevel);
			result.labels(Z._labels);
			result.values(Z._values);
			result.matchExpr(Z._matchExpr);
			result.hideEmptyValue(Z._hideEmptyValue);
			result.hasSubtotal(Z._hasSubtotal);
			result.subtotalPosition(Z._subtotalPosition);
			result.subtotalLabel(Z._subtotalLabel);
			return result;
		},
		
		/**
		 * Cross source type, optional value: 0 - field, 1 - custom.
		 * 
		 * @param {Number or undefined} sourceType Cross source type.
		 * @return {Number or this}
		 */
		sourceType: function(sourceType) {
			var Z = this;
			if (sourceType === undefined) {
				return Z._sourceType;
			}
			jslet.Checker.test('CrossFieldSource.sourceType', sourceType).isNumber();
			Z._sourceType = sourceType;
			return this;
		},
	
		/**
		 * Identify the field name which is used to create cross field. Avaliable when crossType is 0-Field.
		 * sourceField must be a lookup field and required. 
		 * 
		 * @param {String or undefined} sourceField The field name which is used to create cross field.
		 * @return {String or this}
		 */
		sourceField: function(sourceField) {
			var Z = this;
			if (sourceField === undefined) {
				return Z._sourceField;
			}
			jslet.Checker.test('CrossFieldSource.sourceField', sourceField).isString();
			Z._sourceField = sourceField;
			return this;
		},
		
		/**
		 * Identify cross field labels. Avaliable when crossType is 1-Field.
		 * If labels is null, use "values" as "labels" instead.
		 * 
		 * @param {String[] or undefined} labels The cross field labels.
		 * @return {String[] or this}
		 */
		labels: function(labels) {
			var Z = this;
			if (labels === undefined) {
				return Z._labels;
			}
			jslet.Checker.test('CrossFieldSource.labels', labels).isArray();
			Z._labels = labels;
			return this;
		},
		
		/**
		 * Identify cross field cross values. Avaliable when crossType is 1-Field.
		 * If crossType is 1-Field, "values" is reqired.
		 * 
		 * @param {Object[] or undefined} values The cross field source values.
		 * @return {Object[] or this}
		 */
		values: function(values) {
			var Z = this;
			if (values === undefined) {
				return Z._values;
			}
			jslet.Checker.test('CrossFieldSource.values', values).isArray();
			Z._values = values;
			return this;
		},
		
		/**
		 * Identify the field name which is used to create cross field. Avaliable when crossType is 1-Custom.
		 * If crossType is 1-Custom, matchExpr is required. 
		 * 
		 * @param {String or undefined} matchExpr The expression which use to match value.
		 * @return {String or this}
		 */
		matchExpr: function(matchExpr) {
			var Z = this;
			if (matchExpr === undefined) {
				return Z._matchExpr;
			}
			jslet.Checker.test('CrossFieldSource.matchExpr', matchExpr).isString();
			Z._matchExpr = matchExpr;
			return this;
		},
		
		/**
		 * Identify it has subtotal column or not.
		 * 
		 * @param {Boolean or undefined} hasSubtotal True - has subtotal, false otherwise.
		 * @return {Boolean or this}
		 */
		hasSubtotal: function(hasSubtotal) {
			var Z = this;
			if (hasSubtotal === undefined) {
				return Z._hasSubtotal;
			}
			jslet.Checker.test('CrossFieldSource.hasSubtotal', hasSubtotal).isString();
			Z._hasSubtotal = hasSubtotal;
			return this;
		},
		
		/**
		 * Identify the "subtotal" column position. Avaliable when "hasSubtotal" is true;
		 * Optional Value: 0 - At first column, 1 - At last column.
		 * 
		 * @param {Number or undefined} subtotalPosition subtotal column position.
		 * @return {Number or this}
		 */
		subtotalPosition: function(subtotalPosition) {
			var Z = this;
			if (subtotalPosition === undefined) {
				return Z._subtotalPosition;
			}
			jslet.Checker.test('CrossFieldSource.subtotalPosition', subtotalPosition).isNumber();
			Z._subtotalPosition = subtotalPosition;
			return this;
		},
	
		/**
		 * Subtotal label. Avaliable when "hasSubtotal" is true;
		 * 
		 * @param {String or undefined} subtotalLabel Subtotal label.
		 * @return {String or this}
		 */
		subtotalLabel: function(subtotalLabel) {
			var Z = this;
			if (subtotalLabel === undefined) {
				return Z._subtotalLabel;
			}
			jslet.Checker.test('CrossFieldSource.subtotalLabel', subtotalLabel).isString();
			Z._subtotalLabel = subtotalLabel;
			return this;
		}
	}
	
	jslet.data.createCrossFieldSource = function(cfg) {
		var result = new jslet.data.CrossFieldSource();
		var srcType = cfg.sourceType || 0;
		result.sourceType(srcType);
		if(cfg.hasSubtotal !== undefined) {
			result.hasSubtotal(cfg.hasSubtotal);
		}
		
		if(cfg.subtotalPosition !== undefined) {
			result.subtotalPosition(cfg.subtotalPosition);
		}
		
		if(cfg.subtotalLabel !== undefined) {
			result.subtotalLabel(cfg.subtotalLabel);
		}
		
		if(srcType === 0) {
			result.sourceField(cfg.sourceField);
		} else {
			result.labels(cfg.labels);
			result.values(cfg.values);
			result.matchExpr(cfg.matchExpr);
		}
		return result;
	}
	
	/* ========================================================================
	 * Jslet framework: jslet.provider.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	if (!jslet.data) {
		jslet.data = {};
	}
	
	/**
	 * @static
	 * @private
	 * 
	 */
	jslet.data.ApplyAction = {QUERY: 'query', SAVE: 'save', SELECTED: 'selected'};
	
	/**
	 * @class jslet.data.DataProvider
	 * 
	 * @required
	 */
	jslet.data.DataProvider = function() {
		
		/**
		 * @param dataset jslet.data.Dataset;
		 * @param url String the request url;
		 * @param reqData String the request data which need to send to server.
		 */
		this.sendRequest = function(dataset, url, reqData) {
			var settings;
			if(jslet.global.beforeSubmit) {
				settings = jslet.global.beforeSubmit({url: url});
			}
			if(!settings) {
				settings = {}
			}
			settings.type = 'POST';
			settings.contentType = 'application/json';
			settings.mimeType = 'application/json';
			settings.dataType = 'json';
			settings.data = reqData;
			settings.context = dataset;
			if(dataset.csrfToken) {
				var headers = settings.headers || {};
				headers.csrfToken = dataset.csrfToken;
				settings.headers = headers;
			}
			
			var defer = jQuery.Deferred();
			jQuery.ajax(url, settings)
			.done(function(data, textStatus, jqXHR) {
				if(data) {
					if(data.csrfToken) {
						this.csrfToken = data.csrfToken;
					}
					var errorCode = data.errorCode;
					if (errorCode) {
						defer.reject(data, this);
						return;
					}
				}
				defer.resolve(data, this);
			})
			.fail(function( jqXHR, textStatus, errorThrown ) {
				var data = jqXHR.responseJSON,
					result;
				if(data && data.errorCode) {
					result = {errorCode: data.errorCode, errorMessage: data.errorMessage};
				} else {
					if(textStatus == 'error') {
						errorCode = '0000';
						errorMessage = jslet.locale.Common.ConnectError;
					}
					result = {errorCode: errorCode, errorMessage: errorMessage};
				}
				defer.reject(result, this);
			})
			.always(function(dataOrJqXHR, textStatus, jqXHRorErrorThrown) {
				if(jQuery.isFunction(dataOrJqXHR.done)) { //fail
					var data = dataOrJqXHR.responseJSON,
						result;
					if(data && data.errorCode) {
						result = {errorCode: data.errorCode, errorMessage: data.errorMessage};
					} else {
						result = {errorCode: textStatus, errorMessage: jqXHRorErrorThrown};
					}
					defer.always(result, this);
				} else {
					defer.always(dataOrJqXHR, this);
				}
			});
			return defer.promise();
		};
	};
	


/***/ },
/* 12 */
/***/ function(module, exports) {

	/*!
	 * jQuery.tabbable 1.0 - Simple utility for selecting the next / previous ':tabbable' element.
	 * https://github.com/marklagendijk/jQuery.tabbable
	 *
	 * Includes ':tabbable' and ':focusable' selectors from jQuery UI Core
	 *
	 * Copyright 2013, Mark Lagendijk
	 * Released under the MIT license
	 *
	 */
	(function($){
		'use strict';
	
		/**
		 * Focusses the next :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.focusNext = function(container, isLoop, onChangingFocus){
			selectNextTabbableOrFocusable(':focusable', container, isLoop, onChangingFocus);
		};
	
		/**
		 * Focusses the previous :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.focusPrev = function(container, isLoop, onChangingFocus){
			return selectPrevTabbableOrFocusable(':focusable', container, isLoop, onChangingFocus);
		};
	
		/**
		 * Focusses the next :tabable element.
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.tabNext = function(container, isLoop, onChangingFocus){
			return selectNextTabbableOrFocusable(':tabbable', container, isLoop, onChangingFocus);
		};
	
		/**
		 * Focusses the previous :tabbable element
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.tabPrev = function(container, isLoop, onChangingFocus){
			return selectPrevTabbableOrFocusable(':tabbable', container, isLoop, onChangingFocus);
		};
	
		function selectNextTabbableOrFocusable(selector, container, isLoop, onChangingFocus){
			if(!container) {
				container = document;
			}
			var selectables = jQuery(container).find(selector);
			sortByTabIndex(selectables);
			var current = $(':focus');
			var nextIndex = 0;
			var currEle = null;
			if(current.length === 1){
				currEle = current[0];
				var currentIndex = selectables.index(current);
				if(currentIndex + 1 < selectables.length){
					nextIndex = currentIndex + 1;
				} else {
					if(isLoop) {
						nextIndex = 0;
					}
				}
			}
	
			var canFocus = true;
			if(onChangingFocus && currEle) {
				canFocus = onChangingFocus(currEle, false);
			}
			if(canFocus) {
				var jqEl = selectables.eq(nextIndex);
				jqEl.focus();
				return jqEl[0];
			} else {
				return currEle;
			}
		}
	
		function selectPrevTabbableOrFocusable(selector, container, isLoop, onChangingFocus){
			if(!container) {
				container = document;
			}
			var selectables = jQuery(container).find(selector);
			sortByTabIndex(selectables);
			var current = $(':focus');
			var prevIndex = selectables.length - 1;
			var currEle = null;
			if(current.length === 1){
				currEle = current[0];
				var currentIndex = selectables.index(current);
				if(currentIndex > 0){
					prevIndex = currentIndex - 1;
				} else {
					if(isLoop) {
						prevIndex = selectables.length - 1;
					}
				}
			}
	
			var canFocus = true;
			if(onChangingFocus && currEle) {
				canFocus = onChangingFocus(currEle, true);
			}
			if(canFocus) {
				var jqEl = selectables.eq(prevIndex);
				jqEl.focus();
				return jqEl[0];
			} else {
				return currEle;
			}
		}
	
		function sortByTabIndex(items) {
			if(!items) {
				return;
			}
			
			var item, item1, k;
			for(var i = 1, len = items.length; i < len; i++) {
				item = items[i];
				k = 0;
				for(var j = i - 1; j >= 0; j--) {
					item1 = items[j];
					if(item1.tabIndex <= item.tabIndex) {
						k = j + 1;
						break;
					}
				} //end for j
				if(i !== k) {
					items.splice(i, 1);
					items.splice(k, 0, item);
				}
			} //end for i
		}
		
		/**
		 * :focusable and :tabbable, both taken from jQuery UI Core
		 */
		$.extend($.expr[ ':' ], {
			data: $.expr.createPseudo ?
				$.expr.createPseudo(function(dataName){
					return function(elem){
						return !!$.data(elem, dataName);
					};
				}) :
				// support: jQuery <1.8
				function(elem, i, match){
					return !!$.data(elem, match[ 3 ]);
				},
	
			focusable: function(element){
				return focusable(element, !isNaN($.attr(element, 'tabindex')));
			},
	
			tabbable: function(element){
				var tabIndex = $.attr(element, 'tabindex'),
					isTabIndexNaN = isNaN(tabIndex);
				return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
			}
		});
	
		/**
		 * focussable function, taken from jQuery UI Core
		 * @param element
		 * @returns {*}
		 */
		function focusable(element){
			var map, mapName, img,
				nodeName = element.nodeName.toLowerCase(),
				isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
			if('area' === nodeName){
				map = element.parentNode;
				mapName = map.name;
				if(!element.href || !mapName || map.nodeName.toLowerCase() !== 'map'){
					return false;
				}
				img = $('img[usemap=#' + mapName + ']')[0];
				return !!img && visible(img);
			}
			return ( /input|select|textarea/.test(nodeName) ?
				!element.disabled :
				'a' === nodeName ?
					element.href || isTabIndexNotNaN :
					isTabIndexNotNaN) &&
				// the element and all of its ancestors must be visible
				visible(element);
	
			function visible(element){
				return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function(){
					return $.css(this, 'visibility') === 'hidden';
				}).length;
			}
		}
	})(jQuery);
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.dnd.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	if(!jslet.ui) {
		jslet.ui = {};
	}
	
	/**
	* Drag & Drop. A common framework to implement drag & drop. Example:
	* <pre><code>
	*   //Define a delegate class
	*   dndDelegate = {}
	*   dndDelegate._doDragStart = function(){}
	*   dndDelegate._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {}
	*   dndDelegate._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {}
	*   dndDelegate._doDragCancel = function () {}
	* 
	*   //Initialize jslet.ui.DnD
	*   //var dnd = new jslet.ui.DnD();
	*   //Or use global jslet.ui.DnD instance to bind 'dndDelegate'
	*   jslet.ui.dnd.bindControl(dndDelegate);
	*	
	*   //After end dragging, you need unbind it
	*   jslet.ui.dnd.unbindControl();
	* 
	* </code></pre>
	* 
	*/
	
	jslet.ui.DnD = function () {
		var oldX, oldY, x, y, deltaX, deltaY,
			dragDelta = 2, 
			dragged = false, 
			bindedControl, 
			mouseDowned = true,
			self = this;
	
		this._docMouseDown = function (event) {
			event = jQuery.event.fix( event || window.event );
			mouseDowned = true;
			deltaX = 0;
			deltaY = 0;
			oldX = event.pageX;
			oldY = event.pageY;
			dragged = false;
	
			if (bindedControl && bindedControl._doMouseDown) {
				bindedControl._doMouseDown(oldX, oldY, x, y, deltaX, deltaY);
			}
		};
	
		this._docMouseMove = function (event) {
			if (!mouseDowned) {
				return;
			}
			event = jQuery.event.fix( event || window.event );
			
			x = event.pageX;
			y = event.pageY;
			if (!dragged) {
				if (Math.abs(deltaX) > dragDelta || Math.abs(deltaY) > dragDelta) {
					dragged = true;
					oldX = x;
					oldY = y;
					if (bindedControl && bindedControl._doDragStart) {
						bindedControl._doDragStart(oldX, oldY);
					}
					return;
				}
			}
			deltaX = x - oldX;
			deltaY = y - oldY;
			if (dragged) {
				if (bindedControl && bindedControl._doDragging) {
					bindedControl._doDragging(oldX, oldY, x, y, deltaX, deltaY);
				}
			} else {
				if (bindedControl && bindedControl._doMouseMove) {
					bindedControl._doMouseMove(oldX, oldY, x, y, deltaX, deltaY);
				}
				oldX = x;
				oldY = y;
			}
		};
	
		this._docMouseUp = function (event) {
			mouseDowned = false;
			if (dragged) {
				dragged = false;
				if (bindedControl && bindedControl._doDragEnd) {
					bindedControl._doDragEnd(oldX, oldY, x, y, deltaX, deltaY);
				}
			} else {
				if (bindedControl && bindedControl._doMouseUp) {
					bindedControl._doMouseUp(oldX, oldY, x, y, deltaX, deltaY);
				}
			}
			self.unbindControl();
		};
	
		this._docKeydown = function (event) {
			event = jQuery.event.fix( event || window.event );
			if (event.which == 27) {//Esc key
				if (dragged) {
					dragged = false;
					if (bindedControl && bindedControl._doDragCancel) {
						bindedControl._doDragCancel();
						self.unbindControl();
					}
				}
			}
		};
	
		this._docSelectStart = function (event) {
			event = jQuery.event.fix( event || window.event );
			event.preventDefault();
	
			return false;
		};
	
		/**
		 * Bind control 
		 * 
		 * @param {Object} ctrl The control need drag & drop, there are four method in it: 
		 *  ctrl._doDragStart = function(){}
		 *  ctrl._doDragging = function(oldX, oldY, x, y, deltaX, deltaY){}
		 *  ctrl._doDragEnd = function(oldX, oldY, x, y, deltaX, deltaY){}
		 *  ctrl._doDragCancel = function(){}
		 *  ctrl_doDragStart = function{}
		 *  
		 */
		this.bindControl = function (ctrl) {
			bindedControl = ctrl;
			var doc = jQuery(document);
			doc.on('mousedown', this._docMouseDown);
			doc.on('mouseup', this._docMouseUp);
			doc.on('mousemove', this._docMouseMove);
			doc.on('selectstart', this._docSelectStart);
			doc.on('keydown', this._docKeydown);
		};
	
		/**
		 * Unbind the current control
		 */
		this.unbindControl = function () {
			var doc = jQuery(document);
			doc.off('mousedown', this._docMouseDown);
			doc.off('mouseup', this._docMouseUp);
			doc.off('mousemove', this._docMouseMove);
			doc.off('selectstart', this._docSelectStart);
			doc.off('keydown', this._docKeydown);
			
			bindedControl = null;
		};
	};
	
	jslet.ui.dnd = new jslet.ui.DnD();
	
	
	/* ========================================================================
	 * Jslet framework: jslet.editmask.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	if(!jslet.ui) {
		jslet.ui = {};
	}
	
	/**
	 * @class EditMask
	 * Create edit mask class and attach to a html text element.Example:
	 * <pre><code>
	 *  var mask = new jslet.ui.EditMask('L00-000');
	 *  var mask.attach(htmlText);
	 * </code></pre>
	 * 
	 * @param {String} mask Mask string, rule:
	 *  '#': char set: 0-9 and -, not required, 
	 *  '0': char set: 0-9, required,
	 *  '9': char set: 0-9, not required,
	 *  'L': char set: A-Z,a-z, required,
	 *  'l': char set: A-Z,a-z, not required,
	 *  'A': char set: 0-9,a-z,A-Z, required,
	 *  'a': char set: 0-9,a-z,A-Z, not required,
	 *  'C': char set: any char, required
	 *  'c': char set: any char, not required
	 *
	 *@param {Boolean} keepChar Keep the literal character or not
	 *@param {String} transform Transform character into UpperCase or LowerCase,
	 *  optional value: upper, lower or null.
	 */
	jslet.ui.EditMask = function () {
		this._mask = null;
		this._keepChar = true;
		this._transform = null;
	
		this._literalChars = null;
		this._parsedMask = null;
		this._format = null;
		this._target = null;
		this._buffer = null;
	};
	
	jslet.ui.EditMask.prototype = {
		maskChars: {
			'#': { regexpr: new RegExp('[0-9\\-]'), required: false }, 
			'0': { regexpr: new RegExp('[0-9]'), required: true },
			'9': { regexpr: new RegExp('[0-9]'), required: false },
			'L': { regexpr: new RegExp('[A-Za-z]'), required: true },
			'l': { regexpr: new RegExp('[A-Za-z]'), required: false },
			'A': { regexpr: new RegExp('[0-9a-zA-Z]'), required: true },
			'a': { regexpr: new RegExp('[0-9a-zA-Z]'), required: false },
			'C': { regexpr: null, required: true },
			'c': { regexpr: null, required: false }
		},
		
		transforms: ['upper','lower'],
	
		setMask: function(mask, keepChar, transform){
			mask = jQuery.trim(mask);
			jslet.Checker.test('EditMask#mask', mask).isString();
			this._mask = mask;
			this._keepChar = keepChar ? true: false;
			
			this._transform = null;
			if(transform){
				var checker = jslet.Checker.test('EditMask#transform', transform).isString();
				transform = jQuery.trim(transform);
				transform = transform.toLowerCase();
				checker.inArray(this.transforms);
				this._transform = transform;
			}
			this._parseMask();
		},
		
		/**
		 * Attach edit mask to a html text element
		 * 
		 * @param {Html Text Element} target Html text element
		 */
		attach: function (target) {
			jslet.Checker.test('EditMask.attach#target', target).required();
			var Z = this, jqText = jQuery(target);
			Z._target = target;
			jqText.on('keypress.editmask', function (event) {
				if(this.readOnly || !Z._mask) {
					return true;
				}
				var c = event.which;
				if (c === 0) {
					return true;
				}
				if (!Z._doKeypress(c)) {
					event.preventDefault();
				} else {
					return true;
				}
			});
			jqText.on('keydown.editmask', function (event) {
				if(this.readOnly || !Z._mask) {
					return true;
				}
				if (!Z._doKeydown(event.which)) {
					event.preventDefault();
				} else {
					return true;
				}
			});
	
			jqText.on('blur.editmask', function (event) {
				if(this.readOnly || !Z._mask) {
					return true;
				}
				if (!Z._doBur()) {
					event.preventDefault();
					event.currentTarget.focus();
				} else {
					return true;
				}
			});
	
			jqText.on('cut.editmask', function (event) {
				if(this.readOnly || !Z._mask) {
					return true;
				}
				Z._doCut(event.originalEvent.clipboardData || window.clipboardData);
				event.preventDefault();
				return false;
			});
	
			jqText.on('paste.editmask', function (event) {
				if(this.readOnly || !Z._mask) {
					return true;
				}
				if (!Z._doPaste(event.originalEvent.clipboardData || window.clipboardData)) {
					event.preventDefault();
				}
			});
		},
	
		/**
		 * Detach edit mask from a html text element
		 */
		detach: function(){
			var jqText = jQuery(this._target);
			jqText.off('keypress.editmask');
			jqText.off('keydown.editmask');
			jqText.off('blur.editmask');
			jqText.off('cut.editmask');
			jqText.off('paste.editmask');
			this._target = null; 
		},
		
		setValue: function (value) {
			value = jQuery.trim(value);
			jslet.Checker.test('EditMask.setValue#value', value).isString();
			value = value ? value : '';
			if(!this._mask) {
				this._target.value = value;
				return;
			}
			
			var Z = this;
			Z._clearBuffer(0);
			var prePos = 0, pos, preValuePos = 0, k, i, 
				ch, vch, valuePos = 0, fixedChar, 
				maskLen = Z._parsedMask.length;
			while (true) {
				fixedChar = Z._getFixedCharAndPos(prePos);
				pos = fixedChar.pos;
				ch = fixedChar.ch;
				if (pos < 0) {
					pos = prePos;
				}
				if (ch) {
					valuePos = value.indexOf(ch, preValuePos);
					if (valuePos < 0) {
						valuePos = value.length;
					}
					k = -1;
					for (i = valuePos - 1; i >= preValuePos; i--) {
						vch = value.charAt(i);
						Z._buffer[k + pos] = vch;
						k--;
					}
					preValuePos = valuePos + 1;
				} else {
					k = 0;
					var c, cnt = Z._buffer.length;
					for (i = prePos; i < cnt; i++) {
						c = value.charAt(preValuePos + k);
						if (!c) {
							break;
						}
						Z._buffer[i] = c;
						k++;
					}
					break;
				}
				prePos = pos + 1;
			}
			Z._showValue();
		},
		
		getValue: function(){
			var value = this._target.value;
			if(this._keepChar) {
				return value;
			} else {
				var result = [], maskObj;
				for(var i = 0, cnt = value.length; i< cnt; i++){
					maskObj = this._parsedMask[i];
					if(maskObj.isMask) {
						result.push(value.charAt(i));
					}
				}
				return result.join('');
			}
		},
		
		validateValue: function(){
			var Z = this, len = Z._parsedMask.length, cfg;
			for(var i = 0; i< len; i++){
				cfg = Z._parsedMask[i];
				if(cfg.isMask && Z.maskChars[cfg.ch].required){
					if(Z._buffer[i] == Z._format[i]) {
						return false;
					}
				}
			}
			return true;
		},
		
		_getFixedCharAndPos: function (begin) {
			var Z = this;
			if (!Z._literalChars || Z._literalChars.length === 0) {
				return { pos: 0, ch: null };
			}
			if (!begin) {
				begin = 0;
			}
			var ch, mask;
			for (var i = begin, cnt = Z._parsedMask.length; i < cnt; i++) {
				mask = Z._parsedMask[i];
				if (mask.isMask) {
					continue;
				}
				ch = mask.ch;
				if (Z._literalChars.indexOf(ch) >= 0) {
					return { ch: ch, pos: i };
				}
			}
			return { pos: -1, ch: null };
		},
	
		_parseMask: function () {
			var Z = this;
			if(!Z._mask) {
				Z._parsedMask = null;
				return;
			}
			Z._parsedMask = [];
			
			Z._format = [];
			var c, prevChar = null, isMask;
	
			for (var i = 0, cnt = Z._mask.length; i < cnt; i++) {
				c = Z._mask.charAt(i);
				if (c == '\\') {
					prevChar = c;
					continue;
				}
				isMask = false;
				if (Z.maskChars[c] === undefined) {
					if (prevChar) {
						Z._parsedMask.push({ ch: prevChar, isMask: isMask });
					}
					Z._parsedMask.push({ ch: c, isMask: isMask });
				} else {
					isMask = prevChar ? false : true;
					Z._parsedMask.push({ ch: c, isMask: isMask });
				}
				if(Z._keepChar && !isMask){
					if(!Z._literalChars) {
						Z._literalChars = [];
					}
					var notFound = true;
					for(var k = 0, iteralCnt = Z._literalChars.length; k < iteralCnt; k++){
						if(Z._literalChars[k] == c){
							notFound = false;
							break;
						}
					}
					if(notFound) {
						Z._literalChars.push(c);
					}
				}
				prevChar = null;
				Z._format.push(isMask ? '_' : c);
			} //end for
	
			Z._buffer = Z._format.slice(0);
			if(Z._target) {
				Z._target.value = Z._format.join('');
			}
		},
		
		_validateChar: function (maskChar, inputChar) {
			var maskCfg = this.maskChars[maskChar];
			var regExpr = maskCfg.regexpr;
			if (regExpr) {
				return regExpr.test(inputChar);
			} else {
				return true;
			}
		},
	
		_getValidPos: function (pos, toLeft) {
			var Z = this, 
				cnt = Z._parsedMask.length, i;
			if (pos >= cnt) {
				return cnt - 1;
			}
			if (!toLeft) {
				for (i = pos; i < cnt; i++) {
					if (Z._parsedMask[i].isMask) {
						return i;
					}
				}
				for (i = pos; i >= 0; i--) {
					if (Z._parsedMask[i].isMask) {
						return i;
					}
				}
	
			} else {
				for (i = pos; i >= 0; i--) {
					if (Z._parsedMask[i].isMask) {
						return i;
					}
				}
				for (i = pos; i < cnt; i++) {
					if (Z._parsedMask[i].isMask) {
						return i;
					}
				}
			}
			return -1;
		},
	
		_clearBuffer: function (begin, end) {
			if(!this._buffer) {
				return;
			}
			if (!end) {
				end = this._buffer.length - 1;
			}
			for (var i = begin; i <= end; i++) {
				this._buffer[i] = this._format[i];
			}
		},
	
		_packEmpty: function (begin, end) {
			var c, k = 0, Z = this, i;
			for (i = begin; i >= 0; i--) {
				c = Z._format[i];
				if (Z._literalChars && Z._literalChars.indexOf(c) >= 0) {
					k = i;
					break;
				}
			}
			begin = k;
			var str = [];
			for (i = begin; i < end; i++) {
				c = Z._buffer[i];
				if (c != Z._format[i]) {
					str.push(c);
				}
			}
			var len = str.length - 1;
	
			for (i = end - 1; i >= begin; i--) {
				if (len >= 0) {
					Z._buffer[i] = str[len];
					len--;
				} else {
					Z._buffer[i] = Z._format[i];
				}
			}
		},
	
		_updateBuffer: function (pos, ch) {
			var begin = pos.begin, end = pos.end, Z = this;
	
			begin = Z._getValidPos(begin);
			if (begin < 0) {
				return -1;
			}
			Z._clearBuffer(begin + 1, end);
			if (Z._literalChars && Z._literalChars.indexOf(ch) >= 0) {
				for (var i = begin, cnt = Z._parsedMask.length; i < cnt; i++) {
					if (Z._parsedMask[i].ch == ch) {
						Z._packEmpty(begin, i);
						return i;
					}
				}
			} else {
				var maskObj = Z._parsedMask[begin];
				if (Z._validateChar(maskObj.ch, ch)) {
					Z._buffer[begin] = ch;
					return begin;
				} else	{
					return -1;
				}
			}
		},
	
		_moveCursor: function (begin, toLeft) {
			begin = this._getValidPos(begin, toLeft);
			if (begin >= 0) {
				jslet.ui.textutil.setCursorPos(this._target, begin);
			}
		},
	
		_showValue: function () {
			this._target.value = this._buffer.join('');
		},
	
		_doKeypress: function (chCode) {
			if (chCode == 13) {
				return true;
			}
	
			var ch = String.fromCharCode(chCode), Z = this;
			if (Z._transform == 'upper') {
				ch = ch.toUpperCase();
			} else {
				if (Z._transform == 'lower') {
					ch = ch.toLowerCase();
				}
			}
			var pos = jslet.ui.textutil.getCursorPos(Z._target);
			var begin = Z._updateBuffer(pos, ch);
			Z._showValue();
			if (begin >= 0) {
				Z._moveCursor(begin + 1);
			} else {
				Z._moveCursor(pos.begin);
			}
	
			return false;
		},
	
		_doKeydown: function (chCode) {
			var Z = this,
				pos = jslet.ui.textutil.getCursorPos(Z._target),
				begin = pos.begin,
				end = pos.end;
	
			if (chCode == 229) {//IME showing
				var flag = (Z._parsedMask.legnth > begin);
				if (flag) {
					var msk = Z._parsedMask[begin];
					flag = msk.isMask;
					if (flag) {
						var c = msk.ch;
						flag = (c == 'c' || c == 'C');
					}
				}
				if (!flag) {
					window.setTimeout(function () {
						Z._showValue();
						Z._moveCursor(begin);
					}, 50);
				}
			}
			if (chCode == 13) //enter
			{
				return true;
			}
	
			if (chCode == 8) //backspace
			{
				if (begin == end) {
					begin = Z._getValidPos(--begin, true);
					end = begin;
				}
				Z._clearBuffer(begin, end);
				Z._showValue();
				Z._moveCursor(begin, true);
				return false;
			}
	
			if (chCode == 27) // Allow to send 'ESC' command
			{
				return false;
			}
	
			if (chCode == 39) // Move Left
			{
			}
	
			if (chCode == 46) // delete the selected text
			{
				Z._clearBuffer(begin, end - 1);
				Z._showValue();
				Z._moveCursor(begin);
	
				return false;
			}
			return true;
		},
	
		_doBur: function () {
			var mask, c, Z = this;
			for (var i = 0, cnt = Z._parsedMask.length; i < cnt; i++) {
				mask = Z._parsedMask[i];
				if (!mask.isMask) {
					continue;
				}
				c = mask.ch;
				if (Z.maskChars[c].required) {
					if (Z._buffer[i] == Z._format[i]) {
						//jslet.ui.textutil.setCursorPos(Z._target, i);
						//return false;
						return true;
					}
				}
			}
			return true;
		},
	
		_doCut: function (clipboardData) {
			var Z = this,
				data = jslet.ui.textutil.getSelectedText(Z._target),
				range = jslet.ui.textutil.getCursorPos(Z._target),
				begin = range.begin;
			Z._clearBuffer(begin, range.end - 1);
			Z._showValue();
			Z._moveCursor(begin, true);
			clipboardData.setData('Text', data);
			return false;
		},
	
		_doPaste: function (clipboardData) {
			var pasteValue = clipboardData.getData('Text');
			if (!pasteValue) {
				return false;
			}
			var pos = jslet.ui.textutil.getCursorPos(this._target), begin = 0, ch;
			pos.end = pos.begin;
			for (var i = 0; i < pasteValue.length; i++) {
				ch = pasteValue.charAt(i);
				begin = this._updateBuffer(pos, ch);
				pos.begin = i;
				pos.end = pos.begin;
			}
			this._showValue();
			if (begin >= 0) {
				this._moveCursor(begin + 1);
			}
			return true;
		}
	};//edit mask
	
	/**
	 * Util of "Text" control
	 */
	jslet.ui.textutil = {
		/**
		 * Select text from an Input(Text) element 
		 * 
		 * @param {Html Text Element} txtEl The html text element   
		 * @param {Integer} start Start position.
		 * @param {Integer} end End position.
		 */
		selectText: function(txtEl, start, end){
			var v = txtEl.value;
			if (v.length > 0) {
				start = start === undefined ? 0 : start;
				end = end === undefined ? v.length : end;
	 
				if (txtEl.setSelectionRange) {
					txtEl.setSelectionRange(start, end);
				} else if (txtEl.createTextRange) {
					var range = txtEl.createTextRange();
					range.moveStart('character', start);
					range.moveEnd('character', end - v.length);
					range.select();
				}
			}	
		},
		
		/**
		 * Get selected text
		 * 
		 * @param {Html Text Element} textEl Html Text Element
		 * @return {String}  
		 */
		getSelectedText: function (txtEl) {
			if (txtEl.setSelectionRange) {
				var begin = txtEl.selectionStart;
				var end = txtEl.selectionEnd;
				return txtEl.value.substring(begin, end);
			}
			if (document.selection && document.selection.createRange) {
				return document.selection.createRange().text;
			}
		},
	
		/**
		 * Get cursor postion of html text element
		 * 
		 * @param {Html Text Element} txtEl Html Text Element
		 * @return {Integer}
		 */
		getCursorPos: function(txtEl){
			var result = { begin: 0, end: 0 };
	
			if (txtEl.setSelectionRange) {
				result.begin = txtEl.selectionStart;
				result.end = txtEl.selectionEnd;
			}
			else if (document.selection && document.selection.createRange) {
				var range = document.selection.createRange();
				result.begin = 0 - range.duplicate().moveStart('character', -100000);
				result.end = result.begin + range.text.length;
			}
			return result;
		},
		
		/**
		 * Set cursor postion of html text element
		 * 
		 * @param {Html Text Element} txtEl Html Text Element
		 * @param {Integer} pos Cusor position
		 */
		setCursorPos: function(txtEl, pos){
			if (txtEl.setSelectionRange) {
				txtEl.focus();
				txtEl.setSelectionRange(pos, pos);
			}
			else if (txtEl.createTextRange) {
				var range = txtEl.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}	
		}
	};
	
	/* ========================================================================
	 * Jslet framework: jslet.resizeeventbus.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	* Resize event bus, manage all resize event. Example:
	* <pre><code>
	*	var myCtrlObj = {
	*		checkSizeChanged: function(){
	*			;
	*		}
	*	}
	*	
	*	//Subcribe a message from MessageBus
	*	jslet.messageBus.subcribe(myCtrlObj);
	*   
	*	//Unsubcribe a message from MessageBus
	*	jslet.messageBus.unsubcribe(myCtrlObj);
	* 
	*	//Send a mesasge to MessageBus
	*	jslet.messageBus.sendMessage('MyMessage', {x: 10, y:10});
	* 
	* </code></pre>
	* 
	*/
	jslet.ResizeEventBus = function () {
		
		var handler = null;
		/**
		 * Send a message.
		 * 
		 * @param {Html Element} sender Sender which send resize event.
		 */
		this.resize = function (sender) {
			if (handler){
				window.clearTimeout(handler);
			}
			handler = setTimeout(function(){
				var ctrls, ctrl, jsletCtrl;
				if (sender) {
					ctrls = jQuery(sender).find("*[data-jslet-resizable]");
				} else {
					ctrls = jQuery("*[data-jslet-resizable]");
				}
				if(jslet.ui._activePopup) {
					jslet.ui._activePopup.hide();
				}
				for(var i = 0, cnt = ctrls.length; i < cnt; i++){
					ctrl = ctrls[i];
					if (ctrl){
						jsletCtrl = ctrl.jslet;
						if (jsletCtrl && jsletCtrl.checkSizeChanged){
							jsletCtrl.checkSizeChanged();
						}
					}
				}
				handler = null;
			}, 100);
		};
	
		/**
		 * Subscribe a control to response a resize event.
		 * 
		 * @param {Object} ctrlObj control object which need subscribe a message, 
		 *	there must be a function: checkSizeChanged in ctrlObj.
		 *	checkSizeChanged: function(){}
		 */
		this.subscribe = function(ctrlObj){
			if (!ctrlObj || !ctrlObj.el) {
				throw new Error("ctrlObj required!");
			}
			jQuery(ctrlObj.el).attr(jslet.ResizeEventBus.RESIZABLE, true);
		};
		
		/**
		 * Unsubscribe a control to response a resize event.
		 * 
		 * @param {Object} ctrlObj control object which need subscribe a message.
		 */
		this.unsubscribe = function(ctrlObj){
			if (!ctrlObj || !ctrlObj.el) {
				throw new Error("ctrlObj required!");
			}
			jQuery(ctrlObj.el).removeAttr(jslet.ResizeEventBus.RESIZABLE);
		};
		
	};
	
	jslet.ResizeEventBus.RESIZABLE = "data-jslet-resizable";
	
	jslet.resizeEventBus = new jslet.ResizeEventBus();
	
	jQuery(window).on("resize",function(){
		jslet.resizeEventBus.resize();
	});
	
	/* ========================================================================
	 * Jslet framework: jslet.uicommon.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	if(!jslet.ui) {
		jslet.ui = {};
	}
	
	jslet.ui.htmlclass = {};
	jslet.ui.GlobalZIndex = 100;
	
	/**
	* Popup Panel. Example: 
	* <pre><code>
	* var popPnl = new jslet.ui.PopupPanel();
	* popPnl.setContent(document.getElementById('id'));
	* popPnl.show(10, 10, 100, 100);
	* 
	* popPnl.hide(); //or
	* popPnl.destroy();
	* </code></pre>
	*  
	*/
	jslet.ui.KeyCode = {
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		TAB: 9,
		ENTER: 13
	};
	
	jslet.ui.PopupPanel = function () {
		/**
		 * Event handler when hide popup panel: function(){}
		 */
		this.onHidePopup = null;
	
		this.isShowing = false;
		/**
		 * Private document click handler
		 */
		this.documentClickHandler = function (event) {
			event = jQuery.event.fix( event || window.event );
			var srcEle = event.target;
			if (jslet.ui.isChild(jslet.ui.PopupPanel.excludedElement,srcEle) ||
				jslet.ui.inPopupPanel(srcEle)) {
				return;
			}
			if (jslet.ui._activePopup) {
				jslet.ui._activePopup.hide();
			}
		};
	
		this._stopMouseEvent = function(event) {
			event.stopImmediatePropagation();
			event.preventDefault();
		};
		
		/**
		 * Private, create popup panel
		 */
		this._createPanel = function () {
			if (!jslet.ui._popupPanel) {
				var p = document.createElement('div');
				p.style.display = 'none';
				p.className = 'jl-popup-panel jl-opaque jl-border-box dropdown-menu';
				p.style.position = 'absolute';
				p.style.zIndex = 99000;
				document.body.appendChild(p);
				
				jQuery(document).on('click', this.documentClickHandler);
	//			jQuery(p).on('click', this._stopMouseEvent);
	//			jQuery(p).on('mousedown', this._stopMouseEvent);
	//			jQuery(p).on('mouseup', this._stopMouseEvent);
				jslet.ui._popupPanel = p;
			}
		};
		
		/**
		 * Show popup panel in specified position with specified size.
		 * 
		 * @param {Integer} left Left position
		 * @param {Integer} top Top position
		 * @param {Integer} width Popup panel width
		 * @param {Integer} height Popup panel height
		 * 
		 */
		this.show = function (left, top, width, height, ajustX, ajustY) {
			this._createPanel();
			left = parseInt(left);
			top = parseInt(top);
			
			if (height) {
				jslet.ui._popupPanel.style.height = parseInt(height) + 'px';
			}
			if (width) {
				jslet.ui._popupPanel.style.width = parseInt(width) + 'px';
			}
			var jqWin = jQuery(window),
				winWidth = jqWin.scrollLeft() + jqWin.width(),
				winHeight = jqWin.scrollTop() + jqWin.height(),
				panel = jQuery(jslet.ui._popupPanel),
				w = panel.outerWidth(),
				h = panel.outerHeight();
			/*
			if (left - obody.scrollLeft + w > obody.clientWidth) {
				left -= w;
			}
			if (top - obody.scrollTop + h > obody.clientHeight) {
				top -= (h + ajustY);
			}
			*/
			if (jslet.locale.isRtl) {
				left -= w;
			}
			if(left + w > winWidth) {
				left += winWidth - left - w - 1;
			}
			if(top + h > winHeight) {
				top -= (h + ajustY);
			}
			if(left < 0) {
				left = 1;
			}
			if(top < 0) {
				top = 1;
			}
			
			if (top) {
				jslet.ui._popupPanel.style.top = top + 'px';
			}
			if (left) {
				jslet.ui._popupPanel.style.left = left + 'px';
			}
			jslet.ui._popupPanel.style.display = 'block';
	
			var shadow = jslet.ui._popupShadow;
			if(shadow) {
				shadow.style.width = w + 'px';
				shadow.style.height = h + 'px';
				shadow.style.top = top + 2 + 'px';
				shadow.style.left = left + 2 + 'px';
				shadow.style.display = 'block';
			}
			jslet.ui._activePopup = this;
			this.isShowing = true;
		};
	
		/**
		 * Set popup panel content.
		 * 
		 * @param {Html Element} content popup panel content
		 * @param {String} content width;
		 * @param {String} cotnent height;
		 */
		this.setContent = function (content, width, height) {
			this._createPanel();
			var oldContent = jslet.ui._popupPanel.childNodes[0];
			if (oldContent) {
				jslet.ui._popupPanel.removeChild(oldContent);
			}
			jslet.ui._popupPanel.appendChild(content);
			content.style.border = 'none';
			if(width) {
				content.style.width = width;
			}
			if(height) {
				content.style.height = height;
			}
		};
	
		/**
		 * Get popup Panel. You can use this method to customize popup panel.
		 * 
		 * @return {Html Element}
		 * 
		 */
		this.getPopupPanel = function () {
			this._createPanel();
			return jslet.ui._popupPanel;
		};
	
		/**
		 * Destroy popup panel completely.
		 */
		this.destroy = function () {
			if (!jslet.ui._popupPanel) {
				return;
			}
			this.isShowing = false;
			document.body.removeChild(jslet.ui._popupPanel);
			if(jslet.ui._popupShadow) {
				document.body.removeChild(jslet.ui._popupShadow);
			}
			jQuery(this._popupPanel).off();
			jslet.ui._popupPanel = null;
			jslet.ui._popupShadow = null;
			this.onHidePopup = null;
			jQuery(document).off('click', this.documentClickHandler);
		};
	
		/**
		 * Hide popup panel, and you can show it again.
		 * 
		 */
		this.hide = function () {
			if (jslet.ui._popupPanel) {
				jslet.ui._popupPanel.style.display = 'none';
				if(jslet.ui._popupShadow) {
					jslet.ui._popupShadow.style.display = 'none';
				}
			}
			if (this.onHidePopup) {
				this.onHidePopup();
			}
			this.isShowing = false;
			delete jslet.ui._activePopup;
		};
	};
	
	/**
	* Check if a html element is in an active popup or not
	* 
	* @param {Html Element} htmlElement Checking html element
	* 
	* @return {Boolean} True - In popup panel, False - Otherwise
	*/
	jslet.ui.inPopupPanel = function (htmlElement) {
		if (!htmlElement || htmlElement == document) {
			return false;
		}
		if (jQuery(htmlElement).hasClass('jl-popup-panel')) {
			return true;
		} else {
			return jslet.ui.inPopupPanel(htmlElement.parentNode);
		}
	};
	
	/**
	* Get the specified level parent element. Example:
	* <pre><code>
	*  //html snippet is: body -> div1 -> div2 ->table
	*  jslet.ui.getParentElement(div2); // return div1
	*  jslet.ui.getParentElement(div2, 2); //return body 
	* </code></pre>
	* 
	* @param {Html Element} htmlElement html element as start point
	* @param {Integer} level level
	* 
	* @return {Html Element} Parent element, if not found, return null.
	*/
	jslet.ui.getParentElement = function (htmlElement, level) {
		if (!level) {
			level = 1;
		}
		var flag = htmlElement.parentElement ? true : false,
		result = htmlElement;
		for (var i = 0; i < level; i++) {
			if (flag) {
				result = result.parentElement;
			} else {
				result = result.parentNode;
			}
			if (!result) {
				return null;
			}
		}
		return result;
	};
	
	/**
	* Find first parent with specified condition. Example:
	* <pre><code>
	*   //Html snippet: body ->div1 ->div2 -> div3
	*	var odiv = jslet.ui.findFirstParent(
	*		odiv3, 
	*		function (node) {return node.class == 'head';},
	*		function (node) {return node.tagName != 'BODY'}
	*   );
	* </code></pre>
	* 
	* @param {Html Element} element The start checking html element
	* @param {Function} conditionFn Callback function: function(node}{...}, node is html element;
	*			if conditionFn return true, break finding and return 'node'
	* @param {Function} stopConditionFn Callback function: function(node}{...}, node is html element;
	*			if stopConditionFn return true, break finding and return null
	* 
	* @return {Html Element} Parent element or null
	*/
	jslet.ui.findFirstParent = function (htmlElement, conditionFn, stopConditionFn) {
		var p = htmlElement;
		if (!p) {
			return null;
		}
		if (!conditionFn) {
			return p.parentNode;
		}
		if (conditionFn(p)) {
			return p;
		} else {
			if (stopConditionFn && stopConditionFn(p.parentNode)) {
				return null;
			}
			return jslet.ui.findFirstParent(p.parentNode, conditionFn, stopConditionFn);
		}
	};
	
	/**
	 * Find parent element that has 'jslet' property
	 * 
	 * @param {Html Element} element The start checking html element
	 * @return {Html Element} Parent element or null
	 */
	jslet.ui.findJsletParent = function(element){
		return jslet.ui.findFirstParent(element, function(ele){
			return ele.jslet ? true:false; 
		});
	};
	
	/**
	 * Check one node is a child of another node or not.
	 * 
	 * @param {Html Element} parentNode parent node;
	 * @param {Html Element} testNode, testing node
	 * @return {Boolean} true - 'testNode' is a child of 'parentNode', false - otherwise.
	 */
	jslet.ui.isChild = function(parentNode, testNode) {
		if(!parentNode || !testNode) {
			return false;
		}
		var p = testNode;
		while(p) {
			if(p == parentNode) {
				return true;
			}
			p = p.parentNode;
		}
		return false;
	};
	
	/**
	* Text Measurer, measure the display width or height of the given text. Example:
	* <pre><code>
	*   jslet.ui.textMeasurer.setElement(document.body);
	*   try{
			var width = jslet.ui.textMeasurer.getWidth('HellowWorld');
			var height = jslet.ui.textMeasurer.getHeight('HellowWorld');
		}finally{
			jslet.ui.textMeasurer.setElement();
		}
	* </code></pre>
	* 
	*/
	jslet.ui.TextMeasurer = function () {
		var rule,felement = document.body,felementWidth;
	
		var lastText = null;
		
		var createRule = function () {
			if (!rule) {
				rule = document.createElement('div');
				document.body.appendChild(rule);
				rule.style.position = 'absolute';
				rule.style.left = '-9999px';
				rule.style.top = '-9999px';
				rule.style.display = 'none';
				rule.style.margin = '0px';
				rule.style.padding = '0px';
				rule.style.overflow = 'hidden';
			}
			if (!felement) {
				felement = document.body;
			}
		};
	
		/**
		 * Set html element which to be used as rule. 
		 * 
		 * @param {Html Element} element 
		 */
		this.setElement = function (element) {
			felement = element;
			if (!felement) {
				return;
			}
			createRule();
			rule.style.fontSize = felement.style.fontSize;
			rule.style.fontStyle = felement.style.fontStyle;
			rule.style.fontWeight = felement.style.fontWeight;
			rule.style.fontFamily = felement.style.fontFamily;
			rule.style.lineHeight = felement.style.lineHeight;
			rule.style.textTransform = felement.style.textTransform;
			rule.style.letterSpacing = felement.style.letterSpacing;
		};
	
		this.setElementWidth = function (width) {
			felementWidth = width;
			if (!felement) {
				return;
			}
			if (width) {
				felement.style.width = width;
			} else {
				felement.style.width = '';
			}
		};
	
		function updateText(text){
			if (lastText != text) {
				rule.innerHTML = text;
			}
		}
		
		/**
		 * Get the display size of specified text
		 * 
		 * @param {String} text The text to be measured
		 * 
		 * @return {Integer} Display size, unit: px
		 */
		this.getSize = function (text) {
			createRule();
			updateText(text);
			var ruleObj = jQuery(rule);
			return {width:ruleObj.width(),height:ruleObj.height()};
		};
	
		/**
		 * Get the display width of specified text
		 * 
		 * @param {String} text The text to be measured
		 * 
		 * @return {Integer} Display width, unit: px
		 */
		this.getWidth = function (text) {
			return this.getSize(text).width;
		};
	
		/**
		 * Get the display height of specified text
		 * 
		 * @param {String} text The text to be measured
		 * 
		 * @return {Integer} Display height, unit: px
		 */
		this.getHeight = function (text) {
			return this.getSize(text).height;
		};
	};
	
	jslet.ui.textMeasurer = new jslet.ui.TextMeasurer();
	
	/**
	 * Get css property value. Example:
	 * <pre><code>
	 * var width = jslet.ui.getCssValue('fooClass', 'width'); //Return value like '100px' or '200em'
	 * </code></pre>
	 * 
	 * @param {String} className Css class name.
	 * @param {String} styleName style name
	 * 
	 * @return {String} Css property value.
	 */
	jslet.ui.getCssValue = function(className, styleName){
		var odiv = document.createElement('div');
		odiv.className = className;
		odiv.style.display = 'none';
		document.body.appendChild(odiv);
		var result = jQuery(odiv).css(styleName);
		
		document.body.removeChild(odiv);
		return result;
	};
	
	jslet.ui.setEditableStyle = function(formElement, disabled, readOnly, onlySetStyle, required) {
		if(!onlySetStyle) {
			formElement.disabled = disabled;
			formElement.readOnly = readOnly;
		}
		var jqEl = jQuery(formElement);
		if(disabled || readOnly) {
			if (!jqEl.hasClass('jl-readonly')) {
				jqEl.addClass('jl-readonly');
				jqEl.removeClass('jl-ctrl-required');
			}
		} else {
			jqEl.removeClass('jl-readonly');
			if(required) {
				jqEl.addClass('jl-ctrl-required');
			}
		}
	};
	
	/**
	 * Get system scroll bar width
	 * 
	 * @return {Integer} scroll bar width
	 */
	jslet.scrollbarSize = function() {
		var parent, child, width, height;
	
		if (width === undefined) {
			parent = jQuery('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
			child = parent.children();
			width = child.innerWidth() - child.height(99).innerWidth();
			parent.remove();
		}
	
		return width;
	};
	
	/**
	 * Control focus manager.
	 * 
	 * @param containerId {String} container id, if containerid is not specified, container is document.
	 */
	jslet.ui.FocusManager = function(containerId) {
		this._onChangingFocus = null;
		this._focusKeyCode = null;
		this._containerId = containerId;
		
		this.initialize();
	}
	
	jslet.ui.FocusManager.prototype = {
		/**
		 * Get or set onChangingFocus event handler. 
		 * 
		 * @param onChangingFocus {Function} event handler, pattern:
		 * function doChangingFocus(element, reserve, datasetObj, fieldName) {
		 * 		console.log('Changind focus');
		 * }
		 * 
		 * focusManager.onChangingFocus(doChangingFocus);
		 * 
		 */
		onChangingFocus: function(onChangingFocus) {
			if(onChangingFocus === undefined) {
				return this._onChangingFocus;
			}
			jslet.Checker.test('FocusManager.onChangingFocus', onChangingFocus).isFunction();
			this._onChangingFocus = onChangingFocus;
		},
		
		/**
		 * Get or set 'focusKeyCode'
		 * 
		 * @param {Integer} focusKeyCode - Key code for changing focus.
		 * 
		 */
		focusKeyCode: function(focusKeyCode) {
			if(focusKeyCode === undefined) {
				return this._focusKeyCode;
			}
			jslet.Checker.test('FocusManager.focusKeyCode', focusKeyCode).isNumber();
			this._focusKeyCode = focusKeyCode;
		},
		
		initialize: function() {
			function isTabableElement(ele) {
				var tagName = ele.tagName;
				if(tagName == 'TEXTAREA' || tagName == 'A' || tagName == 'BUTTON') {
					return false;
				}
				if(tagName == 'INPUT') {
					var typeAttr = ele.type;
					if(typeAttr == 'button' || typeAttr == 'image' || typeAttr == 'reset' || typeAttr == 'submit' || typeAttr == 'url' || typeAttr == 'file') {
						return false;
					}
				}
				return true;
			}
			
			var Z = this;
			
			function doChangingFocus(ele, reverse) {
				var ojslet = jslet(ele), 
					dsObj = null, fldName = null, valueIndex = null;
				if(ojslet) {
					if(ojslet.dataset) {
						dsObj = ojslet.dataset();	
					}
					
					if(ojslet.field) {
						fldName = ojslet.field();	
					}
					
					if(ojslet.valueIndex) {
						valueIndex = ojslet.valueIndex();
					}
				}
				if(!Z._onChangingFocus) {
					return true;
				}
				return Z._onChangingFocus(ele, reverse, dsObj, fldName, valueIndex);
			}
			
			function handleHostKeyDown(event) {
				var focusKeyCode = Z._focusKeyCode || jslet.global.defaultFocusKeyCode || 9;
				var keyCode = event.which;
				if(keyCode === focusKeyCode || keyCode === 9) {
					if(keyCode !== 9 && !isTabableElement(event.target)) {
						return;
					}
					if(this._containerId) {
						jqHost = jQuery('#' + this._containerId);
						if(jqHost.length === 0) {
							throw new Error('Not found container: ' + this._containerId);
						}
					} else {
						jqHost = jQuery(document);
					}
					
					if(event.shiftKey){
						jQuery.tabPrev(jqHost, true, doChangingFocus);
					}
					else{
						jQuery.tabNext(jqHost, true, doChangingFocus);
					}
					event.preventDefault();
		       		event.stopImmediatePropagation();
		       		return false;
				}
			}
			var jqHost;
			if(this._containerId) {
				jqHost = jQuery('#' + this._containerId);
				if(jqHost.length === 0) {
					throw new Error('Not found container: ' + this._containerId);
				}
			} else {
				jqHost = jQuery(document);
			}
			jqHost.keydown(handleHostKeyDown);
		}
	}
	
	jslet.ui.rootFocusManager = new jslet.ui.FocusManager();
	
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.calendar.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class Calendar. Example:
	 * <pre><code>
	 *  var jsletParam = {type:"Calendar"};
	 *  //1. Declaring:
	 *    &lt;div data-jslet='type:"Calendar"' />
	 *
	 *  //2. Binding
	 *    &lt;div id='ctrlId' />
	 *    //js snippet 
	 *    var el = document.getElementById('ctrlId');
	 *    jslet.ui.bindControl(el, jsletParam);
	 *	
	 *  //3. Create dynamically
	 *    jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.Calendar = jslet.Class.create(jslet.ui.Control, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.el = el;
			Z.allProperties = 'value,onDateSelected,minDate,maxDate';
	
			Z._value = null;
			
			Z._onDateSelected = null;
			
			Z._minDate = null;
	
			Z._maxDate = null;
			
			Z._currYear = 0;
			Z._currMonth = 0;
			Z._currDate = 0;
			
			$super(el, params);
		},
	
		/**
		 * Calendar value.
		 * 
		 * @param {Date or undefined} value calendar value.
		 * @param {Date or undefined}
		 */
		value: function(value) {
			if(value === undefined) {
				return this._value;
			}
			jslet.Checker.test('Calendar.value', value).isDate();
			this._value = value;
		},
		
		/**
		 * Set or get minimum date of calendar range.
		 * 
		 * @param {Date or undefined} minDate minimum date of calendar range 
		 * @return {this or Date}
		 */
		minDate: function(minDate) {
			if(minDate === undefined) {
				return this._minDate;
			}
			jslet.Checker.test('Calendar.minDate', minDate).isDate();
			this._minDate = minDate;
		},
		
		/**
		 * Set or get maximum date of calendar range.
		 * 
		 * @param {Date or undefined} maxDate maximum date of calendar range 
		 * @return {this or Date}
		 */
		maxDate: function(maxDate) {
			if(maxDate === undefined) {
				return this._maxDate;
			}
			jslet.Checker.test('Calendar.maxDate', maxDate).isDate();
			this._maxDate = maxDate;
		},
			
		/**
		 * Fired when user select a date.
		 * Pattern: 
		 *	function(value){}
		 *	//value: Date
		 *
		 * @param {Function or undefined} onDateSelected Date selected event handler.
		 * @return {this or Function}
		 */
		onDateSelected: function(onDateSelected) {
			if(onDateSelected === undefined) {
				return this._onDateSelected;
			}
			jslet.Checker.test('Calendar.onDateSelected', onDateSelected).isFunction();
			this._onDateSelected = onDateSelected;
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
			jqEl = jQuery(Z.el);
			if (!jqEl.hasClass('jl-calendar')) {
				jqEl.addClass('jl-calendar panel panel-default');
			}
			var template = ['<div class="jl-cal-header">',
				'<a class="jl-cal-btn jl-cal-yprev" title="', jslet.locale.Calendar.yearPrev,
				'" href="javascript:;">&lt;&lt;</a><a href="javascript:;" class="jl-cal-btn jl-cal-mprev" title="', jslet.locale.Calendar.monthPrev, '">&lt;',
				'</a><a href="javascript:;" class="jl-cal-title"></a><a href="javascript:;" class="jl-cal-btn jl-cal-mnext" title="', jslet.locale.Calendar.monthNext, '">&gt;',
				'</a><a href="javascript:;" class="jl-cal-btn jl-cal-ynext" title="', jslet.locale.Calendar.yearNext, '">&gt;&gt;</a>',
			'</div>',
			'<div class="jl-cal-body">',
				'<table cellpadding="0" cellspacing="0">',
					'<thead><tr><th class="jl-cal-weekend">',
					jslet.locale.Calendar.Sun,
						'</th><th>',
						jslet.locale.Calendar.Mon,
							'</th><th>',
						jslet.locale.Calendar.Tue,
							'</th><th>',
						jslet.locale.Calendar.Wed,
							'</th><th>',
						jslet.locale.Calendar.Thu,
							'</th><th>',
						jslet.locale.Calendar.Fri,
							'</th><th class="jl-cal-weekend">',
						jslet.locale.Calendar.Sat,
							'</th></tr></thead><tbody>',
							'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
							'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
							'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
							'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
							'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
							'<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
							'</tbody></table></div><div class="jl-cal-footer"><a class="jl-cal-today" href="javascript:;">', jslet.locale.Calendar.today, '</a></div>'];
	
			jqEl.html(template.join(''));
			var jqTable = jqEl.find('.jl-cal-body table');
			Z._currYear = -1;
			jqTable.on('click', Z._doTableClick);
			
			var dvalue = Z._value && jslet.isDate(Z._value) ? Z._value : new Date();
			this.setValue(dvalue);
			jqEl.find('.jl-cal-today').click(function (event) {
				var d = new Date();
				Z.setValue(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
				Z._fireSelectedEvent();
			});
			
			jqEl.find('.jl-cal-yprev').click(function (event) {
				Z.incYear(-1);
			});
			
			jqEl.find('.jl-cal-mprev').click(function (event) {
				Z.incMonth(-1);
			});
			
			jqEl.find('.jl-cal-ynext').click(function (event) {
				Z.incYear(1);
			});
			
			jqEl.find('.jl-cal-mnext').click(function (event) {
				Z.incMonth(1);
			});
			
			jqEl.on('keydown', function(event){
				var ctrlKey = event.ctrlKey,
					keyCode = event.keyCode;
				var delta = 0;
				if(keyCode == jslet.ui.KeyCode.UP) {
					if(ctrlKey) {
						Z.incYear(-1);
					} else {
						Z.incDate(-7);
					}
					event.preventDefault();
					return;
				} 
				if(keyCode == jslet.ui.KeyCode.DOWN) {
					if(ctrlKey) {
						Z.incYear(1);
					} else {
						Z.incDate(7);
					}
					event.preventDefault();
					return;
				}
				if(keyCode == jslet.ui.KeyCode.LEFT) {
					if(ctrlKey) {
						Z.incMonth(-1);
					} else {
						Z.incDate(-1);
					}
					event.preventDefault();
					return;
				}
				if(keyCode == jslet.ui.KeyCode.RIGHT) {
					if(ctrlKey) {
						Z.incMonth(1);
					} else {
						Z.incDate(1);
					}
					event.preventDefault();
					return;
				}
			});
		},
		
		_getNotNullDate: function() {
			var value =this._value;
			if(!value) {
				value = new Date();
			}
			return value;
		},
		
		incDate: function(deltaDay) {
			var value = this._getNotNullDate();
			value.setDate(value.getDate() + deltaDay);
			this.setValue(value);
		},
		
		incMonth: function(deltaMonth) {
			var value = this._getNotNullDate();
			value.setMonth(value.getMonth() + deltaMonth);
			this.setValue(value);
		},
		
		incYear: function(deltaYear) {
			var value = this._getNotNullDate();
			value.setFullYear(value.getFullYear() + deltaYear);
			this.setValue(value);
		},
		
		/**
		 * Set date value of calendar.
		 * 
		 * @param {Date} value Calendar date
		 */
		setValue: function (value) {
			if (!value) {
				return;
			}
	
			var Z = this;
			if (Z._minDate && value < Z._minDate) {
				value = new Date(Z._minDate.getTime());
			}
			if (Z._maxDate && value > Z._maxDate) {
				value = new Date(Z._maxDate.getTime());
			}
			Z._value = value;
			var y = value.getFullYear(), 
				m = value.getMonth();
			if (Z._currYear == y && Z._currMonth == m) {
				Z._setCurrDateCls();
			} else {
				Z._refreshDateCell(y, m);
			}
		},
	
		focus: function() {
			var Z = this,
				jqEl = jQuery(Z.el);
			jqEl.find('.jl-cal-current')[0].focus();
	
		},
		
		_checkNaviState: function () {
			var Z = this,
				jqEl = jQuery(Z.el), flag, btnToday;
			if (Z._minDate) {
				var minY = Z._minDate.getFullYear(),
					minM = Z._minDate.getMonth(),
					btnYearPrev = jqEl.find('.jl-cal-yprev')[0];
				flag = (Z._currYear <= minY);
				btnYearPrev.style.visibility = (flag ? 'hidden' : 'visible');
	
				flag = (Z._currYear == minY && Z._currMonth <= minM);
				var btnMonthPrev = jqEl.find('.jl-cal-mprev')[0];
				btnMonthPrev.style.visibility = (flag ? 'hidden' : 'visible');
	
				flag = (Z._minDate > new Date());
				btnToday = jqEl.find('.jl-cal-today')[0];
				btnToday.style.visibility = (flag ? 'hidden' : 'visible');
			}
	
			if (Z._maxDate) {
				var maxY = Z._maxDate.getFullYear(),
					maxM = Z._maxDate.getMonth(),
					btnYearNext = jqEl.find('.jl-cal-ynext')[0];
				flag = (Z._currYear >= maxY);
				btnYearNext.jslet_disabled = flag;
				btnYearNext.style.visibility = (flag ? 'hidden' : 'visible');
	
				flag = (Z._currYear == maxY && Z._currMonth >= maxM);
				var btnMonthNext = jqEl.find('.jl-cal-mnext')[0];
				btnMonthNext.jslet_disabled = flag;
				btnMonthNext.style.visibility = (flag ? 'hidden' : 'visible');
	
				flag = (Z._maxDate < new Date());
				btnToday = jqEl.find('.jl-cal-today')[0];
				btnToday.style.visibility = (flag ? 'hidden' : 'visible');
			}
		},
	
		_refreshDateCell: function (year, month) {
			var Z = this,
				jqEl = jQuery(Z.el),
				monthnames = jslet.locale.Calendar.monthNames,
				mname = monthnames[month],
				otitle = jqEl.find('.jl-cal-title')[0];
			otitle.innerHTML = mname + ',' + year;
			var otable = jqEl.find('.jl-cal-body table')[0],
				rows = otable.tBodies[0].rows,
				firstDay = new Date(year, month, 1),
				w1 = firstDay.getDay(),
				oneDayMs = 86400000, //24 * 60 * 60 * 1000
				date = new Date(firstDay.getTime() - (w1 + 1) * oneDayMs);
			date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	
			var rowCnt = rows.length, otr, otd, m, oa;
			for (var i = 1; i <= rowCnt; i++) {
				otr = rows[i - 1];
				for (var j = 1, tdCnt = otr.cells.length; j <= tdCnt; j++) {
					otd = otr.cells[j - 1];
					date = new Date(date.getTime() + oneDayMs);
					oa = otd.firstChild;
					if (Z._minDate && date < Z._minDate || Z._maxDate && date > Z._maxDate) {
						oa.innerHTML = '';
						otd.jslet_date_value = null;
						continue;
					} else {
						oa.innerHTML = date.getDate();
						otd.jslet_date_value = date;
					}
					m = date.getMonth();
					if (m != month) {
						jQuery(otd).addClass('jl-cal-disable');
					} else {
						jQuery(otd).removeClass('jl-cal-disable');
					}
				} //end for j
			} //end for i
			Z._currYear = year;
			Z._currMonth = month;
			Z._setCurrDateCls();
			Z._checkNaviState();
		},
		
		_fireSelectedEvent: function() {
			var Z = this;
			if (Z._onDateSelected) {
				Z._onDateSelected.call(Z, Z._value);
			}
		},
		
		_doTableClick: function (event) {
			event = jQuery.event.fix( event || window.event );
			var node = event.target,
				otd = node.parentNode;
			
			if (otd && otd.tagName && otd.tagName.toLowerCase() == 'td') {
				if (!otd.jslet_date_value) {
					return;
				}
				var el = jslet.ui.findFirstParent(otd, function (node) { return node.jslet; });
				var Z = el.jslet;
				Z._value = otd.jslet_date_value;
				Z._setCurrDateCls();
				try{
				otd.firstChild.focus();
				}catch(e){
				}
				Z._fireSelectedEvent();
			}
		},
	
		_setCurrDateCls: function () {
			var Z = this;
			if (!jslet.isDate(Z._value)) {
				return;
			}
			var currM = Z._value.getMonth(),
				currY = Z._value.getFullYear(),
				currD = Z._value.getDate(),
				otable = jqEl.find('.jl-cal-body table')[0],
				rows = otable.tBodies[0].rows,
				rowCnt = rows.length, otr, otd, m, d, y, date, jqLink;
			for (var i = 0; i < rowCnt; i++) {
				otr = rows[i];
				for (var j = 0, tdCnt = otr.cells.length; j < tdCnt; j++) {
					otd = otr.cells[j];
					date = otd.jslet_date_value;
					if (!date) {
						continue;
					}
					m = date.getMonth();
					y = date.getFullYear();
					d = date.getDate();
					jqLink = jQuery(otd.firstChild);
					if (y == currY && m == currM && d == currD) {
						if (!jqLink.hasClass('jl-cal-current')) {
							jqLink.addClass('jl-cal-current');
						}
						try{
							otd.firstChild.focus();
						} catch(e){
						}
					} else {
						jqLink.removeClass('jl-cal-current');
					}
				}
			}
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var jqEl = jQuery(this.el);
			jqEl.off();
			jqEl.find('.jl-cal-body table').off();
			jqEl.find('.jl-cal-today').off();
			jqEl.find('.jl-cal-yprev').off();
			jqEl.find('.jl-cal-mprev').off();
			jqEl.find('.jl-cal-mnext').off();
			jqEl.find('.jl-cal-ynext').off();
			$super();
		}
	});
	jslet.ui.register('Calendar', jslet.ui.Calendar);
	jslet.ui.Calendar.htmlTemplate = '<div></div>';
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.overlaypanel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	* @class Overlay panel. Example:
	* <pre><code>
	*  var overlay = new jslet.ui.OverlayPanel(Z.el.parentNode);
	*  overlay.setZIndex(999);
	*  overlay.show();
	* </code></pre>
	* 
	* @param {Html Element} container Html Element that OverlayPanel will cover.
	* @param {String} color Color String.
	*/
	jslet.ui.OverlayPanel = function (container, color) {
		var odiv = document.createElement('div');
		jQuery(odiv).addClass('jl-overlay').on('click', function(event){
			event.stopPropagation();
			event.preventDefault();
		});
		
		if (color) {
			odiv.style.backgroundColor = color;
		}
		var left, top, width, height;
		if (!container) {
			var jqBody = jQuery(document.body);
			left = 0;
			top = 0;
			width = jqBody.width();
			height = jqBody.height();
		} else {
			width = jQuery(container).width();
			height = jQuery(container).height();
		}
		odiv.style.left = '0px';
		odiv.style.top = '0px';
		odiv.style.bottom = '0px';
		odiv.style.right = '0px';
		if (!container) {
			document.body.appendChild(odiv);
		} else {
			container.appendChild(odiv);
		}
		odiv.style.display = 'none';
	
		var oldResizeHanlder = null;
		if (!container) {
			oldResizeHanlder = window.onresize;
	
			window.onresize = function () {
				odiv.style.width = document.body.scrollWidth + 'px';
				odiv.style.height = document.body.scrollHeight + 'px';
			};
		} else {
			oldResizeHanlder = container.onresize;
			container.onresize = function () {
				var width = jQuery(container).width() - 12;
				var height = jQuery(container).height() - 12;
				odiv.style.width = width + 'px';
				odiv.style.height = height + 'px';
			};
		}
	
		this.overlayPanel = odiv;
	
		/**
		 * Show overlay panel
		 */
		this.show = function () {
			odiv.style.display = 'block';
			return odiv;
		};
	
		/**
		 * Hide overlay panel
		 */
		this.hide = function () {
			odiv.style.display = 'none';
			return odiv;
		};
		
		/**
		 * Set Z-index 
		 * 
		 * @param {Integer} zIndex Z-Index
		 */
		this.setZIndex = function(zIndex){
			this.overlayPanel.style.zIndex = zIndex;
		};
	
		this.destroy = function () {
			this.hide();
			if (!container) {
				window.onresize = oldResizeHanlder;
				document.body.removeChild(odiv);
			} else {
				container.onresize = oldResizeHanlder;
				container.removeChild(odiv);
			}
			jQuery(this.overlayPanel).off();
		};
	};
	
	/* ========================================================================
	 * Jslet framework: jslet.splitpanel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class Split Panel. Example:
	 * <pre><code>
	 * var jsletParam = {type:"SplitPanel",direction:"hori",floatIndex: 1};
	 * //1. Declaring:
	 *     &lt;div data-jslet='jsletParam' style="width: 300px; height: 400px;">
	 *     &lt;div>content1&lt;/div>
	 *     &lt;div>content2&lt;/div>
	 *     &lt;/div>
	 *     
	 *  //2. Binding
	 *     &lt;div id='ctrlId'>
	 *       &lt;div>content1&lt;/div>
	 *       &lt;div>content2&lt;/div>
	 *     &lt;/div>
	 *     //Js snippet
	 *     var el = document.getElementById('ctrlId');
	 *     jslet.ui.bindControl(el, jsletParam);
	 *	
	 *  //3. Create dynamically
	 *     jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.SplitPanel = jslet.Class.create(jslet.ui.Control, {
		directions: ['hori', 'vert'],
		
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.el = el;
			Z.allProperties = 'direction,floatIndex,onExpanded,onSize';//{size:100, align:-1/0/1,minSize:10}
	
			Z._direction = 'hori';
	
			Z._floatIndex = 1;
			
			Z._onExpanded = null;
			
			Z._onSize = null;
			
			Z.panels = null; //Array, panel configuration
			Z.splitter = null;
			Z._oldSize = 0;
			jslet.resizeEventBus.subscribe(Z);
			$super(el, params);
		},
	
		/**
		 * Get or set float panel index, only one panel can be a floating panel.
		 * 
		 * @param {Integer or undefined} index float panel index.
		 * @return {this or Integer}
		 */
		floatIndex: function(index) {
			if(index === undefined) {
				return this._floatIndex;
			}
			jslet.Checker.test('SplitPanel.floatIndex', index).isGTEZero();
			this._floatIndex = index;
		},
		
		/**
		 * Get or set Split direction, optional value: hori, vert
		 * Default value is 'hori'
		 * 
		 * @param {String or undefined} direction optional value: hori, vert.
		 * @return {this or String}
		 */
		direction: function(direction) {
			if(direction === undefined) {
				return this._direction;
			}
			direction = jQuery.trim(direction);
			var checker = jslet.Checker.test('SplitPanel.direction', direction).required().isString();
			direction = direction.toLowerCase();
			checker.inArray(this.directions);
			this._direction = direction;
		},
		
		/**
		 * Fired when user expand/collapse one panel.
		 *  Pattern: 
		 *	function(panelIndex){} 
		 *	//panelIndex: Integer
		 *
		 * @param {Function or undefined} onExpanded expanded event handler.
		 * @return {this or Function}
		 */
		onExpanded: function(onExpanded) {
			if(onExpanded === undefined) {
				return this._onExpanded;
			}
			jslet.Checker.test('SplitPanel.onExpanded', onExpanded).isFunction();
			this._onExpanded = onExpanded;
		},
		
		/**
		 * Fired after user change size of one panel.
		 *  Pattern: 
		 *	function(panelIndex, newSize){} 
		 *	//panelIndex: Integer
		 *	//newSize: Integer
		 *
		 * @param {Function or undefined} onExpanded resize event handler.
		 * @return {this or Function}
		 */
		onSize: function(onSize) {
			if(onSize === undefined) {
				return this._onSize;
			}
			jslet.Checker.test('SplitPanel.onSize', onSize).isFunction();
			this._onSize = onSize;
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
			if (!jqEl.hasClass('jl-splitpanel')) {
				jqEl.addClass('jl-splitpanel jl-border-box jl-round5');
			}
			Z.isHori = (Z._direction == 'hori');
			
			Z.width = jqEl.innerWidth();
			Z.height = jqEl.innerHeight();
			Z._oldSize = Z.isHori ? Z.width: Z.height;
			
			var panelDivs = jqEl.find('>div'),
				lastIndex = panelDivs.length - 1;
			if (!Z._floatIndex || Z._floatIndex > lastIndex) {
				Z._floatIndex = lastIndex;
			}
			if (Z._floatIndex > lastIndex) {
				Z._floatIndex = lastIndex;
			}
			if (!Z.panels) {
				Z.panels = [];
			}
			var containerSize = (Z.isHori ? Z.width : Z.height), sumSize = 0;
	
			panelDivs.each(function(k){
				var jqPanel = jQuery(panelDivs[k]),
					oPanel = Z.panels[k];
				if (!oPanel){
					oPanel = {};
					Z.panels[k] = oPanel;
				}
	
				var minSize = parseInt(jqPanel.css(Z.isHori ?'min-width': 'min-height'));
				oPanel.minSize = minSize ? minSize : 5;
				
				var maxSize = parseInt(jqPanel.css(Z.isHori ?'max-width': 'max-height'));
				oPanel.maxSize = maxSize ? maxSize : Infinity;
				oPanel.expanded = jqPanel.css('display') != 'none';
				
				var size = oPanel.size;
				if (size === null || size === undefined) {
					size = Z.isHori ? jqPanel.outerWidth(): jqPanel.outerHeight();
				} else {
					if (Z.isHori) {
						jqPanel.width(size - 5);
					} else {
						jqPanel.height(size - 5);
					}
				}
					
				if (k != Z._floatIndex){
					sumSize += size;
					oPanel.size = size;
				}
			});
			Z.panels[Z._floatIndex].size = containerSize - sumSize;
			
			Z.splitterTracker = document.createElement('div');
			var jqTracker = jQuery(Z.splitterTracker);
			jqTracker.addClass('jl-sp-splitter-tracker');
			var fixedSize = 0,
				clsName = Z.isHori ? 'jl-sp-panel-hori': 'jl-sp-panel-vert';
			Z.splitterClsName = Z.isHori ? 'jl-sp-splitter-hori': 'jl-sp-splitter-vert';
			Z.el.appendChild(Z.splitterTracker);
			if (Z.isHori) {
				Z.splitterTracker.style.height = '100%';
			} else {
				Z.splitterTracker.style.width = '100%';
			}
			var splitterSize = parseInt(jslet.ui.getCssValue(Z.splitterClsName, Z.isHori? 'width' : 'height'));
			panelDivs.after(function(k){
				var panel = panelDivs[k],
				jqPanel = jQuery(panel),
				expanded = Z.panels[k].expanded;
				
				jqPanel.addClass(clsName);
	
				if (k == Z._floatIndex) {
					Z.floatPanel = panel;
				} else {
					if (expanded) {
						fixedSize += splitterSize + Z.panels[k].size;
					} else {
						jqPanel.css('display', 'none');
						fixedSize += splitterSize;
					}
				}
				if (k == lastIndex){
					if (Z.isHori) {
						return '<div style="clear:both;width:0px"></div>';
					}
					return '';
				}
				var id = jslet.nextId(),
					minBtnCls = Z.isHori ? 'jl-sp-button-left' : 'jl-sp-button-top';
					
				if (Z._floatIndex <= k || !expanded) {
					minBtnCls += Z.isHori ? ' jl-sp-button-right' : ' jl-sp-button-bottom';
				}
				return '<div class="'+ Z.splitterClsName + ' jl-unselectable" id = "' + id + 
				'" jsletindex="'+ (k >= Z._floatIndex ? k+1: k)+ '"><div class="jl-sp-button ' + 
				minBtnCls +'"' + (expanded ? '': ' jsletcollapsed="1"') +'></div></div>';
			});
			if (Z.isHori) {
				jQuery(Z.floatPanel).width(jqEl.innerWidth() - fixedSize - 4);
			} else {
				jQuery(Z.floatPanel).height(jqEl.innerHeight() - fixedSize);
			}
			var splitters = jqEl.find('.'+Z.splitterClsName);
			splitters.on('mousedown', Z._splitterMouseDown);
			var splitBtns = splitters.children();
			splitBtns.on('mousedown', function(event){
				var jqBtn = jQuery(event.target),
					jqSplitter = jqBtn.parent(),
					index = parseInt(jqSplitter.attr('jsletindex'));
				Z.expand(index);
				event.stopPropagation();
			});
			
			var oSplitter;
			for(var i = 0, cnt = splitters.length; i < cnt; i++){
				oSplitter = splitters[i];
				oSplitter._doDragStart = Z._splitterDragStart;
				oSplitter._doDragging = Z._splitterDragging;
				oSplitter._doDragEnd = Z._splitterDragEnd;
				oSplitter._doDragCancel = Z._splitterDragCancel;
			}
		},
		
		/**
		 * Get float panel
		 * 
		 * @return {Html Element} 
		 */
		floatPanel: function(){
			return Z.panels[Z._floatIndex];	
		},
		
		changeSize: function(k, size){
			
		},
		
		/**
		 * Expand or collapse the specified panel
		 * 
		 * @param {Integer} index Panel index
		 * @param {Boolean} expanded True for expanded, false otherwise.
		 */
		expand: function(index, expanded, notChangeSize){
			var Z = this, jqPanel, jqEl = jQuery(Z.el),
				splitters = jqEl.find('.'+Z.splitterClsName);
			if (index < 0 || index > splitters.length) {
				return;
			}
			var	jqSplitter = jQuery(splitters[(index >= Z._floatIndex ? index - 1: index)]),
				jqBtn = jqSplitter.find(':first-child');
				
			if (expanded === undefined) {
				expanded  = jqBtn.attr('jsletcollapsed')=='1';
			}
			if (index < Z._floatIndex) {
				jqPanel = jqSplitter.prev();
			} else {
				jqPanel = jqSplitter.next();
			}
			if (Z.isHori){
				if (jqBtn.hasClass('jl-sp-button-right')) {
					jqBtn.removeClass('jl-sp-button-right');
				} else {
					jqBtn.addClass('jl-sp-button-right');
				}
			} else {
				if (jqBtn.hasClass('jl-sp-button-bottom')) {
					jqBtn.removeClass('jl-sp-button-bottom');
				} else {
					jqBtn.addClass('jl-sp-button-bottom');
				}
			}
	
			if (expanded){
				jqPanel.css('display', 'block');
				jqBtn.attr('jsletcollapsed', '0');
			}else{
				jqPanel.css('display','none');
				jqBtn.attr('jsletcollapsed', '1');
			}
			if(notChangeSize) {
				return;
			}
			var jqFp = jQuery(Z.floatPanel);
			if (Z.isHori) {
				jqFp.width(jqFp.width()+jqPanel.width()*(expanded ? -1: 1));
			} else {
				jqFp.height(jqFp.height()+jqPanel.height()*(expanded ? -1: 1));
			}
			Z.panels[index].expanded = expanded;
			if (Z._onExpanded) {
				Z._onExpanded.call(Z, panelIndex);
			}
			jslet.resizeEventBus.resize(Z.el);
		},
		
		/**
		 * @private
		 */
		_splitterMouseDown: function(event){
			var pos = jQuery(this).position(),
				Z = this.parentNode.jslet;
			Z.splitterTracker.style.top = pos.top + 'px';
			Z.splitterTracker.style.left = pos.left + 'px';
			Z.draggingId = this.id;
			var jqSplitter = jQuery('#'+Z.draggingId);
			jqBtn = jqSplitter.find(':first-child');
			if(jqBtn.attr('jsletcollapsed')=='1') { //Collapsed
				jqBtn.click();
				return;
			}
			
			jslet.ui.dnd.bindControl(this);
		},
			
		/**
		 * @private
		 */
		_splitterDragStart: function (oldX, oldY, x, y, deltaX, deltaY){
			var Z = this.parentNode.jslet,
				jqTracker = jQuery(Z.splitterTracker),
				jqSplitter = jQuery('#'+Z.draggingId),
				index = parseInt(jqSplitter.attr('jsletindex')),
				cfg = Z.panels[index],
				jqFp = jQuery(Z.floatPanel);
			
			Z.dragRangeMin = cfg.size - cfg.minSize;
			Z.dragRangeMax = cfg.maxSize - cfg.size;
			var fpMax = (Z.isHori ? jqFp.width() : jqFp.height()) - Z.panels[Z._floatIndex].minSize;
			if (Z.dragRangeMax > fpMax) {
				Z.dragRangeMax = fpMax;
			}
			jqTracker.show();
		},
		
		/**
		 * @private
		 */
		_splitterDragging: function (oldX, oldY, x, y, deltaX, deltaY){
			var Z = this.parentNode.jslet,
				jqTracker = jQuery(Z.splitterTracker),
				jqSplitter = jQuery('#'+Z.draggingId),
				index = parseInt(jqSplitter.attr('jsletindex')),
				delta = Math.abs(Z.isHori ? deltaX : deltaY),
				expanded;
				
			if (Z.isHori) {
				expanded = index < Z._floatIndex && deltaX >= 0 || index > Z._floatIndex && deltaX < 0;
			} else {
				expanded = index < Z._floatIndex && deltaY >= 0 || index > Z._floatIndex && deltaY < 0;
			}
			if (expanded && delta > Z.dragRangeMax){
				Z.endDelta = Z.dragRangeMax;
				return;
			}
			
			if (!expanded && delta > Z.dragRangeMin){
				Z.endDelta = Z.dragRangeMin;
				return;
			}
			
			Z.endDelta = Math.abs(Z.isHori ? deltaX : deltaY);
			var pos = jqTracker.offset();
			if (Z.isHori) {
				pos.left = x;
			} else {
				pos.top = y;
			}
			jqTracker.offset(pos);
		},
		
		/**
		 * @private
		 */
		_splitterDragEnd: function (oldX, oldY, x, y, deltaX, deltaY){
			var Z = this.parentNode.jslet,
				jqTracker = jQuery(Z.splitterTracker),
				jqSplitter = jQuery('#'+Z.draggingId),
				index = parseInt(jqSplitter.attr('jsletindex')),
				jqPanel = index < Z._floatIndex ? jqSplitter.prev(): jqSplitter.next(),
				expanded,
				jqFp = jQuery(Z.floatPanel);
	
			if (Z.isHori) {
				expanded = index < Z._floatIndex && deltaX >= 0 || index > Z._floatIndex && deltaX < 0;
			} else {
				expanded = index < Z._floatIndex && deltaY >= 0 || index > Z._floatIndex && deltaY < 0;
			}
			var delta = Z.endDelta * (expanded ? 1: -1);
			var newSize = Z.panels[index].size + delta;
			Z.panels[index].size = newSize;
			
			if (Z.isHori){
				jqPanel.width(newSize);
				jqFp.width(jqFp.width() - delta);
			}else{
				jqPanel.height(newSize);
				jqFp.height(jqFp.height() - delta);
			}
			if (Z._onSize) {
				Z._onSize.call(Z, index, newSize);
			}
			jslet.resizeEventBus.resize(Z.el);
			jqTracker.hide();
		},
		
		/**
		 * @private
		 */
		_splitterDragCancel: function (oldX, oldY, x, y, deltaX, deltaY){
			var Z = this.parentNode.jslet,
				jqTracker = jQuery(Z.splitterTracker);
			jqTracker.hide();
		},
		
		/**
		 * Run when container size changed, it's revoked by jslet.resizeeventbus.
		 * 
		 */
		checkSizeChanged: function(){
			var Z = this,
				jqEl = jQuery(Z.el),
				currSize = Z.isHori ? jqEl.width() : jqEl.height();
			if ( Z._oldSize != currSize){
				var delta = currSize - Z._oldSize;
				Z._oldSize = currSize;
				var oFp = Z.panels[Z._floatIndex],
					jqFp = jQuery(Z.floatPanel),
					newSize = delta + (Z.isHori ? jqFp.width(): jqFp.height());
	
				if (newSize < oFp.minSize) {
					newSize = oFp.minSize;
				}
				if (Z.isHori) {
					jqFp.width(newSize);
				} else {
					jqFp.height(newSize);
				}
			}
			jslet.resizeEventBus.resize(Z.floatPanel);
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this,
			jqEl = jQuery(Z.el);
			Z.splitterTracker = null;
			Z.floatPanel = null;
			var splitters = jqEl.find('.'+Z.splitterClsName);
			splitters.off('mousedown', Z._splitterMouseDown);
			var item;
			for(var i = 0, cnt = splitters.length; i < cnt; i++){
				item = splitters[i];
				jslet.ui.dnd.unbindControl(item);
				item._doDragStart = null;
				item._doDragging = null;
				item._doDragEnd = null;
				item._doDragCancel = null;
			}
			jslet.resizeEventBus.unsubscribe(Z);
			$super();
		}
	});
	
	jslet.ui.register('SplitPanel', jslet.ui.SplitPanel);
	jslet.ui.SplitPanel.htmlTemplate = '<div></div>';
	
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
	
	
	
	/* ========================================================================
	 * Jslet framework: jslet.tippanel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	* @class TipPanel. Example:
	* <pre><code>
	*   var tipPnl = new jslet.ui.TipPanel();
	*   tipPnl.show('Hello world', 10, 10);
	* </code></pre>
	*/
	jslet.ui.TipPanel = function () {
		this._hideTimerId = null;
		this._showTimerId = null;
		this._oldElement = null;
		var p = document.createElement('div');
		jQuery(p).addClass('jl-tip-panel');
		document.body.appendChild(p);
		this._tipPanel = p;
	
		/**
		 * Show tips at specified position. Example:
		 * <pre><code>
		 *  tipPnl.show('foo...', event);
		 *  tipPnl.show('foo...', 100, 200);
		 * </code></pre>
		 * 
		 * @param {String} tips Tips text
		 * @param {Integer or Event} left Position left, if left is mouse event, then top argument can't be specified
		 * @param {Integer} top Position top
		 */
		this.show = function (tips, leftOrEvent, top) {
			var Z = this;
			var len = arguments.length;
			var isSameCtrl = false, left = leftOrEvent;
			if (len == 2) { //this.show(tips)
				var evt = left;
				evt = jQuery.event.fix( evt );
	
				top = evt.pageY + 16; left = evt.pageX + 2;
				var ele = evt.currentTarget;
				isSameCtrl = (ele === Z._oldElement);
				Z._oldElement = ele;
			} else {
				left = parseInt(left);
				top = parseInt(top);
			}
	
			if (Z._hideTimerId) {
				window.clearTimeout(Z._hideTimerId);
				if (isSameCtrl) {
					return;
				}
			}
	
			this._showTimerId = window.setTimeout(function () {
				var p = Z._tipPanel;
				p.innerHTML = tips;
				p.style.left = left + 'px';
				p.style.top = top + 'px';
				Z._tipPanel.style.display = 'block';
				Z._showTimerId = null;
			}, 300);
		};
	
		/**
		 * Hide tip panel
		 */
		this.hide = function () {
			var Z = this;
			if (Z._showTimerId) {
				window.clearTimeout(Z._showTimerId);
				return;
			}
			Z._hideTimerId = window.setTimeout(function () {
				Z._tipPanel.style.display = 'none';
				Z._hideTimerId = null;
				Z._oldElement = null;
			}, 300);
		};
	};
	
	/**
	 * Global tip panel
	 */
	jslet.ui.globalTip = new jslet.ui.TipPanel();
	
	/* ========================================================================
	 * Jslet framework: jslet.waitingbox.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class WaitingBox. Example:
	 * <pre><code>
	 *   var wb = new jslet.ui.WaitingBox(document.getElementById("test"), "Gray", true);
	 *	wb.show("Please wait a moment...");
	 * 
	 * </code></pre>
	 * @param {Html Element} container The container which waitingbox reside on.
	 * @param {String} overlayColor Overlay color
	 * @param {Boolean} tipsAtNewLine Tips is at new line or not. If false, tips and waiting icon is at the same line.
	 */
	jslet.ui.WaitingBox = function (container, overlayColor, tipsAtNewLine) {
		var overlay = new jslet.ui.OverlayPanel(container);
		var s = '<div class="jl-waitingbox"><b class="jl-waitingbox-icon"></b>';
			s += '<span id="tips"></span></div>';
	
		jQuery(overlay.overlayPanel).html(s);
	
		/**
		 * Show wating box
		 * 
		 * @param {String} tips Tips
		 */
		this.show = function (tips) {
			var p = overlay.overlayPanel,
				box = p.firstChild,
				tipPanel = box.childNodes[1];
			tipPanel.innerHTML = tips ? tips : '';
			var jqPnl = jQuery(p),
				ph = jqPnl.height(),
				pw = jqPnl.width();
	
			setTimeout(function () {
				var jqBox = jQuery(box);
				box.style.top = Math.round((ph - jqBox.height()) / 2) + 'px';
				box.style.left = Math.round((pw - jqBox.width()) / 2) + 'px';
			}, 10);
	
			overlay.show();
		};
	
		/**
		 * Hide waiting box
		 */
		this.hide = function () {
			overlay.hide();
		};
	
		this.destroy = function () {
			overlay.overlayPanel.innerHTML = '';
			overlay.destroy();
		};
	};
	
	/* ========================================================================
	 * Jslet framework: jslet.window.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class Window, it has the following function: 
	 * 1. Show as modal or modeless;
	 * 2. User can change window size;
	 * 3. User can minimize/maximize/restore/close window;
	 * 4. User can move window;
	 * 
	 * Example:
	 * <pre><code>
		var oWin = jslet.ui.createControl({ type: "Window", iconClass:"winicon", caption: "test window", minimizable: false, maximizable:false,onActive: doWinActive, onPositionChanged: doPositionChanged });
		oWin.setContent("Open modeless window in the Body(with icon)!");
		oWin.show(350,250);
		//or oWin.showModel(350, 250);
	
	 *
	 * </code></pre>
	 */
	jslet.ui.Window = jslet.Class.create(jslet.ui.Control, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.el = el;
			Z.allProperties = 'caption,resizable,minimizable,maximizable,closable,iconClass,onSizeChanged,onClosed,onPositionChanged,onActive,width,height,minWidth,maxWidth,minHeight,maxHeight,sizeClass,isCenter,isSmallHeader,stopEventBubbling';
	
			Z._caption = null;
			
			Z._resizable = true;
			
			Z._minimizable = true;
	
			Z._maximizable = true;
			
			Z._closable = true;
			
			Z._iconClass = null;
			
			Z._width = 0;
			
			Z._height = 0;
			
			Z._minWidth = 20;
			
			Z._minHeight = 30;
			
			Z._maxWidth = -1;
	
			Z._maxHeight = -1;
	
			Z._sizeClass = null,
			
			Z._isCenter = false;
	 
			Z._onSizeChanged = null;
			
			Z._onPositionChanged = null;
			
			Z._onActive = null;
			
			Z._onClosed = null;
	
			Z._stopEventBubbling = false;
			
			//@private
			Z._isModal = false;
			
			Z._state = null; 
			$super(el, params);
		},
	
		/**
		 * Get or set window caption.
		 * 
		 * @param {String or undefined} window caption.
		 * @return {String or this}
		 */
		caption: function(caption) {
			if(caption === undefined) {
				return this._caption;
			}
			jslet.Checker.test('Window.caption', caption).isString();
			this._caption = caption;
		},
		
		/**
		 * Get or set the icon class of window header.
		 * 
		 * @param {String or undefined} iconClass the icon of window header.
		 * @return {String or this}
		 */
		iconClass: function(iconClass) {
			if(iconClass === undefined) {
				return this._iconClass;
			}
			jslet.Checker.test('Window.iconClass', iconClass).isString();
			this._iconClass = iconClass;
		},
		
		/**
		 * Identify whether the window can be resized or not.
		 * 
		 * @param {Boolean or undefined} resizable true - window can be resized, false otherwise.
		 * @return {Boolean or this}
		 */
		resizable: function(resizable) {
			if(resizable === undefined) {
				return this._resizable;
			}
			this._resizable = resizable? true: false;
		},
		
		/**
		 * Identify whether the window can be minimized or not.
		 * 
		 * @param {Boolean or undefined} minimizable true - window can be minimized, false - otherwise.
		 * @return {Boolean or this}
		 */
		minimizable: function(minimizable) {
			if(minimizable === undefined) {
				return this._minimizable;
			}
			this._minimizable = minimizable? true: false;
		},
		
		/**
		 * Identify whether the window can be maximized or not.
		 * 
		 * @param {Boolean or undefined} maximizable true - window can be maximized, false - otherwise.
		 * @return {Boolean or this}
		 */
		maximizable: function(maximizable) {
			if(maximizable === undefined) {
				return this._maximizable;
			}
			this._maximizable = maximizable? true: false;
		},
		
		/**
		 * Identify whether the window can be closed or not.
		 * 
		 * @param {Boolean or undefined} closable true - window can be closed, false - otherwise.
		 * @return {Boolean or this}
		 */
		closable: function(closable) {
			if(closable === undefined) {
				return this._closable;
			}
			this._closable = closable? true: false;
		},
		
		/**
		 * Identify whether the window is shown in center of container.
		 * 
		 * @param {Boolean or undefined} isCenter true - window is shown in center of container, false - otherwise.
		 * @return {Boolean or this}
		 */
		isCenter: function(isCenter) {
			if(isCenter === undefined) {
				return this._isCenter;
			}
			this._isCenter = isCenter? true: false;
		},
		
		/**
		 * Identify whether stopping the event bubble.
		 * 
		 * @param {Boolean or undefined} stopEventBubbling true - stop event bubbling, false - otherwise.
		 * @return {Boolean or this}
		 */
		stopEventBubbling: function(stopEventBubbling) {
			if(stopEventBubbling === undefined) {
				return this._stopEventBubbling;
			}
			this._stopEventBubbling = stopEventBubbling? true: false;
		},
		
		/**
		 * Get or set window width.
		 * 
		 * @param {Integer or undefined} width window width.
		 * @return {Integer or this}
		 */
		width: function(width) {
			if(width === undefined) {
				return this._width;
			}
			jslet.Checker.test('Window.width', width).isGTZero();
			this._width = width;
		},
	
		/**
		 * Get or set window height.
		 * 
		 * @param {Integer or undefined} height window height.
		 * @return {Integer or this}
		 */
		height: function(height) {
			if(height === undefined) {
				return this._height;
			}
			jslet.Checker.test('Window.height', height).isGTZero();
			this._height = height;
		},
	
		/**
		 * Get or set window minimum width.
		 * 
		 * @param {Integer or undefined} minWidth window minimum width.
		 * @return {Integer or this}
		 */
		minWidth: function(minWidth) {
			if(minWidth === undefined) {
				return this._minWidth;
			}
			jslet.Checker.test('Window.minWidth', minWidth).isGTZero();
			if(minWidth < 20) {
				minWidth = 20;
			}
			this._minWidth = minWidth;
		},
	
		/**
		 * Get or set window minimum height.
		 * 
		 * @param {Integer or undefined} minHeight window minimum height.
		 * @return {Integer or this}
		 */
		minHeight: function(minHeight) {
			if(minHeight === undefined) {
				return this._minHeight;
			}
			jslet.Checker.test('Window.minHeight', minHeight).isGTZero();
			if(minHeight < 30) {
				minHeight = 30;
			}
			this._minHeight = minHeight;
		},
	
		/**
		 * Get or set window maximum width.
		 * 
		 * @param {Integer or undefined} maxWidth window maximum width.
		 * @return {Integer or this}
		 */
		maxWidth: function(maxWidth) {
			if(maxWidth === undefined) {
				return this._maxWidth;
			}
			jslet.Checker.test('Window.maxWidth', maxWidth).isNumber();
			this._maxWidth = maxWidth;
		},
	
		/**
		 * Get or set window maximum height.
		 * 
		 * @param {Integer or undefined} maxHeight window maximum height.
		 * @return {Integer or this}
		 */
		maxHeight: function(maxHeight) {
			if(maxHeight === undefined) {
				return this._maxHeight;
			}
			jslet.Checker.test('Window.maxHeight', maxHeight).isNumber();
			this._maxHeight = maxHeight;
		},
	
		/**
		 * Get or set window size class name, sizeClass contains: width, height, minWidth, minHeight, maxWidth, maxHeight
		 * 
		 * @param {String or undefined} sizeClass window size class name.
		 * @return {String or this}
		 */
		sizeClass: function(sizeClass) {
			var Z = this;
			if(sizeClass === undefined) {
				return Z.sizeClass;
			}
			jslet.Checker.test('Window.sizeClass', sizeClass).isString();
			Z.sizeClass = sizeClass;
		},
		
		/**
		 * Set or get window size changed event handler.
		 * Pattern:
		 *   function(width, height){}
		 *   //width: Integer Window width
		 *   //height: Integer Window height
		 * 
		 * @param {Function or undefined} onSizeChanged window size changed event handler
		 * @return {Function or this}
		 */
		onSizeChanged: function(onSizeChanged) {
			if(onSizeChanged === undefined) {
				return this._onSizeChanged;
			}
			jslet.Checker.test('Window.onSizeChanged', onSizeChanged).isFunction();
			this._onSizeChanged = onSizeChanged;
		},
		
		/**
		 * Set or get window position changed event handler.
		 * Fired when user changes the window's position.
		 * Pattern: 
		 *   function(left, top){}
		 *   //left: Integer Window position left
		 *   //top: Integer Window position top 
		 * 
		 * @param {Function or undefined} onPositionChanged window position changed event handler
		 * @return {Function or this}
		 */
		onPositionChanged: function(onPositionChanged) {
			if(onPositionChanged === undefined) {
				return this._onPositionChanged;
			}
			jslet.Checker.test('Window.onPositionChanged', onPositionChanged).isFunction();
			this._onPositionChanged = onPositionChanged;
		},
	
		/**
		 * Set or get window activated event handler.
		 * Fired when the window is active.
		 *	function(windObj){}
		 *	//windObj: jslet.ui.Window Window Object
		 * 
		 * @param {Function or undefined} onActive window activated event handler
		 * @return {Function or this}
		 */
		onActive: function(onActive) {
			if(onActive === undefined) {
				return this._onActive;
			}
			jslet.Checker.test('Window.onActive', onActive).isFunction();
			this._onActive = onActive;
		},
		
		
		/**
		 * Set or get window closed event handler.
		 * Fired when uses closes window.
		 * Pattern: 
		 *	function(windObj){}
		 *	//windObj: jslet.ui.Window Window Object
		 *	//return: String If return value equals 'hidden', then hide window instead of closing.
		 * 
		 * @param {Function or undefined} onClosed window closed event handler
		 * @return {Function or this}
		 */
		onClosed: function(onClosed) {
			if(onClosed === undefined) {
				return this._onClosed;
			}
			jslet.Checker.test('Window.onClosed', onClosed).isFunction();
			this._onClosed = onClosed;
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
			if (!Z._closable) {
				Z._minimizable = false;
				Z._maximizable = false;
			}
			var jqEl = jQuery(Z.el);
			if (!jqEl.hasClass('jl-window')) {
				jqEl.addClass('panel panel-default jl-window');
			}
			if (!Z._width) {
				Z._width = parseInt(Z.el.style.width);
			}
			if (!Z._height) {
				Z._height = parseInt(Z.el.style.height);
			}
			if (!Z._width) {
				Z._width = 300;
			}
			if (!Z._height) {
				Z._height = 300;
			}
			Z.el.style.width = Z._width + 'px';
			Z.el.style.height = Z._height + 'px';
	
			var template = [
			'<div class="panel-heading jl-win-header jl-win-header-sm" style="cursor:move">',
				Z._iconClass ? '<span class="jl-win-header-icon ' + Z._iconClass + '"></span>' : '',
	
				'<span class="panel-title jl-win-caption">', Z._caption ? Z._caption : '', '</span>',
				'<span class="jl-win-tool jl-unselectable">'];
				template.push(Z._closable ? '<button class="close jl-win-close" onfocus="this.blur();">x</button>' : '');
				template.push(Z._maximizable ? '<button class="close jl-win-max" onfocus="this.blur();">□</button>' : '');
				template.push(Z._minimizable ? '<button class="close jl-win-min" onfocus="this.blur();">-</button>' : '');
			template.push('</span></div>');
			template.push('<div class="panel-body jl-win-body"></div>');
	
			jqEl.html(template.join(''));
			jqEl.on('mousemove', Z._doWinMouseMove);
			jqEl.on('mousedown', Z._doWinMouseDown);
			jqEl.on('dblclick', function(event){
				event.stopPropagation();
				event.preventDefault();
			});
	
			jqEl.on('click', function(event){
				if(Z._isModal || Z._stopEventBubbling) {
					event.stopPropagation();
					event.preventDefault();
				}
			});
			
			var jqHeader = jqEl.find('.jl-win-header'),
				header = jqHeader[0];
			Z._headerHeight = jqHeader.outerHeight();
			var bodyDiv = jqEl.find('.jl-win-body')[0],
				bh = Z._height - Z._headerHeight - 12;
			if (bh < 0) {
				bh = 0;
			}
			bodyDiv.style.height = bh + 'px';
			jqBody = jQuery(bodyDiv);
			jqBody.on('mouseenter',function (event) {
				window.setTimeout(function(){
					if (jslet.temp_dragging) {
						return;
					}
					Z.cursor = null;
				},300);
			});
			jqBody.on('dblclick',function (event) {
				event.stopPropagation();
				event.preventDefault();
			});
			
			jqHeader.on('mousedown',function (event) {
				Z.activate();
				if (Z._state == 'max') {
					return;
				}
				Z.cursor = null;
				jslet.ui.dnd.bindControl(this);
			});
	
			jqHeader.on('dblclick',function (event) {
				event.stopPropagation();
				event.preventDefault();
				if (!Z._maximizable) {
					return;
				}
				if (Z._state != 'max') {
					Z.maximize();
				} else {
					Z.restore();
				}
			});
	
			header._doDragStart = function (oldX, oldY, x, y, deltaX, deltaY) {
				Z._createTrackerMask(header);
				Z.trackerMask.style.cursor = header.style.cursor;
				jslet.temp_dragging = true;
			};
	
			header._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
				Z.setPosition(Z.left + deltaX, Z.top + deltaY, true);
			};
	
			header._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
				var left = parseInt(Z.el.style.left);
				var top = parseInt(Z.el.style.top);
				Z.setPosition(left, top);
				Z._removeTrackerMask();
				Z.cursor = null;
				jslet.temp_dragging = false;
			};
	
			header._doDragCancel = function (oldX, oldY, x, y, deltaX, deltaY) {
				Z.setPosition(Z.left, Z.top);
				Z._removeTrackerMask();
				Z.cursor = null;
				jslet.temp_dragging = false;
			};
	
			Z.el._doDragStart = function (oldX, oldY, x, y, deltaX, deltaY) {
				Z._createTrackerMask(this);
				Z._createTracker();
				Z.trackerMask.style.cursor = Z.el.style.cursor;
				jslet.temp_dragging = true;
			};
	
			Z.el._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
				Z._changeTrackerSize(deltaX, deltaY);
			};
	
			Z.el._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
				if (!Z.tracker) {
					return;
				}
				var left = parseInt(Z.tracker.style.left);
				var top = parseInt(Z.tracker.style.top);
				var width = parseInt(Z.tracker.style.width);
				var height = parseInt(Z.tracker.style.height);
	
				Z.setPosition(left, top);
				Z.changeSize(width, height);
				Z._removeTrackerMask();
				Z._removeTracker();
				Z.cursor = null;
				jslet.temp_dragging = false;
			};
	
			Z.el._doDragCancel = function (oldX, oldY, x, y, deltaX, deltaY) {
				Z._removeTrackerMask();
				Z._removeTracker();
				Z.cursor = null;
				jslet.temp_dragging = false;
			};
	
			if (Z._closable) {
				var jqClose = jqEl.find('.jl-win-close');
				jqClose.click(function (event) {
					Z.close();
					event = jQuery.event.fix( event || window.event );
					event.stopPropagation();
					event.preventDefault();
				});
			}
			if (Z._minimizable) {
				var jqMin = jqEl.find('.jl-win-min');
				jqMin.click(function (event) {
	//				if (Z._state == 'max') {
	//					var btnMax = jqEl.find('.jl-win-restore')[0];
	//					if (btnMax) {
	//						btnMax.className = 'jl-win-max';
	//					}
	//				}
					Z.minimize();
					event = jQuery.event.fix( event || window.event );
					event.stopPropagation();
					event.preventDefault();
				});
			}
			if (Z._maximizable) {
				var jqMax = jqEl.find('.jl-win-max'),
					btnMax = jqMax[0];
				jqMax.click(function (event) {
					if (Z._state != 'max') {
						btnMax.innerHTML = '■'
						Z.maximize();
					} else {
						btnMax.innerHTML = '□'
						Z.restore();
					}
					event = jQuery.event.fix( event || window.event );
					event.stopPropagation();
					event.preventDefault();
				});
			}
		},
	
		/**
		 * Show window at specified position
		 * 
		 * @param {Integer} left Position left.
		 * @param {Integer} top Position top.
		 */
		show: function (left, top) {
			var Z = this;
			if (Z._isCenter) {
				var offsetP = jQuery(Z.el).offsetParent()[0],
					jqOffsetP = jQuery(offsetP),
					pw = jqOffsetP.width(),
					ph = jqOffsetP.height();
				left = offsetP.scrollLeft + Math.round((pw - Z._width) / 2);
				top = offsetP.scrollTop + Math.round((ph - Z._height) / 2);
			}
	
			Z.top = top ? top : 0;
			Z.left = left ? left : 0;
			Z.el.style.left = Z.left + 'px';
			Z.el.style.top = Z.top + 'px';
			Z.el.style.display = 'block';
	
			Z.activate();
		},
	
		/**
		 * Show modal window at specified position
		 * 
		 * @param {Integer} left Position left.
		 * @param {Integer} top Position top.
		 */
		showModal: function (left, top) {
			var Z = this;
			Z._isModal = true;
			if (!Z.overlay) {
				Z.overlay = new jslet.ui.OverlayPanel(Z.el.parentNode);
			}
			jslet.ui.GlobalZIndex += 10;
			var k = jslet.ui.GlobalZIndex;
			Z.el.style.zIndex = k;
			Z.show(left, top);
			Z.overlay.setZIndex(k - 2);
			Z.overlay.show();
		},
	
		/**
		 * Hide window
		 */
		hide: function () {
			var Z = this;
			Z.el.style.display = 'none';
			if (Z.overlay) {
				Z.overlay.hide();
			}
		},
	
		/**
		 * Close window, this will fire onClosed event.
		 * 
		 */
		close: function () {
			var Z = this;
			if(!Z.el) {
				return;
			}
			if (Z._onClosed) {
				var action = Z._onClosed.call(Z);
				if (action && action.toLowerCase() == 'hidden') {
					Z.hide();
					return;
				}
			}
			var pnode = Z.el.parentNode;
			pnode.removeChild(Z.el);
			if (Z.overlay) {
				Z.overlay.destroy();
				Z.overlay = null;
			}
			jslet.ui.GlobalZIndex -= 10;
			Z.destroy();
		},
	
		/**
		 * Minimize window
		 */
		minimize: function () {
			var Z = this;
			if (Z._state == 'min') {
				Z.restore();
				return;
			}
			if (Z._state == 'max') {
				Z.restore();
			}
			Z.changeSize(null, Z._headerHeight + 8, true);
			Z._state = 'min';
		},
	
		/**
		 * Maximize window
		 */
		maximize: function () {
			var Z = this;
			var offsetP = jQuery(Z.el).offsetParent();
			var width = offsetP.width(); // -12;
			var height = offsetP.height(); // -12;
			Z.setPosition(0, 0, true);
			Z.changeSize(width, height, true);
			Z._state = 'max';
		},
	
		/**
		 * Restore window
		 */
		restore: function () {
			var Z = this;
			Z.setPosition(Z.left, Z.top, true);
			Z.changeSize(Z._width, Z._height, true);
			Z._state = null;
		},
	
		/**
		 * Activate window, this will fire the 'OnActive' event
		 */
		activate: function () {
			var Z = this;
			if (!Z.overlay) {
				Z.bringToFront();
			}
			if (Z._onActive) {
				Z._onActive.call();
			}
		},
	
		/**
		 * Change window position.
		 * 
		 * @param {Integer} left Position left
		 * @param {Integer} top Position top
		 * @param {Boolean} notUpdateLeftTop True - Only change html element position, 
		 *		not change the inner position of Window object, it is usually use for moving action
		 */
		setPosition: function (left, top, notUpdateLeftTop) {
			var Z = this;
			if (!notUpdateLeftTop) {
				Z.left = left;
				Z.top = top;
			} else {
				if (Z._onPositionChanged) {
					var result = Z._onPositionChanged.call(Z, left, top);
					if (result) {
						if (result.left) {
							left = result.left;
						}
						if (result.top) {
							top = result.top;
						}
					}
				}
			}
			Z.el.style.left = left + 'px';
			Z.el.style.top = top + 'px';
		},
	
		/**
		 * Change window size.
		 * 
		 * @param {Integer} width Window width
		 * @param {Integer} height Window height
		 * @param {Boolean} notUpdateSize True - Only change html element size, 
		 *		not change the inner size of Window object, it is usually use for moving action
		 */
		changeSize: function (width, height, notUpdateSize) {
			var Z = this;
			if (!width) {
				width = Z._width;
			}
			if (!height) {
				height = Z._height;
			}
	
			if (Z._onSizeChanged) {
				Z._onSizeChanged.call(Z, width, height);
			}
	
			if (!notUpdateSize) {
				Z._width = width;
				Z._height = height;
			}
			Z.el.style.width = width + 'px';
			Z.el.style.height = height + 'px';
	
			var jqEl = jQuery(Z.el);
			var bodyDiv = jqEl.find('.jl-win-body')[0];
			var bh = height - Z._headerHeight - 12;
			if (bh < 0) {
				bh = 0;
			}
			bodyDiv.style.height = bh + 'px';
		},
	
		/**
		 * Get window caption element. You can use it to customize window caption.
		 * 
		 * @return {Html Element}
		 */
		getCaptionDiv: function () {
			return jQuery(this.el).find('.jl-win-caption')[0];
		},
	
		/**
		 * Set window caption
		 * 
		 * @param {String} caption Window caption
		 */
		changeCaption: function (caption) {
			this.caption = caption;
			var captionDiv = jQuery(this.el).find('.jl-win-caption');
			captionDiv.html(caption);
		},
	
		/**
		 * Get window content element. You can use it to customize window content.
		 * 
		 * @return {Html Element}
		 */
		getContentDiv: function () {
			return jQuery(this.el).find('.jl-win-body')[0];
		},
	
		/**
		 * Set window content
		 * 
		 * @param {String} html Html text for window content
		 */
		setContent: function (html) {
			if (!html){
				jslet.showError('Window content cannot be null!');
				return;
			}
			var bodyDiv = jQuery(this.el).find('.jl-win-body');
			if (html && html.toLowerCase) {
				bodyDiv.html(html);
			} else {
				bodyDiv.html('');
				
				html.parentNode.removeChild(html);
				bodyDiv[0].appendChild(html);
				if (html.style && html.style.display == 'none') {
					html.style.display = 'block';
				}
			}
		},
	
		/**
		 * Bring window to front
		 */
		bringToFront: function () {
			var Z = this;
			var p = Z.el.parentNode;
			var node, jqEl = jQuery(Z.el);
			var maxIndex = 0, jqNode;
			for (var i = 0, cnt = p.childNodes.length; i < cnt; i++) {
				node = p.childNodes[i];
				if (node.nodeType != 1 || node == Z.el) {
					if (!Z._isModal) {
						jqEl.find('.jl-win-header').addClass('jl-window-active');
					}
					continue;
				}
				jqNode = jQuery(node);
				if (jqNode.hasClass('jl-window')) {
					if (maxIndex < node.style.zIndex) {
						maxIndex = node.style.zIndex;
					}
					if (!Z._isModal) {
						jqNode.find('.jl-win-header').removeClass('jl-window-active');
					}
				}
			}
			if (Z.el.style.zIndex < maxIndex || maxIndex === 0) {
				Z.setZIndex(maxIndex + 3);
			}
		},
	
		/**
		 * Set window Z-Index
		 * 
		 * @param {Integer} zIndex Z-Index
		 */
		setZIndex: function (zIndex) {
			this.el.style.zIndex = zIndex;
		},
	
		_checkSize: function (width, height) {
			var Z = this;
			if (width) {
				if (width < Z._minWidth || Z._maxWidth > 0 && width > Z._maxWidth) {
					return false;
				}
			}
	
			if (height) {
				if (height < Z.minHeight || Z._maxHeight > 0 && height > Z._maxHeight) {
					return false;
				}
			}
			return true;
		},
	
		_changeTrackerSize: function (deltaX, deltaY) {
			var Z = this;
			if (!Z.tracker || !Z.cursor) {
				return;
			}
			var w = Z.el.offsetWidth, h = Z.el.offsetHeight, top = null, left = null;
	
			if (Z.cursor == 'nw') {
				w = Z._width - deltaX;
				h = Z._height - deltaY;
				top = Z.top + deltaY;
				left = Z.left + deltaX;
			} else if (Z.cursor == 'n') {
				h = Z._height - deltaY;
				top = Z.top + deltaY;
			} else if (Z.cursor == 'ne') {
				h = Z._height - deltaY;
				w = Z._width + deltaX;
				top = Z.top + deltaY;
			} else if (Z.cursor == 'e') {
				w = Z._width + deltaX;
			} else if (Z.cursor == 'se') {
				w = Z._width + deltaX;
				h = Z._height + deltaY;
			} else if (Z.cursor == 's'){
				h = Z._height + deltaY;
			} else if (Z.cursor == 'sw') {
				h = Z._height + deltaY;
				w = Z._width - deltaX;
				left = Z.left + deltaX;
			} else if (Z.cursor == 'w') {
				w = Z._width - deltaX;
				left = Z.left + deltaX;
			}
	
			if (!Z._checkSize(w, h)) {
				return;
			}
			if (w) {
				Z.tracker.style.width = w + 'px';
			}
			if (h) {
				Z.tracker.style.height = h + 'px';
			}
			if (top) {
				Z.tracker.style.top = top + 'px';
			}
			if (left) {
				Z.tracker.style.left = left + 'px';
			}
		},
	
		_doWinMouseMove: function (event) {
			if (jslet.temp_dragging) {
				return;
			}
			event = jQuery.event.fix( event || window.event );
			
			var srcEl = event.target, jqSrcEl = jQuery(srcEl);
			
			if (!jqSrcEl.hasClass('jl-window')) {
				return;
			}
			if (!srcEl.jslet._resizable || srcEl.jslet._state) {
				srcEl.jslet.cursor = null;
				srcEl.style.cursor = 'default';
				return;
			}
	
			var pos = jqSrcEl.offset(),
				x = event.pageX - pos.left,
				y = event.pageY - pos.top,
				w = jqSrcEl.width(),
				h = jqSrcEl.height();
			var delta = 8, wdelta = w - delta, hdelta = h - delta, cursor = null;
			if (x <= delta && y <= delta) {
				cursor = 'nw';
			} else if (x > delta && x < wdelta && y <= delta) {
				cursor = 'n';
			} else if (x >= wdelta && y <= delta) {
				cursor = 'ne';
			} else if (x >= wdelta && y > delta && y <= hdelta) {
				cursor = 'e';
			} else if (x >= wdelta && y >= hdelta) {
				cursor = 'se';
			} else if (x > delta && x < wdelta && y >= hdelta) {
				cursor = 's';
			} else if (x <= delta && y >= hdelta) {
				cursor = 'sw';
			} else if (x <= delta && y > delta && y < hdelta) {
				cursor = 'w';
			}
			
			srcEl.jslet.cursor = cursor;
			srcEl.style.cursor = cursor ? cursor + '-resize' : 'default';
		},
	
		_doWinMouseDown: function (event) {
			var ojslet = this.jslet;
			ojslet.activate();
			if (ojslet.cursor) {
				jslet.ui.dnd.bindControl(this);
			}
		},
	
		_createTrackerMask: function (holder) {
			var Z = this;
			if (Z.trackerMask) {
				return;
			}
			var jqBody = jQuery(document.body);
	
			Z.trackerMask = document.createElement('div');
			jQuery(Z.trackerMask).addClass('jl-win-tracker-mask');
			Z.trackerMask.style.top = '0px';
			Z.trackerMask.style.left = '0px';
			Z.trackerMask.style.zIndex = 99998;
			Z.trackerMask.style.width = jqBody.width() + 'px';
			Z.trackerMask.style.height = jqBody.height() + 'px';
			Z.trackerMask.style.display = 'block';
			Z.trackerMask.onmousedown = function () {
				if (holder && holder._doDragCancel) {
					holder._doDragCancel();
				}
			};
			jqBody[0].appendChild(Z.trackerMask);
		},
	
		_removeTrackerMask: function () {
			var Z = this;
			if (Z.trackerMask) {
				Z.trackerMask.onmousedown = null;
				document.body.removeChild(Z.trackerMask);
			}
			Z.trackerMask = null;
		},
	
		_createTracker: function () {
			var Z = this;
			if (Z.tracker) {
				return;
			}
			Z.tracker = document.createElement('div');
			jQuery(Z.tracker).addClass('jl-win-tracker');
			Z.tracker.style.top = Z.top + 'px';
			Z.tracker.style.left = Z.left + 'px';
			Z.tracker.style.zIndex = 99999;
			Z.tracker.style.width = Z._width + 'px';
			Z.tracker.style.height = Z._height + 'px';
			Z.tracker.style.display = 'block';
			Z.el.parentNode.appendChild(Z.tracker);
		},
	
		_removeTracker: function () {
			var Z = this;
			if (Z.tracker) {
				Z.el.parentNode.removeChild(Z.tracker);
			}
			Z.tracker = null;
		},
	
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this,
				jqEl = jQuery(Z.el);
			jqEl.find('.jl-win-max').off();
			jqEl.find('.jl-win-min').off();
			jqEl.find('.jl-win-close').off();
	
			var jqHeader = jqEl.find('.jl-win-header'),
				header = jqHeader[0];
			jqHeader.off();
			jqEl.find('.jl-win-body').off();
			if (Z.trackerMask) {
				Z.trackerMask.onmousedown = null;
			}
			Z.trackerMask = null;
			Z.el._doDragCancel = null;
			Z.el._doDragEnd = null;
			Z.el._doDragging = null;
			Z.el._doDragStart = null;
			header._doDragCancel = null;
			header._doDragEnd = null;
			header._doDragging = null;
			header._doDragStart = null;
			
			if ($super) {
				$super();
			}
		}
	});
	jslet.ui.register('Window', jslet.ui.Window);
	jslet.ui.Window.htmlTemplate = '<div></div>';
	
	
	/**
	* @class MessageBox
	*/
	jslet.ui.MessageBox = function () {
	
		//hasInput-0:none,1-single line input, 2:multiline input
		/**
		 * Show message box
		 * 
		 * @param {String} message Message text
		 * @param {String} caption Caption text
		 * @param {String} iconClass Caption icon class
		 * @param {String[]} buttons Array of button names, like : ['ok','cancel']
		 * @param {Fucntion} callbackFn Callback function when user click one button, 
		 *	Pattern: 
		 *	function({String}button, {String} value){}
		 *	//button: String, button name;
		 *	//value: String, the alue inputed by user;
		 * @param {Integer} hasInput There is input or not, value options: 0 - none, 1 - single line input, 2 - multiline input
		 * @param {String} defaultValue The default value of Input element, if hasInput = 0, this argument is be igored.
		 * @param {Fucntion} validateFn Validate function of input element, if hasInput = 0, this argument is be igored.
		 *   Pattern: 
		 *   function(value){}
		 *   //value: String, the value which need to be validated.
		 * 
		 */
		this.show = function (message, caption, iconClass, buttons, callbackFn, hasInput, defaultValue, validateFn) {
			jslet.ui.textMeasurer.setElement(document.body);
			var arrMsg = message.split('\n'),
				msgLen = arrMsg.length;
			var mh = jslet.ui.textMeasurer.getHeight(message),
				mw = 0;
			for(var i = 0; i < msgLen; i++) {
				mw = Math.max(mw, jslet.ui.textMeasurer.getWidth(message[i]));
			}
			mh = mh * arrMsg.length + 100;
			jslet.ui.textMeasurer.setElement();
			if (mw < 200) {
				mw = 200;
			}
			message = message.replace('\n', '<br />');
			var btnWidth = parseInt(jslet.ui.getCssValue('jl-msg-button', 'width'));
			var btnCount = buttons.length;
			var toolWidth = (btnWidth + 10) * btnCount - 10;
			if (mw < toolWidth) {
				mw = toolWidth;
			}
			mw += 100;
			if (hasInput == 1)  {
				mh += 25;
			} else if (hasInput == 2) {
					mh += 100;
			}
			var opt = { type: 'window', caption: caption, isCenter: true, resizable: false, minimizable: false, maximizable: false, stopEventBubbling: true, height: mh, width: mw };
			var owin = jslet.ui.createControl(opt);
			var iconHtml = '';
			if (iconClass) {
				iconHtml = '<div class="jl-msg-icon ';
				if (iconClass == 'info' || iconClass == 'error' || iconClass == 'question' || iconClass == 'warning') {
					iconHtml += 'jl-msg-icon-' + iconClass;
				} else {
					iconHtml += iconClass;
				}
				iconHtml += '"><i class="fa ';
				switch (iconClass) {
		            case 'info':
		            	iconHtml += 'fa-info';
		                break;
		            case 'error':
		            	iconHtml += 'fa-times';
		                break;
		            case 'success':
		            	iconHtml += 'fa-check';
		                break;
		            case 'warning':
		            	iconHtml += 'fa-exclamation';
		                break;
		            case 'question':
		            	iconHtml += 'fa-question';
		                break;
		            default :
		            	iconHtml += 'fa-info';
	                 	break;
		        }
				iconHtml += '"></i></div>';
			}
	
			var btnHtml = [], btnName, left, k = 0, i;
			if (jslet.locale.isRtl){
				for (i = btnCount - 1; i >=0; i--) {
					btnName = buttons[i];
					left = (k++) * (btnWidth + 10) - 10;
					btnHtml.push('<button class="jl-msg-button btn btn-default btn-sm" ');
					btnHtml.push(' data-jsletname="');
					btnHtml.push(btnName);
					btnHtml.push('" style="left: ');
					btnHtml.push(left);
					btnHtml.push('px">');
					btnHtml.push(jslet.locale.MessageBox[btnName]);
					btnHtml.push('</button>');
				}
			} else {
				for (i = 0; i < btnCount; i++) {
					btnName = buttons[i];
					left = i * (btnWidth + 10) - 10;
					btnHtml.push('<button class="jl-msg-button btn btn-default btn-sm" ');
					btnHtml.push('" data-jsletname="');
					btnHtml.push(btnName);
					btnHtml.push('" style="left: ');
					btnHtml.push(left);
					btnHtml.push('px">');
					btnHtml.push(jslet.locale.MessageBox[btnName]);
					btnHtml.push('</button>');
				}
			}
			var inputHtml = ['<br />'];
			if (hasInput) {
				if (hasInput == 1) {
					inputHtml.push('<input type="text"');
				} else {
					inputHtml.push('<textarea rows="5"');
				}
				inputHtml.push(' style="width:');
				inputHtml.push('98%"');
				if (defaultValue !== null && defaultValue !== undefined) {
					inputHtml.push(' value="');
					inputHtml.push(defaultValue);
					inputHtml.push('"');
				}
				if (hasInput == 1) {
					inputHtml.push(' />');
				} else {
					inputHtml.push('></textarea>');
				}
			}
			var html = ['<div class="jl-msg-container">', iconHtml, '<div class="' + (hasInput? 'jl-msg-message-noicon': 'jl-msg-message') + '">',
						message, inputHtml.join(''), '</div>', '</div>',
						'<div class="jl-msg-tool"><div style="position:relative;width:', toolWidth, 'px;margin:0px auto;">', btnHtml.join(''), '</div></div>'
			];
	
			owin.setContent(html.join(''));
			var jqEl = jQuery(owin.el);
			var toolBar = jqEl.find('.jl-msg-tool')[0].firstChild;
			var inputCtrl = null;
			if (hasInput == 1) {
				inputCtrl = jqEl.find('.jl-msg-container input')[0];
			} else {
				inputCtrl = jqEl.find('.jl-msg-container textarea')[0];
			}
			var obtn;
			for (i = 0; i < btnCount; i++) {
				obtn = toolBar.childNodes[i];
				obtn.onclick = function () {
					btnName = jQuery(this).attr('data-jsletname');
					var value = null;
					if (hasInput && btnName == 'ok') {
						value = inputCtrl.value;
						if (validateFn && !validateFn(value)) {
							inputCtrl.focus();
							return;
						}
					}
					owin.close();
					if (callbackFn) {
						callbackFn(btnName, value);
					}
				};
			}
	
			owin.onClosed(function () {
				if (callbackFn) {
					callbackFn(btnName);
				}
			});
			
			owin.showModal();
			owin.setZIndex(99981);
			k = 0;
			if (jslet.locale.isRtl) {
				k = btnCount - 1;
			}
			var toolBtn = toolBar.childNodes[k];
			toolBtn && toolBtn.focus();
			return owin;
		};
	};
	
	/**
	 * Show alert message. Example:
	 * <pre><code>
	 * jslet.ui.MessageBox.alert('Finished!', 'Tips');
	 * </code></pre>
	 */
	jslet.ui.MessageBox.alert = function (message, caption, callbackFn, timeout) {
		var omsgBox = new jslet.ui.MessageBox();
		if (!caption) {
			caption = jslet.locale.MessageBox.info;
		}
		var owin = omsgBox.show(message, caption, 'info', ['ok'], callbackFn);
		if(timeout) {
			timeout = parseInt(timeout);
			if(timeout !== NaN) {
				window.setTimeout(function() {
					owin.close()
				}, timeout);
			}
		}
	};
	
	/**
	 * Show error message. Example:
	 * <pre><code>
	 * jslet.ui.MessageBox.alert('You have made a mistake!', 'Error');
	 * </code></pre>
	 */
	jslet.ui.MessageBox.error = function (message, caption, callbackFn, timeout) {
		var omsgBox = new jslet.ui.MessageBox();
		if (!caption) {
			caption = jslet.locale.MessageBox.error;
		}
		var owin = omsgBox.show(message, caption, 'error', ['ok'], callbackFn);
		if(timeout) {
			timeout = parseInt(timeout);
			if(timeout !== NaN) {
				window.setTimeout(function() {
					owin.close()
				}, timeout);
			}
		}
	};
	
	/**
	 * Show warning message. Example:
	 * <pre><code>
	 * jslet.ui.MessageBox.warn('Program will be shut down!', 'Warning');
	 * </code></pre>
	 */
	jslet.ui.MessageBox.warn = function (message, caption, callbackFn) {
		var omsgBox = new jslet.ui.MessageBox();
		if (!caption) {
			caption = jslet.locale.MessageBox.warn;
		}
		omsgBox.show(message, caption, 'warning', ['ok'], callbackFn);
	};
	
	/**
	 * Show confirm message. Example:
	 * <pre><code>
	 * var callbackFn = function(button, value){
	 * alert('Button: ' + button + ' clicked!');
	 * }
	 * jslet.ui.MessageBox.warn('Are you sure?', 'Confirm', callbackFn);//show Ok/Cancel
	 * jslet.ui.MessageBox.warn('Are you sure?', 'Confirm', callbackFn, true);//show Yes/No/Cancel
	 * </code></pre>
	 */
	jslet.ui.MessageBox.confirm = function(message, caption, callbackFn, isYesNo){
		var omsgBox = new jslet.ui.MessageBox();
		if (!caption) {
			caption = jslet.locale.MessageBox.confirm;
		}
		if (!isYesNo) {
			omsgBox.show(message, caption, 'question',['ok', 'cancel'], callbackFn);	
		} else {
			omsgBox.show(message, caption, 'question', ['yes', 'no', 'cancel'], callbackFn);
		}
	};
	
	/**
	 * Prompt user to input some value. Example:
	 * <pre><code>
	 * var callbackFn = function(button, value){
	 * alert('Button: ' + button + ' clicked!');
	 * }
	 * var validateFn = function(value){
	 *  if (!value){
	 *    alert('Please input some thing!');
	 * return false;
	 *  }
	 *  return true;
	 * }
	 * jslet.ui.MessageBox.prompt('Input your name: ', 'Prompt', callbackFn, 'Bob', validateFn);
	 * jslet.ui.MessageBox.warn('Input your comments: ', 'Prompt', callbackFn, null, validateFn, true);
	 * </code></pre>
	 */
	jslet.ui.MessageBox.prompt = function (message, caption, callbackFn, defaultValue, validateFn, isMultiLine) {
		var omsgBox = new jslet.ui.MessageBox();
		if (!caption) {
			caption = jslet.locale.MessageBox.prompt;
		}
		if (!isMultiLine) {
			omsgBox.show(message, caption, null, ['ok', 'cancel'], callbackFn, 1, defaultValue, validateFn);
		} else {
			omsgBox.show(message, caption, null, ['ok', 'cancel'], callbackFn, 2, defaultValue, validateFn);
		}
	};
	
	/* ========================================================================
	 * Jslet framework: jslet.listviewmodel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * Find dialog for DBTable and DBTreeView control
	 */
	jslet.ui.FindDialog = function (dbContainer) {
		var _dialog;
		var _dataset = dbContainer.dataset();
		var _containerEl = dbContainer.el;
		var _currfield = null;
		var _findingField = null;
		
		function initialize() {
			var opt = { type: 'window', caption: 'Find', isCenter: false, resizable: true, minimizable: false, maximizable: false, stopEventBubbling: true, height: 85, width: 320 };
			_dialog = jslet.ui.createControl(opt, _containerEl);
			_dialog.onClosed(function(){
				return 'hidden';
			});
			var content = '<div class="form-horizontal"><div class="form-group form-group-sm jl-nogap"><div class="col-sm-9 jl-nogap"><input class="form-control jl-finddlg-value jl-nogap"/></div>' + 
			'<div class="col-sm-2 jl-nogap"><select class="form-control jl-finddlg-opt jl-nogap">' + 
			'<option title="' + jslet.locale.findDialog.matchFirst + '">=*</option>' + 
			'<option>=</option>' + 
			'<option title="' + jslet.locale.findDialog.matchLast + '">*=</option>' + 
			'<option title="' + jslet.locale.findDialog.matchAny + '">*=*</option></select></div>' +
			'<div class="col-sm-1 btn-group btn-group-sm jl-nogap"><button class="btn jl-finddlg-find fa fa-search"></button></div></div>'
				
			_dialog.setContent(content);
			var dlgEl = _dialog.el;
			var jqOptions = jQuery(dlgEl).find('.jl-finddlg-opt');
	
			var jqFindingValue = jQuery(dlgEl).find('.jl-finddlg-value');
			jqFindingValue.on('keydown', function(event){
				if(event.keyCode === 13) {
					findData();
		       		event.stopImmediatePropagation();
					event.preventDefault();
					return false;
				}
			});
			
			var jqFind = jQuery(dlgEl).find('.jl-finddlg-find');
			jqFind.on('click', function(event) {
				findData();
			});
	
			function findData() {
				var matchType = jqOptions.val();
				if(matchType == '=*') {
					matchType = 'first';
				} else if(matchType == '*=') {
					matchType = 'last';
				} else if(matchType == '*=*') {
					matchType = 'any';
				} else {
					matchType = null;
				}
				_dataset.findByField(_findingField, jqFindingValue.val(), true, true, matchType);
			}
		}
		
		this.show = function(left, top) {
			left = left || 0;
			top = top || 0;
			_dialog.show(left, top);
		};
		
		this.hide = function() {
			_dialog.hide();
		};
		
		this.findingField = function(findingField) {
			if(findingField === undefined) {
				return _findingField;
			}
			_findingField = findingField;
			if(_findingField) {
				var fldObj = _dataset.getField(_findingField);
				if(fldObj) {
					_dialog.changeCaption(jslet.formatString(jslet.locale.findDialog.caption, [fldObj.label()]));
				}
			}
		};
		
		initialize();
		this.hide();
	};
	
	/**
	 * Filter dialog for DBTable and DBTreeView control
	 */
	jslet.ui.FilterDialog = function (dataset, fields) {
		
	};
	
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbchart.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBChart, show data as a chart. There are five chart type: column, bar, line, area, pie  
	 * Example:
	 * <pre><code>
	 *		var jsletParam = {type:"dbchart", dataset:"summary", chartType:"column",categoryField:"month",valueFields:"amount"};
	 * 
	 * //1. Declaring:
	 *		&lt;div id="chartId" data-jslet='type:"dbchart",chartType:"column",categoryField:"month",valueFields:"amount,netProfit", dataset:"summary"' />
	 *		or
	 *		&lt;div data-jslet='jsletParam' />
	 *
	 *  //2. Binding
	 *		&lt;div id="ctrlId"  />
	 *		//Js snippet
	 *		var el = document.getElementById('ctrlId');
	 *		jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 *		jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBChart = jslet.Class.create(jslet.ui.DBControl, {
		chartTypes: ['line', 'bar', 'stackbar', 'pie'],
		legendPositions: ['none', 'top', 'bottom', 'left', 'right'],
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,chartType,chartTitle,categoryField,valueFields,legendPos';
			Z.requiredProperties = 'valueFields,categoryField';
			
			/**
			 * {String} Chart type. Optional value is: column, bar, line, area, pie
			 */
			Z._chartType = "line";
			/**
			 * {String} Category field, use comma(,) to separate multiple fields.
			 */
			Z._categoryFields = null;
			/**
			 * {Number} Value field, only one field allowed.
			 */
			Z._valueFields = null;
			/**
			 * {String} Chart title
			 */
			Z._chartTitle = null;
	
			/**
			 * {String} Legend position, optional value: none, top, bottom, left, right
			 */
			Z._legendPos = 'top';
			
			Z._fieldValidated = false;
			
			$super(el, params);
		},
	
		chartType: function(chartType) {
			if(chartType === undefined) {
				return this._chartType;
			}
			chartType = jQuery.trim(chartType);
			var checker = jslet.Checker.test('DBChart.chartType', chartType).isString().required();
			checker.testValue(chartType.toLowerCase()).inArray(this.chartTypes);
			this._chartType = chartType;
		},
		
		categoryField: function(categoryField) {
			if(categoryField === undefined) {
				return this._categoryField;
			}
			jslet.Checker.test('DBChart.categoryField', categoryField).isString().required();
			categoryField = jQuery.trim(categoryField);
			this._categoryField = categoryField;
			this._fieldValidated = false;
		},
		
		valueFields: function(valueFields) {
			if(valueFields === undefined) {
				return this._valueFields;
			}
			jslet.Checker.test('DBChart.valueFields', valueFields).isString().required();
			valueFields = jQuery.trim(valueFields);
			this._valueFields = valueFields.split(',');
			this._fieldValidated = false;
		},
		
		chartTitle: function(chartTitle) {
			if(chartTitle === undefined) {
				return this._chartTitle;
			}
			jslet.Checker.test('DBChart.chartTitle', chartTitle).isString();
			this._chartTitle = chartTitle;
		},
		
		legendPos: function(legendPos) {
			if(legendPos === undefined) {
				return this._legendPos;
			}
			legendPos = jQuery.trim(legendPos);
			var checker = jslet.Checker.test('DBChart.legendPos', legendPos).isString().required();
			checker.testValue(legendPos.toLowerCase()).inArray(this.legendPositions);
			this._legendPos = legendPos;
		},
			
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
	
		/**
		 * @override
		 */
		bind: function () {
			if(!this.el.id) {
				this.el.id = jslet.nextId();
			}
			this.renderAll();
		}, // end bind
	
		_validateFields: function() {
			var Z = this;
			if(Z._fieldValidated) {
				return;
			}
			var dsObj = Z._dataset,
				fldName = Z._categoryField;
			if (!dsObj.getField(fldName)) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			
			for(var i = 0, len = Z._valueFields.length; i < len; i++) {
				fldName = Z._valueFields[i];
				if(!dsObj.getField(fldName)) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
				}
			}
			Z._fieldValidated = true;
		},
		
		_getLineData: function() {
			var Z = this,
				dsObj = Z._dataset;
			if (dsObj.recordCount() === 0) {
				return {xLabels: [], yValues: []};
			}
			var oldRecno = dsObj.recnoSilence(),
				xLabels = [],
				yValues = [];
	
			try {
				var isInit = false, valueFldName,
					valueFldCnt = Z._valueFields.length,
					valueArr,
					legendLabels = [];
				for(var k = 0, recCnt = dsObj.recordCount(); k < recCnt; k++) {
					dsObj.recnoSilence(k);
					xLabels.push(dsObj.getFieldText(Z._categoryField));
					for(var i = 0; i < valueFldCnt; i++) {
						valueFldName = Z._valueFields[i];
						if(!isInit) {
							valueArr = [];
							yValues.push(valueArr);
							legendLabels.push(dsObj.getField(valueFldName).label());
						} else {
							valueArr = yValues[i];
						}
						valueArr.push(dsObj.getFieldValue(valueFldName));
					}
					isInit = true;
				} //End for k
			} finally {
				dsObj.recnoSilence(oldRecno);
			}
			return {xLabels: xLabels, yValues: yValues, legendLabels: legendLabels};
		},
	
		_getPieData: function() {
			var Z = this,
				dsObj = Z._dataset;
			if (dsObj.recordCount() === 0) {
				return [];
			}
			var oldRecno = dsObj.recnoSilence(),
				result = [];
				
			try {
				var valueFldName = Z._valueFields[0],
					label, value;
				for(var k = 0, recCnt = dsObj.recordCount(); k < recCnt; k++) {
					dsObj.recnoSilence(k);
					label = dsObj.getFieldText(Z._categoryField);
					value = dsObj.getFieldValue(valueFldName);
					result.push([label, value]);
				}
			} finally {
				dsObj.recnoSilence(oldRecno);
			}
			return result;
		},
	
		_drawLineChart: function() {
			var Z = this;
			var chartData = Z._getLineData();
			
			jQuery.jqplot(Z.el.id, chartData.yValues, 
			{ 
				title: Z._chartTitle, 
	            animate: !jQuery.jqplot.use_excanvas,
				// Set default options on all series, turn on smoothing.
				seriesDefaults: {
					rendererOptions: {smooth: true},
					pointLabels: {show: true, formatString: '%d'}				
				},
				
				legend:{ show:true,
					labels: chartData.legendLabels
				},
				
	            axes: {
					xaxis: {
						renderer: $.jqplot.CategoryAxisRenderer,
						ticks: chartData.xLabels
					}
				}
			});
		},
			
		_drawPieChart: function() {
			var Z = this;
			var chartData = Z._getPieData();
			
			jQuery.jqplot(Z.el.id, [chartData], {
				title: Z._chartTitle, 
	            animate: !jQuery.jqplot.use_excanvas,
				seriesDefaults:{
					renderer: $.jqplot.PieRenderer ,
					pointLabels: {show: true, formatString: '%d'}				
				},
				legend:{ show:true }
			});
		},
		
		_drawBarChart: function(isStack) {
			var Z = this;
			var chartData = Z._getLineData();
	
	        jQuery.jqplot(Z.el.id, chartData.yValues, {
				title: Z._chartTitle,
				stackSeries: isStack,
	            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
	            animate: !jQuery.jqplot.use_excanvas,
	            seriesDefaults:{
	                renderer:$.jqplot.BarRenderer,
					pointLabels: {show: true, formatString: '%d'}				
	            },
	
				legend:{ show:true,
					labels: chartData.legendLabels
				},
				
	            axes: {
	                xaxis: {
	                    renderer: $.jqplot.CategoryAxisRenderer,
	                    ticks: chartData.xLabels
	                }
	            },
	            highlighter: { show: false }
	        });	
		},
		
		drawChart: function () {
			var Z = this,
				dsObj = Z._dataset;
				
			Z.el.innerHTML = '';
			Z._validateFields();
			if(Z._chartType == 'pie') {
				Z._drawPieChart();
				return;
			}
			if(Z._chartType == 'line') {
				Z._drawLineChart();
				return;
			}
			if(Z._chartType == 'bar') {
				Z._drawBarChart(false);
				return;
			}
			if(Z._chartType == 'stackbar') {
				Z._drawBarChart(true);
				return;
			}
			
			
		}, // end draw chart
	
		refreshControl: function (evt) {
			var evtType = evt.eventType;
			if (evtType == jslet.data.RefreshEvent.UPDATEALL || 
				evtType == jslet.data.RefreshEvent.UPDATERECORD ||
				evtType == jslet.data.RefreshEvent.UPDATECOLUMN || 
				evtType == jslet.data.RefreshEvent.INSERT || 
				evtType == jslet.data.RefreshEvent.DELETE) {
				this.drawChart()
			}
		},
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			this.swf = null;
			$super();
		}
	});
	
	jslet.ui.register('DBChart', jslet.ui.DBChart);
	jslet.ui.DBChart.htmlTemplate = '<div></div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbeditpanel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	* DBEditPanel
	*/
	jslet.ui.DBEditPanel = jslet.Class.create(jslet.ui.DBControl, {
		_totalColumns: 12, //Bootstrap column count 
		/**
		 * @override
		*/
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,columnCount,labelCols,onlySpecifiedFields,fields';
			
			/**
			 * {Integer} Column count
			 */
			Z._columnCount = 3;
			/**
			 * {Integer} The gap between label and editor
			 */
			Z._labelCols = 1;
	
			/**
			 * {Boolean} True - only show specified fields, false otherwise.
			 */
			Z._onlySpecifiedFields = false;
			/**
			 * Array of edit field configuration, prototype: [{field: "field1", colSpan: 2, rowSpan: 1}, ...]
			 */
			Z._fields;
			
			Z._metaChangedDebounce = jslet.debounce(Z.renderAll, 10);
	
			$super(el, params);
		},
		
		columnCount: function(columnCount) {
			if(columnCount === undefined) {
				return this._columnCount;
			}
			jslet.Checker.test('DBEditPanel.columnCount', columnCount).isGTZero();
			this._columnCount = parseInt(columnCount);
		},
		
		labelCols: function(labelCols) {
			if(labelCols === undefined) {
				return this._labelCols;
			}
			jslet.Checker.test('DBEditPanel.labelCols', labelCols).isNumber().between(1,3);
			this._labelCols = parseInt(labelCols);
		},
		
		onlySpecifiedFields: function(onlySpecifiedFields) {
			if(onlySpecifiedFields === undefined) {
				return this._onlySpecifiedFields;
			}
			this._onlySpecifiedFields = onlySpecifiedFields ? true: false;
		},
		
		fields: function(fields) {
			if(fields === undefined) {
				return this._fields;
			}
			jslet.Checker.test('DBEditPanel.fields', fields).isArray();
			var fldCfg;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldCfg = fields[i];
				jslet.Checker.test('DBEditPanel.fields.field', fldCfg.field).isString().required();
				jslet.Checker.test('DBEditPanel.fields.labelCols', fldCfg.colSpan).isNumber().between(1,3);
				jslet.Checker.test('DBEditPanel.fields.dataCols', fldCfg.colSpan).isNumber().between(1,11);
				fldCfg.inFirstCol = fldCfg.inFirstCol ? true: false;
				fldCfg.showLine = fldCfg.showLine ? true: false;
				fldCfg.visible = (fldCfg.visible === undefined || fldCfg.visible) ? true: false;
			}
			this._fields = fields;
		},
		
		/**
		 * @override
		*/
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
		
		/**
		 * @override
		 */
		bind: function () {
			this.renderAll();
		},
		
		_calcLayout: function () {
			var Z = this,
				allFlds = Z._dataset.getNormalFields(), 
				fldLayouts, fldObj;
			
			if (!Z._onlySpecifiedFields) {
				fldLayouts = [];
				var fldName, found, editFld, maxFld, visible,
					layoutcnt = Z._fields ? Z._fields.length : 0;
				for (var i = 0, fcnt = allFlds.length; i < fcnt; i++) {
					fldObj = allFlds[i];
					fldName = fldObj.name();
					visible = fldObj.visible();
					found = false;
					for (var j = 0; j < layoutcnt; j++) {
						editFld = Z._fields[j];
						if (fldName == editFld.field) {
							found = true;
							if(editFld.visible === undefined || editFld.visible) {
								fldLayouts.push(editFld);
							}
							break;
						}
					}
					
					if (!found) {
						if(!visible) {
							continue;
						}
						fldLayouts.push({
							field: fldObj.name()
						});
					}
				} //end for i
			} else {
				fldLayouts = Z._fields;
			}
	
			var dftDataCols = Math.floor((Z._totalColumns - Z._labelCols * Z._columnCount) / Z._columnCount);
			if(dftDataCols <= 0) {
				dftDataCols = 1;
			}
	
			//calc row, col
			var layout, r = 0, c = 0, colsInRow = 0, itemCnt;
			for (var i = 0, cnt = fldLayouts.length; i < cnt; i++) {
				layout = fldLayouts[i];
				if(!layout.labelCols) {
					layout._innerLabelCols = Z._labelCols;
				}
				if(!layout.dataCols) {
					layout._innerDataCols = dftDataCols
				} else {
					layout._innerDataCols = layout.dataCols;	
				}
				itemCnt = layout._innerLabelCols + layout._innerDataCols;
				if (layout.inFirstCol || layout.showLine || colsInRow + itemCnt > Z._totalColumns) {
					r++;
					colsInRow = 0;
				}
				layout.row = r;
				colsInRow += itemCnt;
			}
			return fldLayouts;
		},
		
		getEditField: function (fieldName) {
			var Z = this;
			if (!Z._fields) {
				Z._fields = [];
			}
			var editFld;
			for (var i = 0, cnt = Z._fields.length; i < cnt; i++) {
				editFld = Z._fields[i];
				if (editFld.field == fieldName) {
					return editFld;
				}
			}
			var fldObj = Z._dataset.getField(fieldName);
			if (!fldObj) {
				return null;
			}
			editFld = {
				field: fieldName
			};
			Z._fields.push(editFld);
			return editFld;
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var Z = this;
			Z.removeAllChildControls();
			var jqEl = jQuery(Z.el);
			if (!jqEl.hasClass('jl-editpanel')) {
				jqEl.addClass('jl-editpanel form-horizontal');
			}
			jqEl.html('');
			var allFlds = Z._dataset.getNormalFields(),
				fcnt = allFlds.length;
			var layouts = Z._calcLayout();
			//calc max label width
				
			var r = -1, oLabel, editorCfg, fldName, fldObj, ohr, octrlDiv, opanel, ctrlId, dbCtrl;
			for (var i = 0, cnt = layouts.length; i < cnt; i++) {
				layout = layouts[i];
				if (layout.showLine) {
					ohr = document.createElement('hr');
					Z.el.appendChild(ohr);
				}
				if (layout.row != r) {
					opanel = document.createElement('div');
					opanel.className = 'form-group form-group-sm';
					Z.el.appendChild(opanel);
					r = layout.row;
	
				}
				fldName = layout.field;
				fldObj = Z._dataset.getField(fldName);
				if (!fldObj) {
					throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
				}
				editorCfg = fldObj.editControl();
				var isCheckBox = editorCfg.type.toLowerCase() == 'dbcheckbox';
				if(isCheckBox) {
					oLabel = document.createElement('div');
					opanel.appendChild(oLabel);
					oLabel.className = 'col-sm-' + layout._innerLabelCols;
	
					octrlDiv = document.createElement('div');
					opanel.appendChild(octrlDiv);
					octrlDiv.className = 'col-sm-' + layout._innerDataCols;
					
					editorCfg.dataset = Z._dataset;
					editorCfg.field = fldName;
					editor = jslet.ui.createControl(editorCfg, null);
					octrlDiv.appendChild(editor.el);
					Z.addChildControl(editor);
					
					oLabel = document.createElement('label');
					octrlDiv.appendChild(oLabel);
					dbCtrl = new jslet.ui.DBLabel(oLabel, {
						type: 'DBLabel',
						dataset: Z._dataset,
						field: fldName
					});
					
					ctrlId = jslet.nextId();
					editor.el.id = ctrlId;
					jQuery(oLabel).attr('for', ctrlId);
					Z.addChildControl(dbCtrl);
				} else {
					oLabel = document.createElement('label');
					opanel.appendChild(oLabel);
					oLabel.className = 'col-sm-' + layout._innerLabelCols;
					dbctrl = new jslet.ui.DBLabel(oLabel, {
						type: 'DBLabel',
						dataset: Z._dataset,
						field: fldName
					});
					Z.addChildControl(dbCtrl);
					
					octrlDiv = document.createElement('div');
					opanel.appendChild(octrlDiv);
					octrlDiv.className = 'col-sm-' + layout._innerDataCols;
					
					if (fldObj.valueStyle() == jslet.data.FieldValueStyle.BETWEEN) {
						editorCfg = {
							type: 'DBBetweenEdit'
						};
					}
					
					editorCfg.dataset = Z._dataset;
					editorCfg.field = fldName;
					editor = jslet.ui.createControl(editorCfg, null);
					octrlDiv.appendChild(editor.el);
					ctrlId = jslet.nextId();
					editor.el.id = ctrlId;
					jQuery(oLabel).attr('for', ctrlId);
					Z.addChildControl(editor);
				}
			}
		}, // render All
		
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			if(metaName && (metaName == 'visible' || metaName == 'editControl')) {
				this._metaChangedDebounce.call(this);
			}
		}
	});
	
	jslet.ui.register('DBEditPanel', jslet.ui.DBEditPanel);
	jslet.ui.DBEditPanel.htmlTemplate = '<div></div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbinspector.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBInspector. 
	 * Display&Edit fields in two columns: Label column and Value column. If in edit mode, this control takes the field editor configuration from dataset field object.
	 * Example:
	 * <pre><code>
	 *  var jsletParam = {type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100};
	 * 
	 * //1. Declaring:
	 *  &lt;div id='ctrlId' data-jslet='type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100' />
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
	jslet.ui.DBInspector = jslet.Class.create(jslet.ui.DBControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,columnCount,rowHeight,fields';
			
			/**
			 * {Integer} Column count
			 */
			Z._columnCount = 1;
			/**
			 * {Integer} Row height
			 */
			Z._rowHeight = 30;
			
			Z._fields = null;
			
			Z._metaChangedDebounce = jslet.debounce(Z.renderAll, 10);
	
			$super(el, params);
		},
		
		columnCount: function(columnCount) {
			if(columnCount === undefined) {
				return this._columnCount;
			}
			jslet.Checker.test('DBInspector.columnCount', columnCount).isGTZero();
			this._columnCount = parseInt(columnCount);
		},
		
		rowHeight: function(rowHeight) {
			if(rowHeight === undefined) {
				return this._rowHeight;
			}
			jslet.Checker.test('DBInspector.rowHeight', rowHeight).isGTZero();
			this._rowHeight = parseInt(rowHeight);
		},
		
		fields: function(fields) {
			if(fields === undefined) {
				return this._fields;
			}
			jslet.Checker.test('DBInspector.fields', fields).isArray();
			var fldCfg;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldCfg = fields[i];
				jslet.Checker.test('DBInspector.fields.field', fldCfg.field).isString().required();
				fldCfg.visible = fldCfg.visible ? true: false;
			}
			this._fields = fields;
		},
		
		/**
		* @override
		*/
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
		
			/**
			 * @override
			 */
		bind: function () {
			var Z = this;
			var colCnt = Z._columnCount;
			if (colCnt) {
				colCnt = parseInt(colCnt);
			}
			if (colCnt && colCnt > 0) {
				Z._columnCount = colCnt;
			} else {
				Z._columnCount = 1;
			}
			Z.renderAll();
		}, // end bind
		
			/**
			 * @override
			 */
		renderAll: function () {
			var Z = this,
				jqEl = jQuery(Z.el);
			Z.removeAllChildControls();
			
			if (!jqEl.hasClass('jl-inspector'))
				jqEl.addClass('jl-inspector jl-round5');
			var totalWidth = jqEl.width(),
				allFlds = Z._dataset.getFields();
			jqEl.html('<table cellpadding=0 cellspacing=0 style="margin:0;padding:0;table-layout:fixed;width:100%;height:100%"><tbody></tbody></table>');
			var oCol, fldObj, i, found, visible, fldName, cfgFld,
				fcnt = allFlds.length,
				visibleFlds = [];
			for (i = 0; i < fcnt; i++) {
				fldObj = allFlds[i];
				fldName = fldObj.name();
				found = false;
				if(Z._fields) {
					for(var j = 0, len = Z._fields.length; j < len; j++) {
						cfgFld = Z._fields[j];
						if(fldName == cfgFld.field) {
							found = true;
							visible = cfgFld.visible? true: false;
							break;
						} 
					}
				}
				if(!found) {
					visible = fldObj.visible();
				}
				if (visible) {
					visibleFlds.push(fldObj);
				}
			}
			fcnt = visibleFlds.length;
			if (fcnt === 0) {
				return;
			}
			var w, c, columnCnt = Math.min(fcnt, Z._columnCount), arrLabelWidth = [];
			for (i = 0; i < columnCnt; i++) {
				arrLabelWidth[i] = 0;
			}
			var startWidth = jslet.ui.textMeasurer.getWidth('*');
			jslet.ui.textMeasurer.setElement(Z.el);
			for (i = 0; i < fcnt; i++) {
				fldObj = visibleFlds[i];
				c = i % columnCnt;
				w = Math.round(jslet.ui.textMeasurer.getWidth(fldObj.label()) + startWidth) + 5;
				if (arrLabelWidth[c] < w) {
					arrLabelWidth[c] = w;
				}
			}
			jslet.ui.textMeasurer.setElement();
			
			var totalLabelWidth = 0;
			for (i = 0; i < columnCnt; i++) {
				totalLabelWidth += arrLabelWidth[i];
			}
			
			var editorWidth = Math.round((totalWidth - totalLabelWidth) / columnCnt);
			
			var otable = Z.el.firstChild,
				tHead = otable.createTHead(), otd, otr = tHead.insertRow(-1);
			otr.style.height = '0';
			for (i = 0; i < columnCnt; i++) {
				otd = otr.insertCell(-1);
				otd.style.width = arrLabelWidth[i] + 'px';
				otd.style.height = '0';
				otd = otr.insertCell(-1);
				otd.style.height = '0';
			}
			
			var oldRowNo = -1, oldC = -1, rowNo, odiv, oLabel, fldName, editor, fldCtrl, dbCtrl;
			Z.preRowIndex = -1;
			for (i = 0; i < fcnt; i++) {
				fldObj = visibleFlds[i];
				fldName = fldObj.name();
				rowNo = Math.floor(i / columnCnt);
				c = i % columnCnt;
				if (oldRowNo != rowNo) {
					otr = otable.insertRow(-1);
					if (Z._rowHeight) {
						otr.style.height = Z._rowHeight + 'px';
					}
					oldRowNo = rowNo;
				}
				
				otd = otr.insertCell(-1);
				otd.noWrap = true;
				otd.className = jslet.ui.htmlclass.DBINSPECTOR.labelColCls;
				
				oLabel = document.createElement('label');
				otd.appendChild(oLabel);
				dbCtrl = new jslet.ui.DBLabel(oLabel, {
					type: 'DBLabel',
					dataset: Z._dataset,
					field: fldName
				});
				Z.addChildControl(dbCtrl);
				
				otd = otr.insertCell(-1);
				otd.className = jslet.ui.htmlclass.DBINSPECTOR.editorColCls;
				otd.noWrap = true;
				otd.align = 'left';
				odiv = document.createElement('div');
				odiv.noWrap = true;
				otd.appendChild(odiv);
				fldCtrl = fldObj.editControl();
				fldCtrl.dataset = Z._dataset;
				fldCtrl.field = fldName;
				
				editor = jslet.ui.createControl(fldCtrl, odiv);
				if (!editor.isCheckBox) {
					editor.el.style.width = '100%';//editorWidth - 10 + 'px';
				}
				Z.addChildControl(editor);
			} // end for
		},
		
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			if(metaName && (metaName == 'visible' || metaName == 'editControl')) {
				this._metaChangedDebounce.call(this);
			}
		}
	});
	
	jslet.ui.htmlclass.DBINSPECTOR = {
		labelColCls: 'jl-inspector-label',
		editorColCls: 'jl-inspector-editor'
	};
	
	jslet.ui.register('DBInspector', jslet.ui.DBInspector);
	jslet.ui.DBInspector.htmlTemplate = '<div></div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbtable.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	jslet.ui.htmlclass.TABLECLASS = {
		currentrow: 'jl-tbl-current',
		scrollBarWidth: 16,
		selectColWidth: 30,
		hoverrow: 'jl-tbl-row-hover',
		
		sortAscChar: '&#8593;',
		sortDescChar: '&#8595;'
	};
	
	/**
	 * Table column
	 */
	jslet.ui.TableColumn = function () {
		var Z = this;
		Z.field = null;   //String, field name
		Z.colNum = null;  //Integer, column number
		Z.label = null;   //String, column header label
		Z.title = null;   //String, column header title
		Z.displayOrder = null; //Integer, display order
		Z.width = null;   //Integer, column display width
		Z.colSpan = null; //Integer, column span
		Z.disableHeadSort = false; //Boolean, true - user sort this column by click column header
		Z.mergeSame = false; //Boolean, true - if this column value of adjoined rows is same then merge these rows 
		Z.noRefresh = false; //Boolean, true - do not refresh for customized column
		Z.visible = true; //Boolean, identify specified column is visible or not 
		Z.cellRender = null; //Function, column cell render for customized column  
	};
	
	/**
	 * Sub group, use this class to implement complex requirement in one table row, like master-detail style row
	 */
	jslet.ui.TableSubgroup = function(){
	var Z = this;
		Z.hasExpander = true; //Boolean, true - will add a new column automatically, click this column will expand or collapse subgroup panel
		Z.template = null;//String, html template 
		Z.height = 0; //Integer, subgroup panel height
	};
	
	/**
	 * Table column header, use this class to implement hierarchical header
	 */
	jslet.ui.TableHead = function(){
		var Z = this;
		Z.label = null; //String, Head label
		Z.title = null; //String, Head title
		Z.id = null;//String, Head id
		Z.rowSpan = 0;  //@private
		Z.colSpan = 0;  //@private
		Z.disableHeadSort = false; //Boolean, true - user sort this column by click column header
		Z.subHeads = null; //array of jslet.ui.TableHead
	};
	
	jslet.ui.AbstractDBTable = jslet.Class.create(jslet.ui.DBControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			
			Z.allProperties = 'dataset,fixedRows,fixedCols,hasSeqCol,hasSelectCol,reverseSeqCol,seqColHeader,noborder,readOnly,hideHead,disableHeadSort,onlySpecifiedCol,selectBy,rowHeight,onRowClick,onRowDblClick,onSelect,onSelectAll,onCustomSort,onFillRow,onFillCell,treeField,columns,subgroup,aggraded,autoClearSelection,onCellClick,defaultCellRender,hasFindDialog,hasFilterDialog';
			
			Z._fixedRows = 0;
	
			Z._fixedCols = 0;
	
			Z._hasSeqCol = true;
			
			Z._reverseSeqCol = false;
		
			Z._seqColHeader = null;
	
			Z._hasSelectCol = false;
			
			Z._noborder = false;
			
			Z._readOnly = true;
	
			Z._hideHead = false;
			
			Z._onlySpecifiedCol = false;
			
			Z._disableHeadSort = false;
			
			Z._aggraded = true;
			
			Z._autoClearSelection = true;
			
			Z._selectBy = null;
	
			Z._rowHeight = 25;
	
			Z._headRowHeight = 25;
	
			Z._treeField = null;
	
			Z._columns = null;
			
			Z._onRowClick = null;
	
			Z._onRowDblClick = null;
			
			Z._onCellClick;
			
			Z._onCustomSort = null; 
			
			Z._onSelect = null;
	
			Z._onSelectAll = null;
			
			Z._onFillRow = null;
			
			Z._onFillCell = null;		
	
			Z._defaultCellRender = null;
	
			Z._hasFindDialog = true;
			
			Z._hasFilterDialog = false;
			//@private
			Z._repairHeight = 0;
			Z.contentHeight = 0;
			Z.subgroup = null;//jslet.ui.TableSubgroup
			
			Z._sysColumns = null;//all system column like sequence column, select column, sub-group column
			Z._isHoriOverflow = false;
			Z._oldHeight = null;
			
			Z._currRow = null;
			Z._currColNum = 0;
			Z._editingField = null;
			Z._editorTabIndex = 1;
			Z._rowHeightChanged = false;
			$super(el, params);
		},
		
		/**
		 * Get or set Fixed row count.
		 * 
		 * @param {Integer or undefined} rows fixed rows.
		 * @return {Integer or this}
		 */
		fixedRows: function(rows) {
			if(rows === undefined) {
				return this._fixedRows;
			}
				jslet.Checker.test('DBTable.fixedRows', rows).isNumber();
			this._fixedRows = parseInt(rows);
		},
		
		/**
		 * Get or set Fixed column count.
		 * 
		 * @param {Integer or undefined} cols fixed cols.
		 * @return {Integer or this}
		 */
		fixedCols: function(cols) {
			if(cols === undefined) {
				return this._fixedCols;
			}
			jslet.Checker.test('DBTable.fixedCols', cols).isNumber();
			this._fixedCols = parseInt(cols);
		},
		
		/**
		 * Get or set row height of table row.
		 * 
		 * @param {Integer or undefined} rowHeight table row height.
		 * @return {Integer or this}
		 */
		rowHeight: function(rowHeight) {
			if(rowHeight === undefined) {
				return this._rowHeight;
			}
			jslet.Checker.test('DBTable.rowHeight', rowHeight).isGTZero();
			this._rowHeight = parseInt(rowHeight);
			this._rowHeightChanged = true;
		},
		
		/**
		 * Get or set row height of table header.
		 * 
		 * @param {Integer or undefined} headRowHeight table header row height.
		 * @return {Integer or this}
		 */
		headRowHeight: function(headRowHeight) {
			if(headRowHeight === undefined) {
				return this._headRowHeight;
			}
			jslet.Checker.test('DBTable.headRowHeight', headRowHeight).isGTZero();
			this._headRowHeight = parseInt(headRowHeight);
		},
		
		/**
		 * Identify whether there is sequence column in DBTable.
		 * 
		 * @param {Boolean or undefined} hasSeqCol true(default) - has sequence column, false - otherwise.
		 * @return {Boolean or this}
		 */
		hasSeqCol: function(hasSeqCol) {
			if(hasSeqCol === undefined) {
				return this._hasSeqCol;
			}
			this._hasSeqCol = hasSeqCol ? true: false;
		},
	
		/**
		 * Identify whether the sequence number is reverse.
		 * 
		 * @param {Boolean or undefined} reverseSeqCol true - the sequence number is reverse, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		reverseSeqCol: function(reverseSeqCol) {
			if(reverseSeqCol === undefined) {
				return this._reverseSeqCol;
			}
			this._reverseSeqCol = reverseSeqCol ? true: false;
		},
			
		/**
		 * Get or set sequence column header.
		 * 
		 * @param {String or undefined} seqColHeader sequence column header.
		 * @return {String or this}
		 */
		seqColHeader: function(seqColHeader) {
			if(seqColHeader === undefined) {
				return this._seqColHeader;
			}
			this._seqColHeader = seqColHeader;
		},
			
		/**
		 * Identify whether there is "select" column in DBTable.
		 * 
		 * @param {Boolean or undefined} hasSelectCol true(default) - has "select" column, false - otherwise.
		 * @return {Boolean or this}
		 */
		hasSelectCol: function(hasSelectCol) {
			if(hasSelectCol === undefined) {
				return this._hasSelectCol;
			}
			this._hasSelectCol = hasSelectCol ? true: false;
		},
		
		/**
		 * Identify the table has border or not.
		 * 
		 * @param {Boolean or undefined} noborder true - the table without border, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		noborder: function(noborder) {
			if(noborder === undefined) {
				return this._noborder;
			}
			this._noborder = noborder ? true: false;
		},
		
		/**
		 * Identify the table is read only or not.
		 * 
		 * @param {Boolean or undefined} readOnly true(default) - the table is read only, false - otherwise.
		 * @return {Boolean or this}
		 */
		readOnly: function(readOnly) {
			var Z = this;
			if(readOnly === undefined) {
				return Z._readOnly;
			}
			Z._readOnly = readOnly ? true: false;
			if(!Z._readOnly && !Z._rowHeightChanged) {
				Z._rowHeight = 35;
			}
		},
		
		/**
		 * Identify the table is hidden or not.
		 * 
		 * @param {Boolean or undefined} hideHead true - the table header is hidden, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		hideHead: function(hideHead) {
			if(hideHead === undefined) {
				return this._hideHead;
			}
			this._hideHead = hideHead ? true: false;
		},
		
		/**
		 * Identify the table has aggraded row or not.
		 * 
		 * @param {Boolean or undefined} aggraded true - the table has aggraded row, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		aggraded: function(aggraded) {
			if(aggraded === undefined) {
				return this._aggraded;
			}
			this._aggraded = aggraded ? true: false;
		},
	
		/**
		 * Identify whether automatically clear selection when selecting table cells.
		 * 
		 * @param {Boolean or undefined} autoClearSelection true(default) - automatically clear selection, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		autoClearSelection: function(autoClearSelection) {
			if(autoClearSelection === undefined) {
				return this._autoClearSelection;
			}
			this._autoClearSelection = autoClearSelection ? true: false;
		},
		
		/**
		 * Identify disable table head sorting or not.
		 * 
		 * @param {Boolean or undefined} disableHeadSort true - disable table header sorting, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		disableHeadSort: function(disableHeadSort) {
			if(disableHeadSort === undefined) {
				return this._disableHeadSort;
			}
			this._disableHeadSort = disableHeadSort ? true: false;
		},
		
		/**
		 * Identify show the specified columns or not.
		 * 
		 * @param {Boolean or undefined} onlySpecifiedCol true - only showing the specified columns, false(default) - otherwise.
		 * @return {Boolean or this}
		 */
		onlySpecifiedCol: function(onlySpecifiedCol) {
			if(onlySpecifiedCol === undefined) {
				return this._onlySpecifiedCol;
			}
			this._onlySpecifiedCol = onlySpecifiedCol ? true: false;
		},
		
		/**
		 * Specified field names for selecting group records, multiple field names are separated with ','
		 * @see jslet.data.Dataset.select(selected, selectBy).
		 * 
		 * <pre><code>
		 * tbl.selectBy('code,gender');
		 * </code></pre>
		 * 
		 * @param {String or undefined} selectBy group selecting field names.
		 * @return {String or this}
		 */
		selectBy: function(selectBy) {
			if(selectBy === undefined) {
				return this._selectBy;
			}
				jslet.Checker.test('DBTable.selectBy', selectBy).isString();
			this._selectBy = selectBy;
		},
		
		/**
		 * Display table as tree style. If this property is set, the dataset must be a tree style dataset, 
		 *  means dataset.parentField() and dataset.levelField() can not be empty.
		 * Only one field name allowed.
		 * 
		 * <pre><code>
		 * tbl.treeField('code');
		 * </code></pre>
		 * 
		 * @param {String or undefined} treeField the field name which will show as tree style.
		 * @return {String or this}
		 */
		treeField: function(treeField) {
			if(treeField === undefined) {
				return this._treeField;
			}
			jslet.Checker.test('DBTable.treeField', treeField).isString();
			this._treeField = treeField;
		},
	
		/**
		 * Default cell render, it must be a child class of @see jslet.ui.CellRender 
		 * <pre><code>
		 * 	var cellRender = jslet.Class.create(jslet.ui.CellRender, {
		 *		createHeader: function(cellPanel, colCfg) { },
		 *		createCell: function (cellPanel, colCfg) { },
		 *		refreshCell: function (cellPanel, colCfg, recNo) { }
		 * });
		 * </code></pre>  
		 */
		defaultCellRender: function(defaultCellRender) {
			if(defaultCellRender === undefined) {
				return this._defaultCellRender;
			}
			jslet.Checker.test('DBTable.defaultCellRender', defaultCellRender).isObject();
			
			this._defaultCellRender = defaultCellRender;
		},
		
		currColNum: function(currColNum) {
			var Z = this;
			if(currColNum === undefined) {
				return Z._currColNum;
			}
			var oldColNum = Z._currColNum;
	//		if(oldColNum === currColNum) {
	//			return;
	//		}
			Z._currColNum = currColNum;
			Z._adjustCurrentCellPos(oldColNum > currColNum);
			Z._showCurrentCell();
			if(Z._findDialog) {
				var colCfg = Z.innerColumns[currColNum];
				if(colCfg.field) {
					Z._findDialog.findingField(colCfg.field);
				}
			}
		},
		
		/**
		 * Fired when table row clicked.
		 *  Pattern: 
		 *	function(event}{}
		 *  	//event: Js mouse event
		 *  
		 * @param {Function or undefined} onRowClick table row clicked event handler.
		 * @return {this or Function}
		 */
		onRowClick: function(onRowClick) {
			if(onRowClick === undefined) {
				return this._onRowClick;
			}
			jslet.Checker.test('DBTable.onRowClick', onRowClick).isFunction();
			this._onRowClick = onRowClick;
		},
		
		/**
		 * Fired when table row double clicked.
		 *  Pattern: 
		 *	function(event}{}
		 *  	//event: Js mouse event
		 *  
		 * @param {Function or undefined} onRowDblClick table row double clicked event handler.
		 * @return {this or Function}
		 */
		onRowDblClick: function(onRowDblClick) {
			if(onRowDblClick === undefined) {
				return this._onRowDblClick;
			}
			jslet.Checker.test('DBTable.onRowDblClick', onRowDblClick).isFunction();
			this._onRowDblClick = onRowDblClick;
		},
		
		/**
		 * Fired when table cell clicked.
		 *  Pattern: 
		 *	function(event}{}
		 *  	//event: Js mouse event
		 *  
		 * @param {Function or undefined} onCellClick table cell clicked event handler.
		 * @return {this or Function}
		 */
		onCellClick: function(onCellClick) {
			if(onCellClick === undefined) {
				return this._onCellClick;
			}
			jslet.Checker.test('DBTable.onCellClick', onCellClick).isFunction();
			this._onCellClick = onCellClick;
		},
		
		/**
		 * Fired when table row is selected(select column is checked).
		 *  Pattern: 
		 *   function(selected}{}
		 *   //selected: Boolean
		 *   //return: true - allow user to select this row, false - otherwise.
		 *  
		 * @param {Function or undefined} onSelect table row selected event handler.
		 * @return {this or Function}
		 */
		onSelect: function(onSelect) {
			if(onSelect === undefined) {
				return this._onSelect;
			}
			jslet.Checker.test('DBTable.onSelect', onSelect).isFunction();
			this._onSelect = onSelect;
		},
		
		/**
		 * Fired when all table rows are selected.
		 *  Pattern: 
		 *   function(dataset, Selected}{}
		 *   //dataset: jslet.data.Dataset
		 *   //Selected: Boolean
		 *   //return: true - allow user to select, false - otherwise.
		 *  
		 * @param {Function or undefined} onSelectAll All table row selected event handler.
		 * @return {this or Function}
		 */
		onSelectAll: function(onSelectAll) {
			if(onSelectAll === undefined) {
				return this._onSelectAll;
			}
			jslet.Checker.test('DBTable.onSelectAll', onSelectAll).isFunction();
			this._onSelectAll = onSelectAll;
		},
		
		/**
		 * Fired when user click table header to sort data. You can use it to sort data instead of default, like sending request to server to sort data.  
		 * Pattern: 
		 *   function(indexFlds}{}
		 *   //indexFlds: String, format: fieldName desc/asce(default), fieldName,..., desc - descending order, asce - ascending order, like: "field1 desc,field2,field3"
		 *   
		 * @param {Function or undefined} onCustomSort Customized sorting event handler.
		 * @return {this or Function}
		 */
		onCustomSort: function(onCustomSort) {
			if(onCustomSort === undefined) {
				return this._onCustomSort;
			}
			jslet.Checker.test('DBTable.onCustomSort', onCustomSort).isFunction();
			this._onCustomSort = onCustomSort;
		},
		
		/**
		 * Fired when fill row, user can use this to customize each row style like background color, font color
		 * Pattern:
		 *   function(otr, dataset){)
		 *   //otr: Html element: TR
		 *   //dataset: jslet.data.Dataset
		 *   
		 * @param {Function or undefined} onFillRow Table row filled event handler.
		 * @return {this or Function}
		 */
		onFillRow: function(onFillRow) {
			if(onFillRow === undefined) {
				return this._onFillRow;
			}
			jslet.Checker.test('DBTable.onFillRow', onFillRow).isFunction();
			this._onFillRow = onFillRow;
		},
		
		/**
		 * Fired when fill cell, user can use this to customize each cell style like background color, font color
		 * Pattern:
		 *   function(otd, dataset, fieldName){)
		 *   //otd: Html element: TD
		 *   //dataset: jslet.data.Dataset
		 *   //fieldName: String
		 *   
		 * @param {Function or undefined} onFillCell Table cell filled event handler.
		 * @return {this or Function}
		 */
		onFillCell: function(onFillCell) {
			if(onFillCell === undefined) {
				return this._onFillCell;
			}
			jslet.Checker.test('DBTable.onFillCell', onFillCell).isFunction();
			this._onFillCell = onFillCell;
		},
		
		/**
		 * Identify has finding dialog or not.
		 * 
		 * @param {Boolean or undefined} hasFindDialog true(default) - show finding dialog when press 'Ctrl + F', false - otherwise.
		 * @return {Boolean or this}
		 */
		hasFindDialog: function(hasFindDialog) {
			var Z = this;
			if(hasFindDialog === undefined) {
				return Z._hasFindDialog;
			}
			Z._hasFindDialog = hasFindDialog? true: false;
		},
	
		/**
		 * Identify has filter dialog or not.
		 * 
		 * @param {Boolean or undefined} hasFilterDialog true(default) - show filter dialog when creating table, false - otherwise.
		 * @return {Boolean or this}
		 */
		hasFilterDialog: function(hasFilterDialog) {
			var Z = this;
			if(hasFilterDialog === undefined) {
				return Z._hasFilterDialog;
			}
			Z._hasFilterDialog = hasFilterDialog? true: false;
		},
	
		
		/**
		 * Table columns configurations, array of jslet.ui.TableColumn.
		 * 
		 * @param {jslet.ui.TableColumn[] or undefined} columns Table columns configurations.
		 * @return {jslet.ui.TableColumn[] or undefined}
		 */
		columns: function(columns) {
			if(columns === undefined) {
				return this._columns;
			}
			jslet.Checker.test('DBTable.columns', columns).isArray();
			var colObj;
			for(var i = 0, len = columns.length; i < len; i++) {
				colObj = columns[i];
				jslet.Checker.test('DBTable.Column.field', colObj.field).isString();
				jslet.Checker.test('DBTable.Column.label', colObj.label).isString();
				jslet.Checker.test('DBTable.Column.colNum', colObj.colNum).isGTEZero();
				jslet.Checker.test('DBTable.Column.displayOrder', colObj.displayOrder).isNumber();
				jslet.Checker.test('DBTable.Column.width', colObj.width).isGTZero();
				jslet.Checker.test('DBTable.Column.colSpan', colObj.colSpan).isGTZero();
				colObj.disableHeadSort = colObj.disableHeadSort ? true: false;
				if(!colObj.field) {
					colObj.disableHeadSort = true;
				}
				colObj.mergeSame = colObj.mergeSame ? true: false;
				colObj.noRefresh = colObj.noRefresh ? true: false;
				jslet.Checker.test('DBTable.Column.cellRender', colObj.cellRender).isObject();
			}
			this._columns = columns;
		},
		
		/**
		 * Goto and show the specified cell by field name.
		 * 
		 * @param {String} fldName field name.
		 */
		gotoField: function(fldName) {
			jslet.Checker.test('DBTable.gotoField#fldName', fldName).required().isString();
			var lastColNum = this.innerColumns.length - 1,
				colCfg, colField;
			for(var i = 0; i <= lastColNum; i++) {
				colCfg = this.innerColumns[i];
				colField = colCfg.field;
				if(colField == fldName) {
					this.gotoColumn(colCfg.colNum);
				}
			}
		},
		
		/**
		 * Goto and show the specified cell by field name.
		 * 
		 * @param {String} fldName field name.
		 */
		gotoColumn: function(colNum) {
			jslet.Checker.test('DBTable.gotoColumn#colNum', colNum).required().isGTEZero();
			var lastColNum = this.innerColumns.length - 1;
			if(colNum > lastColNum) {
				colNum = lastColNum
			}
			this.currColNum(lastColNum);
			if(colNum < lastColNum) {
				this.currColNum(colNum);
			}
		},
		
		/**
		* @override
		*/
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
		
		/**
		 * @override
		 */
		bind: function () {
			var Z = this;
			jslet.resizeEventBus.subscribe(Z);
			
			jslet.ui.textMeasurer.setElement(Z.el);
			Z.charHeight = jslet.ui.textMeasurer.getHeight('M')+4;
			jslet.ui.textMeasurer.setElement();
			Z.charWidth = jslet.global.defaultCharWidth || 12;
			Z._widthStyleId = jslet.nextId();
			Z._initializeVm();
			if(Z.el.tabIndex) {
				Z._editorTabIndex = Z.el.tabIndex + 1;
			}
			Z.renderAll();
			var jqEl = jQuery(Z.el);
			var ti = jqEl.attr('tabindex');
			if (Z._readOnly && !ti) {
				jqEl.attr('tabindex', 0);
			}
	
	        var notFF = ((typeof Z.el.onmousewheel) == 'object'); //firefox or nonFirefox browser
	        var wheelEvent = (notFF ? 'mousewheel' : 'DOMMouseScroll');
	        jqEl.on(wheelEvent, function (event) {
	            var originalEvent = event.originalEvent;
	            var num = notFF ? originalEvent.wheelDelta / -120 : originalEvent.detail / 3;
				if(!Z._readOnly && Z._dataset.status() != jslet.data.DataSetStatus.BROWSE) {
					Z._dataset.confirm();
				}
	            Z.listvm.setVisibleStartRow(Z.listvm.getVisibleStartRow() + num);
	       		event.preventDefault();
	        });
	
	        jqEl.on('mousedown', function(event){
	        	if(event.shiftKey) {
		       		event.preventDefault();
		       		event.stopImmediatePropagation();
		       		return false;
	        	}
	        });
	        
	        jqEl.on('click', 'button.jl-tbl-filter', function(event) {
	    		if (!Z._filterPanel) {
	    			Z._filterPanel = new jslet.ui.DBTableFilterPanel(Z);
	    		}
	    		var btnEle = event.currentTarget,
	    			jqFilterBtn = jQuery(btnEle);
	    		jslet.ui.PopupPanel.excludedElement = btnEle;
	    		var r = jqFilterBtn.offset(), h = jqFilterBtn.outerHeight(), x = r.left, y = r.top + h;
	    		if (jslet.locale.isRtl){
	    			x = x + jqFilterBtn.outerWidth();
	    		}
	    		Z._filterPanel.showPopup(x, y, 0, h);
	
	        	
	        	
	        	
	       		event.preventDefault();
	       		event.stopImmediatePropagation();
	        });
	        
	        jqEl.on('click', 'td.jl-tbl-cell', function(event){
	        	if(!Z.readOnly) {
	        		return;
	        	}
	        	var otd = event.currentTarget;
	        	var colCfg = otd.jsletColCfg;
	        	if(colCfg) {
	        		if(colCfg.isSeqCol) { //If the cell is sequence cell, process row selection.
	        			Z._processRowSelection(event.ctrlKey, event.shiftKey, event.altKey);
	        		} else {
		        		var colNum = colCfg.colNum;
		        		if(colNum !== 0 && !colNum) {
		        			return;
		        		}
						Z._doBeforeSelect(event.ctrlKey, event.shiftKey, event.altKey);
		        		Z.currColNum(colNum);
						Z._processSelection(event.ctrlKey, event.shiftKey, event.altKey);
	        		}
	            	Z._doCellClick(colCfg);
	        	}
	        	if(event.shiftKey || event.ctrlKey) {
		       		event.preventDefault();
		       		event.stopImmediatePropagation();
		       		return false;
	        	}
	        });
	
			jqEl.on('keydown', function (event) {
				var keyCode = event.which;
				
				if(event.ctrlKey && keyCode == 70) { //ctrl + f
					if(!Z._hasFindDialog) {
						return;
					}
					if(!Z._findDialog) {
						Z._findDialog = new jslet.ui.FindDialog(Z);
					}
					if(!Z._findDialog.findingField()) {
						var colCfg = Z.innerColumns[Z._currColNum];
						if(colCfg.field) {
							Z._findDialog.findingField(colCfg.field);
						}
					}
					Z._findDialog.show(0, Z.headSectionHt);
					event.preventDefault();
		       		event.stopImmediatePropagation();
					return false;
				}
				if(event.ctrlKey && keyCode == 67) { //ctrl + c
					var selectedText = Z._dataset.selection.getSelectionText();
					if(selectedText) {
						jslet.Clipboard.putText(selectedText);
						window.setTimeout(function(){Z.el.focus();}, 5);
					}
					return;
				}
				if(event.ctrlKey && keyCode == 65) { //ctrl + a
					var fields = [], colCfg, fldName;
					for(var i = 0, len = Z.innerColumns.length; i < len; i++) {
						colCfg = Z.innerColumns[i];
						fldName = colCfg.field;
						if(fldName) {
							fields.push(fldName);
						}
					}
					Z._dataset.selection.selectAll(fields, true);
					Z._refreshSelection();
					event.preventDefault();
		       		event.stopImmediatePropagation();
					return false;
				}
				if(keyCode === 37) { //Arrow Left
					if(!Z._readOnly) {
						return;
					}
					var num;
					if(Z._currColNum === 0) {
						return;
					} else {
						num = Z._currColNum - 1;
					}
					Z._doBeforeSelect(event.ctrlKey, event.shiftKey, event.altKey);
					Z.currColNum(num);
					Z._processSelection(event.ctrlKey, event.shiftKey, event.altKey);
					event.preventDefault();
		       		event.stopImmediatePropagation();
				} else if( keyCode === 39) { //Arrow Right
					if(!Z._readOnly) {
						return;
					}
					var lastColNum = Z.innerColumns.length - 1, 
						num = 0;
					if(Z._currColNum < lastColNum) {
						num = Z._currColNum + 1;
					} else {
						return;
					}
					Z._doBeforeSelect(event.ctrlKey, event.shiftKey, event.altKey);
					Z.currColNum(num);
					Z._processSelection(event.ctrlKey, event.shiftKey, event.altKey);
					event.preventDefault();
		       		event.stopImmediatePropagation();
				} else if (keyCode == 38) {//KEY_UP
					Z._doBeforeSelect(event.ctrlKey, event.shiftKey, event.altKey);
					Z.listvm.priorRow();
					Z._processSelection(event.ctrlKey, event.shiftKey, event.altKey);
					event.preventDefault();
		       		event.stopImmediatePropagation();
				} else if (keyCode == 40) {//KEY_DOWN
					Z._doBeforeSelect(event.ctrlKey, event.shiftKey, event.altKey);
					Z.listvm.nextRow();
					Z._processSelection(event.ctrlKey, event.shiftKey, event.altKey);
					event.preventDefault();
		       		event.stopImmediatePropagation();
				} else if (keyCode == 33) {//KEY_PAGEUP
					Z.listvm.priorPage();
					event.preventDefault();
		       		event.stopImmediatePropagation();
				} else if (keyCode == 34) {//KEY_PAGEDOWN
					Z.listvm.nextPage();
					event.preventDefault();
		       		event.stopImmediatePropagation();
				}
			});		
		}, // end bind
		
		_initializeVm: function () {
			var Z = this;
							
			Z.listvm = new jslet.ui.ListViewModel(Z._dataset, Z._treeField ? true : false);
			
			Z.listvm.onTopRownoChanged = function (rowno) {
				if (rowno < 0) {
					return;
				}
				Z._fillData();
				
				Z._syncScrollBar(rowno);
				Z._showCurrentRow();
			};
		
			Z.listvm.onVisibleCountChanged = function () {
				Z.renderAll();
			};
			
			Z.listvm.onCurrentRownoChanged = function (preRowno, rowno) {
				if (Z._dataset.recordCount() === 0) {
					return;
				}
				Z._dataset.recno(Z.listvm.getCurrentRecno())
				if (Z._currRow) {
					if (Z._currRow.fixed) {
						jQuery(Z._currRow.fixed).removeClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
					}
					jQuery(Z._currRow.content).removeClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
				}
				var currRow = Z._getTrByRowno(rowno), otr;
				if (!currRow) {
					return;
				}
				otr = currRow.fixed;
				if (otr) {
					jQuery(otr).addClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
				}
				
				otr = currRow.content;
				jQuery(otr).addClass(jslet.ui.htmlclass.TABLECLASS.currentrow);
				Z._currRow = currRow;
				if(!Z._readOnly) {
					var fldName = Z._editingField;
					if(fldName) {
						var fldObj = Z._dataset.getField(fldName);
						if(fldObj && !fldObj.disabled() && !fldObj.readOnly()) {
							Z._dataset.focusEditControl(fldName);
						}
					}
				}
			};
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var Z = this;
			Z.el.innerHTML = '';
			Z.listvm.fixedRows = Z._fixedRows;
			Z._calcParams();
			Z.listvm.refreshModel();
			Z._createFrame();
			Z._fillData();
			Z._showCurrentRow();
			Z._oldHeight = jQuery(Z.el).height();
			Z._updateSortFlag(true);
		}, // end renderAll
	
		_doBeforeSelect: function(hasCtrlKey, hasShiftKey, hasAltKey) {
		},
		
		_getSelectionFields: function(startColNum, endColNum) {
			if(startColNum > endColNum) {
				var tmp = startColNum;
				startColNum = endColNum;
				endColNum = tmp;
			}
			var fields = [], fldName, colCfg, colNum;
			for(var i = 0, len = this.innerColumns.length; i < len; i++) {
				colCfg = this.innerColumns[i];
				colNum = colCfg.colNum;
				if(colNum >= startColNum && colNum <= endColNum) {
					fldName = colCfg.field;
					if(fldName) {
						fields.push(fldName);
					}
				}
			}
			return fields;
		},
		
		_processSelection: function(hasCtrlKey, hasShiftKey, hasAltKey) {
			var Z = this,
				currRecno = Z._dataset.recno(),
				fldName;
			if(hasCtrlKey || !Z._autoClearSelection) { //If autoClearSelection = false, click a cell will select it.
				fldName = Z.innerColumns[Z._currColNum].field;
				if(fldName) {
					if(Z._dataset.selection.isSelected(currRecno, fldName)) {
						Z._dataset.selection.remove(currRecno, currRecno, [fldName], true);
					} else {
						Z._dataset.selection.add(currRecno, currRecno, [fldName], true);
					}
					Z._refreshSelection();
				}
				Z._preRecno = currRecno;
				Z._preColNum = Z._currColNum;
				return;
			}
			if(hasShiftKey) {
				var fields;
				if(Z._preTmpRecno >= 0 && Z._preTmpColNum >= 0) {
					fields = Z._getSelectionFields(Z._preColNum || 0, Z._preTmpColNum);
					Z._dataset.selection.remove(Z._preRecno || 0, Z._preTmpRecno, fields, false);
				}
				fields = Z._getSelectionFields(Z._preColNum || 0, Z._currColNum);
				Z._dataset.selection.add(Z._preRecno || 0, currRecno, fields, true);
				Z._refreshSelection();
				Z._preTmpRecno = currRecno;
				Z._preTmpColNum = Z._currColNum;
			} else {
				Z._preRecno = currRecno;
				Z._preColNum = Z._currColNum;
				Z._preTmpRecno = currRecno;
				Z._preTmpColNum = Z._currColNum;
				if(Z._autoClearSelection) {
					Z._dataset.selection.removeAll();
					Z._refreshSelection();
				}
			}
		},
		
		_processColumnSelection: function(colCfg, hasCtrlKey, hasShiftKey, hasAltKey) {
			if(!hasCtrlKey && !hasShiftKey) {
				return;
			}
			var Z = this,
				recCnt = Z._dataset.recordCount();
			if(recCnt === 0) {
				return;
			}
			var fields, colNum;
			if(hasShiftKey) {
				if(Z._preTmpColNum >= 0) {
					fields = Z._getSelectionFields(Z._preColNum || 0, Z._preTmpColNum);
					Z._dataset.selection.remove(0, recCnt, fields, true);
				}
				colNum = colCfg.colNum + colCfg.colSpan - 1;
				fields = Z._getSelectionFields(Z._preColNum || 0, colNum);
				Z._dataset.selection.add(0, recCnt, fields, true);
				Z._preTmpColNum = colNum;
			} else {
				if(!hasCtrlKey && Z._autoClearSelection) {
					Z._dataset.selection.removeAll();
				}
				if(colCfg.colSpan > 1) {
					fields = [];
					var startColNum = colCfg.colNum,
						endColNum = colCfg.colNum + colCfg.colSpan, fldName;
					
					for(var colNum = startColNum; colNum < endColNum; colNum++) {
						fldName = Z.innerColumns[colNum].field;
						fields.push(fldName);
					}
				} else {
					fields = [colCfg.field];
				}
				Z._dataset.selection.add(0, recCnt, fields, true);
				Z._preColNum = colCfg.colNum;
			}
			Z._refreshSelection();
		},
		
		_processRowSelection: function(hasCtrlKey, hasShiftKey, hasAltKey) {
			if(!hasCtrlKey && !hasShiftKey) {
				return;
			}
			var Z = this,
				fields = Z._getSelectionFields(0, Z.innerColumns.length - 1);
			var currRecno = Z._dataset.recno();
			if(hasShiftKey) {
				var fields;
				if(Z._preTmpRecno >= 0) {
					Z._dataset.selection.remove(Z._preRecno || 0, Z._preTmpRecno, fields, true);
				}
				Z._dataset.selection.add(Z._preRecno || 0, currRecno, fields, true);
				Z._preTmpColNum = currRecno;
			} else {
				if(!hasCtrlKey && Z._autoClearSelection) {
					Z._dataset.selection.removeAll();
				}
				Z._dataset.selection.add(currRecno, currRecno, fields, true);
				Z._preRecno = currRecno;
			}
			Z._refreshSelection();
		},
		
		_prepareColumn: function(){
			var Z = this, cobj;
			Z._sysColumns = [];
			//prepare system columns
			if (Z._hasSeqCol){
				cobj = {label:'&nbsp;',width: Z.seqColWidth, disableHeadSort:true,isSeqCol:true, 
						cellRender:jslet.ui.DBTable.sequenceCellRender, widthCssName: Z._widthStyleId + '-s0'};
				Z._sysColumns.push(cobj);
			}
			if (Z._hasSelectCol){
				cobj = {label:'<input type="checkbox" />', width: Z.selectColWidth, disableHeadSort:true,isSelectCol:true, 
						cellRender:jslet.ui.DBTable.selectCellRender, widthCssName: Z._widthStyleId + '-s1'};
				Z._sysColumns.push(cobj);
			}
			
			if (Z.subgroup && Z.subgroup.hasExpander){
				cobj = {label:'&nbsp;', width: Z.selectColWidth, disableHeadSort:true, isSubgroup: true, 
						cellRender:jslet.ui.DBTable.subgroupCellRender, widthCssName: Z._widthStyleId + '-s2'};
				Z._sysColumns.push(cobj);
			}
			//prepare data columns
			var tmpColumns = [];
			if (Z._columns) {
				for(var i = 0, colCnt = Z._columns.length; i < colCnt; i++){
					cobj = Z._columns[i];
					if (!cobj.field){
						cobj.disableHeadSort = true;
					} else {
						var fldObj = Z._dataset.getField(cobj.field);
						if(!fldObj) {
							throw new Error('Not found Field: ' + cobj.field);
						}
						cobj.displayOrder = fldObj.displayOrder();
					}
					tmpColumns.push(cobj);
				}
			}
			if (!Z._onlySpecifiedCol) {
				
				function getColumnObj(fldName) {
					if (Z._columns){
						for(var i = 0, colCnt = Z._columns.length; i < colCnt; i++){
							cobj = Z._columns[i];
							if (cobj.field && cobj.field == fldName){
								return cobj;
							}
						}
					}
					return null;
				}
				
				var fldObj, fldName,fields = Z._dataset.getFields();
				for (var i = 0, fldcnt = fields.length; i < fldcnt; i++) {
					fldObj = fields[i];
					fldName = fldObj.name();
					if (fldObj.visible()) {
						cobj = getColumnObj(fldName);
						if(!cobj) {
							cobj = new jslet.ui.TableColumn();
							cobj.field = fldObj.name();
							cobj.displayOrder = fldObj.displayOrder();
							tmpColumns.push(cobj);
						}
					} // end if visible
				} // end for
				if (Z._columns){
					for(var i = 0, colCnt = Z._columns.length; i < colCnt; i++){
						cobj = Z._columns[i];
						if (!cobj.field){
							continue;
						}
						fldObj = Z._dataset.getTopField(cobj.field);
						if (!fldObj) {
							throw new Error("Field: " + cobj.field + " doesn't exist!");
						}
						var children = fldObj.children();
						if (children && children.length > 0){
							fldName = fldObj.name();
							var isUnique = true;
							// cobj.field is not a child of a groupfield, we need check if the topmost parent field is duplicate or not 
							if (cobj.field != fldName){
								for(var k = 0; k < tmpColumns.length; k++){
									if (tmpColumns[k].field == fldName){
										isUnique = false;
										break;
									}
								} // end for k
							}
							if (isUnique){
								cobj = new jslet.ui.TableColumn();
								cobj.field = fldName;
								cobj.displayOrder = fldObj.displayOrder();
								tmpColumns.push(cobj);
							}
						}
					} //end for i
				} //end if Z.columns
			}
			
			tmpColumns.sort(function(cobj1, cobj2) {
				var ord1 = cobj1.displayOrder || 0;
				var ord2 = cobj2.displayOrder || 0;
				return ord1 === ord2? 0: (ord1 < ord2? -1: 1);
			});
			
			Z.innerHeads = [];
			Z.innerColumns = [];
			var ohead, fldName, label, context = {lastColNum: 0, depth: 0};
			
			for(var i = 0, colCnt = tmpColumns.length; i < colCnt; i++){
				cobj = tmpColumns[i];
				fldName = cobj.field;
				if (!fldName){
					ohead = new jslet.ui.TableHead();
					label = cobj.label;
					ohead.label = label? label: "";
					ohead.level = 0;
					ohead.colNum = context.lastColNum++;
					cobj.colNum = ohead.colNum;
					ohead.id = jslet.nextId();
					ohead.widthCssName = Z._widthStyleId + '-' + ohead.colNum;
					cobj.widthCssName = ohead.widthCssName;
					ohead.disableHeadSort = cobj.disableHeadSort;
	
					Z.innerHeads.push(ohead);
					Z.innerColumns.push(cobj);
					
					continue;
				}
				fldObj = Z._dataset.getField(fldName);
				Z._convertField2Head(context, fldObj);
			}
	
			Z.maxHeadRows = context.depth + 1;
			Z._calcHeadSpan();
		
			//check fixedCols property
			var colCnt = 0, preColCnt = 0, 
			fixedColNum = Z._fixedCols - Z._sysColumns.length;
			for(var i = 1, len = Z.innerHeads.length; i < len; i++){
				ohead = Z.innerHeads[i];
				colCnt += ohead.colSpan;
				if (fixedColNum <= preColCnt || fixedColNum == colCnt) {
					break;
				}
				if (fixedColNum < colCnt && fixedColNum > preColCnt) {
					Z._fixedCols = preColCnt + Z._sysColumns.length;
				}
				
				preColCnt = colCnt;
			}
		},
		
		_calcHeadSpan: function(heads){
			var Z = this;
			if (!heads) {
				heads = Z.innerHeads;
			}
			var ohead, childCnt = 0;
			for(var i = 0, len = heads.length; i < len; i++ ){
				ohead = heads[i];
				ohead.rowSpan = Z.maxHeadRows - ohead.level;
				if (ohead.subHeads){
					ohead.colSpan = Z._calcHeadSpan(ohead.subHeads);
					childCnt += ohead.colSpan;
				} else {
					ohead.colSpan = 1;
					childCnt++;
				}
			}
			return childCnt;
		},
		
		_convertField2Head: function(context, fldObj, parentHeadObj){
			var Z = this;
			if (!fldObj.visible()) {
				return false;
			}
			var level = 0;
			if (!parentHeadObj){
				heads = Z.innerHeads;
			} else {
				level = parentHeadObj.level + 1;
				heads = parentHeadObj.subHeads;
			}
			var ohead, fldName = fldObj.name();
			ohead = new jslet.ui.TableHead();
			ohead.label = fldObj.label();
			ohead.field = fldName;
			ohead.level = level;
			ohead.colNum = context.lastColNum;
			ohead.id = jslet.nextId();
			heads.push(ohead);
			context.depth = Math.max(level, context.depth);
			var fldChildren = fldObj.children();
			if (fldChildren && fldChildren.length > 0){
				ohead.subHeads = [];
				var added = false;
				for(var i = 0, cnt = fldChildren.length; i< cnt; i++){
					Z._convertField2Head(context, fldChildren[i], ohead);
				}
			} else {
				context.lastColNum ++;
				var cobj, found = false;
				var len = Z._columns ? Z._columns.length: 0;
				for(var i = 0; i < len; i++){
					cobj = Z._columns[i];
					if (cobj.field == fldName){
						found = true;
						break;
					}
				}
				if (!found){
					cobj = new jslet.ui.TableColumn();
					cobj.field = fldName;
				}
				if (!cobj.label){
					cobj.label = fldObj.label();
				}
				cobj.mergeSame = fldObj.mergeSame();
				cobj.colNum = ohead.colNum;
				if (!cobj.width){
					maxWidth = fldObj ? fldObj.displayWidth() : 0;
					if (!Z._hideHead && cobj.label) {
						maxWidth = Math.max(maxWidth, cobj.label.length);
					}
					cobj.width = maxWidth ? (maxWidth * Z.charWidth) : 10;
				}
				//check and set cell render
				if (!cobj.cellRender) {
					if (fldObj.getType() == jslet.data.DataType.BOOLEAN){//data type is boolean
						if (!Z._isCellEditable(cobj)) {// Not in edit mode
							cobj.cellRender = jslet.ui.DBTable.boolCellRender;
						}
					} else {
						if (cobj.field == Z._treeField) {
							cobj.cellRender = jslet.ui.DBTable.treeCellRender;
						}
					}
				}
				ohead.widthCssName = Z._widthStyleId + '-' + ohead.colNum;
				cobj.widthCssName = ohead.widthCssName;
				
				Z.innerColumns.push(cobj);
			}
			return true;
		},
		
		_calcParams: function () {
			var Z = this;
			Z._currColNum = 0;
			Z._preTmpColNum = -1;
			Z._preTmpRecno = -1;
			Z._preRecno = -1;
			Z._preColNum = -1;
	
			if (Z._treeField) {//if tree table, then can't sort by clicking column header
				Z._disableHeadSort = true;
			}
			// calculate Sequence column width
			if (Z._hasSeqCol) {
				Z.seqColWidth = ('' + Z._dataset.recordCount()).length * Z.charWidth + 5;
				var sWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
				Z.seqColWidth = Z.seqColWidth > sWidth ? Z.seqColWidth: sWidth;
			} else {
				Z.seqColWidth = 0;
			}
			// calculate Select column width
			if (Z._hasSelectCol) {
				Z.selectColWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
			} else {
				Z.selectColWidth = 0;
			}
			//calculate Fixed row section's height
			if (Z._fixedRows > 0) {
				Z.fixedSectionHt = Z._fixedRows * Z._rowHeight;
			} else {
				Z.fixedSectionHt = 0;
			}
			//Calculate Foot section's height
			if (Z.aggraded() && Z.dataset().checkAggraded()){
				Z.footSectionHt = Z._rowHeight;
			} else {
				Z.footSectionHt = 0;
			}
			Z._prepareColumn();
	
			// fixed Column count must be less than total columns
			if (Z._fixedCols) {
				if (Z._fixedCols > Z.innerColumns.length) {
					Z._fixedCols = Z.innerColumns.length;
				}
			}
			Z.hasFixedCol = Z._sysColumns.length > 0 || Z._fixedCols > 0;
			if (Z.hasFixedCol){
				var w = 0;
				for(var i = 0, cnt = Z._sysColumns.length; i < cnt; i++){
					w += Z._sysColumns[i].width;
				}
				for(var i = 0; i < Z._fixedCols; i++){
					w += Z.innerColumns[i].width;
				}
				Z.fixedColWidth = w + 4;
			} else {
				Z.fixedColWidth = 0;
			}
		}, // end _calcParams
	
		_setScrollBarMaxValue: function (maxValue) {
			var Z = this,
				v = maxValue + Z._repairHeight;
			Z.jqVScrollBar.find('div').height(v);
			if(Z.contentSectionHt + Z.footSectionHt >= v) {
				Z.jqVScrollBar.parent().addClass('jl-scrollbar-hidden');	
			} else {
				Z.jqVScrollBar.parent().removeClass('jl-scrollbar-hidden');	
			}
		},
	
		_changeColWidthCssRule: function(cssName, width){
			var Z = this,
				styleEle = document.getElementById(Z._widthStyleId),
				styleObj = styleEle.styleSheet || styleEle.sheet,
				cssRules = styleObj.cssRules || styleObj.rules,
				cssRule = null, found = false;
				cssName = '.' + cssName;
			for(var i = 0, len = cssRules.length; i < len; i++) {
				cssRule = cssRules[i];
				if(cssRule.selectorText == cssName) {
					found = true;
					break;
				}
			}
			if(found) {
				cssRule.style['width'] = width + 'px';
			}
			return found;
		},
	
		_changeColWidth: function (index, deltaW) {
			var Z = this,
				colObj = Z.innerColumns[index];
			if (colObj.width + deltaW <= 0) {
				return;
			}
			colObj.width += deltaW;
			if(colObj.field) {
				Z._dataset.designMode(true);
				try {
					Z._dataset.getField(colObj.field).displayWidth(Math.round(colObj.width/Z.charWidth));
				} finally {
					Z._dataset.designMode(false);
				}
			}
			if(Z._changeColWidthCssRule(colObj.widthCssName, colObj.width)) {
				Z._changeContentWidth(deltaW);
			}
		},
	
		_refreshSeqColWidth: function() {
			var Z = this;
			if (!Z._hasSeqCol) {
				return;
			}
			var oldSeqColWidth = Z.seqColWidth;
			Z.seqColWidth = ('' + Z._dataset.recordCount()).length * Z.charWidth;
			var sWidth = jslet.ui.htmlclass.TABLECLASS.selectColWidth;
			Z.seqColWidth = Z.seqColWidth > sWidth ? Z.seqColWidth: sWidth;
			if(Z.seqColWidth == oldSeqColWidth) {
				return;
			}
			var colObj;
			for(var i = 0, len = Z._sysColumns.length; i < len; i++) {
				colObj = Z._sysColumns[i];
				if(colObj.isSeqCol) {
					break;
				}
			}
			colObj.width = Z.seqColWidth;
			Z._changeColWidthCssRule(colObj.widthCssName, Z.seqColWidth);
			var deltaW = Z.seqColWidth - oldSeqColWidth;
			Z._changeContentWidth(deltaW, true);
		},
	
		_changeContentWidth: function (deltaW, isLeft) {
			var Z = this,
				totalWidth = Z.getTotalWidth(isLeft),
				totalWidthStr = totalWidth + 'px';
			if(!isLeft) {
				Z.rightHeadTbl.parentNode.style.width = totalWidthStr;
				Z.rightFixedTbl.parentNode.style.width = totalWidthStr;
				Z.rightContentTbl.parentNode.style.width = totalWidthStr;
				if (Z.footSectionHt) {
					Z.rightFootTbl.style.width = totalWidthStr;
				}
			} else {
				Z.fixedColWidth = totalWidth;
				Z.leftHeadTbl.parentNode.parentNode.style.width = Z.fixedColWidth + 1 + 'px';
				Z.leftHeadTbl.parentNode.style.width = totalWidthStr;
				Z.leftFixedTbl.parentNode.style.width = totalWidthStr;
				Z.leftContentTbl.parentNode.style.width = totalWidthStr;
			}
			Z._checkHoriOverflow();
		},
	
		_createFrame: function () {
			var Z = this;
			Z.el.style.position = 'relative';
			var jqEl = jQuery(Z.el);
			if (!jqEl.hasClass('jl-table')) {
				jqEl.addClass('jl-table jl-border-box jl-round5');
			}
			if(Z._noborder){
				jqEl.addClass('jl-tbl-noborder');
			}
			
			function generateWidthStyle() {
				var colObj, cssName,
					styleHtml = ['<style type="text/css" id="' + Z._widthStyleId + '">\n'];
				for(var i = 0, len = Z._sysColumns.length; i < len; i++) {
					colObj = Z._sysColumns[i];
					styleHtml.push('.' + colObj.widthCssName +'{width:' + colObj.width + 'px}\n');
				}
				for(var i = 0, len = Z.innerColumns.length; i< len; i++) {
					colObj = Z.innerColumns[i];
					styleHtml.push('.' + colObj.widthCssName +'{width:' + colObj.width + 'px}\n');
				}
				styleHtml.push('</style>');
				return styleHtml.join('');
			}
			
			var dbtableframe = [
				'<div class="jl-tbl-splitter" style="display: none"></div>',
				generateWidthStyle(),
				'<div class="jl-tbl-norecord">',
				jslet.locale.DBTable.norecord,
				'</div>',
	//			'<div class="jl-tbl-curr-cell">&nbsp;</div>',
				'<table class="jl-tbl-container"><tr>',
				'<td><div class="jl-tbl-fixedcol"><table class="jl-tbl-data"><tbody /></table><table class="jl-tbl-data"><tbody /></table><div class="jl-tbl-content-div"><table class="jl-tbl-data"><tbody /></table></div><table><tbody /></table></div></td>',
				'<td><div class="jl-tbl-contentcol"><div><table class="jl-tbl-data jl-tbl-content-table" border="0" cellpadding="0" cellspacing="0"><tbody /></table></div><div><table class="jl-tbl-data jl-tbl-content-table"><tbody /></table></div><div class="jl-tbl-content-div"><table class="jl-tbl-data jl-tbl-content-table"><tbody /></table></div><table class="jl-tbl-content-table jl-tbl-footer"><tbody /></table></div></td>',
				'<td class="jl-scrollbar-col"><div class="jl-tbl-vscroll-head"></div><div class="jl-tbl-vscroll"><div /></div></td></tr></table>'];
			
			jqEl.html(dbtableframe.join(''));
	
			var children = jqEl.find('.jl-tbl-fixedcol')[0].childNodes;
			Z.leftHeadTbl = children[0];
			Z.leftFixedTbl = children[1];
			Z.leftContentTbl = children[2].firstChild;
			Z.leftFootTbl = children[3];
			
			children = jqEl.find('.jl-tbl-contentcol')[0].childNodes;
			Z.rightHeadTbl = children[0].firstChild;
			Z.rightFixedTbl = children[1].firstChild;
			Z.rightContentTbl = children[2].firstChild;
			Z.rightFootTbl = children[3];
	
			Z.height = jqEl.height();
			if (Z._hideHead){
				Z.leftHeadTbl.style.display = 'none';
				Z.rightHeadTbl.style.display = 'none';
				jqEl.find('.jl-tbl-vscroll-head').css('display', 'none');
			}
			if (Z._fixedRows <= 0){
				Z.leftFixedTbl.style.display = 'none';
				Z.rightFixedTbl.style.display = 'none';
			}
			if (!Z.footSectionHt){
				Z.leftFootTbl.style.display = 'none';
				Z.rightFootTbl.style.display = 'none';
			}
			Z.leftHeadTbl.parentNode.parentNode.style.width = Z.fixedColWidth + 'px';
			
			var jqRightHead = jQuery(Z.rightHeadTbl);
			jqRightHead.off();
			var x = jqRightHead.on('mousedown', Z._doSplitHookDown);
			var y = jqRightHead.on('mouseup', Z._doSplitHookUp);
			
			jQuery(Z.leftHeadTbl).on('mousedown', '.jl-tbl-header-cell', function(event){
				event = jQuery.event.fix(event || window.event);
				var el = event.target;
				if (el.className == 'jl-tbl-splitter-hook') {
					return;
				}
				var colCfg = this.jsletColCfg;
				if(colCfg.field) {
					Z._processColumnSelection(colCfg, event.ctrlKey, event.shiftKey, event.altKey);
				}
			});
			
			jqRightHead.on('mousedown', '.jl-tbl-header-cell', function(event){
				event = jQuery.event.fix(event || window.event);
				var el = event.target;
				if (el.className == 'jl-tbl-splitter-hook') {
					return;
				}
				var colCfg = this.jsletColCfg;
				if(colCfg.field) {
					Z._processColumnSelection(colCfg, event.ctrlKey, event.shiftKey, event.altKey);
				}
			});
	
			jQuery(Z.leftHeadTbl).on('mouseup', '.jl-focusable-item', function(event){
				event = jQuery.event.fix(event || window.event);
				var el = event.target;
				if (Z.isDraggingColumn) {
					return;
				}
				Z._doHeadClick(this.parentNode.parentNode.parentNode.jsletColCfg, event.ctrlKey);
				Z._head_label_cliecked = true;
				event.stopImmediatePropagation();
				event.preventDefault();
				return false;
			});
			
			jqRightHead.on('mouseup', '.jl-focusable-item', function(event){
				event = jQuery.event.fix(event || window.event);
				var el = event.target;
				if (Z.isDraggingColumn) {
					return;
				}
				Z._doHeadClick(this.parentNode.parentNode.parentNode.jsletColCfg, event.ctrlKey);
				Z._head_label_cliecked = true;
				event.stopImmediatePropagation();
				event.preventDefault();
				return false;
			});
			
			dragTransfer = null;
			jqRightHead.on('dragstart', '.jl-focusable-item', function(event){
				var otd = this.parentNode.parentNode.parentNode,
					colCfg = otd.jsletColCfg,
					e = event.originalEvent,
					transfer = e.dataTransfer;
				transfer.dropEffect = 'link';
				transfer.effectAllowed = 'link';
				dragTransfer = {fieldName: colCfg.field, rowIndex: otd.parentNode.rowIndex, cellIndex: otd.cellIndex};
				transfer.setData('fieldName', colCfg.field); //must has this row otherwise FF does not work.
				return true;
			});
	
			function checkDropable(currCell) {
				var colCfg = currCell.jsletColCfg,
					srcRowIndex = dragTransfer.rowIndex,
					srcCellIndex = dragTransfer.cellIndex,
					currRowIndex = currCell.parentNode.rowIndex,
					currCellIndex = currCell.cellIndex;
				var result = (srcRowIndex == currRowIndex && currCellIndex != srcCellIndex);
				if(!result) {
					return result;
				}
				var	srcFldName = dragTransfer.fieldName,
					currFldName = colCfg.field,
					srcPFldObj = Z._dataset.getField(srcFldName).parent(),
					currPFldObj = Z._dataset.getField(currFldName).parent();
				result = (srcPFldObj === currPFldObj || (currPFldObj && srcPFldObj.name() == currPFldObj.name()));
				return result;
			}
			
			jqRightHead.on('dragover', '.jl-tbl-header-cell .jl-tbl-header-div', function(event){
				if(!dragTransfer) {
					return false;
				}
				var otd = this.parentNode,
					e = event.originalEvent,
					transfer = e.dataTransfer;
				if(checkDropable(otd)) { 
					jQuery(event.currentTarget).addClass('jl-tbl-col-over');
					transfer.dropEffect = 'link';
				} else {
					transfer.dropEffect = 'move';
				}
			    return false;
			});
	
			jqRightHead.on('dragenter', '.jl-tbl-header-cell .jl-tbl-header-div', function(event){
				if(!dragTransfer) {
					return false;
				}
				var otd = this.parentNode,
					e = event.originalEvent,
					transfer = e.dataTransfer;
				if(checkDropable(otd)) { 
					jQuery(event.currentTarget).addClass('jl-tbl-col-over');
					transfer.dropEffect = 'link';
				} else {
					transfer.dropEffect = 'move';
				}
			    return false;
			});
			
			jqRightHead.on('dragleave', '.jl-tbl-header-cell .jl-tbl-header-div', function(event){
				if(!dragTransfer) {
					return false;
				}
				jQuery(event.currentTarget).removeClass('jl-tbl-col-over');
				return  false;
			});
			
			jqRightHead.on('drop', '.jl-tbl-header-cell .jl-tbl-header-div', function(event){
				if(!dragTransfer) {
					return false;
				}
				jQuery(event.currentTarget).removeClass('jl-tbl-col-over');
				var currCell = this.parentNode,
					e = event.originalEvent,
					transfer = e.dataTransfer,
					colCfg = currCell.jsletColCfg,
					srcRowIndex = dragTransfer.rowIndex,
					srcCellIndex = dragTransfer.cellIndex,
					currRowIndex = currCell.parentNode.rowIndex,
					currCellIndex = currCell.cellIndex;
				
				if(!checkDropable(currCell)) { 
					return
				}
				var destField = this.parentNode.jsletColCfg.field;
				if(!destField) {
					return;
				}
				var	srcField = dragTransfer.fieldName;
				Z._moveColumn(srcRowIndex, srcCellIndex, currCellIndex);
		    	return false;
			});
			
			var jqLeftFixedTbl = jQuery(Z.leftFixedTbl),
				jqRightFixedTbl = jQuery(Z.rightFixedTbl),
				jqLeftContentTbl = jQuery(Z.leftContentTbl),
				jqRightContentTbl = jQuery(Z.rightContentTbl);
			
			jqLeftFixedTbl.off();
			jqLeftFixedTbl.on('mouseenter', 'tr', function() {
				jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				jQuery(jqRightFixedTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			});
			jqLeftFixedTbl.on('mouseleave', 'tr', function() {
				jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				jQuery(jqRightFixedTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			});
	
			jqRightFixedTbl.off();
			jqRightFixedTbl.on('mouseenter', 'tr', function() {
				jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				jQuery(jqLeftFixedTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			});
			jqRightFixedTbl.on('mouseleave', 'tr', function() {
				jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				jQuery(jqLeftFixedTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			});
			
			jqLeftContentTbl.off();
			jqLeftContentTbl.on('mouseenter', 'tr', function() {
				jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				jQuery(jqRightContentTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			});
			jqLeftContentTbl.on('mouseleave', 'tr', function(){
				jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				jQuery(jqRightContentTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
			});
			
			jqRightContentTbl.off();
			jqRightContentTbl.on('mouseenter', 'tr', function(){
				jQuery(this).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				var hasLeft = (Z._fixedRows > 0 || Z._sysColumns.length > 0);
				if(hasLeft) {
					jQuery(jqLeftContentTbl[0].rows[this.rowIndex]).addClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				}
			});
			jqRightContentTbl.on('mouseleave', 'tr', function(){
				jQuery(this).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				var hasLeft = (Z._fixedRows > 0 || Z._sysColumns.length > 0);
				if(hasLeft) {
					jQuery(jqLeftContentTbl[0].rows[this.rowIndex]).removeClass(jslet.ui.htmlclass.TABLECLASS.hoverrow);
				}
			});
			
			Z.jqVScrollBar = jqEl.find('.jl-tbl-vscroll');
	
			Z.noRecordDiv = jqEl.find('.jl-tbl-norecord')[0];
			//The scrollbar width must be set explicitly, otherwise it doesn't work in IE. 
			Z.jqVScrollBar.width(jslet.scrollbarSize()+1);
			
			Z.jqVScrollBar.on('scroll', function () {
				if (Z._keep_silence_) {
					return;
				}
				if(!Z._readOnly && Z._dataset.status() != jslet.data.DataSetStatus.BROWSE) {
					Z._dataset.confirm();
				}
				var num = Math.round(this.scrollTop / Z._rowHeight);// + Z._fixedRows;
				if (num != Z.listvm.getVisibleStartRow()) {
					Z._keep_silence_ = true;
					try {
						Z.listvm.setVisibleStartRow(num);
						Z._showCurrentRow();
					} finally {
						Z._keep_silence_ = false;
					}
				}
			});
	
			jqEl.find('.jl-tbl-contentcol').on('scroll', function () {
				if(Z._isCurrCellInView()) {
					Z._showCurrentCell();			
				}
			});
			
			var splitter = jqEl.find('.jl-tbl-splitter')[0];
			splitter._doDragStart = function(){
				this.style.display = 'block';
			};
			
			splitter._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
				var bodyMleft = parseInt(jQuery(document.body).css('margin-left'));
	
				var ojslet = splitter.parentNode.jslet;
				var colObj = ojslet.innerColumns[ojslet.currColId];
				if (colObj.width + deltaX <= 40) {
					return;
				}
				splitter.style.left = x - jQuery(splitter.parentNode).offset().left - bodyMleft + 'px';
			};
	
			splitter._doDragEnd = function (oldX, oldY, x, y, deltaX,
				deltaY) {
				var Z = splitter.parentNode.jslet;
				Z._changeColWidth(Z.currColId, deltaX);
				splitter.style.display = 'none';
				splitter.parentNode.jslet.isDraggingColumn = false;
			};
	
			splitter._doDragCancel = function () {
				splitter.style.display = 'none';
				splitter.parentNode.jslet.isDraggingColumn = false;
			};
	
			if (Z.footSectionHt){
				Z.leftFootTbl.style.display = '';
				Z.rightFootTbl.style.display = '';
			}
			Z._renderHeader();
			
			if (Z._hideHead) {
				Z.headSectionHt = 0;
			} else {
				Z.headSectionHt = Z.maxHeadRows * Z._headRowHeight;
			}
			Z._changeContentWidth(0);
	
			Z.noRecordDiv.style.top = Z.headSectionHt + 'px';
			Z.noRecordDiv.style.left = jqEl.find('.jl-tbl-fixedcol').width() + 5 + 'px';
			jqEl.find('.jl-tbl-vscroll-head').height(Z.headSectionHt + Z.fixedSectionHt);
			Z._renderBody();
		},
	
		_moveColumn: function(rowIndex, srcCellIndex, destCellIndex) {
			var Z = this;
			
			function moveOneRow(cells, srcStart, srcEnd, destStart, destEnd) {
				var cobj, 
					colNo = 0, 
					srcCells = [],
					destCells = [];
				
				for(var i = 0, len = cells.length; i < len; i++) {
					cobj = cells[i];
					if(colNo >= srcStart && colNo <= srcEnd) {
						srcCells.push(cobj);
					} else if(colNo >= destStart && colNo <= destEnd) {
						destCells.push(cobj);
					} else {
						if(colNo > srcEnd && colNo > destEnd) {
							break;
						}
					}
					
					colNo += cobj.colSpan || 1;
				}
				
				if(srcStart > destStart) {	
					var destCell = destCells[0];
					for(var i = 0, len = srcCells.length; i < len; i++) {
						jQuery(srcCells[i]).insertBefore(destCell);
					}
				} else {
					var destCell = destCells[destCells.length - 1];
					for(var i = srcCells.length; i >= 0; i--) {
						jQuery(srcCells[i]).insertAfter(destCell);
					}
				}
			}
			
			function moveOneTableColumn(rows, rowIndex, srcStart, srcEnd, destStart, destEnd) {
				var rowCnt = rows.length;
				if(rowCnt === 0 || rowCnt === rowIndex) {
					return;
				}
				var colCfg = rows[rowIndex].cells[srcStart].jsletColCfg;
				var rowObj, cellCnt;
				for(var i = rowIndex, len = rows.length; i < len; i++) {
					rowObj = rows[i];
					moveOneRow(rowObj.cells, srcStart, srcEnd, destStart, destEnd);
				}
			}
			
			var rows = Z.rightHeadTbl.createTHead().rows, cobj,
				rowObj = rows[rowIndex],
				srcStart = 0,
				srcEnd = 0,
				destStart = 0,
				destEnd = 0, 
				preColNo = 0,
				colNo = 0;
			
			for(var i = 0, len = rowObj.cells.length; i < len; i++) {
				cobj = rowObj.cells[i];
				preColNo = colNo; 
				colNo += (cobj.colSpan || 1);
				if(i === srcCellIndex) {
					srcStart = preColNo;
					srcEnd = colNo - 1;
				}
				if(i === destCellIndex) {
					destStart = preColNo;
					destEnd = colNo - 1;
				}
			}
			var srcCell = rowObj.cells[srcCellIndex],
				destCell = rowObj.cells[destCellIndex];
			var srcColCfg = srcCell.jsletColCfg,
				destColCfg = destCell.jsletColCfg,
				srcFldName = srcColCfg.field,
				destFldName = destColCfg.field;
			if(srcFldName && destFldName) {
				Z._dataset.designMode(true);
				try {
					Z._dataset.moveField(srcFldName, destFldName);
				} finally {
					Z._dataset.designMode(false);
				}
			}
			var headRows = Z.rightHeadTbl.createTHead().rows;
			Z._changeColNum(headRows[headRows.length - 1], srcStart, srcEnd, destStart, destEnd);
			var dataRows = Z.rightContentTbl.tBodies[0].rows;
			Z._changeColNum(dataRows[0], srcStart, srcEnd, destStart, destEnd);
			Z._currColNum = 0;
			moveOneTableColumn(headRows, rowIndex, srcStart, srcEnd, destStart, destEnd);
			moveOneTableColumn(Z.rightFixedTbl.tBodies[0].rows, 0, srcStart, srcEnd, destStart, destEnd);
			moveOneTableColumn(dataRows, 0, srcStart, srcEnd, destStart, destEnd);
			moveOneTableColumn(Z.rightFootTbl.tBodies[0].rows, 0, srcStart, srcEnd, destStart, destEnd);
			Z._dataset.selection.removeAll();
			Z._refreshSelection();
		},
		
		_changeColNum: function(rowObj, srcStart, srcEnd, destStart, destEnd) {
			if(!rowObj) {
				return;
			}
			var cobj, 
				colNo = 0, 
				srcCells = [],
				destCells = [],
				cells = rowObj.cells;
			
			for(var i = 0, len = cells.length; i < len; i++) {
				cobj = cells[i];
				if(colNo >= srcStart && colNo <= srcEnd) {
					srcCells.push(cobj);
				} else if(colNo >= destStart && colNo <= destEnd) {
					destCells.push(cobj);
				} else {
					if(colNo > srcEnd && colNo > destEnd) {
						break;
					}
				}
				colNo += cobj.colSpan || 1;
			}
			var srcCellLen = srcCells.length,
				destCellLen = destCells.length,
				firstDestColNum= destCells[0].jsletColCfg.colNum,
				k = 0, colCfg;
			if(srcStart > destStart) {
				for(var i = srcStart; i <= srcEnd; i++) {
					colCfg = cells[i].jsletColCfg;
					colCfg.colNum = firstDestColNum + (k++);
				}
				for(var i = destStart; i < srcStart; i++) {
					colCfg = cells[i].jsletColCfg;
					colCfg.colNum = colCfg.colNum + srcCellLen;
				}
			} else {
				var newStart = firstDestColNum - srcCellLen + destCellLen;
				for(var i = srcStart; i <= srcEnd; i++) {
					colCfg = cells[i].jsletColCfg;
					colCfg.colNum = newStart + (k++);
				}
				for(var i = srcEnd + 1; i <= destEnd; i++) {
					colCfg = cells[i].jsletColCfg;
					colCfg.colNum = colCfg.colNum - srcCellLen;
				}
			}		
		},
		
		_calcAndSetContentHeight: function(){
			var Z = this,
				jqEl = jQuery(Z.el);
	
			Z.contentSectionHt = Z.height - Z.headSectionHt - Z.fixedSectionHt - Z.footSectionHt;
			if (Z._isHoriOverflow){
				Z.contentSectionHt -= jslet.ui.htmlclass.TABLECLASS.scrollBarWidth;
			}
			
			Z.listvm.setVisibleCount(Math.floor((Z.contentSectionHt) / Z._rowHeight), true);
			Z._repairHeight = Z.contentSectionHt - Z.listvm.getVisibleCount() * Z._rowHeight;
			
			jqEl.find('.jl-tbl-contentcol').height(Z.height);
			jqEl.find('.jl-tbl-content-div').height(Z.contentSectionHt);
	
			Z.jqVScrollBar.height(Z.contentSectionHt + Z.footSectionHt);
			Z._setScrollBarMaxValue(Z.listvm.getNeedShowRowCount() * Z._rowHeight);
		},
		
		_checkHoriOverflow: function(){
			var Z = this,
				contentWidth = Z.getTotalWidth();
	
			if(Z._hideHead) {
				Z._isHoriOverflow = contentWidth > jQuery(Z.rightContentTbl.parentNode.parentNode).innerWidth();
			} else {
				Z._isHoriOverflow = contentWidth > Z.rightHeadTbl.parentNode.parentNode.clientWidth;
			}
			Z._calcAndSetContentHeight();
		},
		
		_refreshHeadCell: function(fldName) {
			var Z = this,
				jqEl = jQuery(Z.el), oth = null, cobj;
			jqEl.find('.jl-tbl-header-cell').each(function(index, value){
				cobj = this.jsletColCfg;
				if(cobj && cobj.field == fldName) {
					oth = this;
					return false;
				}
			});
			if(!oth) {
				return;
			}
			var fldObj = Z._dataset.getField(cobj.field);
			cobj.label = fldObj.label();
			var ochild = oth.childNodes[0];
			var cellRender = cobj.cellRender || Z._defaultCellRender;
			if (cellRender && cellRender.createHeader) {
				ochild.html('');
				cellRender.createHeader.call(Z, ochild, cobj);
			} else {
				var sh = cobj.label || '&nbsp;';
				if(cobj.field && Z._isCellEditable(cobj)) {
					if(fldObj && fldObj.required()) {
						sh = '<span class="jl-lbl-required">*</span>' + sh;
					}
				} 
				jQuery(oth).find('.jl-focusable-item').html(sh);
			}
		},
		
		_createHeadCell: function (otr, cobj) {
			var Z = this,
				rowSpan = 0, colSpan = 0;
			
			if (!cobj.subHeads) {
				rowSpan = Z.maxHeadRows - (cobj.level ? cobj.level: 0);
			} else {
				colSpan = cobj.colSpan;
			}
			var oth = document.createElement('th');
			oth.className = 'jl-tbl-header-cell jl-unselectable';
			oth.noWrap = true;
			oth.jsletColCfg = cobj;
			if (rowSpan && rowSpan > 1) {
				oth.rowSpan = rowSpan;
			}
			if (colSpan && colSpan > 1) {
				oth.colSpan = colSpan;
			}
			oth.innerHTML = '<div style="position: relative" unselectable="on" class="jl-unselectable jl-tbl-header-div jl-border-box ' + 
				(cobj.widthCssName || '') +'">';
			var ochild = oth.childNodes[0];
			var cellRender = cobj.cellRender || Z._defaultCellRender;
			if (cellRender && cellRender.createHeader) {
				cellRender.createHeader.call(Z, ochild, cobj);
			} else {
				var sh = cobj.label || '&nbsp;';
				if(cobj.field && Z._isCellEditable(cobj)) {
					var fldObj = Z._dataset.getField(cobj.field);
					if(fldObj && fldObj.required()) {
						sh = '<span class="jl-lbl-required">*</span>' + sh;
					}
				} 
				ochild.innerHTML = [
				    Z._hasFilterDialog ? '<button class="jl-tbl-filter"><i class="fa fa-filter"></i></button>': '',
				    '<span id="',
					cobj.id, 
					'" unselectable="on" style="width:100%;padding:0px 2px">',
					((!Z._disableHeadSort && !cobj.disableHeadSort) ? '<span class="jl-focusable-item" draggable="true">' + sh +'</span>': sh),
					'</span><span unselectable="on" class="jl-tbl-sorter" title="',
					jslet.locale.DBTable.sorttitle,
					'">&nbsp;</span><div  unselectable="on" class="jl-tbl-splitter-hook" colid="',
					cobj.colNum,
					'">&nbsp;</div>'].join('');
			}
			otr.appendChild(oth);	
		}, // end _createHeadCell
	
		_renderHeader: function () {
			var Z = this;
			if (Z._hideHead) {
				return;
			}
			var otr, otrLeft = null, cobj, otrRight, otd, oth,
				leftHeadObj = Z.leftHeadTbl.createTHead(),
				rightHeadObj = Z.rightHeadTbl.createTHead();
			for(var i = 0; i < Z.maxHeadRows; i++){
				leftHeadObj.insertRow(-1);
				rightHeadObj.insertRow(-1);
			}
			otr = leftHeadObj.rows[0];
			for(var i = 0, cnt = Z._sysColumns.length; i < cnt; i++){
				cobj = Z._sysColumns[i];
				cobj.rowSpan = Z.maxHeadRows;
				Z._createHeadCell(otr, cobj);
			}
			function travHead(arrHeadCfg){
				var cobj, otr;
				for(var m = 0, ccnt = arrHeadCfg.length; m < ccnt; m++){
					cobj = arrHeadCfg[m];
					if (cobj.colNum < Z._fixedCols) {
						otr = leftHeadObj.rows[cobj.level];
					} else {
						otr = rightHeadObj.rows[cobj.level];
					}
					Z._createHeadCell(otr, cobj);
					if (cobj.subHeads) {
						travHead(cobj.subHeads);
					}
				}
			}
			travHead(Z.innerHeads);
			var jqTr1, jqTr2, h= Z._headRowHeight;
			for(var i = 0; i <= Z.maxHeadRows; i++){
				jqTr1 = jQuery(leftHeadObj.rows[i]);
				jqTr2 = jQuery(rightHeadObj.rows[i]);
				jqTr1.height(h);
				jqTr2.height(h);
			}
			Z.sortedCell = null;
			Z.indexField = null;
		}, // end renderHead
	
		getTotalWidth: function(isLeft){
			var Z= this,
			totalWidth = 0;
			if(!isLeft) {
				for(var i = Z._fixedCols, cnt = Z.innerColumns.length; i < cnt; i++){
					totalWidth += Z.innerColumns[i].width;
				}
			} else {
				for(var i = 0, cnt = Z._sysColumns.length; i < cnt; i++){
					totalWidth += Z._sysColumns[i].width;
				}
				for(var i = 0, cnt = Z._fixedCols; i < cnt; i++){
					totalWidth += Z.innerColumns[i].width;
				}
			}
			return totalWidth;
		},
		
		_doSplitHookDown: function (event) {
			event = jQuery.event.fix( event || window.event );
			var ohook = event.target;
			if (ohook.className != 'jl-tbl-splitter-hook') {
				return;
			}
			var tblContainer = jslet.ui.findFirstParent(ohook, function (el) {
				return el.tagName.toLowerCase() == 'div' && el.jslet && el.jslet._dataset;
			});
			var jqTblContainer = jQuery(tblContainer);
			
			var jqBody = jQuery(document.body); 
			var bodyMTop = parseInt(jqBody.css('margin-top'));
			var bodyMleft = parseInt(jqBody.css('margin-left'));
			var y = jqTblContainer.position().top - bodyMTop;
			var jqHook = jQuery(ohook);
			var h = jqTblContainer.height() - 20;
			var currLeft = jqHook.offset().left - jqTblContainer.offset().left - bodyMleft;
			var splitDiv = jqTblContainer.find('.jl-tbl-splitter')[0];
			splitDiv.style.left = currLeft + 'px';
			splitDiv.style.top = '1px';
			splitDiv.style.height = h + 'px';
			jslet.ui.dnd.bindControl(splitDiv);
			tblContainer.jslet.currColId = parseInt(jqHook.attr('colid'));
			tblContainer.jslet.isDraggingColumn = true;
		},
	
		_doSplitHookUp: function (event) {
			event = jQuery.event.fix( event || window.event );
			var ohook = event.target.lastChild;
			if (!ohook || ohook.className != 'jl-tbl-splitter-hook') {
				return;
			}
			var tblContainer = jslet.ui.findFirstParent(ohook, function (el) {
				return el.tagName.toLowerCase() == 'div' && el.jslet && el.jslet._dataset;
			});
	
			var jqTblContainer = jQuery(tblContainer),
				jqBody = jQuery(document.body); 
			jqBody.css('cursor','auto');
	
			var splitDiv = jqTblContainer.find('.jl-tbl-splitter')[0];
			if (splitDiv.style.display != 'none') {
				splitDiv.style.display = 'none';
			}
			tblContainer.jslet.isDraggingColumn = false;
		},
	
		_getColumnByField: function (fieldName) {
			var Z = this;
			if (!Z.innerColumns) {
				return null;
			}
			var cobj;
			for (var i = 0, cnt = Z.innerColumns.length; i < cnt; i++) {
				cobj = Z.innerColumns[i];
				if (cobj.field == fieldName) {
					return cobj;
				}
			}
			return null;
		},
	
		_doHeadClick: function (colCfg, ctrlKeyPressed) {
			var Z = this;
			if (Z._disableHeadSort || colCfg.disableHeadSort || Z.isDraggingColumn) {
				return;
			}
			Z._doSort(colCfg.field, ctrlKeyPressed);
		}, // end _doHeadClick
	
		_doSort: function (sortField, isMultiSort) {
			var Z = this;
			Z._dataset.confirm();
			Z._dataset.disableControls();
			try {
				if (!Z._onCustomSort) {
					Z._dataset.toggleIndexField(sortField, !isMultiSort);
				} else {
					Z._onCustomSort.call(Z, sortField);
				}
				Z.listvm.refreshModel();
			} finally {
				Z._dataset.enableControls();
			}
		},
	
		_updateSortFlag: function () {
			var Z = this;
			if (Z._hideHead) {
				return;
			}
	
			var sortFields = Z._dataset.mergedIndexFields();
			
			var leftHeadObj = Z.leftHeadTbl.createTHead(),
				rightHeadObj = Z.rightHeadTbl.createTHead(),
				leftHeadCells = leftHeadObj.rows[0].cells,// jQuery(leftHeadObj).find('th'),
				rightHeadCells =  rightHeadObj.rows[0].cells,// jQuery(rightHeadObj).find('th'),
				allHeadCells = [], oth;
	
			for (var i = 0, cnt = leftHeadCells.length; i < cnt; i++){
				oth = leftHeadCells[i];
				if (oth.jsletColCfg) {
					allHeadCells[allHeadCells.length] = oth;
				}
			}
	
			for (var i = 0, cnt = rightHeadCells.length; i < cnt; i++){
				oth = rightHeadCells[i];
				if (oth.jsletColCfg) {
					allHeadCells[allHeadCells.length] = oth;
				}
			}
	
			var len = sortFields.length, sortDiv, 
				cellCnt = allHeadCells.length;
			for (var i = 0; i < cellCnt; i++) {
				oth = allHeadCells[i];
				sortDiv = jQuery(oth).find('.jl-tbl-sorter')[0];
				if (sortDiv) {
					sortDiv.innerHTML = '&nbsp;';
				}
			}
			var fldName, sortFlag, sortObj, 
				k = 1;
			for (var i = 0; i < len; i++) {
				sortObj = sortFields[i];
				for (var j = 0; j < cellCnt; j++) {
					oth = allHeadCells[j];
					fldName = oth.jsletColCfg.field;
					if (!fldName) {
						continue;
					}
					sortDiv = jQuery(oth).find('.jl-tbl-sorter')[0];
					sortFlag = '&nbsp;';
					if (fldName == sortObj.fieldName) {
						sortFlag = sortObj.order === 1 ? jslet.ui.htmlclass.TABLECLASS.sortAscChar : jslet.ui.htmlclass.TABLECLASS.sortDescChar;
						if (len > 1) {
							sortFlag += k++;
						}
						break;
					}
				}
				sortDiv.innerHTML = sortFlag;
				if (!oth) {
					continue;
				}
			}
		},
	
		_doSelectBoxClick: function (event) {
			var ocheck = null;
			if (event){
				event = jQuery.event.fix( event || window.event );
				ocheck = event.target;
			} else {
				ocheck = this;
			}
			var otr = jslet.ui.getParentElement(ocheck, 2);
			try {
				jQuery(otr).click();// tr click
			} finally {
				var otable = jslet.ui.findFirstParent(otr, function (node) {
					return node.jslet? true: false;
				});
				var oJslet = otable.jslet;
	
				if (oJslet._onSelect) {
					var flag = oJslet._onSelect.call(oJslet, ocheck.checked);
					if (flag !== undefined && !flag) {
						ocheck.checked = !ocheck.checked;
						return;
					}
				}
	
				oJslet._dataset.select(ocheck.checked ? 1 : 0, oJslet._selectBy);
			}
		}, // end _doSelectBoxClick
	
		_doCellClick: function () {
			var Z = this;
			if (Z._onCellClick) {
				var colNum = Z._currColNum;
				Z._onCellClick.call(Z, Z.innerColumns[colNum]);
			}
		},
		
		_doRowDblClick: function (event) {
			var otable = jslet.ui.findFirstParent(this, function (node) {
				return node.jslet? true: false;
			});
	
			var Z = otable.jslet;
			if (Z._onRowDblClick) {
				Z._onRowDblClick.call(Z, event);
			}
		},
	
		_doRowClick: function (event) {
			var otable = jslet.ui.findFirstParent(this, function (node) {
				return node.jslet ? true: false;
			});
	
			var Z = otable.jslet;
			var dataset = Z.dataset();
			if(dataset.status() && (this.jsletrecno !== dataset.recno())) {
				dataset.confirm();
			}
	
			var rowno = Z.listvm.recnoToRowno(this.jsletrecno);
			Z.listvm.setCurrentRowno(rowno);
			Z._dataset.recno(Z.listvm.getCurrentRecno())
			if (Z._onRowClick) {
				Z._onRowClick.call(Z, event);
			}
		},
	
		_renderCell: function (otr, colCfg, isFirstCol) {
			var Z = this;
			var otd = document.createElement('td');
			otd.noWrap = true;
			otd.jsletColCfg = colCfg;
			jQuery(otd).addClass('jl-tbl-cell');
			otd.innerHTML = '<div class="jl-tbl-cell-div ' + (colCfg.widthCssName || '') + '"></div>';
			var ochild = otd.firstChild;
			var cellRender = colCfg.cellRender || Z._defaultCellRender;
			if (cellRender && cellRender.createCell) {
				cellRender.createCell.call(Z, ochild, colCfg);
			} else if (!Z._isCellEditable(colCfg)) {
					jslet.ui.DBTable.defaultCellRender.createCell.call(Z, ochild, colCfg);
					colCfg.editable = false;
			} else {
					jslet.ui.DBTable.editableCellRender.createCell.call(Z, ochild, colCfg);
					colCfg.editable = true;
			}
			otr.appendChild(otd);
		},
	
		_renderRow: function (sectionNum, onlyRefreshContent) {
			var Z = this;
			var rowCnt = 0, leftBody = null, rightBody,
				hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;
			switch (sectionNum) {
				case 1:
					{//fixed data
						rowCnt = Z._fixedRows;
						if (hasLeft) {
							leftBody = Z.leftFixedTbl.tBodies[0];
						}
						rightBody = Z.rightFixedTbl.tBodies[0];
						break;
					}
				case 2:
					{//data content
						rowCnt = Z.listvm.getVisibleCount();
						if (hasLeft) {
							leftBody = Z.leftContentTbl.tBodies[0];
						}
						rightBody = Z.rightContentTbl.tBodies[0];
						break;
					}
			}
			var otr, oth, colCfg, isfirstCol, 
				startRow = 0,
				fldCnt = Z.innerColumns.length;
			if (onlyRefreshContent){
				startRow = rightBody.rows.length;
			}
			// create date content table row
			for (var i = startRow; i < rowCnt; i++) {
				if (hasLeft) {
					otr = leftBody.insertRow(-1);
					otr.style.height = Z._rowHeight + 'px';
	
					otr.ondblclick = Z._doRowDblClick;
					otr.onclick = Z._doRowClick;
					var sysColLen = Z._sysColumns.length;
					for(var j = 0; j < sysColLen; j++){
						colCfg = Z._sysColumns[j];
						Z._renderCell(otr, colCfg, j === 0);
					}
					
					isfirstCol = sysColLen === 0;
					for (var j = 0; j < Z._fixedCols; j++) {
						colCfg = Z.innerColumns[j];
						Z._renderCell(otr, colCfg, isfirstCol && j === 0);
					}
				}
				isfirstCol = !hasLeft;
				otr = rightBody.insertRow(-1);
				otr.style.height = Z._rowHeight + 'px';
				otr.ondblclick = Z._doRowDblClick;
				otr.onclick = Z._doRowClick;
				for (var j = Z._fixedCols; j < fldCnt; j++) {
					colCfg = Z.innerColumns[j];
					Z._renderCell(otr, colCfg, j == Z._fixedCols);
				}
			}
		},
	
		_renderBody: function (onlyRefreshContent) {
			var Z = this;
			if (onlyRefreshContent){
				Z._renderRow(2, true);
			} else {
				Z._renderRow(1);
				Z._renderRow(2);
				Z._renderTotalSection();
			}
		}, // end _renderBody
	
		_renderTotalSection: function() {
			var Z = this;
			if (!Z.footSectionHt) {
				return;
			}
			var hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0,
				leftBody,
				rightBody,
				otr, colCfg;
			if (hasLeft) {
				leftBody = Z.leftFootTbl.tBodies[0];
			}
			rightBody = Z.rightFootTbl.tBodies[0];
			
			function createCell(colCfg) {
				var otd = document.createElement('td');
				otd.noWrap = true;
				otd.innerHTML = '<div class="jl-tbl-footer-div ' + (colCfg.widthCssName || '') + '"></div>';
				otd.jsletColCfg = colCfg;
				return otd;
			}
			
			if (hasLeft) {
				otr = leftBody.insertRow(-1);
				otr.style.height = Z._rowHeight + 'px';
	
				for(var j = 0, len = Z._sysColumns.length; j < len; j++) {
					colCfg = Z._sysColumns[j];
					otr.appendChild(createCell(colCfg));
				}
				
				for (var j = 0; j < Z._fixedCols; j++) {
					colCfg = Z.innerColumns[j];
					otr.appendChild(createCell(colCfg));
				}
			}
			otr = rightBody.insertRow(-1);
			otr.style.height = Z._rowHeight + 'px';
			for (var j = Z._fixedCols, len = Z.innerColumns.length; j < len; j++) {
				colCfg = Z.innerColumns[j];
				otr.appendChild(createCell(colCfg));
			}
			
		},
		
		_fillTotalSection: function () {
			var Z = this,
				aggradeValues = Z._dataset.aggradedValues();
			if (!Z.footSectionHt || !aggradeValues) {
				return;
			}
			var sysColCnt = Z._sysColumns.length,
				hasLeft = Z._fixedCols > 0 || sysColCnt > 0,
				otrLeft, otrRight;
			if (hasLeft) {
				otrLeft = Z.leftFootTbl.tBodies[0].rows[0];
			}
			otrRight = Z.rightFootTbl.tBodies[0].rows[0];
	
			var otd, k = 0, fldObj, cobj, fldName, totalValue;
			var aggradeValueObj,
				labelDisplayed = false,
				canShowLabel = true;
			if(sysColCnt > 0) {
				otd = otrLeft.cells[sysColCnt - 1];
				otd.innerHTML = jslet.locale.DBTable.totalLabel;
				canShowLabel = false;
			}
			for (var i = 0, len = Z.innerColumns.length; i < len; i++) {
				cobj = Z.innerColumns[i];
	
				if (i < Z._fixedCols) {
					otd = otrLeft.cells[i + sysColCnt];
				} else {
					otd = otrRight.cells[i - Z._fixedCols];
				}
				otd.style.textAlign = 'right';
	
				fldName = cobj.field;
				aggradeValueObj = aggradeValues[fldName];
				if (!aggradeValueObj) {
					if(canShowLabel) {
						var content;
						if(labelDisplayed) {
							content = '&nbsp;';
						} else {
							content = jslet.locale.DBTable.totalLabel;
							labelDisplayed = true;
						}
						otd.firstChild.innerHTML = content;
					}
					continue;
				}
				canShowLabel = false;
				fldObj = Z._dataset.getField(fldName);
				if(fldObj.getType() === jslet.data.DataType.NUMBER) {
					totalValue = aggradeValueObj.sum;
				} else {
					totalValue = aggradeValueObj.count;
				}
				var displayValue = totalValue? jslet.formatNumber(totalValue, fldObj.displayFormat()) : '';
				otd.firstChild.innerHTML = displayValue;
				otd.firstChild.title = displayValue;
			}
		},
		
		_fillData: function () {
			var Z = this;
			var preRecno = Z._dataset.recno(),
				allCnt = Z.listvm.getNeedShowRowCount(),
				h = allCnt * Z._rowHeight + Z.footSectionHt;
			Z._setScrollBarMaxValue(h);
			Z.noRecordDiv.style.display = (allCnt === 0 ?'block':'none');
			var oldRecno = Z._dataset.recnoSilence();
			try {
				Z._fillRow(true);
				Z._fillRow(false);
				if (Z.footSectionHt) {
					Z._fillTotalSection();
				}
			} finally {
				Z._dataset.recnoSilence(oldRecno);
			}
			Z._refreshSeqColWidth();
		},
	
		_fillRow: function (isFixed) {
			var Z = this,
				rowCnt = 0, start = 0, leftBody = null, rightBody,
				hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0;
				
			if (isFixed) {
				rowCnt = Z._fixedRows;
				start = -1 * Z._fixedRows;
				if (rowCnt === 0) {
					return;
				}
				if (hasLeft) {
					leftBody = Z.leftFixedTbl.tBodies[0];
				}
				rightBody = Z.rightFixedTbl.tBodies[0];
			} else {
				rowCnt = Z.listvm.getVisibleCount();
				start = Z.listvm.getVisibleStartRow();
				if (hasLeft) {
					leftBody = Z.leftContentTbl.tBodies[0];
				}
				rightBody = Z.rightContentTbl.tBodies[0];
			}
			
			var otr, colCfg, isfirstCol, recNo = -1, cells, clen, otd,
				fldCnt = Z.innerColumns.length,
				allCnt = Z.listvm.getNeedShowRowCount() - Z.listvm.getVisibleStartRow(),
				fixedRows = hasLeft ? leftBody.rows : null,
				contentRows = rightBody.rows,
				sameValueNodes = {},
				isFirst = true,
				actualCnt = Math.min(contentRows.length, rowCnt);
	
			for (var i = 0; i < actualCnt ; i++) {
				if (i >= allCnt) {
					if (hasLeft) {
						otr = fixedRows[i];
						otr.style.display = 'none';
					}
					otr = contentRows[i];
					otr.style.display = 'none';
					continue;
				}
	
				Z.listvm.setCurrentRowno(i + start, true);
				recNo = Z.listvm.getCurrentRecno();
				Z._dataset.recnoSilence(recNo);
				if (hasLeft) {
					otr = fixedRows[i];
					otr.jsletrecno = recNo;
					otr.style.display = '';
					if (Z._onFillRow) {
						Z._onFillRow.call(Z, otr, Z._dataset);
					}
					cells = otr.childNodes;
					clen = cells.length;
					for (var j = 0; j < clen; j++) {
						otd = cells[j];
						Z._fillCell(recNo, otd, sameValueNodes, isFirst);
					}
				}
	
				otr = contentRows[i];
				otr.jsletrecno = recNo;
				otr.style.display = '';
				if (Z._onFillRow) {
					Z._onFillRow.call(Z, otr, Z._dataset);
				}
				// fill content table
				otr = contentRows[i];
				cells = otr.childNodes;
				clen = cells.length;
				for (var j = 0; j < clen; j++) {
					otd = cells[j];
					Z._fillCell(recNo, otd, sameValueNodes, isFirst);
				} //end for data content field
				isFirst = 0;
			} //end for records
		},
	
		_fillCell: function (recNo, otd, sameValueNodes, isFirst) {
			var Z = this,
			colCfg = otd.jsletColCfg;
			if (!colCfg)
				return;
			var fldName = colCfg.field,
				cellPanel = otd.firstChild;
			
			if (Z._onFillCell) {
				Z._onFillCell.call(Z, cellPanel, Z._dataset, fldName);
			}
			if (fldName && colCfg.mergeSame && sameValueNodes) {
				if (isFirst || !Z._dataset.isSameAsPrevious(fldName)) {
					sameValueNodes[fldName] = { cell: otd, count: 1 };
					jQuery(otd).attr('rowspan', 1);
					otd.style.display = '';
				}
				else {
					var sameNode = sameValueNodes[fldName];
					sameNode.count++;
					otd.style.display = 'none';
					jQuery(sameNode.cell).attr('rowspan', sameNode.count);
				}
			}
	
			var cellRender = colCfg.cellRender || Z._defaultCellRender;
			if (cellRender && cellRender.refreshCell) {
				cellRender.refreshCell.call(Z, cellPanel, colCfg, recNo);
			} else if (!colCfg.editable) {
				jslet.ui.DBTable.defaultCellRender.refreshCell.call(Z, cellPanel, colCfg, recNo);
			} else {
				jslet.ui.DBTable.editableCellRender.refreshCell.call(Z, cellPanel, colCfg, recNo);
			}
		},
	
		refreshCurrentRow: function () {
			var Z = this,
				hasLeft = Z._fixedCols > 0 || Z._hasSeqCol || Z._hasSelectCol,
				fixedBody = null, contentBody, idx,
				recno = Z._dataset.recno();
	
			if (recno < Z._fixedRows) {
				if (hasLeft) {
					fixedBody = Z.leftFixedTbl.tBodies[0];
				}
				contentBody = Z.rightFixedTbl.tBodies[0];
				idx = recno;
			}
			else {
				if (hasLeft) {
					fixedBody = Z.leftContentTbl.tBodies[0];
				}
				contentBody = Z.rightContentTbl.tBodies[0];
				idx = Z.listvm.recnoToRowno(Z._dataset.recno()) - Z.listvm.getVisibleStartRow();
			}
	
			var otr, cells, otd, recNo, colCfg;
	
			if (hasLeft) {
				otr = fixedBody.rows[idx];
				if (!otr) {
					return;
				}
				cells = otr.childNodes;
				recNo = otr.jsletrecno;
				if (Z._onFillRow) {
					Z._onFillRow.call(Z, otr, Z._dataset);
				}
				for (var j = 0, clen = cells.length; j < clen; j++) {
					otd = cells[j];
					colCfg = otd.jsletColCfg;
					if (colCfg && colCfg.isSeqCol) {
						otd.firstChild.innerHTML = recno + 1;
						if(Z._dataset.existRecordError(recno)) {
							jQuery(otd).addClass('has-error');
						} else {
							jQuery(otd).removeClass('has-error');
						}
						continue;
					}
					if (colCfg && colCfg.isSelectCol) {
						ocheck = otd.firstChild;
						ocheck.checked = Z._dataset.selected();
						continue;
					}
					Z._fillCell(recNo, otd);
				}
			}
	
			otr = contentBody.rows[idx];
			if (!otr) {
				return;
			}
			recNo = otr.jsletrecno;
			if (Z._onFillRow) {
				Z._onFillRow.call(Z, otr, Z._dataset);
			}
			// fill content table
			cells = otr.childNodes;
			for (var j = 0, clen = cells.length; j < clen; j++) {
				otd = cells[j];
				Z._fillCell(recNo, otd);
			}
		},
	
		_getLeftRowByRecno: function (recno) {
			var Z = this;
			if (recno < Z._fixedRows) {
				return Z.leftFixedTbl.tBodies[0].rows[recno];
			}
			var rows = Z.leftContentTbl.tBodies[0].rows, row;
			for (var i = 0, cnt = rows.length; i < cnt; i++) {
				row = rows[i];
				if (row.jsletrecno == recno) {
					return row;
				}
			}
			return null;
		}, // end _getLeftRowByRecno
	
		_showCurrentRow: function (checkVisible) {//Check if current row is in visible area
			var Z = this,
				rowno = Z.listvm.recnoToRowno(Z._dataset.recno());
			Z.listvm.setCurrentRowno(rowno, false, checkVisible);
			Z._showCurrentCell();
		},
	
		_getTrByRowno: function (rowno) {
			var Z = this, 
				hasLeft = Z._fixedCols > 0 || Z._sysColumns.length > 0,
				idx, otr, k, rows, row, fixedRow;
	
			if (rowno < 0) {//fixed rows
				rows = Z.rightFixedTbl.tBodies[0].rows;
				k = Z._fixedRows + rowno;
				row = rows[k];
				fixedRow = (hasLeft ? Z.leftFixedTbl.tBodies[0].rows[k] : null);
				return { fixed: fixedRow, content: row };
			}
			//data content
			rows = Z.rightContentTbl.tBodies[0].rows;
			k = rowno - Z.listvm.getVisibleStartRow();
			if (k >= 0) {
				row = rows[k];
				if (!row) {
					return null;
				}
				fixedRow = hasLeft ? Z.leftContentTbl.tBodies[0].rows[k] : null;
				return { fixed: fixedRow, content: row };
			}
			return null;
		},
	
		_adjustCurrentCellPos: function(isLeft) {
			var Z = this;
			if(!Z._readOnly) {
				return;
			}
	
			var	jqEl = jQuery(Z.el),
				jqContentPanel = jqEl.find('.jl-tbl-contentcol'),
				contentPanel = jqContentPanel[0],
				oldScrLeft = contentPanel.scrollLeft;
			if(Z._currColNum < Z._fixedCols) { //If current cell is in fixed content area
				contentPanel.scrollLeft = 0;
				return;
			}
			var borderW = (Z._noborder ? 0: 2);
			if(isLeft) {
				if(oldScrLeft === 0) {
					return;
				}
				
				var currColLeft = 0;
				for(var i = Z._fixedCols, len = Z.innerColumns.length; i < Z._currColNum; i++) {
					currColLeft += (Z.innerColumns[i].width + borderW); //"2" is the cell border's width(left+right)
				}
				if(currColLeft < oldScrLeft) {
					contentPanel.scrollLeft = currColLeft; 
				}
			} else {
				var containerWidth = jqContentPanel.innerWidth() - 20;
				var contentWidth = jqContentPanel.find('.jl-tbl-content-div').width();
				var scrWidth = 0;
				for(var i = Z.innerColumns.length - 1; i > Z._currColNum; i--) {
					scrWidth += (Z.innerColumns[i].width + borderW); //"2" is the cell border's width(left+right)
				}
				currColLeft = contentWidth - scrWidth - containerWidth;
				if(currColLeft > oldScrLeft) {
					contentPanel.scrollLeft = (currColLeft >= 0? currColLeft: 0);
				}
			}
		},
	
		_isCurrCellInView: function() {
			var Z = this;
			if(!Z._readOnly) {
				return true;
			}
			
			var	jqEl = jQuery(Z.el),
				jqContentPanel = jqEl.find('.jl-tbl-contentcol'),
				contentPanel = jqContentPanel[0],
				borderW = (Z._noborder ? 0: 2),
				oldScrLeft = contentPanel.scrollLeft,
				currColLeft = 0;
			if(Z._currColNum < Z._fixedCols) { //If current cell is in fixed content area
				return true;
			}
			for(var i = Z._fixedCols, len = Z.innerColumns.length; i < Z._currColNum; i++) {
				currColLeft += (Z.innerColumns[i].width + borderW); //"2" is the cell border's width(left+right)
			}
			if(currColLeft < oldScrLeft) {
				return false; 
			}
			var containerWidth = jqContentPanel.innerWidth(),
				contentWidth = jqContentPanel.find('.jl-tbl-content-div').width();
				scrWidth = 0;
			for(var i = Z.innerColumns.length - 1; i > Z._currColNum; i--) {
				scrWidth += (Z.innerColumns[i].width + borderW); //"2" is the cell border's width(left+right)
			}
			currColLeft = contentWidth - scrWidth - containerWidth;
			currColLeft = (currColLeft >= 0? currColLeft: 0);
			if(currColLeft > oldScrLeft) {
				return false; 
			}
			
			return true;
		},
		
		_showCurrentCell: function() {
			var Z = this,
				otr,
				rowObj = Z._currRow;
			if(!rowObj || !Z._readOnly) {
				return;
			}
			if(Z._currColNum >= Z._fixedCols) {
				otr = rowObj.content;
			} else {
				otr = rowObj.fixed;
			}
			var recno = otr.jsletrecno;
			if(recno !== Z._dataset.recno()) {
	    		if(Z.prevCell) {
	    			Z.prevCell.removeClass('jl-tbl-curr-cell');
	    		}
				return;
			}
			var ocells = otr.cells, otd;
			for(var i = 0, len = ocells.length; i < len; i++) {
				otd = ocells[i];
	        	var colCfg = otd.jsletColCfg;
	        	if(colCfg && colCfg.colNum == Z._currColNum) {
	        		if(Z.prevCell) {
	        			Z.prevCell.removeClass('jl-tbl-curr-cell');
	        		}
	        		var jqCell = jQuery(otd);
	        		jqCell.addClass('jl-tbl-curr-cell');
	        		Z.prevCell = jqCell;
	        	}
			}
		},
		
		_showSelected: function(otd, fldName, recno) {
			var Z = this,
				jqCell = jQuery(otd);
			if(recno === undefined) {
				recno = Z._dataset.recno();
			}
			var isSelected = Z._dataset.selection.isSelected(recno, fldName);
			if(isSelected) {
				jqCell.addClass('jl-tbl-selected');
			} else {
				jqCell.removeClass('jl-tbl-selected');
			}
		},
		
		_refreshSelection: function() {
			var Z = this;
			jQuery(Z.el).find('td.jl-tbl-cell').each(function(k, otd){
	        	var colCfg = otd.jsletColCfg;
	        	var recno = parseInt(otd.parentNode.jsletrecno);
	        	if((recno || recno === 0) && colCfg) {
	        		var fldName = colCfg.field;
	        		if(fldName) {
	        			Z._showSelected(otd, fldName, recno);
	        		}
	        	}
			});
		},
		
		_syncScrollBar: function (rowno) {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var	sw = rowno * Z._rowHeight;
			Z._keep_silence_ = true;
			try {
				var scrBar = Z.jqVScrollBar[0];
				if(scrBar.scrollTop != sw) {
					scrBar.scrollTop = sw;
				}
			} finally {
				Z._keep_silence_ = false;
			}
		},
	
		expandAll: function () {
			var Z = this;
			Z.listvm.expandAll(function () {
				Z._fillData(); 
			});
		},
	
		collapseAll: function () {
			var Z = this;
			Z.listvm.collapseAll(function () {
				Z._fillData(); 
			});
		},
	
		_doMetaChanged: function(metaName, fldName) {
			var Z = this;
			if(!fldName) {
				Z.renderAll();
				return;
			}
			if(metaName == 'label' && !Z._hideHead) {
				Z._refreshHeadCell(fldName);
				return;
			}
			
			if(metaName == 'required' && !Z._readOnly && !Z._hideHead) {
				Z._refreshHeadCell(fldName);
				return;
			}
	
			if(metaName == 'visible') {
				
			}
		},
		
		refreshControl: function (evt) {
			var Z = this, 
				evtType = evt.eventType;
			if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
				Z._doMetaChanged(evt.metaName, evt.fieldName);
			} else if (evtType == jslet.data.RefreshEvent.AGGRADED) {
				Z._fillTotalSection();			
			} else if (evtType == jslet.data.RefreshEvent.BEFORESCROLL) {
				
			} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
				if (Z._dataset.recordCount() === 0) {
					return;
				}
				Z._showCurrentRow(true);
			} else if (evtType == jslet.data.RefreshEvent.UPDATEALL) {
				Z.listvm.refreshModel();
				Z._updateSortFlag(true);
				Z._fillData();
				Z._showCurrentRow(true);
				//Clear "Select all" checkbox
				if(Z._hasSelectCol) {
					jQuery(Z.el).find('.jl-tbl-select-all')[0].checked = false;
				}
			} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD) {
				Z.refreshCurrentRow();
			} else if (evtType == jslet.data.RefreshEvent.UPDATECOLUMN) {
				Z._fillData();
			} else if (evtType == jslet.data.RefreshEvent.INSERT) {
				Z.listvm.refreshModel();
				var recno = Z._dataset.recno(),
					preRecno = evt.preRecno;
				
				Z._fillData();
				Z._keep_silence_ = true;
				try {
					Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(recno, preRecno));
				} finally {
					Z._keep_silence_ = false;
				}
			} else if (evtType == jslet.data.RefreshEvent.DELETE) {
				Z.listvm.refreshModel();
				Z._fillData();
			} else if (evtType == jslet.data.RefreshEvent.SELECTRECORD) {
				if (!Z._hasSelectCol) {
					return;
				}
				var col = 0;
				if (Z._hasSeqCol) {
					col++;
				}
				var recno = evt.recno, otr, otd, checked, ocheckbox;
				for(var i = 0, cnt = recno.length; i < cnt; i++){
					otr = Z._getLeftRowByRecno(recno[i]);
					if (!otr) {
						continue;
					}
					otd = otr.cells[col];
					checked = evt.selected ? true : false;
					ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
					ocheckbox.checked = checked;
					ocheckbox.defaultChecked = checked;
				}
			} else if (evtType == jslet.data.RefreshEvent.SELECTALL) {
				if (!Z._hasSelectCol) {
					return;
				}
				var col = 0;
				if (Z._hasSeqCol) {
					col++;
				}
				var leftFixedBody = Z.leftFixedTbl.tBodies[0],
					leftContentBody = Z.leftContentTbl.tBodies[0],
					checked, recno, otr, otd, ocheckbox, rec,
					oldRecno = Z._dataset.recno();
	
				try {
					for (var i = 0, cnt = leftFixedBody.rows.length; i < cnt; i++) {
						otr = leftFixedBody.rows[i];
						if (otr.style.display == 'none') {
							break;
						}
						Z._dataset.recnoSilence(otr.jsletrecno);
						checked = Z._dataset.selected() ? true : false;
						otd = otr.cells[col];
						ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
						ocheckbox.checked = checked;
						ocheckbox.defaultChecked = checked;
					}
	
					for (var i = 0, cnt = leftContentBody.rows.length; i < cnt; i++) {
						otr = leftContentBody.rows[i];
						if (otr.style.display == 'none') {
							break;
						}
						Z._dataset.recnoSilence(otr.jsletrecno);
						checked = Z._dataset.selected() ? true : false;
						otd = otr.cells[col];
						ocheckbox = jQuery(otd).find('[type=checkbox]')[0];
						ocheckbox.checked = checked;
						ocheckbox.defaultChecked = checked;
					}
				} finally {
					Z._dataset.recnoSilence(oldRecno);
				}
			} //end event selectall
		}, // refreshControl
	
		_isCellEditable: function(colCfg){
			var Z = this;
			if (Z._readOnly) {
				return false;
			}
			var fldName = colCfg.field;
			if (!fldName) {
				return false;
			}
			var fldObj = Z._dataset.getField(fldName),
				isEditable = !fldObj.fieldDisabled() && !fldObj.fieldReadOnly() ? 1 : 0;
			return isEditable;
		},
		
		_createEditControl: function (colCfg) {
			var Z = this,
				fldName = colCfg.field;
			if (!fldName) {
				return null;
			}
			var fldObj = Z._dataset.getField(fldName),
				isEditable = !fldObj.fieldDisabled() && !fldObj.fieldReadOnly() ? 1 : 0;
			if (!isEditable) {
				return null;
			}
			var fldCtrlCfg = fldObj.editControl();
			fldCtrlCfg.dataset = Z._dataset;
			fldCtrlCfg.field = fldName;
			fldCtrlCfg.inTableCtrl = true;
			var editCtrl = jslet.ui.createControl(fldCtrlCfg);
			editCtrl = editCtrl.el;
			editCtrl.id = jslet.nextId();
			jQuery(editCtrl).addClass('jl-tbl-incell').on('editing', function(event, editingField) {
				Z._editingField = editingField;
			});
			return editCtrl;
		}, // end editControl
	
		/**
		 * Run when container size changed, it's revoked by jslet.resizeeventbus.
		 * 
		 */
		checkSizeChanged: function(){
			var Z = this,
				jqEl = jQuery(Z.el),
				newHeight = jqEl.height();
			if (newHeight == Z._oldHeight) {
				return;
			}
			Z.height = newHeight;
			Z.renderAll();
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this, jqEl = jQuery(Z.el);
			jslet.resizeEventBus.unsubscribe(Z);
			jqEl.off();
			Z.listvm.onTopRownoChanged = null;
			Z.listvm.onVisibleCountChanged = null;
			Z.listvm.onCurrentRownoChanged = null;
			Z.listvm = null;
			
			Z._currRow = null;
			
			Z.leftHeadTbl = null;
			Z.rightHeadTbl = null;
			jQuery(Z.rightHeadTbl).off();
	
			Z.leftFixedTbl = null;
			Z.rightFixedTbl = null;
	
			Z.leftContentTbl = null;
			Z.rightContentTbl = null;
	
			Z.leftFootTbl = null;
			Z.rightFootTbl = null;
			
			Z.noRecordDiv = null;
			Z.jqVScrollBar.off();
			Z.jqVScrollBar = null;
	
			var splitter = jqEl.find('.jl-tbl-splitter')[0];
			splitter._doDragging = null;
			splitter._doDragEnd = null;
			splitter._doDragCancel = null;
	
			Z.parsedHeads = null;
			jqEl.find('tr').each(function(){
				this.ondblclick = null;
				this.onclick = null;
			});
			
			jqEl.find('.jl-tbl-select-check').off();
			$super();
		} 
	});
	
	jslet.ui.DBTable = jslet.Class.create(jslet.ui.AbstractDBTable, {});
	
	
	jslet.ui.register('DBTable', jslet.ui.DBTable);
	jslet.ui.DBTable.htmlTemplate = '<div></div>';
	
	jslet.ui.CellRender = jslet.Class.create({
		createHeader: function(cellPanel, colCfg) {
			
		},
		
		createCell: function (cellPanel, colCfg) {
		
		},
		
		refreshCell: function (cellPanel, colCfg, recNo) {
		
		}
	});
	
	jslet.ui.DefaultCellRender =  jslet.Class.create(jslet.ui.CellRender, {
		createCell: function (cellPanel, colCfg) {
			var Z = this,
				fldName = colCfg.field,
				fldObj = Z._dataset.getField(fldName);
			cellPanel.parentNode.style.textAlign = fldObj.alignment();
		},
									
		refreshCell: function (cellPanel, colCfg, recNo) {
			if (!colCfg || colCfg.noRefresh) {
				return;
			}
			var Z = this,
				fldName = colCfg.field;
			if (!fldName) {
				return;
			}
			
			var fldObj = Z._dataset.getField(fldName), text;
			try {
				text = Z._dataset.getFieldTextByRecno(recNo, fldName);
			} catch (e) {
				text = 'error: ' + e.message;
				console.error(e);
			}
			
			if (fldObj.urlExpr()) {
				var url = '<a href=' + fldObj.calcUrl(),
					target = fldObj.urlTarget();
				if (target) {
					url += ' target=' + target;
				}
				url += '>' + text + '</a>';
				text = url;
			}
			if(text === '' || text === null || text === undefined) {
				text = '&nbsp;';
			}
			var jqCellPanel = jQuery(cellPanel); 
			jqCellPanel.html(text);
			cellPanel.title = jqCellPanel.text();
			Z._showSelected(cellPanel.parentNode, fldName, recNo);
		} 
	});
	
	jslet.ui.EditableCellRender =  jslet.Class.create(jslet.ui.CellRender, {
		createCell: function (cellPanel, colCfg, rowNum) {
			var Z = this,
				fldName = colCfg.field,
				fldObj = Z._dataset.getField(fldName);
			
			var editCtrl = Z._createEditControl(colCfg);
			cellPanel.appendChild(editCtrl);
		},
		
		refreshCell: function (cellPanel, colCfg, recNo) {
			if (!colCfg || !cellPanel.firstChild) {
				return;
			}
			var editCtrl = cellPanel.firstChild.jslet;
			editCtrl.ctrlRecno(recNo);
		} 
	
	});
	
	jslet.ui.SequenceCellRender = jslet.Class.create(jslet.ui.CellRender, {
		createHeader: function(cellPanel, colCfg) {
			cellPanel.innerHTML = this._seqColHeader || '&nbsp;';
		},
		
		createCell: function (cellPanel, colCfg) {
			jQuery(cellPanel.parentNode).addClass('jl-tbl-sequence');
		},
		
		refreshCell: function (cellPanel, colCfg) {
			if (!colCfg || colCfg.noRefresh) {
				return;
			}
			var jqDiv = jQuery(cellPanel), 
				text,
				recno = this.listvm.getCurrentRecno();
			if(this._reverseSeqCol) {
				text = this._dataset.recordCount() - recno;
			} else {
				text = recno + 1;
			}
			if(this._dataset.existRecordError(recno)) {
				jqDiv.parent().addClass('has-error');
			} else {
				jqDiv.parent().removeClass('has-error');
			}
			cellPanel.title = text;
			jqDiv.html(text);
		}
	});
	
	jslet.ui.SelectCellRender = jslet.Class.create(jslet.ui.CellRender, {
		createHeader: function(cellPanel, colCfg) {
			cellPanel.style.textAlign = 'center';
			var ocheckbox = document.createElement('input');
			ocheckbox.type = 'checkbox';
			var Z = this;
			jQuery(ocheckbox).addClass('jl-tbl-select-check jl-tbl-select-all').on('click', function (event) {
				Z._dataset.selectAll(this.checked ? 1 : 0, Z._onSelectAll);
			});
			cellPanel.appendChild(ocheckbox);
		},
		
	   createCell: function (cellPanel, colCfg) {
		    cellPanel.style.textAlign = 'center';
			var Z = this, 
			ocheck = document.createElement('input'),
			jqCheck = jQuery(ocheck);
			jqCheck.attr('type', 'checkbox').addClass('jl-tbl-select-check');
			jqCheck.click(Z._doSelectBoxClick);
			cellPanel.appendChild(ocheck);
		},
	
		refreshCell: function (cellPanel, colCfg, recNo) {
			if (!colCfg || colCfg.noRefresh) {
				return;
			}
			var Z = this,
				ocheck = cellPanel.firstChild;
			if(Z._dataset.checkSelectable(recNo)) {
				ocheck.checked = Z._dataset.selectedByRecno(recNo);
				ocheck.style.display = '';
			} else {
				ocheck.style.display = 'none';
			}
		}
	});
	
	jslet.ui.SubgroupCellRender = jslet.Class.create(jslet.ui.CellRender, {
		createCell: function(otd, colCfg){
			//TODO
		}
	});
	
	jslet.ui.BoolCellRender = jslet.Class.create(jslet.ui.DefaultCellRender, {
		refreshCell: function (cellPanel, colCfg, recNo) {
			if (!colCfg || colCfg.noRefresh) {
				return;
			}
			cellPanel.style.textAlign = 'center';
			var jqDiv = jQuery(cellPanel);
			jqDiv.html('&nbsp;');
			var Z = this,
				fldName = colCfg.field, 
				fldObj = Z._dataset.getField(fldName);
			if (Z._dataset.getFieldValueByRecno(recNo, fldName)) {
				jqDiv.addClass('jl-tbl-checked');
				jqDiv.removeClass('jl-tbl-unchecked');
			}
			else {
				jqDiv.removeClass('jl-tbl-checked');
				jqDiv.addClass('jl-tbl-unchecked');
			}
			Z._showSelected(cellPanel.parentNode, fldName, recNo);
		}
	});
			
	jslet.ui.TreeCellRender = jslet.Class.create(jslet.ui.CellRender, {
		initialize: function () {
		},
			
		createCell: function (cellPanel, colCfg, recNo) {
			var Z = this;
	
			var odiv = document.createElement('div'),
				jqDiv = jQuery(odiv);
			odiv.style.height = Z._rowHeight - 2 + 'px';
			jqDiv.html('<span class="jl-tbltree-indent"></span><span class="jl-tbltree-node"></span><span class="jl-tbltree-icon"></span><span class="jl-tbltree-text"></span>');
			
			var obtn = odiv.childNodes[1];
			obtn.onclick = function (event) {
				var otr = jslet.ui.findFirstParent(this,
				function(node){
					return node.tagName && node.tagName.toLowerCase() == 'tr';
				});
				
				event.stopImmediatePropagation();
				event.preventDefault();
				Z._dataset.recno(otr.jsletrecno);
				if(Z._dataset.aborted()) {
					return false;
				}
				if (this.expanded) {
					Z.listvm.collapse(function(){
						Z._fillData();
					});
				} else {
					Z.listvm.expand(function(){
						Z._fillData();
					});
				}
				return false;
			};
			
			obtn.onmouseover = function (event) {
				var jqBtn = jQuery(this);
				if (jqBtn.hasClass('jl-tbltree-collapse')) {
					jqBtn.addClass('jl-tbltree-collapse-hover');
				} else {
					jqBtn.addClass('jl-tbltree-expand-hover');
				}
			};
			
			obtn.onmouseout = function (event) {
				var jqBtn = jQuery(this);
				jqBtn.removeClass('jl-tbltree-collapse-hover');
				jqBtn.removeClass('jl-tbltree-expand-hover');
			};
			
			cellPanel.appendChild(odiv);
		},
		
		refreshCell: function (cellPanel, colCfg, recNo) {
			if (!colCfg || colCfg.noRefresh) {
				return;
			}
			var odiv = cellPanel.firstChild,
				arrSpan = odiv.childNodes,
				Z = this,
				level = Z.listvm.getLevel(recNo);
			
			if (!jslet.ui.TreeCellRender.iconWidth) {
				jslet.ui.TreeCellRender.iconWidth = parseInt(jslet.ui.getCssValue('jl-tbltree-indent', 'width'));
			}
			var hasChildren = Z.listvm.hasChildren(recNo),
				indentWidth = (!hasChildren ? level + 1 : level) * jslet.ui.TreeCellRender.iconWidth,
				oindent = arrSpan[0];
			oindent.style.width = indentWidth + 'px';
			var expBtn = arrSpan[1]; //expand button
			expBtn.style.display = hasChildren ? 'inline-block' : 'none';
			if (hasChildren) {
	//			expBtn.expanded = Z._dataset.getRecord(recNo)._expanded_;
				expBtn.expanded = Z._dataset.expandedByRecno(recNo);
				var jqExpBtn = jQuery(expBtn);
				jqExpBtn.removeClass('jl-tbltree-expand');
				jqExpBtn.removeClass('jl-tbltree-collapse');
				jqExpBtn.addClass((expBtn.expanded ? 'jl-tbltree-expand' : 'jl-tbltree-collapse'));
			}
			if (colCfg.getIconClass) {
				var iconCls = colCfg.getIconClass(level, hasChildren);
				if (iconCls) {
					var jqIcon = jQuery(arrSpan[2]);
					jqIcon.addClass('jl-tbltree-icon ' + iconCls);
				}
			}
			
			var otext = arrSpan[3];
			
			var fldName = colCfg.field, fldObj = Z._dataset.getField(fldName), text;
			try {
				text = Z._dataset.getFieldTextByRecno(recNo, fldName);
			} catch (e) {
				text = 'error: ' + e.message;
			}
			cellPanel.title = text;
			if (fldObj.urlExpr()) {
				var url = '<a href=' + fldObj.calcUrl();
				var target = fldObj.urlTarget();
				if (target) {
					url += ' target=' + target;
				}
				url += '>' + text + '</a>';
				text = url;
			}
			otext.innerHTML = text;
			Z._showSelected(cellPanel.parentNode, fldName, recNo);
		}
	});
	
	jslet.ui.DBTable.defaultCellRender = new jslet.ui.DefaultCellRender();
	jslet.ui.DBTable.editableCellRender = new jslet.ui.EditableCellRender();
	
	jslet.ui.DBTable.treeCellRender = new jslet.ui.TreeCellRender();
	jslet.ui.DBTable.boolCellRender = new jslet.ui.BoolCellRender();
	jslet.ui.DBTable.sequenceCellRender = new jslet.ui.SequenceCellRender();
	jslet.ui.DBTable.selectCellRender = new jslet.ui.SelectCellRender();
	jslet.ui.DBTable.subgroupCellRender = new jslet.ui.SubgroupCellRender();
	
	/**
	* Splitter: used in jslet.ui.DBTable
	*/
	jslet.ui.Splitter = function () {
		if (!jslet.ui._splitDiv) {
			var odiv = document.createElement('div');
			odiv.className = 'jl-split-column';
			odiv.style.display = 'none';
			jslet.ui._splitDiv = odiv;
			document.body.appendChild(odiv);
			odiv = null;
		}
		
		this.isDragging = false;
		
		this.attach = function (el, left, top, height) {
			if (!height) {
				height = jQuery(el).height();
			}
			var odiv = jslet.ui._splitDiv;
			odiv.style.height = height + 'px';
			odiv.style.left = left + 'px';
			odiv.style.top = top + 'px';
			odiv.style.display = 'block';
			jslet.ui.dnd.bindControl(this);
			this.isDragging = false;
		};
		
		this.unattach = function () {
			jslet.ui._splitDiv.style.display = 'none';
			this.onSplitEnd = null;
			this.onSplitCancel = null;
		};
		
		this.onSplitEnd = null;
		this.onSplitCancel = null;
		
		this._doDragEnd = function (oldX, oldY, x, y, deltaX, deltaY) {
			jslet.ui.dnd.unbindControl();
			if (this.onSplitEnd) {
				this.onSplitEnd(x - oldX);
			}
			this.unattach();
			this.isDragging = false;
		};
		
		this._doDragging = function (oldX, oldY, x, y, deltaX, deltaY) {
			this.isDragging = true;
			jslet.ui._splitDiv.style.left = x + 'px';
		};
		
		this._doDragCancel = function () {
			jslet.ui.dnd.unbindControl();
			if (this.onSplitCancel) {
				this.onSplitCancel();
			}
			this.unattach();
			this.isDragging = false;
		};
	};
	
	jslet.ui.DBTableFilterPanel = function(jqFilterBtn, fldName) {
		var Z = this;
		Z.popupWidth = 200;
		Z.popupHeight = 200;
		Z.fieldName = fldName;
		
		Z.popup = new jslet.ui.PopupPanel();
		Z.popup.onHidePopup = function() {
			Z.jqFilterBtn.focus();
		};
		
	}
	
	jslet.ui.DBTableFilterPanel.prototype = {
		
		showPopup: function (left, top, ajustX, ajustY) {
			var Z = this;
			if (!Z.panel) {
				Z.panel = Z._create();
			}
			Z.popup.setContent(Z.panel, '100%', '100%');
			Z.popup.show(left, top, Z.popupWidth, Z.popupHeight, ajustX, ajustY);
			jQuery(Z.panel).find(".jl-combopnl-head input").focus();
		},
	
		closePopup: function () {
			var Z = this;
			Z.popup.hide();
			var dispCtrl = Z.otree ? Z.otree : Z.otable;
			if(dispCtrl) {
				dispCtrl.dataset().removeLinkedControl(dispCtrl);
			}
		},
		
		_create: function () {
			var Z = this;
			if (!Z.panel) {
				Z.panel = document.createElement('div');
			}
	return Z.panel;
			//process variable
			var fldObj = Z.dataset.getField(Z.field),
				lkfld = fldObj.lookup(),
				pfld = lkfld.parentField(),
				showType = Z.showStyle.toLowerCase(),
				lkds = Z.lookupDs();
	
			var template = ['<div class="jl-combopnl-head"><div class="col-xs-12 jl-nospacing">',
			                '<input class="form-control" type="text" size="20"></input></div></div>',
				'<div class="jl-combopnl-content',
				Z.isMultiple() ? ' jl-combopnl-multiselect': '',
				'"></div>',
				'<div class="jl-combopnl-footer" style="display:none"><button class="jl-combopnl-footer-cancel btn btn-default btn-sm" >',
				jslet.locale.MessageBox.cancel,
				'</button><button class="jl-combopnl-footer-ok btn btn-default btn-sm" >',
				jslet.locale.MessageBox.ok,
				'</button></div>'];
	
			Z.panel.innerHTML = template.join('');
			var jqPanel = jQuery(Z.panel),
				jqPh = jqPanel.find('.jl-combopnl-head');
			jqPanel.on('keydown', function(event){
				if(event.keyCode === 27) {
					Z.closePopup();
				}
			});
			Z.searchBoxEle = jqPh.find('input')[0];
			jQuery(Z.searchBoxEle).on('keydown', jQuery.proxy(Z._findData, Z));
			
			var jqContent = jqPanel.find('.jl-combopnl-content');
			if (Z.isMultiple()) {
				jqContent.addClass('jl-combopnl-content-nofooter').removeClass('jl-combopnl-content-nofooter');
				var pnlFoot = jqPanel.find('.jl-combopnl-footer')[0];
				pnlFoot.style.display = 'block';
				var jqFoot = jQuery(pnlFoot);
				jqFoot.find('.jl-combopnl-footer-cancel').click(jQuery.proxy(Z.closePopup, Z));
				jqFoot.find('.jl-combopnl-footer-ok').click(jQuery.proxy(Z._confirmSelect, Z));
			} else {
				jqContent.addClass('jl-combopnl-content-nofooter');
			}
	
			var contentPanel = jqContent[0];
	
			//create popup content
			if (showType == 'tree') {
				var treeparam = { 
					type: 'DBTreeView', 
					dataset: lkds, 
					readOnly: false, 
					displayFields: lkfld.displayFields(), 
					hasCheckBox: Z.isMultiple()
				};
	
				if (!Z.isMultiple()) {
					treeparam.onItemDblClick = jQuery.proxy(Z._confirmSelect, Z);
				}
				treeparam.correlateCheck = Z.comboSelectObj.correlateCheck();
				window.setTimeout(function(){
					Z.otree = jslet.ui.createControl(treeparam, contentPanel, '100%', '100%');
				}, 1);
			} else {
				var tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, hasSelectCol: Z.isMultiple(), hasSeqCol: false, hasFindDialog: false };
				if (!Z.isMultiple()) {
					tableparam.onRowDblClick = jQuery.proxy(Z._confirmSelect, Z);
				}
				window.setTimeout(function(){
					Z.otable = jslet.ui.createControl(tableparam, contentPanel, '100%', '100%');
				}, 1);
			}
			return Z.panel;
		},
	
		destroy: function(){
			Z.popup = null;
			Z.panel = null;
		}
	};
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbtreeview.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBTreeView. 
	 * Functions:
	 * 1. Perfect performance, you can load unlimited data;
	 * 2. Checkbox on tree node;
	 * 3. Relative check, when you check one tree node, its children and its parent will check too;
	 * 4. Many events for you to customize tree control;
	 * 5. Context menu supported and you can customize your context menu;
	 * 6. Icon supported on each tree node.
	 * 
	 * Example:
	 * <pre><code>
	 *	var jsletParam = { type: "DBTreeView", 
	 *	dataset: "dsAgency", 
	 *	displayFields: "[code]+'-'+[name]",
	 *  keyField: "id", 
	 *	parentField: "parentid",
	 *  hasCheckBox: true, 
	 *	iconClassField: "iconcls", 
	 *	onCreateContextMenu: doCreateContextMenu, 
	 *	correlateCheck: true
	 * };
	 * //1. Declaring:
	 *  &lt;div id="ctrlId" data-jslet="jsletParam">
	 *  or
	 *  &lt;div data-jslet='jsletParam' />
	 *  
	 *  //2. Binding
	 *  &lt;div id="ctrlId"  />
	 *  //Js snippet
	 *	var el = document.getElementById('ctrlId');
	 *  jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 *  jslet.ui.createControl(jsletParam, document.body);
	 *		
	 * </code></pre>
	 */
	jslet.ui.DBTreeView = jslet.Class.create(jslet.ui.DBControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,displayFields,hasCheckBox,correlateCheck,onlyCheckChildren,readOnly,expandLevel,codeField,codeFormat,onItemClick,onItemDblClick,beforeCheckBoxClick,iconClassField,onGetIconClass,onCreateContextMenu';
			Z.requiredProperties = 'displayFields';
			
			/**
			 * {String} Display fields, it's a js expresssion, like: "[code]+'-'+[name]"
			 */
			Z._displayFields = null;
			/**
			 * {Boolean} Identify if there is checkbox on tree node.
			 */
			Z._hasCheckBox = false;
			/**
			 * {Boolean} Checkbox is readonly or not, ignored if hasCheckBox = false
			 */
			Z._readOnly = false;
			
			/**
			 * {Boolean} if true, when you check one tree node, its children and its parent will check too;
			 */
			Z._correlateCheck = false;
			
			Z._onlyCheckChildren = false;
			
			///**
			// * {String} Key field, it will use 'keyField' and 'parentField' to construct tree nodes.
			// */
			//Z._keyField = null;
			///**
			// * {String} Parent field, it will use 'keyField' and 'parentField' to construct tree nodes.
			// */
			//Z._parentField = null;
			/**
			 * {String} If icon class is stored one field, you can set this property to display different tree node icon.
			 */
			Z._iconClassField = null;
			
			/**
			 * {Integer} Identify the nodes which level is from 0 to "expandLevel" will be expanded when initialize tree.
			 */
			Z._expandLevel = -1;
			
			Z._onItemClick = null;
			
			Z._onItemDblClick = null;
	
			Z._beforeCheckBoxClick = null;
			
			/**
			 * {Event} You can use this event to customize your tree node icon flexibly.
			 * Pattern: 
			 *   function(keyValue, level, isLeaf){}
			 *   //keyValue: String, key value of tree node;
			 *   //level: Integer, tree node level;
			 *   //isLeaf: Boolean, Identify if the tree node is the leaf node.
			 */
			Z._onGetIconClass = null;
			
			Z._onCreateContextMenu = null;
			
			Z.iconWidth = null;
			
			$super(el, params);
		},
		
		//keyField: function(keyField) {
		//	if(keyField === undefined) {
		//		return this._keyField;
		//	}
		//	keyField = jQuery.trim(keyField);
		//		jslet.Checker.test('DBTreeView.keyField', keyField).required().isString();
		//	this._keyField = keyField;
		//},
		//
		//parentField: function(parentField) {
		//	if(parentField === undefined) {
		//		return this._parentField;
		//	}
		//	parentField = jQuery.trim(parentField);
		//		jslet.Checker.test('DBTreeView.parentField', parentField).required().isString();
		//	this._parentField = parentField;
		//},
		//
		displayFields: function(displayFields) {
			if(displayFields === undefined) {
				return this._displayFields;
			}
			displayFields = jQuery.trim(displayFields);
			jslet.Checker.test('DBTreeView.displayFields', displayFields).required().isString();
			this._displayFields = displayFields;
		},
		
		iconClassField: function(iconClassField) {
			if(iconClassField === undefined) {
				return this._iconClassField;
			}
			iconClassField = jQuery.trim(iconClassField);
			jslet.Checker.test('DBTreeView.iconClassField', iconClassField).isString();
			this._iconClassField = iconClassField;
		},
		
		hasCheckBox: function(hasCheckBox) {
			if(hasCheckBox === undefined) {
				return this._hasCheckBox;
			}
			this._hasCheckBox = hasCheckBox ? true: false;
		},
		
		correlateCheck: function(correlateCheck) {
			if(correlateCheck === undefined) {
				return this._correlateCheck;
			}
			this._correlateCheck = correlateCheck ? true: false;
		},
		
		onlyCheckChildren: function(onlyCheckChildren) {
			if(onlyCheckChildren === undefined) {
				return this._onlyCheckChildren;
			}
			this._onlyCheckChildren = onlyCheckChildren ? true: false;
		},
		
		readOnly: function(readOnly) {
			if(readOnly === undefined) {
				return this._readOnly;
			}
			this._readOnly = readOnly ? true: false;
		},
		
		expandLevel: function(expandLevel) {
			if(expandLevel === undefined) {
				return this._expandLevel;
			}
			jslet.Checker.test('DBTreeView.expandLevel', expandLevel).isGTEZero();
			this._expandLevel = parseInt(expandLevel);
		},
		
		onItemClick: function(onItemClick) {
			if(onItemClick === undefined) {
				return this._onItemClick;
			}
			jslet.Checker.test('DBTreeView.onItemClick', onItemClick).isFunction();
			this._onItemClick = onItemClick;
		},
		
		onItemDblClick: function(onItemDblClick) {
			if(onItemDblClick === undefined) {
				return this._onItemDblClick;
			}
			jslet.Checker.test('DBTreeView.onItemDblClick', onItemDblClick).isFunction();
			this._onItemDblClick = onItemDblClick;
		},
		
		beforeCheckBoxClick: function(beforeCheckBoxClick) {
			if(beforeCheckBoxClick === undefined) {
				return this._beforeCheckBoxClick;
			}
			jslet.Checker.test('DBTreeView.beforeCheckBoxClick', beforeCheckBoxClick).isFunction();
			this._beforeCheckBoxClick = beforeCheckBoxClick;
		},
		
		onGetIconClass: function(onGetIconClass) {
			if(onGetIconClass === undefined) {
				return this._onGetIconClass;
			}
			jslet.Checker.test('DBTreeView.onGetIconClass', onGetIconClass).isFunction();
			this._onGetIconClass = onGetIconClass;
		},
		
		onCreateContextMenu: function(onCreateContextMenu) {
			if(onCreateContextMenu === undefined) {
				return this._onCreateContextMenu;
			}
			jslet.Checker.test('DBTreeView.onCreateContextMenu', onCreateContextMenu).isFunction();
			this._onCreateContextMenu = onCreateContextMenu;
		},
		
		/**
			 * @override
			 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
		
		/**
		 * @override
		 */
		bind: function () {
			var Z = this,
				jqEl = jQuery(Z.el);
			Z.scrBarSize = jslet.scrollbarSize() + 1;
			
			if (Z._keyField === undefined) {
				Z._keyField = Z._dataset.keyField();
			}
			var ti = jqEl.attr('tabindex');
			if (Z._readOnly && !ti) {
				jqEl.attr('tabindex', 0);
			}
			jqEl.keydown(function(event){
				if (Z._doKeydown(event.which)) {
					event.preventDefault();
				}
			});
			jqEl.on('mouseenter', 'td.jl-tree-text', function(event){
				jQuery(this).addClass('jl-tree-nodes-hover');
			});
			jqEl.on('mouseleave', 'td.jl-tree-text', function(event){
				jQuery(this).removeClass('jl-tree-nodes-hover');
			});
			if (!jqEl.hasClass('jl-tree')) {
				jqEl.addClass('jl-tree');
			}
			Z.renderAll();
			Z.refreshControl(jslet.data.RefreshEvent.scrollEvent(this._dataset.recno()));
			Z._createContextMenu();		
			jslet.resizeEventBus.subscribe(Z);
		}, // end bind
		
		/**
		 * @override
		*/
		renderAll: function () {
			var Z = this,
				jqEl = jQuery(Z.el);
			Z.evaluator = new jslet.Expression(Z._dataset, Z._displayFields);
			
			jqEl.html('');
			Z.oldWidth = jqEl.width();
			Z.oldHeight = jqEl.height();
			Z.nodeHeight = Z.iconWidth =  parseInt(jslet.ui.getCssValue('jl-tree', 'line-height'));
			Z.treePanelHeight = jqEl.height();
			Z.treePanelWidth = jqEl.width();
			Z.nodeCount = Math.floor(Z.treePanelHeight / Z.nodeHeight);
	
			Z._initVm();
			Z._initFrame();
		}, // end renderAll
		
		_initFrame: function(){
			var Z = this,
				jqEl = jQuery(Z.el);
				
			jqEl.find('.jl-tree-container').off();
			jqEl.find('.jl-tree-scrollbar').off();
				
			var lines = [];
			for(var i = 0; i < 5; i++){//Default cells for lines is 5
				lines.push('<td class="jl-tree-lines" ');
				lines.push(jslet.ui.DBTreeView.NODETYPE);
				lines.push('="0"></td>');
			}
			var s = lines.join(''),
				tmpl = ['<table border="0" cellpadding="0" cellspacing="0" style="table-layout:fixed;width:100%;height:100%"><tr><td style="vertical-align:top"><div class="jl-tree-container">'];
			for(var i = 0, cnt = Z.nodeCount; i < cnt; i++){
				tmpl.push('<table class="jl-tree-nodes" cellpadding="0" cellspacing="0"><tr>');
				tmpl.push(s);
				tmpl.push('<td class="jl-tree-expander" ');
				tmpl.push(jslet.ui.DBTreeView.NODETYPE);//expander
				tmpl.push('="1"></td><td ');
				tmpl.push(jslet.ui.DBTreeView.NODETYPE);//checkbox
				tmpl.push('="2"></td><td ');
				tmpl.push(jslet.ui.DBTreeView.NODETYPE);//icon
				tmpl.push('="3"></td><td class="jl-tree-text" ');
				tmpl.push(jslet.ui.DBTreeView.NODETYPE);//text
				tmpl.push('="9" nowrap="nowrap"></td></tr></table>');
			}
			tmpl.push('</div></td><td class="jl-tree-scroll-col"><div class="jl-tree-scrollbar"><div class="jl-tree-tracker"></div></div></td></tr></table>');
			jqEl.html(tmpl.join(''));
			
			var treePnl = jqEl.find('.jl-tree-container');
			treePnl.on('click', function(event){
				Z._doRowClick(event.target);
			});
			treePnl.on('dblclick', function(event){
				Z._doRowDblClick(event.target);
			});
			Z.listvm.setVisibleCount(Z.nodeCount);
			var sb = jqEl.find('.jl-tree-scrollbar');
			
			sb.on('scroll',function(){
				var numb=Math.floor(this.scrollTop/Z.nodeHeight);
				if (numb!=Z.listvm.getVisibleStartRow()){
					Z._skip_ = true;
					try {
						Z.listvm.setVisibleStartRow(numb);
					} finally {
						Z._skip_ = false;
					}
				}
			});	
		},
		
		resize: function(){
			var Z = this,
				jqEl = jQuery(Z.el),
				height = jqEl.height(),
				width = jqEl.width();
			if (width != Z.oldWidth){
				Z.oldWidth = width;
				Z.treePanelWidth = jqEl.innerWidth();
				Z._fillData();
			}
			if (height != Z.oldHeight){
				Z.oldHeight = height;
				Z.treePanelHeight = jqEl.innerHeight();
				Z.nodeCount = Math.floor(height / Z.nodeHeight) - 1;
				Z._initFrame();
			}
		},
		
		hasChildren: function() {
			return this.listvm.hasChildren();
		},
		
		_initVm:function(){
			var Z=this;
			Z.listvm = new jslet.ui.ListViewModel(Z._dataset, true);
			Z.listvm.refreshModel(Z._expandLevel);
			Z.listvm.fixedRows=0;
			
			Z.listvm.onTopRownoChanged=function(rowno){
				var rowno = Z.listvm.getCurrentRowno();
				Z._fillData();
				Z._doCurrentRowChanged(rowno);
				Z._syncScrollBar(rowno);
			};
			
			Z.listvm.onVisibleCountChanged=function(){
				Z._fillData();
				var allCount = Z.listvm.getNeedShowRowCount();
				jQuery(Z.el).find('.jl-tree-tracker').height(Z.nodeHeight * allCount);
			};
			
			Z.listvm.onCurrentRownoChanged=function(prevRowno, rowno){
				Z._doCurrentRowChanged(rowno);
			};
			
			Z.listvm.onNeedShowRowsCountChanged = function(allCount){
				Z._fillData();
				jQuery(Z.el).find('.jl-tree-tracker').height(Z.nodeHeight * (allCount + 2));
			};
			
			Z.listvm.onCheckStateChanged = function(){
				Z._fillData();
			};
		},
		
		_doKeydown: function(keyCode){
			var Z = this, result = false;
			if (keyCode == 32){//space
				Z._doCheckBoxClick();
				result = true;
			} else if (keyCode == 38) {//KEY_UP
				Z.listvm.priorRow();
				result = true;
			} else if (keyCode == 40) {//KEY_DOWN
				Z.listvm.nextRow();
				result = true;
			} else if (keyCode == 37) {//KEY_LEFT
				if (jslet.locale.isRtl) {
					Z.listvm.expand();
				} else {
					Z.listvm.collapse();
				}
				result = true;
			} else if (keyCode == 39) {//KEY_RIGHT
				if (jslet.locale.isRtl) {
					Z.listvm.collapse();
				} else {
					Z.listvm.expand();
				}
				result = true;
			} else if (keyCode == 33) {//KEY_PAGEUP
				Z.listvm.priorPage();
				result = true;
			} else if (keyCode == 34) {//KEY_PAGEDOWN
				Z.listvm.nextPage();
				result = true;
			}
			return result;
		},
		
		_getTrByRowno: function(rowno){
			var nodes = jQuery(this.el).find('.jl-tree-nodes'), row;
			for(var i = 0, cnt = nodes.length; i < cnt; i++){
				row = nodes[i].rows[0];
				if (row.jsletrowno == rowno) {
					return row;
				}
			}
			return null;
		},
		
		_doCurrentRowChanged: function(rowno){
			var Z = this;
			if (Z.prevRow){
				jQuery(Z._getTextTd(Z.prevRow)).removeClass(jslet.ui.htmlclass.TREENODECLASS.selected);
			}
			var otr = Z._getTrByRowno(rowno);
			if (otr) {
				jQuery(Z._getTextTd(otr)).addClass(jslet.ui.htmlclass.TREENODECLASS.selected);
			}
			Z.prevRow = otr;
		},
		
		_getTextTd: function(otr){
			return otr.cells[otr.cells.length - 1];
		},
		
		_doExpand: function(){
			this.expand();
		},
		
		_doRowClick: function(node){
			var Z = this,
				nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
			if(!nodeType) {
				return;
			}
			if (nodeType != '0') {
				Z._syncToDs(node);
			}
			if (nodeType == '1' || nodeType == '2'){ //expander
				var item = Z.listvm.getCurrentRow();
				if (nodeType == '1' && item.children && item.children.length > 0){
					if (item.expanded) {
						Z.collapse();
					} else {
						Z.expand();
					}
				}
				if (nodeType == '2'){//checkbox
					Z._doCheckBoxClick();
				}
			}
			if(nodeType == '9' && Z._onItemClick) {
				Z._onItemClick.call(Z);
			}
		},
		
		_doRowDblClick: function(node){
			this._syncToDs(node);
			var nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
			if (this._onItemDblClick && nodeType == '9') {
				this._onItemDblClick.call(this);
			}
		},
		
		_doCheckBoxClick: function(){
			var Z = this;
			if (Z._readOnly) {
				return;
			}
			if (Z._beforeCheckBoxClick && !Z._beforeCheckBoxClick.call(Z)) {
				return;
			}
			var node = Z.listvm.getCurrentRow();
			Z.listvm.checkNode(!node.state? 1:0, Z._correlateCheck, Z._onlyCheckChildren);
		},
		
		_syncToDs: function(otr){
			var rowno = -1, k;
			while(true){
				k = otr.jsletrowno;
				if (k === 0 || k){
					rowno = k;
					break;
				}
				otr = otr.parentNode;
				if (!otr) {
					break;
				}
			}
			if (rowno < 0) {
				return;
			}
			this.listvm.setCurrentRowno(rowno);
			this._dataset.recno(this.listvm.getCurrentRecno());
		},
		
		_fillData: function(){
			var Z = this,
				vCnt = Z.listvm.getVisibleCount(), 
				topRowno = Z.listvm.getVisibleStartRow(),
				allCnt = Z.listvm.getNeedShowRowCount(),
				availbleCnt = vCnt + topRowno,
				index = 0,
				jqEl = jQuery(Z.el),
				nodes = jqEl.find('.jl-tree-nodes'), node;
			if (Z._isRendering) {
				return;
			}
	
			Z._isRendering = true;
			Z._skip_ = true;
			var oldRecno = Z._dataset.recnoSilence(),
				preRowNo = Z.listvm.getCurrentRowno(),
				ajustScrBar = true, maxNodeWidth = 0, nodeWidth;
			try{
				if (allCnt < availbleCnt){
					for(var i = availbleCnt - allCnt; i > 0; i--){
						node = nodes[vCnt - i];
						node.style.display = 'none';
					}
					ajustScrBar = false; 
				} else {
					allCnt = availbleCnt;
				}
				var endRow = allCnt - 1;
				
				for(var k = topRowno; k <= endRow; k++){
					node = nodes[index++];
					nodeWidth = Z._fillNode(node, k);
					if (ajustScrBar && maxNodeWidth < Z.treePanelWidth){
						if (k == endRow && nodeWidth < Z.treePanelWidth) {
							ajustScrBar = false;
						} else {
							maxNodeWidth = Math.max(maxNodeWidth, nodeWidth);
						}
					}
					if (k == endRow && ajustScrBar){
						node.style.display = 'none';
					} else {
						node.style.display = '';
						node.jsletrowno = k;
					}
				}
				var sb = jqEl.find('.jl-tree-scrollbar');
				if (ajustScrBar) {
					sb.height(Z.treePanelHeight - Z.scrBarSize - 2);
				} else {
					sb.height(Z.treePanelHeight - 2);
				}
			} finally {
				Z.listvm.setCurrentRowno(preRowNo, false);
				Z._dataset.recnoSilence(oldRecno);
				Z._isRendering = false;
				Z._skip_ = false;
			}
		},
	
		_getCheckClassName: function(expanded){
			if (!expanded) {
				return jslet.ui.htmlclass.TREECHECKBOXCLASS.unChecked;
			}
			if (expanded == 2) { //mixed checked
				return jslet.ui.htmlclass.TREECHECKBOXCLASS.mixedChecked;
			}
			return jslet.ui.htmlclass.TREECHECKBOXCLASS.checked;
		},
		
		_fillNode: function(node, rowNo){
			var row = node.rows[0],
				Z = this,
				item = Z.listvm.setCurrentRowno(rowNo, true),
				cells = row.cells, 
				cellCnt = cells.length, 
				requiredCnt = item.level + 4,
				otd;
			Z._dataset.recnoSilence(Z.listvm.getCurrentRecno());
			row.jsletrowno = rowNo;
			if (cellCnt < requiredCnt){
				for(var i = 1, cnt = requiredCnt - cellCnt; i <= cnt; i++){
					otd = row.insertCell(0);
					jQuery(otd).addClass('jl-tree-lines').attr('jsletline', 1);
				}
			}
			if (cellCnt >= requiredCnt){
				for( var i = 0, cnt = cellCnt - requiredCnt; i < cnt; i++){
					cells[i].style.display = 'none';
				}
				for(var i = cellCnt - requiredCnt; i < requiredCnt; i++){
					cells[i].style.display = '';
				}
			}
			cellCnt = cells.length;
			//Line
			var pitem = item, k = 1, totalWidth = Z.iconWidth * item.level;
			for(var i = item.level; i >0; i--){
				otd = row.cells[cellCnt- 4 - k++];
				pitem = pitem.parent;
				if (pitem.islast) {
					otd.className = jslet.ui.htmlclass.TREELINECLASS.empty;
				} else {
					otd.className = jslet.ui.htmlclass.TREELINECLASS.line;
				}
			}
	
			//expander
			var oexpander = row.cells[cellCnt- 4];
			oexpander.noWrap = true;
			oexpander.style.display = '';
			if (item.children && item.children.length > 0) {
				if (!item.islast) {
					oexpander.className = item.expanded ? jslet.ui.htmlclass.TREELINECLASS.minus : jslet.ui.htmlclass.TREELINECLASS.plus;
				} else {
					oexpander.className = item.expanded ? jslet.ui.htmlclass.TREELINECLASS.minusBottom : jslet.ui.htmlclass.TREELINECLASS.plusBottom;
				}
			} else {
				if (!item.islast) {
					oexpander.className = jslet.ui.htmlclass.TREELINECLASS.join;
				} else {
					oexpander.className = jslet.ui.htmlclass.TREELINECLASS.joinBottom;
				}
			}
			totalWidth += Z.iconWidth;
					
			// CheckBox
			var flag = Z._hasCheckBox && Z._dataset.checkSelectable();
			var ocheckbox = row.cells[cellCnt- 3];
			if (flag) {
				ocheckbox.noWrap = true;
				ocheckbox.className = Z._getCheckClassName(Z._dataset.selected());
				ocheckbox.style.display = '';
				totalWidth += Z.iconWidth;
			} else {
				ocheckbox.style.display = 'none';
			}
			//Icon
			var oicon = row.cells[cellCnt- 2],
				clsName = 'jl-tree-icon',
				iconClsId = null;
	
			if(Z._iconClassField || Z._onGetIconClass) {
				if(Z._iconClassField) {
					iconClsId = Z._dataset.getFieldValue(Z._iconClassField);
				} else if (Z._onGetIconClass) {
					var isLeaf = !(item.children && item.children.length > 0);
					iconClsId = Z._onGetIconClass.call(Z, Z._dataset.keyValue(), item.level, isLeaf); //keyValue, level, isLeaf
				}
				if (iconClsId) {
								clsName += ' '+ iconClsId;
				}
				if (oicon.className != clsName) {
					oicon.className = clsName;
				}
				oicon.style.display = '';
				totalWidth += Z.iconWidth;
			} else {
				oicon.style.display = 'none';
			}
			//Text
			var text = Z.evaluator.eval() || '      ';
			jslet.ui.textMeasurer.setElement(Z.el);
			var width = Math.round(jslet.ui.textMeasurer.getWidth(text)) + text.length * 4;
			totalWidth += width + 10;
			//node.style.width = totalWidth + 'px';
			jslet.ui.textMeasurer.setElement();
			var otd = row.cells[cellCnt- 1];
			otd.style.width = width + 'px';
			var jqTd = jQuery(otd);
			jqTd.html(text);
			if (item.isbold) {
				jqTd.addClass('jl-tree-child-checked');
			} else {
				jqTd.removeClass('jl-tree-child-checked');
			}
			return totalWidth;
		},
			
		_updateCheckboxState: function(){
			var Z = this, 
				oldRecno = Z._dataset.recnoSilence(),
				jqEl = jQuery(Z.el),
				nodes = jqEl.find('.jl-tree-nodes'),
				rowNo, cellCnt, row;
			try{
				for(var i = 0, cnt = nodes.length; i < cnt; i++){
					row = nodes[i].rows[0];
					cellCnt = row.cells.length;
		
					rowNo = row.jsletrowno;
					if(rowNo) {
						Z.listvm.setCurrentRowno(rowNo, true);
						Z._dataset.recnoSilence(Z.listvm.getCurrentRecno());
						row.cells[cellCnt- 3].className = Z._getCheckClassName(Z._dataset.selected());
					}
				}
			} finally {
				Z._dataset.recnoSilence(oldRecno);
			}
		},
		
		_syncScrollBar: function(){
			var Z = this;
			if (Z._skip_) {
				return;
			}
			jQuery(Z.el).find('.jl-tree-scrollbar').scrollTop(Z.nodeHeight * Z.listvm.getVisibleStartRow());
		},
			
		expand: function () {
			this.listvm.expand();
		},
		
		collapse: function () {
			this.listvm.collapse();
		},
		
		expandAll: function () {
			this.listvm.expandAll();
		},
		
		collapseAll: function () {
			this.listvm.collapseAll();
		},
		
		_createContextMenu: function () {
			if (!jslet.ui.Menu) {
				return;
			}
			var Z = this;
			var menuCfg = { type: 'Menu', onItemClick: Z._menuItemClick, items: [
				{ id: 'expandAll', name: jslet.locale.DBTreeView.expandAll },
				{ id: 'collapseAll', name: jslet.locale.DBTreeView.collapseAll}]
			};
			if (Z._hasCheckBox && !Z._correlateCheck) {
				menuCfg.items.push({ name: '-' });
				menuCfg.items.push({ id: 'checkAll', name: jslet.locale.DBTreeView.checkAll });
				menuCfg.items.push({ id: 'uncheckAll', name: jslet.locale.DBTreeView.uncheckAll });
			}
			if (Z._onCreateContextMenu) {
				Z._onCreateContextMenu.call(Z, menuCfg.items);
			}
			if (menuCfg.items.length === 0) {
				return;
			}
			Z.contextMenu = jslet.ui.createControl(menuCfg);
			jQuery(Z.el).on('contextmenu', function (event) {
				var node = event.target,
					nodeType = node.getAttribute(jslet.ui.DBTreeView.NODETYPE);
				if(!nodeType || nodeType == '0') {
					return;
				}
				Z._syncToDs(node);
				Z.contextMenu.showContextMenu(event, Z);
			});
		},
		
		_menuItemClick: function (menuid, checked) {
			if (menuid == 'expandAll') {
				this.expandAll();
			} else if (menuid == 'collapseAll') {
				this.collapseAll();
			} else if (menuid == 'checkAll') {
				this.listvm.checkChildNodes(true, this._correlateCheck);
			} else if (menuid == 'uncheckAll') {
				this.listvm.checkChildNodes(false, this._correlateCheck);
			}
		},
		
		refreshControl: function (evt) {
			var Z = this,
				evtType = evt.eventType;
			if (evtType == jslet.data.RefreshEvent.CHANGEMETA) {
				//empty
			} else if (evtType == jslet.data.RefreshEvent.UPDATEALL ||
				evtType == jslet.data.RefreshEvent.INSERT ||
				evtType == jslet.data.RefreshEvent.DELETE){
				Z.listvm.refreshModel();
				if(evtType == jslet.data.RefreshEvent.INSERT) {
					Z.listvm.syncDataset();
				}
			} else if (evtType == jslet.data.RefreshEvent.UPDATERECORD ||
				evtType == jslet.data.RefreshEvent.UPDATECOLUMN){
				Z._fillData();
			} else if (evtType == jslet.data.RefreshEvent.SELECTALL || 
				evtType == jslet.data.RefreshEvent.SELECTRECORD) {
				if (Z._hasCheckBox) {
					Z._updateCheckboxState();
				}
			} else if (evtType == jslet.data.RefreshEvent.SCROLL) {
				Z.listvm.syncDataset();
			}
		}, // end refreshControl
			
		/**
		 * Run when container size changed, it's revoked by jslet.resizeeventbus.
		 * 
		 */
		checkSizeChanged: function(){
			this.resize();
		},
	
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this,
				jqEl = jQuery(Z.el);
			
			jslet.resizeEventBus.unsubscribe(Z);
			jqEl.find('.jl-tree-nodes').off();
			Z.listvm.destroy();
			Z.listvm = null;
			Z.prevRow = null;
			
			$super();
		}
	});
	
	jslet.ui.htmlclass.TREELINECLASS = {
			line : 'jl-tree-lines jl-tree-line',// '|'
			join : 'jl-tree-lines jl-tree-join',// |-
			joinBottom : 'jl-tree-lines jl-tree-join-bottom',// |_
			minus : 'jl-tree-lines jl-tree-minus',// O-
			minusBottom : 'jl-tree-lines jl-tree-minus-bottom',// o-_
			noLineMinus : 'jl-tree-lines jl-tree-noline-minus',// o-
			plus : 'jl-tree-lines jl-tree-plus',// o+
			plusBottom : 'jl-tree-lines jl-tree-plus-bottom',// o+_
			noLinePlus : 'jl-tree-lines jl-tree-noline-plus',// o+
			empty : 'jl-tree-empty'
	};
	jslet.ui.htmlclass.TREECHECKBOXCLASS = {
	//		checkbox : 'jl-tree-checkbox',
		checked : 'jl-tree-checkbox jl-tree-checked',
		unChecked : 'jl-tree-checkbox jl-tree-unchecked',
		mixedChecked : 'jl-tree-checkbox jl-tree-mixedchecked'
	};
	
	jslet.ui.htmlclass.TREENODECLASS = {
		selected : 'jl-tree-selected',
		childChecked : 'jl-tree-child-checked',
		treeNodeLevel : 'jl-tree-child-level'
	};
	
	jslet.ui.DBTreeView.NODETYPE = 'data-nodetype';
	
	jslet.ui.register('DBTreeView', jslet.ui.DBTreeView);
	jslet.ui.DBTreeView.htmlTemplate = '<div></div>';
	
	
	
	/* ========================================================================
	 * Jslet framework: jslet.listviewmodel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * Inner Class for DBTable and DBTreeView control
	 */
	jslet.ui.ListViewModel = function (dataset, isTree) {// boolean, identify if it's tree model
		var visibleCount = 0,
			visibleStartRow = 0,
			visibleEndRow = 0,
			needShowRows = null,//Array of all rows that need show, all of these rows's status will be 'expanded'
			allRows = null,//Array of all rows, include 'expanded' and 'collapsed' rows
			currentRowno = 0,
			currentRecno = 0;
		this.onTopRownoChanged = null; //Event handler: function(rowno){}
		this.onVisibleCountChanged = null; //Event handler: function(visibleRowCount){}
		this.onCurrentRownoChanged = null; //Event handler: function(rowno){}
		this.onNeedShowRowsCountChanged = null; //Event handler: function(needShowCount){}
		this.onCheckStateChanged = null;  //Event handler: function(){}
			
		this.fixedRows = 0;
		var initial = function () {
			if (!isTree) {
				return false;
			}
			var ds = dataset;
			if (!ds._parentField || !ds._keyField) {
				return false;
			}
			return true;
		};
		initial();
			
		this.refreshModel = function (expandLevel) {
			if (!isTree) {
				return;
			}
			if(expandLevel === undefined) {
				expandLevel = -1;
			}
			var ds = dataset, 
				hiddenCnt = 0, 
				recno, 
				allCnt = ds.recordCount(), 
				childCnt, 
				result = [], 
				pId,
				oldRecno = ds.recnoSilence();
			try {
				ds.recnoSilence(this.fixedRows);
				var level = 0, 
					pnodes = [], 
					node, pnode, 
					tmpNode, tmpKeyValue,
					currRec, state;
				for(var recno = 0, recCnt = ds.recordCount(); recno < recCnt; recno++) {
					ds.recnoSilence(recno);
					keyValue = ds.keyValue();
					level = 0;
					pnode = null;
					pId = ds.parentValue();
					for(var m = pnodes.length - 1; m>=0; m--) {
						tmpNode = pnodes[m];
						tmpKeyValue = tmpNode.keyvalue; 
						if (tmpKeyValue !== null && 
							tmpKeyValue !== undefined && 
							tmpKeyValue !== '' && 
							tmpKeyValue == pId) {
							level = tmpNode.level + 1;
							pnode = tmpNode;
							break;
						}
					}
					if (pnode){
						for(var k = pnodes.length - 1; k > m; k--) {
							pnodes.pop();
						}
					}
					currRec = ds.getRecord();
					state = ds.selected();
					if (!state) {
						state = 0;
					}
					var expanded = true;
					if(expandLevel >= 0 && level <= expandLevel) {
						expanded = true;
					} else { 
						expanded = ds.expanded();
					}
					node = { parent: pnode, recno: recno, keyvalue: keyValue, expanded: expanded, state: state, isbold: 0, level: level };
					pnodes.push(node);
									
					if (pnode){
						if (!pnode.children) {
							pnode.children = [];
						}
						pnode.children.push(node);
						this._updateParentNodeBoldByChecked(node);
					} else {
						result.push(node);
					}
					
				} //end for recno
			} finally {
				ds.recnoSilence(oldRecno);
			}
			allRows = result;
			this._setLastFlag(result);
			this._refreshNeedShowRows();
		};
			
		this._updateParentNodeBoldByChecked = function(node){
			if (!node.state || !node.parent) {
				return;
			}
			var pnode = node.parent;
			while(true){
				if (pnode.isbold) {
					return;
				}
				pnode.isbold = 1;
				pnode = pnode.parent;
				if (!pnode) {
					return;
				}
			}
		};
	
		this._updateParentNodeBoldByNotChecked = function(node){
			if (node.state || !node.parent) {
				return;
			}
			var pnode = node.parent, cnode;
			while(true){
				if (pnode.children){
					for(var i = 0, cnt = pnode.children.length; i < cnt; i++){
						cnode = pnode.children[i];
						if (cnode.state) {
							return;
						}
					}
					pnode.isbold = 0;
				}
				pnode = pnode.parent;
				if (!pnode) {
					return;
				}
			}
		};
			
		this._setLastFlag = function (nodes) {
			if (!nodes || nodes.length === 0) {
				return;
			}
			var node;
			nodes[nodes.length - 1].islast = true;
			for (var i = 0, cnt = nodes.length; i < cnt; i++) {
				node = nodes[i];
				if (node.children && node.children.length > 0) {
					this._setLastFlag(node.children);
				}
			}
			return null;
		};
		
		this._refreshNeedShowRows = function (notFireChangedEvent) {
			if (!isTree) {
				return;
			}
			var result = [], node;
			if (!allRows) {
				this.refreshModel();
				return;
			}
			var preCnt = needShowRows ? needShowRows.length: 0;
			needShowRows = [];
			this._findVisibleNode(allRows);
			var currCnt = needShowRows.length;
			if (!notFireChangedEvent && this.onNeedShowRowsCountChanged){
				this.onNeedShowRowsCountChanged(currCnt);
			}
		};
		
		this.hasChildren = function (recno) {
			if (!isTree) {
				return false;
			}
			if (!recno) {
				recno = dataset.recno();
			}
			var node = this._innerFindNode(allRows, recno);
			if (node === null) {
				return;
			}
			return node.children && node.children.length > 0;
		};
		
		this.getLevel = function (recno) {
			if (!isTree) {
				return false;
			}
			if (!recno) {
				recno = dataset.recno();
			}
			var node = this._innerFindNode(allRows, recno);
			if (node === null) {
				return;
			}
			return node.level;
		};
		
		this._findVisibleNode = function (nodes) {
			if (!nodes) {
				return;
			}
			var node;
			for (var i = 0, cnt = nodes.length; i < cnt; i++) {
				node = nodes[i];
				needShowRows.push(node);
				if (node.expanded){
					this._findVisibleNode(node.children);
				}
			}
		};
		
		this.rownoToRecno = function (rowno) {
			if (!isTree) {
				return rowno + this.fixedRows;
			}
			if (rowno < 0) {
				rowno = rowno + this.fixedRows;
				return rowno >= 0 ? rowno : -1;
			}
			if (rowno >= needShowRows.length) {
				return -1;
			}
			return needShowRows[rowno].recno;
		};
		
		this.recnoToRowno = function (recno) {
			if (!isTree) {
				return recno - this.fixedRows;
			}
			for(var i = 0, cnt = needShowRows.length; i < cnt; i++){
				if (needShowRows[i].recno == recno) {
					return i;
				}
			}
			return -1;
		};
		
		this.setVisibleStartRow = function (rowno, notFireEvt) {
			if (rowno >= 0) {
				var maxVisibleNo = this.getNeedShowRowCount() - visibleCount;
				if (rowno > maxVisibleNo) {
					rowno = maxVisibleNo;
				}
			}
			if (rowno < 0) {
				rowno = 0;
			}
			if (visibleStartRow == rowno) {
				return;
			}
			visibleStartRow = rowno;
			visibleEndRow = rowno + visibleCount - 1;
			if (!notFireEvt && this.onTopRownoChanged) {
				this.onTopRownoChanged(rowno);
			}
		};
		
		this.getVisibleStartRow = function () {
			return visibleStartRow;
		};
		
		this.setVisibleEndRow = function(endRow){
			visibleEndRow = endRow;
		};
		
		this.getVisibleEndRow = function(){
			return visibleEndRow;
		};
		
		this.setVisibleCount = function (count, notFireEvt) {
			if (visibleCount == count) {
				return;
			}
			visibleCount = count;
			visibleEndRow = visibleStartRow + count - 1;
			if (!notFireEvt && this.onVisibleCountChanged) {
				this.onVisibleCountChanged(count);
			}
		};
		
		this.getVisibleCount = function () {
			return visibleCount;
		};
		
		this.getNeedShowRowCount = function () {
			if (!isTree) {
				return dataset.recordCount()- this.fixedRows;
			}
			return needShowRows.length;
		};
		
		this.getCurrentRow = function(){
			return needShowRows[currentRowno];
		};
		
		this.skipSetCurrentRowno = function() {
			this._skipSetCurrentRowno = true;
		};
		
		this.setCurrentRowno = function (rowno, notFireEvt, checkVisible) {
			if(this._skipSetCurrentRowno) {
				this._skipSetCurrentRowno = false;
				return null;
			}
			if(rowno === undefined) {
				return null;
			}
			var preRowno = currentRowno, recno = 0, currRow=null;
			if (rowno < 0){//In the fixed row area
				var lowestRowno = -1 * this.fixedRows;
				if (rowno < lowestRowno) {
					rowno = lowestRowno;
				}
				recno = this.fixedRows + rowno;
			} else {
				var maxRow = this.getNeedShowRowCount();
				if(maxRow === 0) {
					return null;
				}
				if (rowno >= maxRow) {
					rowno = maxRow - 1;
				}
				if (!isTree) {
					recno = rowno + this.fixedRows;
				} else {
					currRow = needShowRows[rowno];
					recno = currRow.recno;
				}
				if (checkVisible) {
					if (rowno >= 0 && rowno < visibleStartRow){
						this.setVisibleStartRow(rowno);
					} else {
						if (rowno >= visibleStartRow + visibleCount) {
							this.setVisibleStartRow(rowno - visibleCount + 1);
						}
					}
				}
			}
	//		if (recno >= 0){
	//			if(!dataset.recno(recno)) {
	//				return null;
	//			}
	//		}
			currentRowno = rowno;
			currentRecno = recno;
			if (!notFireEvt && this.onCurrentRownoChanged) {
				this.onCurrentRownoChanged(preRowno, currentRowno);
			}
			return currRow;
		};
		
		this.getCurrentRowno = function () {
			return currentRowno;
		};
		
		this.getCurrentRecno = function() {
			return currentRecno;
		};
		
		this.nextRow = function () {
			dataset.confirm();
			this.setCurrentRowno(currentRowno + 1, false, true);
		};
		
		this.priorRow = function (num) {
			dataset.confirm();
			this.setCurrentRowno(currentRowno - 1, false, true);
		};
		
		this.nextPage = function () {
			dataset.confirm();
			this.setVisibleStartRow(visibleStartRow + visibleCount);
			this.setCurrentRowno(visibleStartRow);
		};
		
		this.priorPage = function () {
			dataset.confirm();
			this.setVisibleStartRow(visibleStartRow - visibleCount);
			this.setCurrentRowno(visibleStartRow);
		};
		
		this._innerFindNode = function (nodes, recno) {
			var node, nextNode;
			for (var i = 0, cnt = nodes.length - 1; i <= cnt; i++) {
				node = nodes[i];
				if (node.recno == recno) {
					return node;
				}
				if (node.children) {
					var result = this._innerFindNode(node.children, recno);
					if (result) {
						return result;
					}
				}
			}
			return null;
		};
		
		this.expand = function (callbackFn) {
			if (!isTree) {
				return;
			}
			var node = this._innerFindNode(allRows, dataset.recno());
			if (node === null) {
				return;
			}
			dataset.confirm();
			var oldRecno = dataset.recnoSilence();
			try {
				node.expanded = node.children ? true : false;
				dataset.recnoSilence(node.recno);
				dataset.expanded(node.expanded);
				var p = node;
				while (true) {
					p = p.parent;
					if (!p) {
						break;
					}
					if (!p.expanded) {
						dataset.recnoSilence(p.recno);
						dataset.expanded(true);
						p.expanded = true;
					}
				}
			} finally {
				dataset.recnoSilence(oldRecno);
			}
			this._refreshNeedShowRows();
			if (callbackFn) {
				callbackFn();
			}
		};
		
		this.collapse = function (callbackFn) {
			if (!isTree) {
				return;
			}
			var node = this._innerFindNode(allRows, dataset.recno());
			if (node === null) {
				return;
			}
			dataset.confirm();
			var oldRecno = dataset.recnoSilence();
			try {
				dataset.recnoSilence(node.recno);
				dataset.expanded(false);
				node.expanded = false;
			} finally {
				dataset.recnoSilence(oldRecno);
			}
			
			this._refreshNeedShowRows();
			if (callbackFn) {
				callbackFn();
			}
		};
		
		this._iterateNode = function (nodes, callbackFn) {
			var node;
			for (var i = 0, cnt = nodes.length; i < cnt; i++) {
				node = nodes[i];
				if (node.children) {
					if (callbackFn) {
						callbackFn(node);
					}
					if (node.children && node.children.length > 0) {
						this._iterateNode(node.children, callbackFn);
					}
				}
			}
			return null;
		};
		
		this._callbackFn = function (node, state) {
			var oldRecno = dataset.recnoSilence();
			try {
				dataset.recnoSilence(node.recno);
				dataset.expanded(state);
				node.expanded = state;
			} finally {
				dataset.recnoSilence(oldRecno);
			}
		};
		
		this.expandAll = function (callbackFn) {
			if (!isTree) {
				return;
			}
			
			dataset.confirm();
			var Z = this;
			Z._iterateNode(allRows, function (node) {
				Z._callbackFn(node, true); 
			});
			Z._refreshNeedShowRows();
			if (callbackFn) {
				callbackFn();
			}
		};
		
		this.collapseAll = function (callbackFn) {
			if (!isTree) {
				return;
			}
			dataset.confirm();
			var Z = this;
			Z._iterateNode(allRows, function (node) {
				Z._callbackFn(node, false); 
			});
			Z._refreshNeedShowRows();
			if (callbackFn) {
				callbackFn();
			}
		};
		
		this.syncDataset = function(){
			var recno = dataset.recno();
			if(recno < 0) {
				return;
			}
			var node = this._innerFindNode(allRows, dataset.recno()),
				pnode = node.parent;
			if (pnode && !pnode.expanded){
				while(true){
					if (!pnode.expanded) {
						pnode.expanded = true;
					} else {
							break;
					}
					pnode = pnode.parent;
					if (!pnode) {
						break;
					}
				}
			}
			this._refreshNeedShowRows();
			var rowno = this.recnoToRowno(recno);
			this.setCurrentRowno(rowno, false, true);
		};
		
		this.checkNode = function(state, relativeCheck, onlyCheckChildren){
			var node = this.getCurrentRow();
	//		if (node.state == state) {
	//			return;
	//		}
			node.state = state ? 1 : 0;
			dataset.selected(node.state);
	
			if (relativeCheck){
				if (node.children && node.children.length > 0) {
					this._updateChildState(node, state);
				}
				if (node.parent && !onlyCheckChildren) {
					this._updateParentState(node, state);
				}
			}
	
			if (state) {
				this._updateParentNodeBoldByChecked(node);
			} else {
				this._updateParentNodeBoldByNotChecked(node);
			}
			
			if (this.onCheckStateChanged) {
				this.onCheckStateChanged();
			}
		};
		
		this.checkChildNodes = function(state, relativeCheck){
			var node = this.getCurrentRow();
			node.state = state ? 1 : 0;
			dataset.selected(node.state);
	
			if (node.children && node.children.length > 0) {
				this._updateChildState(node, state);
			}
			if (relativeCheck){
				if (node.parent) {
					this._updateParentState(node, state);
				}
			}
	
			if (state) {
				this._updateParentNodeBoldByChecked(node);
			} else {
				this._updateParentNodeBoldByNotChecked(node);
			}
			
			if (this.onCheckStateChanged) {
				this.onCheckStateChanged();
			}
		};
		
		this._updateChildState = function(node, state){
			var oldRecno = dataset.recnoSilence(),
				childNode;
			try{
				for(var i = 0, cnt = node.children.length; i < cnt; i++){
					childNode = node.children[i];
					childNode.state = state;
					dataset.recnoSilence(childNode.recno);
					dataset.selected(state);
					if (childNode.children && childNode.children.length > 0) {
						this._updateChildState(childNode, state);
					}
				}
			} finally {
				dataset.recnoSilence(oldRecno);
			}
		};
		
		this._updateParentState = function(node, state){
			var pNode = node.parent;
			if (!pNode) {
				return;
			}
			var childNode, newState;
			if (state != 2){
				for(var i = 0, cnt = pNode.children.length; i < cnt; i++){
					childNode = pNode.children[i];
					if (childNode.state == 2){
						newState = 2;
						break;
					}
					if (i === 0){
						newState = childNode.state;
					} else if (newState != childNode.state){
							newState =2;
							break;
					}
					
				}//end for
			} else {
				newState = state;
			}
			if (pNode.state != newState){
				pNode.state = newState;
				var oldRecno = dataset.recnoSilence();
				try{
					dataset.recnoSilence(pNode.recno);
					dataset.selected(newState);
				}finally{
					dataset.recnoSilence(oldRecno);
				}
			}
			this._updateParentState(pNode, newState);
		};
		
		this.destroy = function(){
			dataset = null;
			allRows = null;
		
			this.onTopRownoChanged = null;
			this.onVisibleCountChanged = null;
			this.onCurrentRownoChanged = null;
			this.onNeedShowRowsCountChanged = null;
			this.onCheckStateChanged = null;
		};
	};
	
	/* ========================================================================
	 * Jslet framework: jslet.dbautocomplete.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBAutoComplete. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBAutoComplete",field:"department", matchType:"start"};
	 * //1. Declaring:
	 *      &lt;input id="cboAuto" type="text" data-jslet='jsletParam' />
	 *      
	 *  //2. Binding
	 *      &lt;input id="cboAuto" type="text" data-jslet='jsletParam' />
	 *      //Js snippet
	 *      var el = document.getElementById('cboAuto');
	 *      jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 *      jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBAutoComplete = jslet.Class.create(jslet.ui.DBText, {
		
		MatchModes: ['start','end', 'any'],
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			if (!Z.allProperties) {
				Z.allProperties = 'dataset,field,lookupField,minChars,minDelay,displayTemplate,matchMode,beforePopup,onGetFilterField,filterFields';
			}
			
			Z._lookupField = null;
			
			Z._minChars = 0;
	
			Z._minDelay = 0;
			
			Z._beforePopup = null;
			
			Z._filterFields = null;
			
			Z._defaultFilterFields = null;
			
			Z._onGetFilterField = null;
			
			Z._matchMode = 'start';
			
			Z._timeoutHandler = null; 
			$super(el, params);
		},
	
		/**
		 * Get or set lookup field name.
		 * 
		 * @Param {String} lookup field name.
		 * @return {this or String}
		 */
		lookupField: function(lookupField) {
			if(lookupField === undefined) {
				return this._lookupField;
			}
			jslet.Checker.test('DBAutoComplete.lookupField', lookupField).isString();
			this._lookupField = lookupField;
		},
	   
		/**
		 * Get or set minimum characters before searching.
		 * 
		 * @Param {Integer} Minimum character before searching.
		 * @return {this or Integer}
		 */
		minChars: function(minChars) {
			if(minChars === undefined) {
				return this._minChars;
			}
			jslet.Checker.test('DBAutoComplete.minChars', minChars).isGTEZero();
			this._minChars = parseInt(minChars);
		},
	   
		/**
		 * Get or set delay time(ms) before auto searching.
		 * 
		 * @param {Integer} minDelay Delay time.
		 * @return {this or Integer}
		 */
		minDelay: function(minDelay) {
			if(minDelay === undefined) {
				return this._minDelay;
			}
			jslet.Checker.test('DBAutoComplete.minDelay', minDelay).isGTEZero();
			this._minDelay = parseInt(minDelay);
		},
	   
		/**
		 * Get or set delay time(ms) before auto searching.
		 * 
		 * @param {String} matchMode match mode,optional values: 'start', 'end', 'any', default: 'start'
		 * @return {this or String}
		 */
		matchMode: function(matchMode) {
			if(matchMode === undefined) {
				return this._matchMode;
			}
			matchMode = jQuery.trim(matchMode);
			var checker = jslet.Checker.test('DBAutoComplete.matchMode', matchMode).isString();
			matchMode = matchMode.toLowerCase();
			checker.testValue(matchMode).inArray(this.MatchModes);
			this._matchMode = matchMode;
		},
	   
		/**
		 * {Function} Before pop up event handler, you can use this to customize the display result.
		 * Pattern: 
		 *   function(dataset, inputValue){}
		 *   //dataset: jslet.data.Dataset; 
		 *   //inputValue: String
		 */
		beforePopup: function(beforePopup) {
			if(beforePopup === undefined) {
				return this._beforePopup;
			}
			this._beforePopup = beforePopup;
		},
		
		/**
		 * Get or set filter fields, more than one fields are separated with ','.
		 * 
		 * @param {String} filterFields filter fields.
		 * @return {this or String}
		 */
		filterFields: function(filterFields) {
			if(filterFields === undefined) {
				return Z._filterFields;
			}
			jslet.Checker.test('DBAutoComplete.filterFields', filterFields).isString();
			Z._filterFields = filterFields;
		},
		
		/**
		 * {Function} Get filter field event handler, you can use this to customize the display result.
		 * Pattern: 
		 *   function(dataset, inputValue){}
		 *   //dataset: jslet.data.Dataset; 
		 *   //inputValue: String
		 *   //return: String Field name
		 */
		onGetFilterField: function(onGetFilterField) {
			if(onGetFilterField === undefined) {
				return this._onGetFilterField;
			}
			this._onGetFilterField = onGetFilterField;
		},
		
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'input' &&
				el.type.toLowerCase() == 'text';
		},
	
		/**
		 * @override
		 */
		doBlur: function () {
			var Z = this;
			if (Z.el.disabled || Z.el.readOnly) {
				return;
			}
			var	fldObj = Z._dataset.getField(Z._field);
			if (fldObj.readOnly() || fldObj.disabled()) {
				return;
			}
			if (Z.contentPanel && Z.contentPanel.isShowing()) {
				window.setTimeout(function(){
					if(Z._isSelecting) {
						return;
					}
					var value = Z.el.value, canBlur = true;
					if(!Z._lookupField) {
						var fldObj = Z._dataset.getField(Z._field),
							lkf = fldObj.lookup(),
							lkds = lkf.dataset();
						if(value.length > 0 && lkds.recordCount() === 0) {
							canBlur = false;
						}
					}
					if (Z.contentPanel && Z.contentPanel.isShowing()) {
						Z.contentPanel.closePopup();
					}
					Z.updateToDataset();
					Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
					if(!canBlur) {
						Z.el.focus();
					}
				}, 200);
			} else {
				Z.updateToDataset();
				Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
			}
		},
	
		/**
		 * @override
		 */
		doChange: null,
	
		/**
		 * @override
		 */
		doKeydown: function (event) {
			if (this.disabled || this.readOnly) {
				return;
			}
			event = jQuery.event.fix( event || window.event );
	
			var keyCode = event.which, Z = this.jslet;
			if(keyCode >= 112 && keyCode <= 123 || keyCode == 16 || keyCode == 17 || keyCode == 18 || //F1-F12, ctrl, shift, alt
					keyCode == 20 || keyCode == 45 || keyCode == 35 || keyCode == 36 || keyCode == 34 || keyCode == 33) { //CapsLock, Insert, Home, End, PageUp, PageDown 
				return;
			}
			if ((keyCode == 38 || keyCode == 40) && Z.contentPanel && Z.contentPanel.isPop) {
				var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
				lkf = fldObj.lookup(),
				lkds = lkf.dataset();
				if (keyCode == 38) { //up arrow
					lkds.prior();
					event.preventDefault();
		       		event.stopImmediatePropagation();
				}
				if (keyCode == 40) {//down arrow
					lkds.next();
					event.preventDefault();
		       		event.stopImmediatePropagation();
				}
				return;
			}
	
			if (keyCode == 8 || keyCode == 46 || keyCode == 229) {//delete/backspace/ime
				this.jslet._invokePopup();
				return;
			}
			if (keyCode != 13 && keyCode != 9) {
				Z._invokePopup();
			} else if (Z.contentPanel) {
				if(Z.contentPanel.isShowing()) {
					Z.contentPanel.confirmSelect();
				}
			}
		},
	
		/**
		 * @override
		 */
		doKeypress: function (event) {
			if (this.disabled || this.readOnly) {
				return;
			}
	//		var keyCode = event.keyCode ? event.keyCode : 
	//			event.which	? event.which: event.charCode;
	//		var Z = this.jslet;
	//		if (keyCode != 13 && keyCode != 9) {
	//			Z._invokePopup();
	//		} else if (Z.contentPanel) {
	//			if(Z.contentPanel.isShowing()) {
	//				Z.contentPanel.confirmSelect();
	//			}
	//		}
		},
	
		_invokePopup: function () {
			var Z = this;
			if (Z._timeoutHandler) {
				clearTimeout(Z._timeoutHandler);
			}
			var delayTime = 100;
			if (Z._minDelay) {
				delayTime = parseInt(Z._minDelay);
			}
			
			Z._timeoutHandler = setTimeout(function () {
				Z._populate(Z.el.value); 
			}, delayTime);
		},
	
		_getDefaultFilterFields: function(lookupFldObj) {
			var Z = this;
			if(Z._defaultFilterFields) {
				return Z._defaultFilterFields;
			}
			var codeFld = lookupFldObj.codeField(),
				nameFld = lookupFldObj.nameField(),
				lkDs = lookupFldObj.dataset(),
				codeFldObj = lkDs.getField(codeFld),
				nameFldObj = lkDs.getField(nameFld),
				arrFields = [];
			if(codeFldObj && codeFldObj.visible()) {
				arrFields.push(codeFld);
			}
			if(codeFld != nameFld && nameFldObj && nameFldObj.visible()) {
				arrFields.push(nameFld);
			}
			Z._defaultFilterFields = arrFields;
			return arrFields;
		},
		
		_getFilterFields: function(lkFldObj, inputValue) {
			var Z = this;
			var filterFlds = null;
			
			var eventFunc = jslet.getFunction(Z._onGetFilterField);
			if (eventFunc) {
				filterFlds = eventFunc.call(Z, lkFldObj.dataset(), inputValue);
				jslet.Checker.test('DBAutoComplete.onGetFilterField#return', filterFlds).isString();
			}
			filterFlds = filterFlds || Z._filterFields;
			var arrFields;
			if (filterFlds) {
				arrFields = filterFlds.split(',');
			} else {
				arrFields = Z._getDefaultFilterFields(lkFldObj);
			}
			if(arrFields.length === 0) {
				throw new Error('Not specified [filter fields]!');
			}
			var filterValue = inputValue;
			if (Z._matchMode == 'start') {
				filterValue = filterValue + '%';
			} else {
				if (Z._matchMode == 'end') {
					filterValue = '%' + filterValue;
				} else {
					filterValue = '%' + filterValue + '%';
				}
			}
			var fldName, result = '';
			for(var i = 0, len = arrFields.length; i < len; i++) {
				fldName = arrFields[i];
				if(i > 0) {
					result += ' || '
				}
				result += 'like([' + fldName + '],"' + filterValue + '")';
			}
			return result;
		},
		
		_populate: function (inputValue) {
			var Z = this;
			if (Z._minChars > 0 && inputValue && inputValue.length < Z._minChars) {
				return;
			}
			var fldObj = Z._dataset.getField(Z._lookupField || Z._field),
				lkf = fldObj.lookup();
			if (!lkf) {
				console.error(Z._field + ' is NOT a lookup field!');
				return;
			}
			
			var lkds = lkf.dataset();
			var eventFunc = jslet.getFunction(Z._beforePopup);
			if (eventFunc) {
				eventFunc.call(Z, lkds, inputValue);
			} else if (inputValue) {
				var filter = Z._getFilterFields(lkf, inputValue);
				lkds.filter(filter);
				lkds.filtered(true);
			} else {
				lkds.filter(null);
			}
			//Clear field value which specified by 'lookupField'.
			if(Z._lookupField) {
				Z._dataset.getRecord()[Z._lookupField] = null;
			}
			if (!Z.contentPanel) {
				Z.contentPanel = new jslet.ui.DBAutoCompletePanel(Z);
			} else {
				if(Z.contentPanel.isShowing()) {
					return;
				}
			}
			jslet.ui.PopupPanel.excludedElement = Z.el;
			var jqEl = jQuery(Z.el),
				r = jqEl.offset(),
				h = jqEl.outerHeight(),
				x = r.left,
				y = r.top + h;
			
			if (jslet.locale.isRtl){
				x = x + jqEl.outerWidth() - Z.contentPanel.dlgWidth;
			}
			Z.contentPanel.showPopup(x, y, 0, h);
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this;
			jQuery(Z.el).off();
			if (Z.contentPanel){
				Z.contentPanel.destroy();
				Z.contentPanel = null;
			}
			$super();
		}
		
	});
	
	/**
	 * @private
	 * @class DBAutoCompletePanel
	 * 
	 */
	jslet.ui.DBAutoCompletePanel = function (autoCompleteObj) {
		var Z = this;
		Z.dlgWidth = 320;
		Z.dlgHeight = 180;
	
		var lkf, lkds;
		Z.comboCfg = autoCompleteObj;
		Z.dataset = autoCompleteObj.dataset();
		Z.field = autoCompleteObj.lookupField() || autoCompleteObj.field();
		
		Z.panel = null;
		Z.lkDataset = null;
		Z.popup = new jslet.ui.PopupPanel();
		Z.isPop = false;
	
		Z.create = function () {
			if (!Z.panel) {
				Z.panel = document.createElement('div');
				Z.panel.style.width = '100%';
				Z.panel.style.height = '100%';
				jQuery(Z.panel).on("mousedown", function(event){
					Z.comboCfg._isSelecting = true;
					event.stopPropagation();
				});
			}
			//process variable
			var fldObj = Z.dataset.getField(Z.field),
				lkfld = fldObj.lookup(),
				lkds = lkfld.dataset();
			Z.lkDataset = lkds;
			var fields = lkds.getNormalFields(),
				totalChars = 0;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldObj = fields[i];
				if(fldObj.visible()) {
					totalChars += fldObj.displayWidth();
				}
			}
			var totalWidth = totalChars * (jslet.global.defaultCharWidth || 12) + 30;
			Z.dlgWidth = totalWidth;
			if(Z.dlgWidth < 150) {
				Z.dlgWidth = 150;
			}
			if(Z.dlgWidth > 500) {
				Z.dlgWidth = 500;
			}
	
			Z.panel.innerHTML = '';
	
			var cntw = Z.dlgWidth - 4,
				cnth = Z.dlgHeight - 4,
				tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, noborder:true, hasSelectCol: false, hasSeqCol: false, hideHead: true };
			tableparam.onRowClick = Z.confirmSelect;
	
			Z.otable = jslet.ui.createControl(tableparam, Z.panel, '100%', cnth);
			Z.otable.el.focus();
			Z.otable.el.style.border = "0";
			
			return Z.panel;
		};
	
		Z.confirmSelect = function () {
			Z.comboCfg._isSelecting = true;
			var fldValue = Z.lkDataset.keyValue();
			if (fldValue || fldValue === 0) {
				Z.dataset.setFieldValue(Z.field, fldValue, Z.valueIndex);
				
				var fldObj = Z.dataset.getField(Z.field),
					lkfldObj = fldObj.lookup(),
					fieldMap = lkfldObj.returnFieldMap();
				if(fieldMap) {
					var lookupDs = lkfldObj.dataset();
						mainDs = Z.dataset;
					var fldName, lkFldName;
					for(var fldName in fieldMap) {
						lkFldName = fieldMap[fldName];
						mainDs.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
					}
				}
				
				Z.comboCfg.el.focus();
			}
			if (Z.comboCfg.afterSelect) {
				Z.comboCfg.afterSelect(Z.dataset, Z.lkDataset);
			}
			Z.closePopup();
		};
	
		Z.showPopup = function (left, top, ajustX, ajustY) {
			if (!Z.panel) {
				Z.panel = Z.create();
			}
			Z.comboCfg._isSelecting = false;
			Z.isPop = true;
			var p = Z.popup.getPopupPanel();
			p.style.padding = '0';
			Z.popup.setContent(Z.panel);
			Z.popup.onHidePopup = Z.doClosePopup;
			Z.popup.show(left, top, Z.dlgWidth, Z.dlgHeight, ajustX, ajustY);
		};
	
		Z.doClosePopup = function () {
			Z.isPop = false;
			var oldRecno = Z.lkDataset.recno() || 0;
			try {
				Z.lkDataset.filter(null);
			} finally {
				if(oldRecno >= 0) {
					Z.lkDataset.recno(oldRecno);
				}
			}
		};
		
		Z.closePopup = function () {
			Z.popup.hide();
		};
		
		Z.isShowing = function(){
			if (Z.popup) {
				return Z.popup.isShowing;
			} else {
				return false;
			}
		};
		
		Z.destroy = function(){
			jQuery(Z.panel).off();
			Z.otable.onRowClick = null;
			Z.otable.destroy();
			Z.otable = null;
			Z.panel = null;
			Z.popup.destroy();
			Z.popup = null;
			Z.comboCfg = null;
			Z.dataset = null;
			Z.field = null;
			Z.lkDataset = null;
		};
	};
	
	jslet.ui.register('DBAutoComplete', jslet.ui.DBAutoComplete);
	jslet.ui.DBAutoComplete.htmlTemplate = '<input type="text"></input>';
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.dbcheckbox.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBCheckBox. 
	 * Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBCheckBox", dataset:"employee", field:"married"};
	 * 
	 * //1. Declaring:
	 * &lt;input type='checkbox' data-jslet='type:"DBCheckBox",dataset:"employee", field:"married"' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 *
	 *  //2. Binding
	 * &lt;input id="ctrlId" type="checkbox" />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 * 
	 * </code></pre>
	 */
	
	/**
	* DBCheckBox
	*/
	jslet.ui.DBCheckBox = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.isCheckBox = true;
			Z.allProperties = 'dataset,field,beforeClick';
			Z._beforeClick = null;
			
			Z._skipRefresh = false;
			$super(el, params);
		},
	
		beforeClick: function(beforeClick) {
			if(beforeClick === undefined) {
				return this._beforeClick;
			}
			jslet.Checker.test('DBCheckBox.beforeClick', beforeClick).isFunction();
			this._beforeClick = beforeClick;
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'input' &&
				el.type.toLowerCase() == 'checkbox';
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this;
	
			Z.renderAll();
			var jqEl = jQuery(Z.el);
			jqEl.on('click', Z._doClick);
			jqEl.focus(function(event) {
				jqEl.trigger('editing', [Z._field]);
			});
			jqEl.addClass('checkbox-inline');
		}, // end bind
	
		_doClick: function (event) {
			var Z = this.jslet;
			var ctrlRecno = Z.ctrlRecno();
			if(ctrlRecno >= 0 && ctrlRecno != Z._dataset.recno()) {
				Z._skipRefresh = true;
				try {
					Z._dataset.recno(ctrlRecno);
				} finally {
					Z._skipRefresh = false;
				}
			}
			if (Z._beforeClick) {
				var result = Z._beforeClick.call(Z, Z.el);
				if (!result) {
					return;
				}
			}
			Z.updateToDataset();
		},
		
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly") {
				var disabled = fldObj.disabled() || fldObj.readOnly();
				jslet.ui.setEditableStyle(Z.el, disabled, disabled, false, fldObj.required());
				Z.setTabIndex();
			}
			if(!metaName || metaName == 'tabIndex') {
				Z.setTabIndex();
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if(Z._skipRefresh) {
				return;
			}
			var fldObj = Z._dataset.getField(Z._field),
				value = Z.getValue();
			if (value) {
				Z.el.checked = true;
			} else {
				Z.el.checked = false;
			}
		},
		
		focus: function() {
			this.el.focus();
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		}, // end renderAll
	
		updateToDataset: function () {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var fldObj = Z._dataset.getField(Z._field),
				value = Z.el.checked;
			Z._keep_silence_ = true;
			try {
				Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
			} finally {
				Z._keep_silence_ = false;
			}
		}, // end updateToDataset
		
		/**
		 * @override
		 */
		destroy: function($super){
			jQuery(this.el).off();
			$super();
		}
	});
	
	jslet.ui.register('DBCheckBox', jslet.ui.DBCheckBox);
	jslet.ui.DBCheckBox.htmlTemplate = '<input type="checkbox"></input>';
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbcheckboxgroup.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBCheckBoxGroup. 
	 * Display a group of checkbox. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBCheckBoxGroup",dataset:"employee",field:"department", columnCount: 3};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBCheckBoxGroup",dataset:"employee",field:"department", columnCount: 3' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 *  
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBCheckBoxGroup = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,columnCount,hasSelectAllBox';
			/**
			 * {Integer} Column count
			 */
			Z._columnCount = 99999;
			Z._itemIds = null;
			$super(el, params);
		},
	
		columnCount: function(columnCount) {
			if(columnCount === undefined) {
				return this._columnCount;
			}
			jslet.Checker.test('DBCheckBoxGroup.columnCount', columnCount).isGTEZero();
			this._columnCount = parseInt(columnCount);
		},
		
		hasSelectAllBox: function(hasSelectAllBox) {
			if(hasSelectAllBox === undefined) {
				return this._hasSelectAllBox;
			}
			this._hasSelectAllBox = hasSelectAllBox? true: false;
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
			var jqEl = jQuery(Z.el);
			jqEl.on('click', 'input[type="checkbox"]', function (event) {
				var ctrl = this;
				window.setTimeout(function(){ //Defer firing 'updateToDataset' when this control is in DBTable to make row changed firstly.
					event.delegateTarget.jslet.updateToDataset(ctrl);
				}, 5)
			});
			jqEl.on('focus', 'input[type="checkbox"]', function (event) {
				jqEl.trigger('editing', [Z._field]);
			});
			jqEl.addClass('form-control');//Bootstrap class
			jqEl.css('height', 'auto');
		},
	
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
				var disabled = fldObj.disabled(),
					readOnly = fldObj.readOnly();
				disabled = disabled || readOnly;
				var chkBoxes = jQuery(Z.el).find('input[type="checkbox"]'),
					chkEle, 
					tabIndex = fldObj.tabIndex(),
					required = fldObj.required();
				for(var i = 0, cnt = chkBoxes.length; i < cnt; i++){
					chkEle = chkBoxes[i];
					jslet.ui.setEditableStyle(chkEle, disabled, readOnly, false, required);
					chkEle.tabIndex = tabIndex;
				}
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var checkboxs = jQuery(Z.el).find('input[type="checkbox"]'),
				chkcnt = checkboxs.length, 
				checkbox, i;
			for (i = 0; i < chkcnt; i++) {
				checkbox = checkboxs[i];
				if(jQuery(checkbox).hasClass('jl-selectall')) {
					continue;
				}
				checkbox.checked = false;
			}
			var values = Z.getValue();
			if(values && values.length > 0) {
				var valueCnt = values.length, value;
				for (i = 0; i < chkcnt; i++) {
					checkbox = checkboxs[i];
					for (var j = 0; j < valueCnt; j++) {
						value = values[j];
						if (value == checkbox.value) {
							checkbox.checked = true;
						}
					}
				}
			}
		},
		
		/**
		 * @override
		 */
		doLookupChanged: function () {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field), 
				lkf = fldObj.lookup();
			if (!lkf) {
				console.error(jslet.formatString(jslet.locale.Dataset.lookupNotFound,
						[fldObj.name()]));
				return;
			}
			if(fldObj.valueStyle() != jslet.data.FieldValueStyle.MULTIPLE) {
				fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
			}
			
			var lkds = lkf.dataset(),
				lkCnt = lkds.recordCount();
			if(lkCnt === 0) {
				Z.el.innerHTML = jslet.locale.DBCheckBoxGroup.noOptions;
				return;
			}
			Z._itemIds = [];
			var template = ['<table cellpadding="0" cellspacing="0">'],
				isNewRow = false;
			var editFilter = lkf.editFilter();
			Z._innerEditFilterExpr = null;
			var editItemDisabled = lkf.editItemDisabled();
			if(editFilter) {
				Z._innerEditFilterExpr = new jslet.Expression(lkds, editFilter);
			}
			var disableOption = false,
				itemId = jslet.nextId(), k = -1;
			if(Z._hasSelectAllBox && lkCnt > 0) {
				template.push('<tr>');
				itemId = jslet.nextId();
				template.push('<td style="white-space: nowrap; "><input type="checkbox" class="jl-selectall"');
				template.push(' id="');
				template.push(itemId);
				template.push('"/><label for="');
				template.push(itemId);
				template.push('">');
				template.push(jslet.locale.DBCheckBoxGroup.selectAll);
				template.push('</label></td>');
				k = 0;
			}
			var oldRecno = lkds.recnoSilence();
			try {
				for (var i = 0; i < lkCnt; i++) {
					lkds.recnoSilence(i);
					disableOption = false;
					if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
						if(!editItemDisabled) {
							continue;
						} else {
							disableOption = true;
						}
					}
					k++;
					isNewRow = (k % Z._columnCount === 0);
					if (isNewRow) {
						if (k > 0) {
							template.push('</tr>');
						}
						template.push('<tr>');
					}
					itemId = jslet.nextId();
					template.push('<td style="white-space: nowrap; "><input type="checkbox" value="');
					template.push(lkds.getFieldValue(lkf.keyField()));
					template.push('" id="');
					template.push(itemId);
					template.push('" ' + (disableOption? ' disabled': '') + '/><label for="');
					template.push(itemId);
					template.push('">');
					template.push(lkf.getCurrentDisplayValue());
					template.push('</label></td>');
					isNewRow = (k % Z._columnCount === 0);
				} // end for
				if (lkCnt > 0) {
					template.push('</tr>');
				}
				template.push('</table>');
				Z.el.innerHTML = template.join('');
			} finally {
				lkds.recnoSilence(oldRecno);
			}
		}, // end renderOptions
	
		updateToDataset: function(currCheckBox) {
			var Z = this;
			if (Z._is_silence_) {
				return;
			}
			var allBoxes = jQuery(Z.el).find('input[type="checkbox"]'), chkBox;
			if(jQuery(currCheckBox).hasClass('jl-selectall')) {
				var isAllSelected = currCheckBox.checked;
				for(var j = 0, allCnt = allBoxes.length; j < allCnt; j++){
					chkBox = allBoxes[j];
					if(chkBox == currCheckBox) {
						continue;
					}
					if (!chkBox.disabled) {
						chkBox.checked = isAllSelected;
					}
				} //end for j
				
			}
			var fldObj = Z._dataset.getField(Z._field),
				limitCount = fldObj.valueCountLimit();
			
			var values = [], count = 0;
			for(var j = 0, allCnt = allBoxes.length; j < allCnt; j++){
				chkBox = allBoxes[j];
				if(jQuery(chkBox).hasClass('jl-selectall')) {
					continue;
				}
				if (chkBox.checked) {
					values.push(chkBox.value);
					count ++;
				}
			} //end for j
	
			if (limitCount && count > limitCount) {
				currCheckBox.checked = !currCheckBox.checked;
				jslet.showInfo(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
						[''	+ limitCount]));
				return;
			}
	
			Z._is_silence_ = true;
			try {
				Z._dataset.setFieldValue(Z._field, values);
			} finally {
				Z._is_silence_ = false;
			}
		},
		
		focus: function() {
			if (_itemIds && _itemIds.length > 0) {
				document.getElementById(_itemIds[0]).focus();
			}
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var Z = this, 
				jqEl = jQuery(Z.el);
			if(!jqEl.hasClass("jl-checkboxgroup")) {
				jqEl.addClass("jl-checkboxgroup");
			}
			Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		},
	
		/**
		 * @override
		 */
		destroy: function($super){
			var jqEl = jQuery(this.el);
			jqEl.off();
			$super();
		}
	});
	
	jslet.ui.register('DBCheckBoxGroup', jslet.ui.DBCheckBoxGroup);
	jslet.ui.DBCheckBoxGroup.htmlTemplate = '<div></div>';
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbcomboselect.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBCombodlg. 
	 * Show data on a popup panel, it can display tree style or table style. 
	 * Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBCombodlg",dataset:"employee",field:"department", textReadOnly:true};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBCombodlg",dataset:"employee",field:"department", textReadOnly:true' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 *  
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 * 
	 * </code></pre>
	 */
	jslet.ui.DBComboSelect = jslet.Class.create(jslet.ui.DBCustomComboBox, {
		showStyles: ['auto', 'table', 'tree'],
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,textField,searchField,popupHeight,popupWidth,showStyle,textReadOnly,onGetSearchField,correlateCheck';
			Z._textField = null;
			
			Z._showStyle = 'auto';
			
			Z._popupWidth = 300;
	
			Z._popupHeight = 300;
			
			Z._contentPanel = null;
			
			Z._pickupField = null;
			
			Z._onGetSearchField = null;
			
			Z._correlateCheck = false;
			
			$super(el, params);
		},
	
		/**
		 * Get or set the field name of text box.
		 * 
		 * @param textField {String} Field name of text box.
		 * @return {String or this}
		 */
		textField: function(textField) {
			if(textField === undefined) {
				return this._textField;
			}
			jslet.Checker.test('DBComboSelect.textField', textField).required().isString();
			this._textField = textField.trim();
		},
		
		/**
		 * Get or set popup panel height.
		 * 
		 * @param popupHeight {Integer} Popup panel height.
		 * @return {Integer or this}
		 */
		popupHeight: function(popupHeight) {
			if(popupHeight === undefined) {
				return this._popupHeight;
			}
			jslet.Checker.test('DBComboSelect.popupHeight', popupHeight).isGTEZero();
			this._popupHeight = parseInt(popupHeight);
		},
	
		/**
		 * Get or set popup panel width.
		 * 
		 * @param popupHeight {Integer} Popup panel width.
		 * @return {Integer or this}
		 */
		popupWidth: function(popupWidth) {
			if(popupWidth === undefined) {
				return this._popupWidth;
			}
			jslet.Checker.test('DBComboSelect.popupWidth', popupWidth).isGTEZero();
			this._popupWidth = parseInt(popupWidth);
		},
			
		/**
		 * Get or set panel content style.
		 * 
		 * @param {String} Optional value: auto, table, tree.
		 * @return {String or this}
		 */
		showStyle: function(showStyle) {
			if(showStyle === undefined) {
				return this._showStyle;
			}
			showStyle = jQuery.trim(showStyle);
			var checker = jslet.Checker.test('DBComboSelect.showStyle', showStyle).isString();
			showStyle = showStyle.toLowerCase();
			checker.testValue(showStyle).inArray(this.showStyles);
			this._showStyle = showStyle;
		},
		
		/**
		 * Get or set onGetSearchField event handler.
		 * 
		 * @param {Function} Optional onGetSearchField event handler.
		 * @return {Function or this}
		 */
		onGetSearchField: function(onGetSearchField) {
			if(onGetSearchField === undefined) {
				return this._onGetSearchField;
			}
			this._onGetSearchField = onGetSearchField;
		},
			
		correlateCheck: function(correlateCheck) {
			if(correlateCheck === undefined) {
				return this._correlateCheck;
			}
			this._correlateCheck = correlateCheck;
		},
		
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return true;
		},
	
		/**
		 * @override
		 */
		afterBind: function ($super) {
			$super();
			
			if (this._contentPanel) {
				this._contentPanel = null;
			}
		},
	
		buttonClick: function (btnEle) {
			var Z = this, 
				el = Z.el, 
				fldObj = Z._dataset.getField(Z._field), 
				lkf = fldObj.lookup(),
				jqEl = jQuery(el);
			if (fldObj.readOnly() || fldObj.disabled()) {
				return;		
			}
			if (lkf === null && lkf === undefined) {
				throw new Error(Z._field + ' is NOT a lookup field!');
			}
			var style = Z._showStyle;
			if (Z._showStyle == 'auto') {
				style = lkf.parentField() ? 'tree' : 'table';
			}
			if (!Z._contentPanel) {
				Z._contentPanel = new jslet.ui.DBComboSelectPanel(Z);
				Z._contentPanel.showStyle = style;
				Z._contentPanel.customButtonLabel = Z.customButtonLabel;
				Z._contentPanel.onCustomButtonClick = Z.onCustomButtonClick;
				if (Z._popupWidth) {
					Z._contentPanel.popupWidth = Z._popupWidth;
				}
				if (Z._popupHeight) {
					Z._contentPanel.popupHeight = Z._popupHeight;
				}
			}
			jslet.ui.PopupPanel.excludedElement = btnEle;
			var r = jqEl.offset(), h = jqEl.outerHeight(), x = r.left, y = r.top + h;
			if (jslet.locale.isRtl){
				x = x + jqEl.outerWidth();
			}
			Z._contentPanel.showPopup(x, y, 0, h);
		},
		
		closePopup: function(){
			if(this._contentPanel) {
				this._contentPanel.closePopup();
			}
			this._contentPanel = null;
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this;
			if (Z._contentPanel){
				Z._contentPanel.destroy();
				Z._contentPanel = null;
			}
			jslet.ui.PopupPanel.excludedElement = null;
			$super();
		}
	});
	
	jslet.ui.DBComboSelectPanel = function (comboSelectObj) {
		var Z = this;
	
		Z.showStyle = 'auto';
	
		Z.customButtonLabel = null;
		Z.onCustomButtonClick = null;
		Z.popupWidth = 350;
		Z.popupHeight = 350;
	
		var otree, otable, showType, valueSeperator = ',', lkf, lkds, self = this;
		Z.comboSelectObj = comboSelectObj;
	
		Z.dataset = comboSelectObj._dataset;
		Z.field = comboSelectObj._field;
		Z.fieldObject = Z.dataset.getField(Z.field);
		Z.panel = null;
		Z.searchBoxEle = null;
		
		Z.popup = new jslet.ui.PopupPanel();
		Z.popup.onHidePopup = function() {
			Z.comboSelectObj.focus();
		};
	};
	
	jslet.ui.DBComboSelectPanel.prototype = {
			
		lookupDs: function() {
			return this.fieldObject.lookup().dataset();
		},
		
		isMultiple: function() {
			return this.fieldObject.valueStyle() == jslet.data.FieldValueStyle.MULTIPLE;
		},
			
		showPopup: function (left, top, ajustX, ajustY) {
			var Z = this;
			Z._initSelected();
			var showType = Z.showStyle.toLowerCase();
			if (!Z.panel) {
				Z.panel = Z._create();
			} else {
				var ojslet = Z.otree ? Z.otree : Z.otable;
				ojslet.dataset().addLinkedControl(ojslet);
				window.setTimeout(function(){
					ojslet.renderAll();
				}, 1);
			}
			if(showType == 'table') {
				var fields = Z.lookupDs().getNormalFields(),
					fldObj, totalChars = 0;
				for(var i = 0, len = fields.length; i < len; i++) {
					fldObj = fields[i];
					if(fldObj.visible()) {
						totalChars += fldObj.displayWidth();
					}
				}
				var totalWidth = totalChars * (jslet.global.defaultCharWidth || 12) + 40;
				Z.popupWidth = totalWidth;
				if(Z.popupWidth < 150) {
					Z.popupWidth = 150;
				}
				if(Z.popupWidth > 500) {
					Z.popupWidth = 500;
				}
			}
			Z.popup.setContent(Z.panel, '100%', '100%');
			Z.popup.show(left, top, Z.popupWidth, Z.popupHeight, ajustX, ajustY);
			jQuery(Z.panel).find(".jl-combopnl-head input").focus();
		},
	
		closePopup: function () {
			var Z = this;
			var fldObj = Z.dataset.getField(Z.field),
				lkfld = fldObj.lookup();
			if(Z.isMultiple() && lkfld.onlyLeafLevel()) {
				Z.lookupDs().onCheckSelectable(null);
			}
			
			Z.popup.hide();
			var dispCtrl = Z.otree ? Z.otree : Z.otable;
			if(dispCtrl) {
				dispCtrl.dataset().removeLinkedControl(dispCtrl);
			}
		},
		
		_create: function () {
			var Z = this;
			if (!Z.panel) {
				Z.panel = document.createElement('div');
			}
	
			//process variable
			var fldObj = Z.dataset.getField(Z.field),
				lkfld = fldObj.lookup(),
				pfld = lkfld.parentField(),
				showType = Z.showStyle.toLowerCase(),
				lkds = Z.lookupDs();
	
			var template = ['<div class="jl-combopnl-head"><div class="col-xs-12 jl-nospacing">',
			                '<input class="form-control" type="text" size="20"></input></div></div>',
				'<div class="jl-combopnl-content',
				Z.isMultiple() ? ' jl-combopnl-multiselect': '',
				'"></div>',
				'<div class="jl-combopnl-footer" style="display:none"><button class="jl-combopnl-footer-cancel btn btn-default btn-sm" >',
				jslet.locale.MessageBox.cancel,
				'</button><button class="jl-combopnl-footer-ok btn btn-default btn-sm" >',
				jslet.locale.MessageBox.ok,
				'</button></div>'];
	
			Z.panel.innerHTML = template.join('');
			var jqPanel = jQuery(Z.panel),
				jqPh = jqPanel.find('.jl-combopnl-head');
			jqPanel.on('keydown', function(event){
				if(event.keyCode === 27) {
					Z.closePopup();
				}
			});
			Z.searchBoxEle = jqPh.find('input')[0];
			jQuery(Z.searchBoxEle).on('keydown', jQuery.proxy(Z._findData, Z));
			
			var jqContent = jqPanel.find('.jl-combopnl-content');
			if (Z.isMultiple()) {
				jqContent.addClass('jl-combopnl-content-nofooter').removeClass('jl-combopnl-content-nofooter');
				var pnlFoot = jqPanel.find('.jl-combopnl-footer')[0];
				pnlFoot.style.display = 'block';
				var jqFoot = jQuery(pnlFoot);
				jqFoot.find('.jl-combopnl-footer-cancel').click(jQuery.proxy(Z.closePopup, Z));
				jqFoot.find('.jl-combopnl-footer-ok').click(jQuery.proxy(Z._confirmSelect, Z));
			} else {
				jqContent.addClass('jl-combopnl-content-nofooter');
			}
	
			var contentPanel = jqContent[0];
	
			//create popup content
			if (showType == 'tree') {
				var treeparam = { 
					type: 'DBTreeView', 
					dataset: lkds, 
					readOnly: false, 
					displayFields: lkfld.displayFields(), 
					hasCheckBox: Z.isMultiple()
				};
	
				if (!Z.isMultiple()) {
					treeparam.onItemDblClick = jQuery.proxy(Z._confirmSelect, Z);
				}
				treeparam.correlateCheck = Z.comboSelectObj.correlateCheck();
				window.setTimeout(function(){
					Z.otree = jslet.ui.createControl(treeparam, contentPanel, '100%', '100%');
				}, 1);
			} else {
				var tableparam = { type: 'DBTable', dataset: lkds, readOnly: true, hasSelectCol: Z.isMultiple(), hasSeqCol: false, hasFindDialog: false };
				if (!Z.isMultiple()) {
					tableparam.onRowDblClick = jQuery.proxy(Z._confirmSelect, Z);
				}
				window.setTimeout(function(){
					Z.otable = jslet.ui.createControl(tableparam, contentPanel, '100%', '100%');
				}, 1);
			}
			return Z.panel;
		},
	
		_initSelected: function () {
			var Z = this;
			var fldValue = Z.comboSelectObj.getValue(), 
				lkds = Z.lookupDs();
	
			var fldObj = Z.dataset.getField(Z.field),
				lkfld = fldObj.lookup();
	
			if(lkfld.onlyLeafLevel()) {
				lkds.onCheckSelectable(function(){
					return !this.hasChildren();
				});
			}
			if (!Z.isMultiple()) {
				if (fldValue) {
					lkds.findByKey(fldValue);
				}
				return;
			}
			lkds.selectAll(false);
			if (fldValue) {
				var arrKeyValues = fldValue;
				if(!jslet.isArray(fldValue)) {
					arrKeyValues = fldValue.split(jslet.global.valueSeparator);
				}
				for (var i = 0, len = arrKeyValues.length; i < len; i++){
					lkds.selectByKeyValue(true, arrKeyValues[i]);
				}
			}
		},
	
		_findData: function (event) {
			event = jQuery.event.fix( event || window.event );
			if (event.which != 13) {//enter
				return;
			}
			var Z = this;
			var findFldName = Z.comboSelectObj.searchField, 
				findValue = this.searchBoxEle.value;
			if (!findValue) {
				return;
			}
			var eventFunc = jslet.getFunction(Z.comboSelectObj.onGetSearchField);
			if (eventFunc) {
				findFldName = eventFunc.call(findValue);
			}
			var findFldNames = null;
			if(!findFldName) {
				var lkFldObj = Z.fieldObject.lookup(),
					codeFldName = lkFldObj.codeField(),
					nameFldName = lkFldObj.nameField();
				 
				findFldNames = [];
				codeFldName && findFldNames.push(codeFldName);
				nameFldName && codeFldName != nameFldName && findFldNames.push(nameFldName);
			} else {
				findFldNames = findFldName.split(',');
			}
			if(!findFldNames || findFldNames.length === 0) {
				console.warn('Search field NOT specified! Can\'t search data!')
				return;
			}
			var lkds = Z.lookupDs(), fldObj;
			for(var i = 0, len = findFldNames.length; i < len; i++) {
				findFldName = findFldNames[i];
				fldObj = lkds.getField(findFldName);
				if(!fldObj) {
					console.warn('Field Name: ' + findFldName + ' NOT exist!');
					return;
				}
				if(lkds.find('like([' + findFldName + '],"%' + findValue + '%")')) {
					break;
				}
			}
		},
	
		_confirmSelect: function () {
			var Z = this;
			var fldValue = Z.comboSelectObj.getValue(),
				fldObj = Z.dataset.getField(Z.field),
				lkfld = fldObj.lookup(),
				isMulti = Z.isMultiple(),
				lookupDs = Z.lookupDs();
			
			if(!lookupDs.checkSelectable()) {
				return;
			}
			if (isMulti) {
				fldValue = lookupDs.selectedKeyValues();
			} else {
				fldValue = lookupDs.keyValue();
			}
	
			Z.dataset.setFieldValue(Z.field, fldValue, Z._valueIndex);
			if (!isMulti && Z.comboSelectObj._afterSelect) {
				Z.comboSelectObj._afterSelect(Z.dataset, lookupDs);
			}
			if(!isMulti) {
				var fieldMap = lkfld.returnFieldMap();
				if(fieldMap) {
					var mainDs = Z.dataset,
						fldName, 
						lkFldName;
					for(var fldName in fieldMap) {
						lkFldName = fieldMap[fldName];
						Z.dataset.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
					}
				}
			}
			Z.closePopup();
		},
	
		destroy: function(){
			var Z = this;
			if (Z.otree){
				Z.otree.destroy();
				Z.otree = null;
			}
			if (Z.otable){
				Z.otable.destroy();
				Z.otable = null;
			}
			Z.comboSelectObj = null;
			
			var jqPanel = jQuery(Z.panel),
				jqFoot = jqPanel.find('.jl-combopnl-footer');
			jqFoot.find('.jl-combopnl-footer-cancel').off();
			jqFoot.find('.jl-combopnl-footer-ok').off();
			jQuery(Z.searchBoxEle).off();
			Z.fieldObject = null;
			
			Z.searchBoxEle = null;
			Z.popup = null;
			Z.panel = null;
		}
	};
	
	jslet.ui.register('DBComboSelect', jslet.ui.DBComboSelect);
	jslet.ui.DBComboSelect.htmlTemplate = '<div></div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbcustomcombobox.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	* @class DBCustomComboBox: used in jslet.ui.DBComboDlg and jslet.ui.DBDatePicker
	*/
	jslet.ui.DBCustomComboBox = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,textReadOnly';
			Z._textReadOnly = false;
			Z.enableInvalidTip = false;
	
			$super(el, params);
		},
	
		textReadOnly: function(textReadOnly) {
			if(textReadOnly === undefined) {
				return this._textReadOnly;
			}
			this._textReadOnly = textReadOnly ? true: false;
		},
		
		/**
		 * @override
		 */
		afterBind: function ($super) {
			$super();
			
			if (this._textReadOnly) {
				this.el.childNodes[0].readOnly = true;
			}
		},
	
		/**
		 * @override
		 */
		ctrlRecno: function($super, ctrlRecno) {
			var result = $super(ctrlRecno);
			if(ctrlRecno !== undefined) {
				this.textCtrl.ctrlRecno(ctrlRecno);
			}
			return result;
		},
		
		/**
		 * @override
		 */
		bind: function () {
			var Z = this;
			var jqEl = jQuery(Z.el);
			if (!jqEl.hasClass('input-group')) {
				jqEl.addClass('input-group');
			}
			var btnCls = Z.comboButtonCls ? Z.comboButtonCls:'fa-caret-down'; 
			var s = '<input type="text" class="form-control">' + 
	    	'<div class="jl-comb-btn-group"><button class="btn btn-default btn-sm" tabindex="-1"><i class="fa ' + btnCls + '"></i></button></div>'; 
			jqEl.html(s);
			var dbtext = jqEl.find('[type="text"]')[0];
			Z.textCtrl = new jslet.ui.DBText(dbtext, {
				type: 'dbtext',
				dataset: Z._dataset,
				field: Z._textField || Z._field,
				enableInvalidTip: true,
				valueIndex: Z._valueIndex
			});
			jQuery(Z.textCtrl.el).on('keydown', this.popupUp);
			Z.addChildControl(Z.textCtrl);
			
			var jqBtn = jqEl.find('button');
			if (this.buttonClick) {
				
				jqBtn.on('click', function(event){
					Z.buttonClick(jqBtn[0]);
				});
				jqBtn.on('focus', function (event) {
					jqEl.trigger('editing', [Z._field]);
				});
				
			}
		},
	
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl();
		},
		
		popupUp: function(event) {
			if(event.keyCode == jslet.ui.KeyCode.DOWN) {
				var Z = jslet(this);
				if(Z.ctrlRecno() < 0) {
					Z.doBlur(event);
					var el = jslet.ui.findJsletParent(this.parentNode);
					el.jslet.buttonClick();
				}
			}
		},
		
		focus: function() {
			this.textCtrl.focus();
		},
		
		/**
		 * @override
		 */
		forceRefreshControl: function(){
			this.textCtrl.forceRefreshControl();
		},
		
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this;
			if(!metaName || metaName == "disabled" || metaName == "readOnly") {
				var fldObj = Z._dataset.getField(Z._field),
					flag = fldObj.disabled() || fldObj.readOnly();
				var jqEl = jQuery(Z.el);
				jqEl.find('button').attr("disabled", flag);
			}
			if(!metaName || metaName == 'tabIndex') {
				Z.setTabIndex();
			}
	
		},
		
		/** 
		 * @override
		 */ 
		setTabIndex: function(tabIdx) {
			var Z = this;
			if(Z.inTableCtrl()) {
				return;
			}
			if(tabIdx !== 0 && !tabIdx) {
				fldObj = Z._dataset.getField(Z._field);
				if(fldObj) {
					tabIdx = fldObj.tabIndex();
				}
			}
			if(tabIdx === 0 || tabIdx) {
				Z.textCtrl.el.tabIndex = tabIdx;
			}	
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this;
			var dbbtn = Z.el.childNodes[1];
			dbbtn.onclick = null;
			jQuery(Z.textCtrl.el).off('keydown', this.popupUp);
			Z.textCtrl.destroy();
			Z.textCtrl = null;
			$super();
		}
	});
	
	
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbdatalabel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBDataLabel. 
	 * Show field value in a html label. 
	 * Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBDataLabel",dataset:"employee",field:"department"};
	 * 
	 * //1. Declaring:
	 * &lt;label data-jslet='type:"DBDataLabel",dataset:"employee",field:"department"' />
	 * or
	 * &lt;label data-jslet='jsletParam' />
	 *
	 *  //2. Binding
	 * &lt;label id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBDataLabel = jslet.Class.create(jslet.ui.DBFieldControl, {
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
		bind: function () {
			this.renderAll();
			jQuery(this.el).addClass('form-control-static jl-datalabel');//Bootstrap class
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'label';
		},
	
		doValueChanged: function() {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			var text = Z.getText();
			Z.el.innerHTML = text;
			Z.el.title = text;
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		}
	});
	
	jslet.ui.register('DBDataLabel', jslet.ui.DBDataLabel);
	jslet.ui.DBDataLabel.htmlTemplate = '<label></label>';
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbdatepicker.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBDatePicker. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBDatePicker",dataset:"employee",field:"birthday", textReadOnly:true};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBDatePicker",dataset:"employee",field:"birthday", textReadOnly:true' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 * 
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBDatePicker = jslet.Class.create(jslet.ui.DBCustomComboBox, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,textReadOnly,popupWidth, popupHeight';
			
			/**
			 * {Integer} Popup panel width
			 */
			Z._popupWidth = 260;
	
			/**
			 * {Integer} Popup panel height
			 */
			Z._popupHeight = 226;
	
			Z.popup = new jslet.ui.PopupPanel();
			
			Z.popup.onHidePopup = function() {
				Z.focus();
			};
			
			Z.comboButtonCls = 'fa-calendar';
	
			$super(el, params);
		},
	
		popupHeight: function(popupHeight) {
			if(popupHeight === undefined) {
				return this._popupHeight;
			}
			jslet.Checker.test('DBDatePicker.popupHeight', popupHeight).isGTEZero();
			this._popupHeight = parseInt(popupHeight);
		},
	
		popupWidth: function(popupWidth) {
			if(popupWidth === undefined) {
				return this._popupWidth;
			}
			jslet.Checker.test('DBDatePicker.popupWidth', popupWidth).isGTEZero();
			this._popupWidth = parseInt(popupWidth);
		},
			
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return true;
		},
	
		buttonClick: function (btnEle) {
			var el = this.el, 
				Z = this, 
				fldObj = Z._dataset.getField(Z._field),
				jqEl = jQuery(el);
			if (fldObj.readOnly() || fldObj.disabled()) {
				return;
			}
			var width = Z._popupWidth,
				height = Z._popupHeight,
				dateValue = Z.getValue(),
				range = fldObj.dataRange(),
				minDate = null,
				maxDate = null;
			
			if (range){
				if (range.min) {
					minDate = range.min;
				}
				if (range.max) {
					maxDate = range.max;
				}
			}
			if (!Z.contentPanel) {
				Z.contentPanel = jslet.ui.createControl({ type: 'Calendar', value: dateValue, minDate: minDate, maxDate: maxDate,
					onDateSelected: function (date) {
						Z.popup.hide();
						Z.el.focus();
						var value = Z.getValue();
						if(!value) {
							value = date;
						} else {
							value.setFullYear(date.getFullYear());
							value.setMonth(date.getMonth());
							value.setDate(date.getDate());
						}
						Z._dataset.setFieldValue(Z._field, new Date(value.getTime()), Z._valueIndex);
					}
				}, null, width + 'px', height + 'px', true); //Hide panel first
			}
			
			jslet.ui.PopupPanel.excludedElement = btnEle;//event.element();
			var r = jqEl.offset(), 
				h = jqEl.outerHeight(), 
				x = r.left, y = r.top + h;
			if (jslet.locale.isRtl){
				x = x + jqEl.outerWidth();
			}
			Z.popup.setContent(Z.contentPanel.el, '100%', '100%');
			Z.contentPanel.el.style.display = 'block';
			Z.contentPanel.setValue(dateValue);
			Z.popup.show(x, y, width + 3, height + 3, 0, h);
			Z.contentPanel.focus();
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this;
			if(Z.contentPanel) {
				Z.contentPanel.destroy();
				Z.contentPanel = null;
			}
			Z.popup.destroy();
			Z.popup = null;
			$super();
		}
		
	});
	
	jslet.ui.register('DBDatePicker', jslet.ui.DBDatePicker);
	jslet.ui.DBDatePicker.htmlTemplate = '<div></div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbhtml.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBHtml. 
	 * Display html text from one field. 
	 * Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBHtml",dataset:"employee",field:"comment"};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBHtml",dataset:"employee",field:"comment"' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 * 
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBHtml = jslet.Class.create(jslet.ui.DBFieldControl, {
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
		bind: function () {
			this.renderAll();
			jQuery(this.el).addClass('form-control');
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
	
		/**
		 * @override
		 */
		doValueChanged: function() {
			var content = this.getText();
			this.el.innerHTML = content;
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		}
	});
	
	jslet.ui.register('DBHtml', jslet.ui.DBHtml);
	jslet.ui.DBHtml.htmlTemplate = '<div style="width:200px;height:200px"></div>';
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.dblabel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBLabel. 
	 * Display field name, use this control to void hard-coding field name, and you can change field name dynamically. 
	 * Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBLabel",dataset:"employee",field:"department"};
	 * 
	 * //1. Declaring:
	 * &lt;label data-jslet='type:"DBLabel",dataset:"employee",field:"department"' />
	 * or
	 * &lt;label data-jslet='jsletParam' />
	 *
	 *  //2. Binding
	 * &lt;label id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBLabel = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			this.allProperties = 'dataset,field';
			this.isLabel = true;
			$super(el, params);
		},
	
		/**
		 * @override
		 */
		bind: function () {
			jQuery(this.el).addClass('control-label');
			this.renderAll();
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'label';
		},
	
		/**
		 * @override
		 */
		doMetaChanged: function(metaName) {
			if(metaName && jslet.ui.DBLabel.METANAMES.indexOf(metaName) < 0) {
				return;
			}
			var Z = this, subType = Z._fieldMeta,
				fldObj = Z._dataset.getField(Z._field),
				content = '';
			if(!fldObj) {
				throw new Error('Field: ' + this._field + ' NOT exist!');
			}
			if((!subType || subType == 'label') && (!metaName || metaName == 'label' || metaName == 'required')) {
				if (fldObj.required()) {
					content += '<span class="jl-lbl-required">' + 
						jslet.ui.DBLabel.REQUIREDCHAR + '</span>';
				}
				content += fldObj.label();
				Z.el.innerHTML = content || '';
				return;
			}
			if(subType && subType == 'tip' && 
				(!metaName || metaName == subType)) {
				content = fldObj.tip();
				Z.el.innerHTML = content || '';
				return;
			}
			if(subType  && subType == 'error' && 
				(metaName && metaName == subType)) {
				var errObj = Z.getFieldError();
				var content = errObj && errObj.message;
				Z.el.innerHTML = content || '';
				return;
			}
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var jqEl = jQuery(this.el),
				subType = this.fieldMeta();
			
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent());
			if(subType == 'error') {
				if(!jqEl.hasClass('jl-lbl-error')) {
					jqEl.addClass('jl-lbl-error');
				}
			} else 
			if(subType == 'tip') {
				if(!jqEl.hasClass('jl-lbl-tip')) {
					jqEl.addClass('jl-lbl-tip');
				}
			} else {
				if(!jqEl.hasClass('jl-lbl')) {
					jqEl.addClass('jl-lbl');
				}
			}
		}
	});
	
	jslet.ui.DBLabel.REQUIREDCHAR = '*';
	jslet.ui.DBLabel.METANAMES = ['label', 'required', 'tip', 'error'];
	jslet.ui.register('DBLabel', jslet.ui.DBLabel);
	jslet.ui.DBLabel.htmlTemplate = '<label></label>';
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dblookuplabel.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBLookupLabel. 
	 * Display field value according to another field and its value.
	 * Example:
	 * <pre><code>
	 * 		var jsletParam = {type:"DBLookupLabel",dataset:"department",lookupField:"deptcode", lookupValue: '0101', returnField: 'name'};
	 * 
	 * //1. Declaring:
	 *	  &lt;label data-jslet='{type:"DBLookupLabel",dataset:"department",lookupField:"deptcode", lookupValue: "0101", returnField: "name"}' />
	 *	  or
	 *	  &lt;label data-jslet='jsletParam' />
	 *	  
	 *  //2. Binding
	 *	  &lt;label id="ctrlId"  />
	 *  	//Js snippet
	 * 		var el = document.getElementById('ctrlId');
	 *  	jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 *  	jslet.ui.createControl(jsletParam, document.body);
	 *  	
	 * </code></pre>
	 */
	jslet.ui.DBLookupLabel = jslet.Class.create(jslet.ui.DBControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,lookupField,returnField,lookupValue';
			Z.requiredProperties = 'lookupValue,lookupField,returnField';
	
			/**
			 * {String} Lookup field name.
			 */
			Z.lookupField;
			/**
			 * {String} Lookup field value.
			 */
			Z.lookupValue;
			/**
			 * {String} Return field name.
			 */
			Z.returnField;
			$super(el, params);
		},
	
		/**
		 * @override
		 */
		bind: function () {
			this.renderAll();
			jQuery(this.el).addClass('form-control');
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'label';
		},
	
		/**
		 * @override
		 */
		refreshControl: function (evt, isForce) {
			if (evt.eventType != jslet.data.RefreshEvent.UPDATEALL) {
				return;
			}
			if (!isForce && !Z.isActiveRecord()) {
				return;
			}
			var Z = this;
			var result = Z.dataset.lookup(Z.lookupField, Z.lookupValue,
					Z.returnField);
			if (result == null) {
				result = 'NOT found: ' + Z.lookupValue;
			}
			Z.el.innerHTML = result;
		},
	
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent, true);
		}
	});
	jslet.ui.register('DBLookupLabel', jslet.ui.DBLookupLabel);
	jslet.ui.DBLookupLabel.htmlTemplate = '<label></label>';
	
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.dbradiogroup.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBRadioGroup. 
	 * Display a group of radio that user can select one option. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBRadioGroup",dataset:"employee",field:"department"};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBRadioGroup",dataset:"employee",field:"department"'' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 * 
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 * 
	 * </code></pre>
	 */
	jslet.ui.DBRadioGroup = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,columnCount';
			/**
			 * {Integer} Column count
			 */
			Z._columnCount = 99999;
			Z._itemIds = null;
			$super(el, params);
		},
	
		columnCount: function(columnCount) {
			if(columnCount === undefined) {
				return this._columnCount;
			}
			jslet.Checker.test('DBRadioGroup.columnCount', columnCount).isGTEZero();
			this._columnCount = parseInt(columnCount);
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
			var jqEl = jQuery(Z.el);
			jqEl.on('click', 'input[type="radio"]', function(event){
				var ctrl = this;
				window.setTimeout(function(){ //Defer firing 'updateToDataset' when this control is in DBTable to make row changed firstly.
					event.delegateTarget.jslet.updateToDataset(ctrl);
				}, 5)
			});
			jqEl.on('focus', 'input[type="radio"]', function (event) {
				jqEl.trigger('editing', [Z._field]);
			});
			jqEl.addClass('form-control');//Bootstrap class
			jqEl.css('height', 'auto');
		},
	
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName) {
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
				var disabled = fldObj.disabled(),
					readOnly = fldObj.readOnly();
			
				Z.disabled = disabled || readOnly;
				disabled = Z.disabled;
				var radios = jQuery(Z.el).find('input[type="radio"]'),
					required = fldObj.required(),
					radioEle,
					tabIdx = fldObj.tabIndex();
				
				for(var i = 0, cnt = radios.length; i < cnt; i++){
					radioEle = radios[i];
					jslet.ui.setEditableStyle(radioEle, disabled, readOnly, false, required);
					radioEle.tabIndex = tabIdx;
				}
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var value = Z.getValue(),
				radios = jQuery(Z.el).find('input[type="radio"]'), 
				radio;
			for(var i = 0, cnt = radios.length; i < cnt; i++){
				radio = radios[i];
				radio.checked = (value == jQuery(radio.parentNode).attr('value'));
			}
		},
		
		/**
		 * @override
		 */
		doLookupChanged: function () {
			var Z = this;
			var fldObj = Z._dataset.getField(Z._field), lkf = fldObj.lookup();
			if (!lkf) {
				console.error(jslet.formatString(jslet.locale.Dataset.lookupNotFound,
						[fldObj.name()]));
				return;
			}
			var lkds = lkf.dataset(),
			cnt = lkds.recordCount();
			if(cnt === 0) {
				Z.el.innerHTML = jslet.locale.DBRadioGroup.noOptions;
				return;
			}
			var oldRecno = lkds.recno();
			try {
				var template = ['<table cellpadding="0" cellspacing="0">'],
					isNewRow = false, 
					itemId;
				var editFilter = lkf.editFilter();
				Z._innerEditFilterExpr = null;
				var editItemDisabled = lkf.editItemDisabled();
				if(editFilter) {
					Z._innerEditFilterExpr = new jslet.Expression(lkds, editFilter);
				}
				var disableOption = false, k = -1;
				
				Z._itemIds = [];
				for (var i = 0; i < cnt; i++) {
					lkds.recnoSilence(i);
					disableOption = false;
					if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
						if(!editItemDisabled) {
							continue;
						} else {
							disableOption = true;
						}
					}
					k++;
					isNewRow = (k % Z._columnCount === 0);
					if (isNewRow) {
						if (k > 0) {
							template.push('</tr>');
						}
						template.push('<tr>');
					}
					itemId = jslet.nextId();
					Z._itemIds.push(itemId);
					template.push('<td style="white-space: nowrap" value="');
					template.push(lkds.getFieldValue(lkf.keyField()));
					template.push('"><input name="');
					template.push(Z._field);
					template.push('" type="radio"  id="');
					template.push(itemId);
					template.push('" ' + (disableOption? ' disabled': '') + '/><label for="');
					template.push(itemId);
					template.push('">');
					template.push(lkf.getCurrentDisplayValue());
					template.push('</label></td>');
				} // end while
				if (cnt > 0) {
					template.push('</tr>');
				}
				template.push('</table>');
				Z.el.innerHTML = template.join('');
			} finally {
				lkds.recnoSilence(oldRecno);
			}
	
		}, // end renderOptions
	
		updateToDataset: function(currCheckBox) {
			var Z = this;
			if (Z._keep_silence_ || Z.disabled) {
				return;
			}
			Z._keep_silence_ = true;
			try {
				Z._dataset.setFieldValue(Z._field, jQuery(currCheckBox.parentNode).attr('value'));
				currCheckBox.checked = true;
			} finally {
				Z._keep_silence_ = false;
			}
		},
		
		focus: function() {
			if (_itemIds && _itemIds.length > 0) {
				document.getElementById(_itemIds[0]).focus();
			}
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var Z = this, 
				jqEl = jQuery(Z.el);
			if(!jqEl.hasClass("jl-radiogroup")) {
				jqEl.addClass("jl-radiogroup");
			}
			Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var jqEl = jQuery(this.el);
			jqEl.off();
			$super();
		}
	});
	
	jslet.ui.register('DBRadioGroup', jslet.ui.DBRadioGroup);
	jslet.ui.DBRadioGroup.htmlTemplate = '<div></div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbrangeselect.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBRangeSelect. 
	 * Display a select which options produce with 'beginItem' and 'endItem'. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBRangeSelect",dataset:"employee",field:"age",beginItem:10,endItem:100,step:5};
	 * 
	 * //1. Declaring:
	 * &lt;select data-jslet='type:"DBRangeSelect",dataset:"employee",field:"age",beginItem:10,endItem:100,step:5' />
	 * or
	 * &lt;select data-jslet='jsletParam' />
	 * 
	 *  //2. Binding
	 * &lt;select id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBRangeSelect = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,beginItem,endItem,step';
			if (!Z.requiredProperties) {
				Z.requiredProperties = 'field,beginItem,endItem,step';
			}
	
			/**
			 * {Integer} Begin item 
			 */
			Z._beginItem = 0;
			/**
			 * {Integer} End item
			 */
			Z._endItem = 10;
			/**
			 * {Integer} Step
			 */
			Z._step = 1;
			$super(el, params);
		},
	
		beginItem: function(beginItem) {
			if(beginItem === undefined) {
				return this._beginItem;
			}
			jslet.Checker.test('DBRangeSelect.beginItem', beginItem).isNumber();
			this._beginItem = parseInt(beginItem);
		},
	
		endItem: function(endItem) {
			if(endItem === undefined) {
				return this._endItem;
			}
			jslet.Checker.test('DBRangeSelect.endItem', endItem).isNumber();
			this._endItem = parseInt(endItem);
		},
	
		step: function(step) {
			if(step === undefined) {
				return this._step;
			}
			jslet.Checker.test('DBRangeSelect.step', step).isNumber();
			this._step = parseInt(step);
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return (el.tagName.toLowerCase() == 'select');
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field),
				valueStyle = fldObj.valueStyle();
			
			if(Z.el.multiple && valueStyle != jslet.data.FieldValueStyle.MULTIPLE) {
				fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
			} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && !Z.el.multiple) {
				Z.el.multiple = "multiple";	
			}
			Z.renderAll();
			var jqEl = jQuery(Z.el);
			jqEl.on('change', Z._doChanged);// end observe
			jqEl.focus(function(event) {
				jqEl.trigger('editing', [Z._field]);
			});
			if(Z.el.multiple) {
				jqEl.on('click', 'option', function () {
					Z._currOption = this;
				});// end observe
			}
			jqEl.addClass('form-control');//Bootstrap class
		}, // end bind
	
		_doChanged: function (event) {
			var Z = this.jslet;
			if(Z.el.multiple) {
				if(Z.inProcessing) {
					Z.inProcessing = false;
				}
				var fldObj = Z._dataset.getField(Z._field),
					limitCount = fldObj.valueCountLimit();
				if(limitCount) {
					var values = Z.getValue(),
						count = 1;
					if(jslet.isArray(values)) {
						count = values.length;
					}
					if (count >= limitCount) {
						jslet.showInfo(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
								[''	+ limitCount]));
						
						window.setTimeout(function(){
							if(Z._currOption) {
								Z.inProcessing = true;
								Z._currOption.selected = false;
							}
						}, 10);
						return;
					}
				}
			}
			this.jslet.updateToDataset();
		},
			
		renderOptions: function () {
			var Z = this,
				arrhtm = [];
			
			var fldObj = Z._dataset.getField(Z._field);
			if (!fldObj.required()){
				arrhtm.push('<option value="_null_">');
				arrhtm.push(fldObj.nullText());
				arrhtm.push('</option>');
			}
	
			for (var i = Z._beginItem; i <= Z._endItem; i += Z._step) {
				arrhtm.push('<option value="');
				arrhtm.push(i);
				arrhtm.push('">');
				arrhtm.push(i);
				arrhtm.push('</option>');
			}
			jQuery(Z.el).html(arrhtm.join(''));
		}, // end renderOptions
	
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly") {
				var disabled = fldObj.disabled() || fldObj.readOnly();
				Z.el.disabled = disabled;
				jslet.ui.setEditableStyle(Z.el, disabled, disabled, true, fldObj.required());
			}
			if(!metaName || metaName == 'tabIndex') {
				Z.setTabIndex();
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
	
			if (!Z.el.multiple) {
				var value = Z.getValue();
				if (value !== null) {
					Z.el.value = value;
				} else {
					Z.el.value = null;
				}
			} else {
				var arrValue = Z.getValue(),
					optCnt = Z.el.options.length, opt, selected, i;
				Z._keep_silence_ = true;
				try {
					for (i = 0; i < optCnt; i++) {
						opt = Z.el.options[i];
						if (opt) {
							opt.selected = false;
						}
					}
	
					var vcnt = arrValue.length - 1;
					for (i = 0; i < optCnt; i++) {
						opt = Z.el.options[i];
						for (j = vcnt; j >= 0; j--) {
							selected = (arrValue[j] == opt.value);
							if (selected) {
								opt.selected = selected;
							}
						} // end for j
					} // end for i
				} finally {
					Z._keep_silence_ = false;
				}
			}
		},
		
		focus: function() {
			this.el.focus();
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			this.renderOptions();
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		},
	
		updateToDataset: function () {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var value,
				isMulti = Z.el.multiple;
			if (!isMulti) {
				value = Z.el.value;
				var fldObj = Z._dataset.getField(Z._field);
				if (value == '_null_' && !fldObj.required()) {
					value = null;
				}
			} else {
				var opts = jQuery(Z.el).find('option'),
					optCnt = opts.length - 1;
				value = [];
				for (var i = 0; i <= optCnt; i++) {
					opt = opts[i];
					if (opt.selected) {
						value.push(opt.value);
					}
				}
			}
			Z._keep_silence_ = true;
			try {
				if (!isMulti) {
					Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
				} else {
					Z._dataset.setFieldValue(Z._field, value);
				}
			} finally {
				Z._keep_silence_ = false;
			}
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			jQuery(this.el).off();
			$super();
		}
	});
	
	jslet.ui.register('DBRangeSelect', jslet.ui.DBRangeSelect);
	jslet.ui.DBRangeSelect.htmlTemplate = '<select></select>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbrating.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBRating. 
	 * A control which usually displays some star to user, and user can click to rate something. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBRating",dataset:"employee",field:"grade", itemCount: 5};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBRating",dataset:"employee",field:"grade"', itemCount: 5' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 * 
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBRating = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,itemCount,splitCountitemWidth';
			/**
			 * {Integer} Rate item count, In other words, the count of 'Star' sign.
			 */
			Z._itemCount = 5;
			/**
			 * {Integer} You can use it to split the 'Star' sign to describe decimal like: 1.5, 1.25.
			 * SplitCount equals 2, that means cut 'Star' sign into two part, it can express: 0, 0.5, 1, 1.5, ...
			 */
			Z._splitCount = 1;
			/**
			 * {Integer} The width of one 'Star' sign.
			 */
			Z._itemWidth = 20;
			/**
			 * {Boolean} Required or not. If it is not required, you can rate 0 by double clicking first item. 
			 */
			Z._required = false;
			/**
			 * {Boolean} read only or not.
			 */
			Z._readOnly = false;
			
			$super(el, params);
		},
	
		itemCount: function(itemCount) {
			if(itemCount === undefined) {
				return this._itemCount;
			}
			jslet.Checker.test('DBRating.itemCount', itemCount).isGTZero();
			this._itemCount = parseInt(itemCount);
		},
	
		splitCount: function(splitCount) {
			if(splitCount === undefined) {
				return this._splitCount;
			}
			jslet.Checker.test('DBRating.splitCount', splitCount).isGTZero();
			this._splitCount = parseInt(splitCount);
		},
	
		itemWidth: function(itemWidth) {
			if(itemWidth === undefined) {
				return this._itemWidth;
			}
			jslet.Checker.test('DBRating.itemWidth', itemWidth).isGTZero();
			this._itemWidth = parseInt(itemWidth);
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'div';
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this;
	
			Z.renderAll();
			var jqEl = jQuery(Z.el);
			jqEl.on('mousedown', 'td', Z._mouseDown);
			jqEl.on('mousemove', 'td', Z._mouseMove);
			jqEl.on('mouseout', 'td', Z._mouseOut);
			jqEl.on('mouseup', 'td', Z._mouseUp);
		}, // end bind
	
		_mouseMove: function domove(event) {
			event = jQuery.event.fix( event || window.event );
			var rating = event.delegateTarget, Z = rating.jslet;
			if (Z._readOnly) {
				return;
			}
			var jqRating = jQuery(rating),
				x1 = event.pageX - jqRating.offset().left,
				k = Math.ceil(x1 / Z.splitWidth), offsetW,
				oRow = rating.firstChild.rows[0],
				itemCnt = oRow.cells.length;
	
			var valueNo = this.cellIndex + 1;
			for (var i = 0; i < itemCnt; i++) {
				var oitem = oRow.cells[i];
				Z._setBackgroundPos(oitem, Z._getPosX(i % Z._splitCount, i < valueNo ? 1: 2));
			}
		},
	
		_mouseOut: function doout(event) {
			event = jQuery.event.fix( event || window.event );
			var Z = event.delegateTarget.jslet;
			if (Z._readOnly) {
				return;
			}
			Z.doValueChanged();
		},
	
		_mouseDown: function dodown(event) {
			event = jQuery.event.fix( event || window.event );
			var rating = event.delegateTarget,
			Z = rating.jslet;
			if (Z._readOnly) {
				return;
			}
			var oRow = rating.firstChild.rows[0],
				itemCnt = oRow.cells.length;
			
			//if can set zero and current item is first one, then clear value
			var k = this.cellIndex+1;
			if (!Z._required && k == 1) {
				k = (Z.value * Z._splitCount) == 1 ? 0 : 1;
			}
			Z.value = k / Z._splitCount;
			Z._dataset.setFieldValue(Z._field, Z.value, Z._valueIndex);
			Z.doValueChanged();
		},
	
		_mouseUp: function(event) {
			event = jQuery.event.fix( event || window.event );
			var rating = event.delegateTarget,
				oRow = rating.firstChild.rows[0],
				Z = rating.jslet;
			if (Z._readOnly) {
				return;
			}
			if (Z._selectedItem >= 0) {
				var oitem = oRow.cells[Z._selectedItem];
				Z._setBackgroundPos(oitem, Z._selectedPx);
			}
		},
	
		_getPosX: function(index, status){
			var Z = this, isRtl = jslet.locale.isRtl,bgX;
			bgX = 0 - status * Z._itemWidth;
			if (isRtl){
				bgX += (index+1)*Z.splitWidth - Z._itemWidth;
			} else {
				bgX -= index * Z.splitWidth;
			}
			return bgX;
		},
		
		_setBackgroundPos: function (oitem, posX) {
			if (oitem.style.backgroundPositionX !== undefined) {
				oitem.style.backgroundPositionX = posX + 'px';
			} else {
				oitem.style.backgroundPosition = posX + 'px 0px';
			}
		},
	
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly") {
				Z._readOnly = fldObj.disabled() || fldObj.readOnly();
			}
			if(!metaName || metaName == "required") {
				Z._required = fldObj.required();
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field),
				value = Z.getValue(),
				itemCnt = Z._itemCount * Z._splitCount,
				valueNo = Math.ceil(value * Z._splitCount),
				oitem, offsetW, bgX, ratingRow = Z.el.firstChild.rows[0],
				bgW = Z._itemWidth * 2,
				isRtl = jslet.locale.isRtl;
			
			Z.value = value;
			for (var i = 0; i < itemCnt; i++) {
				oitem = ratingRow.childNodes[i];
				Z._setBackgroundPos(oitem, Z._getPosX(i % Z._splitCount, i < valueNo ? 0: 2));
			}
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var Z = this, 
				fldObj = Z._dataset.getField(Z._field);
			var jqEl = jQuery(Z.el);
			if (!jqEl.hasClass('jl-rating')) {
				jqEl.addClass('jl-rating');
			}
			jqEl.html('<table border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;border-collapse:collapse"><tr></tr></table>');
	
			var oitem, itemCnt = Z._itemCount * Z._splitCount,
				otr = Z.el.firstChild.rows[0];
				
			Z.splitWidth = parseInt(Z._itemWidth / Z._splitCount);
			for (var i = 1; i <= itemCnt; i++) {
				oitem = document.createElement('td');
				oitem.className = 'jl-rating-item';
				oitem.style.width = Z.splitWidth + 'px';
				oitem.style.height = Z._itemWidth + 'px';
				oitem.title = i / Z._splitCount;
				otr.appendChild(oitem);
			}
			jqEl.width(Z._itemCount * Z._itemWidth);
			Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		}, // end renderAll
	
		/**
		 * @override
		 */
		destroy: function($super){
			var jqEl = jQuery(Z.el);
			jqEl.off();
			
			$super();
		}
	});
	
	jslet.ui.DBRating.CHECKED = 0;
	jslet.ui.DBRating.UNCHECKED = 1;
	jslet.ui.DBRating.FOCUS = 2;
	
	jslet.ui.register('DBRating', jslet.ui.DBRating);
	jslet.ui.DBRating.htmlTemplate = '<Div></Div>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbselect.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBSelect. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBSelect",dataset:"employee",field:"department"};
	 * 
	 * //1. Declaring:
	 * &lt;select data-jslet='type:"DBSelect",dataset:"employee",field:"department"' />
	 * or
	 * &lt;select data-jslet='jsletParam' />
	 *
	 *  //2. Binding
	 * &lt;select id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 * 
	 * </code></pre>
	 */
	jslet.ui.DBSelect = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,groupField,lookupDataset';
			/**
			 * {String} Group field name, you can use this to group options.
			 * Detail to see html optgroup element.
			 */
			Z._groupField = null;
			
			/**
			 * {String or jslet.data.Dataset} It will use this dataset to render Select Options.
			 */
			Z._lookupDataset = null;
			
			Z._enableInvalidTip = true;
			
			Z._innerEditFilterExpr;
			$super(el, params);
		},
	
		groupField: function(groupField) {
			if(groupField === undefined) {
				return this._groupField;
			}
			groupField = jQuery.trim(groupField);
			jslet.Checker.test('DBSelect.groupField', groupField).isString();
			this._groupField = groupField;
		},
		
		lookupDataset: function(lookupDataset) {
			if(lookupDataset === undefined) {
				return this._lookupDataset;
			}
	
			if (jslet.isString(lookupDataset)) {
				lookupDataset = jslet.data.dataModule.get(jQuery.trim(lookupDataset));
			}
			
			jslet.Checker.test('DBSelect.lookupDataset', lookupDataset).isClass(jslet.data.Dataset.className);
			this._lookupDataset = lookupDataset;
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return (el.tagName.toLowerCase() == 'select');
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field),
				valueStyle = fldObj.valueStyle();
			
			if(Z.el.multiple && valueStyle != jslet.data.FieldValueStyle.MULTIPLE) {
				fldObj.valueStyle(jslet.data.FieldValueStyle.MULTIPLE);
			} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE && !Z.el.multiple) {
				Z.el.multiple = "multiple";	
			}
			Z.renderAll();
	
			var jqEl = jQuery(Z.el);
			jqEl.on('change', Z._doChanged);
			jqEl.on('mousedown', Z._doMouseDown);
			jqEl.focus(function(event) {
				jqEl.trigger('editing', [Z._field]);
			});
			if(Z.el.multiple) {
				jqEl.on('click', 'option', Z._doCheckLimitCount);
			}
			jqEl.addClass('form-control');//Bootstrap class
			Z.doMetaChanged('required');
		}, // end bind
	
		_doMouseDown: function(event) {
			var Z = this.jslet,
				ctrlRecno = Z.ctrlRecno();
			if(ctrlRecno >= 0 && ctrlRecno != Z._dataset.recno()) {
				Z._skipRefresh = true;
				try {
					Z._dataset.recno(ctrlRecno);
				} finally {
					Z._skipRefresh = false;
				}
			}
		},
		
		_doChanged: function (event) {
			var Z = this.jslet;
			if(Z.el.multiple) {
				if(Z.inProcessing) {
					Z.inProcessing = false;
				}
				var fldObj = Z._dataset.getField(Z._field),
					limitCount = fldObj.valueCountLimit();
	
				if(limitCount) {
					var values = Z._dataset.getFieldValue(Z._field),
						count = 1;
					if(jslet.isArray(values)) {
						count = values.length;
					}
					if (count >= limitCount) {
						jslet.showInfo(jslet.formatString(jslet.locale.DBCheckBoxGroup.invalidCheckedCount,
								[''	+ limitCount]));
						
						window.setTimeout(function(){
							if(Z._currOption) {
								Z.inProcessing = true;
								Z._currOption.selected = false;
							}
						}, 10);
						return;
					}
				}
			}
			this.jslet.updateToDataset();
		},
		
		_doCheckLimitCount: function(event) {
			var Z = event.delegateTarget.jslet;
			Z._currOption = this;
		},
	
		_setDefaultValue: function(fldObj, firstItemValue) {
			if(!firstItemValue || !fldObj.required()) {
				return;
			}
			var dftValue = fldObj.defaultValue();
			if(dftValue) {
				var lkds = fldObj.lookup().dataset();
				var found = lkds.findByKey(dftValue);
				if(found) {
					return;
				} else {
					dftValue = null;
				}
			}
			
			if(!dftValue) {
				fldObj.defaultValue(firstItemValue);
			}
			if(this._dataset.changedStatus() && !fldObj.getValue()) {
				fldObj.setValue(firstItemValue);
			}
		},
		
		/**
		 * @override
		 */
		doLookupChanged: function () {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field),
				lkf = fldObj.lookup();
			if(Z._lookupDataset) {
				lkf = new jslet.data.FieldLookup();
				lkf.dataset(Z._lookupDataset);
			} else {
				if (!lkf) {
					return;
				}
			}
			var lkds = lkf.dataset(),
				groupIsLookup = false,
				groupLookup, 
				groupFldObj, 
				extraIndex;
	
			if (Z._groupField) {
				groupFldObj = lkds.getField(Z._groupField);
				if (groupFldObj === null) {
					throw 'NOT found field: ' + Z._groupField + ' in ' + lkds.name();
				}
				groupLookup = groupFldObj.lookup();
				groupIsLookup = (groupLookup !== null);
				if (groupIsLookup) {
					extraIndex = Z._groupField + '.' + groupLookup.codeField();
				} else {
					extraIndex = Z._groupField;
				}
				var indfld = lkds.indexFields();
				if (indfld) {
					lkds.indexFields(extraIndex + ';' + indfld);
				} else {
					lkds.indexFields(extraIndex);
				}
			}
			var preGroupValue = null, groupValue, groupDisplayValue, content = [];
	
			if (!Z.el.multiple && !fldObj.required()){
				content.push('<option value="_null_">');
				content.push(fldObj.nullText());
				content.push('</option>');
			}
			var oldRecno = lkds.recno(),
				optValue, optDispValue, 
				firstItemValue = null,
				editFilter = lkf.editFilter();
			Z._innerEditFilterExpr = null;
			var editItemDisabled = lkf.editItemDisabled();
			if(editFilter) {
				Z._innerEditFilterExpr = new jslet.Expression(lkds, editFilter);
			}
			var disableOption = false;
			try {
				for (var i = 0, cnt = lkds.recordCount(); i < cnt; i++) {
					lkds.recnoSilence(i);
					disableOption = false;
					if(Z._innerEditFilterExpr && !Z._innerEditFilterExpr.eval()) {
						if(!editItemDisabled) {
							continue;
						} else {
							disableOption = true;
						}
					}
					if (Z._groupField) {
						groupValue = lkds.getFieldValue(Z._groupField);
						if (groupValue != preGroupValue) {
							if (preGroupValue !== null) {
								content.push('</optgroup>');
							}
							if (groupIsLookup) {
								if (!groupLookup.dataset()
												.findByField(
														groupLookup
																.keyField(),
														groupValue)) {
									throw 'Not found: [' + groupValue + '] in Dataset: [' +
										groupLookup.dataset().name() +
										']field: [' + groupLookup.keyField() + ']';
								}
								groupDisplayValue = groupLookup.getCurrentDisplayValue();
							} else
								groupDisplayValue = groupValue;
	
							content.push('<optgroup label="');
							content.push(groupDisplayValue);
							content.push('">');
							preGroupValue = groupValue;
						}
					}
					content.push('<option value="');
					optValue = lkds.getFieldValue(lkf.keyField());
					if(firstItemValue === null) {
						firstItemValue = optValue;
					}
					content.push(optValue);
					content.push('"'+ (disableOption? ' disabled': '') +  '>');
					content.push(lkf.getCurrentDisplayValue());
					content.push('</option>');
				} // end for
				if (preGroupValue !== null) {
					content.push('</optgroup>');
				}
				jQuery(Z.el).html(content.join(''));
				Z._setDefaultValue(fldObj, firstItemValue);
				Z.doValueChanged();
			} finally {
				lkds.recnoSilence(oldRecno);
			}
		}, // end renderOptions
	
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly") {
				var disabled = fldObj.disabled() || fldObj.readOnly();
				Z.el.disabled = disabled;
				jslet.ui.setEditableStyle(Z.el, disabled, disabled, true, fldObj.required());
			}
			if(metaName && metaName == 'required') {
				var jqEl = jQuery(Z.el);
				if (fldObj.required()) {
					jqEl.addClass('jl-ctrl-required');
				} else {
					jqEl.removeClass('jl-ctrl-required');
				}
			}
			if(!metaName || metaName == 'tabIndex') {
				Z.setTabIndex();
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if (Z._skipRefresh) {
				return;
			}
			var errObj = Z.getFieldError();
			if(errObj && errObj.message) {
				Z.el.value = errObj.inputText;
				Z.renderInvalid(errObj);
				return;
			} else {
				Z.renderInvalid(null);
			}
			var value = Z.getValue();
			if(!Z.el.multiple && value === Z.el.value) {
				return;
			}
			var optCnt = Z.el.options.length, 
				opt, i;
			for (i = 0; i < optCnt; i++) {
				opt = Z.el.options[i];
				if (opt) {
					opt.selected = false;
				}
			}
			
			var fldObj = Z._dataset.getField(Z._field);
			if (!Z.el.multiple) {
				if(!Z._checkOptionEditable(fldObj, value)) {
					value = null;
				}
				if (value === null){
					if (!fldObj.required()) {
						value = '_null_';
					}
				}
				Z.el.value = value;
			} else {
				var arrValue = value;
				if(arrValue === null || arrValue.length === 0) {
					return;
				}
					
				var vcnt = arrValue.length - 1, selected;
				Z._skipRefresh = true;
				try {
					for (i = 0; i < optCnt; i++) {
						opt = Z.el.options[i];
	
						for (j = vcnt; j >= 0; j--) {
							selected = (arrValue[j] == opt.value);
							if (selected) {
								opt.selected = selected;
							}
						} // end for j
					} // end for i
				} finally {
					Z._skipRefresh = false;
				}
			}
		},
	 
		_checkOptionEditable: function(fldObj, fldValue) {
			var Z = this;
			if(!Z._innerEditFilterExpr || fldValue === null || fldValue === undefined || fldValue === '') {
				return true;
			}
			var lkDs = fldObj.lookup().dataset(); 
			if(lkDs.findByKey(fldValue) && !Z._innerEditFilterExpr.eval()) {
				return false;
			} else {
				return true;
			}
		},
		
		focus: function() {
			this.el.focus();
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		},
	
		updateToDataset: function () {
			var Z = this;
			if (Z._skipRefresh) {
				return;
			}
			var opt, value,
				isMulti = Z.el.multiple;
			if (!isMulti) {
				value = Z.el.value;
				if (!value) {
					opt = Z.el.options[Z.el.selectedIndex];
					value = opt.innerHTML;
				}
			} else {
				var opts = jQuery(Z.el).find('option'),
					optCnt = opts.length - 1;
				value = [];
				for (var i = 0; i <= optCnt; i++) {
					opt = opts[i];
					if (opt.selected) {
						value.push(opt.value ? opt.value : opt.innerHTML);
					}
				}
			}
	
			Z._skipRefresh = true;
			try {
				if (!isMulti) {
					var fldObj = Z._dataset.getField(Z._field);
					if (value == '_null_' && !fldObj.required()) {
						value = null;
					}
					Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
					var lkfldObj = fldObj.lookup(),
						fieldMap = lkfldObj.returnFieldMap();
					if(fieldMap) {
						var lookupDs = lkfldObj.dataset();
							mainDs = Z._dataset;
						if(lookupDs.findByKey(value)) {
							var fldName, lkFldName;
							for(var fldName in fieldMap) {
								lkFldName = fieldMap[fldName];
								mainDs.setFieldValue(fldName, lookupDs.getFieldValue(lkFldName));
							}
						}
					}				
				} else {
					Z._dataset.setFieldValue(Z._field, value);
				}
				
			} finally {
				Z._skipRefresh = false;
			}
		}, // end updateToDataset
		
		/**
		 * @override
		 */
		destroy: function($super){
			this._currOption = null;
			jQuery(this.el).off();
			$super();
		}
	});
	
	jslet.ui.register('DBSelect', jslet.ui.DBSelect);
	jslet.ui.DBSelect.htmlTemplate = '<select></select>';
	
	/* ========================================================================
	 * Jslet framework: jslet.dbspinedit.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBSpinEdit. 
	 * <pre><code>
	 * var jsletParam = {type:"DBSpinEdit",dataset:"employee",field:"age", minValue:18, maxValue: 100, step: 5};
	 * 
	 * //1. Declaring:
	 * &lt;div data-jslet='type:"DBSpinEdit",dataset:"employee",field:"age", minValue:18, maxValue: 100, step: 5' />
	 * or
	 * &lt;div data-jslet='jsletParam' />
	 *
	 *  //2. Binding
	 * &lt;div id="ctrlId"  />
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBSpinEdit = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,step';
			/**
			 * {Integer} Step value.
			 */
			Z._step = 1;
	
			$super(el, params);
		},
	
		step: function(step) {
			if(step === undefined) {
				return this._step;
			}
			jslet.Checker.test('DBSpinEdit.step', step).isNumber();
			this._step = step;
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			var tag = el.tagName.toLowerCase();
			return tag == 'div';
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this,
				jqEl = jQuery(Z.el);
			if(!jqEl.hasClass('jl-spinedit')) {
				jqEl.addClass('input-group jl-spinedit');
			}
			Z._createControl();
			Z.renderAll();
		}, // end bind
	
		_createControl: function() {
			var Z = this,
				jqEl = jQuery(Z.el),
				s = '<input type="text" class="form-control">' + 
			    	'<div class="jl-spinedit-btn-group">' +
			    	'<button class="btn btn-default jl-spinedit-up" tabindex="-1"><i class="fa fa-caret-up"></i></button>' + 
			    	'<button class="btn btn-default jl-spinedit-down" tabindex="-1"><i class="fa fa-caret-down"></i></button>';
			jqEl.html(s);
			
			var editor = jqEl.find('input')[0],
				upButton = jqEl.find('.jl-spinedit-up')[0],
				downButton = jqEl.find('.jl-spinedit-down')[0];
			Z.editor = editor;
			jQuery(Z.editor).on("keydown", function(event){
				if(Z._isDisabled()) {
					return;
				}
				var keyCode = event.keyCode;
				if(keyCode == jslet.ui.KeyCode.UP) {
					Z.decValue();
					event.preventDefault();
					return;
				}
				if(keyCode == jslet.ui.KeyCode.DOWN) {
					Z.incValue();
					event.preventDefault();
					return;
				}
			});
			new jslet.ui.DBText(editor, {
				dataset: Z._dataset,
				field: Z._field,
				beforeUpdateToDataset: Z.beforeUpdateToDataset,
				valueIndex: Z._valueIndex
			});
			
			jQuery(upButton).on('click', function () {
				Z.incValue();
			});
			
			jQuery(upButton).on('focus', function () {
				jqEl.trigger('editing', [Z._field]);
			});
			
			jQuery(downButton).on('click', function () {
				Z.decValue();
			});
			
			jQuery(downButton).on('focus', function () {
				jqEl.trigger('editing', [Z._field]);
			});
			
		},
		
		/** 
		 * @override
		 */ 
		setTabIndex: function(tabIdx) {
			var Z = this;
			if(Z.inTableCtrl()) {
				return;
			}
			
			if(tabIdx !== 0 && !tabIdx) {
				fldObj = Z._dataset.getField(Z._field);
				if(fldObj) {
					tabIdx = fldObj.tabIndex();
				}
			}
			if(tabIdx === 0 || tabIdx) {
				Z.textCtrl.el.tabIndex = tabIdx;
			}	
		},
		
		_isDisabled: function() {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			return fldObj.disabled() || fldObj.readOnly();
		},
		
		/**
		 * @override
		 */
		beforeUpdateToDataset: function () {
			var Z = this,
				val = Z.el.value;
			var fldObj = Z._dataset.getField(Z._field),
				range = fldObj.dataRange(),
				minValue = Number.NEGATIVE_INFINITY, 
				maxValue = Number.POSITIVE_INFINITY;
			
			if(range) {
				if(range.min) {
					minValue = parseFloat(range.min);
				}
				if(range.max) {
					maxValue = parseFloat(range.max);
				}
			}
			if (val) {
				val = parseFloat(val);
	//			if (val) {
	//				if (val > maxValue)
	//					val = maxValue;
	//				else if (val < minValue)
	//					val = minValue;
	//				val = String(val);
	//			}
			}
			jQuery(Z.el).attr('aria-valuenow', val);
			Z.el.value = val;
			return true;
		}, // end beforeUpdateToDataset
	
		setValueToDataset: function (val) {
			var Z = this;
			if (Z.silence) {
				return;
			}
			Z.silence = true;
			if (val === undefined) {
				val = Z.value;
			}
			try {
				Z._dataset.setFieldValue(Z._field, val, Z._valueIndex);
			} finally {
				Z.silence = false;
			}
		}, // end setValueToDataset
	
		incValue: function () {
			var Z = this,
				val = Z.getValue();
			if (!val) {
				val = 0;
			}
			var maxValue = Z._getRange().maxValue;
			if (val == maxValue) {
				return;
			} else if (val < maxValue) {
				val += Z._step;
			} else {
				val = maxValue;
			}
			if (val > maxValue) {
				value = maxValue;
			}
			jQuery(Z.el).attr('aria-valuenow', val);
			Z.setValueToDataset(val);
		}, // end incValue
	
		_getRange: function() {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field),
				range = fldObj.dataRange(),
				minValue = Number.NEGATIVE_INFINITY, 
				maxValue = Number.POSITIVE_INFINITY;
			
			if(range) {
				if(range.min) {
					minValue = parseFloat(range.min);
				}
				if(range.max) {
					maxValue = parseFloat(range.max);
				}
			}
			return {minValue: minValue, maxValue: maxValue};
		},
		
		decValue: function () {
			var Z = this,
				val = Z.getValue();
			if (!val) {
				val = 0;
			}
			var minValue = Z._getRange().minValue;
			if (val == minValue) {
				return;
			} else if (val > minValue) {
				val -= Z._step;
			} else {
				val = minValue;
			}
			if (val < minValue)
				val = minValue;
			jQuery(Z.el).attr('aria-valuenow', val);
			Z.setValueToDataset(val);
		}, // end decValue
		
		focus: function() {
			if(Z._isDisabled()) {
				return;
			}
			this.editor.focus();
		},
		
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName) {
			$super(metaName);
			var Z = this,
				jqEl = jQuery(this.el),
				fldObj = Z._dataset.getField(Z._field);
			
			if(!metaName || metaName == 'disabled' || metaName == 'readOnly') {
				var disabled = fldObj.disabled() || fldObj.readOnly(),
					jqUpBtn = jqEl.find('.jl-spinedit-up'),
					jqDownBtn = jqEl.find('.jl-spinedit-down');
					
				if (disabled) {
					jqUpBtn.attr('disabled', 'disabled');
					jqDownBtn.attr('disabled', 'disabled');
				} else {
					jqUpBtn.attr('disabled', false);
					jqDownBtn.attr('disabled', false);
				}
			}
			if(!metaName || metaName == 'dataRange') {
				range = fldObj.dataRange();
				jqEl.attr('aria-valuemin', range && (range.min || range.min === 0) ? range.min: '');
				jqEl.attr('aria-valuemin', range && (range.max || range.max === 0) ? range.max: '');
			}
			if(!metaName || metaName == 'tabIndex') {
				Z.setTabIndex();
			}
		},
		
		/**
		 * @override
		 */
		renderAll: function(){
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		},
		
		/**
		 * @override
		 */
		destroy: function(){
			var jqEl = jQuery(this.el);
			jQuery(this.editor).off();
			this.editor = null;
			jqEl.find('.jl-upbtn-up').off();
			jqEl.find('.jl-downbtn-up').off();
		}
		
	});
	jslet.ui.register('DBSpinEdit', jslet.ui.DBSpinEdit);
	jslet.ui.DBSpinEdit.htmlTemplate = '<div></div>';
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbtext.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBText is a powerful control, it can input any data type, like:
	 *		number, date etc. Example:
	 * 
	 * <pre><code>
	 * var jsletParam = {type:&quot;DBText&quot;,field:&quot;name&quot;};
	 * //1. Declaring:
	 * &lt;input id=&quot;ctrlId&quot; type=&quot;text&quot; data-jslet='jsletParam' /&gt;
	 * or
	 * &lt;input id=&quot;ctrlId&quot; type=&quot;text&quot; data-jslet='{type:&quot;DBText&quot;,field:&quot;name&quot;}' /&gt;
	 * 
	 *  //2. Binding
	 * &lt;input id=&quot;ctrlId&quot; type=&quot;text&quot; data-jslet='jsletParam' /&gt;
	 * //Js snippet
	 * var el = document.getElementById('ctrlId');
	 * jslet.ui.bindControl(el, jsletParam);
	 * 
	 *  //3. Create dynamically
	 * jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBText = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,beforeUpdateToDataset,enableInvalidTip,onKeyDown,autoSelectAll';
	
			/**
			 * @protected
			 */
			Z._beforeUpdateToDataset = null;
			Z._enableInvalidTip = true;
			
			Z._enterProcessed = false;
			
			Z._autoSelectAll = true;
			/**
			 * @private
			 */
			Z.oldValue = null;
			Z.editMask = null;
			Z._position;
			$super(el, params);
		},
	
		beforeUpdateToDataset: function(beforeUpdateToDataset) {
			if(beforeUpdateToDataset === undefined) {
				return this._beforeUpdateToDataset;
			}
			jslet.Checker.test('DBText.beforeUpdateToDataset', beforeUpdateToDataset).isFunction();
			this._beforeUpdateToDataset = beforeUpdateToDataset;
		},
	
		enableInvalidTip: function(enableInvalidTip) {
			if(enableInvalidTip === undefined) {
				return this._enableInvalidTip;
			}
			this._enableInvalidTip = enableInvalidTip? true: false;
		},
	
		autoSelectAll: function(autoSelectAll) {
			if(autoSelectAll === undefined) {
				return this._autoSelectAll;
			}
			this._autoSelectAll = autoSelectAll? true: false;
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'input' && 
					el.type.toLowerCase() == 'text';
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this;
			Z.renderAll();
			var jqEl = jQuery(Z.el);
			jqEl.addClass('form-control');
			
			if (Z.doFocus) {
				jqEl.on('focus', jQuery.proxy(Z.doFocus, Z));
			}
			if (Z.doBlur) {
				jqEl.on('blur', jQuery.proxy(Z.doBlur, Z));
			}
			if (Z.doKeydown) {
				jqEl.on('keydown', Z.doKeydown);
			}
			if (Z.doKeypress) {
				jqEl.on('keypress', Z.doKeypress);
			}
			Z.doMetaChanged('required');
		}, // end bind
	
		/**
		 * @override
		 */
		doFocus: function () {
			var Z = this;
			if (Z._skipFocusEvent) {
				return;
			}
			var ctrlRecno = Z.ctrlRecno();
			if(ctrlRecno >= 0 && ctrlRecno != Z._dataset.recno()) {
				if(!Z._dataset.recno(ctrlRecno)) {
					return;
				}
			}
			Z.doValueChanged();
			Z.oldValue = Z.el.value;
			if(Z._autoSelectAll) {
				jslet.ui.textutil.selectText(Z.el);
			}
			jQuery(Z.el).trigger('editing', [Z._field]);
		},
	
		/**
		 * @override
		 */
		doBlur: function () {
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			Z._position = jslet.ui.textutil.getCursorPos(Z.el);
			if (fldObj.readOnly() || fldObj.disabled()) {
				return;
			}
			var jqEl = jQuery(this);
			if(jqEl.attr('readOnly') || jqEl.attr('disabled')) {
				return;
			}
			Z.updateToDataset();
			Z._isBluring = true;
			try {
				Z.doValueChanged();
			} finally {
				Z._isBluring = false;
			}
		},
		
		/**
		 * @override
		 */
		doKeydown: function(event) {
			event = jQuery.event.fix( event || window.event );
			var keyCode = event.which;
			//When press 'enter', write data to dataset.
			var Z = this.jslet;
			if(keyCode == 13) {
				Z._enterProcessed = true;
				Z.updateToDataset();
			}
			//Process 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown' key when it is editing. 
			var isEditing = Z.ctrlRecno() >= 0 && Z._dataset.status() > 0;
			if(isEditing && (keyCode == 38 || keyCode == 40 || keyCode == 33 || keyCode == 34)) {
				Z._enterProcessed = true;
				Z.updateToDataset();
			}
			var fldObj = Z._dataset.getField(Z._field);
			if (!fldObj.readOnly() && !fldObj.disabled() && (keyCode == 8 || keyCode == 46)) {
				Z._dataset.editRecord();
			}
	
		},
	
		/**
		 * @override
		 */
		doKeypress: function (event) {
			var Z = this.jslet,
				fldObj = Z._dataset.getField(Z._field);
			if (fldObj.readOnly() || fldObj.disabled()) {
				return;
			}
			event = jQuery.event.fix( event || window.event );
			var keyCode = event.which,
				existStr = jslet.getRemainingString(Z.el.value, jslet.ui.textutil.getSelectedText(Z.el)),
				cursorPos = jslet.ui.textutil.getCursorPos(Z.el);
			if (!Z._dataset.fieldValidator().checkInputChar(fldObj, String.fromCharCode(keyCode), existStr, cursorPos.begin)) {
				event.preventDefault();
			}
			Z._dataset.editRecord();
			//When press 'enter', write data to dataset.
			if(keyCode == 13) {
				if(!Z._enterProcessed) {
					Z.updateToDataset();
				} else {
					Z._enterProcessed = false;
				}
			}
		},
	
		focus: function() {
			var jqEl = jQuery(this.el);
			if(!jqEl.attr('disabled')) {
				this.el.focus();
			}
		},
		
		/**
		 * Select text.
		 * 
		 * @param {Integer} start (Optional) start of cursor position
		 * @param {Integer} end (Optional) end of cursor position
		 */
		selectText: function(start, end){
			jslet.ui.textutil.selectText(this.el, start, end);
		},
		
		/**
		 * Input a text into text control at current cursor position.
		 * 
		 * @param {String} text the text need to be input.
		 */
		inputText: function(text) {
			if(!text) {
				return;
			}
			jslet.Checker.test('DBText.inputText#text', text).isString();
			
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(fldObj.getType() !== jslet.data.DataType.STRING) {
				console.warn('Only String Field can be input!');
				return;
			}
			var ch, chs = [];
			for(var i = 0, len = text.length; i < len; i++) {
				ch = text[i];
				if (Z._dataset.fieldValidator().checkInputChar(fldObj, ch)) {
					chs.push(ch);
				}
			}
			if(!Z._position) {
				Z._position = jslet.ui.textutil.getCursorPos(Z.el);
			}
			var subStr = chs.join(''),
				value =Z.el.value,
				begin = Z._position.begin,
				end = Z._position.end;
			var prefix = value.substring(0, begin), 
				suffix = value.substring(end); 
			Z.el.value = prefix + text + suffix;
			Z._position = jslet.ui.textutil.getCursorPos(Z.el);		
			Z.updateToDataset();
		},
		
		/**
		 * @override
		 */
		refreshControl: function ($super, evt, isForce) {
			if($super(evt, isForce) && this.afterRefreshControl) {
				this.afterRefreshControl(evt);
			}
		}, 
	
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly") {
				jslet.ui.setEditableStyle(Z.el, fldObj.disabled(), fldObj.readOnly(), false, fldObj.required());
			}
			
			if(metaName && metaName == 'required') {
				var jqEl = jQuery(Z.el);
				if (fldObj.required()) {
					jqEl.addClass('jl-ctrl-required');
				} else {
					jqEl.removeClass('jl-ctrl-required');
				}
			}
			if(!metaName || metaName == 'editMask') {
				var editMaskCfg = fldObj.editMask();
				if (editMaskCfg) {
					if(!Z.editMask) {
						Z.editMask = new jslet.ui.EditMask();
						Z.editMask.attach(Z.el);
					}
					mask = editMaskCfg.mask;
					keepChar = editMaskCfg.keepChar;
					transform = editMaskCfg.transform;
					Z.editMask.setMask(mask, keepChar, transform);
				} else {
					if(Z.editMask) {
						Z.editMask.detach();
						Z.editMask = null;
					}
				}
			}
			
			if(!metaName || metaName == 'tabIndex') {
				Z.setTabIndex();
			}
			
			Z.el.maxLength = fldObj.getEditLength();
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var errObj = Z.getFieldError();
			if(errObj && errObj.message) {
				Z.el.value = errObj.inputText || '';
				Z.renderInvalid(errObj);
				return;
			} else {
				Z.renderInvalid(null);
			}
			var fldObj = Z._dataset.getField(Z._field);
			var align = fldObj.alignment();
		
			if (jslet.locale.isRtl){
				if (align == 'left') {
					align= 'right';
				} else {
					align = 'left';
				}
			}
			Z.el.style.textAlign = align;
			var value;
			if (Z.editMask){
				value = Z.getValue();
				Z.editMask.setValue(value);
			} else {
				if (document.activeElement != Z.el || Z.el.readOnly || Z._isBluring) {
					value = Z.getText(false);
				} else {
					value = Z.getText(true);
				}
				if(fldObj.getType() === jslet.data.DataType.STRING && fldObj.antiXss()) {
					value = jslet.htmlDecode(value);
				}
				Z.el.value = value;
			}
			Z.oldValue = Z.el.value;
		},
	
		/**
		 * @override
		 */
		renderAll: function () {
			this.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		}, // end renderAll
	
		updateToDataset: function () {
			var Z = this;
			if (Z._keep_silence_) {
				return true;
			}
			var value = Z.el.value;
			if(Z.oldValue == value) {
				return true;
			}
			var ctrlRecno = Z.ctrlRecno();
			if(ctrlRecno >= 0) {
				var oldRecno = Z._dataset.recnoSilence();
				Z._dataset.recnoSilence(Z.ctrlRecno());
			}
			try {
				Z._dataset.editRecord();
				if (this.editMask && !this.editMask.validateValue()) {
					return false;
				}
				if (Z._beforeUpdateToDataset) {
					if (!Z._beforeUpdateToDataset.call(Z)) {
						return false;
					}
				}
		
				Z._keep_silence_ = true;
				try {
					if (Z.editMask) {
						value = Z.editMask.getValue();
					}
					Z._dataset.setFieldText(Z._field, value, Z._valueIndex);
				} finally {
					Z._keep_silence_ = false;
				}
			} finally {
				if(ctrlRecno >= 0) {
					Z._dataset.recnoSilence(oldRecno);
				}
			}
			Z.refreshControl(jslet.data.RefreshEvent.updateRecordEvent(Z._field));
			return true;
		}, // end updateToDataset
	
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this;
			jQuery(Z.el).off();
			if (Z.editMask){
				Z.editMask.detach();
				Z.editMask = null;
			}
			Z._beforeUpdateToDataset = null;
			Z.onKeyDown = null;
			$super();
		}
	});
	jslet.ui.register('DBText', jslet.ui.DBText);
	jslet.ui.DBText.htmlTemplate = '<input type="text"></input>';
	
	/**
	 * DBPassword
	 */
	jslet.ui.DBPassword = jslet.Class.create(jslet.ui.DBText, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			$super(el, params);
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'input' &&
				el.type.toLowerCase() == 'password';
		}
	});
	
	jslet.ui.register('DBPassword', jslet.ui.DBPassword);
	jslet.ui.DBPassword.htmlTemplate = '<input type="password"></input>';
	
	/**
	 * DBTextArea
	 */
	jslet.ui.DBTextArea = jslet.Class.create(jslet.ui.DBText, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			$super(el, params);
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			return el.tagName.toLowerCase() == 'textarea';
		}
	});
	
	jslet.ui.register('DBTextArea', jslet.ui.DBTextArea);
	jslet.ui.DBTextArea.htmlTemplate = '<textarea></textarea>';
	
	
	/* ========================================================================
	 * Jslet framework: jslet.dbtimepicker.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBTimePicker is used for time inputting. Example:
	 * <pre><code>
	 * var jsletParam = {type:"DBTimePicker",field:"time"};
	 * //1. Declaring:
	 *  &lt;input id="ctrlId" type="text" data-jslet='jsletParam' />
	 *  or
	 *  &lt;input id="ctrlId" type="text" data-jslet='{type:"DBTimePicker",field:"time"}' />
	 *  
	 *  //2. Binding
	 *  &lt;input id="ctrlId" type="text" data-jslet='jsletParam' />
	 *  //Js snippet
	 *  var el = document.getElementById('ctrlId');
	 *  jslet.ui.bindControl(el, jsletParam);
	 *
	 *  //3. Create dynamically
	 *  jslet.ui.createControl(jsletParam, document.body);
	 *
	 * </code></pre>
	 */
	jslet.ui.DBTimePicker = jslet.Class.create(jslet.ui.DBFieldControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,field,is12Hour,hasSecond';
			Z._is12Hour = false;
			Z._hasSecond = false;
			$super(el, params);
		},
	
		is12Hour: function(is12Hour) {
			if(is12Hour === undefined) {
				return this._is12Hour;
			}
			this._is12Hour = is12Hour? true: false;
		},
	
		hasSecond: function(hasSecond) {
			if(hasSecond === undefined) {
				return this._hasSecond;
			}
			this._hasSecond = hasSecond? true: false;
		},
	
		/**
		 * @override
		 */
		isValidTemplateTag: function (el) {
			var tagName = el.tagName.toLowerCase();
			return tagName == 'div' || tagName == 'span';
		},
	
		/**
		 * @override
		 */
		bind: function () {
			var Z = this,
				jqEl = jQuery(Z.el);
			if(!jqEl.hasClass('jl-timepicker')) {
				jqEl.addClass('form-control jl-timepicker');
			}
			Z.renderAll();
			jqEl.on('change', 'select', function(event){
				Z.updateToDataset();
			});
		}, // end bind
	
		/**
		 * @override
		 */
		renderAll: function () {
			var Z = this,
				jqEl = jQuery(Z.el),
				fldObj = Z._dataset.getField(Z._field),
				range = fldObj.dataRange(),
				minTimePart = {hour: 0, minute: 0, second: 0},
				maxTimePart = {hour: 23, minute: 59, second: 59};
			
			if(range) {
				if(range.min) {
					minTimePart = Z._splitTime(range.min);
				}
				if(range.max) {
					maxTimePart = Z._splitTime(range.max);
				}
			}
			var	tmpl = [];
			
			tmpl.push('<select class="jl-time-hour">');
			if(Z._is12Hour) {
				var minHour = minTimePart.hour;
				var maxHour = maxTimePart.hour;
				var min = 100, max = 0, hour;
				for(var k = minHour; k < maxHour; k++) {
					hour = k;
					if( k > 11) {
						hour = k - 12;
					}
					min = Math.min(min, hour);
					max = Math.max(max, hour);
				}
				tmpl.push(Z._getOptions(min, max));
			} else {
				tmpl.push(Z._getOptions(minTimePart.hour, maxTimePart.hour || 23));
			}
			tmpl.push('</select>');
			
			tmpl.push('<select class="jl-time-minute">');
			tmpl.push(Z._getOptions(0, 59));
			tmpl.push('</select>');
			
			if(Z._hasSecond) {
				tmpl.push('<select class="jl-time-second">');
				tmpl.push(Z._getOptions(0, 59));
				tmpl.push('</select>');
			}
			
			if(Z._is12Hour) {
				tmpl.push('<select class="jl-time-ampm"><option value="am">AM</option><option value="pm">PM</option></select>');
			}
			jqEl.html(tmpl.join(''));
			Z.refreshControl(jslet.data.RefreshEvent.updateAllEvent(), true);
		}, // end renderAll
	
		_getOptions: function(begin, end) {
			var result = [], value;
			for(var i = begin; i <= end; i++) {
				if( i < 10) {
					value = '0' + i;
				} else {
					value = '' + i;
				}
				result.push('<option value="');
				result.push(i);
				result.push('">');
				result.push(value);
				result.push('</option>');
			}
			return result.join('');
		},
		
		/**
		 * @override
		 */
		doMetaChanged: function($super, metaName){
			$super(metaName);
			var Z = this,
				fldObj = Z._dataset.getField(Z._field);
			if(!metaName || metaName == "disabled" || metaName == "readOnly" || metaName == 'tabIndex') {
				var disabled = fldObj.disabled() || fldObj.readOnly();
				var items = jQuery(Z.el).find("select"), item,
					required = fldObj.required(),
					tabIdx = fldObj.tabIndex();
				for(var i = 0, cnt = items.length; i < cnt; i++){
					item = items[i];
					item.disabled = disabled;
					jslet.ui.setEditableStyle(item, disabled, disabled, true, required);
					item.tabIndex = tabIdx;
				}
			}
		},
		
		/**
		 * @override
		 */
		doValueChanged: function() {
			var Z = this;
			if (Z._keep_silence_) {
				return;
			}
			var value = Z.getValue(),
				timePart = Z._splitTime(value),
				hour = timePart.hour,
				jqEl = jQuery(Z.el),
				jqHour = jqEl.find('.jl-time-hour'),
				jqMinute = jqEl.find('.jl-time-minute');
			
			if(Z._is12Hour) {
				jqAmPm = jqEl.find('.jl-time-ampm');
				jqAmPm.prop('selectedIndex', hour < 12 ? 0: 1);
				if(hour > 11) {
					hour -= 12;
				}
			}
			jqHour.val(hour);
			jqMinute.val(timePart.minute);
			if(Z._hasSecond) {
				jqMinute = jqEl.find('.jl-time-second');
				jqMinute.val(timePart.second);
			}
		},
		 
		_splitTime: function(value) {
			var	hour = 0,
				minute = 0,
				second = 0;
			if(value) {
				if(jslet.isDate(value)) {
					hour = value.getHours();
					minute = value.getMinutes();
					second = value.getSeconds();
				} else if(jslet.isString(value)) {
					var parts = value.split(":");
					hour = parseInt(parts[0]);
					if(parts.length > 1) {
						minute = parseInt(parts[1]);
					}
					if(parts.length > 2) {
						second = parseInt(parts[2]);
					}
				}
			}
			return {hour: hour, minute: minute, second: second};
		},
		
		_prefix: function(value) {
			if(parseInt(value) < 10) {
				return '0' + value;
			}
			return value;
		},
		
		updateToDataset: function () {
			var Z = this;
			if (Z._keep_silence_) {
				return true;
			}
	
			Z._keep_silence_ = true;
			try {
				var jqEl = jQuery(Z.el),
					fldObj = Z._dataset.getField(Z._field),
					value = null, hour;
				if(fldObj.getType() != jslet.data.DataType.DATE) {
					value = [];
					if(Z._is12Hour && jqEl.find('.jl-time-ampm').prop("selectedIndex") > 0) {
						hour = parseInt(jqEl.find('.jl-time-hour').val()) + 12;
						value.push(hour);
					} else {
						value.push(Z._prefix(jqEl.find('.jl-time-hour').val()));
					}
					value.push(':');
					value.push(Z._prefix(jqEl.find('.jl-time-minute').val()));
					if(Z._hasSecond) {
						value.push(':');
						value.push(Z._prefix(jqEl.find('.jl-time-second').val()));
					}
					value = value.join('');
				} else {
					value = Z.getValue();
					if(!value) {
						value = new Date();
					}
					hour = parseInt(jqEl.find('.jl-time-hour').val());
					if(Z._is12Hour && jqEl.find('.jl-time-ampm').prop("selectedIndex") > 0) {
						hour += 12;
					}
					var minute = parseInt(jqEl.find('.jl-time-minute').val());
					var second = 0;
					if(Z._hasSecond) {
						second = parseInt(jqEl.find('.jl-time-second').val());
					}
					
					value.setHours(hour);
					value.setMinutes(minute);
					value.setSeconds(second);
				}
				Z._dataset.setFieldValue(Z._field, value, Z._valueIndex);
			} finally {
				Z._keep_silence_ = false;
			}
			return true;
		}, // end updateToDataset
	
		/**
		 * @override
		 */
		destroy: function($super){
			jQuery(this.el).off();
			$super();
		}
	});
	jslet.ui.register('DBTimePicker', jslet.ui.DBTimePicker);
	jslet.ui.DBTimePicker.htmlTemplate = '<div></div>';
	
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
	
	/* ========================================================================
	 * Jslet framework: jslet.dbpagebar.js
	 *
	 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	 * ======================================================================== */
	
	/**
	 * @class DBPageBar. 
	 * Functions:
	 * 1. First page, Prior Page, Next Page, Last Page;
	 * 2. Can go to specified page;
	 * 3. Can specify page size on runtime;
	 * 4. Need not write any code;
	 * 
	 * Example:
	 * <pre><code>
	 *  var jsletParam = {type:"DBPageBar",dataset:"bom",pageSizeList:[20,50,100,200]};
	 *  
	 * //1. Declaring:
	 *  &lt;div data-jslet='type:"DBPageBar",dataset:"bom",pageSizeList:[20,50,100,200]' />
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
	jslet.ui.DBPageBar = jslet.Class.create(jslet.ui.DBControl, {
		/**
		 * @override
		 */
		initialize: function ($super, el, params) {
			var Z = this;
			Z.allProperties = 'dataset,showPageSize,showGotoButton,pageSizeList';
			/**
			 * {Boolean} Identify if the "Page Size" part shows or not
			 */
			Z._showPageSize = true;
			/**
			 * {Boolean} Identify if the "GoTo" part shows or not
			 */
			Z._showGotoButton = true;
			
			/**
			 * {Integer[]) Array of integer, like: [50,100,200]
			 */
			Z._pageSizeList = [100, 200, 500];
	
			$super(el, params);
		},
	
		showPageSize: function(showPageSize) {
			if(showPageSize === undefined) {
				return this._showPageSize;
			}
			this._showPageSize = showPageSize ? true: false;
		},
		
		showGotoButton: function(showGotoButton) {
			if(showGotoButton === undefined) {
				return this._showGotoButton;
			}
			this._showGotoButton = showGotoButton ? true: false;
		},
		
		pageSizeList: function(pageSizeList) {
			if(pageSizeList === undefined) {
				return this._pageSizeList;
			}
			jslet.Checker.test('DBPageBar.pageSizeList', pageSizeList).isArray();
			var size;
			for(var i = 0, len = pageSizeList.length; i < len; i++) {
				size = pageSizeList[i];
				jslet.Checker.test('DBPageBar.pageSizeList', size).isGTZero();
			}
			this._pageSizeList = pageSizeList;
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
			if (!jqEl.hasClass('jl-pagebar')) {
				jqEl.addClass('jl-pagebar');
			}
			var template = ['<select class="jl-pb-item"></select><label class="jl-pb-item jl-pb-label">', jslet.locale.DBPageBar.pageSizeLabel,
							'</label><a class="jl-pb-item jl-pb-button jl-pb-first" href="javascript:;"></a><a class="jl-pb-item jl-pb-button jl-pb-prior" href="javascript:;"></a><label class="jl-pb-item jl-pb-label">',
							jslet.locale.DBPageBar.pageNumLabel,
							'</label><input class="jl-pb-item jl-pb-pagenum" value="1" size="2" ></input><a class="jl-pb-item jl-pb-button jl-pb-goto" href="javascript:;"></a><label class="jl-pb-item jl-pb-label">',
							jslet.formatString(jslet.locale.DBPageBar.pageCountLabel, [0]),
							'</label><a class="jl-pb-item jl-pb-button jl-pb-next" href="javascript:;"></a><a class="jl-pb-item jl-pb-button jl-pb-last" href="javascript:;"></a></div>'
							];
			jqEl.html(template.join(''));
	
			var oPageSize = Z.el.childNodes[0];
			if (Z._showPageSize) {
				var rows = Z._pageSizeList;
				var cnt = rows.length, s = '';
				for (var i = 0; i < cnt; i++) {
					s += '<option value=' + rows[i] + '>' + rows[i] + '</option>';
				}
	
				oPageSize.innerHTML = s;
				Z._dataset.pageSize(parseInt(oPageSize.value));
			}
	
			jQuery(oPageSize).on('change', function (event) {
				var ds = this.parentElement.jslet.dataset();
				ds.pageNo(1);
				ds.pageSize(parseInt(this.value));
				ds.requery();
			});
	
			Z._firstBtn = Z.el.childNodes[2];
			Z._priorBtn = Z.el.childNodes[3];
	
			Z._pageNoTxt = Z.el.childNodes[5];
			Z._gotoBtn = Z.el.childNodes[6];
	
			Z._pageCountLbl = Z.el.childNodes[7];
	
			Z._nextBtn = Z.el.childNodes[8];
			Z._lastBtn = Z.el.childNodes[9];
	
			jQuery(Z._firstBtn).on('click', function (event) {
				if(this.disabled) {
					return;
				}
				var ds = this.parentElement.jslet.dataset();
				ds.pageNo(1);
				ds.requery();
			});
	
			jQuery(Z._priorBtn).on('click', function (event) {
				if(this.disabled) {
					return;
				}
				var ds = this.parentElement.jslet.dataset(),
					num = ds.pageNo();
				if (num == 1) {
					return;
				}
				ds.pageNo(num - 1);
				ds.requery();
			});
	
			jQuery(Z._gotoBtn).on('click', function (event) {
				var oJslet = this.parentElement.jslet;
				var ds = oJslet.dataset();
				var num = parseInt(oJslet._pageNoTxt.value);
				if (num < 1) {
					num = 1;
				}
				if (num > ds.pageCount()) {
					num = ds.pageCount();
				}
				ds.pageNo(num);
				ds.requery();
			});
	
			jQuery(Z._nextBtn).on('click', function (event) {
				if(this.disabled) {
					return;
				}
				var oJslet = this.parentElement.jslet,
					ds = oJslet.dataset(),
					num = ds.pageNo();
				if (num >= ds.pageCount()) {
					return;
				}
				ds.pageNo(++num);
				ds.requery();
			});
	
			jQuery(Z._lastBtn).on('click', function (event) {
				if(this.disabled) {
					return;
				}
				var oJslet = this.parentElement.jslet,
					ds = oJslet.dataset();
	
				if (ds.pageCount() < 1) {
					return;
				}
				ds.pageNo(ds.pageCount());
				ds.requery();
			});
	
			jQuery(Z._pageNoTxt).on('keypress', function (event) {
				event = jQuery.event.fix( event || window.event );
				var keyCode = event.which;
	
				var validChars = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
				if (validChars.indexOf(String.fromCharCode(keyCode)) < 0) {
					event.preventDefault();
				}
			});
	
			Z.renderAll();
		},
	
		/**
		 * @override
		 */
		refreshControl: function (evt) {
			if (evt && evt.eventType != jslet.data.RefreshEvent.CHANGEPAGE) {
				return;
			}
			var Z = this,
				num = Z._dataset.pageNo(), 
				count = Z._dataset.pageCount();
			Z._pageNoTxt.value = num;
			Z._pageCountLbl.innerHTML = jslet.formatString(jslet.locale.DBPageBar.pageCountLabel, [count]);
			Z._refreshButtonStatus();
		}, // end refreshControl
	
		_refreshButtonStatus: function() {
			var Z = this, 
				ds = Z._dataset,
				pageNo = ds.pageNo(),
				pageCnt = ds.pageCount(),
				prevDisabled = true,
				nextDisabled = true;
			if(pageNo > 1) {
				prevDisabled = false;
			}
			if(pageNo < pageCnt) {
				nextDisabled = false;
			}
			if(prevDisabled) {
				jQuery(Z._firstBtn).addClass('jl-pb-first-disabled jl-pb-button-disabled');
				jQuery(Z._priorBtn).addClass('jl-pb-prior-disabled jl-pb-button-disabled');
			}
			else {
				jQuery(Z._firstBtn).removeClass('jl-pb-first-disabled jl-pb-button-disabled');
				jQuery(Z._priorBtn).removeClass('jl-pb-prior-disabled jl-pb-button-disabled');
			}
			if(nextDisabled) {
				jQuery(Z._nextBtn).addClass('jl-pb-next-disabled jl-pb-button-disabled');
				jQuery(Z._lastBtn).addClass('jl-pb-last-disabled jl-pb-button-disabled');
			}
			else {
				jQuery(Z._nextBtn).removeClass('jl-pb-next-disabled jl-pb-button-disabled');
				jQuery(Z._lastBtn).removeClass('jl-pb-last-disabled jl-pb-button-disabled');
			}
			Z._firstBtn.disabled = prevDisabled;
			Z._priorBtn.disabled = prevDisabled;
			Z._nextBtn.disabled = nextDisabled;
			Z._lastBtn.disabled = nextDisabled;
		},
		
		/**
		 * @override
		 */
		renderAll: function () {
			var displayStyle = this._showPageSize ? 'inline' : 'none';
			var oel = this.el;
			oel.childNodes[0].style.display = displayStyle;
			oel.childNodes[1].style.display = displayStyle;
	
			this.refreshControl();
		},
		
		/**
		 * @override
		 */
		destroy: function($super){
			var Z = this;
			
			jQuery(Z._firstBtn).off();
			jQuery(Z._priorBtn).off();
			jQuery(Z._pageNoTxt).off();
			jQuery(Z._gotoBtn).off();
			jQuery(Z._pageCountLbl).off();
			jQuery(Z._nextBtn).off();
			jQuery(Z._lastBtn).off();
			
			Z._firstBtn = null;
			Z._priorBtn = null;
			Z._pageNoTxt = null;
			Z._gotoBtn = null;
			Z._pageCountLbl = null;
			Z._nextBtn = null;
			Z._lastBtn = null;
			
			$super();
		}
	
	});
	
	jslet.ui.register('DBPageBar', jslet.ui.DBPageBar);
	jslet.ui.DBPageBar.htmlTemplate = '<div></div>';


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* ========================================================================
	* Jslet framework: jslet.locale.js
	*
	* Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
	* Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
	* ======================================================================== */
	
	/**
	* Chinese language pack
	*/
	var locale = {};
	locale.isRtl = false;//false: direction = 'ltr', true: direction = 'rtl'
	
	locale.Common = {
		jsonParseError: 'JSON格式错误，无法解析：{0}',
		ConnectError: '连接超时或者无法连接服务器!'
	};
	
	locale.Date = {
		format: 'yyyy-MM-dd'	
	};
	
	locale.Dataset = {
			invalidDateFieldValue: '字段: [{0}]是日期字段, 但值不是日期型的!',
			fieldNotFound:  '字段: {0} 未定义!',
			valueNotFound: '找不到指定的值!',
			lookupNotFound: '字段: {0} 没有设置查找字段, 不能使用字段链!',
			datasetFieldNotBeSetValue: '不能给数据集字段: {0} 设置值!',
			datasetFieldNotBeCalculated: '数据集字段: {0} 不能参与计算!',
			insertMasterFirst: '主数据集没有数据，请先在主数据集中新增数据!',
			lookupFieldExpected: '字段: {0} 必须是查找字段!',
			invalidLookupField: '字段: {0} 的是一个无效的查找字段，请检查参数!',
			invalidContextRule: '字段: [{0}]的上下文规则的条件中必须要有字段!如果是固定条件，请直接设置过滤条件!',
			fieldValueRequired: '[{0}]不能为空!',
			invalidFieldTranslate: '字段: {0}里的属性: displayValueField 和 inputValueField不能为空!',
			translateListenerRequired: '必须设置事件监听器: translateListener!',
			minMaxValueError: '[{0}] 的最小值必须要小于或者等于最大值!',
			invalidDate: '无效日期!',
			invalidInt: '只允许:0-9,-',
			invalidFloat: '只允许:0-9,-,.',
			invalidIntegerPart: '整数部分超长，允许：{0}位，实际：{1}位！',
			invalidDecimalPart: '小数部分超长，允许：{0}位，实际：{1}位！',
			cannotConfirm: '数据录入有误，请先检查!',
			notInRange: '录入的值必须在:{0}和{1}之间',
			lessThanValue: '录入的值必须小于: {0}',
			moreThanValue: '录入的值必须大于: {0}',
			cannotDelParent: '该笔数据下还有下级数据,不能删除!',
			notUnique: '数据不能重复!',
			LookupDatasetNotSameAsHost: '查找数据源不能为主数据集!',
			betweenLabel: ' - ',
			betwwenInvalid: '最小值不得大于最大值',
			value: '值',
			nullText: '(空)',
			noDataSubmit: '无数据可提交!',
			trueText: '是',
			falseText: ''
	};
	
	locale.DBControl = {
		datasetNotFound: '找不到数据集： {0}, 请先定义并设置其名称!',
		expectedProperty: '请先设置属性值: {0}!',
		propertyValueMustBeInt: '属性: {0} 的值必须是数字!',
		jsletPropRequired: 'HTML模板上缺少jslet属性!',
		invalidHtmlTag: '所附加HTML标签无效，可参考: {0} !',
		invalidJsletProp: 'jslet控件参数不符合JSON规范: {0}'
	};
	
	locale.DBImage = {
		lockedImageTips: '图片被锁定 '
	};
	
	locale.DBChart = {
		onlyNumberFieldAllowed: '图表字段必须为Number类型!'
	};
	
	locale.DBCheckBoxGroup = {
		invalidCheckedCount: '最大可选择的个数不能超过: {0}!',
		noOptions: '无可选项',
		selectAll: '全部'
	};
	
	locale.DBRadioGroup = {
		noOptions: '无可选项'
	};
	
	locale.DBBetweenEdit = {
		betweenLabel: '-'
	};
	
	locale.DBPageBar = {
		pageSizeLabel: '/页 ',
		pageNumLabel: '第 ',
		pageCountLabel: '共:{0}页 '
	};
	
	locale.DBComboSelect = { 
		find: '查找'
	};
	
	locale.MessageBox = { 
		ok: '确定',
		cancel: '取消',
		yes: '是',
		no: '否',
		info: '提示',
		error: '错误',
		warn: '警告',
		confirm: '确认',
		prompt: '请输入'
	};
	
	locale.Calendar = { 
		yearPrev: '前一年',
		monthPrev: '前一月',
		yearNext: '下一年',
		monthNext: '下一月',
		Sun: '日',
		Mon: '一',
		Tue: '二',
		Wed: '三',
		Thu: '四',
		Fri: '五',
		Sat: '六',
		today: '今日',
		monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		firstDayOfWeek: 0
	};
	
	locale.DBTreeView = { 
		expandAll: '全部展开',
		collapseAll: '全部收缩',
		checkAll: '全部选择',
		uncheckAll: '全部不选'
	};
	
	locale.TabControl ={ 
		close: '关闭',
		closeOther: '关闭其它'
	};
	
	locale.DBTable = { 
		norecord: '没有数据',
		sorttitle: '按Ctrl可多列排序',
		totalLabel: '合计'
	};	
	
	locale.findDialog = {
		caption: '查找 - {0}',
		matchFirst: '匹配开头',
		matchLast: '匹配结尾',
		matchAny: '任意匹配'
	};
			
	if (window.jslet === undefined || jslet === undefined){
		jslet=window.jslet = function(id){
			var ele = jQuery(id)[0];
			return (ele && ele.jslet)?ele.jslet:null;
		};
	}
	jslet.locale = locale;
	
	__webpack_require__(11);
	__webpack_require__(12);
	
	module.exports = jslet;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	__webpack_require__(16);
	
	// Hack: maybe exist more good method
	function Interpreter(tpl) {
		this.tpl = tpl;
	}
	
	Interpreter.prototype.parse = function() {
		var i = 0, tpl = this.tpl, len = tpl.controls.length;
	
		var rootEl = tpl.root ? document.getElementById(tpl.root) : document.body;
	
		var control, bind;
		for (; i < len; i++) {
			control = tpl.controls[i];
			
			createPanel(control.panel, rootEl);
			
			bind = control.bind;
	
			for (var k = 0, blen = bind.length; k < blen; k++) {
				jslet.ui.bindControl(document.getElementById(bind[k].el), bind[k].jsletParams);
			}
			
		}	
	
	}
	
	function createPanel(panel, rootEl) {
		var source = __webpack_require__(6);
		var result = source(panel);
		var fragment = document.createDocumentFragment();
		var div = document.createElement('div');
		div.innerHTML = result;
		rootEl.appendChild(div.firstChild);
	}
	 
	module.exports = Interpreter;
	
	
	
	


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isIE9 = memoize(function() {
			return /msie 9\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isIE9();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(15)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!C:\\Users\\Administrator\\AppData\\Roaming\\npm\\node_modules\\spm\\node_modules\\spm-webpack\\node_modules\\css-loader\\index.js!!C:\\spm_git_space\\spm-case\\case23-jslet\\commonjs\\interpreter\\panel.css", function() {
			var newContent = require("!!C:\\Users\\Administrator\\AppData\\Roaming\\npm\\node_modules\\spm\\node_modules\\spm-webpack\\node_modules\\css-loader\\index.js!!C:\\spm_git_space\\spm-case\\case23-jslet\\commonjs\\interpreter\\panel.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/***/ function(module, exports) {

	
	var dataSet = {};
	
	//Create lookup dataset
	var dsPaymentTerm = jslet.data.createEnumDataset("dsPaymentTerm", {'01':'M/T','02':'T/T'});
	//------------------------------------------------------------------------------------------------------
	
	var dsCustomer = jslet.data.createEnumDataset("dsCustomer", {'01':'ABC','02':'Oil Group LTD','03':'Mail Group LTD'});
	//------------------------------------------------------------------------------------------------------
	
	//Create master dataset and its fields
	var dsSaleMaster = dataSet.dsSaleMaster = new jslet.data.Dataset("dsSaleMaster");
	var fldObj = jslet.data.createStringField("saleid", 8);
	fldObj.label("Sales ID");
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createDateField("saledate");
	fldObj.displayFormat("yyyy-MM-dd");
	fldObj.label("Sales Date");
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createStringField("customer", 20);
	fldObj.label("Customer");
	var lkFld = new jslet.data.FieldLookup();
	lkFld.dataset(dsCustomer);
	fldObj.lookup(lkFld);
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createStringField("paymentterm", 10);
	fldObj.label("Payment Term");
	lkFld = new jslet.data.FieldLookup();
	lkFld.dataset(dsPaymentTerm);
	fldObj.lookup(lkFld);
	dsSaleMaster.addField(fldObj);
	
	fldObj = jslet.data.createStringField("comment", 20);
	fldObj.label("Comment");
	fldObj.displayWidth(30);
	dsSaleMaster.addField(fldObj);
	//------------------------------------------------------------------------------------------------------
	
	//Create detail dataset and its fields 
	var dsSaleDetail = dataSet.dsSaleDetail = new jslet.data.Dataset("dsSaleDetail");
	fldObj = jslet.data.createNumberField("seqno");
	fldObj.label("Number");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createStringField("product", 10);
	fldObj.label("Product");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("num", 8);
	fldObj.label("Num");
	fldObj.displayFormat("#,##0");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("price", 10, 2);
	fldObj.label("Price");
	fldObj.displayFormat("#,##0.00");
	dsSaleDetail.addField(fldObj);
	
	fldObj = jslet.data.createNumberField("amount", 10, 2);
	fldObj.label("Amount");
	fldObj.formula("[num]*[price]");
	fldObj.displayFormat("#,##0.00");
	dsSaleDetail.addField(fldObj);
	
	//Important! Create "DatasetField" in master dataset, and connect to detail dataset.
	fldObj = jslet.data.createDatasetField("details", dsSaleDetail);
	dsSaleMaster.addField(fldObj);
	//------------------------------------------------------------------------------------------------------
	
	//Add data into detail dataset
	var detail1 = [{ "seqno": 1, "product": "P1", "num": 2000, "price": 11.5 },
	{ "seqno": 2, "product": "P2", "num": 1000, "price": 11.5 },
	{ "seqno": 3, "product": "P3", "num": 3000, "price": 11.5 },
	{ "seqno": 4, "product": "P4", "num": 5000, "price": 11.5 },
	{ "seqno": 5, "product": "P5", "num": 8000, "price": 11.5}];
	
	var detail2 = [{ "seqno": 1, "product": "M1", "num": 1, "price": 10001 },
	{ "seqno": 2, "product": "M2", "num": 2, "price": 30000}];
	
	//Add data into master dataset
	var dataList = [{ "saleid": "200901001", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02", "details": detail1 },
	{ "saleid": "200901002", "saledate": new Date(2001, 1, 1), "customer": "01", "paymentterm": "01", "details": detail2 },
	{ "saleid": "200901003", "saledate": new Date(2001, 1, 1), "customer": "02", "paymentterm": "02"}];
	dsSaleMaster.dataList(dataList);
	
	module.exports = dataSet;


/***/ },
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	var jslet = __webpack_require__(13);
	var Interpreter = __webpack_require__(14);
	
	var dataSet = __webpack_require__(20);
	
	var dsSaleDetail = dataSet.dsSaleDetail;
	var dsSaleMaster = dataSet.dsSaleMaster;
	
	
	
	// pares....
	var tpl = {
		root: 'root',
		controls: [
			{
				panel: {
					title: 'Master-Detail', 
					bodyTpl: '<div id="tablePanel" style="height:200px"></div><hr><div id="editPanel"></div>',
					toolbar: ['edit']
				},
				bind: [{
					el: 'tablePanel',
					jsletParams: {type:'DBTable', dataset: 'dsSaleMaster'}
				},{
					el: 'editPanel',
					jsletParams: {type:'DBTable', dataset: 'dsSaleDetail'}
				}]
			}
		]
	};
	
	var interpreter = new Interpreter(tpl);
	
	interpreter.parse();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map