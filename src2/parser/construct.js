import stringHash from 'string-hash'
import { resolveVnode } from '../keet'
import { isFunction, isEqualWith, customizer } from '../utils'

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
  return Object.keys(obj).reduce((a, b) =>
      [a, b].map(style => `${camelCase(style, obj)}`).join('')
    )
}

function objAttrToStr (obj) {
  return Object.keys(obj).reduce((a, b) =>
      [a, b].map(attr => `${obj[attr] ? attr : ''}`).join(' ').trim('')
    )
}

let currentState = {}

// function storeState

const switchCase = (sources, defaultSource) => selector => sources[Object.keys(sources)[selector] || defaultSource]


const componentConstructorRender = async function (child, el, render, index) {


    let Component = child.elementName

    console.log(Component.name)

    let component, vnode
    // console.log([Component], index, stringHash(Component.toString()))

    if(render){
      // console.log(Component.name, index)

      let id = stringHash(Component.toString())

      console.log(id)

      // console.log(child.attributes)

      currentState[id] = currentState[id] || {} 

      currentState[id].state = currentState[id].state || {}

      currentState[id].context = currentState[id].context || {}

      console.log(currentState)
      
      component = new Component(child.attributes, currentState[id].state, currentState[id].context)

      // component.__ref__.id = id

      // if (!activeComponents[id]) {
        // activeComponents[id] = component
      // } else {
        // reassign established component props
        // and do batch update on itself
        // TODO: add dirty checking before batch update
        /*if(!isEqualWith(component.props, child.attributes), customizer) {
          console.log(component.props, child.attributes)
          Object.assign(component.props, child.attributes)
          component.batchUpdate()
        }*/
      // }

      component.__ref__.IS_STUB = true

      // component from constructor class
      if (isFunction(component.setState)) {
        // wait for component virtualNode to render
        vnode = await resolveVnode(component)

        // console.log(vnode)

        // DOM patcher respectively will ignore childNodes
        // vnode.setAttribute('data-ignore', '')
        // vnode.id ? component.el = vnode.id : vnode.setAttribute('k-data', component.__ref__.id)
        el.appendChild(vnode)

        // caller to detect changes
        // isFunction(component.onChange) && component.onChange()

      // component from function
      } else {
        el.appendChild(render.call(this, component))
      }
    } else {
      component = new Component(child.attributes)
      vnode = await resolveVnode(component)
      return vnode
    }
  }

export {
  styleToStr,
  objAttrToStr,
  switchCase,
  componentConstructorRender,
  currentState
}