import component from '../component'
import { wrapFunction, getProto, isNode, isArr, assign, isFunc, isObj } from '../utils'

import renderer from '../'

// console.log(renderer)

// global props store
let rootProps = {}

const updateGlobalProps = nextProps => assign(rootProps, nextProps)

const walk = (vnode, isInitial) => {
    // console.log(vnode)
    // return vnode
    if(!vnode) return null

    // check type of vnode
    const isVirtualNode = isNode(vnode)

    let _rawVnode = isVirtualNode ? 
        vnode.elementName : 
        vnode

    // handle vnode array
    if (isArr(_rawVnode)) return _rawVnode.map(cv => walk(cv, isInitial))

    // inherits rootProps to all children in the tree, 
    // i.e history/global props/state management api
    const _props = isVirtualNode ? assign({}, vnode.attributes, rootProps) : {}

    if(isInitial) {
        rootProps = _props
        isInitial = false
    }

    if(isObj(_rawVnode)){
        return _rawVnode
    }

    // let _hooks = null

    // console.log(rootProps, 'do', isInitial)

    // travers children
    let _child = vnode.children || []

    // return rendered _rawVnode is a contructor/function
    if(isFunc(_rawVnode)) {
        const vnodeApp = new _rawVnode(_props)
        // KeetComponent constructor
        if(getProto(vnodeApp, component)){
            const { props, state } = vnodeApp
            _rawVnode = vnodeApp
            _child = _child.concat(_rawVnode.render(assign(props, rootProps), state))
        } else {
        // wrapFunction constructor
            console.log(rootProps)
            _rawVnode = new wrapFunction(_rawVnode, rootProps, renderer)
            // console.log(_rawVnode)
            _child = _child.concat(_rawVnode.render())
        }
    }

    // console.log(_rawVnode)

    let _vChildren = []
    let i = 0
    while (i < _child.length ) {
        _vChildren = _vChildren.concat(walk(_child[i], isInitial))
        i++
    }

    const output = {
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

    // hooks && eventHooks(output)

    // console.log(hooks, output)

    return output
}

export {
    walk as default,
    updateGlobalProps
}