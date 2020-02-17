const createEl = function(vtree, fragment) {

    fragment = fragment || document.createDocumentFragment()

    if(!vtree) return fragment

    const { elementName, attributes, children } = vtree || {}
    
    let node = null
   	
   	if(typeof vtree === 'object') {
        node = document.createElement(elementName)

        Object.keys(attributes).map(attr => {
        	node[attr] = attributes[attr]
        })

   	} else {
        node = document.createTextNode(vtree)
    }

    if(children && children.length) {
		children.map(child => createEl(child, node))
    }

    fragment.appendChild(node)

    return fragment

}

class Renderer {
	render (vtree, rootNode) {

		console.log(vtree)

		const el = createEl(vtree)

		rootNode.appendChild(el)
	}
}

const keetRenderer = new Renderer()

export default keetRenderer