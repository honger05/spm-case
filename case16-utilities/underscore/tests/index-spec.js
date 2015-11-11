
var expect = require('expect');
var index = require('../index');

describe('Normal usage', function() {

	it('_.each', function() {
		expect(index.each).to.be.a('function');
	})

})