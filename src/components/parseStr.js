import templateParse from './templateParse/index'
import { setState, addState } from './genElement'
import { getId, assert } from '../../utils'

const DOCUMENT_ELEMENT_TYPE = 1

export default function (stub) {
  templateParse(this, addState, null, null, null, 'initial')
  templateParse(this, addState, null, null, null, 'update')
  templateParse(this, addState, null, null, null, 'event')
  const el = stub || getId(this.el)
  if (el) {
    if (el.nodeType === DOCUMENT_ELEMENT_TYPE) {
      el.setAttribute('data-ignore', '')
    } else {
      assert(this.base.childNodes.length === 1, 'Sub-component should only has a single rootNode.')
      !this.base.firstChild.hasAttribute('data-ignore') && this.base.firstChild.setAttribute('data-ignore', '')
    }
    // listen to state changes
    setState.call(this)
    // mount fragment to DOM
    if (!stub) {
      // l(this.base.cloneNode(true))
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
