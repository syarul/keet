// import createVnode from './createVnode'
// import parseAttr from './parseAttr'
import { _ident } from './utils'
import createVnode from './dom/createVnode'
import mount from './dom/mount'

const walk =  () => {}

const diff = () => {}

const createElement =  () => {}

class kvRenderer {

    mergeVnode(v) {
        this.VNODE = v
    }

    render (virtualNode, node) {

        // const { elementName, attributes } = virtualNode || {}

        // if (!elementName) throw new Error('Not a virtual node')

        // const _vnode = typeof elementName === 'function' && new elementName(attributes)

        // const VNODE = this.VNODE || createVnode(_vnode)

        // if(!this.VNODE) {
        //     mergeVnode(VNODE)
        //     VNODE._isRender = true
        // }

        // if(_vnode.children) {
        //    _vnode.children.map((vchild, index) => {
        //         attach(
        //             vnode, 
        //             createVnode(vchild, VNODE, index)
        //         )
        //     })
        // }

        // typeof app.componentWillMount === 'function' && app.componentWillMount()

        // if(_ident(node)) {
        //     attach(node, vnode)

        //     VNODE.isMounted = true
        // }

        /**
         * ==================
         * life-cycle staging
         * ==================
         * walk VTree to generate virtual nodes tree
         * do not transform to DOM for any reason during this stage
         * pass properties to each vnode if it is a constructor
         * return as it if is not
         * borrow some analogy from Matt-Esch/virtual-dom
         */

         // on rare case
        if(!virtualNode.hasOwnProperty('elementName')) {
            throw new Error('Paramater is not a transform JSX element')
        } else if(virtualNode.hasOwnProperty('elementName') &&
            typeof virtualNode.elementName !== 'function' ) {
            throw new Error('Attribute "elementName" is not a constructor')
        }

        // get the first mounted JSX Element from transform-jsx
        // assume it is as constructor
        const { elementName, attributes, children } = virtualNode
        const rootVnode = new elementName(attributes)

        // travers vnode tree through a wrapper
        // @params - parentVnode (null by default, since it is a rootVnode)
        // @params - rootVnode
        // @params - children of the Vnode
        const VTree = walk(null, rootVnode, children)

        // create an initial root DOM node
        const rootNode = createEl(VTree)

        mount(node, rootNode)

        // life-cycle update: diff the Vtree with the real DOM
        // ---> changes trigger i.e setState/ props value change
        // TODO: crete a listener for this event
        // const newVtree = walk(null, rootVnode, children)
        // const update = diff(Vtree, newVtree)
        // patch(node, update)
    }

}

const kv = new kvRenderer()

export default kv