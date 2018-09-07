---
id: hello_world
title: Hello World
sidebar_label: Hello World
---

## Basic

Start by constructing a class expression as child of ```Keet```. Supply a string argument
to the component method ```mount```. Within the string, you can assign a state within handlebars i.e: ```{{<myState>}}```.

```js
import Keet from 'keet'

class App extends Keet {
  constructor(){
    super()
    this.state ='World'
  }
}

const app = new App()

app.mount('Hello {{state}}').link('app')
```

## Codepen Sample

<p data-height="265" data-theme-id="dark" data-slug-hash="YOrmvP" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - Hello World" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/YOrmvP/">Keetjs - Hello World</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Updating a State

To update a state write a method in our class Expression that accept an argument.

```js
import Keet from 'keet'

class App extends Keet {
  constructor(){
    super()
    this.state ='World'
  }
  // our method
  greeting(value) {
    this.state = value
  }
}

const app = new App()

app.mount('Hello {{state}}').link('app')
```

Then we can update the state by invoking the method.

```js
app.greeting('Keet')
```

## Codepen Sample (updating state)

<p data-height="265" data-theme-id="dark" data-slug-hash="KxXOBQ" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - Hello World ( updating state)" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/KxXOBQ/">Keetjs - Hello World ( updating state)</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>