import renderer, { evtStore } from './renderer'
import { pocus, dataMap } from 'hookuspocus/src/core'
import { onStateChanged } from 'hookuspocus/src/on'

const core = []

// prop store
const propStore = new(WeakMap || Map)()

let vtree

onStateChanged(context => {
  // console.log('event')
  const rootContext = dataMap.get(core[0])[0]
  const props = propStore.get(rootContext)
  vtree = pocus([props], rootContext)
  // emit changes to render so patching can be done
  // console.log(vtree.children[0].children)
  renderer.emit('after', vtree)
})

// vtree.children[0].attributes.onClick()
// vtree.children[0].attributes.onClick()

// HORRAY!! pass the context throwough pocus
// so our function can use all hooks features
// from hookuspocus https://github.com/michael-klein/hookuspocus
function genContext(func, props){
  // bind the props to the function which 
  // will retain as context object for
  // subsequent runs
  if(!core.length) core.push(func)
  propStore.set(func, props)
  const node = pocus([props], func)
  return node
}

function walk (node, initial) {

  const { elementName, attributes, children } = node

  if (typeof elementName === 'function') {
    return genContext(elementName, attributes)
  }

  if (children && children.length) {
    const _children = children.map(child => {
      const { elementName, attributes } = child
      if (typeof elementName === 'function') {
        return genContext(elementName, attributes)
      }
      return child
    })

    return {
      elementName,
      attributes,
      children: _children
    }
  }

  return node
}

export default walk
