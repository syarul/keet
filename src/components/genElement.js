import reconcile from './templateParse/reconcile'
import diffNodes from './templateParse/diffNodes'

const DELAY = 0

const morpher = function () {
  genElement.call(this)
  // exec life-cycle componentDidUpdate
  if (this.componentDidUpdate && typeof this.componentDidUpdate === 'function') {
    this.componentDidUpdate()
  }
}

let timer = {}

const updateContext = function (fn, delay) {
  timer[this.ID] = timer[this.ID] || null
  clearTimeout(timer[this.ID])
  timer[this.ID] = setTimeout(() => fn.call(this), delay)
}

const genElement = function () {
  // reconcile.call(this, this.base.firstChild)
  diffNodes.call(this, this.base.firstChild)
}

export {
  genElement,
  updateContext,
  morpher
}
