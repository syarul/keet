<a name="module_keet"></a>

## keet
**Example**  
```js
import Keet from 'keet'class App extends Keet {  contructor() {    super()    // props   }  // new extended method  myMethod(...args){    //   }}const app = new App()
```

* [keet](#module_keet)
    * [~Keet](#module_keet..Keet)
        * [new Keet(name)](#new_module_keet..Keet_new)
        * [.mount(instance)](#module_keet..Keet+mount)
        * [.link(id)](#module_keet..Keet+link)
        * [.callBatchPoolUpdate()](#module_keet..Keet+callBatchPoolUpdate)
        * [.subscribe(fn)](#module_keet..Keet+subscribe)
        * [.inform(...value)](#module_keet..Keet+inform)
        * [.storeRef(name)](#module_keet..Keet+storeRef)

<a name="module_keet..Keet"></a>

### keet~Keet
The main constructor of Keet

**Kind**: inner class of [<code>keet</code>](#module_keet)  

* [~Keet](#module_keet..Keet)
    * [new Keet(name)](#new_module_keet..Keet_new)
    * [.mount(instance)](#module_keet..Keet+mount)
    * [.link(id)](#module_keet..Keet+link)
    * [.callBatchPoolUpdate()](#module_keet..Keet+callBatchPoolUpdate)
    * [.subscribe(fn)](#module_keet..Keet+subscribe)
    * [.inform(...value)](#module_keet..Keet+inform)
    * [.storeRef(name)](#module_keet..Keet+storeRef)

<a name="new_module_keet..Keet_new"></a>

#### new Keet(name)

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | ***optional*** A name to store in global ref |

<a name="module_keet..Keet+mount"></a>

#### keet.mount(instance)
Mount an instance of html/string template

**Kind**: instance method of [<code>Keet</code>](#module_keet..Keet)  

| Param | Type | Description |
| --- | --- | --- |
| instance | <code>Object</code> \| <code>String</code> | the html/string template |

<a name="module_keet..Keet+link"></a>

#### keet.link(id)
Link to DOM node attribute ```id```

**Kind**: instance method of [<code>Keet</code>](#module_keet..Keet)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | the id of the node |

<a name="module_keet..Keet+callBatchPoolUpdate"></a>

#### keet.callBatchPoolUpdate()
Recheck all states if anything changed, diffing will occurs.this method is ***asynchronous*** and ***trottled***, you can call it from a loop andonly trigger diffing when the loop end

**Kind**: instance method of [<code>Keet</code>](#module_keet..Keet)  
<a name="module_keet..Keet+subscribe"></a>

#### keet.subscribe(fn)
Another component can subscribe to changes on this component. This is the subscribe method

**Kind**: instance method of [<code>Keet</code>](#module_keet..Keet)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the callback function for the subscribe |

<a name="module_keet..Keet+inform"></a>

#### keet.inform(...value)
Another component can subscribe to changes on this component. This is the publish method

**Kind**: instance method of [<code>Keet</code>](#module_keet..Keet)  

| Param | Type | Description |
| --- | --- | --- |
| ...value | <code>\*</code> | one or more parameters to publish to subscribers |

<a name="module_keet..Keet+storeRef"></a>

#### keet.storeRef(name)
Store referance in the global space, with this the parent component do needto store/assign it as a property while still be able to look for the sub-componentto initialize it

**Kind**: instance method of [<code>Keet</code>](#module_keet..Keet)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Identifier for the component, should be unique to avoid conflict |

