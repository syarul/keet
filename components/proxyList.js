import genElement from './generateElement'
import copy from './copy'
import { getId, selector } from './utils'
import { updateElem, insertAfter } from './elementUtils'
import genTemplate from './genTemplate'

const arrProtoSplice = function(...argv){
  let ele = getId(this.el)
    , childLen
    , len
    , i
    , j
    , k
    , c
    , tempDivChildLen
    , tempDiv
    , start = [].shift.call(argv)
    , count = [].shift.call(argv)
  tempDiv = document.createElement('div')
  if(argv.length){
    i = 0
    while(i < argv.length){
      tempDiv.appendChild(genTemplate.call(this, argv[i]))
      i++
    }
  }
  childLen = copy(ele.childNodes.length)
  tempDivChildLen = copy(tempDiv.childNodes.length)
  if (count && count > 0) {
    for (i = start; i < childLen + 1; i++) {
      len = start + count
      if (i < len) {
        ele.removeChild(ele.childNodes[start])
        if (i === len - 1 && tempDivChildLen > 0) {
          c = start - 1
          for (j = start; j < tempDivChildLen + start; j++) {
            insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
            c++
          }
        }
      }
    }
  } else if (argv.length) {
    c = start - 1
    for (k = start; k < tempDivChildLen + start; k++) {
      insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
      c++
    }
  }
}

const arrProtoUpdate = function(index, value) {
  let ele = getId(this.el)
  if(!ele.childNodes[index]){
    arrProtoSplice.apply(this, [index, 0, value])
  } else {
    updateElem(ele.childNodes[index], genTemplate.call(this, value))
  }
}

export default (list, context) => {
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      let num = parseInt(key)
      if(Number.isInteger(num)){
        arrProtoUpdate.apply(context, [num, value])
      }
      return target[key] = value
    },
    deleteProperty (target, key, value) {
      let num = parseInt(key)
      if(Number.isInteger(num)){
        arrProtoSplice.apply(context, [num, 1])
      }
      return target[key]
    }
  })

  return watchObject(list)
}