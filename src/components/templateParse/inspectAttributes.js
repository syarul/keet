import replaceHandleBars from './replaceHandleBars'

const re = /{{([^{}]+)}}/g

function inspectAttributes (node, addState, model) {
  let nodeAttributes = node.attributes
  let i = 0
  let a
  let ns
  let name

  for (i = nodeAttributes.length; i--;) {
    a = nodeAttributes[i]
    name = a.localName
    ns = a.nodeValue
    if (re.test(name)) {
      node.removeAttribute(name)
      name = replaceHandleBars.call(this, name, node, addState, true, model)
      if(model) l(name)
      node.setAttribute(name, ns)
    } else if (re.test(ns)) {
      ns = replaceHandleBars.call(this, ns, node, addState, true, model)
      if (name === 'checked') {
        if (ns === '') {
          node.checked = false
        } else {
          node.checked = true
        }
        node.removeAttribute(name)
      } else {
        if (ns === '') {
          node.setAttribute(name, '')
        } else {
          node.setAttribute(name, ns)
        }
      }
    }
  }
}

export default inspectAttributes
