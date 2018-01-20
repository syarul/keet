const getId = id => document.getElementById(id)

const testEval = ev => {
  try { return eval(ev) } 
  catch (e) { return false }
}
const genId = () => (Math.round(Math.random()*0x1*1e12)).toString(32)

const selector = id => document.querySelector(`[keet-id="${id}"]`)

export {
  getId,
  testEval,
  genId
}