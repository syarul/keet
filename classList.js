module.exports = classList

function classList () {
  this.cstore = []
}

classList.prototype.add = function () {
  var self = this
  var args = [].slice.call(arguments)
  args.map(function (a) {
    if (!~self.cstore.indexOf(a)) self.cstore = self.cstore.concat([a])
  })
}

classList.prototype.remove = function () {
  var self = this
  var args = [].slice.call(arguments)
  args.map(function (a) {
    var i = self.cstore.indexOf(a)
    if (~i) self.cstore.splice(i, 1)
  })
}

classList.prototype.item = function (num) {
  return this.cstore[num]
}

classList.prototype.toggle = function () {
  var args = [].slice.call(arguments)
  var c
  if (args.length === 2) {
    c = args[0]
    var bool = args[1]
    if (bool) {
      this.add(c)
    } else {
      this.remove(c)
    }
  } else {
    c = args[0]
    var i = this.cstore.indexOf(c)
    if (~i) {
      this.cstore.splice(i, 1)
      return 'false'
    } else {
      this.cstore = this.cstore.concat([c])
      return 'true'
    }
  }
}

classList.prototype.contains = function (str) {
  var i = this.cstore.indexOf(str)
  if (~i) return 'true'
  return 'false'
}

classList.prototype.replace = function (oldClass, newClass) {
  var i = this.cstore.indexOf(oldClass)
  if (~i) {
    this.cstore.splice(i, 1, newClass)
  }
}
