/**
 * classes handler
 */

export default (el, attr, value) => {
    if (typeof value === 'object') {
        el.setAttribute('class', Object.keys(value)
            .filter(c => value[c])
            .map(c => c)
            .join(' ')
        )
    } else {
        el.setAttribute('class', value)
    }
}