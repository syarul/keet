---
id: components
title: Component
sidebar_label: Component
---

## Sub Component

A html DOM node can repesent a component. To declare a component use a comment block 

```<!-- {{component:<mySubComponent>}} -->```.

```js
import Keet, { html, childLike } from 'keet'

@childLike() // babel-plugin-transform-decorators
class Sub extends Keet {
  el = 'sub'
  render() {
    return html`
```
```html
      <div id="sub">
        this is a sub-component
      </div>
    `
```

```js
  }
}

const sub = new Sub()

class App extends Keet {
  el = 'app'
  render() {
    return html`
```

```html
      <div id="container">
        <div>parent</div>
        <!-- {{component:sub}} -->
      </div>
    `
```
```js
  }
}

const app = new App()
```

## Codepen Sample

<p data-height="265" data-theme-id="dark" data-slug-hash="dqzLmY" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - Component" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/dqzLmY/">Keetjs - Component</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Notifying state changes across different components

Each component has pub/sub methods where another component can subscribe to changes in another component i.e

```js
// file main.js
import Keet from 'keet'

import other from './other'

class Main extends Keet {
  constructor() {
    super()
    this.state = 'main'
    other.subscribe(state => this.state = state)
  }
}

const main = new Main()
```

on another file

```js
// file other.js
import Keet from 'keet'

class Other extends Keet {}

const other = new Other()

export default other
```

then invoke the method ```update```

```js
other.inform('other')
```