import proxy from './proxy'
import copy from './copy'

export default (styles, context) => {
  let copyStyles = copy(styles)
  if (styles) {
    Object.keys(copyStyles).map(style => {
      let arrProps = copyStyles[style].match(/{{([^{}]+)}}/g)
      if (arrProps && arrProps.length) {
        arrProps.map(s => {
          let rep = s.replace(/{{([^{}]+)}}/g, '$1')
          if (context[rep] !== undefined) {
            copyStyles[style] = copyStyles[style].replace(/{{([^{}]+)}}/, context[rep])
          }
        })
      }
    })
  }
  return copyStyles
}