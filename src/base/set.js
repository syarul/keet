import { assign, isFunction } from 'lodash'
import auto from './auto'
import generator from './generator'

export default function (update, next) {
  assign(this.state, update)
  next = isFunction(next) && next || function() {}
  auto.call(this).then(generator.bind(this)).then(next)
}
