/**
 * @private
 * @description
 * Mount a virtualNode
 *
 * @param {String|Object} virtualNode - the transform code
 */
import uuid from 'uuid/v4'

function styleToStr(obj) {
  let str = ''
  for (let style in obj){
    str = str += `${style}:${obj[style]};`
  }
  return str
}

function render(virtualNode) {
  // console.log(virtualNode)
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode)
  }
  const element = document.createElement(virtualNode.elementName)

  Object.keys(virtualNode.attributes || {}).forEach(attr => {
    // convert style object to string
    if(attr === 'style'){
      element.setAttribute(attr, styleToStr(virtualNode.attributes[attr]))
    // handle inline eventListener
    } else if(attr.match(/^on/) && typeof virtualNode.attributes[attr] === 'function'){
      element.removeAttribute(attr)
      element.addEventListener(attr.replace(/^on/, ''), virtualNode.attributes[attr].bind(this), false)
    // convert React className to class
    } else if(attr === 'className'){
      element.removeAttribute(attr)
      element.setAttribute('class', virtualNode.attributes[attr])
    } else {
      element.setAttribute(attr, virtualNode.attributes[attr])
    }
  });

  (virtualNode.children || []).forEach(child => 
    element.appendChild(render.call(this, child))
  )
  return element
}

function mountJSX() {
  this.base = render.apply(this, arguments)
}

export default mountJSX
