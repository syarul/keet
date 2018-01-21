import proxy from './proxy'

export default (str, context, genElement) => {
  let arrProps = str.match(/{{([^{}]+)}}/g)
  if (arrProps && arrProps.length) {
    arrProps.forEach(s => {
      let rep = s.replace(/{{([^{}]+)}}/g, '$1')
      if (context[rep] !== undefined) {
        str = str.replace(/{{([^{}]+)}}/, context[rep])
      }
    })
  }
  let proxyRes = proxy(context)
  return {
    tmpl: str,
    proxyRes: proxyRes
  }
}