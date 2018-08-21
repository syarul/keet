import templateParse from './templateParse/index'
import strInterpreter from './strInterpreter'

const DELAY = 1

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
  if (i < stateList.length) {
    state = stateList[i]
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

let stateList = []

const clearState = () => {
  stateList = []
}

const addState = state => {
  if (stateList.indexOf(state) === -1) { stateList = stateList.concat(state) }
}

const genElement = function () {
  this.base = this.__pristineFragment__.cloneNode(true)
  templateParse(this, addState, null, null, null, 'initial')
  templateParse(this, addState, null, null, null, 'update')
  templateParse(this, null, null, null, null, 'event')
  templateParse(this, null, null, null, null, 'diff')
}

export {
  genElement,
  addState,
  setState,
  clearState,
  updateContext,
  morpher
}
