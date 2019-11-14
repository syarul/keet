import mount from './mount'
import parseAttr from './attr'
import { getProto, getShallowProto, isFunc, isArr } from '../utils'
import component from '../component'
import pureFunction from '../pureFunction'

const DOCUMENT_ELEMENT_TYPE = 1

const createEl = function(vtree, fragment) {

    // console.log(vtree, fragment)

    fragment = fragment || document.createDocumentFragment()

    if(!vtree) return fragment

    vtree = (vtree._rawVnode && vtree._rawVnode._vnode) || vtree

    const { _type, _rawVnode, _props, _vChildren } = vtree || {}
    
    let pass = false
    let node = null

    if(getProto(_rawVnode, component)){
        pass = true
    } else if(getShallowProto(_rawVnode, pureFunction)){
        pass = true
    } else {
        if(_type === 'object'){
            node = document.createElement(_rawVnode)
        } else if(_type !== 'object') {
            node = document.createTextNode(_rawVnode)
        } else {
            pass = true
        }
    }

    if (node && node.nodeType === DOCUMENT_ELEMENT_TYPE) {
        for(let attr in _props) {
            parseAttr.call(this, node, attr, _props[attr])
        }
    }

    _vChildren.map(vchild => createEl.call(this, vchild, pass ? fragment : node))

    node && mount(fragment, node)

    return fragment

}

export default createEl