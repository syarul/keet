---
id: function_state
title: Function State
sidebar_label: Function State
---

## Working with Function State

A state also may accept return values from its class constructor methods. To use it apply keyword ```this``` i.e ```{{this.<myMethod>}}```

> NOTE: Though they are passive, we can invoke ```Keet.prototype.callBatchPoolUpdate()``` to update a function state.

```js
import Keet from 'keet'

class App extends Keet {
  myMethod () {
    return 1 + 1
  }
}

const app = new App()

app.mount('Total of: 1 + 1 = {{this.myMethod}}').link('app')

// --> Total of: 1 + 1 = 2
```
