var setState = require('./genElement').setState
var tmplHandler = require('./tmplHandler')
var getId = require('../utils').getId
var addState = require('./genElement').addState
var assert = require('../utils').assert

var DOCUMENT_ELEMENT_TYPE = 1

module.exports = function (stub) {
  tmplHandler(this, addState)
  var el = stub || getId(this.el)
  if (el) {
    if(el.nodeType === DOCUMENT_ELEMENT_TYPE){
      el.setAttribute('data-ignore', '')
    } else {
      assert(this.base.childNodes.length === 1, 'Sub-component should only has a single rootNode.')
      !this.base.firstChild.hasAttribute('data-ignore') && this.base.firstChild.setAttribute('data-ignore', '')
    }
    // listen to state changes
    setState.call(this)

    // mount fragment to DOM
    if(!stub){
      el.appendChild(this.base)
    }
    
    // since component already rendered, trigger its life-cycle method
    if (this.componentDidMount && typeof this.componentDidMount === 'function') {
      this.componentDidMount()
    }
  } else {
    assert(false, 'No element with id: "' + this.el + '" exist.')
  }
}
