const getId = id => document.getElementById(id)
const testEval = ev => {
  try { return eval(ev) } 
  catch (e) { return false }
}
export {
  getId,
  testEval
}