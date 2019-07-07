import { isFunction } from 'lodash'

let activeComponents = {}

const vTreeChildRenderer = async function(child, walkVTree, guid) {

  const Component = child.elementName

  const { attributes } = child

  guid = guid || child.guid

  const component = activeComponents[guid] || new Component(child.attributes)

  const { props } = component

  if (!activeComponents[guid]) {
    activeComponents[guid] = component
  }

  Object.assign(props, attributes)

  component.batchUpdate(props, component.context)

  // component from constructor class
  if (component.__composite__ instanceof Promise) {

    return component.__composite__.then(app => {
      const { vtree } = app

      // caller to detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

      return vtree

    })
  // component from function
  } else {
    return await walkVTree.call(this, component)
  }
}

export {
  vTreeChildRenderer,
  activeComponents
}