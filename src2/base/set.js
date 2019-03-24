import { isEqual, isEqualWith, customizer } from '../utils'
import auto from './auto'
import generator from './generator'

export default function (update, callback) {
  Object.assign(this.state, update)
  // console.log(this)
  auto.call(this).then(generator.bind(this, callback))
}
