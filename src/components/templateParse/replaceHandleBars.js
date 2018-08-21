import ternaryOps from '../ternaryOps'
import strInterpreter from '../strInterpreter'
import updateState from './updateState'
import valAssign from './valAssign'

const re = /{{([^{}]+)}}/g

export default function (value, node, addState, isAttr) {
  const props = value.match(re)
  let ln = props.length
  let rep
  let tnr
  let isObjectNotation

  while (ln) {
    ln--
    rep = props[ln].replace(re, '$1')
    tnr = ternaryOps.call(this, rep)
    isObjectNotation = strInterpreter(rep)
    if (isObjectNotation) {
      updateState(rep, addState)
      if (!isAttr) {
        valAssign(node, value, '{{' + rep + '}}', this[isObjectNotation[0]][isObjectNotation[1]])
      } else {
        return value.replace(props, this[isObjectNotation[0]][isObjectNotation[1]])
      }
    } else {
      if (tnr) {
        updateState(tnr.state, addState)
        if (!isAttr) {
          valAssign(node, value, '{{' + rep + '}}', tnr.value)
        } else {
          return value.replace(props, tnr.value)
        }
      } else {
        if (this[rep] !== undefined) {
          updateState(rep, addState)
          if (!isAttr) {
            valAssign(node, value, '{{' + rep + '}}', this[rep])
          } else {
            return value.replace(props, this[rep])
          }
        }
      }
    }
  }
}
