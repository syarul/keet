import keetRenderer from './renderer'
import { pocus, dataMap } from 'hookuspocus/src/core'
import { onStateChanged } from 'hookuspocus/src/on'

const core = []

onStateChanged(context => {
  // console.log(dataMap.get(context))
  // console.log(context === dataMap.get(core[0])[0])
  // console.log(pocus(context))
  const vtree = pocus(dataMap.get(core[0])[0])
  // const vtree = pocus(context)
  // emit changes to render so patching can be done
  keetRenderer.emit.call(keetRenderer, 'after', walk(vtree))
})

// HORRAY!! pass the context through pocus
// so our function can use all hooks features
// from hookuspocus https://github.com/michael-klein/hookuspocus
function genContext(func, props, initial){
  // bind the props to the function which 
  // will retain as context object for
  // subsequent runs
  const context = func.bind(null, props)
  if(!core.length) core.push(context)
  const out = pocus(context)
  // run dom logics
  return out
}

function walk (node, initial) {

  const { elementName, attributes, children } = node

  if (typeof elementName === 'function') {
    return genContext(elementName, attributes, initial)
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
