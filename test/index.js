var Class = require('..');
var assert = require('assert');

describe('class', function() {

  it('should export a function', function() {
    assert.equal('function', typeof Class);
  });

  it('should have an `extend` function', function() {
    assert(typeof Class.extend == 'function');
  });

  it('should have a `create` function', function() {
    assert(typeof Class.create == 'function');
  });

  it('should have a `reopen` function', function() {
    assert('function', typeof Class.reopen);
  });

  it('should have a `reopenClass` function', function() {
    assert('function', typeof Class.reopenClass);
  });

  it('should create a new class instance.', function() {
    var initHasBeenCalled = false;
    var instance = Class.create({
      init: function() {
        initHasBeenCalled = true;
      }
    });

    console.log(instance);

    assert(instance instanceof Class);
    assert.equal(initHasBeenCalled, true);
  });

});