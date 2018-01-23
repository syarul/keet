import proxy from './proxyList'

export default function() {
  let str = this.base.template
    , list = this.base.list
    , arrProps = str.match(/{{([^{}]+)}}/g), tmpl
    , strList = []
  if (arrProps && arrProps.length) {
    list.map(r => {
      tmpl = str
      arrProps.forEach(s => {
        let rep = s.replace(/{{([^{}]+)}}/g, '$1')
        tmpl = tmpl.replace(/{{([^{}]+)}}/, r[rep])
      })
      strList.push(tmpl)
    })
  }

  let proxyRes = proxy.call(this, list)

  return {
    tmpl: strList,
    proxyRes: proxyRes
  }
}