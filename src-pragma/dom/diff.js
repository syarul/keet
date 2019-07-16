import parseAttr from './attr'
import checkEquality from './checkEquality'

const diff = function(ov, nv, fragment, markUnignore) {
    fragment = fragment || document.createDocumentFragment()
    markUnignore = markUnignore || false
    let node = document.createElement('ignore-element')

    if(!ov && !nv) {
        return fragment
    }

    if(ov._rawVnode !== nv._rawVnode || markUnignore){
        if(nv._type === 'object'){
            node = document.createElement(nv._rawVnode)
        } else {
            node = document.createTextNode(nv._rawVnode)
        }
    } 

    const eq = checkEquality(ov._props, nv._props)

    if(ov._rawVnode === nv._rawVnode && !eq) {

        if(nv._props && nv._props.hasOwnProperty('key')){
            node = document.createElement(nv._rawVnode)
            markUnignore = true
        }

        for(let attr in nv._props) {
            parseAttr.call(this, node, attr, nv._props[attr])
        }
    } else if (markUnignore){
        for(let attr in nv._props) {
            parseAttr.call(this, node, attr, nv._props[attr])
        }
    } else {
        node.nodeType === 1 && node.setAttribute('ignore-attr', '')
    }

    fragment.appendChild(node)

    let indices = 0

    let ovChild = ov._vChildren[indices]
    let nvChild = nv._vChildren[indices]

    while(indices < nv._vChildren.length) {
        ovChild = ov._vChildren[indices]
        nvChild = nv._vChildren[indices]
        diff(ovChild, nvChild, node, markUnignore)
        indices++
    }

    return fragment

}

export default diff