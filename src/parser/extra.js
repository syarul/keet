import { chain, assign, isFunction } from 'lodash'

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

let activeComponents = {}

const vTreeChildRenderer = async function(child, walkVTree, guid, isArray) {

  const Component = child.elementName

  const { attributes } = child

  guid = guid || child.guid

  let component

  if(isArray){
    component = new Component(child.attributes)
  } else {
    component = activeComponents[guid] || new Component(child.attributes)
    
    if (!activeComponents[guid]) {
      activeComponents[guid] = component
    }
  }


  // console.log(child, component, attributes)

  // component from constructor class
  if (component.__composite__ instanceof Promise) {
    
    const { props } = component

    Object.assign(props, attributes)

    component.batchUpdate(props, component.context)

    return component.__composite__.then(app => {
      const { vnode } = app

      // caller to detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

      return vnode

    })
  // component from function
  } else {
    return await walkVTree.call(this, component)
  }
}

export {
  styleToStr,
  vTreeChildRenderer,
  activeComponents
}