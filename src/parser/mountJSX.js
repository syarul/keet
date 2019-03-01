/**
 * @private
 * @description
 * Convert style object into string
 *
 * @param {Object} style - the style as javascript object
 */
function styleToStr (obj) {
  let str = ''
  for (let style in obj) {
    str = str += `${style}:${obj[style]};`
  }
  return str
}

/**
 * @private
 * @description
 * Mount a virtualNode
 *
 * @param {String|Object} virtualNode - the transform code
 */
function render (virtualNode) {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode)
  }

  const element = document.createElement(virtualNode.elementName)

  Object.keys(virtualNode.attributes || {}).forEach(attr => {
    // convert style object to string
    if (attr === 'style' && typeof virtualNode.attributes[attr] === 'object') {
      element.setAttribute(attr, styleToStr(virtualNode.attributes[attr]))
    // handle inline eventListener
    } else if (attr.match(/^on/) && typeof virtualNode.attributes[attr] === 'function') {
      element.removeAttribute(attr)
      element.addEventListener(attr.replace(/^on/, ''), virtualNode.attributes[attr].bind(this), false)
    // convert React className to class
    } else if (attr === 'className') {
      element.removeAttribute(attr)
      element.setAttribute('class', virtualNode.attributes[attr])
    // normal attributes
    } else {
      element.setAttribute(attr, virtualNode.attributes[attr])
    }
  });

  (virtualNode.children || []).forEach(child => {
    // child is array of nodes
    if (Array.isArray(child)) {
      child.map(c => element.appendChild(render.call(this, c)))
    // component from class
    } else if (child.elementName && typeof child.elementName === 'function') {
      let Component = child.elementName
      let component = new Component(child.attributes)
      // wait for component virtualNode to render
      if (typeof component.subscribe === 'function') {
        component.subscribe(res => {
          if (res === '__render__') element.appendChild(component.vnode)
        })
      } else {
        element.appendChild(render.call(this, component))
      }

    // component from function
    } else if (child.elementName && typeof child.elementName === 'object') {
      element.appendChild(render.call(this, child.elementName))
    // normal child render
    } else {
      element.appendChild(render.call(this, child))
    }
  })

  return element
}

async function mountJSX () {
  this.vnode = render.apply(this, arguments)
  this.inform('__render__')
}

export default mountJSX
