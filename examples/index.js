// import  App from './0_hello'
// import  App from './1_array'
// import  App from './2_component'
// import  App from './3_component_class'
// import App from './artifact'

// import App from './test'
import App from './single'

import { k } from '../'

let props = { todo: 'Click' }

k.render(
  <App {...props} />,
  document.getElementById('app')
)

// setTimeout(() => {
	// k.emit('event-hooks', { greet: 'Keet' }, function(){
	// 	console.log('ole')
	// }) 
// }, 1000)