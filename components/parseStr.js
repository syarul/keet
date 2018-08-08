var setState = require('./genElement').setState
var tmplHandler = require('./tmplHandler')
var getId = require('../utils').getId
var addState =  require('./genElement').addState
var assert = require('../utils').assert

module.exports = function (stub) {

  tmplHandler(this, addState)

  var el = stub || getId(this.el)

  if(el){
    // listen to state changes
    setState.call(this)
    // mount fragment to DOM
    el.appendChild(this.base)
    // since component already rendered, trigger its life-cycle method
    if (this.componentDidMount && typeof this.componentDidMount === 'function') {
      this.componentDidMount()
    }
  } else {
    assert(false, 'No element with id: "' + this.el + '" exist.')
  }
  
}
