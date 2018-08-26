import { clearState } from '../components/genElement'
import { assert } from '../../utils'

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
  let tempDiv
  let frag = document.createDocumentFragment()
  // Before we begin to parse an instance, do a run-down checks
  // to clean up back-tick string which usually has line spacing.
  if (typeof instance === 'string') {
    base = instance.trim().replace(/\s+/g, ' ')
    tempDiv = document.createElement('div')
    tempDiv.innerHTML = base
    // clean up nodes
    let f
    function clear(node){
      while (node) {
        f = node
        node = node.nextSibling
        if(f.nodeType === DOCUMENT_ELEMENT_TYPE) {
          clear(f.firstChild)
        } else if(f.nodeType === DOCUMENT_TEXT_TYPE && f.nodeValue === ' ') {
          f.remove()
        }
      }
    }
    clear(tempDiv.firstChild)
    while (tempDiv.firstChild) {
        frag.appendChild(tempDiv.firstChild)
    }
  // If instance is a html element process as html entities
  } else if (typeof instance === 'object' && instance['nodeType']) {
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

  // cleanup states on mount
  clearState.call(this)
  return this
}
