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
