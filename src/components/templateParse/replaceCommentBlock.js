import genModelList from '../genModelList'
import componentParse from '../componentParse'
import svgParse from '../svgParse'

const re = /{{([^{}]+)}}/g
const model = /^model:/g
const component = /^component:([^{}]+)/g
const svg = /^svg:([^{}]+)/g

export default function (value, node, reconcile, fromModel, addState) {
  let rep
  let modelRep

  if (value.match(re)) {
    rep = value.replace(re, '$1').trim()
    if (rep.match(model)) {
      modelRep = rep.replace('model:', '')
      genModelList.call(this, node, modelRep, reconcile)
    } else if (rep.match(component)) {
      componentParse.call(this, rep, node)
    } else if (this.IS_SVG && rep.match(svg)) {
      svgParse.call(this, rep, node, fromModel, addState)
    }
  }
}
