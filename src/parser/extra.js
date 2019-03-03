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

const componentChildRender = async function (child, el, render) {
    let Component = child.elementName

    let component = activeComponents[Component.name] || new Component(child.attributes)

    if (!activeComponents[Component.name]) {
      activeComponents[Component.name] = component
    } else {
      assign(component.props, child.attributes)
      component.batchUpdate()
    }

    component.__ref__.IS_STUB = true

    // component from constructor class
    if (isFunction(component.setData)) {
      // wait for component virtualNode to render
      const vnode = await resolveVnode(component)

      // DOM patcher respectively will ignore childNodes
      vnode.setAttribute('data-ignore', '')

      vnode.id ? component.el = vnode.id : vnode.setAttribute('k-data', component.__ref__.id)

      el.appendChild(vnode)
      // caller to detect changes
      isFunction(component.onChange) && component.onChange()

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