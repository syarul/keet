import component from '../component'
import pureFunction from '../pureFunction'
// import factory from '../propsFactory'
import keetRenderer from '../'
import { getProto, isNode, isArr, assign, isFunc, isObj } from '../utils'


const vtreeFindRef = (vtree, constructor) => {
    const { _vnode, _fn } = vtree
    const { _vChildren } = _vnode || []
    const ref = _fn ? _fn : _vnode
    let is = Object.getPrototypeOf(ref).constructor === constructor
    console.log(ref === constructor, is)
    if(is){
        return ref
    } else {
        return _vChildren.find(vnode => {
            console.log(vnode)
            if(!vnode) return false
            return isObj(vnode._rawVnode) ? vtreeFindRef(vnode._rawVnode, constructor) : false
        })
    }
}

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
    // if(isInitial){
    //     factory.umount()
    //     factory.setProps(attributes)
    // }

    // console.log(factory.getProps())

    const _props = isVirtualNode ? attributes : {}

    // return walked vtree
    if(isObj(_rawVnode) && _rawVnode.hasOwnProperty('_w')){
        // console.log(_rawVnode)
        return _rawVnode
    }

    // handle vnode array
    if (isArr(_rawVnode)) return _rawVnode.map(cv => walk(cv))

    // console.log(_rawVnode, 'do', vnode)

    // travers children
    let _child = vnode.children || []

    // return rendered _rawVnode is a constructor/function
    if(isFunc(_rawVnode)) {
        // console.log('do', vnode)
        let vnodeApp
        // console.log(keetRenderer.__vtree__)
        if(keetRenderer.__vtree__){
            let vtree = vtreeFindRef(keetRenderer.__vtree__, _rawVnode)
            console.log(vtree)
            if(vtree) {
                vnodeApp = vtree._rawVnode
            }
            if(getProto(vnodeApp, component)){
                const { props } = vnodeApp
                vnodeApp.forceRender(assign(props, attributes))
            } else {
                const { _props } = vnodeApp
                vnodeApp
            }
        } else {
            vnodeApp = new _rawVnode(_props)
            // console.log(vnodeApp, _props)
            // KeetComponent constructor
            if(getProto(vnodeApp, component)){
                const { props, state } = vnodeApp
                vnodeApp._vnode = vnodeApp.render(assign(props, attributes), state)
                // console.log(vnodeApp)
            } else {
            // pureFunction constructor
                const { _props } = vnodeApp
                vnodeApp = new pureFunction(assign(_props, attributes), _rawVnode, keetRenderer)
            }
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
        _w: true,
        _rawVnode,
        _type: typeof vnode,
        _props: vnode.attributes || {},
        _vChildren
    }
}

export default walk