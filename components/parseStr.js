import genElement from './genElement'
import tmplHandler from './tmplHandler'
import tmplArrayHandler from './tmplArrayHandler'
import processEvent from './processEvent'
import { genId } from './utils'
import proxy from './proxy'

export default function() {
  if (typeof this.base != 'object') throw new Error('instance is not an object')
  let elemArr = []
  if (Array.isArray(this.base.list)) {
    // do array base
    let tpl = tmplArrayHandler.call(this)
    tpl.tmpl.map(ptmpl => {
      let tempDiv = document.createElement('div')
      tempDiv.innerHTML = ptmpl
      processEvent.apply(this, [ tempDiv, tpl.proxyRes ])
      elemArr.push(tempDiv.childNodes[0])
    })

    this.list = tpl.proxyRes

  } else {
    // do object base
    Object.keys(this.base).map(key => {
      let child = this.base[key]
      if (child && typeof child === 'object') {
        let id = genId()
        child['keet-id'] = id
        this.base[key]['keet-id'] = id
        let newElement = genElement.call(this, child)
        elemArr.push(newElement)
      } else {
        let child = this.base[key]
        let tpl = tmplHandler.call(this, child)
        let tempDiv = document.createElement('div')
        tempDiv.innerHTML = tpl
        let proxyRes = proxy.call(this)
        this.__proxy__ = proxyRes
        processEvent.apply(this, [ tempDiv, proxyRes ])
        elemArr.push(tempDiv.childNodes[0])
      }
    })
  }

  return elemArr
}