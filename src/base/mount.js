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

  // Before we begin to parse an instance, do a run-down checks
  // to clean up back-tick string which usually has line spacing.
  if (typeof instance === 'string') {
    // cleanup spacing
    base = instance.trim().replace(/\s+/g, ' ')

    // parse svg elements
    base = svgHandler.call(this, base)

    mountToFragment(frag, base)

  } else {
    assert(false, 'Parameter type is not string/string literals.')
  }

  this.base = frag

  return this
}
