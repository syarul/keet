import copy from './copy'
import tag from './tag'
import tmplHandler from './tmplHandler'
import tmplStylesHandler from './tmplStylesHandler'
import tmplClassHandler from './tmplClassHandler'
import tmplAttrHandler from './tmplAttrHandler'
import processEvent from './processEvent'
import proxy from './proxy'

export default function(...args) {
  let child = [].shift.call(args)
  let tempDiv = document.createElement('div')
  let cloneChild = copy(child)
  delete cloneChild.template
  delete cloneChild.tag
  delete cloneChild.style
  delete cloneChild.class
  // console.log(this)
  // process template if has handlebars value
  let tpl = child.template ? tmplHandler.call(this, child.template) : null
  // process styles if has handlebars value
  let styleTpl = tmplStylesHandler.call(this, child.style)
  // process classes if has handlebars value
  let classTpl = tmplClassHandler.call(this, child)
  if(classTpl) cloneChild.class = classTpl
  //custom attributes handler
  if(args && args.length){
    tmplAttrHandler.apply(this, [ cloneChild, ...args ])
  }

  let s = child.tag ?
    tag(child.tag,              // html tag
      tpl ? tpl : '',           // nodeValue
      cloneChild,               // attributes including classes
      styleTpl                  // styles
    ) : child.template          // fallback if non exist, render the template as string

  tempDiv.innerHTML = s
  if (child.tag === 'input') {
    if (cloneChild.checked)
      tempDiv.childNodes[0].checked = true
    else
      tempDiv.childNodes[0].removeAttribute('checked')
  }

  let proxyRes = proxy.apply(this, [ ...args ])

  this.__proxy__ = proxyRes

  processEvent.apply(this, [ tempDiv, proxyRes ])
  return tempDiv.childNodes[0]
}