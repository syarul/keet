var keet = (function (exports) {
  'use strict';

  function updateState (state, updateStateList) {
    if (typeof updateStateList === 'function') updateStateList(state);
  }

  var conditionalNodesRawEnd = /\{\{\/([^{}]+)\}\}/g;
  var DOCUMENT_ELEMENT_TYPE = 1;
  var DOCUMENT_COMMENT_TYPE = 8;

  var cache = {};

  // rebuild the node structure
  function catchNode(node, start) {
    var cNode = void 0;
    while (node) {
      cNode = node;
      node = node.nextSibling;
      if (cNode && cNode.nodeType === DOCUMENT_ELEMENT_TYPE) {
        if (cNode.isEqualNode(start)) {
          cNode.remove();
          start = start.nextSibling;
        } else {
          catchNode(cNode.firstChild, start);
        }
      } else if (cNode.isEqualNode(start)) {
        cNode.remove();
        start = start.nextSibling;
      }
    }
  }

  function resolveConditionalNodes(node, conditional, setup, runner, addState) {
    var currentNode = void 0;
    var cNode = void 0;
    var fetchFrag = void 0;
    var frag = document.createDocumentFragment();
    if (setup === 'initial' && !cache.hasOwnProperty(conditional)) {
      cNode = node;
      while (cNode) {
        currentNode = cNode;
        cNode = cNode.nextSibling;
        if (currentNode.nodeType !== DOCUMENT_ELEMENT_TYPE && currentNode.nodeValue.match(conditionalNodesRawEnd)) {
          cNode = null;
          cache[conditional] = cache[conditional] || {};
          // clean up pristine node
          catchNode(this.__pristineFragment__.firstChild, frag.firstChild);
          // since we work backward no need to check fragment recursive conditional states
          cache[conditional].frag = frag;
        } else if (currentNode.nodeType !== DOCUMENT_COMMENT_TYPE) {
          frag.appendChild(currentNode);
        }
      }
    } else if (setup === 'conditional-set') {
      if (node.nextSibling.isEqualNode(cache[conditional].frag.firstChild)) return;
      fetchFrag = cache[conditional].frag.cloneNode(true);
      runner.call(this, fetchFrag.firstChild, addState);
      node.parentNode.insertBefore(fetchFrag, node.nextSibling);
    }
  }

  var DOCUMENT_ELEMENT_TYPE$1 = 1;
  var DOCUMENT_COMMENT_TYPE$1 = 8;
  var conditionalNodesRawStart = /\{\{\?([^{}]+)\}\}/g;
  var reConditional = /([^{?])(.*?)(?=\}\})/g;

  var conditional = void 0;
  var currentNode = void 0;
  var state = void 0;
  var nodes = void 0;

  function check(node) {
    while (node) {
      currentNode = node;
      node = node.nextSibling;
      if (currentNode.nodeType === DOCUMENT_ELEMENT_TYPE$1) {
        check.call(this, currentNode.firstChild);
      } else if (currentNode.nodeType === DOCUMENT_COMMENT_TYPE$1 && currentNode.nodeValue.match(conditionalNodesRawStart)) {
        conditional = currentNode.nodeValue.trim().match(reConditional);
        state = state.concat(conditional);
        nodes = nodes.concat(currentNode);
      }
    }
  }

  function conditionalCache(addState) {
    state = [];
    nodes = [];
    check.call(this, this.base.firstChild);
    var i = state.length;
    while (i > 0) {
      i--;
      updateState(state[i], addState.bind(this));
      resolveConditionalNodes.call(this, nodes[i], state[i], 'initial');
    }
  }

  // storage for model state
  var cache$1 = {};

  function removeProtoModel(node, id) {
    var p = node.getElementById(id);
    if (p) p.childNodes[1].remove();
  }

  function genModelList(node, model, reconcile) {
    var modelList = void 0;
    var i = void 0;
    var listClone = void 0;
    var parentNode = void 0;
    var list = void 0;
    var listArg = void 0;
    var mLength = void 0;

    cache$1[model] = cache$1[model] || {};

    // check if the model use filtering
    listArg = this[model] && this[model].enableFiltering ? 'listFilter' : 'list';

    if (!cache$1[model][listArg]) {
      cache$1[model][listArg] = node.nextSibling.cloneNode(true);
      node.nextSibling.remove();
      // also remove from pristine nodes / conditional cache store
      removeProtoModel(this.__pristineFragment__, node.parentNode.id);
    }

    list = cache$1[model][listArg];

    if (this[model] !== undefined && this[model].hasOwnProperty(listArg)) {
      parentNode = node.parentNode;

      modelList = this[model][listArg];

      if (!this[model].dirty) {
        parentNode.setAttribute('pristine-model', '');
        return;
      }

      i = 0;

      mLength = modelList.length;

      while (i < mLength) {
        listClone = list.cloneNode(true);
        reconcile.call(this, listClone, null, modelList[i]);
        listClone.setAttribute('kdata-id', modelList[i]['kdata-id']);
        parentNode.insertBefore(listClone, parentNode.lastChild);
        i++;
      }
      this[model].dirty = false;
    }
  }

  var genId = function genId() {
    var rd = function rd() {
      return (Math.random() * 1 * 1e17).toString(36);
    };
    return 'KDATA-' + rd() + '-' + rd();
  };

  var minId = function minId() {
    return (Math.random() * 1 * 1e17).toString(36);
  };

  var getId = function getId(id) {
    return document.getElementById(id);
  };

  /**
   * @private
   * @description
   * Confirm that a value is truthy, throws an error message otherwise.
   *
   * @param {*} val - the val to test.
   * @param {string} msg - the error message on failure.
   * @throws {Error}
   */
  var assert = function assert(val, msg) {
    if (!val) throw new Error('(keet) ' + msg);
  };

  /**
   * @private
   * @description
   * Simple html template literals MODIFIED from : http://2ality.com/2015/01/template-strings-html.html
   * by Dr. Axel Rauschmayer
   * no checking for wrapping in root element
   * no strict checking
   * remove spacing / indentation
   * keep all spacing within html tags
   * include handling ${} in the literals
   */
  var html = function html() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var literals = args.shift();
    var substs = args.slice();

    var result = literals.raw.reduce(function (acc, lit, i) {
      return acc + substs[i - 1] + lit;
    });
    // remove spacing, indentation from every line
    result = result.split(/\n+/);
    result = result.map(function (t) {
      return t.trim();
    }).join('');
    return result;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var cacheInit = {};

  function getKeetGlobalComponent(component) {
    if (window && _typeof(window.__keetGlobalComponentRef__) === 'object') {
      return window.__keetGlobalComponentRef__[component];
    }
    return;
  }

  function componentParse (componentStr, node) {
    var component = componentStr.replace('component:', '');
    var c = this[component] || getKeetGlobalComponent(component);
    if (c !== undefined) {
      // this is for initial component runner
      if (!cacheInit[c.ID]) {
        c.render(true);
        cacheInit[c.ID] = c.base.cloneNode(true);
        node.parentNode.replaceChild(c.base, node);
      } else {
        // we need to reattach event listeners if the node is not available on DOM
        if (!getId(c.el)) {
          c.base = c.__pristineFragment__.cloneNode(true);
          c.render(true);
          node.parentNode.replaceChild(c.base, node);
        } else {
          node.parentNode.replaceChild(cacheInit[c.ID].cloneNode(true), node);
          // inform sub-component to update
          c.callBatchPoolUpdate();
        }
      }
    } else {
      assert(false, 'Component ' + component + ' does not exist.');
    }
  }

  var re = /{{([^{}]+)}}/g;
  var model = /^model:/g;
  var component = /^component:([^{}]+)/g;

  function replaceCommentBlock (value, node, reconcile) {
    var rep = void 0;
    var modelRep = void 0;

    if (value.match(re)) {
      rep = value.replace(re, '$1').trim();
      if (rep.match(model)) {
        modelRep = rep.replace('model:', '');
        genModelList.call(this, node, modelRep, reconcile);
      } else if (rep.match(component)) {
        componentParse.call(this, rep, node);
      }
    }
  }

  // function to resolve ternary operation

  var test = function test(str) {
    return str === '\'\'' || str === '""' || str === 'null' ? '' : str;
  };

  function ternaryOps (input) {
    if (input.match(/([^?]*)\?([^:]*):([^;]*)|(\s*=\s*)[^;]*/g)) {
      var t = input.split('?');
      var condition = t[0];
      var leftHand = t[1].split(':')[0];
      var rightHand = t[1].split(':')[1];

      // check the condition fulfillment

      if (this) {
        if (this[condition]) {
          return {
            value: test(leftHand),
            state: condition
          };
        } else {
          return {
            value: test(rightHand),
            state: condition
          };
        }
      }
      return false;
    } else return false;
  }

  var strInterpreter = (function (str) {
    var res = str.match(/\.*\./g);
    var result = void 0;
    if (res && res.length > 0) {
      return str.split('.');
    }
    return result;
  });

  function valAssign (node, value, replace, withTo) {
    var re = new RegExp(replace, 'g');
    node.nodeValue = node.nodeValue.replace(re, withTo);
  }

  var re$1 = /{{([^{}]+)}}/g;

  function replaceHandleBars (value, node, addState, isAttr, model) {
    var props = value.match(re$1);
    if (!props) return;
    var ln = props.length;
    var rep = void 0;
    var tnr = void 0;
    var isObjectNotation = void 0;

    var self = this;

    var ref = model || this;

    while (ln) {
      ln--;
      rep = props[ln].replace(re$1, '$1');
      tnr = ternaryOps.call(ref, rep);
      isObjectNotation = strInterpreter(rep);
      if (isObjectNotation) {
        if (!isAttr) {
          if (isObjectNotation[0] === 'this' && self[isObjectNotation[1]] !== undefined && typeof self[isObjectNotation[1]] === 'function') {
            var result = self[isObjectNotation[1]]();
            if (result !== undefined) {
              valAssign(node, value, '{{' + rep + '}}', result);
            }
          } else {
            updateState(rep, addState);
            valAssign(node, value, '{{' + rep + '}}', self[isObjectNotation[0]][isObjectNotation[1]]);
          }
        } else {
          if (isObjectNotation[0] === 'this' && self[isObjectNotation[1]] !== undefined && typeof self[isObjectNotation[1]] === 'function') {
            var _result = self[isObjectNotation[1]](ref);
            return _result !== undefined ? _result : value;
          } else {
            updateState(rep, addState);
            return value.replace(props, self[isObjectNotation[0]][isObjectNotation[1]]);
          }
        }
      } else {
        if (tnr) {
          updateState(tnr.state, addState);
          if (!isAttr) {
            valAssign(node, value, '{{' + rep + '}}', tnr.value);
          } else {
            return value.replace(props, tnr.value);
          }
        } else {
          if (ref[rep] !== undefined) {
            updateState(rep, addState);
            if (!isAttr) {
              valAssign(node, value, '{{' + rep + '}}', ref[rep]);
            } else {
              return value.replace(props, ref[rep]);
            }
          }
        }
      }
    }
  }

  var re$2 = /{{([^{}]+)}}/g;

  function inspectAttributes(node, addState, model) {
    var nodeAttributes = node.attributes;
    var i = 0;
    var a = void 0;
    var ns = void 0;
    var name = void 0;

    for (i = nodeAttributes.length; i--;) {
      a = nodeAttributes[i];
      name = a.localName;
      ns = a.nodeValue;
      if (re$2.test(name)) {
        node.removeAttribute(name);
        name = replaceHandleBars.call(this, name, node, addState, true, model);
        node.setAttribute(name, ns);
      } else if (re$2.test(ns)) {
        ns = replaceHandleBars.call(this, ns, node, addState, true, model);
        if (name === 'checked') {
          if (ns === '') {
            node.removeAttribute(name);
            // node.checked = false
          } else {
            // node.checked = true
            node.setAttribute(name, '');
          }
          // node.removeAttribute(name)
        } else {
          if (ns === '') {
            node.setAttribute(name, '');
          } else {
            node.setAttribute(name, ns);
          }
        }
      }
    }
  }

  var DOCUMENT_ELEMENT_TYPE$2 = 1;
  var re$3 = /{{([^{}]+)}}/g;

  function lookupParentNode(rootNode, node) {
    var cNode = void 0;
    while (node) {
      cNode = node;
      node = node.parentNode;
      if (cNode.nodeType === DOCUMENT_ELEMENT_TYPE$2 && cNode.hasAttribute('kdata-id')) {
        return { id: cNode.getAttribute('kdata-id'), node: cNode };
      }
      if (cNode.isEqualNode(rootNode)) {
        node = null;
      }
    }
  }

  var getIndex = function getIndex(id, model) {
    return model.list.map(function (m) {
      return m['kdata-id'];
    }).indexOf(id);
  };

  function addEvent(node, evtData) {
    // delete evtData.isModel
    var evtName = Object.keys(evtData)[0];
    var handler = evtData[evtName];
    if (this[handler] !== undefined && typeof this[handler] === 'function') {
      node.addEventListener(evtName, this[handler].bind(this), !!evtData['useCapture']);
    }
  }

  function fn(model, handler, node, e) {
    e.stopPropagation();
    if (e.target !== e.currentTarget) {
      var t = lookupParentNode(node, e.target);
      this[handler](model.list[getIndex(t.id, model)], e.target, t.node, e);
    }
  }

  function addEventModel(node, evtData) {
    // delete evtData.isModel
    var evtName = Object.keys(evtData)[0];
    var handler = evtData[evtName];
    if (this[handler] !== undefined && typeof this[handler] === 'function') {
      var rep = node.firstChild.nodeValue.replace(re$3, '$1').trim();
      rep = rep.replace('model:', '');
      var model = this[rep];
      node.addEventListener(evtName, fn.bind(this, model, handler, node), !!evtData['useCapture']);
    }
  }

  var conditionalNodesRawStart$1 = /\{\{\?([^{}]+)\}\}/g;
  var reConditional$1 = /([^{?])(.*?)(?=\}\})/g;
  var re$4 = /{{([^{}]+)}}/g;
  var modelRaw = /\{\{model:([^{}]+)\}\}/g;

  var DOCUMENT_ELEMENT_TYPE$3 = 1;
  var DOCUMENT_COMMENT_TYPE$2 = 8;

  function testEventNode(node) {
    var nodeAttributes = node.attributes;
    var i = 0;
    var a = void 0;
    var name = void 0;
    var value = void 0;
    var evtName = void 0;
    var handler = void 0;
    var evtStore = [];
    var obs = void 0;
    var args = void 0;

    while (i < nodeAttributes.length) {
      a = nodeAttributes[i];
      name = a.localName;
      value = a.nodeValue;
      if (/^k-/.test(name)) {
        evtName = name.replace(/^k-/, '');
        handler = value.match(/[a-zA-Z]+(?![^(]*\))/)[0];
        args = value.match(/\(([^{}]+)\)/);
        args = args ? args[1] : '';
        obs = {};
        obs[evtName] = handler;
        if (args) obs[args] = true;
        obs['isModel'] = false;
        evtStore.push(obs);
        if (node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE$3 && node.firstChild.nodeValue.match(modelRaw)) {
          obs['isModel'] = true;
        }
      }
      i++;
    }
    return evtStore;
  }

  var events = void 0;
  var c = void 0;
  var currentNode$1 = void 0;

  function recon(node, addState, model) {
    var _this = this;

    while (node) {
      currentNode$1 = node;
      node = node.nextSibling;
      if (currentNode$1.nodeType === DOCUMENT_ELEMENT_TYPE$3) {
        if (currentNode$1.hasAttributes()) {
          inspectAttributes.call(this, currentNode$1, addState, model);

          // to take advantage of caching always assigned id to the node
          // we only assign eventListener on first mount to DOM or when the node is not available on DOM
          if (!getId(currentNode$1.id)) {
            events = testEventNode.call(this, currentNode$1);
            if (events.length) {
              events.map(function (e) {
                !e.isModel ? addEvent.call(_this, currentNode$1, e) : addEventModel.call(_this, currentNode$1, e);
                currentNode$1.removeAttribute('k-' + Object.keys(e)[0]);
              });
            }
          }
        }
        recon.call(this, currentNode$1.firstChild, addState, model);
      } else if (currentNode$1.nodeType === DOCUMENT_COMMENT_TYPE$2 && currentNode$1.nodeValue.match(conditionalNodesRawStart$1)) {
        c = currentNode$1.nodeValue.trim().match(reConditional$1);
        c = c && c[0];
        if (this[c]) {
          resolveConditionalNodes.call(this, currentNode$1, c, 'conditional-set', reconcile, addState);
        }
      } else if (currentNode$1.nodeType === DOCUMENT_COMMENT_TYPE$2 && currentNode$1.nodeValue.match(re$4) && !currentNode$1.nodeValue.match(conditionalNodesRawStart$1)) {
        replaceCommentBlock.call(this, currentNode$1.nodeValue, currentNode$1, reconcile);
      } else {
        replaceHandleBars.call(this, currentNode$1.nodeValue, currentNode$1, addState, null, model);
      }
    }
  }

  function reconcile(instance, addState, model) {
    recon.call(this, instance, addState, model);
  }

  var DOCUMENT_ELEMENT_TYPE$4 = 1;

  function isEqual(oldNode, newNode) {
    return isPristine(newNode) || isIgnored(oldNode) && isIgnored(newNode) || oldNode.isEqualNode(newNode);
  }

  function isIgnored(node) {
    return node.getAttribute('data-ignore') != null;
  }

  function arbiter(oldNode, newNode) {
    if (oldNode.nodeName !== 'INPUT') return;
    if (oldNode.checked !== newNode.checked) {
      oldNode.checked = newNode.checked;
    }
  }

  function setAttr(oldNode, newNode) {
    var oAttr = newNode.attributes;
    var output = {};
    var i = 0;
    while (i < oAttr.length) {
      output[oAttr[i].name] = oAttr[i].value;
      i++;
    }
    var iAttr = oldNode.attributes;
    var input = {};
    var j = 0;
    while (j < iAttr.length) {
      input[iAttr[j].name] = iAttr[j].value;
      j++;
    }
    for (var attr in output) {
      if (oldNode.attributes[attr] && oldNode.attributes[attr].name === attr && oldNode.attributes[attr].value !== output[attr]) {
        oldNode.setAttribute(attr, output[attr]);
      } else {
        // add new attributes as long is not part of k-<eventListener>
        if (!oldNode.hasAttribute(attr) && !/^k-/.test(attr)) {
          oldNode.setAttribute(attr, output[attr]);
        }
      }
    }
    for (var _attr in input) {
      // if attributes does not exist on the new node we removed it from the old node
      if (newNode.attributes[_attr] && oldNode.attributes[_attr]) ; else {
        oldNode.removeAttribute(_attr);
      }
    }
  }

  function patch(oldNode, newNode) {
    if (oldNode.nodeType === newNode.nodeType) {
      if (oldNode.nodeType === DOCUMENT_ELEMENT_TYPE$4) {
        arbiter(oldNode, newNode);
        if (isEqual(oldNode, newNode)) return;
        diff(oldNode.firstChild, newNode.firstChild);
        if (oldNode.nodeName === newNode.nodeName) {
          setAttr(oldNode, newNode);
        } else {
          oldNode.parentNode.replaceChild(newNode, oldNode);
        }
      } else {
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue;
        }
      }
    } else {
      oldNode.parentNode.replaceChild(newNode, oldNode);
    }
  }

  function getIndex$1(store, count) {
    return store.length - count - 1;
  }

  var checkNew = void 0;
  var checkOld = void 0;

  function diff(oldNode, newNode, ignoreNextSibling) {
    var count = 0;
    var newStore = [];
    while (newNode) {
      count++;
      checkNew = newNode;
      newNode = ignoreNextSibling ? null : newNode.nextSibling;
      newStore.push(checkNew);
    }
    var index = void 0;
    var oldParentNode = oldNode && oldNode.parentNode;
    while (oldNode) {
      count--;
      checkOld = oldNode;
      oldNode = ignoreNextSibling ? null : oldNode.nextSibling;
      index = getIndex$1(newStore, count);
      if (checkOld && newStore[index]) {
        patch(checkOld, newStore[index]);
      } else if (checkOld && !newStore[index]) {
        oldParentNode.removeChild(checkOld);
      }
      if (oldNode === null) {
        while (count > 0) {
          count--;
          index = getIndex$1(newStore, count);
          oldParentNode.appendChild(newStore[index]);
        }
      }
    }
  }

  function isPristine(node) {
    return node.hasAttribute('pristine-model');
  }

  function diffNodes(instance) {
    var base = getId(this.el);
    if (base && !this.IS_STUB) {
      diff(base.firstChild, instance);
    } else if (base && !isPristine(instance)) {
      diff(base.firstChild, instance.firstChild);
    }
  }

  // import conditionalSet from './templateParse/conditionalSet'

  var DELAY = 0;

  var morpher = function morpher() {
    genElement.call(this);
    // exec life-cycle componentDidUpdate
    if (this.componentDidUpdate && typeof this.componentDidUpdate === 'function') {
      this.componentDidUpdate();
    }
  };

  var timer = {};

  var updateContext = function updateContext(fn, delay) {
    var _this = this;

    timer[this.ID] = timer[this.ID] || null;
    clearTimeout(timer[this.ID]);
    timer[this.ID] = setTimeout(function () {
      return fn.call(_this);
    }, delay);
  };

  var nextState = function nextState(i) {
    var self = this;
    var state = void 0;
    var value = void 0;
    if (!stateList[this.ID]) return;
    if (i < stateList[this.ID].length) {
      state = stateList[this.ID][i];
      value = this[state];

      // if value is undefined, likely has object notation we convert it to array
      if (value === undefined) value = strInterpreter(state);

      if (value && Array.isArray(value)) {
        // using split object notation as base for state update
        var inVal = this[value[0]][value[1]];

        Object.defineProperty(this[value[0]], value[1], {
          enumerable: false,
          configurable: true,
          get: function get() {
            return inVal;
          },
          set: function set(val) {
            inVal = val;
            updateContext.call(self, morpher, DELAY);
          }
        });
      } else {
        // handle parent state update if the state is not an object
        Object.defineProperty(this, state, {
          enumerable: false,
          configurable: true,
          get: function get() {
            return value;
          },
          set: function set(val) {
            value = val;
            updateContext.call(self, morpher, DELAY);
          }
        });
      }
      i++;
      nextState.call(this, i);
    }
  };

  var setState = function setState() {
    nextState.call(this, 0);
  };

  var stateList = {};

  function clearState() {
    if (stateList[this.ID]) stateList[this.ID] = [];
  }

  function addState(state) {
    stateList[this.ID] = stateList[this.ID] || [];
    if (stateList[this.ID].indexOf(state) === -1) {
      stateList[this.ID] = stateList[this.ID].concat(state);
    }
  }

  var genElement = function genElement() {
    this.base = this.__pristineFragment__.cloneNode(true);
    // conditionalSet.call(this, this.base.firstChild)
    reconcile.call(this, this.base.firstChild, addState.bind(this));
    // eventBuff.call(this, this.base.firstChild)
    diffNodes.call(this, this.base.firstChild);
  };

  var DOCUMENT_ELEMENT_TYPE$5 = 1;

  function parseStr (stub) {
    conditionalCache.call(this, addState.bind(this));
    // conditionalSet.call(this, this.base.firstChild)
    reconcile.call(this, this.base.firstChild, addState.bind(this));
    // eventBuff.call(this, this.base.firstChild)
    var el = stub || getId(this.el);
    if (el) {
      if (el.nodeType === DOCUMENT_ELEMENT_TYPE$5) {
        el.setAttribute('data-ignore', '');
      } else {
        assert(this.base.childNodes.length === 1, 'Sub-component should only has a single rootNode.');
        !this.base.firstChild.hasAttribute('data-ignore') && this.base.firstChild.setAttribute('data-ignore', '');
      }
      // listen to state changes
      setState.call(this);
      // mount fragment to DOM
      if (!stub) {
        el.appendChild(this.base);
      }

      // since component already rendered, trigger its life-cycle method
      if (this.componentDidMount && typeof this.componentDidMount === 'function') {
        this.componentDidMount();
      }
    } else {
      assert(false, 'No element with id: "' + this.el + '" exist.');
    }
  }

  /**
   * @module keet/createModel
   * @example
   * import { createModel } from 'keet'
   *
   * class myModel extends createModel {
   *   contructor() {
   *     super()
   *     // props 
   *   }
   *   // new extended method
   *   myMethod(...args){
   *     this.list = args 
   *   }
   * }
   *
   * const MyModel = new myModel()
   */

  // check two objects properties attribute kdata-id and return the value equality
  var notEqual = function notEqual(a, b) {
    return a['kdata-id'] !== b['kdata-id'];
  };

  var async = {};

  // We otimize component lifeCycle triggering by trottling the model batch updates
  var inform = function inform() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (async[this.mId]) clearTimeout(async[this.mId]);
    async[this.mId] = setTimeout(function () {
      return _this.exec && typeof _this.exec === 'function' && _this.exec.apply(null, args);
    }, 0);
  };

  /**
   * The model constructor, use with template literal having
   * ```{{model:<myModel>}}<myModelTemplateString>{{/model:<myModel>}}```
   * @alias module:keet/createModel
   * @param {*} enableFiltering - any truthy value 
   *
   */

  var createModel = function () {
    function createModel(enableFiltering) {
      classCallCheck(this, createModel);

      this.mId = this.indentity;

      async[this.mId] = null;
      // if enableFiltering is assigned a value, model generation will
      // use `listFilter` instead of `list`
      this.enableFiltering = enableFiltering || null;

      this.model = [];

      // Register callback listener of any changes
      Object.defineProperty(this, 'list', {
        enumerable: false,
        configurable: true,
        get: function get$$1() {
          return this.model;
        },
        set: function set$$1(val) {
          this.model = val;
          this.dirty = true;
          inform.call(this, this.model, this.listFilter);
        }
      });

      // Register callback listener of any changes with filter
      Object.defineProperty(this, 'listFilter', {
        enumerable: false,
        configurable: true,
        get: function get$$1() {
          var _this2 = this;

          return !this.prop ? this.model : this.model.filter(function (obj) {
            return obj[_this2.prop] === _this2.value;
          });
        }
      });
    }

    // set identity for this model


    /**
     * Subscribe to the model changes, the function callback first argument
     * is the ```model.list``` and the second argument is ```model.listFilter```
     * @param {Function} fn - the function callback for the subscribe
     */
    createModel.prototype.subscribe = function subscribe(fn) {
      this.exec = fn;
    };

    /**
     * Add new object to the model list
     * @param {Object} obj - new object to add into the model list
     */


    createModel.prototype.add = function add(obj) {
      this.list = this.list.concat(_extends({}, obj, { 'kdata-id': minId() }));
    };

    /**
     * Update existing object in the model list
     * @param {Object} updateObj - the updated properties
     */


    createModel.prototype.update = function update(updateObj) {
      this.list = this.list.map(function (obj) {
        return notEqual(obj, updateObj) ? obj : updateObj;
      });
    };

    /**
     * Filter the model data by selected properties, constructor
     * instantiation should be apply with boolean true as argument
     * to enable filtering
     * @param {standard} prop - property of the object
     * @param {standard} value - property value
     */


    createModel.prototype.filter = function filter(prop, value) {
      this.prop = prop;
      this.value = value;
      this.list = this.list;
    };

    /**
    * Removed existing object in the model list
    * @param {Object} destroyObj - the object ref to remove from the model
    */


    createModel.prototype.destroy = function destroy(destroyObj) {
      this.list = this.list.filter(function (obj) {
        return notEqual(obj, destroyObj);
      });
    };

    createClass(createModel, null, [{
      key: 'indentity',
      get: function get$$1() {
        return minId();
      }
    }]);
    return createModel;
  }();

  var DOCUMENT_FRAGMENT_TYPE = 11;
  var DOCUMENT_TEXT_TYPE = 3;
  var DOCUMENT_ELEMENT_TYPE$6 = 1;
  /**
   * @private
   * @description
   * Mount an instance of string or html elements
   *
   * @param {String|Object} instance - the html/string
   */
  function _mount (instance) {
    var base = void 0;
    var tempDiv = void 0;
    var frag = document.createDocumentFragment();
    // Before we begin to parse an instance, do a run-down checks
    // to clean up back-tick string which usually has line spacing.
    if (typeof instance === 'string') {
      base = instance.trim().replace(/\s+/g, ' ');
      tempDiv = document.createElement('div');
      tempDiv.innerHTML = base;
      while (tempDiv.firstChild) {
        frag.appendChild(tempDiv.firstChild);
      }
      // If instance is a html element process as html entities
    } else if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) === 'object' && instance['nodeType']) {
      if (instance['nodeType'] === DOCUMENT_ELEMENT_TYPE$6) {
        frag.appendChild(instance);
      } else if (instance['nodeType'] === DOCUMENT_FRAGMENT_TYPE) {
        frag = instance;
      } else if (instance['nodeType'] === DOCUMENT_TEXT_TYPE) {
        frag.appendChild(instance);
      } else {
        assert(false, 'Unable to parse instance, unknown type.');
      }
    } else {
      assert(false, 'Parameter is not a string or a html element.');
    }
    // we store the pristine instance in __pristineFragment__
    this.__pristineFragment__ = frag.cloneNode(true);
    this.base = frag;

    // cleanup states on mount
    clearState.call(this);
    return this;
  }

  // allow debugging using shorthand l and tr
  function debugMode() {
    window.l = console.log.bind(console);
    window.tr = console.trace.bind(console);
  }

  debugMode();

  /**
   * @description
   * The main constructor of Keet
   */

  var Keet = function () {
    function Keet(name) {
      classCallCheck(this, Keet);

      this.ID = Keet.indentity;
      if (name) {
        this.storeRef(name);
      }
    }

    // generate ID for the component


    Keet.prototype.mount = function mount(instance) {
      return _mount.call(this, instance);
    };

    Keet.prototype.link = function link(id) {
      // The target DOM where the rendering will took place.
      if (!id) assert(id, 'No id is given as parameter.');
      this.el = id;
      this.render();
      return this;
    };

    Keet.prototype.render = function render(stub) {
      // life-cycle method before rendering the component
      if (this.componentWillMount && typeof this.componentWillMount === 'function') {
        this.componentWillMount();
      }

      // Render this component to the target DOM
      if (stub) {
        this.IS_STUB = true;
      }
      parseStr.call(this, stub);
    };

    Keet.prototype.callBatchPoolUpdate = function callBatchPoolUpdate() {
      // force component to update, if any state / non-state
      // value changed DOM diffing will occur
      updateContext.call(this, morpher, 1);
    };
    // pub-sub of the component, a component can subscribe to changes
    // of another component, this is the subscribe method


    Keet.prototype.subscribe = function subscribe(fn) {
      this.exec = fn;
    };
    // pub-sub of the component, a component can subscribe to changes
    // of another component, this is the publish method


    Keet.prototype.inform = function inform(model) {
      this.exec && typeof this.exec === 'function' && this.exec(model);
    };

    // store in global ref


    Keet.prototype.storeRef = function storeRef(name) {
      window.__keetGlobalComponentRef__ = window.__keetGlobalComponentRef__ || {};
      if (window.__keetGlobalComponentRef__[name]) {
        assert(false, 'The component name: ' + name + ' already exist in the global pool.');
      } else {
        window.__keetGlobalComponentRef__[name] = this;
      }
    };

    createClass(Keet, null, [{
      key: 'indentity',
      get: function get$$1() {
        return genId();
      }
    }]);
    return Keet;
  }();

  exports.default = Keet;
  exports.html = html;
  exports.createModel = createModel;

  return exports;

}({}));
//# sourceMappingURL=keet-bundle.js.map
