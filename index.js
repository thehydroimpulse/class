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
 * Create the constructor and setup the prototype
 * object. This will go ahead and apply all the initial mixins
 * and properties to the prototype and mixin the PrototypeMixin.
 *
 *
 * @public
 * @name makeCtor
 * @return {Class}
 */

function makeCtor() {

  // Default variables.
  var wasApplied = false, initMixins, initProperties;

  var Class = function() {

    /**
     * Initialize the prototype property of this class. Only if
     * it wasn't applied already.
     */

    if (!wasApplied) {
      Class.proto();
    }

    /**
     * Define an empty `_super` property on the prototype.
     */

    Object.defineProperty(this, '_super', undefinedDescriptor);

    /**
     * Apply any initial mixins that we may have.
     */

    if (initMixins) {
      var mixins = initMixins;
      initMixins = null;
      console.log(this);
      this.reopen.apply(this, mixins);
    }

    /**
     * Apply any initial properties that we may have.
     */

    if (initProperties) {
      var props = Array.prototype.slice.call(initProperties);
      initProperties = null;
      for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (prop instanceof Mixin) {
          //this.reopen.apply(this.PrototypeMixin, prop);
        } else if ('object' === typeof prop && !(prop instanceof Array)) {
          for (var key in prop) {
            this[key] = prop[key];
          }
        }
      }
    }

    // We're done with the main constructor, let's call a
    // synthesised `init` function. The default `init` method
    // is empty.

    this.init.apply(this, arguments);
  }

  /**
   * Apply the Mixin's toString function by default
   *
   * @name toString
   * @public
   * @proto
   * @return {String}
   */

  Class.toString = Mixin.prototype.toString;

  /**
   * Check if the class was already applied when we reopen it.
   * If the PrototypeMixin was already applied to the prototype
   * then re-create it.
   *
   * @name willReopen
   * @public
   * @static
   * @return {Undefined}
   */

  Class.willReopen = function() {
    if (wasApplied) {
      Class.PrototypeMixin = Mixin.create(Class.PrototypeMixin);
    }

    wasApplied = false;
  };

  /**
   * Set the initial Mixins for the class.
   *
   * @name _initMixins
   * @public
   * @static
   * @return {Undefined}
   */

  Class._initMixins = function(args) {
    initMixins = args;
  };

  /**
   * Set the initial properties for the class.
   *
   * @name _initProperties
   * @public
   * @static
   * @return {Undefined}
   */

  Class._initProperties = function(args) {
    initProperties = args;
  };

  /**
   * Initialize the prototype for the class. This will setup
   * the superclass' prototype object as well, if a superclass is
   * present.
   *
   * It will also apply the PrototypeMixin to the class' prototype
   * object and then return the prototype.
   *
   * @name proto
   * @public
   * @proto
   * @return {Prototype} Class' Prototype
   */

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

  // Finally return the new constructor.
  return Class;
}

/**
 * Create a new constructor that will form the basis for all
 * classes `CoreClass`.
 *
 * @return {Function} Class Constructor
 */

var CoreClass = makeCtor();

/**
 * Module exports.
 */

exports = module.exports = CoreClass;

/**
 * Expose `Mixin`.
 */

exports.Mixin = Mixin;

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
 * Create a default `__super__`. This is used to establish
 * superclasses when extending another class.
 *
 * @static
 * @type {null}
 */

CoreClass.__super__ = null;

/**
 * PrototypeMixin (Prototype)
 *
 * Create a new Mixin that will act as the prototype object.
 * This will currently allow us to easily create new extending classes
 * by working with these set Mixins.
 *
 * @property {Mixin} PrototypeMixin
 * @static
 * @return {Mixin}
 */

CoreClass.PrototypeMixin = Mixin.create({

  /**
   * This is the default initialization method. This acts like a proxy
   * constructor, where, after the constructor finalizes it's duties,
   * this method will be called.
   *
   * A subclass will most likely override this method, which will be
   * called, instead.
   *
   * @method init
   * @proto
   */

  init: function() {
    this.emit('class:init', this);
  },

  /**
   * `reopen` will reopen the prototype Mixin for new additions. This allows
   * one to create whole classes in steps, rather than at once. This will
   * reapply the PrototypeMixin.
   *
   * @method reopen
   * @proto
   * @return {Class}
   */

  reopen: function() {
    Mixin.reopen.apply(this.PrototypeMixin, arguments);
    return this;
  }

});

/**
 * ClassMixin (Static).
 *
 * Create a new static Mixin that will act as the static properties for the
 * classes. This allows us to easily create new classes, and simply apply
 * this Mixin. Resulting is higher code reuse.
 *
 * @property {Mixin} ClassMixin
 * @return {Mixin}
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
    this.willReopen();
    Mixin.reopen.apply(this.PrototypeMixin, arguments);
    return this;
  },

  reopenClass: function() {
    Mixin.reopen.apply(this.ClassMixin, arguments);
    Mixin.apply(this, arguments);
    return this;
  },

  detect: function(obj) {
    if ('function' !== typeof obj) { return false; }
    while(obj) {
      if (obj===this) { return true; }
      obj = obj.superclass;
    }
    return false;
  }

});

/**
 * Apply the ClassMixin:
 */

CoreClass.ClassMixin.apply(CoreClass);
