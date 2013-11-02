# Class
---

`hydro-class` is a full Class system for JavaScript. It's very much inspired by Ember.js' object system, but ported over to Node and without the weight of Ember.

Features:
  * Similar API (`create`, `extend`, `reopen`, `reopenClass`, etc...)
  * Mixin support (powered by `hydro-mixin`)
  * Extending Classes
  * Dynamic `_super` support. This allows you to inherit parent methods extremely easily.
  * Modular
  * Lightweight


## Install

NPM:

```bash
npm install hydro-class
```

## Usage

```js
var Class = require('hydro-class');
```

**Extending Classes**

```js
var App = Class.extend({
  // Prototype Properties...
  name: 'foo'
});
```

**Creating Instances**

`create()` allows you to add more properties
before the instance is created (for that instance only)
and add Mixins for that instance only.

```js
var App = Class.extend({});
var A   = App.create();
// or...
A = new App();
```

**Super**

```js
var count = 0;
var App = Class.extend({
  init: function() {
    this._super();
    count++;
    return 'yea!';
  }
});

App.create();
assert.equal(count, 1);
```

**Init**

When a new instance is created, `init` will be called on that instance. By default, `init` is simply an empty method that fires the `class:init` event. This allows you to override this method and provide your own logic.

This means you can treat `init` like a pretty constructor. This is where you'd do all your initializations.

```js
var App = Class.extend({
  init: function() {
    this.name = 'Foo';
    this.age  = 99;

    this._super();
  }
});

var A = App.create();
A.name; // 'Foo'
A.age; // 99
```

However, you need to make sure that you call `this._super()` depending on the super class. If the super class does some operation within their `init` method, please be sure to call it with `_super`.

**Reopening The Prototype**

```js
var App = Class.extend({
  name: 'fooPartial'
});

// Reopen
App.reopen({
  name: 'fooFull'
});

var A = App.create();
A.name; // 'fooFull'
```

**Reopening The Class (Static)**

```js
var App = Class.extend({
  someProtoProp: 123
});

App.reopenClass({
  goGoGo: function() {
    // Do something fancy!
  }
});

App.goGoGo();
```

### Mixins

With the `hydro-mixin` module (which this module is built upon), you'll be able to work with Mixins all day long!

```js
var Mixin = require('hydro-mixin');
```

**Create a new Mixin**

The `.create` method always creates an instance. There is no other option but to create instances.

```js
var AppMixin = Mixin.create({
  protoProp: 123
});
```

**Applying a Mixin**

When you want to apply the mixin to an object (or another mixin, or even a class) you'll want to call the `.apply` method.

```js
var AppMixin = Mixin.create({
  world: 123
});

var obj = {};
AppMixin.apply(obj);

console.log(obj); // { world: 123 }
```

**Priority Logic**

When you get into mixin multiple Mixins and objects, the last property added almost always wins. The logic differs when you apply mixins. The parameter to `.apply` is called the target, or base object. This object always has priority over other objects.

When functions are involved, we always check whether the property already exists on the target object, and if it does, we create a function wrapper using [super-wrapper](https://www.github.com/TheHydroImpulse/super-wrapper). This will establish a new function that wraps the old one, and then sets up the `_super` property.


Any other primitive gets overwritten straight out. I may add concatenate properties (like Ember) in the future.

## Test

```
mocha
```

## License

The MIT License (MIT)

Copyright (c) 2013 Daniel Fagnan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

