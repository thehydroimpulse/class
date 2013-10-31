/**
 * Module dependencies.
 */

var makeCtor = require('./lib/ctor');
var Mixin    = require('hydro-mixin');

/**
 * Create a CoreClass
 */

var CoreClass = makeCtor();

/**
 * toString
 */

CoreClass.toString = function() {
  return 'CoreClass';
}

/**
 * PrototypeMixin
 */

CoreClass.PrototypeMixin = Mixin.create({

  reopen: function() {
    Mixin._apply(this, arguments, true);
    return this;
  },

  init: function() {
    console.log(1);
  },

  concatenatedProperties: null,

  toString: function() {

  }
});

/**
 * Owner Constructor
 */

CoreClass.PrototypeMixin.ownerConstructor = CoreClass;

/**
 * __super__
 */

CoreClass.__super__ = null;

/**
 * Class Mixin
 */

var ClassMixin = Mixin.create({
  ClassMixin: true,
  PrototypeMixin: CoreClass.PrototypeMixin,
  isClass: true,
  isMethod: false,

  extend: function() {

  },

  createWithMixins: function() {

  },

  create: function()  {
    var C = this;
    if (arguments.length > 0) {
      this._initProperties(arguments);
    }
    return new C();
  },

  reopen: function() {
    this.willReopen();
    Mixin._reopen.apply(this.PrototypeMixin, arguments);
    return this;
  },

  reopenClass: function() {
    Mixin._reopen.apply(this.ClassMixin, arguments);
    Mixin._apply(this, arguments, false);
    return this;
  }

});

/**
 * Owner Constructor
 */

ClassMixin.ownerConstructor = CoreClass;

/**
 * ClassMixin
 */

CoreClass.ClassMixin = ClassMixin;
ClassMixin.apply(CoreClass);

/**
 * Module exports
 */

module.exports = CoreClass;

