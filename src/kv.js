// import createVnode from './createVnode'
// import parseAttr from './parseAttr'
import { _ident } from './utils'
import createVnode from './dom/createVnode'
import attach from './dom/attach'

class kvRenderer {

    mergeVnode(v) {
        this.VNODE = v
    }

    render (virtualNode, node) {

        const { elementName, attributes } = virtualNode || {}

        if (!elementName) throw new Error('Not a virtual node')

        const _vnode = typeof elementName === 'function' && new elementName(attributes)

        const VNODE = this.VNODE || createVnode(_vnode)

        if(!this.VNODE) {
            mergeVnode(VNODE)
            VNODE._isRender = true
        }

        if(_vnode.children) {
           _vnode.children.map((vchild, index) => {
                attach(
                    vnode, 
                    createVnode(vchild, VNODE, index)
                )
            })
        }

        typeof app.componentWillMount === 'function' && app.componentWillMount()

        if(_ident(node)) {
            attach(node, vnode)

            VNODE.isMounted = true
        }

    }

}

const kv = new kvRenderer()

export default kv