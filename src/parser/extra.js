import { chain, assign, isFunction } from 'lodash'
import { resolveVnode } from '../v'

function camelCase (s, o) {
  return `${s.replace(/([A-Z]+)/g, '-$1').toLowerCase()}:${o[s]};`
}
/**
 * @private
 * @description
 * Convert style object into string
 *
 * @param {Object} style - the style as javascript object
 */
function styleToStr (obj) {
  return chain(obj)
    .keys()
    .reduce((a, b) =>
      [a, b].map(style => `${camelCase(style, obj)}`).join('')
    )
    .value()
}

const switchCase = (sources, defaultSource) => selector => sources[Object.keys(sources)[selector] || defaultSource]

let activeComponents = {}

const componentChildRender = async function (child, el, render, guid) {
    let Component = child.elementName

    let component = activeComponents[guid] || new Component(child.attributes)

    component.guid = guid

    if (!activeComponents[guid]) {
      activeComponents[guid] = component
    } else {
      assign(component.props, child.attributes)
      component.batchUpdate()
    }

    // component from constructor class
    if (isFunction(component.setState)) {

      // wait for component virtualNode to render
      const vnode = await resolveVnode(component)

      // DOM patcher respectively will ignore childNodes
      // vnode.setAttribute('data-ignore', '')

      !vnode.hasAttribute('k-data') && vnode.setAttribute('k-data', guid)

      el.appendChild(vnode)
      // caller to detect changes
      isFunction(component.componentWillMount) && component.componentWillMount()

    // component from function
    } else {
      el.appendChild(render.call(this, component))
    }
  }

export {
  styleToStr,
  switchCase,
  componentChildRender
}