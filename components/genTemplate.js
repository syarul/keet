var processEvent = require('./processEvent')
var ternaryOps = require('./ternaryOps')
var testEvent = require('./utils').testEvent
var tmpl = ''

module.exports = function (obj) {
  var args = this.args
  var arrProps = this.base.template.match(/{{([^{}]+)}}/g)
  var tempDiv
  var rep
  tmpl = this.base.template
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
  tempDiv = document.createElement('div')
  tempDiv.innerHTML = tmpl
  testEvent(tmpl) && processEvent.call(this, tempDiv)
  tempDiv.childNodes[0].setAttribute('keet-id', obj['keet-id'])
  return tempDiv.childNodes[0]
}
