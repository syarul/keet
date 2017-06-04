<a name="Keet"></a>

## Keet(tagName, context) ⇒ <code>constructor</code>
Keet constructor, each component is an instance of Keet

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tagName | <code>string</code> | ***optional*** element tag name, set the default template for this Instance, i.e 'div' |
| context | <code>object</code> | ***optional*** if using Keet inside a closure declare the context of said closure |


* [Keet(tagName, context)](#Keet) ⇒ <code>constructor</code>
    * [.register(instance, force, fn)](#Keet+register) ⇒ <code>context</code>
    * [.unreg()](#Keet+unreg) ⇒ <code>context</code>
    * [.template(tag, id)](#Keet+template) ⇒ <code>context</code>
    * [.compose(force, fn)](#Keet+compose) ⇒ <code>context</code>
    * [.preserveAttributes(argv)](#Keet+preserveAttributes) ⇒ <code>context</code>
    * [.vDomLoaded(cb)](#Keet+vDomLoaded) ⇒ <code>context</code>
    * [.link(id, value)](#Keet+link) ⇒ <code>context</code>
    * [.watch(instance, fn)](#Keet+watch) ⇒ <code>context</code>
    * [.watchObj(instance, fn)](#Keet+watchObj) ⇒ <code>context</code>
    * [.unWatch(instance)](#Keet+unWatch) ⇒ <code>context</code>
    * [.array(array, templateString, isAppend)](#Keet+array) ⇒ <code>context</code>
    * [.update(index, obj, fn)](#Keet+update) ⇒ <code>context</code>
    * [.remove(idx, fn)](#Keet+remove) ⇒ <code>context</code>
    * [.insert(obj, fn)](#Keet+insert) ⇒ <code>context</code>
    * [.unshift(fn, ...obj)](#Keet+unshift) ⇒ <code>context</code>
    * [.slice(fn, start, end)](#Keet+slice) ⇒ <code>context</code>
    * [.splice(fn, start, count, ...obj)](#Keet+splice) ⇒ <code>context</code>
    * [.bindListener(inputId, listener, type)](#Keet+bindListener) ⇒ <code>context</code>
    * [.removeListener(inputId, type)](#Keet+removeListener) ⇒ <code>context</code>
    * [.set(value, vProp)](#Keet+set) ⇒ <code>context</code>

<a name="Keet+register"></a>

### keet.register(instance, force, fn) ⇒ <code>context</code>
Register this component instance as a child of a parent component i.e.Updates on child are automatically updated to parent whenever the child called ```set/compose/link```.If you want to have control over DOM mutation use ```Keet.prototype.compose``` instead.

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>string</code> | the parent component instance declared variable name. |
| force | <code>boolean</code> | ***optional*** force node render, if the node non-existent, apply false to the callback function |
| fn | <code>function</code> | ***optional*** run a callback function after this component loaded and assign this particular dom selector as arguments |

<a name="Keet+unreg"></a>

### keet.unreg() ⇒ <code>context</code>
Unregister this component instance from a parent component. Update on child component will not notify the parent automatically until parent called ```set/compose/link```

**Kind**: instance method of <code>[Keet](#Keet)</code>  
<a name="Keet+template"></a>

### keet.template(tag, id) ⇒ <code>context</code>
Wrap this component instance in a template i.e ```<div id="wrapper"></div>```. If the template has an id, it'll register that as well.

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | the template tagName |
| id | <code>string</code> | ***optional*** the template id |

<a name="Keet+compose"></a>

### keet.compose(force, fn) ⇒ <code>context</code>
Reevaluate the state of this component instance, if value changed from last update to DOM, update it again.

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| force | <code>boolean</code> | ***optional*** force node render, if the node non-existent, apply false to the callback function |
| fn | <code>function</code> | ***optional*** run a callback function after this component loaded and assign this particular dom selector as arguments |

<a name="Keet+preserveAttributes"></a>

### keet.preserveAttributes(argv) ⇒ <code>context</code>
Persist this instance state attributes and style regardless parent instance mutation

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| argv | <code>boolean</code> | ***optional*** undo the persistance changes |

<a name="Keet+vDomLoaded"></a>

### keet.vDomLoaded(cb) ⇒ <code>context</code>
Add callback function after component initialize

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | the function to associate with the callback event |

<a name="Keet+link"></a>

### keet.link(id, value) ⇒ <code>context</code>
Link this component instance to an attribute ```id```. If value is supplied, notify update to DOM.

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the id string |
| value | <code>object</code> &#124; <code>string</code> | ***optional*** value to parse into DOM |

<a name="Keet+watch"></a>

### keet.watch(instance, fn) ⇒ <code>context</code>
Observe this array for changes, once recieved make update to component. Operation supported areassignment, push, pop, shift, unshift, slice, splice and assign(is a wrapper for standard array assignment).

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | ***optional*** watch a different array instead |
| fn | <code>function</code> | ***optional*** execute a function once the dom has updated |

<a name="Keet+watchObj"></a>

### keet.watchObj(instance, fn) ⇒ <code>context</code>
Observe an object for changes in properties, once recieved delegate to a function callback

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | obj to watch |
| fn | <code>function</code> | the function call once observe property changed, arguments pass to the  function; (1st) the property attribute, (2nd) old value, (3rd) new value |

<a name="Keet+unWatch"></a>

### keet.unWatch(instance) ⇒ <code>context</code>
Unwatch an object or array

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>object</code> | obj/array to unwatch |

<a name="Keet+array"></a>

### keet.array(array, templateString, isAppend) ⇒ <code>context</code>
Set value for this component instance from an array of objects

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>object</code> | instance of the array |
| templateString | <code>string</code> | the template string i.e ```<li>{{index}} name:{{name}} age:{{age}}</li>```. Each handlebar is the reference to attribute in the ***array*** objects |
| isAppend | <code>boolean</code> | this value assign programmatically by other prototypes, avoid declaring this parameter |

<a name="Keet+update"></a>

### keet.update(index, obj, fn) ⇒ <code>context</code>
Update a particular index of the array.

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | the index target for replacement |
| obj | <code>object</code> | the new replacement object |
| fn | <code>function</code> | ***optional*** delegate the result array to a **function**, if returned, the return result is used instead |

<a name="Keet+remove"></a>

### keet.remove(idx, fn) ⇒ <code>context</code>
Remove a particular index from the array. Behavior is like ```Array.prototype.slice```

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| idx | <code>number</code> &#124; <code>obj</code> | the index for removal, if object is used like {index: someNumber}, Keet will map to look for the valid index |
| fn | <code>function</code> | ***optional*** delegate the result array to a **function**, if returned, the return result is used instead |

<a name="Keet+insert"></a>

### keet.insert(obj, fn) ⇒ <code>context</code>
Add a new object into the array. Behavior is like ```Array.prototype.push```

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | the object reference |
| fn | <code>function</code> | ***optional*** delegate the result array to a **function**, if returned, the return result is used instead |

<a name="Keet+unshift"></a>

### keet.unshift(fn, ...obj) ⇒ <code>context</code>
Add one ore more objects at the begining of the array. Behavior is like ```Array.prototype.unshift```

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | ***optional*** delegate the result array to a **function**, if returned, the return result is used instead |
| ...obj | <code>object</code> | [obj1[, ...[, objN]]], one or more of the objects |

<a name="Keet+slice"></a>

### keet.slice(fn, start, end) ⇒ <code>context</code>
Make shallow copy of current array, update DOM with the sliced. Behavior is like ```Array.prototype.slice```

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | ***optional*** delegate the result array to a **function**, if returned, the return result is used instead |
| start | <code>number</code> | zero-based index at which to begin extraction |
| end | <code>number</code> | ***optional*** zero-based index at which to end extraction |

<a name="Keet+splice"></a>

### keet.splice(fn, start, count, ...obj) ⇒ <code>context</code>
Removing existing elements and/or adding new elements. Behavior is like ```Array.prototype.splice```

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | ***optional*** delegate the result array to a **function**, if returned, the result is used instead |
| start | <code>number</code> | index at which to start changing the array |
| count | <code>number</code> | ***optional*** integer indicating the number of old array elements to remove |
| ...obj | <code>object</code> | one or more objects to insert into the array |

<a name="Keet+bindListener"></a>

### keet.bindListener(inputId, listener, type) ⇒ <code>context</code>
Event listener bindings, add an event listener to an input or any type event with a lookup to an id, subsequently notify the listener of the changes

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| inputId | <code>string</code> | the id of the event |
| listener | <code>object</code> &#124; <code>function</code> | the listener, a component instance or a function, if it a function second argument is the event |
| type | <code>string</code> | the type of this event listener |

<a name="Keet+removeListener"></a>

### keet.removeListener(inputId, type) ⇒ <code>context</code>
Remove event listener bindings

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| inputId | <code>string</code> | the id of the event |
| type | <code>string</code> | the type of this bind event listener |

<a name="Keet+set"></a>

### keet.set(value, vProp) ⇒ <code>context</code>
Setter for component instance, takes value as ```string```, ```object``` or ```number```. If supplied with a secondary argument the first argument is the attributes reference in type of either ```value/attributes/css```, to apply as DOM attributes use ```attr-[attributesName]``` i.e ```{attr-href: 'http://somelink.com'}```, to apply as style use ```css-[cssStyleProperty]``` i.e ```{css-background-color: 'grey'}```

**Kind**: instance method of <code>[Keet](#Keet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>object</code> &#124; <code>string</code> | a value can be an object, string or number |
| vProp | <code>string</code> | ***optional*** if specified, this is the property instead, while previous argument is the attribute |

