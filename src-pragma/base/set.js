import { assign, isFunc, composite } from '../utils'
import auto from './auto'
import generator from './generator'

export default function(nextProps = {}, nextState = {}, handler) {

    assign(this.state, nextState)

    assign(this.props, nextProps)

    handler = isFunc(handler) && handler || function() {}

    composite.call(this)

    this.__composite__
        .then(generator)
        .then(handler)

    auto.call(this)

}