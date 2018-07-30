module.exports = function (string) {
  var self = this
  this.__componentList__.map(function (component) {
    if (self[component]) {
      // register this component as a sub-component
      self[component].IS_STUB = true
      var regx = '(\\{\\{component:' + component + '\\}\\})'
      var re = new RegExp(regx)
      var match = string.match(re)
      var tpl = self[component].render('asString')
      // multiple root elements must be wrapped in an enclosing tag
      self.__componentStub__[component] = tpl
      string = string.replace(match[0], tpl)
    }
  })
  return string
}
