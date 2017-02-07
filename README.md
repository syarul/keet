# Keet.js

Feels at home, no new learning curve or paradigm on understanding how a web framework should work. **K.I.S.S** and does not obscured data from view with walls of ***you-name-it-how-to-master-a-framework***. Keet.js offer a little bit of;

- data bindings
- data from array
- input bindings
- built-in observable
- few APIs
- immutability(at least control partial DOM mutation)
- component register/deregister
- no custom attributes(unless ```id``` isn't present)
- reactive css and attributes

To see Keet.js in action visit [https://syarul.github.io](https://syarul.github.io)

Since Keet is a view layer, you can use it with or without other framework.  

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

Take a look inside [sample](https://github.com/syarul/keet/tree/master/sample) for a quick start using  Keet.js

## Foward

- Keet.js embrace javascript OO and it's first class functions.
- For the most part, you can follow standard javascript best practices, 
- It's better to holds Keet.js components inside closure or object, for a maintainable code
- Use the debug mode by passing boolean true or string 'debug' to Keet constructor for a quick trace of elements rendering behavior or failed hookup between components
- Having trouble of unrendered elements or rendering order issue? ```Keet.prototype.compose(fn)``` has a callback function(fn) which execute after its rendered to DOM
- Use ```Keet.prototype.register/unreg``` to swap components, so components by any means are highly reusable
- All Keet.prototypes return itself, chaining methods is supported all along

## Version history

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
  
