// import createVnode from './createVnode'
// import parseAttr from './parseAttr'
import { _ident } from './utils'
import createVnode from './dom/createVnode'
import attach from './dom/attach'

class kvRenderer {

    render (virtualNode, node) {

        const { elementName, attributes } = virtualNode || {}

        if (!elementName) throw new Error('Not a virtual node')

        const _vnode = typeof elementName === 'function' && new elementName(attributes)

        const vnode = createVnode(_vnode)

        if(_vnode.children) {
            console.log(_vnode.children)
           _vnode.children.map(vchild => {
                console.log(arguments)
                attach(
                    vnode, 
                    createVnode(vchild)
                )
            })
        }

        typeof app.componentWillMount === 'function' && app.componentWillMount()

        _ident(node) && attach(node, vnode)

    }

}

const kv = new kvRenderer()

export default kv