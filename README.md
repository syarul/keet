<!-- AUTO-GENERATED-CONTENT:START (VER) -->
# Keet v3.4.6
<!-- AUTO-GENERATED-CONTENT:START (VER) -->
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-3.4.6-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/rawgit-3.4.6-ff69b4.svg)](https://cdn.rawgit.com/syarul/keet/master/keet-min.js) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet) [![Build Status](https://travis-ci.org/syarul/keet.svg?branch=master)](https://travis-ci.org/syarul/keet) [![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=master)](https://coveralls.io/github/syarul/keet?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

Minimalist view layer for the web.

## What is Keet

> *Keet* specific goal is to offer less APIs, familiar/vanilla code structures and a possible remedy to *choice paralysis*. It was never intended to be super fast and superior compare most major web frameworks, but generally is more flexible with loose coupling, less complicated design and workflow. It's also 4kb gzip in size. 

## Getting Started

To try out Keet is to include it from a CDN or npm.

Create a HTML file:-

```html
<html>
  <head>
    <script src="//cdn.rawgit.com/syarul/keet/master/keet-min.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
  <script>
    // your codes goes here
  </script>
</html>
```
Or from npm:-

```npm install keet```

## Sample Usage


### Hello World

Start by constructing a class expression as child of "Keet". We declare a variable
```vmodel```an assign a javascript object which we pass as an argument to this 
component. We can assign dynamic state with handlebars i.e: ```{{<myDynamicState>}}```

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/hello.js) -->
<!-- The below code snippet is automatically added from ./examples/hello.js -->
```js
import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.state = 'World'
  }
}

const app = new App()

const vmodel = {
  template: 'Hello {{state}}'
}

app.mount(vmodel).link('app')
```
<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/helloWorld.js) -->
<!-- AUTO-GENERATED-CONTENT:END -->

### Counter

Basic idea how we can create a simple counter

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/counter.js) -->
<!-- The below code snippet is automatically added from ./examples/counter.js -->
```js
import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.count = 0
  }
  add () {
    this.count++
  }
}

const app = new App()

const vmodel = {
  myCounter: {
    tag: 'button',
    'k-click': 'add()',
    template: '{{count}}'
  }
}

app.mount(vmodel).link('app')
```
<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/counter.js) -->
<!-- AUTO-GENERATED-CONTENT:END -->

More samples in [examples](https://github.com/syarul/keet/tree/master/examples) directory

## License

The MIT License (MIT)

Copyright (c) 2018 Shahrul Nizam Selamat
  
