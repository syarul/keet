# keet.js v2

A solution to write clean interface for web application

> version 1.x moved to branch v1

## Info

Basic example:-

```javascript

const Keet = require('keet')

const keet = ctx => new Keet(ctx)

const tmpl = {
    template: '{{example}}',
    example: {
        tag: 'div',
        id: 'example',
        style: {
            height: '300px',
            width: '600px',
            border: '1px solid blue',
            display: 'flex',
            'flex-flow': 'row wrap',
            'flex-direction': 'column',
            background: 'yellow'
        }
    }
}

keet(tmpl).link('app') //'app' is the mount point of our DOM

```

But with node.js stream + web component we can achieve a better flow where we load our static template with ajax write to a stream, pipe to a filter stream and finally pipe to a sink interface. 

```javascript
const vpipe = (json, _, next, app, id, ...clusters) => {

  app.mount(json)
    .link(id)
    .cluster(...clusters)

  next()
}

```

The web component:-

```javascript

import through from 'through2'
import stream from 'jsonui'
import filter from 'utils/filterStream'
import App from 'keet'
import Store from 'stores/appStore'

import vpipe from 'utils/vpipe'

import menu from 'components/menu'
import dashboard from 'components/dashboard'

class Main extends App {

  constructor() {
    super()
    this.store = new Store(this)
  }

  _pointerEvent(childs){
    childs.map(c => 
      this.store.getActiveState ? this.addClass(c, 'none') : this.removeClass(c, 'none'))
  }

}

const app = new Main

const skip = filter('app/index')

const sink = through({ objectMode: true }, (...args) => 
  vpipe(...args, app, 'app', menu, dashboard))

stream.pipe(skip).pipe(sink)

export default app

```


## License

The MIT License (MIT)

Copyright (c) 2017 Shahrul Nizam Selamat
  
