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
