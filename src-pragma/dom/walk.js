import component from '../component'
import pureFunction from '../pureFunction'
import factory from '../propsFactory'
import keetRenderer from '../'
import { getProto, isNode, isArr, assign, isFunc, isObj } from '../utils'

const walk = (vnode, isInitial) => {
    // console.log(vnode)
    // return vnode
    if(!vnode) return null

    const { elementName, attributes, children } = vnode

    // check type of vnode
    const isVirtualNode = isNode(vnode)

    let _rawVnode = isVirtualNode ? elementName : vnode

    // inherits rootProps to all children in the tree, 
    // i.e history/global props/state management api
    if(isInitial){
        factory.setProps(attributes)
    }

    const _props = isVirtualNode ? attributes : {}

    if(isObj(_rawVnode)){
        // console.log(_rawVnode)
        return _rawVnode
    }

    // handle vnode array
    if (isArr(_rawVnode)) return _rawVnode.map(cv => walk(cv))

    // console.log(_rawVnode, 'do', vnode)

    // travers children
    let _child = vnode.children || []

    // return rendered _rawVnode is a contructor/function
    if(isFunc(_rawVnode)) {
        // console.log('do')
        let vnodeApp = new _rawVnode(_props)
        // KeetComponent constructor
        if(getProto(vnodeApp, component)){
            const { props, state } = vnodeApp
            vnodeApp._vnode = vnodeApp.render(assign(props, factory.getProps()), state)
        } else {
        // pureFunction constructor
            vnodeApp = new pureFunction(_rawVnode, keetRenderer)
        }

        return vnodeApp
    }

    // console.log(vnode)

    let _vChildren = []
    let i = 0
    while (i < _child.length ) {
        _vChildren = _vChildren.concat(walk(_child[i]))
        i++
    }

    return {
        // _isMounted: false,
        // _isDirty: false,
        // _guid: vnode.guid,
        // _parentVnode: parentVnode || null,
        // _hooks,
        _rawVnode,
        _type: typeof vnode,
        _props: vnode.attributes || null,
        _vChildren
    }
}

export default walk