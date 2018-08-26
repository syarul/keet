---
id: dynamic_nodes
title: Dynamic Nodes
sidebar_label: Dynamic Nodes
---

## Dynamic Nodes

The traditional way, is you assign ```display:none``` to style attributes or use css. With Dynamic Nodes, we go a step further by adding and removing the nodes completely from the DOM. To use it wrap your html template literals with comment tags i.e ```<!-- {{?<state>}} --><node_1><node_2><node_3><!-- {{/<state>}} -->```. Add a new property state with boolean value to the class constructor

> NOTE: DOM add/removal is fast and free up your resources when you do not need these nodes.

```js
import Keet, { html } from 'keet'

class App extends Keet {
  constructor(){
    super()
    this.show = false
  }
  toggle () {
    this.show = !this.show
  }
}

const app = new App()

app.mount(html`
```

```html
  <button id="toggle" k-click="toggle()" style="color: {{show?red:blue}};">toggle</button>
  <div id="1">one</div>
  <!-- {{?show}} -->
  <div id="2">two</div>
  <div id="3">three</div>
  <div id="4">four</div>
  <!-- {{/show}} -->
  <div id="5">five</div>
```

```js
`).link('app')
```

> Output: <div id="dynamicApp"></div><br/>