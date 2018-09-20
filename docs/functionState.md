---
id: function_state
title: Functor State
sidebar_label: Functor State
---

## Working with Functor State

A state also may accept return values from its class constructor methods. To use it apply keyword ```this``` i.e ```{{this.<myMethod>}}```

> NOTE: Though they are passive, we can invoke ```Keet.prototype.callBatchPoolUpdate()``` to update a function state.

```js
import Keet from 'keet'

class App extends Keet {
  myMethod() {
    return 1 + 1
  }
}

const app = new App()

app.mount('Total of: 1 + 1 = {{this.myMethod}}').link('app')
```

## Codepen Sample

<p data-height="265" data-theme-id="dark" data-slug-hash="OoOLJj" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - Functor State" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/OoOLJj/">Keetjs - Functor State</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
