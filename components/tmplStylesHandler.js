import copy from './copy'

export default function(styles) {
  let copyStyles = copy(styles)
  if (styles) {
    Object.keys(copyStyles).map(style => {
      let arrProps = copyStyles[style].match(/{{([^{}]+)}}/g)
      if (arrProps && arrProps.length) {
        arrProps.map(s => {
          let rep = s.replace(/{{([^{}]+)}}/g, '$1')
          if (this[rep] !== undefined) {
            copyStyles[style] = copyStyles[style].replace(/{{([^{}]+)}}/, this[rep])
          }
        })
      }
    })
  }
  return copyStyles
}