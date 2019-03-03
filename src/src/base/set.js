import { assign, isEqual, isEqualWith } from 'lodash'
import auto from './auto'
import generator from './generator'
import { customizer } from '../utils'

export default function (update) {
  if(!isEqualWith(this.state, update, customizer)) {
  	assign(this.state, update)
  	auto.call(this).then(generator.bind(this))
  }
}
