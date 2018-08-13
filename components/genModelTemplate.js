import ternaryOps from './ternaryOps'
const re = new RegExp(/(\schecked=")(.*?)(?=")/g)
let tmpl = ''

export default (string, obj) => {
  const arrProps = string.match(/{{([^{}]+)}}/g)
  let rep
  let isTernary
  let i
  let len
  let match
  tmpl = string
  for (i = 0, len = arrProps.length; i < len; i++) {
    rep = arrProps[i].replace(/{{([^{}]+)}}/g, '$1')
    isTernary = ternaryOps.call(obj, rep)
    if (isTernary) {
      tmpl = tmpl.replace('{{' + rep + '}}', isTernary.value)
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
