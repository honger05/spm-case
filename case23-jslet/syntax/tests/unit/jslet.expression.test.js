jQuery(function () {

	module('jslet.Expression')

	test('jslet.Expression with null dataset', function () {
		var expr = new jslet.Expression('employee', '1+3');
		equal(expr.eval(), 4, 'jslet.Expression eval: 1+3.');
		expr = new jslet.Expression('employee', 'var d = new Date(2010,1,20); d.getDate()');
		equal(expr.eval(), 20, 'jslet.Expression eval: var d = new Date(2010,1,20); d.getDate().')
		throws(function(){
			expr = new jslet.Expression(null, null);
			expr.eval()
			}, 'jslet.Expression(null, null).')
	});

})
