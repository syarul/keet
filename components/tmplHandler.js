var strInterpreter = require('./strInterpreter')

module.exports = function (str, updateStateList) {
  var self = this
  var arrProps = str.match(/{{([^{}]+)}}/g)
  if (arrProps && arrProps.length) {
    arrProps.map(function (s) {
      var rep = s.replace(/{{([^{}]+)}}/g, '$1')
      var isObjectNotation = strInterpreter(rep)
      // console.log(rep, self)
      if (!isObjectNotation) {
        if (self[rep] !== undefined) {
          updateStateList(rep)
          str = str.replace(/{{([^{}]+)}}/, self[rep])
        }
      } else {
        updateStateList(rep)
        str = str.replace(/{{([^{}]+)}}/, self[isObjectNotation[0]][isObjectNotation[1]])
      }
      if (rep.match(/^\?/g)) {
        updateStateList(rep.replace('?', ''))
      }
    })
  }
  return str
}
