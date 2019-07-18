import  App from './0_hello'
// import  App from './1_array'
// import  App from './2_component'
// import  App from './3_component_class'
// import App from './artifact'

import { k } from '../'

let props = { greet: 'World' }

k.render(
  <App {...props} />,
  //<div {...props}>I'm ready!</div>, 
  document.getElementById('app')
)

setTimeout(() => k.emit('event-hooks', { greet: 'Keet' }) , 1000)