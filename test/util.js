module.exports = {
  cat: function() {
    var argv = [].slice.call(arguments)
    argv = [].concat.apply([], argv)
    return argv.join('')
  }
}