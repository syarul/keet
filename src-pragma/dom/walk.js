import component from '../component'
import { getProto, isNode, isArr, assign, isFunc, isObj } from '../utils'

const walk = (vnode, rootProps) => {
    // console.log(vnode)
    if(!vnode) return null

    // check type of vnode
    const isVirtualNode = isNode(vnode)

    const _rawVnode = isVirtualNode ? 
        vnode.elementName : 
        vnode
    // console.log(_rawVnode)
    // handle vnode array
    if (isArr(_rawVnode)) return _rawVnode.map(cv => walk(cv, rootProps))

    // inherits rootProps to all children in the tree, 
    // i.e history/global props/state management api
    const _props = isVirtualNode ? assign({}, vnode.attributes, rootProps) : {}

    if(isObj(_rawVnode)){
        return _rawVnode
    }

    // return rendered _rawVnode is a contructor/function
    if(isFunc(_rawVnode)) {
        const vnodeApp = new _rawVnode(_props)
        console.log(vnodeApp)
        // only execute it if KeetComponent constructor
        if(getProto(vnodeApp, component)){
            const { props, state } = vnodeApp
            vnodeApp._vnode = vnodeApp.render(props, state)
            return vnodeApp
        } else {
            return {
                vnode,
                _vnode: vnodeApp
            }
        }
    }

    // travers children
    const _child = vnode.children || []
    let _vChildren = []

    let i = 0
    while (i < _child.length ) {
        _vChildren = _vChildren.concat(walk(_child[i], rootProps))
        i++
    }

    return {
        // _isMounted: false,
        // _isDirty: false,
        // _guid: vnode.guid,
        // _parentVnode: parentVnode || null,
        _rawVnode,
        _type: typeof vnode,
        _props: vnode.attributes || null,
        _vChildren
    }
}

export default walk