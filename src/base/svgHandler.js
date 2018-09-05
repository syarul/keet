const svgRe = /(<svg)([^<]*|[^>]*)/g

export default function (base) {
  if (typeof base === 'string') {
    let svgList = base.match(svgRe)
    if (svgList && svgList.length) {
      return true
    }
    return false
  }
}
