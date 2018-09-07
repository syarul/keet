import { minId } from '../../utils'

const svgRe = /(<svg)([^<]*|[^>]*)(.*?)(?=<\/svg>)/g

let svgData = {}

function parseSVG (base) {
  let svgList
  let id
  if (typeof base === 'string') {
    svgList = base.match(svgRe)
    if (svgList && svgList.length) {
      this.IS_SVG = true
      svgList.map(ls => {
        id = minId()
        svgData[id] = ls
        base = base.replace(ls, `<!-- {{svg:${id}}} -->`)
      })
    }
  }
  return base
}

export {
  parseSVG as default,
  svgData
}
