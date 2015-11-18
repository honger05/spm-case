jQuery(function () {

	module('jslet.common');

	test('jslet.nextId', function () {
		ok(jslet.nextId(), 'jslet.nextId should return value')
	});
//formatString
	test('jslet.formatString()', function () {
		throws(function(){jslet.formatString(null)}, 'jslet.formatString(null).')
	});

	test('jslet.formatString()', function () {
		throws(function(){jslet.formatString()}, 'jslet.formatString(null).')
	});

	test('jslet.formatString()', function () {
		equal(jslet.formatString('test'), 'test', 'jslet.formatString().')
	});

	test('jslet.formatString() with args(String)', function () {
		equal(jslet.formatString('test: {0}', '1'), 'test: 1', 'jslet.formatString(String).')
	});

	test('jslet.formatString() with args(int)', function () {
		equal(jslet.formatString('test: {0}', 1), 'test: 1', 'jslet.formatString(Integer).')
	});

	test('jslet.formatString() with args(Date)', function () {
		var d = new Date();
		equal(jslet.formatString('test: {0}', d), 'test: ' + d, 'jslet.formatString(Date).')
	});

	test('jslet.formatString with args(Float)', function () {
		var d = 1.55;
		equal(jslet.formatString('test: {0}', d), 'test: ' + 1.55, 'jslet.formatString(Float).')
	});

	test('jslet.formatString() with args(Boolean)', function () {
		equal(jslet.formatString('test: {0}', true), 'test: true', 'jslet.formatString(true).')
		equal(jslet.formatString('test: {0}', false), 'test: false', 'jslet.formatString(false).')
	});

	test('jslet.formatString() with args(Array)', function () {
		var d = [10,20,30];
		equal(jslet.formatString('test: {0}, {1}, {2}', d), 'test: 10, 20, 30', 'jslet.formatString(Array).')
	});
//formatNumber
	test('jslet.formatNumber() without pattern', function () {
		equal(jslet.formatNumber(1000), 1000, 'jslet.formatNumber.')
	});

	test('jslet.formatNumber() with pattern(#,##0.00)', function () {
		equal(jslet.formatNumber(1000, '#,##0.00'), '1,000.00', 'jslet.formatNumber(#,##0.00).')
	});

	test('jslet.formatNumber() with pattern(0,000.00)', function () {
		equal(jslet.formatNumber(500, '0,000.00'), '0,500.00', 'jslet.formatNumber(0,000.00).')
	});

	test('jslet.formatNumber() with pattern(#,##0)', function () {
		equal(jslet.formatNumber(500.89, '#,##0'), '501', 'jslet.formatNumber(#,##0).')
		equal(jslet.formatNumber(500.5, '#,##0'), '501', 'jslet.formatNumber(#,##0).')
		equal(jslet.formatNumber(500.48, '#,##0'), '500', 'jslet.formatNumber(#,##0).')
	});
//formatDate
	test('jslet.formatDate with null value', function () {
		equal(jslet.formatDate(null, 'yyyy-MM-dd'), '', 'jslet.formatDate(null).')
	});

	test('jslet.formatDate() with pattern(null format)', function () {
		var d = new Date(2015,0,15);
		throws(function() {jslet.formatDate(d)}, 'jslet.formatDate(null format).')
	});

	test('jslet.formatDate() with pattern(yyyy-MM-dd)', function () {
		var d = new Date(2015,0,15);
		equal(jslet.formatDate(d, 'yyyy-MM-dd'), '2015-01-15', 'jslet.formatDate(yyyy-MM-dd).')
	});

	test('jslet.formatDate() with pattern(yyyy/MM/dd)', function () {
		var d = new Date(2015,0,15);
		equal(jslet.formatDate(d, 'yyyy/MM/dd'), '2015/01/15', 'jslet.formatDate(yyyy/MM/dd).')
	});

	test('jslet.formatDate() with pattern(MM/dd/yyyy)', function () {
		var d = new Date(2015,0,15);
		equal(jslet.formatDate(d, 'MM/dd/yyyy'), '01/15/2015', 'jslet.formatDate(MM/dd/yyyy).')
	});
//parseDate
	test('jslet.parseDate with value(null)', function () {
		equal(jslet.parseDate(), null, 'jslet.parseDate(null).')
	});

	test('jslet.parseDate() with pattern(null format)', function () {
		var d = '2015-01-02';
		throws(function() {jslet.parseDate(d)}, 'jslet.parseDate(null format).')
	});

	test('jslet.parseDate() with pattern(yyyy-MM-dd)', function () {
		var dstr = '2015-01-15';
		var d = new Date(2015, 0, 15);
		equal(jslet.parseDate(dstr, 'yyyy-MM-dd').getDate(), 15, 'jslet.parseDate() with pattern(yyyy-MM-dd).')
	});
//convertISODate
	test('jslet.convertISODate() with null value', function () {
		var dstr = null;
		var d = new Date(2015, 0, 15);
		equal(jslet.convertISODate(dstr, 'yyyy-MM-dd'), null, 'jslet.convertISODate() with null value.')
	});

	test('jslet.convertISODate() with null value', function () {
		var dstr = '2015-12-21T09:30:24Z';
		equal(jslet.convertISODate(dstr).getDate(), 21, 'jslet.convertISODate().')
	});
//like
	test('jslet.like() with null value', function () {
		var v = null;
		var patten = '%c';
		ok(!jslet.like(v, patten), 'jslet.like() with null value.')
	});

	test('jslet.like()', function () {
		var v = 'abc';
		var patten = '%c';
		ok(jslet.like(v, patten), 'jslet.like() with patten: %c.');
		patten = '%a';
		ok(!jslet.like(v, patten), 'jslet.like() with patten: %a.');
		patten = '%b%';
		ok(jslet.like(v, patten), 'jslet.like() with patten: %b%.');
		patten = 'a%';
		ok(jslet.like(v, patten), 'jslet.like() with patten: a%.');
	});

//between
	test('jslet.between() with null value', function () {
		var v = null;
		var v1 = 'a';
		var v2 = 'g';
		ok(!jslet.between(v, v1, v2), 'jslet.betwwen() with null value.')
	});

	test('jslet.between() with value', function () {
		var v = 'b';
		var v1 = 'a';
		var v2 = 'g';
		ok(jslet.between(v, v1, v2), 'jslet.betwwen() with string value "b".');
		v = 'h';
		ok(!jslet.between(v, v1, v2), 'jslet.betwwen() with string value "h".');
		v1 = 1;
		v2 = 100;
		v = 50;
		ok(jslet.between(v, v1, v2), 'jslet.betwwen() with integer value: 50.');
	});

//inlist
	test('jslet.between() with null value', function () {
		var v = null;
		var v1 = 'a';
		var v2 = 'g';
		ok(!jslet.between(v, v1, v2), 'jslet.betwwen() with null value.')
	});

	test('jslet.between() with value', function () {
		var v = 'g';
		var v1 = 'a';
		var v2 = 'g';
		ok(jslet.inlist(v, v1, v2), 'jslet.inlist() with string value "b".');
		v = 'h';
		ok(!jslet.inlist(v, v1, v2), 'jslet.inlist() with string value "h".');
		v1 = 1;
		v2 = 50;
		v = 50;
		ok(jslet.inlist(v, v1, v2), 'jslet.inlist() with integer value: 50.');
	});
})
