
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

        let rootNode
        let oldVtree

        if(getProto(vtree, component)){

        	const { _vnode, componentWillMount, componentDidMount } = vtree

        	isFunc(componentWillMount) && componentWillMount()

        	rootNode = createEl.call(vtree, _vnode)

        	mount(node, rootNode)

        	isFunc(componentDidMount) && componentDidMount()

        	oldVtree = _vnode

        } else {

        	const { vnode, _vnode } = vtree
        	const { elementName } = vnode || {}
        	rootNode = createEl.call(elementName, _vnode)

        	mount(node, rootNode)

        	oldVtree = vtree

        }

        // life-cycle prop-hooks event
        this.on('event-hooks', nextProps => {

        	let update
            // if root props changing --> do a force render
            if(getProto(vtree, component)){

	            if(nextProps) {
	            	assign(vtree.props, nextProps) && vtree.forceRender()
	            	return
	            } 

	            update = diff.call(vtree, oldVtree, vtree._vnode)

	            // console.log(update.cloneNode(true))

            } else if(!getProto(vtree, component) && nextProps) {

            	const { vnode } = vtree
            	const { attributes } = vnode || {}
            	assign(attributes, nextProps)
                const newVtree = walk(vnode, {})

                update = diff(oldVtree._vnode, newVtree._vnode)

            }

            // update oldVtree
            oldVtree = vtree._vnode
            patch(node, update)
        })
    }
}

const KeetRenderer = new keetRenderer()

export default KeetRenderer