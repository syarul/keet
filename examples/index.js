// import  App from './0_hello'
// import  App from './1_array'
// import  App from './1_component'
// import  App from './3_component_class'

import App from './artifact'

import { kv } from '../'

let props = { greet: 'World' }

kv.render(
  <App {...props} />, document.getElementById('app')
)