---
id: model
title: List
sidebar_label: List
---

## List Rendering

To map an array to elements use the ```{{model:<myModelName>}}<myListPrototype>{{/model:<myModelName>}}```. To create model use [```createModel```](api_createModel.md) class. It has basic methods add/update/remove. You could extend the class method to have more control how the list should behave.

> NOTE: To modify the list reassigned new value to the ```list```. Usage of ```map``` ```filter``` ```reduce``` ```concat``` is encouraged and does not affect the ```dom-diffing``` efficiency. 

```js
import Keet, { html, CreateModel } from 'keet'

class App extends Keet {
  constructor() {
    super()
    this.task = new CreateModel()
    // subscribe to model changes
    this.task.subscribe(model =>
      // callBatchPoolUpdate - custom method to force update component states.
      // If the component has predefine state(s) that get reassigned within this
      // closure we can safely ignore calling this method.
      this.callBatchPoolUpdate()
    )
  }
}

const app = new App()

app.mount(html`
```

```html
  <h1>myModel</h1>
  <ul id="list">
    <!-- {{model:task}} -->
    <li id="{{id}}">
      {{taskName}}
    </li>
    <!-- {{/model:task}} -->
  </ul>
```

```js
`).link('app')

Array.from(['run', 'jog', 'walk', 'swim', 'roll']).map(taskName => {
  app.task.add({ taskName: taskName })
})
```

> Output: <div id="listApp"></div><br/>