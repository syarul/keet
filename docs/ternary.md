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
  el = 'app'
  status = false
  render() {
    return 'Hello {{status?World:Keet}}'
  }
}

const app = new App()
```

## Codepen Sample 

<p data-height="265" data-theme-id="dark" data-slug-hash="eLGqPP" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - Ternary State" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/eLGqPP/">Keetjs - Ternary State</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>