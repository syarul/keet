import { assign, isFunction } from 'lodash'
import auto from './auto'
import generator from './generator'
import v from '../v'

export default function (update, next) {
  assign(this.state, update)
  next = isFunction(next) && next || function() {}

  let { rootApp } = v || {}

  if(!rootApp) rootApp = this

  console.log(this.state)

  auto.call(rootApp).then(generator.bind(rootApp)).then(next)

}
