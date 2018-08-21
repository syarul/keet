import ternaryOps from '../ternaryOps'
import strInterpreter from '../strInterpreter'
import updateState from './updateState'
import valAssign from './valAssign'

const re = /{{([^{}]+)}}/g

export default function (value, node, ins, updateStateList, templateParse, isAttr) {
  const props = value.match(re)
  let ln = props.length
  let rep
  let tnr
  let isObjectNotation

  while (ln) {
    ln--
    rep = props[ln].replace(re, '$1')
    tnr = ternaryOps.call(ins, rep)
    isObjectNotation = strInterpreter(rep)
    if (isObjectNotation) {
      updateState(rep, updateStateList)
      if (!isAttr) {
        valAssign(node, value, '{{' + rep + '}}', ins[isObjectNotation[0]][isObjectNotation[1]])
      } else {
        return value.replace(props, ins[isObjectNotation[0]][isObjectNotation[1]])
      }
    } else {
      if (tnr) {
        updateState(tnr.state, updateStateList)
        if (!isAttr) {
          valAssign(node, value, '{{' + rep + '}}', tnr.value)
        } else {
          return value.replace(props, tnr.value)
        }
      } else {
        if (ins[rep] !== undefined) {
          updateState(rep, updateStateList)
          if (!isAttr) {
            valAssign(node, value, '{{' + rep + '}}', ins[rep])
          } else {
            return value.replace(props, ins[rep])
          }
        }
      }
    }
  }
}
