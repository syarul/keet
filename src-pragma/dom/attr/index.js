/**
 * case related attributes
*/

import evt from './evt'
import classes from './classes'
import styleToStr from './styleToStr'

export default function parseAttr(el, attr, value) {
    // console.log(arguments, this)
    if (typeof value === 'function' && attr.match(/^on/))
        return evt.apply(this, arguments)
    else if (attr === 'className' || attr === 'class')
        return classes.apply(this, arguments)
    else if (attr === 'style' && typeof value === 'object')
        return el.setAttribute(attr, styleToStr(value))
    else if (typeof value === 'boolean')
        return value && el.setAttribute(attr, '')
    else
        return el.setAttribute(attr, value)
    
}