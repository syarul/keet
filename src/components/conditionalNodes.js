import { minId } from '../../utils'

const conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g
const conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g
const DOCUMENT_ELEMENT_TYPE = 1
const DOCUMENT_COMMENT_TYPE = 8
let frag = document.createDocumentFragment()
let cache = {}
let count = 0
export default function (node, conditional, tmplHandler) {
  count++
  let currentNode
  let cNode
  if(!cache[conditional]){
    l(Object.keys(cache).length < count)
    l('init')
    while (node) {
      currentNode = node
      node = node.nextSibling
      if (currentNode.nodeType !== DOCUMENT_ELEMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawEnd)) {
        
        cache[conditional] = cache[conditional] || {}

        // rebuild the pristineNode
        let start = frag.firstChild
        function catchNode(node){
          while(node){
            let cNode = node
            node = node.nextSibling 
            if(cNode && cNode.nodeType === DOCUMENT_ELEMENT_TYPE){
              if(cNode.isEqualNode(start)){
                cNode.remove()
                start = start.nextSibling
              } else {
                catchNode(cNode.firstChild)
              }
            } else if(cNode.isEqualNode(start)){
              cNode.remove()
              start = start.nextSibling
            }
          }
        }
        catchNode(this.__pristineFragment__.firstChild)
        cache[conditional].frag = frag
        cache[conditional].currentNode = currentNode
        node = null
      } else if (currentNode.nodeType !== DOCUMENT_COMMENT_TYPE) {
        frag.appendChild(currentNode)
      }
    }

    // parse fragment for resolving conditional statement in child as well
    tmplHandler(this, null, null, null, cache[conditional].frag.cloneNode(true))
  }
  // let childExist = cache[conditional].nodeList[0]
  // let fetchFrag
  // let el = document.querySelector(`[kdata-id="childExist"]`)
  // if(el){
  //   // only do shallow copy
  //   fetchFrag = cache[conditional].frag.cloneNode()
  //   // if found child we skip rendering
  //   return
  // }
  let fetchFrag = cache[conditional].frag.cloneNode(true)
  let fetchNode = node && node.nextSibling || cache[conditional].currentNode

  if (this[conditional]) {
    tmplHandler(this, null, null, null, fetchFrag)
    // setTimeout(() => 

    fetchNode.parentNode.insertBefore(fetchFrag, fetchNode)
    // )
    // l(fetchNode.parentNode)
  }
}
