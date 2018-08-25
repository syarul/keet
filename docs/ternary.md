---
id: ternary
title: Ternary State
sidebar_label: Ternary State
---

## Handling Boolean State

Often times with Javascript we use boolean as variables, but usually  when parsing the result to DOM we want it in a different form. In this case we use ternary operator as our state expression i.e ```{{<state>?<truthy>:<falsy>}}```.

```js
import Keet from 'keet'

class App extends Keet {
  status = false
}

const app = new App()

app.mount('Hello {{status?World:Keet}}').link('app')

// --> Hello Keet
```