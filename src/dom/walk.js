import component from '../component'
import { getProto, isNode, isArr, assign, isFunc } from '../utils'

const walk = async (parentVnode, vnode, rootProps) => {

    vnode = getProto(vnode, component) ? await vnode.__composite__ : vnode

    // check type of vnode
    const isVirtualNode = isNode(vnode)

    const _rawVnode = isVirtualNode ? 
        vnode.elementName : 
        vnode

    // handle vnode array
    if (isArr(_rawVnode)) return _rawVnode.map(cv => walk(parentVnode, cv, rootProps))

    // inherits rootProps to all children in the tree, 
    // i.e history/global props/state management api
    const _props = isVirtualNode ? assign({}, vnode.attributes, rootProps) : {}

    // construct vnode if it is constructor
    const _vnode = isFunc(_rawVnode) ? new _rawVnode(_props) : _rawVnode

    // travers children
    const _child = vnode.children || []
    let VCHILDS = []
    let i = 0
    while (i < _child.length ) {
        VCHILDS = VCHILDS.concat(walk(vnode, _child[i], rootProps))
        i++
    }

    const _vChildren = await Promise.all(VCHILDS)

    return {
        // _isMounted: false,
        // _isDirty: false,
        // _guid: vnode.guid,
        _parentVnode: parentVnode || null,
        _rawVnode,
        _type: typeof vnode,
        _props: vnode.attributes || null,
        _vChildren
    }
}

export default walk