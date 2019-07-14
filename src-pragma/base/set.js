import { assign, isFunc, composite } from '../utils'
import auto from './auto'
import generator from './generator'

export default function(update, next) {

    update && assign(this.state, update)

    next = isFunc(next) && next || function() {}

    composite.call(this)

    this.__composite__
        .then(generator)
        .then(next)

    auto.call(this)

}