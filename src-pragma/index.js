
//
// Keetjs v5.0.0 https://github.com/keetjs/keet
// Minimalist view layer for the web
//
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//
// Copyright 2019, Shahrul Nizam Selamat
// Released under the MIT License.
//

import clone from 'clone'
import { eventHooks, getProto, getShallowProto, assign, isFunc } from './utils'
import mount from './dom/mount'
import diff from './dom/diff'
import patch from './dom/patch'
import createEl from './dom/createEl'
import walk, { updateGlobalProps } from './dom/walk'
import component from './component'
import pureFunction from './pureFunction'
import factory from './propsFactory'

@eventHooks()
class keetRenderer {

    render (vtree, node) {

        console.log(vtree)

        let oldVtree

        const { _vnode, componentWillMount, componentDidMount } = vtree

        isFunc(componentWillMount) && componentWillMount()

        const rootNode = createEl.call(vtree, _vnode)

        // console.log(rootNode)

        isFunc(componentDidMount) && componentDidMount()

        mount(node, rootNode)

        oldVtree = clone(vtree)

        // life-cycle prop-hooks event
        this.on('event-hooks', nextProps => {
            console.log('event-hooks')

            // if root props changing --> do a force render
            if(getProto(vtree, component) || getShallowProto(vtree, pureFunction)){

                // set factory props
                factory.umount()
                factory.setProps(nextProps)

                // force render
                vtree.forceRender()

                // console.log(vtree)
            }
        })

        this.on('event-rendered', vNode => {
            console.log('event-rendered')

            const { _vnode } = vtree

            // console.log(vtree)

            const update = diff.call(vtree, oldVtree._vnode, _vnode)
            // console.log(node, update)
            patch(node, update)

            oldVtree = clone(vtree)
        })
    }
}

const KeetRenderer = new keetRenderer()

export default KeetRenderer