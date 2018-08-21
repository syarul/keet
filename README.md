<!-- AUTO-GENERATED-CONTENT:START (VER) -->
# Keet v4.0.0
<!-- AUTO-GENERATED-CONTENT:START (VER) -->
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
[![npm package](https://img.shields.io/badge/npm-4.0.0-blue.svg)](https://www.npmjs.com/package/keet) [![browser build](https://img.shields.io/badge/rawgit-4.0.0-ff69b4.svg)](https://cdn.rawgit.com/syarul/keet/esm-4/keet-min.js) [![npm module downloads](https://img.shields.io/npm/dt/keet.svg)](https://www.npmjs.com/package/keet) [![Build Status](https://travis-ci.org/syarul/keet.svg?branch=esm-4)](https://travis-ci.org/syarul/keet) [![Coverage Status](https://coveralls.io/repos/github/syarul/keet/badge.svg?branch=esm-4)](https://coveralls.io/github/syarul/keet?branch=esm-4) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
<!-- AUTO-GENERATED-CONTENT:START (SHEILDS) -->
<!-- AUTO-GENERATED-CONTENT:END -->

Minimalist view layer for the web.

## What is Keet

> *Keet* specific goal is to offer less APIs, familiar/vanilla code structures and a possible remedy to [*choice paralysis*](https://the-pastry-box-project.net/addy-osmani/2014-January-19). It was never intended superior in features compare to most major web frameworks and waste no effort to become such. Generally *Keet* is more flexible, decent render performance with loose coupling, less complicated design and workflow. You might surprise with the logic and small learning curve it offers. It's also only 5kb gzip in size. Under the hood it use [morphdom](https://github.com/patrick-steele-idem/morphdom) to do ```DOM-diffing```.

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

Start by constructing a class expression as child of ```Keet```. Supply a string argument
to the component method ```mount```. Within the string, you can assign a state within handlebars i.e: ```{{<myState>}}```.

> NOTE: You also may use ternary expression as your state i.e: ```{{<ternaryState>?show:hide}}``` where
```<ternaryState>``` is a ```boolean``` value

<!-- AUTO-GENERATED-CONTENT:START (HELLO) -->
```js
import Keet from 'keet'

class App extends Keet {
  state = 'World'
}

const app = new App()

app.mount('Hello {{state}}').link('app')

```
<!-- AUTO-GENERATED-CONTENT:END -->

### Counter

Basic idea how we can create a simple counter

<!-- AUTO-GENERATED-CONTENT:START (COUNTER) -->
```js
import Keet from 'keet'
import { html } from 'keet/utils'

class App extends Keet {
  count = 0
  add (evt) {
    this.count++
  }
}

const app = new App()

app.mount(html`
  <button id="counter" k-click="add()">
    {{count}}
  </button>
`).link('app')

```
<!-- AUTO-GENERATED-CONTENT:END -->

## Dynamic Nodes

The traditional way, is you assign ```display:none``` to style attributes or use css, which still use resources. To use it wrap your html string with ```{{?<state>}}<myDynamicNode>{{/<state>}}``` and assign boolean value to the state.

> NOTE: With dynamic nodes it complete remove your node from the DOM and free up your resources which is good on mobile devices.

<!-- AUTO-GENERATED-CONTENT:START (CONDITIONAL_NODES) -->
```js
import Keet from 'keet'
import { html } from 'keet/utils'

class App extends Keet {
  show = false
  toggle () {
    this.show = !this.show
  }
}

const app = new App()

app.mount(html`
  <button id="toggle" k-click="toggle()" attr="{{show?foo:bar}}" style="color: {{show?red:blue}};" {{show?testme:test}}>toggle</button>
  <div id="1">one</div>
  <!-- {{?show}} -->
  <div id="2">two</div>
  <div id="3">three</div>
  <div id="4">four</div>
  <!-- {{/show}} -->
  <div id="5">five</div>
`).link('app')
```
<!-- AUTO-GENERATED-CONTENT:END -->

## List Rendering

To map an array to elements use the ```{{model:<myModelName>}}<myModelTemplate>{{/model:<myModelName>}}```. It has basic methods add/update/remove. To go beyond that requirement you could ```extend``` the ```class``` method of ```createModel```


> NOTE: Only mutation methods has attached listener, so usage of ```map``` ```filter``` ```reduce``` ```concat``` or directly reassigned new value to the ```list``` is encouraged and does not affect the ```dom-diffing``` efficiency. 

<!-- AUTO-GENERATED-CONTENT:START (MODEL) -->
```js
import Keet from 'keet'
import { html, createModel as CreateModel } from 'keet/utils'

let task = new CreateModel()

class App extends Keet {
  task = task
  componentWillMount () {
    // callBatchPoolUpdate - custom method to inform changes in the model.
    // If the component has other states that reflect the model value changes
    // we can safely ignore calling this method.
    this.task.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }
}

const app = new App()

app.mount(html`
  <ul id="list">
    <!-- {{model:task}} -->
    <li id="{{id}}">
      {{taskName}}
      <input type="checkbox" checked="{{complete?checked:null}}">
    </li>
    <!-- {{/model:task}} -->
  </ul>
`).link('app')

let taskName = ['run', 'jog', 'walk', 'swim', 'roll']

for (let i = 0; i < taskName.length; i++) {
  app.task.add({
    id: i,
    taskName: taskName[i],
    complete: i % 2 !== 0
  })
}

// update a task
app.task.update('id', {
  id: 0,
  taskName: 'sleep',
  complete: true
})

app.task.destroy('taskName', 'roll')
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Sub Component

Writing everything in a single file is not advisable, where you should split multiple components. To have multiple components together, use the sub-component feature with ```{{component:<mySubComponent>}}```.

> NOTE: Always has a root-element with id on sub-components html template literal, so the main component able to lookup for insertion.

<!-- AUTO-GENERATED-CONTENT:START (SUB_COMPONENT) -->
```js
import Keet from 'keet'
import { html } from 'keet/utils'

class Sub extends Keet {
  // provide the node id where this sub will rendered
  el = 'sub'
}

const sub = new Sub()

sub.mount(html`
  <div id="sub">
    this is a sub-component
  </div>
`)

class App extends Keet {
  subc = sub
}

const app = new App()

app.mount(html`
  <div id="container">
    <div>parent</div>
    <!-- {{component:subc}} -->
  </div>
`).link('app')

```
<!-- AUTO-GENERATED-CONTENT:END -->

<!-- AUTO-GENERATED-CONTENT:START (EXAMPLES) -->
For more usage cases visit the [examples](https://github.com/syarul/keet/tree/esm-4/examples) directory
<!-- AUTO-GENERATED-CONTENT:END -->

## License

The MIT License (MIT)

Copyright (c) 2018 Shahrul Nizam Selamat
  
