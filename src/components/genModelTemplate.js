import ternaryOps from './ternaryOps'
import strInterpreter from './strInterpreter'

const re = new RegExp(/(\schecked=")(.*?)(?=")/g)

let tmpl = ''
let rep
let isTernary
let i
let len
let match
let isObjectNotation

export default function (string, obj) {
  const arrProps = string.match(/{{([^{}]+)}}/g)
  tmpl = string
  for (i = 0, len = arrProps.length; i < len; i++) {
    rep = arrProps[i].replace(/{{([^{}]+)}}/g, '$1')
    isTernary = ternaryOps.call(obj, rep)
    isObjectNotation = strInterpreter(rep)
    if (isTernary) {
      tmpl = tmpl.replace('{{' + rep + '}}', isTernary.value)
    } else if (isObjectNotation) {
      if (isObjectNotation[0] === 'this' && typeof this[isObjectNotation[1]] === 'function') {
        let result = this[isObjectNotation[1]](obj)
        if (result !== undefined) {
          tmpl = tmpl.replace('{{' + rep + '}}', result)
        }
      }
    } else {
      tmpl = tmpl.replace('{{' + rep + '}}', obj[rep])
    }

    match = tmpl.match(re)
    if (match) {
      if (match[0].length === 17) { tmpl = tmpl.replace(' checked="checked"', ' checked') } else { tmpl = tmpl.replace(' checked=""', '') }
    }
  }
  return tmpl
}
