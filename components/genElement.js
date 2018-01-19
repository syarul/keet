import copy from './copy'
import tag from './tag'
import tmplHandler from './tmplHandler'
import processEvent from './processEvent'
export default (child, context, key, index) => {
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