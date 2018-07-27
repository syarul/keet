var ternaryOps = require('./ternaryOps')
var tmpl = ''

module.exports = function (string, obj) {
  var args = this.args
  var arrProps = string.match(/{{([^{}]+)}}/g)
  var tempDiv
  var rep
  tmpl = string
  for(var i=0, len = arrProps.length;i<len;i++){
    rep = arrProps[i].replace(/{{([^{}]+)}}/g, '$1')
    var isTernary = ternaryOps.call(obj, rep)
    if(isTernary){
      tmpl = tmpl.replace('{{'+rep+'}}', isTernary.value)
    } else {
      tmpl = tmpl.replace('{{'+rep+'}}', obj[rep])
    }
    if (args && ~args.indexOf(rep) && !obj[rep]) {
      var re = new RegExp(' ' + rep + '="' + obj[rep] + '"', 'g')
      tmpl = tmpl.replace(re, '')
    }
  }
  return tmpl
}
