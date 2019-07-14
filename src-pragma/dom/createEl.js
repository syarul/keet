import mount from './mount'
import parseAttr from './attr'
import { isFunc } from '../utils'

const createEl = function(vtree, fragment) {

    fragment = fragment || document.createDocumentFragment()

    const { _type, _rawVnode, _props, _vChildren } = vtree || {}

    let node = null
    if(_type === 'object' && !isFunc(_rawVnode)){
        node = document.createElement(_rawVnode)
        for(let attr in _props) {
            parseAttr.call(this, node, attr, _props[attr])
        }
    } else if(!isFunc(_rawVnode)) {
        node = document.createTextNode(_rawVnode)
    }

    _vChildren.map(vchild => createEl.call(this, vchild, node))
    
    !isFunc(_rawVnode) && mount(fragment, node)

    return fragment

}

export default createEl