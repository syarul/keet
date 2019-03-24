import stringHash from 'string-hash'
import { resolveVnode } from '../keet'
import { isFunction, isEqualWith, customizer } from '../utils'
import auto from '../base/auto'

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

let store = {}

// function storeState

const switchCase = (sources, defaultSource) => selector => sources[Object.keys(sources)[selector] || defaultSource]


const componentConstructorRender = async function (child, el, render, index, ref) {


    let Component = child.elementName

    // console.log(child)

    let component, vnode
    // console.log([Component], index, stringHash(Component.toString()))

    if(render){
      // console.log(Component.name, index)

      // let id = stringHash(Component.toString())

      // if( store[id]) {
      //   component = store[id]
      //   Object.assign(component.props, child.attributes)


      //   await auto.call(component)
      //   vnode = component.vnode
      // } else {
        component = new Component(child.attributes)
        // store[id] = component

        vnode = await resolveVnode(component)
      // }

      // console.log(vnode)
      // console.log(component)

      el.appendChild(vnode)

      // console.log(store)

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

      // component.__ref__.IS_STUB = true

      // component from constructor class
      if (isFunction(component.setState)) {
        // wait for component virtualNode to render
        // vnode = await resolveVnode(component)

         // console.log(Component.name)

        // console.log(vnode)

        // DOM patcher respectively will ignore childNodes
        // vnode.setAttribute('data-ignore', '')
        // vnode.id ? component.el = vnode.id : vnode.setAttribute('k-data', component.__ref__.id)
        // el.appendChild(vnode)

        // caller to detect changes
        // isFunction(component.onChange) && component.onChange()

      // component from function
      } else {
        el.appendChild(render.call(this, component))
      }
    } else {
      component = new Component(child.attributes)
      vnode = await resolveVnode(component)
      return { component, vnode }
    }
  }

export {
  styleToStr,
  objAttrToStr,
  switchCase,
  componentConstructorRender,
  // currentState
}