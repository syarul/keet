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
  add() {
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

## Codepen Sample

<p data-height="265" data-theme-id="dark" data-slug-hash="zpbGBd" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - Counter" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/zpbGBd/">Keetjs - Counter</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>