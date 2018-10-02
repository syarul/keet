
//
// Keetjs v4.2.4 Alpha release: https://github.com/keetjs/keet
// Minimalist view layer for the web
//
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//
// Copyright 2018, Shahrul Nizam Selamat
// Released under the MIT License.
//
var keet=function(t){"use strict";function e(t,e){"function"==typeof e&&e(t)}function i(t,e){var i=t.getElementById(e);i&&i.childNodes[1].remove()}function n(t,e,n){var o=void 0,r=void 0,l=void 0,a=void 0,s=void 0,c=void 0,d=void 0;if(Q[e]=Q[e]||{},c=this[e]&&this[e].enableFiltering?"listFilter":"list",Q[e][c]||(Q[e][c]=t.nextSibling.cloneNode(!0),t.nextSibling.remove(),i(this.__pristineFragment__,t.parentNode.id)),n&&(s=Q[e][c],void 0!==this[e]&&this[e].hasOwnProperty(c))){if(a=t.parentNode.nodeType===J?z(this.el):t.parentNode,t.parentNode.id&&!z(t.parentNode.id)&&(this[e].dirty=!0),o=this[e][c],!this[e].dirty)return void a.setAttribute("pristine-model","");for(r=0,d=o.length;r<d;)l=s.cloneNode(!0),n.call(this,l,null,o[r]),l.setAttribute("kdata-id",o[r]["kdata-id"]),a.insertBefore(l,a.lastChild),r++;this[e].dirty=!1}}function o(t,e){for(var i=void 0;t;)i=t,t=t.nextSibling,i&&i.nodeType===et?i.isEqualNode(e)?(i.remove(),e=e.nextSibling):o(i.firstChild,e):i.isEqualNode(e)&&(i.remove(),e=e.nextSibling)}function r(t,e){for(var i=void 0;e;)if(i=e,e=e.nextSibling,i.nodeType===et)r.call(this,t,i.firstChild);else if(i.nodeType===it&&i.nodeValue.match(Y)){var o=i.nodeValue.trim().match(tt);o.length&&(nt[t].models=nt[t].models||[],nt[t].models=nt[t].models.concat(o),n.call(this,i,o,null))}}function l(t,e,i,n,l){var a=this,s=void 0,c=void 0,d=void 0,u=document.createDocumentFragment();if("initial"!==i||nt.hasOwnProperty(e)){if("conditional-set"===i){if(!nt[e]||t.nextSibling.isEqualNode(nt[e].frag.firstChild))return;d=nt[e].frag.cloneNode(!0),nt[e].models&&nt[e].models.length&&nt[e].models.map(function(t){a[t].dirty=!0}),n.call(this,d.firstChild,l),t.parentNode.insertBefore(d,t.nextSibling)}}else for(c=t;c;)s=c,c=c.nextSibling,s.nodeType!==et&&s.nodeValue.match(X)?(c=null,nt[e]=nt[e]||{},o(this.__pristineFragment__.firstChild,u.firstChild),r.call(this,e,u.firstChild),nt[e].frag=u):s.nodeType!==it&&u.appendChild(s)}function a(t){for(;t;)ct=t,t=t.nextSibling,ct.nodeType===ot?a.call(this,ct.firstChild):ct.nodeType===rt&&ct.nodeValue.match(lt)&&(st=ct.nodeValue.trim().match(at),dt=dt.concat(st),ut=ut.concat(ct))}function s(t){dt=[],ut=[],a.call(this,this.base.firstChild);for(var i=dt.length;i>0;)i--,e(dt[i],t.bind(this)),l.call(this,ut[i],dt[i],"initial")}function c(t){if(window&&"object"===ht(window.__keetGlobalComponentRef__)){var e=window.__keetGlobalComponentRef__.map(function(t){return t.identifier}).indexOf(t);if(~e)return window.__keetGlobalComponentRef__[e].component}}function d(t,e){var i=t.replace("component:",""),n=this[i]||c(i);void 0!==n?vt[n.ID]?z(n.el)?(e.parentNode.replaceChild(vt[n.ID].cloneNode(!0),e),n.callBatchPoolUpdate()):(n.base=n.__pristineFragment__.cloneNode(!0),n.cycleVirtualDomTree(!0),e.parentNode.replaceChild(n.base,e)):(n.cycleVirtualDomTree(!0),vt[n.ID]=n.base.cloneNode(!0),e.parentNode.replaceChild(n.base,e)):H(!1,"Component "+i+" does not exist.")}function u(t){var e=void 0,i=void 0;return"string"==typeof t&&(e=t.match(gt),e&&e.length&&(this.IS_SVG=!0,e.map(function(e){i=W(),bt[i]=e,t=t.replace(e,"<!-- {{svg:"+i+"}} -->")}))),t}function h(t){for(var e=void 0;t;)e=t,t=t.nextSibling,e.nodeType===Ct?h(e.firstChild):e.nodeType===yt&&" "===e.nodeValue&&e.remove()}function f(t,e){var i=document.createElement("div");for(i.innerHTML=e,h(i.firstChild);i.firstChild;)t.appendChild(i.firstChild)}function p(t){if(t.match(/([^?]*)\?([^:]*):([^;]*)|(\s*=\s*)[^;]*/g)){var e=t.split("?"),i=e[0],n=e[1].split(":")[0],o=e[1].split(":")[1];return!!this&&(this[i]?{value:_t(n),state:i}:{value:_t(o),state:i})}return!1}function m(t,i,n){i&&(n=!1),i=i||this;var o=t.match(/{{([^{}]+)}}/g);for(xt=t,It=0,Dt=o.length;It<Dt;It++){if(Nt=o[It].replace(/{{([^{}]+)}}/g,"$1"),St=p.call(i,Nt),wt=kt(Nt),St)e(Nt,n),xt=xt.replace("{{"+Nt+"}}",St.value);else if(wt){if("this"===wt[0]&&"function"==typeof this[wt[1]]){var r=this[wt[1]](i);void 0!==r&&(xt=xt.replace("{{"+Nt+"}}",r))}}else void 0!==i[Nt]&&(e(Nt,n),xt=xt.replace("{{"+Nt+"}}",i[Nt]));At=xt.match(Tt),At&&(xt=17===At[0].length?xt.replace(' checked="checked"'," checked"):xt.replace(' checked=""',""))}return xt}function v(t,e,i,n){var o=t.replace("svg:",""),r=bt[o],l=m.call(this,r,i,n);l.match(Vt)||(f(Ot,l),e.parentNode.replaceChild(Ot.firstChild,e))}function g(t,e,i,o,r){var l=void 0,a=void 0;t.match(Pt)&&(l=t.replace(Pt,"$1").trim(),l.match(Rt)?(a=l.replace("model:",""),n.call(this,e,a,i)):l.match(jt)?d.call(this,l,e):this.IS_SVG&&l.match(Et)&&v.call(this,l,e,o,r))}function b(t,e,i){t.nodeValue=t.nodeValue.replace(RegExp(e,"g"),i)}function y(t,i,n,o,r){var l=t.match(Ft);if(l){for(var a=l.length,s=void 0,c=void 0,d=void 0,u=this,h=r||this,f=0;f<a;){if(s=l[f].replace(Ft,"$1"),c=p.call(h,s),d=kt(s))if(o)if("this"===d[0]&&void 0!==u[d[1]]&&"function"==typeof u[d[1]]){var m=u[d[1]](h);t=void 0!==m?m:t}else e(s,n),t=t.replace(l[f],u[d[0]][d[1]]);else if("this"===d[0]&&void 0!==u[d[1]]&&"function"==typeof u[d[1]]){var v=u[d[1]]();void 0!==v&&b(i,"{{"+s+"}}",v)}else e(s,n),b(i,"{{"+s+"}}",u[d[0]][d[1]]);else c?(e(c.state,n),o?t=t.replace(l[f],c.value):(s=s.replace("?","\\?"),b(i,"{{"+s+"}}",c.value))):void 0!==h[s]&&(e(s,n),o?t=t.replace(l[f],h[s]):b(i,"{{"+s+"}}",h[s]));f++}return t}}function C(t,e,i){var n=t.attributes,o=0,r=void 0,l=void 0,a=void 0;for(o=n.length;o--;)r=n[o],a=r.localName,l=r.nodeValue,Mt.test(a)?(t.removeAttribute(a),a=y.call(this,a,t,e,!0,i),t.setAttribute(a,l)):Mt.test(l)&&(l=y.call(this,l,t,e,!0,i),"checked"===a?""===l?t.removeAttribute(a):t.setAttribute(a,""):""===l?t.setAttribute(a,""):t.setAttribute(a,l))}function _(t,e){for(var i=void 0;e;){if(i=e,e=e.parentNode,i.nodeType===Ut&&i.hasAttribute("kdata-id"))return{id:i.getAttribute("kdata-id"),node:i};i.isEqualNode(t)&&(e=null)}}function k(t,e){var i=Object.keys(e)[0],n=e[i];void 0!==this[n]&&"function"==typeof this[n]&&t.addEventListener(i,this[n].bind(this),!!e.useCapture)}function T(t,e,i,n){if(n.stopPropagation(),n.target!==n.currentTarget){var o=_(i,n.target);this[e](t.list[Gt(o.id,t)],n.target,o.node,n)}}function x(t,e){var i=Object.keys(e)[0],n=e[i];if(void 0!==this[n]&&"function"==typeof this[n]){var o=t.firstChild.nodeValue.replace(Bt,"$1").trim();o=o.replace("model:","");t.addEventListener(i,T.bind(this,this[o],n,t),!!e.useCapture)}}function N(t){for(var e=t.attributes,i=0,n=void 0,o=void 0,r=void 0,l=void 0,a=void 0,s=[],c=void 0,d=void 0;i<e.length;)n=e[i],o=n.localName,r=n.nodeValue,/^k-/.test(o)&&(l=o.replace(/^k-/,""),a=r.match(/[a-zA-Z]+(?![^(]*\))/)[0],d=r.match(/\(([^{}]+)\)/),d=d?d[1]:"",c={},c[l]=a,d&&(c[d]=!0),c.isModel=!1,s.push(c),t.hasChildNodes()&&t.firstChild.nodeType!==zt&&t.firstChild.nodeValue.match(Wt)&&(c.isModel=!0)),i++;return s}function S(t,e,i){for(var n=this;t;)Jt=t,t=t.nextSibling,Jt.nodeType===zt?(Jt.hasAttributes()&&(C.call(this,Jt,e,i),z(Jt.id)||(Kt=N.call(this,Jt),Kt.length&&Kt.map(function(t){t.isModel?x.call(n,Jt,t):k.call(n,Jt,t),Jt.removeAttribute("k-"+Object.keys(t)[0])}))),S.call(this,Jt.firstChild,e,i)):Jt.nodeType===Ht&&Jt.nodeValue.match(Lt)?(Zt=Jt.nodeValue.trim().match(qt),Zt=Zt&&Zt[0],this[Zt]&&l.call(this,Jt,Zt,"conditional-set",I,e)):Jt.nodeType===Ht&&Jt.nodeValue.match($t)&&!Jt.nodeValue.match(Lt)?g.call(this,Jt.nodeValue,Jt,I,i,e):y.call(this,Jt.nodeValue,Jt,e,null,i)}function I(){S.apply(this,arguments)}function D(t){for(;t;)te=t,t=t.nextSibling,te.nodeType===Xt?D.call(this,te.firstChild):te.nodeType===Yt&&te.nodeValue.match(Qt)&&te.remove()}function A(){D.apply(this,arguments)}function w(t,e){return M(t,e)||V(t,e)||t.isEqualNode(e)}function V(t,e){return O(t)&&O(e)}function O(t){return null!=t.getAttribute("data-ignore")}function P(t,e){"INPUT"===t.nodeName&&t.checked!==e.checked&&(t.checked=e.checked)}function R(t,e){for(var i=e.attributes,n={},o=0;o<i.length;)n[i[o].name]=i[o].value,o++;for(var r=t.attributes,l={},a=0;a<r.length;)l[r[a].name]=r[a].value,a++;for(var s in n)t.attributes[s]&&t.attributes[s].name===s&&t.attributes[s].value!==n[s]?t.setAttribute(s,n[s]):t.hasAttribute(s)||/^k-/.test(s)||t.setAttribute(s,n[s]);for(var c in l)e.attributes[c]&&t.attributes[c]||t.removeAttribute(c)}function j(t,e){if(t.nodeType===e.nodeType)if(t.nodeType===ee){if(P(t,e),w(t,e))return;t.nodeName===e.nodeName?(F(t.firstChild,e.firstChild),R(t,e)):t.parentNode.replaceChild(e,t)}else t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue);else t.parentNode.replaceChild(e,t)}function E(t,e){return t.length-e-1}function F(t,e){for(var i=0,n=[];e;)i++,ie=e,e=e.nextSibling,n.push(ie);for(var o=void 0,r=t&&t.parentNode;t;)if(i--,ne=t,t=t.nextSibling,o=E(n,i),ne&&n[o]?j(ne,n[o]):ne&&!n[o]&&r.removeChild(ne),null===t)for(;i>0;)i--,o=E(n,i),r.appendChild(n[o])}function M(t,e){return t&&R(t,e),e.hasAttribute("pristine-model")}function U(t){var e=z(this.el);e&&!this.IS_STUB?F(e.firstChild,t):e&&!M(null,t)&&F(e.firstChild,t.firstChild)}function B(){de[this.ID]&&(de[this.ID]=[])}function G(t){de[this.ID]=de[this.ID]||[],de[this.ID].indexOf(t)===-1&&(de[this.ID]=de[this.ID].concat(t))}function L(t){s.call(this,G.bind(this)),I.call(this,this.base.firstChild,G.bind(this)),A.call(this,this.base.firstChild);var e=t||z(this.el);e?(e.nodeType===he?e.setAttribute("data-ignore",""):(H(1===this.base.childNodes.length,"Sub-component should only has a single rootNode."),!this.base.firstChild.hasAttribute("data-ignore")&&this.base.firstChild.setAttribute("data-ignore","")),ce.call(this),t||e.appendChild(this.base),this.componentDidMount&&"function"==typeof this.componentDidMount&&this.componentDidMount()):H(!1,'No element id: "'+this.el+'" exist or is this a child component?')}function q(t){var e=void 0,i=document.createDocumentFragment();return B.call(this),"string"==typeof t?(e=t.trim().replace(/\s+/g," "),e=u.call(this,e),f(i,e)):"object"===(void 0===t?"undefined":ht(t))&&t.nodeType?t.nodeType===ye?i.appendChild(t):t.nodeType===ge?i=t:t.nodeType===be?i.appendChild(t):H(!1,"Unable to parse instance, unknown type."):H(!1,"Parameter is not a string or a html element."),this.__pristineFragment__=i.cloneNode(!0),this.base=i,this}var $=function(){var t=function(){return(1*Math.random()*1e17).toString(36)};return"KDATA-"+t()+"-"+t()},W=function(){return(1*Math.random()*1e17).toString(36)},z=function(t){return document.getElementById(t)},H=function(t,e){if(!t)throw Error("(keet) "+e)},K=function(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];var n=e.shift(),o=e.slice(),r=n.raw.reduce(function(t,e,i){return t+o[i-1]+e});return r=r.split(/\n+/),r=r.map(function(t){return t.trim()}).join("")},Z=function(){return function(t){t.IS_STUB=!0}},J=11,Q={},X=/\{\{\/([^{}]+)\}\}/g,Y=/\{\{model:([^{}]+)\}\}/g,tt=/([^{{model:])(.*?)(?=\}\})/g,et=1,it=8,nt={},ot=1,rt=8,lt=/\{\{\?([^{}]+)\}\}/g,at=/([^{?])(.*?)(?=\}\})/g,st=void 0,ct=void 0,dt=void 0,ut=void 0,ht="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ft=function(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,i){function n(o,r){try{var l=e[o](r),a=l.value}catch(t){return void i(t)}return l.done?void t(a):Promise.resolve(a).then(function(t){n("next",t)},function(t){n("throw",t)})}return n("next")})}},pt=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),mt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t},vt={},gt=/(<svg)([^<]*|[^>]*)(.*?)(?=<\/svg>)/g,bt={},yt=3,Ct=1,_t=function(t){return"''"===t||'""'===t||"null"===t?"":t},kt=function(t){var e=t.match(/\.*\./g);return e&&e.length>0?t.split("."):void 0},Tt=RegExp(/(\schecked=")(.*?)(?=")/g),xt="",Nt=void 0,St=void 0,It=void 0,Dt=void 0,At=void 0,wt=void 0,Vt=/{{([^{}]+)}}/g,Ot=document.createDocumentFragment(),Pt=/{{([^{}]+)}}/g,Rt=/^model:/g,jt=/^component:([^{}]+)/g,Et=/^svg:([^{}]+)/g,Ft=/{{([^{}]+)}}/g,Mt=/{{([^{}]+)}}/g,Ut=1,Bt=/{{([^{}]+)}}/g,Gt=function(t,e){return e.list.map(function(t){return t["kdata-id"]}).indexOf(t)},Lt=/\{\{\?([^{}]+)\}\}/g,qt=/([^{?])(.*?)(?=\}\})/g,$t=/{{([^{}]+)}}/g,Wt=/\{\{model:([^{}]+)\}\}/g,zt=1,Ht=8,Kt=void 0,Zt=void 0,Jt=void 0,Qt=/{{([^{}]+)}}/g,Xt=1,Yt=8,te=void 0,ee=1,ie=void 0,ne=void 0,oe=0,re=function(){ue.call(this),this.componentDidUpdate&&"function"==typeof this.componentDidUpdate&&this.componentDidUpdate()},le={},ae=function(t,e){var i=this;le[this.ID]=le[this.ID]||null,clearTimeout(le[this.ID]),le[this.ID]=setTimeout(function(){return t.call(i)},e)},se=function t(e){var i=this,n=void 0,o=void 0;if(de[this.ID]&&e<de[this.ID].length){if(n=de[this.ID][e],o=this[n],void 0===o&&(o=kt(n)),o&&Array.isArray(o)){var r=this[o[0]][o[1]];Object.defineProperty(this[o[0]],o[1],{enumerable:!1,configurable:!0,get:function(){return r},set:function(t){r=t,ae.call(i,re,oe)}})}else Object.defineProperty(this,n,{enumerable:!1,configurable:!0,get:function(){return o},set:function(t){o=t,ae.call(i,re,oe)}});e++,t.call(this,e)}},ce=function(){se.call(this,0)},de={},ue=function(){this.base=this.__pristineFragment__.cloneNode(!0),I.call(this,this.base.firstChild,G.bind(this)),A.call(this,this.base.firstChild),U.call(this,this.base.firstChild)},he=1,fe=function(t,e){return t["kdata-id"]!==e["kdata-id"]},pe={},me=function(){for(var t=this,e=arguments.length,i=Array(e),n=0;n<e;n++)i[n]=arguments[n];pe[this.mId]&&clearTimeout(pe[this.mId]),pe[this.mId]=setTimeout(function(){return t.exec&&"function"==typeof t.exec&&t.exec.apply(null,i)},0)},ve=function(){function t(e){this.mId=t.genIdentity,pe[this.mId]=null,this.enableFiltering=e||null,this.model=[],Object.defineProperty(this,"list",{enumerable:!1,configurable:!0,get:function(){return this.model},set:function(t){this.model=t,this.dirty=!0,me.call(this,this.model,this.listFilter)}}),Object.defineProperty(this,"listFilter",{enumerable:!1,configurable:!0,get:function(){var t=this;return this.prop?this.model.filter(function(e){return e[t.prop]===t.value}):this.model}})}return t.prototype.subscribe=function(t){this.exec=t},t.prototype.add=function(t){this.list=this.list.concat(mt({},t,{"kdata-id":W()}))},t.prototype.update=function(t){this.list=this.list.map(function(e){return fe(e,t)?e:t})},t.prototype.filter=function(t,e){this.prop=t,this.value=e,this.list=this.list},t.prototype.destroy=function(t){this.list=this.list.filter(function(e){return fe(e,t)})},pt(t,null,[{key:"genIdentity",get:function(){return W()}}]),t}(),ge=11,be=3,ye=1;return t.default=function(){function t(e){e&&(this.LOCAL=!0),this.ID=t.indentity,this.autoRender()}return t.prototype.autoRender=function(){function t(){return e.apply(this,arguments)}var e=ft(regeneratorRuntime.mark(function t(){var e,i;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.el;case 2:if("function"!=typeof this.render){t.next=9;break}if(e=this.render(),this.mount(e),i=Object.getPrototypeOf(this),!(this.IS_STUB||i&&i.constructor.IS_STUB)){t.next=8;break}return t.abrupt("return");case 8:this.cycleVirtualDomTree();case 9:case"end":return t.stop()}},t,this)}));return t}(),t.prototype.mount=function(t){return this.LOCAL||(this.el?this.storeRef(this.el):H(!1,"Component has no unique identifier.")),q.call(this,t)},t.prototype.cycleVirtualDomTree=function(t){this.componentWillMount&&"function"==typeof this.componentWillMount&&this.componentWillMount(),t&&(this.IS_STUB=!0),L.call(this,t)},t.prototype.callBatchPoolUpdate=function(){ae.call(this,re,1)},t.prototype.subscribe=function(t){this.exec=this.exec||[],this.exec=this.exec.concat(t)},t.prototype.inform=function(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];this.exec.length&&this.exec.map(function(t){return t.apply(null,e)})},t.prototype.storeRef=function(t){window.__keetGlobalComponentRef__=window.__keetGlobalComponentRef__||[],~window.__keetGlobalComponentRef__.map(function(t){return t.identifier}).indexOf(t)?H(!1,"The component name: "+t+" already exist in the global pool."):window.__keetGlobalComponentRef__=window.__keetGlobalComponentRef__.concat({identifier:t,component:this})},pt(t,null,[{key:"indentity",get:function(){return $()}}]),t}(),t.html=K,t.CreateModel=ve,t.childLike=Z,t}({});
//# sourceMappingURL=keet-min.js.map