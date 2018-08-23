import ternaryOps from '../ternaryOps'
import strInterpreter from '../strInterpreter'
import updateState from './updateState'
import valAssign from './valAssign'

const re = /{{([^{}]+)}}/g

export default function (value, node, addState, isAttr, model) {
  const props = value.match(re)
  if (!props) return
  let ln = props.length
  let rep
  let tnr
  let isObjectNotation

  let self = this

  let ref = model || this

  while (ln) {
    ln--
    rep = props[ln].replace(re, '$1')
    tnr = ternaryOps.call(ref, rep)
    isObjectNotation = strInterpreter(rep)
    if (isObjectNotation) {
      if (!isAttr) {
        if (isObjectNotation[0] === 'this' && self[isObjectNotation[1]] !== undefined && typeof self[isObjectNotation[1]] === 'function') {
          let result = self[isObjectNotation[1]]()
          if (result !== undefined) {
            valAssign(node, value, '{{' + rep + '}}', result)
          }
        } else {
          updateState(rep, addState)
          valAssign(node, value, '{{' + rep + '}}', self[isObjectNotation[0]][isObjectNotation[1]])
        }
      } else {
        if (isObjectNotation[0] === 'this' && self[isObjectNotation[1]] !== undefined && typeof self[isObjectNotation[1]] === 'function') {
          let result = self[isObjectNotation[1]](ref)
          return result !== undefined ? result : value
        } else {
          updateState(rep, addState)
          return value.replace(props, self[isObjectNotation[0]][isObjectNotation[1]])
        }
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
        if (ref[rep] !== undefined) {
          updateState(rep, addState)
          if (!isAttr) {
            valAssign(node, value, '{{' + rep + '}}', ref[rep])
          } else {
            return value.replace(props, ref[rep])
          }
        }
      }
    }
  }
}
