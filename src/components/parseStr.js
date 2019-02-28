// import reconcile from './templateParse/reconcile'
import { getId, assert } from '../../utils'

const DOCUMENT_ELEMENT_TYPE = 1

export default function (stub) {
  // reconcile.call(this, this.base.firstChild)
  const el = stub || getId(this.el)
  if (el) {
    if (el.nodeType === DOCUMENT_ELEMENT_TYPE) {
      el.setAttribute('data-ignore', '')
    } else {
      assert(this.base.childNodes.length === 1, 'Sub-component should only has a single rootNode.')
      !this.base.firstChild.hasAttribute('data-ignore') && this.base.firstChild.setAttribute('data-ignore', '')
    }
    // mount fragment to DOM
    if (!stub) {
      el.appendChild(this.base)
    }

    // since component already rendered, trigger its life-cycle method
    if (this.componentDidMount && typeof this.componentDidMount === 'function') {
      this.componentDidMount()
    }
  } else {
    assert(false, 'No element id: "' + this.el + '" exist or is this a child component?')
  }
}
