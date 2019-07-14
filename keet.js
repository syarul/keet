import { isNode } from './src-pragma/utils'
import walk from './src-pragma/dom/walk'

const keet = function(virtualNode) {

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

    if(!isNode(virtualNode)) {
        throw new Error('Paramater is not a transform JSX element')
    } 
    // else if(virtualNode.hasOwnProperty('elementName') &&
    //     typeof virtualNode.elementName !== 'function' ) {
    //     throw new Error('Attribute "elementName" is not a constructor')
    // }

	/**
     * ==================
     * life-cycle staging
     * ==================
     * walk vtree to generate virtual nodes tree
     * do not transform to DOM for any reason during this stage
     * pass properties to each vnode if it is a constructor
     * return as it is if is not a constructor
     * borrow some analogy from https://github.com/Matt-Esch/virtual-dom
     */

    return walk(virtualNode, {})

}

export default keet