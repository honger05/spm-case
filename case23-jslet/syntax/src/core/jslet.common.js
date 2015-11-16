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
