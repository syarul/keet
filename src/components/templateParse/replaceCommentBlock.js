import genModelList from '../genModelList'
import componentParse from '../componentParse'

const re = /{{([^{}]+)}}/g
const model = /^model:/g
const component = /^component:([^{}]+)/g

export default function (value, node) {
  let rep
  let modelRep

  if (value.match(re)) {
    rep = value.replace(re, '$1').trim()
    if (rep.match(model)) {
      modelRep = rep.replace('model:', '')
      genModelList.call(this, node, modelRep)
    } else if (rep.match(component)) {
      componentParse.call(this, rep, node)
    }
  }
}
