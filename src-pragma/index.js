
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

    render (vtree, node) {

        console.log(vtree)

        let oldVtree

        const { _rawVnode = {} } = vtree

        const { componentWillMount, componentDidMount } = _rawVnode

        isFunc(_rawVnode) && isFunc(componentWillMount) && componentWillMount()

        const rootNode = createEl.call(_rawVnode, vtree)

        console.log(rootNode)

        isFunc(_rawVnode) && isFunc(componentDidMount) && componentDidMount()

        mount(node, rootNode)

        oldVtree = assign({}, vtree)

        // life-cycle prop-hooks event
        this.on('event-hooks', (nextProps, vNode) => {
            console.log(vtree)

            const { _rawVnode, _props, _vChildren } = vtree

        	let update
            // if root props changing --> do a force render
            if(getProto(_rawVnode, component)){
                console.log(1)
	            if(nextProps) {
	            	assign(_props, nextProps)// && vtree.forceRender()
                    console.log(vtree)
	            	return
	            }

                if(vNode){
                    _vChildren.splice(0,1, vNode)
                } 

                console.log(_vChildren[0], vNode)

	            update = diff.call(_rawVnode, _vChildren[0], vNode)

	            console.log(update.cloneNode(true))

            } else {

                assign(_props, nextProps)
                console.log(vtree)
                const newVtree = walk()
            // 	assign(attributes, nextProps)
            //     const newVtree = walk(vnode, {})

            //     update = diff(oldVtree._vnode, newVtree._vnode)

            }

            // update oldVtree
            oldVtree = vtree._vnode
            patch(node, update)
        })
    }
}

const KeetRenderer = new keetRenderer()

export default KeetRenderer