
import reconcile from './templateParse/reconcile'
import diffNodes from './templateParse/diffNodes'
import strInterpreter from './strInterpreter'
import genModelTemplate from './genModelTemplate'
import mountToFragment from '../base/mountToFragment'

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

const nextState = function (i) {
  let self = this
  let state
  let value
  if (!stateList[this.ID]) return
  if (i < stateList[this.ID].length) {
    state = stateList[this.ID][i]
    value = this[state]

    // if value is undefined, likely has object notation we convert it to array
    if (value === undefined) value = strInterpreter(state)

    if (value && Array.isArray(value)) {
      // using split object notation as base for state update
      let inVal = this[value[0]][value[1]]

      Object.defineProperty(this[value[0]], value[1], {
        enumerable: false,
        configurable: true,
        get: function () {
          return inVal
        },
        set: function (val) {
          inVal = val
          updateContext.call(self, morpher, DELAY)
        }
      })
    } else {
      // handle parent state update if the state is not an object
      Object.defineProperty(this, state, {
        enumerable: false,
        configurable: true,
        get: function () {
          return value
        },
        set: function (val) {
          value = val
          updateContext.call(self, morpher, DELAY)
        }
      })
    }
    i++
    nextState.call(this, i)
  }
}

const setState = function () {
  nextState.call(this, 0)
}

let stateList = {}

function clearState () {
  if (stateList[this.ID]) stateList[this.ID] = []
}

function addState (state) {
  stateList[this.ID] = stateList[this.ID] || []
  if (stateList[this.ID].indexOf(state) === -1) { stateList[this.ID] = stateList[this.ID].concat(state) }
}

const genElement = function () {
  let base
  let frag
  if (this.IS_SVG) {
    base = genModelTemplate.call(this, this.__pristineFragment__)
    frag = document.createDocumentFragment()
    mountToFragment(frag, base)
    this.base = frag
  } else {
    this.base = this.__pristineFragment__.cloneNode(true)
  }
  reconcile.call(this, this.base.firstChild, addState.bind(this))
  diffNodes.call(this, this.base.firstChild)
}

export {
  genElement,
  addState,
  setState,
  clearState,
  updateContext,
  morpher
}
