let l = 'aw'

const hello = (
  <h1 id="attr">
    Hello, world!
    <p>Hi!</p>
    What's up?
  </h1>
);

function toVDOM(node, attributes, ...rest) {
  const children = rest.length ? rest : null
  return {
    node,
    attributes,
    children
  };
};

function render(virtualNode) {
  // console.log(virtualNode)
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode);
  }
  
  const element = document.createElement(virtualNode.elementName);

  // console.log(element)
  
  Object.keys(virtualNode.attributes || {}).forEach(
    (attr) => element.setAttribute(attr, virtualNode.attributes[attr])
  );
  
  (virtualNode.children || []).forEach(
    (child) => element.appendChild(render(child))
  );
  
  return element;
};

const dom = render(hello);
document.body.appendChild(dom);