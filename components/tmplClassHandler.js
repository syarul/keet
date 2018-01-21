import proxy from './proxy'

export default (child, context) => {
  if(child.class){
    let c = child.class.match(/{{([^{}]+)}}/g)
    let classStr = ''
    if (c && c.length) {
      c.forEach(s => {
        let rep = s.replace(/{{([^{}]+)}}/g, '$1')
        if (context[rep] !== undefined) {
          context[rep].cstore.map(c => {
            classStr += `${c} `
          })
        }
      })
    }
    return classStr.trim()
  }
}