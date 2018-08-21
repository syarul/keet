export default function (node, value, replace, withTo) {
  let re = new RegExp(replace, 'g')
  node.nodeValue = node.nodeValue.replace(re, withTo)
}
