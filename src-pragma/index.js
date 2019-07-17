
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

        const { _rawVnode = {} } = vtree

        const { componentWillMount, componentDidMount } = _rawVnode

        isFunc(_rawVnode) && isFunc(componentWillMount) && componentWillMount()

        // const rootNode = createEl.call(_rawVnode, vtree)

        // console.log(rootNode)

        isFunc(_rawVnode) && isFunc(componentDidMount) && componentDidMount()

        // mount(node, rootNode)

        oldVtree = clone(vtree)

        // life-cycle prop-hooks event
        this.on('event-hooks', nextProps => {
            console.log('event-hooks')

            const { _rawVnode } = vtree

            // if root props changing --> do a force render
            if(getProto(_rawVnode, component) || getShallowProto(_rawVnode, pureFunction)){

                // set factory props
                factory.umount()
                factory.setProps(nextProps)

                // force render
                _rawVnode.forceRender()

                console.log(vtree)
            }
        })

        this.on('event-rendered', vNode => {
            console.log('event-rendered')

            // const { _rawVnode, _vChildren } = vtree

            // // _vChildren.splice(0, 1, vNode)

            // console.log(vtree)
            // const update = diff.call(_rawVnode, oldVtree, vtree)
            // // console.log(node, update)
            // patch(node, update)

            // oldVtree = clone(vtree)
        })
    }
}

const KeetRenderer = new keetRenderer()

export default KeetRenderer