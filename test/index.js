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
    assert.equal(P.name, 123);
  });

  it('should have an init method (proto)', function() {
    var Person = Class.extend({
      name: 123
    });

    var P = Person.create();
    assert.equal('function', typeof P.init);
  });

  it('should fire off `class:init` event when calling `init` method', function() {
    var initHasBeenCalled = false
    var Person = Class.extend({});
    var P = Person.create();

    P.on('class:init', function(C) {
      initHasBeenCalled = true;
    });

    P.init();

    assert.equal(initHasBeenCalled, true);
  });

  it('should call a function', function() {
    var Parent = Class.extend({
      hello: function() {
        return 'hello';
      }
    });

    var P = Parent.create();
    assert.equal(P.hello(), 'hello');
  });

  it('should call init', function() {
    var Parent = Class.extend({
      init: function() {
        return 'hello';
      }
    });

    var P = Parent.create();
    assert.equal(P.init(), 'hello');
  });

  it('should call super init', function() {
    var parentInitHasBeenCalled = false;

    var Parent = Class.extend({
      init: function() {
        this._super();
      }
    });

    var P = Parent.create();

    P.on('class:init', function(C) {
      parentInitHasBeenCalled = true;
    });

    P.init();

    assert.equal(parentInitHasBeenCalled, true);
  });

  it('should extend multiple classes', function() {

    var App = Class.extend({});

    assert.equal('function', typeof App.create);

    var Two = App.extend({
      name: 'Two'
    });

    assert.equal('function', typeof Two.create);
  });

  it('should extend a class and create an instance of it.', function() {

    var App = Class.extend({
      hello: 123
    });

    var A = App.create();

    assert(A instanceof Class);
    assert(A.hello, 123);
    assert(typeof A.create, 'undefined');
    assert(typeof A.extend, 'undefined');
    assert(typeof A.on, 'function');
    assert(typeof A.emit, 'function');
  });

  it('should create two subclasses. (extending twice).', function() {

    var App = Class.extend({
      world: 123
    });

    var World = App.extend({
      haha: 123
    });

    var A = App.create();
    var W = World.create();

    assert(A instanceof Class);
    assert(W instanceof App);
    assert(W instanceof Class);

  });

});