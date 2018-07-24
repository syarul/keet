module.exports = function(string) {
  var self = this 
  this.__stateList__.map(function(state) {
    if (!self[state]) {
      var f = '\\{\\{\\?' + state + '\\}\\}'
      var b = '\\{\\{\\/' + state + '\\}\\}'
      // var regx = '(?<=' + f + ')(.*?)(?=' + b + ')'
      // ** old browser does not support positive look behind **
      var regx = '(' + f + ')(.*?)(?=' + b + ')'
      var re = new RegExp(regx)
      var isConditional = re.test(string)
      var match = string.match(re)
      if(isConditional && match){ 
        string = string.replace(match[2], '')
      }
    }
    string = string.replace('{{?'+state+'}}', '')
    string = string.replace('{{/'+state+'}}', '')
  })
  return string
}