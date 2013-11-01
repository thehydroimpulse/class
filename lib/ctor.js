/**
 * Module dependencies.
 */

var Mixin = require('hydro-mixin');
var _     = require('underscore');

/**
 * Module exports
 */

exports = module.exports = makeCtor;

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
      Class.PrototypeMixin.apply(Class.prototype, [

      ]);
    }

    return this.prototype;
  }


  return Class;
}