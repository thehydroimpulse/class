var Class = require('..');
var assert = require('assert');

describe('class', function() {

  it('should export a function', function() {
    assert.equal('function', typeof Class);
  });

  it('should expose emitters', function() {
    assert.equal('function', typeof Class.on);
    assert.equal('function', typeof Class.emit);
    assert.equal('function', typeof Class.once);

    assert.equal('function', typeof Class.prototype.on);
    assert.equal('function', typeof Class.prototype.emit);
    assert.equal('function', typeof Class.prototype.once);
  });

  it('should have a `extend` function (static)', function() {
    assert.equal('function', typeof Class.extend);
  });

  it('should have a `create function (static)', function() {
    assert.equal('function', typeof Class.create);
  });

  it('should have a `reopenClass` function (static)', function() {
    assert.equal('function', typeof Class.reopenClass);
  });

  it('should create a new instance', function() {
    var C = Class.create();
    assert(C instanceof Class);
  });

  it('should create a new instance (create) with init props', function() {
    var C = Class.create({
      name: 123
    });
    assert(C instanceof Class);
    assert.equal(C.name, 123);
  });

  it('should extend the class and create a new instance', function() {
    var Person = Class.extend({
      name: 123
    });

    var P = Person.create();
    assert(P instanceof Person);
  });

});