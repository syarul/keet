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

const componentChildRender = function (child, el, render) {
  let Component = child.elementName

  let { guid } = child

  let component = activeComponents[guid] || new Component(child.attributes)

  component.guid = guid

  console.log(Component, guid)

  if (!activeComponents[guid]) {
    activeComponents[guid] = component
  } else {
    assign(component.props, child.attributes)
    component.batchUpdate()
  }

  // component from constructor class
  if (component.__composite__ instanceof Promise) {

    component.__composite__.then(app => {

      // wait for component virtualNode to render
      const { vnode } = app

      // DOM patcher respectively will ignore childNodes
      // vnode.setAttribute('data-ignore', '')

      !vnode.hasAttribute('k-data') && vnode.setAttribute('k-data', guid)

      el.appendChild(vnode)
      // caller to detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

    })
  // component from function
  } else {
    el.appendChild(render.call(this, component))
  }

}

export {
  styleToStr,
  switchCase,
  componentChildRender,
  activeComponents
}