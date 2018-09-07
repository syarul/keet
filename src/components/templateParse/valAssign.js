export default function (node, replace, withTo) {
  let re = new RegExp(replace, 'g')
  node.nodeValue = node.nodeValue.replace(re, withTo)
}
