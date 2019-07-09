import parseAttr from './parseAttr'
/**
 * generate node base on type
 */

const vDom = ({ elementName }) => document.createElement(elementName)

const type = (_case, _vnode) => {

    let vnode;

    switch(_case){
        case 'string':
            vnode = document.createTextNode(_vnode)
        case null:
            return
        case 'boolean' && !_vnode:
            return
        case Array.isArray(_vnode):
            vnode = _vnode.map(v => vDom(v))
        default:
            vnode = vDom(_vnode)
    }

    console.log(vnode)

    Object.keys(_vnode.attributes).map(attr => parseAttr.call(_vnode, vnode, attr, _vnode.attributes[attr]))

    return vnode
}


export default virtualNode => type(typeof virtualNode, virtualNode)