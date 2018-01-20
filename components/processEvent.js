import { testEval } from './utils'
import { loopChilds } from './element-utils'

export default (kNode, context, proxies) => {
  // console.log(proxies)
  let listKnodeChild = [], hask, evtName, evthandler, handler, isHandler, argv, i, atts, v, rem = []
  loopChilds(listKnodeChild, kNode)
  listKnodeChild.map(c => {
    if (c.nodeType === 1 && c.hasAttributes()) {
      i = 0
      function next(){
        atts = c.attributes
        if(i < atts.length) {
          hask = /^k-/.test(atts[i].nodeName)
          if(hask){
            evtName = atts[i].nodeName.split('-')[1]
            evthandler = atts[i].nodeValue
            handler = evthandler.split('(')
            isHandler = testEval(context[handler[0]])
            if(typeof isHandler === 'function') {
              rem.push(atts[i].nodeName)
              argv = []
              v = handler[1].slice(0, -1).split(',').filter(f => f != '')
              if(v.length) v.map(v => argv.push(v))
              c.addEventListener(evtName, isHandler.bind.apply(isHandler.bind(proxies[0]), [c].concat(argv)), false)
            }
          }
          i++
          next()
        } else {
          rem.map(f => c.removeAttribute(f))
        }
      }
      next()
    }
  })
  listKnodeChild = []
}