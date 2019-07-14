import { uniqueId } from 'lodash'
import auto from './auto'

export default function (exec, props) {
  this.props = props || {}
  this.state = this.state || {}
  this.__ref__ = {
    // generate id for this component
    id: uniqueId(),
    // pubsub callback storage
    exec
  }

  Object.defineProperty(this, '__ref__', { enumerable: false, configurable: true })

  // Object.defineProperty(this, 'render', { 
  //   get: function(){
  //     let args = [].slice.call(arguments)
  //     return function(args){
  //       console.log(args)
  //     }
  //   },
  //   set: function(){
  //     console.log([].slice.call(arguments))
  //   }
  // })

  auto.call(this)
}
