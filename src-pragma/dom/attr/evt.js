/**
 * pass event listener to node
 */

export default function evt (el, attr, value) {
	// console.log(arguments, this)
    el.removeAttribute(attr)
    el.addEventListener(attr.replace(/^on/, '').toLowerCase(), value.bind(this), false)
}