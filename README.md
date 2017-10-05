# keet.js v2

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-2.0.7-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/wzrd.in-2.0.7-ff69b4.svg)](https://wzrd.in/standalone/keet@latest) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

A solution to write clean interface for web application.

> version 1.x moved to branch v1

## Yo

- Stop polluting html template/string within your JavaScript codes, know when your code smells [iffy](https://sourcemaking.com/refactoring/smells)

- Get youself a service by having your application to be of [small-program design](https://sourcemaking.com/antipatterns/spaghetti-code) 

- Live up to the standard of [Unix Philosophy](http://www.faqs.org/docs/artu/ch01s06.html)

## Intro

Basic example:-

```javascript

const Keet = require('keet')

class App extends Keet {
  constructor(){
    super()
  }
}

const app = new App()

const obj = {
    template: '{{example}}',
    example: {
        tag: 'div',
        style: {
            'font-style': 'italic'
        },
        template: 'hello world'
    }
}

app.mount(obj).link('app') //'app' is the mount point of our DOM

```

Which will result into

```html
<div id="app">
  <!--result start-->
  <div id="example" style="font-style:italic;">hello world</div>
  <!--result end-->
</div>
```

Once mounted, the attributes of applied object are observable,

```javascript
obj.example.template = 'hello keet!'

```
the corresponding DOM will reactively changed into 
```html
<div id="app">
  <!--result start-->
  <div id="example" style="font-style:italic;">hello keet!</div>
  <!--result end-->
</div>
```
And the better option is by using the built-in helper function, or write your own
```javascript
app.setAttr('example', 'template', 'hello keet!')

```
To use event handlers we can simply assign key properties of the object with strings starting with 'k-' i.e for click event:- 'k-click' 

```javascript
const event = {
    template: '{{example}}',
    example: {
        tag: 'button',
        'k-click': 'clickHandler()',
        template: 'click me'
    },
    clickHandler: function(evt){
      console.log('I was clicked!')
    }
}

app.mount(event).link('app')

```

## Delegation

To mount multiple Javascript objects that inherit properties from another object, use ```Keet.prototype.cluster```

```javascript
const first = {
    template: '{{me}}',
    me: {
        tag: 'div',
        id: 'me'
    }
}

const child = () => {
  const second = {
    template: '{{cool}}',
    cool: {
        tag: 'div',
        template: 'I\'m cool yo!'
    }
  }
  const sec = new App()
  sec.mount(second).link('me')
} 

app.mount(first).link('app').cluster(child)
```


## Streamlike flow

To have even more robust data handling, we should load via JSON. With the advent of Node.js stream in the browser using [readable-stream](https://www.npmjs.com/package/readable-stream) we can manage and control our application structure and data flow concisely

```javascript
const str = require('string-to-stream')
const fetchStream = require('utils/fetchStream')
const through = require('through2')
const Keet = require('keet')

class App extends Keet {
  constructor(){
    super()
  }
  _clickHandler(evt){
    console.log('I\'m cool yo!')
  }
}

const app = new App()

const sink = through((buf, _, next) => {
  let json = JSON.parse(buf.toString())
  json.clickHandler = app._clickHandler.bind(app) // delegate event handler to component
  app.mount(json).link('app')
  next()
})

str('./data.json').pipe(fetchStream).pipe(sink)

module.exports = app

```

## License

The MIT License (MIT)

Copyright (c) 2017 Shahrul Nizam Selamat
  
