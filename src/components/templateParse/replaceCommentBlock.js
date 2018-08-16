import genModelList from '../genModelList'
import conditionalNodes from '../conditionalNodes'
import updateState from './updateState'
import componentParse from '../componentParse'

const re = /{{([^{}]+)}}/g
const model = /^model:/g
const conditionalRe = /^\?/g
const component = /^component:([^{}]+)/g

export default function (value, node, ins, updateStateList, templateParse, setup) {
  let conditionalRep
  let rep
  let modelRep
  if (value.match(re)) {
    rep = value.replace(re, '$1').trim()
    if (rep.match(model)) {
      modelRep = rep.replace('model:', '')
      genModelList.call(this, node, modelRep, templateParse)
    } else if (rep.match(conditionalRe)) {
      conditionalRep = rep.replace('?', '')
      if (ins[conditionalRep] !== undefined) {
        updateState(conditionalRep, updateStateList)
        conditionalNodes.call(this, node, conditionalRep, templateParse, setup)
      }
    } else if (rep.match(component)) {
      componentParse.call(this, rep, node)
    }
  }
}
