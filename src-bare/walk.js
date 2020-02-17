function walk(node) {

	const { elementName, attributes, children } = node

	// console.log(vnode)

	if(typeof elementName === 'function') {
		return walk(elementName(attributes))
	}

	if(children && children.length){
		const _children = children.map(child => {
			const { elementName, attributes } = child
			if(typeof elementName === 'function') {
				return walk(elementName(attributes))
			}
			return child
		})

		return {
			elementName,
			attributes,
			children: _children
		}

	}

    return node
}

export default walk