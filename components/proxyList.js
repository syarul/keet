import copy from './copy'
import { getId } from './utils'
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
      if (i < len && ele.childNodes[start]) {
        ele.removeChild(ele.childNodes[start])
      }
    }
  } 
  c = start - 1
  for (k = start; k < tempDivChildLen + start; k++) {
    if(ele.childNodes[c])
      insertAfter(tempDiv.childNodes[0], ele.childNodes[c], ele)
    else
      ele.appendChild(tempDiv.childNodes[0])
    c++
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

export default function(list) {
  const self = this
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      let num = parseInt(key)
        , intNum = Number.isInteger(num)
      if(intNum){
        arrProtoUpdate.apply(self, [num, value])
      }
      //ignore TypeError in strict mode
      if(value < 1) value = '0'
      return target[key] = value
    },
    deleteProperty (target, key) {
      arrProtoSplice.apply(self, [parseInt(key), 1])
      //ignore TypeError in strict mode
      let num = parseInt(key)
      return num < 1 ? 'false' : target[key]
    }
  })

  return watchObject(list)
}