import { clearState } from '../components/genElement'
import svgHandler from './svgHandler'
import { assert } from '../../utils'
import mountToFragment from './mountToFragment'

const DOCUMENT_FRAGMENT_TYPE = 11
const DOCUMENT_TEXT_TYPE = 3
const DOCUMENT_ELEMENT_TYPE = 1

/**
 * @private
 * @description
 * Mount an instance of string or html elements
 *
 * @param {String|Object} instance - the html/string
 */
export default function (instance) {
  let base
  let frag = document.createDocumentFragment()

  // cleanup states on mount
  clearState.call(this)

  // Before we begin to parse an instance, do a run-down checks
  // to clean up back-tick string which usually has line spacing.
  if (typeof instance === 'string') {
    // cleanup spacing
    base = instance.trim().replace(/\s+/g, ' ')

    // parse svg elements
    base = svgHandler.call(this, base)

    mountToFragment(frag, base)

  // If instance is a html element process as html entities
  } else if (typeof instance === 'object' && instance['nodeType']) {
    // parse svg elements

    if (instance['nodeType'] === DOCUMENT_ELEMENT_TYPE) {
      frag.appendChild(instance)
    } else if (instance['nodeType'] === DOCUMENT_FRAGMENT_TYPE) {
      frag = instance
    } else if (instance['nodeType'] === DOCUMENT_TEXT_TYPE) {
      frag.appendChild(instance)
    } else {
      assert(false, 'Unable to parse instance, unknown type.')
    }
  } else {
    assert(false, 'Parameter is not a string or a html element.')
  }
  // we store the pristine instance in __pristineFragment__
  this.__pristineFragment__ = frag.cloneNode(true)
  this.base = frag

  return this
}
