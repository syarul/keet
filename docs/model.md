---
id: model
title: List
sidebar_label: List
---

## List Rendering

To map an array to elements use

```<!-- {{model:<myModelName>}} --><myListPrototype><!-- {{/model:<myModelName>}} -->```

  To create model use [```createModel```](api_createModel.md) class. It has basic methods add/update/remove. You could extend the class method to have more control how the list should behave.

> NOTE: To modify the list reassigned new value to the ```list```. Usage of ```map``` ```filter``` ```reduce``` ```concat``` is encouraged and does not affect the ```dom-diffing``` efficiency. 

```js
import Keet, { html, CreateModel } from 'keet'

class App extends Keet {
  el = 'app'
  task = new CreateModel()
  render() {
    this.task.subscribe(model =>
      // callBatchPoolUpdate - custom method to force update 
      // component states.If the component has predefine state(s) 
      // that get reassigned within this closure we can safely 
      // ignore calling this method.
      this.callBatchPoolUpdate()
    )
    
    Array.from(['run', 'jog', 'walk', 'swim', 'roll']).map(taskName => {
      this.task.add({ taskName: taskName })
    })
    
    return html`
```
```html
      <h4>myModel</h4>
      <ul id="list">
        <!-- {{model:task}} -->
        <li>
          {{taskName}}
        </li>
        <!-- {{/model:task}} -->
      </ul>
```
```js
    `
  }
}

const app = new App()
```

## Codepen Sample

<p data-height="265" data-theme-id="dark" data-slug-hash="eLEoGQ" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - List" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/eLEoGQ/">Keetjs - List</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>