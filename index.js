/**
 * Module dependencies.
 */

var Mixin    = require('hydro-mixin');
var Emitter  = require('emitter-component');

/**
 * Undefined Descriptor
 */

var undefinedDescriptor = {
  configurable: true,
  writable: true,
  enumerable: false,
  value: undefined
};


/**
 * Make Ctor
 */

function makeCtor() {

  var wasApplied = false, initMixins, initProperties;

  var Class = function() {
    if (!wasApplied) {
      Class.proto();
    }

    Object.defineProperty(this, '_super', undefinedDescriptor);

    if (initMixins) {
      var mixins = initMixins;
      initMixins = null;
      this.reopen.apply(this, mixins);
    }

    if (initProperties) {
      var props = Array.prototype.slice.call(initProperties);
      initProperties = null;
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if ('object' === typeof prop && !(prop instanceof Array)) {
          for (var key in prop) {
            this[key] = prop[key];
          }
        }
      }
    }

    this.init.apply(this, arguments);
  }

  Class.toString = Mixin.prototype.toString;

  Class.willReopen = function() {
    if (wasApplied) {
      Class.PrototypeMixin = Mixin.create(Class.PrototypeMixin);
    }

    wasApplied = false;
  };

  Class._initMixins = function(args) {
    initMixins = args;
  };

  Class._initProperties = function(args) {
    initProperties = args;
  };

  Class.proto = function() {
    var superclass = Class.superclass;
    if (superclass) {
      superclass.proto();
    }

    if (!wasApplied) {
      wasApplied = true;
      Class.PrototypeMixin.apply(Class.prototype);
    }

    return this.prototype;
  }


  return Class;
}

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
    Mixin.reopen.apply(this.ClassMixin, arguments);
    Mixin.apply.apply(this, arguments);
    return this;
  }

});

/**
 * Apply the ClassMixin:
 */

CoreClass.ClassMixin.apply(CoreClass);
