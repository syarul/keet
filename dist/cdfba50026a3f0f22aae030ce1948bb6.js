// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const getId = id => document.getElementById(id);

const testEval = ev => {
  try {
    return eval(ev);
  } catch (e) {
    return false;
  }
};
const genId = () => Math.round(Math.random() * 0x1 * 1e12).toString(32);

const selector = id => document.querySelector(`[keet-id="${id}"]`);

exports.getId = getId;
exports.testEval = testEval;
exports.genId = genId;
},{}],9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = argv => {
  const cop = v => {
    let o = {};
    if (typeof v !== 'object') {
      o.copy = v;
      return o.copy;
    } else {
      for (let attr in v) {
        o[attr] = v[attr];
      }
    }
    return o;
  };
  return Array.isArray(argv) ? argv.map(v => v) : cop(argv);
};
},{}],10:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ktag(...args) {
  let attr,
      idx,
      te,
      ret = ['<', args[0], '>', args[1], '</', args[0], '>'];

  if (args.length > 2 && typeof args[2] === 'object') {
    for (attr in args[2]) {
      if (typeof args[2][attr] === 'boolean' && args[2][attr]) ret.splice(2, 0, ' ', attr);else if (attr === 'class' && Array.isArray(args[2][attr])) ret.splice(2, 0, ' ', attr, '="', args[2][attr].join(' ').trim(), '"');else ret.splice(2, 0, ' ', attr, '="', args[2][attr], '"');
    }
  }
  if (args.length > 3 && typeof args[3] === 'object') {
    idx = ret.indexOf('>');
    te = [idx, 0, ' style="'];
    for (attr in args[3]) {
      te.push(attr);
      te.push(':');
      te.push(args[3][attr]);
      te.push(';');
    }
    te.push('"');
    ret.splice.apply(ret, te);
  }
  return ret;
}

exports.default = (...args) => ktag.apply(null, [...args]).join('');
},{}],11:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const loopChilds = (arr, elem) => {
  for (let child = elem.firstChild; child !== null; child = child.nextSibling) {
    arr.push(child);
    if (child.hasChildNodes()) {
      loopChilds(arr, child);
    }
  }
};

const insertAfter = (newNode, referenceNode, parentNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

const nodeUpdate = (newNode, oldNode, watcher2) => {
  if (!newNode) return false;
  let oAttr = newNode.attributes,
      output = {};
  if (oAttr) {
    for (let i = oAttr.length - 1; i >= 0; i--) {
      output[oAttr[i].name] = oAttr[i].value;
    }
  }
  for (let iAttr in output) {
    if (oldNode.attributes[iAttr] && oldNode.attributes[iAttr].name === iAttr && oldNode.attributes[iAttr].value != output[iAttr]) {
      oldNode.setAttribute(iAttr, output[iAttr]);
    }
  }
  if (oldNode.textContent === '' && newNode.textContent) {
    oldNode.textContent = newNode.textContent;
  }
  if (watcher2 && oldNode.textContent != newNode.textContent) {
    oldNode.textContent = newNode.textContent;
  }
  if (oldNode.type == 'checkbox' && !oldNode.checked && newNode.checked) {
    oldNode.checked = true;
  }
  if (oldNode.type == 'checkbox' && oldNode.checked && !newNode.checked) {
    oldNode.checked = false;
  }
  output = {};
};

const nodeUpdateHTML = (newNode, oldNode) => {
  if (!newNode) return false;
  if (newNode.nodeValue !== oldNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;
};

const updateElem = (oldElem, newElem, watcher2) => {
  var oldArr = [],
      newArr = [];
  oldArr.push(oldElem);
  newArr.push(newElem);
  loopChilds(oldArr, oldElem);
  loopChilds(newArr, newElem);
  oldArr.map((ele, idx, arr) => {
    if (ele.nodeType === 1 && ele.hasAttributes()) {
      nodeUpdate(newArr[idx], ele, watcher2);
    } else if (ele.nodeType === 3) {
      nodeUpdateHTML(newArr[idx], ele);
    }
    if (idx === arr.length - 1) {
      oldArr.splice(0);
      newArr.splice(0);
    }
  });
};

exports.loopChilds = loopChilds;
exports.insertAfter = insertAfter;
exports.nodeUpdate = nodeUpdate;
exports.nodeUpdateHTML = nodeUpdateHTML;
exports.updateElem = updateElem;
},{}],12:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

var _genElement = require("./genElement");

var _genElement2 = _interopRequireDefault(_genElement);

var _elementUtils = require("./element-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (context, rep, tmplId) => {
  const watchObject = obj => new Proxy(obj, {
    set(target, key, value) {
      // console.log('set', { key, value })
      // let ele = getId(context.el)

      console.log(key, value, tmplId);
      let obj = {};
      obj[key] = value;
      Object.assign(context, obj);
      console.log(context);
      // let newElem = genElement(context.base[_key], context, _key)
      // log(_key, context.base[_key], index)
      // updateElem(ele.childNodes[index], newElem)
      return target[key] = value;
    }
  });
  return watchObject(context);
};
},{"./utils":4,"./genElement":6,"./element-utils":11}],8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _proxy = require("./proxy");

var _proxy2 = _interopRequireDefault(_proxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (str, context, tmplId) => {
  let arrProps = str.match(/{{([^{}]+)}}/g),
      tmpl = '';
  let proxies = [];
  if (arrProps && arrProps.length) {
    arrProps.forEach(s => {
      let rep = s.replace(/{{([^{}]+)}}/g, '$1');
      if (context[rep] !== undefined) {
        str = str.replace(/{{([^{}]+)}}/, context[rep]);
        let pr = (0, _proxy2.default)(context, rep, tmplId);
        proxies.push(pr);
      }
    });
  }

  return {
    tmpl: str,
    proxies: proxies
  };
};
},{"./proxy":12}],7:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

var _elementUtils = require("./element-utils");

exports.default = (kNode, context, proxies) => {
  // console.log(proxies)
  let listKnodeChild = [],
      hask,
      evtName,
      evthandler,
      handler,
      isHandler,
      argv,
      i,
      atts,
      v,
      rem = [];
  (0, _elementUtils.loopChilds)(listKnodeChild, kNode);
  listKnodeChild.map(c => {
    if (c.nodeType === 1 && c.hasAttributes()) {
      i = 0;
      function next() {
        atts = c.attributes;
        if (i < atts.length) {
          hask = /^k-/.test(atts[i].nodeName);
          if (hask) {
            evtName = atts[i].nodeName.split('-')[1];
            evthandler = atts[i].nodeValue;
            handler = evthandler.split('(');
            isHandler = (0, _utils.testEval)(context[handler[0]]);
            if (typeof isHandler === 'function') {
              rem.push(atts[i].nodeName);
              argv = [];
              v = handler[1].slice(0, -1).split(',').filter(f => f != '');
              if (v.length) v.map(v => argv.push(v));
              c.addEventListener(evtName, isHandler.bind.apply(isHandler.bind(proxies[0]), [c].concat(argv)), false);
            }
          }
          i++;
          next();
        } else {
          rem.map(f => c.removeAttribute(f));
        }
      }
      next();
    }
  });
  listKnodeChild = [];
};
},{"./utils":4,"./element-utils":11}],6:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _copy = require("./copy");

var _copy2 = _interopRequireDefault(_copy);

var _tag = require("./tag");

var _tag2 = _interopRequireDefault(_tag);

var _tmplHandler = require("./tmplHandler");

var _tmplHandler2 = _interopRequireDefault(_tmplHandler);

var _processEvent = require("./processEvent");

var _processEvent2 = _interopRequireDefault(_processEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (child, context) => {
  let tempDiv = document.createElement('div');
  let cloneChild = (0, _copy2.default)(child);
  delete cloneChild.template;
  delete cloneChild.tag;
  delete cloneChild.style;

  // clean up object for custom attributes, prepare for event-listener handlers
  for (let attr in cloneChild) {
    if (typeof cloneChild[attr] === 'function') {
      delete cloneChild[attr];
    }
  }
  // process template if has handlebars value
  let tpl = (0, _tmplHandler2.default)(child.template, context, child['keet-id']);

  let s = child.tag ? (0, _tag2.default)(child.tag, //html tag
  tpl.tmpl ? tpl.tmpl : '', // nodeValue
  cloneChild, //attributes
  child.style // styles
  ) : child.template; // fallback if non exist, render the template as string

  tempDiv.innerHTML = s;
  if (child.tag === 'input') {
    if (child.checked) tempDiv.childNodes[0].checked = true;else tempDiv.childNodes[0].removeAttribute('checked');
  }
  (0, _processEvent2.default)(tempDiv, context, tpl.proxies);
  return tempDiv.childNodes[0];
};
},{"./copy":9,"./tag":10,"./tmplHandler":8,"./processEvent":7}],5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _genElement = require("./genElement");

var _genElement2 = _interopRequireDefault(_genElement);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (context, watch) => {
  if (typeof context.base != 'object') throw new Error('instance is not an object');
  let elemArr = [];
  if (Array.isArray(context.base.list)) {
    // do array base
  } else {
    // do object base
    Object.keys(context.base).map((key, index) => {
      let child = context.base[key];
      if (child && typeof child === 'object') {
        let id = (0, _utils.genId)();
        child['keet-id'] = id;
        context.base[key]['keet-id'] = id;
        let newElement = (0, _genElement2.default)(child, context);
        elemArr.push(newElement);
      } else {
        // log('key is not object')
        // tempDiv = document.createElement('div')
        // tempDiv.innerHTML = c
        // process_event(tempDiv)
        // elemArr.push(tempDiv.childNodes[0])
      }
    });
  }

  return elemArr;
};
},{"./genElement":6,"./utils":4}],3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./components/utils");

var _parseStr = require("./components/parseStr");

var _parseStr2 = _interopRequireDefault(_parseStr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let log = console.log.bind(console);

class Keet {
  constructor(context) {
    this.base = context || {};
  }
  mount(instance) {
    this.base = instance;
    return this;
  }
  link(id) {
    this.el = id;
    this.render();
    return this;
  }
  render() {
    let ele = (0, _utils.getId)(this.el);
    if (ele) ele.innerHTML = '';

    let els = (0, _parseStr2.default)(this, true),
        i = 0;
    while (i < els.length) {
      ele.appendChild(els[i]);

      if (i === els.length - 1) {
        document.addEventListener('_loaded', window._loaded && typeof window._loaded === 'function' ? window._loaded(ctx.el) : null, false);
      }
      i++;
    }
    return this;
  }
}
exports.default = Keet;
},{"./components/utils":4,"./components/parseStr":5}],2:[function(require,module,exports) {
"use strict";

var _rebase = require("../rebase");

var _rebase2 = _interopRequireDefault(_rebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.clear();
let log = console.log.bind(console);

class App extends _rebase2.default {
  constructor() {
    super();
    this.count = 0;
    this.randomNum = Math.round(Math.random() * 100);
  }
  add() {
    this.count++;
    this.roll();
  }
  roll() {
    this.randomNum = Math.round(Math.random() * 100);
    log(this);
  }
}

const app = new App();

const model = {
  header: {
    tag: 'h1',
    template: 'My Simple Counter'
  },
  counter: {
    tag: 'button',
    'k-click': 'add()',
    template: '{{count}} click'
  },
  random: {
    tag: 'button',
    template: 'roll:{{randomNum}}'
  }
};

app.mount(model).link('app');

// reel('/app').pipe(sink)
},{"../rebase":3}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':53535/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])