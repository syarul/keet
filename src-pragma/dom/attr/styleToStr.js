const camelCase = (s, o) => `${s.replace(/([A-Z]+)/g, '-$1').toLowerCase()}:${o[s]};`
/**
 * @private
 * @description
 * Convert style object into string
 *
 * @param {Object} style - the style as javascript object
 */
const styleToStr = obj => {
	let style = ''
	for (let attr in obj) {
		style += camelCase(attr, obj)
	}
	return style
}

export default styleToStr