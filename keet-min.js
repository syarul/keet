
/**
 * Keetjs v4.0.0 Alpha release: https://github.com/keetjs/keet
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */
var keet=function(t){"use strict";function e(t,e){"function"==typeof e&&e(t)}function i(t,e){for(var n=void 0;t;)n=t,t=t.nextSibling,n&&n.nodeType===E?n.isEqualNode(e)?(n.remove(),e=e.nextSibling):i(n.firstChild,e):n.isEqualNode(e)&&(n.remove(),e=e.nextSibling)}function n(t,e,n,o,r){var l=void 0,a=void 0,s=void 0,d=document.createDocumentFragment();if("initial"!==n||R.hasOwnProperty(e)){if("conditional-set"===n){if(t.nextSibling.isEqualNode(R[e].frag.firstChild))return;s=R[e].frag.cloneNode(!0),o.call(this,s.firstChild,r),t.parentNode.insertBefore(s,t.nextSibling)}}else for(a=t;a;)l=a,a=a.nextSibling,l.nodeType!==E&&l.nodeValue.match(P)?(a=null,R[e]=R[e]||{},i(this.__pristineFragment__.firstChild,d.firstChild),R[e].frag=d):l.nodeType!==F&&d.appendChild(l)}function o(t){for(;t;)W=t,t=t.nextSibling,W.nodeType===U?o.call(this,W.firstChild):W.nodeType===B&&W.nodeValue.match(G)&&(L=W.nodeValue.trim().match(q),$=$.concat(L),z=z.concat(W))}function r(t){$=[],z=[],o.call(this,this.base.firstChild);for(var i=$.length;i>0;)i--,e($[i],t.bind(this)),n.call(this,z[i],$[i],"initial")}function l(t,e){var i=t.getElementById(e);i&&i.childNodes[1].remove()}function a(t,e,i){var n=void 0,o=void 0,r=void 0,a=void 0,s=void 0,d=void 0,u=void 0;if(H[e]=H[e]||{},d=this[e]&&this[e].enableFiltering?"listFilter":"list",H[e][d]||(H[e][d]=t.nextSibling.cloneNode(!0),t.nextSibling.remove(),l(this.__pristineFragment__,t.parentNode.id)),s=H[e][d],void 0!==this[e]&&this[e].hasOwnProperty(d)){if(a=t.parentNode,n=this[e][d],!this[e].dirty)return void a.setAttribute("pristine-model","");for(o=0,u=n.length;o<u;)r=s.cloneNode(!0),i.call(this,r,null,n[o]),r.setAttribute("kdata-id",n[o]["kdata-id"]),a.insertBefore(r,a.lastChild),o++;this[e].dirty=!1}}function s(t){if(window&&"object"===Y(window.__keetGlobalComponentRef__))return window.__keetGlobalComponentRef__[t]}function d(t,e){var i=t.replace("component:",""),n=this[i]||s(i);void 0!==n?it[n.ID]?J(n.el)?(e.parentNode.replaceChild(it[n.ID].cloneNode(!0),e),n.callBatchPoolUpdate()):(n.base=n.__pristineFragment__.cloneNode(!0),n.render(!0),e.parentNode.replaceChild(n.base,e)):(n.render(!0),it[n.ID]=n.base.cloneNode(!0),e.parentNode.replaceChild(n.base,e)):Q(!1,"Component "+i+" does not exist.")}function u(t,e,i){var n=void 0,o=void 0;t.match(nt)&&(n=t.replace(nt,"$1").trim(),n.match(ot)?(o=n.replace("model:",""),a.call(this,e,o,i)):n.match(rt)&&d.call(this,n,e))}function c(t){if(t.match(/([^?]*)\?([^:]*):([^;]*)|(\s*=\s*)[^;]*/g)){var e=t.split("?"),i=e[0],n=e[1].split(":")[0],o=e[1].split(":")[1];return!!this&&(this[i]?{value:lt(n),state:i}:{value:lt(o),state:i})}return!1}function h(t,e,i,n){t.nodeValue=t.nodeValue.replace(RegExp(i,"g"),n)}function f(t,i,n,o,r){var l=t.match(st);if(l)for(var a=l.length,s=void 0,d=void 0,u=void 0,f=this,p=r||this;a;)if(a--,s=l[a].replace(st,"$1"),d=c.call(p,s),u=at(s)){if(o){if("this"===u[0]&&void 0!==f[u[1]]&&"function"==typeof f[u[1]]){var m=f[u[1]](p);return void 0!==m?m:t}return e(s,n),t.replace(l,f[u[0]][u[1]])}if("this"===u[0]&&void 0!==f[u[1]]&&"function"==typeof f[u[1]]){var v=f[u[1]]();void 0!==v&&h(i,t,"{{"+s+"}}",v)}else e(s,n),h(i,t,"{{"+s+"}}",f[u[0]][u[1]])}else if(d){if(e(d.state,n),o)return t.replace(l,d.value);h(i,t,"{{"+s+"}}",d.value)}else if(void 0!==p[s]){if(e(s,n),o)return t.replace(l,p[s]);h(i,t,"{{"+s+"}}",p[s])}}function p(t,e,i){var n=t.attributes,o=0,r=void 0,l=void 0,a=void 0;for(o=n.length;o--;)r=n[o],a=r.localName,l=r.nodeValue,dt.test(a)?(t.removeAttribute(a),a=f.call(this,a,t,e,!0,i),t.setAttribute(a,l)):dt.test(l)&&(l=f.call(this,l,t,e,!0,i),"checked"===a?""===l?t.removeAttribute(a):t.setAttribute(a,""):""===l?t.setAttribute(a,""):t.setAttribute(a,l))}function m(t,e){for(var i=void 0;e;){if(i=e,e=e.parentNode,i.nodeType===ut&&i.hasAttribute("kdata-id"))return{id:i.getAttribute("kdata-id"),node:i};i.isEqualNode(t)&&(e=null)}}function v(t,e){var i=Object.keys(e)[0],n=e[i];void 0!==this[n]&&"function"==typeof this[n]&&t.addEventListener(i,this[n].bind(this),!!e.useCapture)}function b(t,e,i,n){if(n.stopPropagation(),n.target!==n.currentTarget){var o=m(i,n.target);this[e](t.list[ht(o.id,t)],n.target,o.node,n)}}function g(t,e){var i=Object.keys(e)[0],n=e[i];if(void 0!==this[n]&&"function"==typeof this[n]){var o=t.firstChild.nodeValue.replace(ct,"$1").trim();o=o.replace("model:","");t.addEventListener(i,b.bind(this,this[o],n,t),!!e.useCapture)}}function y(t){for(var e=t.attributes,i=0,n=void 0,o=void 0,r=void 0,l=void 0,a=void 0,s=[],d=void 0,u=void 0;i<e.length;)n=e[i],o=n.localName,r=n.nodeValue,/^k-/.test(o)&&(l=o.replace(/^k-/,""),a=r.match(/[a-zA-Z]+(?![^(]*\))/)[0],u=r.match(/\(([^{}]+)\)/),u=u?u[1]:"",d={},d[l]=a,u&&(d[u]=!0),d.isModel=!1,s.push(d),t.hasChildNodes()&&t.firstChild.nodeType!==bt&&t.firstChild.nodeValue.match(vt)&&(d.isModel=!0)),i++;return s}function _(t,e,i){for(var o=this;t;)Ct=t,t=t.nextSibling,Ct.nodeType===bt?(Ct.hasAttributes()&&(p.call(this,Ct,e,i),J(Ct.id)||(yt=y.call(this,Ct),yt.length&&yt.map(function(t){t.isModel?g.call(o,Ct,t):v.call(o,Ct,t),Ct.removeAttribute("k-"+Object.keys(t)[0])}))),_.call(this,Ct.firstChild,e,i)):Ct.nodeType===gt&&Ct.nodeValue.match(ft)?(_t=Ct.nodeValue.trim().match(pt),_t=_t&&_t[0],this[_t]&&n.call(this,Ct,_t,"conditional-set",C,e)):Ct.nodeType===gt&&Ct.nodeValue.match(mt)&&!Ct.nodeValue.match(ft)?u.call(this,Ct.nodeValue,Ct,C):f.call(this,Ct.nodeValue,Ct,e,null,i)}function C(t,e,i){_.call(this,t,e,i)}function N(t,e){return S(e)||k(t)&&k(e)||t.isEqualNode(e)}function k(t){return null!=t.getAttribute("data-ignore")}function I(t,e){"INPUT"===t.nodeName&&t.checked!==e.checked&&(t.checked=e.checked)}function T(t,e){for(var i=e.attributes,n={},o=0;o<i.length;)n[i[o].name]=i[o].value,o++;for(var r=t.attributes,l={},a=0;a<r.length;)l[r[a].name]=r[a].value,a++;for(var s in n)t.attributes[s]&&t.attributes[s].name===s&&t.attributes[s].value!==n[s]?t.setAttribute(s,n[s]):t.hasAttribute(s)||/^k-/.test(s)||t.setAttribute(s,n[s]);for(var d in l)e.attributes[d]&&t.attributes[d]||t.removeAttribute(d)}function A(t,e){if(t.nodeType===e.nodeType)if(t.nodeType===Nt){if(I(t,e),N(t,e))return;D(t.firstChild,e.firstChild),t.nodeName===e.nodeName?T(t,e):t.parentNode.replaceChild(e,t)}else t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue);else t.parentNode.replaceChild(e,t)}function x(t,e){return t.length-e-1}function D(t,e,i){for(var n=0,o=[];e;)n++,kt=e,e=i?null:e.nextSibling,o.push(kt);for(var r=void 0,l=t&&t.parentNode;t;)if(n--,It=t,t=i?null:t.nextSibling,r=x(o,n),It&&o[r]?A(It,o[r]):It&&!o[r]&&l.removeChild(It),null===t)for(;n>0;)n--,r=x(o,n),l.appendChild(o[r])}function S(t){return t.hasAttribute("pristine-model")}function w(t){var e=J(this.el);e&&!this.IS_STUB?D(e.firstChild,t):e&&!S(t)&&D(e.firstChild,t.firstChild)}function V(){Vt[this.ID]&&(Vt[this.ID]=[])}function O(t){Vt[this.ID]=Vt[this.ID]||[],Vt[this.ID].indexOf(t)===-1&&(Vt[this.ID]=Vt[this.ID].concat(t))}function j(t){r.call(this,O.bind(this)),C.call(this,this.base.firstChild,O.bind(this));var e=t||J(this.el);e?(e.nodeType===jt?e.setAttribute("data-ignore",""):(Q(1===this.base.childNodes.length,"Sub-component should only has a single rootNode."),!this.base.firstChild.hasAttribute("data-ignore")&&this.base.firstChild.setAttribute("data-ignore","")),wt.call(this),t||e.appendChild(this.base),this.componentDidMount&&"function"==typeof this.componentDidMount&&this.componentDidMount()):Q(!1,'No element with id: "'+this.el+'" exist.')}function M(t){var e=void 0,i=void 0,n=document.createDocumentFragment();if("string"==typeof t){e=t.trim().replace(/\s+/g," "),i=document.createElement("div"),i.innerHTML=e;for(var o=i.firstChild,r=void 0;o;)r=o,o=o.nextSibling,r.nodeType!==Ut&&" "!==r.nodeValue&&n.appendChild(r.cloneNode(!0))}else"object"===(void 0===t?"undefined":Y(t))&&t.nodeType?t.nodeType===Bt?n.appendChild(t):t.nodeType===Rt?n=t:t.nodeType===Ut?n.appendChild(t):Q(!1,"Unable to parse instance, unknown type."):Q(!1,"Parameter is not a string or a html element.");return this.__pristineFragment__=n.cloneNode(!0),this.base=n,V.call(this),this}var P=/\{\{\/([^{}]+)\}\}/g,E=1,F=8,R={},U=1,B=8,G=/\{\{\?([^{}]+)\}\}/g,q=/([^{?])(.*?)(?=\}\})/g,L=void 0,W=void 0,$=void 0,z=void 0,H={},K=function(){var t=function(){return(1*Math.random()*1e17).toString(36)};return"KDATA-"+t()+"-"+t()},Z=function(){return(1*Math.random()*1e17).toString(36)},J=function(t){return document.getElementById(t)},Q=function(t,e){if(!t)throw Error("(keet) "+e)},X=function(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];var n=e.shift(),o=e.slice(),r=n.raw.reduce(function(t,e,i){return t+o[i-1]+e});return r=r.split(/\n+/),r=r.map(function(t){return t.trim()}).join("")},Y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},tt=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),et=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t},it={},nt=/{{([^{}]+)}}/g,ot=/^model:/g,rt=/^component:([^{}]+)/g,lt=function(t){return"''"===t||'""'===t||"null"===t?"":t},at=function(t){var e=t.match(/\.*\./g);return e&&e.length>0?t.split("."):void 0},st=/{{([^{}]+)}}/g,dt=/{{([^{}]+)}}/g,ut=1,ct=/{{([^{}]+)}}/g,ht=function(t,e){return e.list.map(function(t){return t["kdata-id"]}).indexOf(t)},ft=/\{\{\?([^{}]+)\}\}/g,pt=/([^{?])(.*?)(?=\}\})/g,mt=/{{([^{}]+)}}/g,vt=/\{\{model:([^{}]+)\}\}/g,bt=1,gt=8,yt=void 0,_t=void 0,Ct=void 0,Nt=1,kt=void 0,It=void 0,Tt=0,At=function(){Ot.call(this),this.componentDidUpdate&&"function"==typeof this.componentDidUpdate&&this.componentDidUpdate()},xt={},Dt=function(t,e){var i=this;xt[this.ID]=xt[this.ID]||null,clearTimeout(xt[this.ID]),xt[this.ID]=setTimeout(function(){return t.call(i)},e)},St=function t(e){var i=this,n=void 0,o=void 0;if(Vt[this.ID]&&e<Vt[this.ID].length){if(n=Vt[this.ID][e],o=this[n],void 0===o&&(o=at(n)),o&&Array.isArray(o)){var r=this[o[0]][o[1]];Object.defineProperty(this[o[0]],o[1],{enumerable:!1,configurable:!0,get:function(){return r},set:function(t){r=t,Dt.call(i,At,Tt)}})}else Object.defineProperty(this,n,{enumerable:!1,configurable:!0,get:function(){return o},set:function(t){o=t,Dt.call(i,At,Tt)}});e++,t.call(this,e)}},wt=function(){St.call(this,0)},Vt={},Ot=function(){this.base=this.__pristineFragment__.cloneNode(!0),C.call(this,this.base.firstChild,O.bind(this)),w.call(this,this.base.firstChild)},jt=1,Mt=function(t,e){return t["kdata-id"]!==e["kdata-id"]},Pt={},Et=function(){for(var t=this,e=arguments.length,i=Array(e),n=0;n<e;n++)i[n]=arguments[n];Pt[this.mId]&&clearTimeout(Pt[this.mId]),Pt[this.mId]=setTimeout(function(){return t.exec&&"function"==typeof t.exec&&t.exec.apply(null,i)},0)},Ft=function(){function t(e){this.mId=t.genIdentity,Pt[this.mId]=null,this.enableFiltering=e||null,this.model=[],Object.defineProperty(this,"list",{enumerable:!1,configurable:!0,get:function(){return this.model},set:function(t){this.model=t,this.dirty=!0,Et.call(this,this.model,this.listFilter)}}),Object.defineProperty(this,"listFilter",{enumerable:!1,configurable:!0,get:function(){var t=this;return this.prop?this.model.filter(function(e){return e[t.prop]===t.value}):this.model}})}return t.prototype.subscribe=function(t){this.exec=t},t.prototype.add=function(t){this.list=this.list.concat(et({},t,{"kdata-id":Z()}))},t.prototype.update=function(t){this.list=this.list.map(function(e){return Mt(e,t)?e:t})},t.prototype.filter=function(t,e){this.prop=t,this.value=e,this.list=this.list},t.prototype.destroy=function(t){this.list=this.list.filter(function(e){return Mt(e,t)})},tt(t,null,[{key:"genIdentity",get:function(){return Z()}}]),t}(),Rt=11,Ut=3,Bt=1;return t.default=function(){function t(e){this.ID=t.indentity,e&&this.storeRef(e)}return t.prototype.mount=function(t){return M.call(this,t)},t.prototype.link=function(t){return t||Q(t,"No id is given as parameter."),this.el=t,this.render(),this},t.prototype.render=function(t){this.componentWillMount&&"function"==typeof this.componentWillMount&&this.componentWillMount(),t&&(this.IS_STUB=!0),j.call(this,t)},t.prototype.callBatchPoolUpdate=function(){Dt.call(this,At,1)},t.prototype.subscribe=function(t){this.exec=t},t.prototype.inform=function(t){this.exec&&"function"==typeof this.exec&&this.exec(t)},t.prototype.storeRef=function(t){window.__keetGlobalComponentRef__=window.__keetGlobalComponentRef__||{},window.__keetGlobalComponentRef__[t]?Q(!1,"The component name: "+t+" already exist in the global pool."):window.__keetGlobalComponentRef__[t]=this},tt(t,null,[{key:"indentity",get:function(){return K()}}]),t}(),t.html=X,t.createModel=Ft,t}({});
//# sourceMappingURL=keet-min.js.map