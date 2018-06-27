<!-- AUTO-GENERATED-CONTENT:START (VER) -->
# Keetjs v3.4.5
<!-- AUTO-GENERATED-CONTENT:START (VER) -->
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-3.4.5-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/rawgit-3.4.5-ff69b4.svg)](https://cdn.rawgit.com/syarul/keet/master/keet-min.js) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet) [![Build Status](https://travis-ci.org/syarul/keet.svg?branch=master)](https://travis-ci.org/syarul/keet) [![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=master)](https://coveralls.io/github/syarul/keet?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

Minimalist view layer for the web.

## What is Keetjs

> *Keetjs* specific goal is to offer less APIs, familiar/vanilla code structures and a possible remedy to *choice paralysis*. It was never intended to be super fast and superior compare most major web frameworks, but generally is more flexible with loose coupling, less complicated design and workflow. It's also 4kb gzip in size. 

## Getting Started

To try out Keetjs is to include it from a CDN or npm.

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

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/hello.js) -->
<!-- The below code snippet is automatically added from ./examples/hello.js -->
```js
import Keet from 'keet'

/**
 * start by constructing a class expression as child of "Keet"
 */
class App extends Keet {
  constructor () {
    super()
    this.state = 'World'
  }
}

const app = new App()

/**
 * vmodel is a decoupled js object mounted to the component.
 * we could assign dynamic state to our component, DOM mutation
 * does not override the component state reference which always
 * remain pristine
 */
const vmodel = {
  header: {
    template: `
      <h1>My Simple Vmodel</h1>
      <p>vmodel is a decoupled javascript object mounted to the component</p>
    `
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
import Keet from 'keet'

/**
 * usage on how to update state
*/

class App extends Keet {
  constructor () {
    super()
    this.count = 0 // set our initial state in the constructor
  }
  add () {
    this.count++
  }
}

const app = new App()

const vmodel = {
  header: {
    template: `
      <h1>My Simple Counter</h1>
      <p>Usage on how to update states reactively</p>
    `
  },
  counter: {
    tag: 'button',
    /**
     * eventListener click, assign key properties starting
     * with 'k-<event>'
     */
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
  
