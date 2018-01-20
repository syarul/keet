import genElement from './genElement'
import { genId } from './utils'
export default (context, watch) => {
  if(typeof context.base != 'object') throw new Error('instance is not an object')
  let elemArr = []
  if(Array.isArray(context.base.list)){
  	// do array base
  } else {
  	// do object base
    Object.keys(context.base).map((key, index) => {
      let child = context.base[key]
      if (child && typeof child === 'object') {
        let id = genId()
        child['keet-id'] = id
        context.base[key]['keet-id'] = id
        let newElement = genElement(child, context)
        elemArr.push(newElement)
      } else {
      	// log('key is not object')
        // tempDiv = document.createElement('div')
        // tempDiv.innerHTML = c
        // process_event(tempDiv)
        // elemArr.push(tempDiv.childNodes[0])
      }
    })
  }

  return elemArr
}