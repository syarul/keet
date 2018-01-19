import copy from './copy'
import tag from './tag'

let log = console.log.bind(console)

const getId = id => document.getElementById(id)
// ============== 
const testEval = function(ev) {
  try { return eval(ev) } 
  catch (e) { return false }
}
// ============== 
const loopChilds = function(arr, elem) {
  for (var child = elem.firstChild; child !== null; child = child.nextSibling) {
    arr.push(child)
    if (child.hasChildNodes()) {
      loopChilds(arr, child)
    }
  }
}
var insertAfter = function(newNode, referenceNode, parentNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

var nodeUpdate = function(newNode, oldNode, watcher2) {
  if(!newNode) return false
  var oAttr = newNode.attributes
  var output = {};
  if(oAttr){
    for(var i = oAttr.length - 1; i >= 0; i--) {
       output[oAttr[i].name] = oAttr[i].value
    }
  }
  for (var iAttr in output) {
    if(oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value != output[iAttr]){
      oldNode.setAttribute(iAttr, output[iAttr])
    }
  }
  if(oldNode.textContent  === '' && newNode.textContent){
    oldNode.textContent = newNode.textContent
  }
  if(watcher2 && oldNode.textContent != newNode.textContent){
    oldNode.textContent = newNode.textContent
  }
  if(oldNode.type == 'checkbox' && !oldNode.checked && newNode.checked){
    oldNode.checked = true
  }
  if(oldNode.type == 'checkbox' && oldNode.checked && !newNode.checked){
    oldNode.checked = false
  }
  output = {}
}

var nodeUpdateHTML = function(newNode, oldNode) {
  if(!newNode) return false
  if(newNode.nodeValue !== oldNode.nodeValue)
      oldNode.nodeValue = newNode.nodeValue
}

var updateElem = function(oldElem, newElem, watcher2){
  var oldArr = [], newArr = []
  oldArr.push(oldElem)
  newArr.push(newElem)
  loopChilds(oldArr, oldElem)
  loopChilds(newArr, newElem)
  oldArr.forEach(function(ele, idx, arr) {
    if (ele.nodeType === 1 && ele.hasAttributes()) {
      nodeUpdate(newArr[idx], ele, watcher2)
    } else if (ele.nodeType === 3) {
      nodeUpdateHTML(newArr[idx], ele)
    }
    if(idx === arr.length - 1){
      oldArr.splice(0)
      newArr.splice(0)
    }
  })
}
// ==============
const processEvent = function(kNode, context, proxies) {
  var listKnodeChild = [], hask, evtName, evthandler, handler, isHandler, argv, i, atts, v, rem = []
  loopChilds(listKnodeChild, kNode)
  listKnodeChild.forEach(function(c) {
    if (c.nodeType === 1 && c.hasAttributes()) {
      i = 0
      function next(){
        atts = c.attributes
        if(i < atts.length) {
          hask = /^k-/.test(atts[i].nodeName)
          if(hask){
            evtName = atts[i].nodeName.split('-')[1]
            evthandler = atts[i].nodeValue
            // log(evtName, evthandler)
            handler = evthandler.split('(')
            isHandler = testEval(context[handler[0]])
            // isHandler.bind(context)
            // log(context)
            // log(isHandler, handler[0])
            if(typeof isHandler === 'function') {
              rem.push(atts[i].nodeName)
              argv = []
              v = handler[1].slice(0, -1).split(',').filter(function(f){
                return f != ''
              })
              if(v.length) v.forEach(function(v){ argv.push(v) })
              // log(argv)
              c.addEventListener(evtName, isHandler.bind.apply(isHandler.bind(proxies[0]), [c].concat(argv)), false)

            }
          }
          i++
          next()
        } else {
          rem.map(function(f){ c.removeAttribute(f) })
        }
      }
      next()
    }
  })
  listKnodeChild = []
}
// ==============
const proxy = (context, rep, _key, index) => {
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      // log('set', { key, value })
      let ele = getId(context.el)
      // log(key, value)
      let obj = {}
      obj[key] = value
      Object.assign(context, obj)
      let newElem = genElement(context.base[_key], context, _key)
      // log(_key, context.base[_key], index)
      updateElem(ele.childNodes[index], newElem)
      return target[key] = value
    }
  })

  // const obj = {}
  // obj[rep] = context[rep]

  const wrapper = watchObject(context)

  // setTimeout(() => {
    // wrapper.count = 1234
    // log(wrapper)
  // }, 3000)

  return wrapper

}
// ==============
const tmplHandler = (str, context, key, index) => {
  let arrProps = str.match(/{{([^{}]+)}}/g), tmpl = ''
  let proxies = []
  // log(arrProps)
  if (arrProps && arrProps.length) {
    arrProps.forEach(s => {
      let rep = s.replace(/{{([^{}]+)}}/g, '$1')
      if(context[rep] !== undefined){
      	str = str.replace(/{{([^{}]+)}}/, context[rep])
    	  let pr = proxy(context, rep, key, index)
        proxies.push(pr)
      }
    })
  }

  return {
    tmpl: str,
    proxies: proxies
  }
  // log(tmpl)
}
// ==============
const genElement = (child, context, key, index) => {
  // log(child, context, key)
  let tempDiv = document.createElement('div')
  let cloneChild = copy(child)
  delete cloneChild.template
  delete cloneChild.tag
  delete cloneChild.style

  // clean up object for custom attributes, prepare for event-listener handlers
  for (let attr in cloneChild) {
  	// log('===>',attr, cloneChild[attr])
    if (typeof cloneChild[attr] === 'function') {
      delete cloneChild[attr]
    }
  }

  // process template if has handlebars value
  let tpl = tmplHandler(child.template, context, key, index)

  // log(tpl)

  let s = child.tag ? 
  	tag(child.tag,                //html tag
  		tpl.tmpl ? tpl.tmpl : '',   // nodeValue
  		cloneChild,                 //attributes
  		child.style                 // styles
  	) : child.template            // fallback if non exist, render the template as string
  // log(s)
  tempDiv.innerHTML = s
  if (child.tag === 'input') {
    if (child.checked)
      tempDiv.childNodes[0].checked = true
    else
      tempDiv.childNodes[0].removeAttribute('checked')
  }
  processEvent(tempDiv, context, tpl.proxies)
  return tempDiv.childNodes[0]
}
// ==============
const parseStr = (context, watch) => {
  if(typeof context.base != 'object') throw new Error('instance is not an object')
  let elemArr = []
  if(Array.isArray(context.base.list)){
  	// do array base
  } else {
  	// do object base
    Object.keys(context.base).map((key, index) => {
      let child = context.base[key]
      // child['k-id'] = key
      if (child && typeof child === 'object') {
      	// log(child, key)
        let newElement = genElement(child, context, key, index)
        // log(newElement)
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
// ==============
export default class Keet {
  constructor(context) {
  	this.base = context || {}
  }
  mount(instance) {
    this.base = instance
    return this
  }
  link(id) {
    this.el = id
    this.render()
    return this
  }
  render(){
  	let ele = getId(this.el)
    if(ele) ele.innerHTML = ''

  	let els = parseStr(this, true), i = 0
    while(i < els.length) {
      ele.appendChild(els[i])

      if(i === els.length - 1){
        document.addEventListener('_loaded', window._loaded && typeof window._loaded === 'function' ? window._loaded(ctx.el) : null, false)
      }
      i++
    }
    return this
  }
}