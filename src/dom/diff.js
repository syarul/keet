import parseAttr from './attr'
import checkEquality from './checkEquality'

const diff = function(ov, nv, fragment) {
    fragment = fragment || document.createDocumentFragment()
    let node = document.createElement('ignore-element')

    if(ov._rawVnode !== nv._rawVnode){
        if(nv._type === 'object'){
            node = document.createElement(nv._rawVnode)
        } else {
            node = document.createTextNode(nv._rawVnode)
        }
    } 

    const eq = checkEquality(ov._props, nv._props)
    if(ov._rawVnode === nv._rawVnode && !eq) {
       for(let attr in nv._props) {
            parseAttr.call(this, node, attr, nv._props[attr])
        }
    } else {
        node.nodeType === 1 && node.setAttribute('ignore-attr', '')
    }

    fragment.appendChild(node)

    let count = 0

    let ovChild = ov._vChildren[count]
    let nvChild = nv._vChildren[count]

    while(count < nv._vChildren.length) {
        ovChild = ov._vChildren[count]
        nvChild = nv._vChildren[count]
        diff(ovChild, nvChild, node)
        count++
    }

    return fragment

}

export default diff