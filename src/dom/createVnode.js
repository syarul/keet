import parseAttr from './parseAttr'
/**
 * generate node base on type
 */

const vDom = ({ elementName }) => document.createElement(elementName)

const type = (_case, _vnode, _parentVnode, _indexPosition) => {

    let vnode;

    switch(_case){
        case 'string':
            vnode = document.createTextNode(_vnode)
        case null:
            return
        case 'boolean' && !_vnode:
            return
        case Array.isArray(_vnode):
            vnode = _vnode.map(v => vDom(v))
        default:
            vnode = vDom(_vnode)
    }

    console.log(vnode)

    Object.keys(_vnode.attributes).map(attr => parseAttr.call(_vnode, vnode, attr, _vnode.attributes[attr]))


    const VNODE = {
        _isRender: false,
        _isDirty: false,
        _indexPosition: _indexPosition || 0,
        _parentVnode: _parentVnode || null,
        _rawNode: _vnode,
        _vnode: vnode,
        _children: _vnode._children,
        _isMounted: false
    }

    return VNODE
}


export default virtualNode => type(typeof virtualNode, virtualNode)