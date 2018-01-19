import proxy from './proxy'
export default (str, context, key, index) => {
  let arrProps = str.match(/{{([^{}]+)}}/g), tmpl = ''
  let proxies = []
  // log(arrProps)
  if (arrProps && arrProps.length) {
    arrProps.forEach(s => {
      let rep = s.replace(/{{([^{}]+)}}/g, '$1')
      if(context[rep] !== undefined){
      	str = str.replace(/{{([^{}]+)}}/, context[rep])
    	  let pr = proxy(context, rep, key, index)
        proxies.push(pr)
      }
    })
  }

  return {
    tmpl: str,
    proxies: proxies
  }
  // log(tmpl)
}