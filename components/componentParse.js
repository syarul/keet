module.exports = function (string) {
  var self = this
  this.__componentList__.map(function (component) {
    if (self[component]) {
      var regx = '(\\{\\{component:' + component + '\\}\\})'
      var re = new RegExp(regx)
      var match = string.match(re)
      if (match) {
        var tpl = self[component].render('asString')
        self.__componentStub__ = self.__componentStub__ || {}
        self.__componentStub__[component] = tpl
        string = string.replace(match[0], tpl)
      }
    }
  })
  return string
}
