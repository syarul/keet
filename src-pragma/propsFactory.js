import { assign, composite, isObj } from './utils'

/**
 * Props factory - handling component middlewares
 */
function propsFactory() {

  let props = {}

  let lock = false

  this.getProps = () => props

  this.setProps = nextProps => {
  	if(!lock) {
  		props = isObj(nextProps) && assign(props, nextProps) || props
  		lock = true
  	}
  }

  // unlock props changes, briefly 
  // before assigning newProps
  this.umount = () => {
  	lock = false
  }

  // remove a middleware or cleanup the whole middleware factory
  this.flush = attributes => {
  	if(attributes){
  		delete props[attributes]
  	} else {
  		for(let attr in props){
  			delete props[attr]
  		}
  	}
  }
} 

export default new propsFactory