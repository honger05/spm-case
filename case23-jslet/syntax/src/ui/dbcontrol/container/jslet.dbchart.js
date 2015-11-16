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
