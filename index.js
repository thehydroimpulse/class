/**
 * Module dependencies.
 */

var makeCtor = require('./lib/ctor');
var Mixin    = require('hydro-mixin');
var Emitter  = require('emitter-component');

/**
 * Create a CoreClass
 */

var CoreClass = makeCtor();

/**
 * Module exports
 */

exports = module.exports = CoreClass;

/**
 * Emitter
 */

Emitter(CoreClass);

/**
 * Prototype
 */

Emitter(CoreClass.prototype);

/**
 * toString
 */

CoreClass.toString = function() {
  return '<CoreClass>';
}

/**
 * __super__
 */

CoreClass.__super__ = null;

/**
 * PrototypeMixin (Prototype)
 */

CoreClass.PrototypeMixin = Mixin.create({

  init: function() {
    this.emit('class:init', this);
  },

  reopen: function() {
    Mixin.reopen.apply(this.PrototypeMixin, arguments);
    return this;
  }

});

/**
 * ClassMixin (Static)
 */

CoreClass.ClassMixin = Mixin.create({

  extend: function() {
    var Class = makeCtor(), proto;
    Class.ClassMixin = Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = Mixin.create(this.PrototypeMixin);

    Class.ClassMixin.ownerConstructor = Class;
    Class.PrototypeMixin.ownerConstructor = Class;

    Mixin.reopen.apply(Class.PrototypeMixin, arguments);

    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = Object.create(this.prototype);
    proto.constructor = Class;
    Class.ClassMixin.apply(Class);
    return Class;
  },

  create: function() {
    var C = this;
    if (arguments.length>0) { this._initProperties(arguments); }
    return new C();
  },

  reopen: function() {
    Mixin.reopen.apply(this.PrototypeMixin, arguments);
    return this;
  },

  reopenClass: function() {

  }

});

/**
 * Apply the ClassMixin:
 */

CoreClass.ClassMixin.apply(CoreClass);
