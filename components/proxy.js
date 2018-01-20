import { getId } from './utils'
import genElement from './genElement'
import { updateElem } from './element-utils'

export default (context, rep, _key, index) => {
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      // console.log('set', { key, value })
      let ele = getId(context.el)
      console.log(key, value)
      let obj = {}
      obj[key] = value
      Object.assign(context, obj)
      console.log(context, _key)
      let newElem = genElement(context.base[_key], context, _key)
      // log(_key, context.base[_key], index)
      updateElem(ele.childNodes[index], newElem)
      return target[key] = value
    }
  })
  return watchObject(context)
}