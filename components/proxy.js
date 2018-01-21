import copy from './copy'
import genElement from './generateElement'
import { selector } from './utils'
import { updateElem } from './elementUtils'

const updateContext = (key, contextPristine, obj) => {
  let context = copy(contextPristine)
  Object.keys(context.base).map(handlerKey => {
    let tmplBase = context.base[handlerKey].template
    if(tmplBase){
      let hasTmpl = tmplBase.match(`{{${key}}}`)
      if (hasTmpl && hasTmpl.length) {
        Object.assign(context, obj)
      }
    }

    let styleBase = context.base[handlerKey].style
    if (styleBase) {
      Object.keys(styleBase).map(style => {
        let hasStyleAttr = styleBase[style].match(`{{${key}}}`)
        if (hasStyleAttr) Object.assign(context, obj)
      })
    }

    let id = context.base[handlerKey]['keet-id']
      , ele = selector(id)
      , newElem = genElement(context.base[handlerKey], context)
    updateElem(ele, newElem)

  })
}

export default context => {
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      let obj = {}
      obj[key] = value
      updateContext(key, context, obj)
      return target[key] = value
    }
  })
  return watchObject(context)
}