export default argv => {
  const cop = v => {
    let o = {}
    if(typeof v !== 'object'){
      o.copy = v
      return o.copy
    } else {
      for(let attr in v){
        o[attr] = v[attr]
      }
    }
    return o
  }
  return Array.isArray(argv) ? argv.map(v => v) : cop(argv)
}