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
  state = 'World'
}

const app = new App()

app.mount('Hello {{state}}').link('app')

// --> Hello World
```

## Updating a State

To update a state we write a method in our class Expression that accept an argument.

```js
import Keet from 'keet'

class App extends Keet {
  state = 'World'
  // our method
  greeting(value) {
    this.state = value
  }
}

const app = new App()

app.mount('Hello {{state}}').link('app')

// --> Hello World
```

Then we can update the state by invoking the method.

```js
app.greeting('Keet')

// --> Hello Keet
```