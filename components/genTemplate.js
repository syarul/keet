var processEvent = require('./processEvent')

module.exports = function (obj, createId) {
  var args = this.args
  var tempDiv
  var tmpl = this.base.template

  for(var i = 0, len = this.__stateList__.length; i < len; i++){
    var rep = this.__stateList__[i].replace(/{{([^{}]+)}}/g, '$1')
    tmpl = tmpl.replace(/{{([^{}]+)}}/, obj[rep])
    if (args && ~args.indexOf(rep) && !obj[rep]) {
      var re = new RegExp(' ' + rep + '="' + obj[rep] + '"', 'g')
      tmpl = tmpl.replace(re, '')
    }
  }

  tempDiv = document.createElement('div')
  tempDiv.innerHTML = tmpl
  var isevt = /^k-/.test(tmpl)
  if (isevt) { processEvent.call(this, tempDiv) }
  createId && tempDiv.childNodes[0].setAttribute('keet-id', obj['keet-id'])
  return tempDiv.childNodes[0]
}
