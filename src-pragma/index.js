
//
// Keetjs v5.0.0 https://github.com/keetjs/keet
// Minimalist view layer for the web
//
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//
// Copyright 2019, Shahrul Nizam Selamat
// Released under the MIT License.
//

import { eventHooks, getProto, getShallowProto, assign, isFunc, wrapFunction } from './utils'
import mount from './dom/mount'
import diff from './dom/diff'
import patch from './dom/patch'
import createEl from './dom/createEl'
import walk, { updateGlobalProps } from './dom/walk'
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

        // console.log(rootNode)

        isFunc(_rawVnode) && isFunc(componentDidMount) && componentDidMount()

        mount(node, rootNode)

        oldVtree = vtree

        // life-cycle prop-hooks event
        this.on('event-hooks', nextProps => {
            console.log('event-hooks')

            const { _rawVnode } = vtree

        	let update
            // if root props changing --> do a force render
            if(getProto(_rawVnode, component) || getShallowProto(_rawVnode, wrapFunction)){
                vtree._rawVnode.forceRender(nextProps)
            }
        })

        this.on('event-rendered', vNode => {
            console.log('event-rendered')

            const { _rawVnode, _vChildren } = vtree
            console.log(vNode)
            const update = diff.call(_rawVnode, _vChildren[0], vNode)
            patch(node, update)
        })
    }
}

const KeetRenderer = new keetRenderer()

export default KeetRenderer