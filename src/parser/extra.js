import { assign, isFunction } from 'lodash'

let activeComponents = {}

const vTreeChildRenderer = async function(child, vTreeRenderer) {

  let Component = child.elementName

  const { guid } = child

  let component = activeComponents[guid] || new Component(child.attributes)

  if (!activeComponents[guid]) {
    activeComponents[guid] = component
  } else {
    assign(component.props, child.attributes)
    component.batchUpdate()
  }

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
    return await vTreeRenderer.call(this, component)
  }
}

export {
  vTreeChildRenderer
}