import genElement from './genElement'
import { selector } from './utils'
import { updateElem } from './elementUtils'

const updateContext = function(key, obj) {
  Object.keys(this.base).map(handlerKey => {
    let tmplBase = this.base[handlerKey].template
    if(tmplBase){
      let hasTmpl = tmplBase.match(`{{${key}}}`)
      if (hasTmpl && hasTmpl.length) {
        Object.assign(this, obj)
      }
    } else {
      return false
    }

    let styleBase = this.base[handlerKey].style
    if (styleBase) {
      Object.keys(styleBase).map(style => {
        let hasStyleAttr = styleBase[style].match(`{{${key}}}`)
        if (hasStyleAttr) Object.assign(this, obj)
      })
    }

    let id = this.base[handlerKey]['keet-id']
      , ele = selector(id)
      , newElem = genElement.call(this, this.base[handlerKey])
    updateElem(ele, newElem)

  })
}

export default function() {
  const self = this
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      let obj = {}
      obj[key] = value
      updateContext.apply(self, [ key, obj ])
      return target[key] = value
    }
  })
  return watchObject(self)
}