import genElement from './genElement'
import { selector } from './utils'
import { updateElem } from './elementUtils'

const updateContext = function(...args) {
  let key = [].shift.call(args)
    , obj = [].shift.call(args)

  Object.keys(this.base).map(handlerKey => {
    let tmplBase = this.base[handlerKey].template
    if(tmplBase){
      let hasTmpl = tmplBase.match(`{{${key}}}`)
      if (hasTmpl && hasTmpl.length) {
        Object.assign(this, obj)
      }
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
      , newElem

    if(this.hasOwnProperty(key)) this[key] = obj[key]

    newElem = genElement.apply(this, [ this.base[handlerKey], ...args ])

    updateElem(ele, newElem)

  })
}

export default function(...args) {
  const self = this
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      let obj = {}
      obj[key] = value
      updateContext.apply(self, [ key, obj, ...args ])
      //ignore TypeError in strict mode
      if(value === false || value === '') value = 'false'
      return target[key] = value
    }
  })
  return watchObject(self)
}