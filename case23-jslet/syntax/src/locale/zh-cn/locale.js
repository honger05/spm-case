/* ========================================================================
 * Jslet framework: jslet.locale.js
 *
 * Copyright (c) 2014 Jslet Group(https://github.com/jslet/jslet/)
 * Licensed under MIT (https://github.com/jslet/jslet/LICENSE.txt)
 * ======================================================================== */

/**
 * Chinese language pack
 */
(function () {
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
})();
