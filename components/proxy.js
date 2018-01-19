import { getId } from './utils'
import genElement from './genElement'
import { updateElem } from './element-utils'
export default (context, rep, _key, index) => {
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      let ele = getId(context.el), obj = {}
      obj[key] = value
      Object.assign(context, obj)
      let newElem = genElement(context.base[_key], context, _key)
      updateElem(ele.childNodes[index], newElem)
      return target[key] = value
    }
  })
  return watchObject(context)
}