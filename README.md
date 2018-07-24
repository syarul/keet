<!-- AUTO-GENERATED-CONTENT:START (VER) -->
# Keet v3.5.0
<!-- AUTO-GENERATED-CONTENT:START (VER) -->
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-3.5.0-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/rawgit-3.5.0-ff69b4.svg)](https://cdn.rawgit.com/syarul/keet/master/keet-min.js) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet) [![Build Status](https://travis-ci.org/syarul/keet.svg?branch=master)](https://travis-ci.org/syarul/keet) [![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=master)](https://coveralls.io/github/syarul/keet?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

Minimalist view layer for the web.

## What is Keet

> *Keet* specific goal is to offer less APIs, familiar/vanilla code structures and a possible remedy to [*choice paralysis*](https://the-pastry-box-project.net/addy-osmani/2014-January-19). It was never intended to be superior in features compare to most major web frameworks and waste no effort to become such. Generally *Keet* is more flexible, decent render performance with loose coupling, less complicated design and workflow. You might surprise with the logic and small learning curve it offers. It's also only 4kb gzip in size. Under the hood it use [set-dom](https://github.com/DylanPiercey/set-dom) and [hash-sum](https://github.com/bevacqua/hash-sum) to do ```DOM-diffing```.

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

Start by constructing a class expression as child of "Keet". Suppy a string argument
the component. Within the string, you can assign dynamic state within handlebars i.e: ```{{<myDynamicState>}}```

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/hello.js) -->
<!-- The below code snippet is automatically added from ./examples/hello.js -->
```js
import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.myDynamicState = 'World'
  }
}

const app = new App

app.mount('Hello {{myDynamicState}}').link('app')
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

const app = new App

app.mount('<button k-click="add()">{{count}}</button>').link('app')
```
<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/counter.js) -->
<!-- AUTO-GENERATED-CONTENT:END -->

## Dynamic Nodes

To work with dynamic nodes you can wrap your html string with ```{{?<state>}}<myDynamicNode>{{/<state>}}``` and assign boolean
value to the state 

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./examples/conditionalNodes.js) -->
<!-- The below code snippet is automatically added from ./examples/conditionalNodes.js -->
```js
import Keet from 'keet'

class App extends Keet {
  constructor(){
    super()
    this.show = false
  }
  change(){
    this.show = this.show ? false : true
  }
}

const app = new App

app.mount(`
  <div id="1">one</div>
  {{?show}}
  <div id="2">two</div>
  {{/show}}
  <div id="3">three</div>
`).link('app')

setInterval(() => app.change(), 2000)
```
<!-- AUTO-GENERATED-CONTENT:END -->

For more usage cases visit the [examples](https://github.com/syarul/keet/tree/master/examples) directory

## License

The MIT License (MIT)

Copyright (c) 2018 Shahrul Nizam Selamat
  
