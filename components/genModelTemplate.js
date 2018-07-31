var ternaryOps = require('./ternaryOps')
var tmpl = ''

module.exports = function (string, obj) {
  var arrProps = string.match(/{{([^{}]+)}}/g)
  var rep
  var isTernary
  tmpl = string
  for (var i = 0, len = arrProps.length; i < len; i++) {
    rep = arrProps[i].replace(/{{([^{}]+)}}/g, '$1')
    isTernary = ternaryOps.call(obj, rep)
    if (isTernary) {
      tmpl = tmpl.replace('{{' + rep + '}}', isTernary.value)
    } else {
      tmpl = tmpl.replace('{{' + rep + '}}', obj[rep])
    }
  }
  return tmpl
}
