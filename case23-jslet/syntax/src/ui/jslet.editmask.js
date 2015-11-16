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
