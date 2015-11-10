
/**
 * 公共基础工具
 * @type {Object}
 */
module.exports = {

	toString: Object.prototype.toString,

	hasOwn: Object.prototype.hasOwnProperty,

	isArray: Array.isArray || function(val) {
		return this.toString.call(val) === '[object Array]'; 
	},

	keys: Object.keys || function(o) {
		var result = [];

		for (var name in o) {
			if (o.hasOwnProperty(name)) {
				result.push(name);
			}
		}

		return result;
	},

	isFunction: function(val) {
		return this.toString.call(val) === '[object Function]';
	},

	isString: function(val) {
		return this.toString.call(val) === '[object String]';
	},

	// 判断是否是 window top self 等 window 对象
	isWindow: function(o) {
		return o != null && o == o.window;
	},

	// 适用于获取 select 和 input[type=radio] 的值
	getRadioValue: function(radioName) {
		var radiosEl = document.getElementsByName(radioName);
		for (var i = 0, len = radiosEl.length; i < len; i++) {
			if (radiosEl[i].checked || len === 1) {
				return radiosEl[i].value;
			}
		}
	},

	// 是否为纯对象 {} or new Object();
	isPlainObject: function(o) {

		// Must be an Object. Dom nodes and window objects don't pass through.
		if (!o || this.toString.call(o) !== '[object Object]' || o.nodeType || this.isWindow(o)) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if (o.constructor && !hasOwn.call(o, 'constructor') && !hasOwn(o.constructor.prototype, 'isPrototypeOf')) {
				return false;
			}
		} catch(e) {
			// IE8/9 will throw exceptions on certain host objects #9897
			return false;
		}

		var key;

		// for-in 是否最后才遍历自己的属性
		var iteratesOwnLast;
		(function() {
		  var props = [];
		  function Ctor() { this.x = 1; }
		  Ctor.prototype = { 'valueOf': 1, 'y': 1 };
		  for (var prop in new Ctor()) { props.push(prop); }
		  iteratesOwnLast = props[0] !== 'x';
		}());

		// Support: IE < 9 for-in will iterate inherited properties firstly. 
		// Handle iteration over inherited properties before own properties.
		// http://bugs.jquery.com/ticket/12199
		if (iteratesOwnLast) {
			for (key in o) {
				return this.hasOwn.call(o, key);
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for (key in o) {}

		return key === undefined || hasOwn.call(o, key);

	},

	isEmptyObject: function(o) {
		if (!o || this.toString.call(o) !== '[object Object]' || o.nodeType || this.isWindow(o) || !o.hasOwnProperty) {
			return false;
		}

		for (var p in o) {
			if (o.hasOwnProperty(p)) {
				return false;
			}
		}

		return true;
	},

	merge: function(receiver, supplier) {
		var key;

		for (key in supplier) {
			if (supplier.hasOwnProperty(key)) {
				receiver[key] = this.cloneValue(supplier[key], receiver[key]);
			}
		}

		return receiver;
	},

	// 只 clone 数组和 plain object，其他的保持不变
	cloneValue: function(value, prev) {
		if (this.isArray(value)) {
			value = value.slice();
		}
		else if (this.isPlainObject(value)) {
			isPlainObject(prev) || (prev = {});

			value = merge(prev, value);
		}

		return value;
	}



	

		

}

