# Keetjs v3.0.0

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-3.0.0-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/wzrd.in-3.0.0-ff69b4.svg)](https://wzrd.in/standalone/keet@latest) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet) [![Build Status](https://travis-ci.org/syarul/keet.svg?branch=master)](https://travis-ci.org/syarul/keet) [![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=master)](https://coveralls.io/github/syarul/keet?branch=master)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

Minimalist view layer for the web.

## What is Keetjs

> *Keetjs* specific goal is to offer less APIs, familiar/vanilla code structures and a possible remedy to *choice paralysis*. It was never intended to be super fast and superior compare most major web frameworks, but generally is more flexible with loose coupling, less complicated design and workflow.

## Getting Started

To try out Keetjs is to include it from a CDN or npm.

Create a HTML file:-

```html
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <script src="//wzrd.in/standalone/keet@latest"></script>
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

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/hello.js) -->
<!-- The below code snippet is automatically added from ./examples/hello.js -->
```js
import Keet from '../keet'

/**
 * start by constructing a class expression as child of "Keet"
 */
class App extends Keet {
  constructor() {
    super()
    this.state = 'World'
  }
}

const app = new App

/**
 * vmodel is a decoupled js object mounted to the constructed "app". For introduction 
 * we declared our vmodel as part of this sample. It's advisable to decouple this elsewhere
 * i.e from (XHR, JSONGraph, streams or dataStore) later on.
 */
const vmodel = {
  header: {
    tag: 'h1',
    template: 'My Simple Vmodel'
  },
  simple: 'Hello {{state}}'
}

app.mount(vmodel).link('app')
```
<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/helloWorld.js) -->
<!-- AUTO-GENERATED-CONTENT:END -->

### Counter

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/counter.js) -->
<!-- The below code snippet is automatically added from ./examples/counter.js -->
```js
import Keet from '../keet'

/**
 * usage on how to update state
*/

class App extends Keet {
  constructor() {
    super()
    this.count = 0 // set our initial state in the constructor
  }
  add() {
    this.count++
  }
}

const app = new App

const vmodel = {
  header: {
    tag: 'h1',
    template: 'My Simple Counter'
  },
  counter: {
    tag: 'button',
    'k-click': 'add()', // eventListener click, assign key properties starting with 'k-<event>'
    template: '{{count}} click'
  }
}

app.mount(vmodel).link('app')
```
<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/counter.js) -->
<!-- AUTO-GENERATED-CONTENT:END -->

More samples in [examples](https://github.com/syarul/keet/tree/keet-rebase/examples) directory

## License

The MIT License (MIT)

Copyright (c) 2018 Shahrul Nizam Selamat
  
