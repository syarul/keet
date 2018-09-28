import ternaryOps from '../ternaryOps'
import strInterpreter from '../strInterpreter'
import updateState from './updateState'
import valAssign from './valAssign'

const re = /{{([^{}]+)}}/g

export default function (value, node, addState, isAttr, model) {
  const props = value.match(re)
  if (!props) return
  let propsLength = props.length
  let rep
  let tnr
  let isObjectNotation

  let self = this

  let ref = model || this

  let ln = 0

  while (ln < propsLength) {
    rep = props[ln].replace(re, '$1')
    tnr = ternaryOps.call(ref, rep)
    isObjectNotation = strInterpreter(rep)
    if (isObjectNotation) {
      if (!isAttr) {
        if (isObjectNotation[0] === 'this' && self[isObjectNotation[1]] !== undefined && typeof self[isObjectNotation[1]] === 'function') {
          let result = self[isObjectNotation[1]]()
          if (result !== undefined) {
            valAssign(node, '{{' + rep + '}}', result)
          }
        } else {
          updateState(rep, addState)
          valAssign(node, '{{' + rep + '}}', self[isObjectNotation[0]][isObjectNotation[1]])
        }
      } else {
        if (isObjectNotation[0] === 'this' && self[isObjectNotation[1]] !== undefined && typeof self[isObjectNotation[1]] === 'function') {
          let result = self[isObjectNotation[1]](ref)
          value = result !== undefined ? result : value
        } else {
          updateState(rep, addState)
          value = value.replace(props[ln], self[isObjectNotation[0]][isObjectNotation[1]])
        }
      }
    } else if (tnr) {
      updateState(tnr.state, addState)
      if (!isAttr) {
        // escape symbol
        rep = rep.replace('?', '\\?')
        valAssign(node, '{{' + rep + '}}', tnr.value)
      } else {
        value = value.replace(props[ln], tnr.value)
      }
    } else {
      if (ref[rep] !== undefined) {
        updateState(rep, addState)
        if (!isAttr) {
          valAssign(node, '{{' + rep + '}}', ref[rep])
        } else {
          value = value.replace(props[ln], ref[rep])
        }
      }
    }
    ln++
  }
  return value
}
