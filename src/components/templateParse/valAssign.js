export default function (node, value, replace, withTo) {
  value = value.replace(replace, withTo)
  if (node) node.nodeValue = value
}
