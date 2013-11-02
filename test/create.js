var Class = require('..');
var Mixin = Class.Mixin;
var assert = require('assert');

describe("object create", function() {

  it('should make sure properties are set', function() {
    var o = Class.create({
      hello: 'woo'
    });
    assert.equal(o.hello, 'woo');
  });

  it('should inherit properties from passed Class', function() {
    var baseObj = Class.create({
      foo: 'bar'
    });
    var secondaryObj = Class.create(baseObj);
    assert.equal(secondaryObj.foo, baseObj.foo);
  });

  it.skip('should create a new object that includes mixins and properties', function() {
    var MixinA = Mixin.create({
      mixinA: 'A'
    });

    var obj = Class.create(MixinA, {
      prop: 'FOO'
    });

    assert.equal(obj.mixinA, 'A');
    assert.equal(obj.prop, 'FOO');
  })

});