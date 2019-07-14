import mount from './mount'
import parseAttr from './attr'

const createEl = function(vtree, fragment) {

    fragment = fragment || document.createDocumentFragment()

    const { _type, _rawVnode, _props, _vChildren } = vtree || {}

    let node = null
    if(_type === 'object'){
        node = document.createElement(_rawVnode)
        for(let attr in _props) {
            parseAttr.call(this, node, attr, _props[attr])
        }
    } else {
        node = document.createTextNode(_rawVnode)
    }

    _vChildren.map(vchild => createEl.call(this, vchild, node))
    
    mount(fragment, node)

    return fragment

}

export default createEl