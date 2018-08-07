---
id: counter
title: Counter
sidebar_label: Counter (eventListener)
---

## Handling State with eventListener

A simple counter application. This give you basic understanding how to work with DOM eventListener. To attach event we add a ```Node``` ```attribute``` with ```k-<event>``` where ```<event>``` could be one of any types of [Events](https://developer.mozilla.org/en-US/docs/Web/Events) and the value is a string representing one our method in the component class.

```js
import Keet, { html } from 'keet'

class App extends Keet {
  constructor(){
    super()
    this.count = 0
  }
  add (evt) {
    this.count++
  }
}

const app = new App()

app.mount(html`
```

```handlebars
  <button id="counter" k-click="add()">
    {{count}}
  </button>
```

```js
`).link('app')
```

## Counter - rendered

> <div id="counterApp"></div><br/>