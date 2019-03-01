import { assign } from 'lodash'
import auto from './auto'
import generator from './generator'

export default function (update) {
  assign(this.data, update)
  auto.call(this).then(generator.bind(this))
}
