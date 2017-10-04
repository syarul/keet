# keet.js v2

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-2.0.4-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/wzrd.in-2.0.4-ff69b4.svg)](https://wzrd.in/standalone/keet@latest) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

A solution to write clean interface for web application.

> version 1.x moved to branch v1

## Info

Stop writing html template/string inside your JavaScript codes, stick to the fundamental of ***JavaScript Object Oriented Design*** and keep your code clean and modular all the time.

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

Once mounted, the object attributes of our object are observable and you can simply change them to make new update.

```javascript
obj.example.template = 'hello keet!'

```
Our DOM will reactively change into 
```html
<div id="app">
  <!--result start-->
  <div id="example" style="font-style:italic;">hello keet!</div>
  <!--result end-->
</div>
```
But we better off changing it by using the build-in helper function
```javascript
app.setAttr('example', 'template', 'hello keet!')

```
To assign event handler we can simply write a property of our object with a key string starting with 'k-' i.e for click event, we write 'k-click' 

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

## Hierarchal delegation

To mount multiple Javascript objects that inherit properties from another object you could use ```Keet.prototype.cluster```

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

To have event more robust handling of data we should load it through JSON. With the advent of Node.js stream in the browser using [readable-stream](https://www.npmjs.com/package/readable-stream) we can have infinite possibilties on how we can control our application structure and data flow

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
  json.clickhandler = app._clickHandler.bind(app) // delegate our event handler to our components
  app.mount(json).link('app')
  next()
})

str('./data.json').pipe(fetchStream).pipe(sink)

module.exports = app

```

## License

The MIT License (MIT)

Copyright (c) 2017 Shahrul Nizam Selamat
  
