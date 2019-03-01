import { assign } from 'lodash'
import auto from './auto'
import { batch, morpher } from './generator'

export default function (mutates) {
  assign(this.data, mutates)
  auto.call(this).then(batch.bind(this, morpher, 1))
}
