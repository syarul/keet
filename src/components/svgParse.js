import { svgData } from '../base/svgHandler'
import mountToFragment from '../base/mountToFragment'
import genModelTemplate from './genModelTemplate'

const handle = /{{([^{}]+)}}/g

let frag = document.createDocumentFragment()

export default function (svgStr, node, model, addState) {
  let id = svgStr.replace('svg:', '')
  let dataStr = svgData[id]
  let base = genModelTemplate.call(this, dataStr, model, addState)
  if (!base.match(handle)) {
    mountToFragment(frag, base)
    node.parentNode.replaceChild(frag.firstChild, node)
  }
}
