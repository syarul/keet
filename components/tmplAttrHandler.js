export default function(...args) {
  let cloneChild = [].shift.call(args)
  Object.keys(cloneChild).map(c => {
    let hdl = cloneChild[c].match(/{{([^{}]+)}}/g)
    if(hdl && hdl.length){
      let str = ''
      hdl.map(s => {
        let rep = s.replace(/{{([^{}]+)}}/g, '$1')
        if (this[rep] !== undefined) {
          if(this[rep] === false){
            delete cloneChild[c]
          } else {
            str += this[rep]
            cloneChild[c] = str
          }
        }
      })
    }
  })
}