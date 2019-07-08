import createVnode from './createVnode'
import parseAttr from './parseAttr'
import { indent } from './utils'

function attach (node, vnode) {

    node.appendChild(vnode)

}

class VTreeRenderer {

    render (virtualNode, node) {

        const { elementName, attribute, children } = virtualNode || {}

        if (!elementName) throw new Error('Not a virtual node')

        const attrs = parseAttr(attribute = {})

        const _root =

            typeof elementName !== 'function' ?

                createVnode(elementName, attrs, children = []) :

                new elementName()

        let _vnode = typeof elementName !== 'function' ?

                _root :

                null

        _vnode && attach(node, vnode)

        _root.__composite__.then(({ vnode }) => {

            // console.log(vnode)

            indent(node) ?

                attach(node, vnode) :

                null

            if (typeof app.componentWillMount === 'function') app.componentWillMount()

        })

    }

}

const vdom = new VTreeRenderer()

export default vdom