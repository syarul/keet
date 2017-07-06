<img width="274" src="https://raw.githubusercontent.com/syarul/keet/master/img/keet-logo.png"/> 

[![npm package](https://img.shields.io/badge/npm-1.3.0-blue.svg)](https://www.npmjs.com/package/keet)
[![browser build](https://img.shields.io/badge/wzrd.in-1.3.0-ff69b4.svg)](https://wzrd.in/standalone/keet@latest)
[![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet)
[![Build Status](https://travis-ci.org/syarul/keet.svg?branch=master)](https://travis-ci.org/syarul/keet)
[![test](https://img.shields.io/badge/test-58/58-brightgreen.svg)](https://travis-ci.org/syarul/keet)
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://travis-ci.org/syarul/keet)

A flexible view layer for the web which offer :-

- data bindings
- data from array
- input bindings
- built-in observable
- few APIs
- immutability(at least control partial DOM mutation)
- no custom attributes(unless ```id``` isn't present)
- reactive css and attribute
- small learning curve
- hassel-free integration with existing project

To see Keet.js in action visit [https://syarul.github.io](https://syarul.github.io)

Another sample: live usage at [codepen](http://codepen.io/syarul/pen/LVMdYa) 

## Getting there
For starter create a div element in a html template with an id "app".

```html
<body>
    ....
    <div id="app"></div>
    ....
</body>
```
..and in script block or ***just wrote this in the web console***
```javascript
var app = new Keet
app.link('app', 'Hello World')
```
## Documentation

Read the documentation [here](https://github.com/syarul/keet/blob/master/docs/DOCUMENTATION.md)

Take a look at [sample](https://github.com/syarul/keet/tree/master/sample) for a quick start using  Keet.js

Checkout [**todoMVC**](https://github.com/syarul/keetjs-todomvc) version of Keet.js

## Version history
- 1.3.0 Added ```Keet.prototype.evented``` see [this](https://github.com/syarul/keet/blob/master/sample/arrayAdv.js) for example
- 1.2.0 Added ```Keet.prototype.watchDistict```, watch an object attributes directly, now handle [input](https://github.com/syarul/keet/blob/master/sample/ele3.js) checked with ```el-checked```
- 1.1.0 Added handler for input checkbox
- 1.0.8 Addded double click with attributes ```k-double-click="someFunction()"```, remove force on ```compose()``` default always ```compose()```.
- 1.0.6 Apply context and arguments to function callback of ```Keet.prototype.watchObj```
- 1.0.0 Fix array observable not correctly handling data, add ```Array.prototype.assign``` for custom array assignment which is observable
- 0.9.1 Fix issue on declaring keet with link prototype
- 0.9.0 Remove log/debug, test coverage now at 100%
- 0.8.2 Remove some discrepancies, fixed observables, more test
- 0.8.0 Fixed Array.prototype.splice not propagating changes and callback, added code coverage and more test, split util functions ([cat](https://github.com/syarul/keet/blob/master/cat.js), [copy](https://github.com/syarul/keet/blob/master/copy.js), [tag](https://github.com/syarul/keet/blob/master/tag.js)) as standalone
- 0.7.4 Added test(w.i.p), fix minor bug
- 0.7.3 traverse DOM childrens recursively instead only affecting the first layer
- 0.7.2 Fix setter not correctly rendering from string
- 0.7.0 Fix multiple issues, DOM update now only update on changed, not rerender everything from string, compose now apply the DOM selector
- 0.6.3 Added function to run once dom updated at ```keet.prototype.watch```
- 0.6.2 Added ```keet.prototype.vDomLoaded```, which take a function an execute after the component loaded to DOM. See [this](https://github.com/syarul/keet/blob/master/sample/vDomLoaded.js) for example
- 0.6.0 Addded ```k-click``` attributes which handle click event, see [this](https://github.com/syarul/keet/blob/master/sample/k-click.js) for example
- 0.5.12 Fix ```Keet.prototype.splice``` operation when child nodes empty
- 0.5.11 Added event to ```keet.prototype.bindListener``` to allow event handling
- 0.5.10 Improve array handling by doing intelli changes
- 0.5.8 Added removeListener
- 0.5.7 Added force option to ```Keet.prototype.compose```
- 0.5.2 Discontinued old version, rename to Keet.js added tons of improvement, reaching stable release
- 0.5.1 Added object watch, added lookup with custom attributes, fix issue crash if jQuery is present, more samples with sane js implementation
- 0.5.0 Added array observable with ```Keet.prototype.watch``` suport multitude array operations such as assigment, push, pop, shift, unshift, slice, splice. See [sample](https://github.com/syarul/keet/tree/master/sample/array-observable.js) for usage
- 0.4.x Mutiple fixes
- 0.4.0 Added k-data linking, methods to control data directly in component state see [this](https://github.com/syarul/keet/tree/master/sample/k-data.js) for example
- 0.3.0 Improve css styles and attributes handling, by not mutating the states if changes same as last applied
- 0.2.0 Update array operation of insert/remove to use appendChild/removeChild instead rerender the whole list from string
- 0.1.0 Initial release(alpha)

## License

The MIT License (MIT)

Copyright (c) 2017 Shahrul Nizam Selamat
  
