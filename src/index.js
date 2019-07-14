
//
// Keetjs v5.0.0 https://github.com/keetjs/keet
// Minimalist view layer for the web
//
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//
// Copyright 2019, Shahrul Nizam Selamat
// Released under the MIT License.
//

import { eventHooks, getProto, assign, isFunc } from './utils'
import mount from './dom/mount'
import diff from './dom/diff'
import patch from './dom/patch'
import createEl from './dom/createEl'
import walk from './dom/walk'
import component from './component'

@eventHooks()
class keetRenderer {

    /**
     * Pick up the virtual node by transform-jsx
     * https://github.com/calebmer/node_modules/tree/master/babel-plugin-transform-jsx
     * Stript version of jsx transform, cavets:-
     *    - No Pragma
     *    - No * @jsx * comments
     *    - No createElement
     *    - No $$typeof, props, key, ref, or other specific React lingo
     *    - Key is still supported although it is optional
     *    - We use useVariable to support component element names
     *    - Well the lacks of error handling messages
     */

    render (virtualNode, node) {

        console.log(virtualNode)

        /**
         * ==================
         * life-cycle staging
         * ==================
         * walk VTree to generate virtual nodes tree
         * do not transform to DOM for any reason during this stage
         * pass properties to each vnode if it is a constructor
         * return as it is if is not a constructor
         * borrow some analogy from https://github.com/Matt-Esch/virtual-dom
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
        const { elementName, attributes } = virtualNode
        let rootProps = assign({}, attributes)
        let rootVnode = new elementName(attributes)

        let VTree

        // console.log(rootVnode)

        // travers vnode tree through a wrapper
        // @params - parentVnode (null by default, since it is a rootVnode)
        // @params - rootVnode
        walk(null, rootVnode, rootProps).then(vtree => {
            // create an initial root DOM node
            VTree = vtree
            console.log(VTree)
            isFunc(rootVnode.componentWillMount) && rootVnode.componentWillMount()
            const rootNode = createEl.call(rootVnode, VTree)
            mount(node, rootNode)
            isFunc(rootVnode.componentDidMount) && rootVnode.componentDidMount()
        })

        // life-cycle prop-hooks event
        this.sub('event-hooks', nextProps => {
            // if root props changing --> do force render
            nextProps && 
                assign(attributes, nextProps) &&
                getProto(rootVnode, component) &&
                rootVnode.forceRender()
            walk(null, rootVnode, rootProps).then(newVtree => {
                // diff the VTree
                const update = diff.call(rootVnode, VTree, newVtree)
                // then patch the rootNode
                patch(node, update)
            })
            // console.log(newVtree)
            // console.log(update)
        })
    }

}

const keet = new keetRenderer()

export default keet