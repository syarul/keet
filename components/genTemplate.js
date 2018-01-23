import processEvent from './processEvent'

export default function(obj) {
  let arrProps = this.base.template.match(/{{([^{}]+)}}/g)
    ,  tmpl
    , tempDiv
  tmpl = this.base.template
  arrProps.map(s => {
    let rep = s.replace(/{{([^{}]+)}}/g, '$1')
    tmpl = tmpl.replace(/{{([^{}]+)}}/, obj[rep])
  })
  tempDiv = document.createElement('div')
  tempDiv.innerHTML = tmpl
  processEvent.call(this, tempDiv)
  return tempDiv.childNodes[0]
}