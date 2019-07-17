import { assign, composite } from './utils'

function propsFactory() {

  let props = {}

  let mounted = false

  this.getProps = () => props

  this.setProps = nextProps => {
  	if(!mounted) {
  		props = assign(props, nextProps)
  		mounted = true
  	}
  }

  // unlock props changes, briefly 
  // before assigning newProps
  this.umount = () => {
  	mounted = false
  }

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