import { chain, assign, isFunction, isEqualWith } from 'lodash'
import stringHash from 'string-hash'
import { resolveVnode } from '../v'
import { customizer } from '../utils'

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

/**
 * @private
 * @description
 * Convert style object into string
 *
 * @param {Object} style - the style as javascript object
 */
function objAttrToStr (obj) {
  return chain(obj)
    .keys()
    .reduce((a, b) =>
      [a, b].map(attr => `${obj[attr] ? attr : ''}`).join(' ').trim('')
    )
    .value()
}

const switchCase = (sources, defaultSource) => selector => sources[Object.keys(sources)[selector] || defaultSource]

let activeComponents = {}

const componentConstructorRender = async function (child, el, render, index) {

    let Component = child.elementName

    // console.log([Component], index, stringHash(Component.toString()))

    let id = stringHash(Component.toString())

    let component = activeComponents[id] || new Component(child.attributes)

    if (!activeComponents[id]) {
      activeComponents[id] = component
    } else {
      // reassign established component props
      // and do batch update on itself
      // TODO: add dirty checking before batch update
      if(!isEqualWith(component.props, child.attributes), customizer) {
        assign(component.props, child.attributes)
        component.batchUpdate()
      }
    }

    component.__ref__.IS_STUB = true

    // component from constructor class
    if (isFunction(component.setState)) {
      // wait for component virtualNode to render
      const vnode = await resolveVnode(component)

      // console.log(vnode)

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
  objAttrToStr,
  switchCase,
  componentConstructorRender
}