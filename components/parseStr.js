import genElement from './generateElement'
import tmplHandler from './tmplHandler'
import tmplArrayHandler from './tmplArrayHandler'
import processEvent from './processEvent'
import { genId } from './utils'

export default context => {
  if (typeof context.base != 'object') throw new Error('instance is not an object')
  let elemArr = []
  if (Array.isArray(context.base.list)) {
    // do array base
    let tpl = tmplArrayHandler.call(context)
    tpl.tmpl.map(ptmpl => {
      let tempDiv = document.createElement('div')
      tempDiv.innerHTML = ptmpl
      processEvent(tempDiv, context, tpl.proxyRes)
      elemArr.push(tempDiv.childNodes[0])
    })

    context.list = tpl.proxyRes

  } else {
    // do object base
    Object.keys(context.base).map(key => {
      let child = context.base[key]
      if (child && typeof child === 'object') {
        let id = genId()
        child['keet-id'] = id
        context.base[key]['keet-id'] = id
        let newElement = genElement(child, context)
        elemArr.push(newElement)
      } else {
        let child = context.base[key]
        let tpl = tmplHandler(child, context)
        let tempDiv = document.createElement('div')
        tempDiv.innerHTML = tpl.tmpl
        processEvent(tempDiv, context, tpl.proxyRes)
        elemArr.push(tempDiv.childNodes[0])
      }
    })
  }

  return elemArr
}