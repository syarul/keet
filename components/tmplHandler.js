export default function(str) {
  let arrProps = str.match(/{{([^{}]+)}}/g)
  if (arrProps && arrProps.length) {
    arrProps.forEach(s => {
      let rep = s.replace(/{{([^{}]+)}}/g, '$1')
      if (this[rep] !== undefined) {
        str = str.replace(/{{([^{}]+)}}/, this[rep])
      }
    })
  }
  return str
}