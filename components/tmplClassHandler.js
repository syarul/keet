export default function(child) {
  if(child.class){
    let c = child.class.match(/{{([^{}]+)}}/g)
    let classStr = ''
    if (c && c.length) {
      c.forEach(s => {
        let rep = s.replace(/{{([^{}]+)}}/g, '$1')
        if (this[rep] !== undefined) {
          this[rep].cstore.map(c => {
            classStr += `${c} `
          })
        }
      })
    }
    return classStr.length ? classStr.trim() : child.class
  }
  return false
}