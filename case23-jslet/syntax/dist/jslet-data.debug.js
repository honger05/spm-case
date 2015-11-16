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
	
	debugMode: true
};

/**
 * Global server error handler
 * 
 * @errCode {String} error code
 * @errMsg {String} error message
 * @return {Boolean} Identify if handler catch this error, if catched, the rest handler will not process it.
 */
jslet.global.serverErrorHandler = function(errCode, errMsg) {
	return false;
}/* ========================================================================
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
	return testValue && testValue.match(jsPattern) !== null;
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
		json = jQuery.trim(json);
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
		return JSON.parse(this.normalize(json));
	},
	
	stringify: function(value, replacer, space) {
		return JSON.stringify(value, replacer, space);
	}

};

/**
* Show error message.
*  
* @param e - error object or error message
*/
jslet.showError = function (e) {
	var msg;
	if (typeof (e) == 'string') {
		msg = e;
	} else {
		msg = e.message;
	}
	if (jslet.ui.MessageBox) {
		jslet.ui.MessageBox.error(msg);
	} else {
		alert(msg);
	}
};

/**
* Show Info message.
* 
* @param e - error object or error message
*/
jslet.showInfo = function (e) {
	var msg;
	if (typeof (e) == 'string') {
		msg = e;
	} else {
		msg = e.message;
	}
	if (jslet.ui.MessageBox) {
		jslet.ui.MessageBox.alert(msg);
	} else {
		alert(msg);
	}
};

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
}/* ========================================================================
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
jslet.data.getDataset = function (dsName) {
	return jslet.data.dataModule.get(dsName);
};

jslet.data.DataType = {
	NUMBER: 'N', //Number
	STRING: 'S', //String
	DATE: 'D',  //Date
	TIME: 'T',  //Time
	BOOLEAN: 'B', //Boolean
	DATASET: 'V', //Dataset field
	GROUP: 'G'  //Group Field
};

jslet.data.FieldValueStyle = {
	NORMAL: 0,
	BETWEEN: 1,
	MULTIPLE: 2
};

/**
 * @class 
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
	AFTERCANCEL: 'afterCancel'
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
	
	changeMetaEvent: function(metaName, fieldName) {
		return {eventType: jslet.data.RefreshEvent.CHANGEMETA, metaName: metaName, fieldName: fieldName};
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
	
	lookupEvent: function(fieldName) {
		return {eventType: jslet.data.RefreshEvent.UPDATELOOKUP, fieldName: fieldName};
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
	checkInputChar: function (fldObj, inputChar) {
		var validChars = fldObj.validChars();
		
		if (validChars && inputChar) {
			var c = inputChar.charAt(0);
			return validChars.indexOf(c) >= 0;
		}
		return true;
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
				if (fldObj.scale() === 0) {
					value = parseInt(inputText);
				} else {
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
		var value = 0;
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
		return value ? 'true': 'false';
	}
});

jslet.data.LookupValueConverter = jslet.Class.create(jslet.data.FieldValueConverter, {
	textToValue: function(fldObj, inputText, valueIndex) {
		var value = '',
			lkFldObj = fldObj.lookup();
		
		value = lkFldObj.dataset()._convertFieldValue(
				lkFldObj.codeField(), inputText, lkFldObj.keyField());
		if (value === null) {
			var invalidMsg = jslet.formatString(jslet.locale.Dataset.valueNotFound);
			fldObj.message(invalidMsg, valueIndex);
			return null;
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

jslet.data._record2JsonFilter = function(key, value) {
	if(key == jslet.data.FieldValueCache.CACHENAME) {
		return undefined;
	} else {
		return value;
	}
};

jslet.data.record2Json = function(records) {
	if(!window.JSON || !JSON) {
		alert('Your browser does not support JSON!');
		return;
	}
	return JSON.stringify(records, jslet.data._record2JsonFilter);
};

/*Field value cache manager*/
jslet.data.FieldValueCache = {
	CACHENAME: '_cache_',
	
	put: function(record, fieldName, value, valueIndex) {
		if(!record) {
			throw new Error('Record can\'t be null!')
		}
		var cacheObj = record[this.CACHENAME];
		if(!cacheObj) {
			cacheObj = {};
			record[this.CACHENAME] = cacheObj;
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
		if(!record) {
			return undefined;
		}
		var cacheObj = record[this.CACHENAME];
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
		if(!record) {
			return;
		}
		var cacheObj = record[this.CACHENAME];
		if(cacheObj) {
			cacheObj[fieldName] = undefined;
		}
	},
	
	clearAll: function(dataset, fieldName) {
		var dataList = dataset.dataList();
		if(!dataList) {
			return;
		}
		var rec, cacheObj;
		for(var i = 0, len = dataList.length; i < len; i++) {
			rec = dataList[i];
			cacheObj = rec[this.CACHENAME];
			if(cacheObj) {
				delete cacheObj[fieldName];
			}
		}
	},
	
	removeCache: function(record) {
		if(record) {
			record[this.CACHENAME] = {};
		}
	}
};
/*End of field value cache manager*/

jslet.data.DatasetRelationManager = function() {
	var relations= [];
	
	this.addRelation = function(datasetName, fieldName, lookupDatasetName) {
		for(var i = 0, len = relations.length; i < len; i++) {
			var relation = relations[i];
			if(relation.hostDataset == datasetName && 
				relation.hostField == fieldName && 
				relation.lookupDataset == lookupDatasetName) {
				return;
			}
		}
		relations.push({hostDataset: datasetName, hostField: fieldName, lookupDataset: lookupDatasetName});
//		console.log(datasetName + ":" + fieldName + ":" + lookupDatasetName)
	};
	
	this.removeRelation = function(datasetName, fieldName, lookupDatasetName) {
		for(var i = 0, len = relations.length; i < len; i++) {
			var relation = relations[i];
			if(relation.hostDataset == datasetName && 
					relation.hostField == fieldName && 
					relation.lookupDataset == lookupDatasetName) {
				relations.splice(i,1);
			}
		}
	};
	
	this.refreshHostDataset = function(lookupDatasetName) {
		var relation, hostDataset;
		for(var i = 0, len = relations.length; i < len; i++) {
			relation = relations[i];
			if(relation.lookupDataset == lookupDatasetName) {
				hostDataset = jslet.data.getDataset(relation.hostDataset);
				if(hostDataset) {
					hostDataset.handleLookupDatasetChanged(relation.hostField);
				}
			}
		}
	};
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

	var dateFlds = [], i,
		fields = Z.getNormalFields(),
		cnt = fields.length, fldObj;
	for (i = 0; i < cnt; i++) {
		fldObj = fields[i];
		if (fldObj.getType() == jslet.data.DataType.DATE) {
			dateFlds.push(fldObj.name());
		}
	}
	if (dateFlds.length === 0) {
		return;
	}

	var rec, fname, value,
		recCnt = records.length;
	for (i = 0; i < recCnt; i++) {
		rec = records[i];
		for (var j = 0, fcnt = dateFlds.length; j < fcnt; j++) {
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
	} //end for i
}/* ========================================================================
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
	jslet.Checker.test('jslet.Expression#expr', expr).required().isString();
	this._fields = [];
	this._otherDatasetFields = [];
	this._expr = expr;
	this._parsedExpr = '';
	if (typeof dataset == "string") {
		this._dataset = jslet.data.dataModule.get(dataset);
		if (!this._dataset) {
			throw new Error(jslet.formatString(jslet.locale.Dataset.datasetNotFound, [dsName]));
		}
	}else{
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
			if (dsObj.getField(fldName) === null) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}

			if (!dsName) {
				tmpExpr.push(this._expr.substring(start, end));
				tmpExpr.push('context.mainds.fieldValueByRec(context.dataRec, "');
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
 * Jslet framework: jslet.dataset.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

jslet.data.dataModule = new jslet.SimpleMap();
jslet.data.getDataset = function (dsName) {
    return jslet.data.dataModule.get(dsName);
};

/**
 * @class Dataset
 * 
 * @param {String} name dataset's name that must be unique in jslet.data.dataModule variable.
 */
jslet.data.Dataset = function (name) {
	jslet.Checker.test('Dataset.name', name).isString();
	name = jQuery.trim(name);
	jslet.Checker.test('Dataset.name', name).required();
	
	var Z = this;
	Z._name = null; //Dataset name
	Z._recordClass = jslet.global.defaultRecordClass; //Record class, used for serialized/deserialize
	Z._dataList = null; //Array of data records
	
	Z._datasetListener = null; //Dataset event listener object, like: function(eventType/*jslet.data.DatasetEvent*/) {}

	Z._fields = []; //Array of jslet.data.Field
	Z._normalFields = []; //Array of jslet.data.Field except group field
	Z._recno = -1;
	Z._filteredRecnoArray = null;

	Z._unitConvertFactor = 1;
	Z._unitName = null;
	Z._aborted = false;
	Z._insertedDelta = []; //Array of record
	Z._updatedDelta = []; //Array of record
	Z._deletedDelta = []; //Array of record

	Z._status = 0; // dataset status, optional values: 0:browse;1:created;2:updated;3:deleted;
	Z._subDatasetFields = null; //Array of dataset field object

	Z._filter = null;
	Z._filtered = false;
	Z._innerFilter = null; //inner variable
	Z._findCondition = null;
	Z._innerFindCondition = null; //inner variable

	Z._innerFormularFields = null; //inner variable

	Z._bof = false;
	Z._eof = false;
	Z._igoreEvent = false;
	Z._logChanged = true;

	Z._modiObject = null;
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
	
	Z.fieldValidator = new jslet.data.FieldValidator();
	
	/**
	 * Fired after field value changed.
	 * Pattern:
	 *   function(fieldName, fldValue) {}
	 *   //fieldName: String, field name;
	 *   //fldValue: Object, field value.
	 */
	Z.onFieldChange = null;  
	
	/**
	 * Fired when check a record if it's selectable or not.
	 * Pattern:
	 *   function() {}
	 *   //return: Boolean, true - record can be selected, false - otherwise.
	 */
	Z._onCheckSelectable = null;
	Z._autoShowError = false;
	Z._autoRefreshHostDataset = false;
	Z._readOnly = false;
	
	var dsName = this._name;
	if (dsName) {
		jslet.data.dataModule.unset(dsName);
	}
	jslet.data.dataModule.unset(name);
	jslet.data.dataModule.set(name, this);
	this._name = name;
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
	name: function() {
		if(arguments.length >0) {
			throw new Error("Can't change dataset name! Use new jslet.data.Dataset('dsName') instead!");
		}
		return this._name;
	},
		
	/**
	* Set dataset's name.
	* 
	* @param {String} name Dataset's name that must be unique in jslet.data.dataModule variable.
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

		result._filter = Z._filter;
		result._filtered = Z._filtered;
		result._logChanged = Z._logChanged;
		result._fixedIndexFields = Z._fixedIndexFields;
		result._indexFields = Z._indexFields;
		var keyFldName = Z._keyField,
			codeFldName = Z._codeField,
			nameFldName = Z._nameField,
			parentFldName = Z._parentField,
			selectFldName = Z._selectField;
		if (fieldNames) {
			keyFldName = keyFldName && fieldNames.indexOf(keyFldName) >= 0 ? keyFldName: null;
			codeFldName = codeFldName && fieldNames.indexOf(codeFldName) >= 0 ? codeFldName: null;
			nameFldName = nameFldName && fieldNames.indexOf(nameFldName) >= 0 ? nameFldName: null;
			parentFldName = parentFldName && fieldNames.indexOf(parentFldName) >= 0 ? parentFldName: null;
			selectFldName = selectFldName && fieldNames.indexOf(selectFldName) >= 0 ? selectFldName: null;
		}
		result._keyField = keyFldName;
		result._codeField = codeFldName;
		result._nameField = nameFldName;
		result._parentField = parentFldName;
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
			fldObj._fireMetaChangedEvent('readOnly');
		}
		return this;
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
	 * Alert the error message when confirm or apply to server.
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
		
		jslet.Checker.test('Dataset.datasetListener#listener', listener).isFunction();
		this._datasetListener = listener;
		return this;
	},
	
	onCheckSelectable: function(onCheckSelectable) {
		if (onCheckSelectable === undefined) {
			return this._onCheckSelectable;
		}
		
		jslet.Checker.test('Dataset.onCheckSelectable', onCheckSelectable).isFunction();
		this._onCheckSelectable = onCheckSelectable;
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
	 * Get fields except group field
	 * @return {Array of jslet.data.Field}
	 */
	getNormalFields: function() {
		return this._normalFields;
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
			
			if (fldObj.getType() == jslet.data.DataType.GROUP) {
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
			if (fldObj.getType() != jslet.data.DataType.GROUP) {
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
		var Z = this;
		Z._fields.push(fldObj);
		fldObj.dataset(Z);
		if (fldObj.displayOrder() !== 0) {
			Z._fields.sort(fldObj.sortByIndex);
		}
		if (fldObj.getType() == jslet.data.DataType.DATASET) {
			if (!Z._subDatasetFields)
				Z._subDatasetFields = [];
			Z._subDatasetFields.push(fldObj);
		}
		Z._cacheNormalFields();
		return Z;
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
			Z._cacheNormalFields();
			jslet.data.FieldValueCache.clearAll(Z, fldName);
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
			var lkf = fldObj.lookup();
			if (lkf) {
				var lkds = lkf.dataset();
				if (lkds) {
					return lkds.getField(arrField.join('.'));
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
		
		var indexFlds = dsObj._sortingFields, v1, v2, fname, flag = 1;
		for (var i = 0, cnt = indexFlds.length; i < cnt; i++) {
			fname = indexFlds[i].fieldName;
			v1 = dsObj.fieldValueByRec(rec1, fname);
			v2 = dsObj.fieldValueByRec(rec2, fname);
			if (v1 == v2) {
				continue;
			}
			if (v1 !== null && v2 !== null) {
				if (v1 < v2) {
					flag = -1;
				} else {
					flag = 1;
				}
			} else if (v1 === null && v2 !== null) {
				flag = -1;
			} else {
				if (v1 !== null && v2 === null) {
					flag = 1;
				}
			}
			return flag * indexFlds[i].order;
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
		indFlds = jQuery.trim(fixedIndexFields);
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
		if (!Z._dataList || Z._dataList.length === 0) {
			return;
		}

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
			Z._dataList.sort(Z.sortFunc);
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
		if (fldObj.getType() != jslet.data.DataType.GROUP) {
			Z._combineIndexCfg(fldObj.name(), order);
		} else {
			var children = fldObj.children();
			if (children) {
				for(var k = 0, childCnt = children.length; k < childCnt; k++) {
					Z._createIndexCfg(children[k], order);
				}
			}
		}
	},
	
	/**
	 * @private
	 */
	_combineIndexCfg: function(fldName, order) {
		for(var i = 0, len = this._sortingFields.length; i < len; i++) {
			if (this._sortingFields[i].fieldName == fldName) {
				this._sortingFields.splice(i,1);//remove duplicated field
			}
		}
		var indexNameObj = {
				fieldName: fldName,
				order: order
			};
		this._sortingFields.push(indexNameObj);
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
		filterExpr = jQuery.trim(filterExpr);
		var oldFilter = Z._filter;
		if (!filterExpr) {
			Z._innerFilter = null;
			Z._filtered = false;
			Z._filter = null;
			Z._filteredRecnoArray = null;
		} else {
			Z._filter = filterExpr;
			if(oldFilter == Z._filter) {
				return this;
			} else {
				Z._innerFilter = new jslet.Expression(Z, filterExpr);
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
		
		var oldFilter = Z._filter, oldFiltered = Z._filtered;
		if (afiltered && !Z._filter) {
			Z._filtered = false;
		} else {
			Z._filtered = afiltered ? true: false;
		}

		if(oldFilter == Z._filter && oldFiltered == Z._filtered) {
			return this;
		}
		this._doFilterChanged();
		return this;
	},
	
	_doFilterChanged: function() {
		var Z = this;
		Z.disableControls();
		try {
			if (!Z._filtered) {
				Z._filteredRecnoArray = null;
			} else {
				Z._refreshInnerRecno();
			}
			Z.first();
		}
		finally {
			Z.enableControls();
		}
		Z.refreshHostDataset();

		return this;
	},
	
	/**
	 * @private, filter data
	 */
	_filterData: function () {
		var Z = this;
		if (!Z._filtered || !Z._filter || 
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
		if (!Z._dataList || Z._dataList.length === 0) {
			Z._filteredRecnoArray = null;
			return;
		}
		Z._filteredRecnoArray = null;
		var tempRecno = [];
		for (var i = 0, cnt = Z._dataList.length; i < cnt; i++) {
			Z._recno = i;
			if (Z._filterData()) {
				tempRecno.push(i);
			}
		}
		Z._filteredRecnoArray = tempRecno;
	},

	/**
	 * @private
	 */
	_fireDatasetEvent: function (evtType) {
		var Z = this;
		if (Z._silence || Z._igoreEvent || !Z._datasetListener) {
			return;
		}
		Z._datasetListener.call(Z, evtType);
	},

	/**
	 * Get record count
	 * 
	 * @return {Integer}
	 */
	recordCount: function () {
		if (this._dataList) {
			if (!this._filteredRecnoArray) {
				return this._dataList.length;
			} else {
				return this._filteredRecnoArray.length;
			}
		}
		return 0;
	},

	hasRecord: function () {
		return this.recordCount() > 0;
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
			return this;
		}
		
		if (recno == Z._recno) {
			return this;
		}
		if (Z._status != jslet.data.DataSetStatus.BROWSE) {
			Z.confirm();
			if (Z._aborted) {
				return this;
			}
		}
		Z._gotoRecno(recno);
		Z._bof = Z._eof = false;
		return this;
	},
	
	/**
	 * @private
	 * Set record number(Private)
	 * 
	 * @param {Integer}recno - record number
	 */
	recnoSilence: function (recno) {
		this._recno = recno;
	},

	/**
	 * @private
	 * Goto specified record number(Private)
	 * 
	 * @param {Integer}recno - record number
	 */
	_gotoRecno: function (recno) {
		var Z = this;
		var recCnt = Z.recordCount();
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
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORESCROLL);
			if (Z._aborted) {
				return false;
			}
			if (!Z._lockCount) {
				evt = jslet.data.RefreshEvent.beforeScrollEvent(Z._recno);
				jslet.debounce(Z.refreshControl, 100).call(Z, evt);
			}
		}

		var preno = Z._recno;
		Z._recno = recno;
		
		if (Z._subDatasetFields && Z._subDatasetFields.length > 0) {
			var fldObj, subds;
			for (var i = 0, len = Z._subDatasetFields.length; i < len; i++) {
				fldObj = Z._subDatasetFields[i];
				subds = fldObj.subDataset();
				if (subds) {
					subds.confirm();
					subds.dataList(Z.getFieldValue(fldObj.name()));
					var indexflds = subds.indexFields();
					if (indexflds) {
						subds.indexFields(indexflds);
					} else {
						subds.refreshControl();
					}
				}
			} //end for
		} //end if
		if (Z._contextRuleEnabled) {
			this.calcContextRule();
		}

		if (!Z._silence) {
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			if (!Z._lockCount) {
				evt = jslet.data.RefreshEvent.scrollEvent(Z._recno, preno);
				jslet.debounce(Z.refreshControl, 100).call(Z, evt);
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
		if (Z._status != jslet.data.DataSetStatus.BROWSE) {
			Z.confirm();
			if (Z._aborted) {
				return;
			}
		}

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
		if (Z._status != jslet.data.DataSetStatus.BROWSE) {
			Z.confirm();
			if (Z._aborted) {
				return;
			}
		}
		if (!Z._dataList || Z._dataList.length === 0) {
			return false;
		}
		jslet.Checker.test('dataset.moveToRecord#recordObj', recordObj).required().isObject();
		var k = Z._dataList.indexOf(recordObj);
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
	 * Check dataset status and confirm dataset 
	 */
	_checkStatusAndConfirm: function () {
		if (this._status != jslet.data.DataSetStatus.BROWSE) {
			this.confirm();
		}
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

		if (!Z._dataList || Z._dataList.length === 0) {
			Z.innerInsert();
			return;
		}

		var context = Z.startSilenceMove(true);
		try {
			Z.getRecord()._expanded_ = true;
			if (parentId) {
				if (!Z.findByKey(parentId)) {
					return;
				}
			} else {
				parentId = Z.keyValue();
			}

			var pfldname = Z.parentField(), parentParentId = Z.getFieldValue(pfldname);
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

		if (!Z._dataList || Z._dataList.length === 0) {
			Z.innerInsert();
			return;
		}

		var parentId = Z.getFieldValue(Z.parentField()),
			context = Z.startSilenceMove(true),
			found = false,
			parentKeys = [],
			currPKey, prePKey = Z.keyValue();
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
		this.innerInsert();
	},

	/**
	 * Add record after last record, and move cursor to the newly record.
	 */
	appendRecord: function () {
		var Z = this;
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
		this._status = status;
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
		var cacheObj = record[jslet.data.FieldValueCache.CACHENAME];
		
		if(status === undefined) {
			if(!cacheObj) {
				return jslet.data.DataSetStatus.BROWSE;
			}
			return cacheObj._data_status_;
		}
		var oldValue = -1;
		if(!cacheObj) {
			cacheObj = {};
			record[jslet.data.FieldValueCache.CACHENAME] = cacheObj;
		} else {
			oldValue = cacheObj._data_status_;
		}
		if(oldValue != status) {
			if(this._contextRuleEngine) {
				this._contextRuleEngine.evalStatus();
			}
		}
		cacheObj._data_status_ = status;
	},
	
	/**
	 * @Private
	 */
	innerInsert: function (beforeInsertFn) {
		var Z = this;
		var mfld = Z._datasetField, mds = null;
		if (mfld) {
			mds = mfld.dataset();
			if (mds.recordCount() === 0) {
				throw new Error(jslet.locale.Dataset.insertMasterFirst);
			}
		}

		if (Z._dataList === null) {
			Z._dataList = [];
		}
		Z._aborted = false;
		Z._checkStatusAndConfirm();
		if (Z._aborted) {
			return;
		}

		Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREINSERT);
		if (Z._aborted) {
			return;
		}

		var preRecno = Z.recno(), k;
		if (this.recordCount() > 0) {
			k = Z._dataList.indexOf(this.getRecord()) + 1;
		} else {
			k = 0;
		}

		Z._modiObject = {};
		Z._dataList.splice(k, 0, Z._modiObject);

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
			beforeInsertFn(Z._modiObject);
		}

		if (mfld && mds) {
			mds.editRecord();
			var subFields = mfld.name();
			if (!mds.getFieldValue(subFields)) {
				mds.setFieldValue(subFields, Z._dataList);
			}
		}

		Z._aborted = false;
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
		Z.filtered(false);
		var k;
		if (this.recordCount() > 0) {
			k = Z._dataList.indexOf(this.getRecord()) + 1;
		} else {
			k = Z._dataList.length;
		}

		var context = srcDataset.startSilenceMove(true), rec;
		try {
			srcDataset.first();
			while (!srcDataset.isEof()) {
				rec = srcDataset.getRecord();
				Z._dataList.splice(k++, 0, rec);
				srcDataset.next();
			}
		} finally {
			srcDataset.endSilenceMove(context);
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
		Z.disableControls();
		try{
			var keyField = Z.keyField(), rec,
				keyValue;
			for(var i = 0, len = records.length; i < len; i++) {
				rec = records[i];
				keyValue = rec[keyField];
				if(!keyValue) {
					throw new Error('batchAppend: Key Value required!');
				}
				if(Z.findByKey(keyValue)) {
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
			Z.refreshHostDataset();
		}
	},
	
	/**
	 * @rivate
	 * Calculate default value.
	 */
	_calcDefaultValue: function () {
		var Z = this, fldObj, expr, value, fname;
		for (var i = 0, fldcnt = Z._normalFields.length; i < fldcnt; i++) {
			fldObj = Z._normalFields[i];
			fname = fldObj.name();
			if (fldObj.getType() == jslet.data.DataType.DATASET) {
				var subds = fldObj.subDataset();
				Z.setFieldValue(fname, null);
				continue;
			}
			value = fldObj.defaultValue();
			if (value === undefined || value === null) {
				expr = fldObj.defaultExpr();
				if (!expr) {
					continue;
				}
				value = window.eval(expr);
			}
			var valueStyle = fldObj.valueStyle();
			if(valueStyle == jslet.data.FieldValueStyle.BETWEEN) {
				value = [value, value];
			} else if(valueStyle == jslet.data.FieldValueStyle.MULTIPLE) {
				value = [value];
			}
			Z.setFieldValue(fname, value);		
		}
	},

	/**
	 * Get record object by record number.
	 * 
	 * @param {Integer} recno Record Number.
	 * @return {Object} Dataset record.
	 */
	getRecord: function (recno) {
		var Z = this, k;
		if(!Z._dataList || Z._dataList.length === 0) {
			return null;
		}
		//Used to convert field value for performance purpose. 
		if(Z._ignoreFilter) {
			return Z._dataList[Z._ignoreFilterRecno || 0];
		}
		
		if (Z.recordCount() === 0) {
			return null;
		}
		if (recno === undefined) {
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

		return Z._dataList[k];
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
			isSame = (preRec[fldName] == currRec[fldName]);
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
	 * Update record and send dataset to update status.
	 * You can use cancel() or confirm() method to return browse status.
	 */
	editRecord: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.UPDATE ||
			Z._status == jslet.data.DataSetStatus.INSERT) {
			return;
		}

		if (Z._dataList === null || Z._dataList.length === 0) {
			Z.insertRecord();
		} else {
			Z._aborted = false;
			Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREUPDATE);
			if (Z._aborted) {
				return;
			}

			Z._modiObject = {};
			jQuery.extend(Z._modiObject, Z.getRecord());
			var mfld = Z._datasetField;
			if (mfld && mfld.dataset()) {
				mfld.dataset().editRecord();
			}

			Z.status(jslet.data.DataSetStatus.UPDATE);
			Z.changedStatus(jslet.data.DataSetStatus.UPDATE);
						
			Z._aborted = false;
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERUPDATE);
		}
	},

	/**
	 * Delete record
	 */
	deleteRecord: function () {
		var Z = this;
		var recCnt = Z.recordCount();
		if (recCnt === 0) {
			return;
		}
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
		Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFOREDELETE);
		if (Z._aborted) {
			return;
		}
		if (Z._logChanged) {
			var rec = Z.getRecord(), isNew = false, i, cnt;
			cnt = Z._insertedDelta.length;
			for (i = 0; i < cnt; i++) {
				if (Z._insertedDelta[i] == rec) {
					Z._insertedDelta.splice(i, 1);
					isNew = true;
					break;
				}
			}
			if (!isNew) {
				cnt = Z._updatedDelta.length;
				for (i = 0; i < cnt; i++) {
					if (Z._updatedDelta[i] == rec) {
						Z._updatedDelta.splice(i, 1);
						break;
					}
				}
				Z._deletedDelta.push(rec);
			}
		}
		var preRecno = Z.recno(), 
			isLast = preRecno == (recCnt - 1), 
			k = Z._recno;
		
		Z.changedStatus(jslet.data.DataSetStatus.DELETE);
		Z._dataList.splice(k, 1);
		Z._refreshInnerRecno();
		var mfld = Z._datasetField;
		if (mfld && mfld.dataset()) {
			mfld.dataset().editRecord();
		}

		Z.status(jslet.data.DataSetStatus.BROWSE);
		
		var evt = jslet.data.RefreshEvent.deleteEvent(preRecno);
		Z.refreshControl(evt);

		if (isLast) {
			Z._silence++;
			try {
				Z.prior();
			} finally {
				Z._silence--;
			}
		}
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);	
		if (Z.isBof() && Z.isEof()) {
			return;
		}
		evt = jslet.data.RefreshEvent.scrollEvent(Z._recno);

		Z.refreshControl(evt);
	},

	/**
	 * @private
	 */
	_innerValidateData: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE || Z.recordCount() === 0) {
			return;
		}
		var fldObj, v, fldName, maxFld, fmax, vmax, fldValue, invalidMsg;

		for (var i = 0, cnt = Z._normalFields.length; i < cnt; i++) {
			fldObj = Z._normalFields[i];
			if (fldObj.disabled() || fldObj.readOnly() || !fldObj.visible()) {
				continue;
			}
			fldName = fldObj.name();
			fldValue = Z.getFieldValue(fldName);
			if(fldObj.valueStyle() == jslet.data.FieldValueStyle.NORMAL) {
				if(!fldObj.message()) {
					invalidMsg = Z.fieldValidator.checkRequired(fldObj, fldValue);
					invalidMsg = invalidMsg || Z.fieldValidator.checkValue(fldObj, fldValue);
					if (invalidMsg) {
						fldObj.message(invalidMsg);
					}
				}
			} else {
				invalidMsg = Z.fieldValidator.checkRequired(fldObj, fldValue);
				if (invalidMsg) {
					fldObj.message(invalidMsg);
					return;
				}
				if(fldValue) {
					for(var k = 0, len = fldValue.length; k < len; k++) {
						if(!fldObj.message(k)) {
							invalidMsg = invalidMsg || Z.fieldValidator.checkValue(fldObj, fldValue);
							if (invalidMsg) {
								fldObj.message(invalidMsg, k);
							}
						}
					} //end for k
				}
			}
			
		} //end for i
	},

	/**
	 * @private
	 */
	errorMessage: function(errMessage) {
		var evt = jslet.data.RefreshEvent.errorEvent(errMessage || '');
		this.refreshControl(evt);
	},
	
	/**
	 * Confirm insert or update
	 */
	confirm: function () {
		var Z = this;
		if (Z._silence || Z._status == jslet.data.DataSetStatus.BROWSE) {
			return true;
		}
		
		Z._innerValidateData();
		var evt;
		if (Z.hasFieldErrorMessage() || !Z._confirmSubDataset()) {
			console.error(jslet.locale.Dataset.cannotConfirm);
			if (Z._autoShowError) {
				jslet.showInfo(jslet.locale.Dataset.cannotConfirm);
			}
			Z._aborted = true;
			evt = jslet.data.RefreshEvent.updateRecordEvent();
			Z.refreshControl(evt);
			Z.errorMessage(jslet.locale.Dataset.cannotConfirm);			
			return false;
		}
		Z.errorMessage();
		Z._aborted = false;
		Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECONFIRM);
		if (Z._aborted) {
			return false;
		}
		var rec;
		if (Z._status == jslet.data.DataSetStatus.INSERT) {
			if (Z._logChanged) {
				rec = Z.getRecord();
				Z._insertedDelta.push(rec);
			}
		} else {
			if (Z._logChanged) {
				rec = Z.getRecord();
				if (Z._insertedDelta.indexOf(rec) < 0 ) {
					var k = Z._updatedDelta.indexOf(rec);
					if (k < 0) {
						Z._updatedDelta.push(rec);
					} else {
						Z._updatedDelta[k] = rec;
					}
				}
			}
		}
		Z._modiObject = null;
		Z.status(jslet.data.DataSetStatus.BROWSE);
		
		Z.clearFieldErrorMessage();
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCONFIRM);

		evt = jslet.data.RefreshEvent.updateRecordEvent();
		Z.refreshControl(evt);
		return true;
	},

	/*
	 * @private
	 */
	_confirmSubDataset: function() {
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
			if(!subDs.confirm()) {
				console.error('Error in [' + subDs.name() + '], can\'t confirm!');
				return false;
			}
		}
		return true;
	},
	
	/**
	 * Cancel insert or update
	 */
	cancel: function () {
		var Z = this;
		if (Z._status == jslet.data.DataSetStatus.BROWSE) {
			return;
		}
		Z.clearFieldErrorMessage();
		if (Z.recordCount() === 0) {
			return;
		}
		Z._aborted = false;
		Z._fireDatasetEvent(jslet.data.DatasetEvent.BEFORECANCEL);
		if (Z._aborted) {
			return;
		}

		var evt, k = Z._recno;
		if (Z._status == jslet.data.DataSetStatus.INSERT) {
			var no = Z.recno();
			Z._dataList.splice(k, 1);
			Z._refreshInnerRecno();
			if(no >= Z.recordCount()) {
				Z._recno = Z.recordCount() - 1;
			}
			evt = jslet.data.RefreshEvent.deleteEvent(no);
			Z.refreshControl(evt);
			Z.status(jslet.data.DataSetStatus.BROWSE);
			Z.changedStatus(jslet.data.DataSetStatus.BROWSE);
			Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);
			return;
		} else {
			if (Z._filteredRecnoArray) {
				k = Z._filteredRecnoArray[Z._recno];
			}
			jslet.data.FieldValueCache.removeCache(Z._modiObject);
			Z._dataList[k] = Z._modiObject;
			Z._modiObject = null;
			
		}

		Z.status(jslet.data.DataSetStatus.BROWSE);
		Z.changedStatus(jslet.data.DataSetStatus.BROWSE);
		Z._aborted = false;
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERCANCEL);
		Z._fireDatasetEvent(jslet.data.DatasetEvent.AFTERSCROLL);

		evt = jslet.data.RefreshEvent.updateRecordEvent();
		Z.refreshControl(evt);
	},

	/**
	 * Set or get logChanges
	 * if NOT need send changes to Server, can set logChanges to false  
	 * 
	 * @param {Boolean} logChanged
	 */
	logChanges: function (logChanged) {
		if (logChanged === undefined) {
			return Z._logChanged;
		}

		this._logChanged = logChanged;
	},

	/**
	 * Disable refreshing controls, you often use it in a batch operation;
	 * After batch operating, use enableControls()
	 */
	disableControls: function () {
		this._lockCount++;
		var fldObj, lkf, lkds;
		for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
			fldObj = this._normalFields[i];
			lkf = fldObj.lookup();
			if (lkf !== null) {
				lkds = lkf.dataset();
				if (lkds !== null) {
					lkds.disableControls();
				}
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

		var fldObj, lkf, lkds;
		for (var i = 0, cnt = this._normalFields.length; i < cnt; i++) {
			fldObj = this._normalFields[i];
			lkf = fldObj.lookup();
			if (lkf !== null) {
				lkds = lkf.dataset();
				if (lkds !== null) {
					lkds.enableControls(needRefreshCtrl);
				}
			}
		}
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
		return this.fieldValueByRec(currRec, fldName, valueIndex);
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
		if(fldObj.valueStyle() == jslet.data.FieldValueStyle.NORMAL || valueIndex === undefined) {
			currRec[fldName] = value;
			if (fldObj.getType() == jslet.data.DataType.DATASET) {//dataset field
				var subds = fldObj.subDataset();
				subds.dataList(value);
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
		fldObj.message(null, valueIndex);
		if (Z.onFieldChange) {
			Z.onFieldChange.call(Z, fldName, value, valueIndex);
		}
		//calc other fields' range to use context rule
		if (!Z._silence && Z._contextRuleEnabled && value) {
			Z.calcContextRule(fldName);
		}
		jslet.data.FieldValueCache.clear(Z.getRecord(), fldName);
		var evt = jslet.data.RefreshEvent.updateRecordEvent(fldName);
		Z.refreshControl(evt);
		Z.updateFormula();
		return this;
	},

	/**
	 * @rivate
	 */
	removeInnerFormularFields: function (fldName) {
		if (this._innerFormularFields) {
			this._innerFormularFields.remove(fldName);
		}
	},

	/**
	 * Get field value of specified record
	 * 
	 * @param {Object} dataRec - specified record
	 * @param {String} fldName - field name
	 * @return {Object} field value
	 */
	fieldValueByRec: function (dataRec, fldName, valueIndex) {
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
		if (k > 0) {
			subfldName = fldName.substr(0, k);
			fldObj = Z.getField(subfldName);
			var lkf = fldObj.lookup();
			if (!lkf) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [subfldName]));
			}
			value = dataRec[subfldName];
			lkds = lkf.dataset();
			if (lkds.findByField(lkds.keyField(), value)) {
				fldValue = lkds.getFieldValue(fldName.substr(k + 1));
			} else {
				throw new Error(jslet.formatString(jslet.locale.Dataset.valueNotFound,
							[lkds.name(),lkds.keyField(), value]));
			}
		} else {
			if (!fldObj) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			var formula = fldObj.formula();
			if (!formula) {
				value = dataRec[fldName];
				fldValue = value !== undefined ? value :null;
			} else {
				if (Z._innerFormularFields === null) {
					Z._innerFormularFields = new jslet.SimpleMap();
				}
				var evaluator = Z._innerFormularFields.get(fldName);
				if (evaluator === null) {
					evaluator = new jslet.Expression(this, formula);
					Z._innerFormularFields.set(fldName, evaluator);
				}
				evaluator.context.dataRec = dataRec;
				fldValue = evaluator.eval();
				dataRec[fldName] = fldValue;
			}
		}

		if(fldObj.valueStyle() == jslet.data.FieldValueStyle.NORMAL || valueIndex === undefined) {
			return fldValue;
		}
		return jslet.getArrayValue(fldValue, valueIndex);
	},

	hasFieldErrorMessage: function() {
		var fields = this.getNormalFields();
		for(var i = 0, len = fields.length; i < len; i++) {
			if(fields[i].message()) {
				console.error(fields[i].message());
				return true;
			}
		}
		return false;
	},
	
	clearFieldErrorMessage: function() {
		var fields = this.getNormalFields();
		for(var i = 0, len = fields.length; i < len; i++) {
			fields[i].message(null);
		}
	},
	
	/**
	 * Get field display text 
	 * 
	 * @param {String} fldName Field name
	 * @param {Boolean} isEditing In edit mode or not, if in edit mode, return 'Input Text', else return 'Display Text'
	 * @param {Integer} valueIndex identify which item will get if the field has multiple values.
	 * @return {String} 
	 */
	getFieldText: function (fldName, isEditing, valueIndex) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return '';
		}
		var currRec = Z.getRecord(), 
			k = fldName.indexOf('.'), 
			fldObj, lkf, lkds, value;
		if (k > 0) { //Field chain
			fldName = fldName.substr(0, k);
			fldObj = Z.getField(fldName);
			if (!fldObj) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.fieldNotFound, [fldName]));
			}
			lkf = fldObj.lookup();
			if (!lkf) {
				throw new Error(jslet.formatString(jslet.locale.Dataset.lookupNotFound, [fldName]));
			}
			value = currRec[fldName];
			if (value === null || value === undefined) {
				return '';
			}
			lkds = lkf.dataset();
			if (lkds.findByField(lkds.keyField(), value)) {
				fldName = fldName.substr(k + 1);
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
			var minVal = Z.getFieldText(fldName, isEditing, 0),
				maxVal = Z.getFieldText(fldName, isEditing, 1);
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
				result.push(Z.getFieldText(fldName, isEditing, i));
				if(i < len) {
					result.push(jslet.global.valueSeparator);
				}
			}
			return result.join('');
		}
		//Get cached display value if exists.
		if(!isEditing) {
			var cacheValue = jslet.data.FieldValueCache.get(Z.getRecord(), fldName, valueIndex);
			if(cacheValue !== undefined) {
				return cacheValue;
			}
		}
		value = Z.getFieldValue(fldName, valueIndex);
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
			jslet.data.FieldValueCache.put(Z.getRecord(), fldName, text, valueIndex);
		}
		return text;
	},
	
	/**
	 * @private
	 */
	updateFormula: function () {
		var cnt = this._normalFields.length, 
			fldObj,
			currRec = this.getRecord();
		for (var i = 0; i < cnt; i++) {
			fldObj = this._normalFields[i];
			var fldName = fldObj.name();
			if (fldObj.formula()) {//update all formular field
				jslet.data.FieldValueCache.clear(currRec, fldName);
				var evt = jslet.data.RefreshEvent.updateRecordEvent(fldName);
				this.refreshControl(evt);
			}
		}
	},
	
	/**
	 * @private
	 */
	setFieldValueLength: function(fldObj, valueLength) {
		if(fldObj.valueStyle() == jslet.data.FieldValueStyle.NORMAL) {
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
		
		if(fldObj.valueStyle() !== jslet.data.FieldValueStyle.NORMAL && valueIndex === undefined) {
			//Set an array value
			if(!jslet.isArray(inputText)) {
				inputText = inputText.split(jslet.global.valueSeparator);
			}
			var len = inputText.length;
			for(var k = 0; k < len; k++ ) {
				Z.setFieldText(fldName, inputText[k], k);
			}
			Z.setFieldValueLength(fldObj, len);
			return;
		}
		var invalidMsg = Z.fieldValidator.checkInputText(fldObj, inputText);
		if (invalidMsg) {
			fldObj.message(invalidMsg, valueIndex);
			return;
		}
		
		if(!inputText){
			Z.setFieldValue(fldName, null, valueIndex);
			return;
		}
		var convert = fldObj.customValueConverter() || jslet.data.getValueConverter(fldObj);
		if(!convert) {
			throw new Error('Can\'t find any field value converter!');
		}
		var value = convert.textToValue.call(Z, fldObj, inputText, valueIndex);
		Z.setFieldValue(fldName, value, valueIndex);
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
	 * @return {Boolean} 
	 */
	find: function (condition) {
		var Z = this;
		if (Z.recordCount() === 0) {
			return false;
		}
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
		var foundRecno = -1, oldRecno = Z._recno;
		try {
			Z.first();
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
	 * @return {Boolean} 
	 */
	findByField: function (fldName, findingValue) {
		var Z = this;
		
		var value, i;
		if(Z._ignoreFilter) {
			if(!Z._dataList || Z._dataList.length === 0) {
				return false;
			}
			var len = Z._dataList.length;
			for(i = 0; i < len; i++) {
				value = Z.fieldValueByRec(Z._dataList[i], fldName);
				if (value == findingValue) {
					Z._ignoreFilterRecno = i;
					return true;
				}
			}
			
		}
		if (Z.recordCount() === 0) {
			return false;
		}

		value = Z.getFieldValue(fldName);
		if (value == findingValue) {
			return true;
		}

		var foundRecno = -1, oldRecno = Z.recno();
		try {
			var cnt = Z.recordCount();
			for (i = 0; i < cnt; i++) {
				Z.recnoSilence(i);
				value = Z.getFieldValue(fldName);
				if (value == findingValue) {
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
			return Z._dataList.slice(0);
		}

		var foundRecno = -1, oldRecno = Z._recno, oldFiltered = Z._filtered;
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
		jslet.Checker.test('Dataset.contextRule', rules).isArray();
		if(!rules || rules.length === 0) {
			this._contextRules = null;
			this._contextRuleEngine = null;
		} else {
			var ruleObj;
			for(var i = 0, len = rules.length; i < len; i++) {
				ruleObj = rules[i];
				if(!ruleObj.className || 
						ruleObj.className != jslet.data.ContextRule.className) {
					rules[i] = jslet.data.createContextRule(ruleObj);
				}
			}
			this._contextRules = rules;
			this._contextRuleEngine = new jslet.data.ContextRuleEngine(this);
			this._contextRuleEngine.compile();
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
		if(this.recordCount() === 0) {
			return;
		}
		if(this._contextRuleEngine) {
			if(!changedField) {
				this._contextRuleEngine.evalStatus();
			}
			this._contextRuleEngine.evalRule(changedField);
		}
	},

	/**
	 * Check current record if it's selectable.
	 */
	checkSelectable: function () {
		if(this.recordCount() === 0) {
			return false;
		}
		if(this._onCheckSelectable) {
			return this._onCheckSelectable.call(this);
		}
		return true;
	},
	
	/**
	 * Get or set selected state of current record.
	 */
	selected: function (selected) {
		var selFld = this._selectField || jslet.global.selectStateField,
			rec = this.getRecord();
		
		if(selected === undefined) {
			return rec && rec[selFld];
		}
		
		if(rec) {
			if(this.checkSelectable()) {
				rec[selFld] = selected;
			}
		}
		return this;
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
	 * Get inserted records, use this method to get inserted records that need apply to server.
	 * 
	 * @return {Array of Object} 
	 */
	insertedRecords: function () {
		this._checkStatusAndConfirm();
		return this._insertedDelta;
	},

	/**
	 * Get updated records, use this method to get updated records that need apply to server.
	 * 
	 * @return {Array of Object}
	 */
	updatedRecords: function () {
		this._checkStatusAndConfirm();
		return this._updatedDelta;
	},

	/**
	 * Get deleted records, use this method to get deleted records that need apply to server.
	 * 
	 * @return {Array of Object}
	 */
	deletedRecords: function () {
		return this._deletedDelta;
	},
	
	/**
	 * Get selected records
	 * 
	 * @return {Object[]} Array of records
	 */
	selectedRecords: function () {
		var Z = this;
		if (Z._dataList === null || Z._dataList.length === 0) {
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
				if (this.selected()) {
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
	 * @param {Object} condition Condition should be a JSON object.
	 */
	query: function (criteria) {
		this._queryCriteria = criteria;
		return this.requery();
	},

	_doQuerySuccess: function(result, dataset) {
		var Z = dataset;
		if (!result) {
			Z.dataList(null);
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
				ds = jslet.data.dataModule.get(dsName);
				if (ds) {
					ds.dataList(extraData[dsName]);
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
		Z.errorMessage(errCode + " : " + errMsg);
		if(Z._autoShowError) {
			jslet.showError(errCode + " : " + errMsg);
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
		return Z._dataProvider.sendRequest(Z, Z._queryUrl, reqData)
		.done(Z._doQuerySuccess)
		.fail(Z._doApplyError);
	},

	_setChangedState: function(flag, chgRecs, pendingRecs) {
		var result = this._addRecordClassFlag(chgRecs, flag, this._recordClass);
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
	
	_clearChangeState: function(chgedRecs) {
		if(!chgedRecs) {
			return;
		}
		var rec;
		for(var i = 0, len = chgedRecs.length; i < len; i++) {
			rec = chgedRecs[i];
			delete rec[jslet.global.changeStateField];			
		}
	},
	
	_doSaveSuccess: function(result, dataset) {
		if (!result) {
			return;
		}
		result = result.main;
		var Z = dataset;
		jslet.data.convertDateFieldValue(Z, result);
		var state, rec, c, oldRecs, oldRec;
		for(var i = 0, len = result.length; i < len; i++) {
			rec = result[i];
			state = rec[jslet.global.changeStateField];
			if(!state) {
				continue;
			}
			c = state.charAt(0);
			if(c == 'i' || c == 'u') {
				oldRecs = (c == 'i' ? Z.insertedRecords() : Z.updatedRecords());
				for(var k = 0, cnt = oldRecs.length; k < cnt; k++) {
					oldRec = oldRecs[k];
					if(oldRec[jslet.global.changeStateField] == state) {
						for(var fldName in rec) {
							oldRec[fldName] = rec[fldName];
						}
						break;
					}
				} //end for k
				jslet.data.FieldValueCache.removeCache(oldRec);
			}
		} //end for i
		
		Z._clearChangeState(Z.insertedRecords());
		Z._clearChangeState(Z.updatedRecords());
		Z._insertedDelta = [];
		Z._updatedDelta = [];
		Z._deletedDelta = [];
		
		Z.refreshControl();
		Z.refreshHostDataset();
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
	 * @param {Object} extraInfo extraInfo
	 */
	submit: function(extraInfo) {
		var Z = this;
		Z._checkDataProvider();

		if(!Z._submitUrl) {
			throw new Error('SubmitUrl required! Use: yourDataset.submitUrl(yourUrl)');
		}
		if(!Z.confirm()) {
			return;
		}
		var changedRecs = [];
		Z._setChangedState('i', Z.insertedRecords(), changedRecs);
		Z._setChangedState('u', Z.updatedRecords(), changedRecs);
		Z._setChangedState('d', Z.deletedRecords(), changedRecs);

		if (!changedRecs || changedRecs.length === 0) {
			jslet.showInfo(jslet.locale.Dataset.noDataSubmit);
			return;
		}
		var reqData = {main: changedRecs};
		if(extraInfo) {
			reqData.extraInfo = extraInfo;
		}
		if(Z.csrfToken) {
			reqData.csrfToken = Z.csrfToken;
		}
		reqData = jslet.data.record2Json(reqData);
		return Z._dataProvider.sendRequest(Z, Z._submitUrl, reqData)
		.done(Z._doSaveSuccess)
		.fail(Z._doApplyError);
	},
	
	_doSubmitSelectedSuccess: function(result, dataset) {
		result = result.main;
		if (!result || result.length === 0) {
			return;
		}
		var Z = dataset;
		var deleteOnSuccess = Z._deleteOnSuccess_;
		
		var arrRecs = Z.selectedRecords(),
			i, k;
		if(deleteOnSuccess) {
			for(i = arrRecs.length; i >= 0; i--) {
				rec = arrRecs[i];
				k = Z._dataList.indexOf(rec);
				Z._dataList.splice(k, 1);
			}
		} else {
			var newRec, oldRec, len;
			jslet.data.convertDateFieldValue(Z, result);
			for(i = arrRecs.length - 1; i >= 0; i--) {
				oldRec = arrRecs[i];
				len = result.length;
				for(k = 0; k < len; k++)
				{
					newRec = result[k];
					if(oldRec[jslet.global.changeStateField] == newRec[jslet.global.changeStateField]) {
						for(var propName in newRec) {
							oldRec[propName] = newRec[propName];
						}
						//clear change state flag
						delete oldRec[jslet.global.changeStateField];
						//clear selected flag
						var selFld = Z._selectField || jslet.global.selectStateField;
						delete oldRec[selFld];
						break;
					}
				} //end for k
				jslet.data.FieldValueCache.removeCache(oldRec);
			}//end for i
		}
		Z.refreshControl();
		Z.refreshHostDataset();
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
	 */
	submitSelected: function (url, deleteOnSuccess, extraInfo) {
		var Z = this;
		Z._checkDataProvider();
		if(!url) {
			throw new Error('Url required! Use: yourDataset.submitSelected(yourUrl)');
		}
		var changedRecs = [];
		var arrRecs = Z.selectedRecords();
		Z._setChangedState('s', arrRecs, changedRecs);
		Z._deleteOnSuccess_ = deleteOnSuccess;
		var reqData = {main: changedRecs};
		if(Z.csrfToken) {
			reqData.csrfToken = Z.csrfToken;
		}
		if(extraInfo) {
			reqData.extraInfo = extraInfo;
		}
		reqData = jslet.data.record2Json(reqData);
		return Z._dataProvider.sendRequest(Z, url, reqData)
		.done(Z._doSubmitSelectedSuccess)
		.fail(Z._doApplyError);
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
		var ctrl, el;
		for (var i = this._linkedControls.length - 1; i >= 0; i--) {
			ctrl = this._linkedControls[i];
			if (ctrl.field && ctrl.field == fldName) {
				el = ctrl.el;
				if (el.focus) {
					try {
						el.focus();
					} catch (e) {
						//hide exeception
					}
				}
			} //end if
		} //end for
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
//		if (updateEvt.eventType == jslet.data.RefreshEvent.UPDATEALL) {
//			var flag = this.isContextRuleEnabled();
//			if (flag) {
//				this.disableContextRule();
//			}
//			try {
//				this._refreshInnerControl(updateEvt);
//			} finally {
//				if (flag) {
//					this.enableContextRule();
//				}
//			}
//		} else {
			this._refreshInnerControl(updateEvt);
//		}
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

	refreshHostDataset: function() {
		if(this._autoRefreshHostDataset) {
			jslet.data.datasetRelationManager.refreshHostDataset(this._name);
		}
	},
	
	handleLookupDatasetChanged: function(fldName) {
		this.refreshControl(jslet.data.RefreshEvent.lookupEvent(fldName));
	},
	
	/**
	 * Export data with CSV format
	 * 
	 * @param {String}includeFieldLabel - export with field labels, can be null  
	 * @param {Boolean}dispValue - true: export display value of field, false: export actual value of field 
	 * @param {Boolean}onlySelected - export selected records or not.
	 * @return {String} Csv Text. 
	 */
	exportCsv: function(includeFieldLabel, dispValue, onlySelected) {
		var Z= this, fldSeperator = ',', surround='"';
		var context = Z.startSilenceMove();
		try{
			Z.first();
			var result = [], 
				arrRec, 
				fldCnt = Z._normalFields.length, 
				fldObj, fldName, value, i;
			if (includeFieldLabel) {
				arrRec = [];
				for(i = 0; i < fldCnt; i++) {
					fldObj = Z._normalFields[i];
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
					fldObj = Z._normalFields[i];
					fldName = fldObj.name();
					if (dispValue) {
						value = Z.getFieldText(fldName);
					} else {
						value = Z.getFieldValue(fldName);
					}
					if (!value) {
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
	 * Set or get raw data list
	 * 
	 * @param {Object[]} datalst - raw data list
	 */
	dataList: function (datalst) {
		var Z = this;
		if (datalst === undefined) {
			return Z._dataList;
		}
		
		jslet.Checker.test('Dataset.dataList', datalst).isArray();
//		if(Z._datasetField) {
//			var masterFld = Z._datasetField.setValue(datalst);
//		}
		Z._dataList = datalst;
		Z.clearFieldErrorMessage();
		jslet.data.convertDateFieldValue(Z);
		Z._insertedDelta.length = 0;
		Z._updatedDelta.length = 0;
		Z._deletedDelta.length = 0;
		Z.status(jslet.data.DataSetStatus.BROWSE);
		Z.filter(null);
		Z.indexFields(Z.indexFields());
		Z.first();
		Z.refreshControl(jslet.data.RefreshEvent._updateAllEvent);
		Z.refreshHostDataset();
		return this;
	},
	
	/**
	 * Return dataset data with field text, field text is formatted or calculated field value.
	 * You can use them to do your special processing like: use them in jquery template.
	 */
	textList: function() {
		var Z = this,
			oldRecno = Z.recno(), 
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
 * @param {String} keyField - key field name
 * @param {String} codeField - code field name
 * @param {String} nameField - name field name
 * @param {String} parentField - parent field name
 * @return {jslet.data.Dataset}
 */
jslet.data.createDataset = function(dsName, fieldConfig, dsCfg) {
	var dsObj = new jslet.data.Dataset(dsName),fldObj;
	for (var i = 0, cnt = fieldConfig.length; i < cnt; i++) {
		fldObj = jslet.data.createField(fieldConfig[i]);
		dsObj.addField(fldObj);
	}
	
	if(dsCfg) {
		if (dsCfg.keyField) {
			dsObj.keyField(dsCfg.keyField);
		}
		if (dsCfg.codeField) {
			dsObj.codeField(dsCfg.codeField);
		}
		if (dsCfg.nameField) {
			dsObj.nameField(dsCfg.nameField);
		}
		if (dsCfg.parentField) {
			dsObj.parentField(dsCfg.parentField);
		}
		if (dsCfg.queryUrl) {
			dsObj.queryUrl(dsCfg.queryUrl);
		}
		if (dsCfg.submitUrl) {
			dsObj.submitUrl(dsCfg.submitUrl);
		}
		if (dsCfg.autoShowError) {
			dsObj.autoShowError(dsCfg.autoShowError);
		}
		if (dsCfg.pageSize) {
			dsObj.pageSize(dsCfg.pageSize);
		}
		if (dsCfg.indexFields) {
			dsObj.indexFields(dsCfg.indexFields);
		}
		if (dsCfg.filter) {
			dsObj.filter(dsCfg.filter);
		}
		if (dsCfg.filtered) {
			dsObj.filtered(dsCfg.filtered);
		}
		if (dsCfg.autoRefreshHostDataset) {
			dsObj.autoRefreshHostDataset(dsCfg.autoRefreshHostDataset);
		}
		
	}
	return dsObj;
};

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
		var headers = {};
		if(dataset.csrfToken) {
			headers.csrfToken = dataset.csrfToken;
		}
		var settings = {
			async : true, 
			type: 'POST', 
			contentType: 'application/json', 
			mimeType: 'application/json',
			dataType: 'json',
			headers: headers,
			data : reqData,
			context: dataset
		};
		
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
			var data = {errorCode: textStatus, errorMessage: errorThrown};
			defer.reject(data, this);
		})
		.always(function(dataOrJqXHR, textStatus, jqXHRorErrorThrown) {
			if(jQuery.isFunction(dataOrJqXHR.done)) { //fail
				defer.always({errorCode: textStatus, errorMessage: jqXHRorErrorThrown}, this);
			} else {
				defer.always(dataOrJqXHR, this);
			}
		});
		return defer.promise();
	};
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
	Z._displayOrder = 0;
	Z._fieldName = fieldName;
	Z._dataType = dataType;
	Z._length = 0;
	Z._scale = 0;
	Z._unique = false;
	
	if(dataType == jslet.data.DataType.NUMBER) {
		Z._alignment = 'right';
	} else if(dataType == jslet.data.DataType.BOOLEAN) {
		Z._alignment = 'center';
	} else {
		Z._alignment = 'left';
	}
	
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
	Z._children = null; //child field object, only group field has child field object.
	Z._trueValue = true;
	Z._falseValue = false;
	
	Z._mergeSame = false;
	Z._mergeSameBy = null;
	Z._fixedValue = null;
	
	Z._aggrateType = "sum"; //optional value: sum, count, avg
	Z._aggrateBy = null;
};

jslet.data.Field.className = 'jslet.data.Field';

jslet.data.Field.prototype = {
	className: jslet.data.Field.className,
	
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
		result.displayFormat(Z._displayFormat);
		result.dateFormat(Z._dateFormat);
		result.formula(Z._formula);
		result.unique(Z._unique);
		result.required(Z._required);
		result.readOnly(Z._readOnly);
		result.visible(Z._visible);
		result.disabled(Z._disabled);
		result.unitConverted(Z._unitConverted);
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
		
		result.aggrateType(Z._aggrateType);
		result.aggrateBy(Z._aggrateBy);
		
		return result;
	},
	
	_clearFieldCache: function() {
		var Z = this;
		if(Z._dataset && Z._fieldName) {
			jslet.data.FieldValueCache.clearAll(Z._dataset, Z._fieldName);
		}
	},
	
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
		Z._dataset = dataset;
		Z._clearFieldCache();
		Z.addLookupRelation();
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
		return this;
	},
	
	/**
	 * Get or set field tip.
	 * 
	 * @param {String or undefined} message Field message.
	 * @return {String or this}
	 */
	message: function(message, valueIndex) {
		var Z = this,
			argLen = message === undefined && valueIndex === undefined ? 0: (valueIndex === undefined ? 1: 2);
		var result = '', i, len;
		switch(argLen) {
		case 0:  //Get message without 'valueIndex'
			if(!Z._message) {
				return result;
			}
			if(jslet.isArray(Z._message)) {
				len = Z._message.length;
				for(i = 0; i < len; i++) {
					if(i > 0) {
						result += ', ';
					}
					result += jslet.locale.Dataset.value + i + ': ' + Z._message[i];
				}
				return result;
			} else {
				return Z._message;
			}
			break;
		case 1:
			if (jQuery.isNumeric(message)){ //Get message with 'valueIndex'
				if(!Z._message) {
					return result;
				}
				valueIndex = message;
				if(jslet.isArray(Z._message)) {
					if(valueIndex < Z._message.length) {
						result = Z._message[valueIndex];
					}
				} else {
					if(valueIndex === 0) {
						result = Z._message;
					}
				}
				return result;
			} else { //Set message without 'valueIndex'
				if(Z._message == message) {
					return this;
				}
				Z._message = message;
			}
			break;
		case 2:
			if(!Z._message || !jslet.isArray(Z._message)) {
				Z._message = [];
			}
			if(Z._message.length <= valueIndex) {
				Z._message.length = valueIndex + 1;
			}
			Z._message[valueIndex] = message;
			//Check whether the Z._mesage is an empty array, if it's empty, set Z._mesage = null
			var isEmptyArr = true;
			len = Z._message.length;
			for (i = 0; i < len; i++) {
				if(Z._message[i]) {
					isEmptyArr = false;
					break;
				}
			}
			if(isEmptyArr) {
				Z._message = null;
			}			
			break;
		}
		Z._fireMetaChangedEvent('message');
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
	 * It is ignored if dataType is not jslet.data.DataType.GROUP
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
	 * It is ignored if dataType is not jslet.data.DataType.GROUP
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
	 * @param {Integer or undefined} index Field display order.
	 * @return {Integer or this}
	 */
	displayOrder: function (displayOrder) {
		var Z = this;
		if (displayOrder === undefined) {
			return Z._displayOrder;
		}
		jslet.Checker.test('Field.displayOrder', displayOrder).isNumber();
		Z._displayOrder = parseInt(displayOrder);
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
			return Z._alignment;
		}
		
		jslet.Checker.test('Field.alignment', alignment).isString();
		Z._alignment = jQuery.trim(alignment);
		Z._fireColumnUpdatedEvent();
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
		
		jslet.Checker.test('Field.format', format).isString();
		Z._displayFormat = jQuery.trim(format);
		Z._dateFormat = null;
		Z._dateChar = null;
		Z._dateRegular = null;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
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
		jslet.Checker.test('Field.defaultValuen', Z.dftValue).isDataType(Z._dateType);
		Z._defaultValue = dftValue;
		return this;
	},

	/**
	 * Get or set field is unique or not.
	 * 
	 * @param {Boolean or undefined} required Field is unique or not.
	 * @return {Boolean or this}
	 */
	unique: function (unique) {
		var Z = this;
		if (unique === undefined) {
			return Z._unique;
		}
		Z._unique = unique ? true: false;
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
		if (this.dataset()) {
			this.dataset().removeInnerFormularFields(Z._fieldName);
			Z._fireColumnUpdatedEvent();
		}
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
			if (Z._formula || Z._dataType == jslet.data.DataType.DATASET || Z._dataType == jslet.data.DataType.GROUP) {
				return true;
			}

			return Z._readOnly || Z._dataset.readOnly();
		}
		
		Z._readOnly = readOnly? true: false;
		Z._fireMetaChangedEvent('readOnly');
		return this;
	},
	
	_fireMetaChangedEvent: function(metaName) {
		var ds = this.dataset();
		if (ds) {
			var evt = jslet.data.RefreshEvent.changeMetaEvent(metaName, this._fieldName);
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
				Z._dataType == jslet.data.DataType.GROUP) 
				return jslet.data.FieldValueStyle.NORMAL;
			
			return Z._valueStyle;
		}
		
		jslet.Checker.test('Field.valueStyle', mvalueStyle).isNumber().inArray([0,1,2]);
		Z._valueStyle = mvalueStyle;
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
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
		jslet.Checker.test('Field.valueCountLimit', count).isNumber();
		Z._valueCountLimit = parseInt(count);
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
			if(editCtrl.indexOf(':') > 0) {
				editCtrl = jslet.JSON.parse(editCtrl);
			} else {
				editCtrl =  {type: editCtrl};
			}
		}
		Z._editControl = editCtrl;
	},

	/**
	 * {Event} Get customized field text.
	 * Pattern: function(fieldName, value){}
	 *   //fieldName: String, field name;
	 *   //value: Object, field value, the value type depends on field type;
	 *   //return: String, field text;
	 */
	onCustomFormatFieldText: null, // (fieldName, value)

	addLookupRelation: function() {
		var Z = this;
		if(Z._dataset && Z._lookup && Z._lookup.dataset()) {
			jslet.data.datasetRelationManager.addRelation(Z._dataset.name(), 
					Z._fieldName, Z._lookup.dataset().name());
		}
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
		
		Z._lookup = lkFldObj;
		lkFldObj.hostField(Z);
		if (Z._alignment != 'left') {
			Z._alignment = 'left';
		}
		this.addLookupRelation();
		Z._clearFieldCache();		
		Z._fireColumnUpdatedEvent();
		return this;
	},

	/**
	 * Set or get sub dataset.
	 * 
	 * @param {jslet.data.Dataset or undefined} subdataset
	 * @return {jslet.data.Dataset or this}
	 */
	subDataset: function (subdataset) {
		var Z = this;
		if (subdataset === undefined) {
			return Z._subDataset;
		}
		jslet.Checker.test('Field.subDataset', subdataset).isClass(jslet.data.Dataset.className);		
		if (Z._subDataset) {
			Z._subDataset.datasetField(null);
		}
		Z._subDataset = subdataset;
		subdataset.datasetField(this);
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
		jslet.Checker.test('Field.dataRange', range).isObject();
		if(range) {
			if(range.min) {
				jslet.Checker.test('Field.dataRange.min', range.min).isDataType(Z._dateType);
			}
			if(range.max) {
				jslet.Checker.test('Field.dataRange.max', range.max).isDataType(Z._dateType);
			}
		}
		Z._dataRange = range;
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
		//jslet.Checker.test('Field.customValueConverter', converter).isClass(jslet.data.FieldValueConverter.className);
		Z._customValueConverter = converter;
		Z._clearFieldCache();
		Z._fireColumnUpdatedEvent();
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
		jslet.Checker.test('Field.customValidator', validator).isFunction();
		Z._customValidator = validator;
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
				return '0123456789' + (this.dateSeparator() ? this.dateSeparator() : '');
			}
		}
		
		Z._validChars = chars;
	},
	
	/**
	 * Use for Boolean field, actual value for 'true'
	 */
	trueValue: function(value) {
		var Z = this;
		if (value === undefined) {
			return Z._trueValue;
		}
		jslet.Checker.test('Field.trueValue', value).required();
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
	},

	/**
	 * Get or set the type of aggrated value.
	 * 
	 * @param {String or undefined} aggrateType optional value is: count,sum,avg.
	 * @return {String or this}
	 */
	aggrateType: function (aggrateType) {
		var Z = this;
		if (aggrateType === undefined){
			return Z._aggrateType;
		}
		
		var checker = jslet.Checker.test('Field.aggrateType', aggrateType).isString();
		if(aggrateType) {
			Z._aggrateType = jQuery.trim(aggrateType);
			checker.inArray(['count', 'sum', 'avg']);
		}
		return this;
	},

	/**
	 * Get or set the field names to aggrate field value. 
	 * Multiple field names are separated by ','.
	 * 
	 * 
	 * @param {String or undefined} aggrBy.
	 * @return {String or this}
	 */
	aggrateBy: function(aggrateBy){
		var Z = this;
		if (aggrateBy === undefined) {
			return Z._aggrateBy;
		}
		jslet.Checker.test('Field.aggrateBy', aggrateBy).isString();
		Z._aggrateBy = jQuery.trim(aggrateBy);
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
 * @param {jslet.data.Field} parent Parent field object. It must be a 'Group' field.
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
				dtype != jslet.data.DataType.DATASET && 
				dtype != jslet.data.DataType.GROUP)
		dtype = jslet.data.DataType.STRING;
	}
	var fldObj = new jslet.data.Field(cfg.name, dtype);
	if (cfg.displayOrder !== undefined) {
		fldObj.displayOrder(cfg.displayOrder);
	}
	fldObj.parent(parent);
	if(parent) {
		fldObj.dataset(parent.dataset());
	}
	
	if (cfg.label !== undefined) {
		fldObj.label(cfg.label);
	}
	if (cfg.tip !== undefined) {
		fldObj.tip(cfg.tip);
	}
	if (dtype == jslet.data.DataType.DATASET){
		var subds = cfg.subDataset;
		if (subds) {
			if (typeof (subds) == 'string') {
				subds = jslet.data.dataModule.get(subds);
			}
			fldObj.subDataset(subds);
		}
		fldObj.visible(false);
		return fldObj;
	}
	
	if (cfg.unique !== undefined) {
		fldObj.unique(cfg.unique);
	}
	if (cfg.required !== undefined) {
		fldObj.required(cfg.required);
	}
	if (cfg.readOnly !== undefined) {
		fldObj.readOnly(cfg.readOnly);
	}
	if (cfg.visible !== undefined) {
		fldObj.visible(cfg.visible);
	}
	if (cfg.disabled !== undefined) {
		fldObj.disabled(cfg.disabled);
	}
	if (dtype == jslet.data.DataType.GROUP){
		if (cfg.children){
			var fldChildren = [], childFldObj;
			for(var i = 0, cnt = cfg.children.length; i < cnt; i++){
				fldChildren.push(jslet.data.createField(cfg.children[i], fldObj));
			}
			fldObj.children(fldChildren);
		}
		fldObj.alignment('center');
		return fldObj;
	}
	if (cfg.length !== undefined) {
		fldObj.length(cfg.length);
	}
	if (cfg.scale !== undefined) {
		fldObj.scale(cfg.scale);
	}
	if (cfg.alignment !== undefined) {//left,right,center
		fldObj.alignment(cfg.alignment);
	}
	if (cfg.defaultExpr !== undefined) {
		fldObj.defaultExpr(cfg.defaultExpr);
	}
	if (cfg.defaultValue !== undefined) {
		fldObj.defaultValue(cfg.defaultValue);
	}
	if (cfg.displayWidth !== undefined) {
		fldObj.displayWidth(cfg.displayWidth);
	}
	if (cfg.editMask !== undefined) {
		fldObj.editMask(cfg.editMask);
	}
	if (cfg.displayFormat !== undefined) {
		fldObj.displayFormat(cfg.displayFormat);
	}
	if (cfg.formula !== undefined) {
		fldObj.formula(cfg.formula);
	}
	if (cfg.nullText !== undefined) {
		fldObj.nullText(cfg.nullText);
	}
	if (cfg.unitConverted !== undefined) {
		fldObj.unitConverted(cfg.unitConverted);
	}
	var lkfCfg = cfg.lookup;
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
		fldObj.lookup(jslet.data.createFieldLookup(lkfCfg));
	}
	if (cfg.editControl !== undefined && cfg.editControl) {
		fldObj.editControl(cfg.editControl);
	}
	if (cfg.urlExpr !== undefined) {
		fldObj.urlExpr(cfg.urlExpr);
	}
	if (cfg.urlTarget !== undefined) {
		fldObj.urlTarget(cfg.urlTarget);
	}
	if (cfg.valueStyle !== undefined) {
		fldObj.valueStyle(cfg.valueStyle);
	}

	if (cfg.valueCountLimit !== undefined) {
		fldObj.valueCountLimit(cfg.valueCountLimit);
	}
	
	if (cfg.dataRange) {
		fldObj.dataRange(cfg.dataRange);
	}
	if (cfg.customValidator) {
		fldObj.customValidator(cfg.customValidator);
	}
	
	if (cfg.trueValue !== undefined) {
		fldObj.trueValue(cfg.trueValue);
	}

	if (cfg.falseValue !== undefined) {
		fldObj.falseValue(cfg.falseValue);
	}
	
	if (cfg.mergeSame !== undefined) {
		fldObj.mergeSame(cfg.mergeSame);
	}
	
	if (cfg.mergeSameBy !== undefined) {
		fldObj.mergeSameBy(cfg.mergeSameBy);
	}
	
	if (cfg.aggrateType !== undefined) {
		fldObj.aggrateType(cfg.aggrateType);
	}
		
	if (cfg.aggrateBy !== undefined) {
		fldObj.aggrateBy(cfg.aggrateBy);
	}
		
	if (cfg.fixedValue !== undefined) {
		fldObj.fixedValue(cfg.fixedValue);
	}
	
	return fldObj;
};

/**
 * Create string field object.
 * 
 * @param {String} fldName Field name.
 * @param {Integer} length Field length.
 * @param {jslet.data.Field} parent (Optional)Parent field object. It must be a 'Group' field.
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
	if (typeof (subDataset) == 'string') {
		subDataset = jslet.data.dataModule.get(subDataset);
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
jslet.data.createGroupField = function(fldName, label, parent) {
	var fldObj = new jslet.data.Field(fldName, jslet.data.DataType.GROUP, parent);
	fldObj.label(label);
	return fldObj;
};

/**
 * @private
 */
jslet.data.Field.prototype.sortByIndex = function(fldObj1, fldObj2) {
	return fldObj1.displayOrder() - fldObj2.displayOrder();
};

/**
 * @class FieldLookup
 * 
 * A lookup field represents a field value is from another dataset named "Lookup Dataset";
 */
jslet.data.FieldLookup = function() {
	var Z = this;
	Z._hostField = null;//The field which contains this lookup field object.
	Z._dataset = null;
	Z._keyField = null;
	Z._codeField = null;
	Z._nameField = null;
	Z._codeFormat = null;
	Z._displayFields = null;
	Z._innerdisplayFields = null;
	Z._parentField = null;
	Z._onlyLeafLevel = true;
	Z._returnFieldMap = null;
//	Z._noConvertion = false;
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
			return Z._dataset;
		}
		Z._dataset = lkdataset;
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
			return Z._keyField || Z._dataset.keyField();
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
			return Z._codeField || Z._dataset.codeField();
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
			return Z._nameField || Z._dataset.nameField();
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
			return Z._parentField || Z._dataset.parentField();
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
			Z._innerdisplayFields = new jslet.Expression(Z._dataset, Z.displayFields());
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

//	/**
//	 * Identify whether convert field value. If true, it won't validate that the field value must come from the lookup dataset.
//	 * 
//	 * @param {Boolean or undefined} noConvertion True - field value must come from the lookup dataset, false - otherwise.
//	 * @return {Boolean or this}
//	 */
//	noConvertion: function(noConvertion) {
//		var Z = this;
//		if (noConvertion === undefined) {
//			return Z._noConvertion;
//		}
//		Z._noConvertion = noConvertion ? true: false;
//		return this;
//	}
	
};

/**
 * Create lookup field object.
 * 
 * @param {Json Object} param A json object which property names are same as jslet.data.FieldLookup. Example: {dataset: fooDataset, keyField: 'xxx', ...}
 * @return {jslet.data.FieldLookup}
 */
jslet.data.createFieldLookup = function(param) {
	jslet.Checker.test('createFieldLookup#param', param).required().isObject();
	var lkds = param.dataset;
	if (!lkds) {
		throw new Error('Property: dataset required!');
	}
	var lkFldObj = new jslet.data.FieldLookup();

	if (typeof(lkds) == 'string') {
		lkds = jslet.data.dataModule.get(lkds);
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
	return lkFldObj;
};

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
	Z._criteria = undefined;
	Z._displayFields = undefined;
	Z._onlyLeafLevel = undefined;
};

jslet.data.ContextRuleLookup.className = 'jslet.data.ContextRuleLookup';

jslet.data.ContextRuleLookup.prototype ={
	className: jslet.data.ContextRuleLookup.className,
	
	properties: ['dataset', 'filter', 'criteria', 'displayFields', 'onlyLeafLevel'],
	
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
			this._syncMatchedRuleMeta(fldObj, ruleObj.meta());
			this._syncMatchedRuleLookup(fldObj, ruleObj.lookup());
			this._syncMatchedRuleValue(fldObj, ruleObj.value());
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
		if(ruleFilter != undefined) {
			for(var fldName in this._ruleEnv) {
				ruleFilter = ruleFilter.replace('${' + fldName + '}', this._ruleEnv[fldName]);
			}
			lkDsObj.filter(ruleFilter);
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








