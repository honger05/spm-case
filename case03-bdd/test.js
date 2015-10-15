
var chai = require('chai');

var assert = chai.assert;

var foo = 'bar';

describe('chai assert test suite', function () {

  it('should a String', function () {
    assert.typeOf(foo, 'string');
  });

  it('should equal bar', function () {
    assert.equal(foo, 'bar');
  });
  
});

var expect = chai.expect;

describe('chai expect test suite', function () {

  it('should a String', function () {
    expect(foo).to.be.a('string');
  });

  it('should equal bar', function () {
    expect(foo).to.equal('bar');
  });
  
});

var should = chai.should();

describe('chai should test suite', function () {

  it('should a String', function () {
    foo.should.be.a('string');
  });

  it('should equal bar', function () {
    foo.should.equal('bar');
  });
  
});