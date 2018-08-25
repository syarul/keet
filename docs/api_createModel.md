---
id: api_createModel
title: createModel
---

<a name="module_keet/createModel"></a>

## keet/createModel
**Example**  
```js
import { createModel } from 'keet'

class myModel extends createModel {
  contructor() {
    super()
    // props 
  }
  // new extended method
  myMethod(...args){
    this.list = args 
  }
}

const MyModel = new myModel()
```

* [keet/createModel](#module_keet/createModel)
    * [module.exports](#exp_module_keet/createModel--module.exports) ⏏
        * [new module.exports(enableFiltering)](#new_module_keet/createModel--module.exports_new)
        * [.subscribe(fn)](#module_keet/createModel--module.exports+subscribe)
        * [.add(obj)](#module_keet/createModel--module.exports+add)
        * [.update(updateObj)](#module_keet/createModel--module.exports+update)
        * [.filter(prop, value)](#module_keet/createModel--module.exports+filter)
        * [.destroy(destroyObj)](#module_keet/createModel--module.exports+destroy)

<a name="exp_module_keet/createModel--module.exports"></a>

### module.exports ⏏
The model constructor, use with template literal having
```{{model:<myModel>}}<myModelTemplateString>{{/model:<myModel>}}```

**Kind**: Exported class  
<a name="new_module_keet/createModel--module.exports_new"></a>

#### new module.exports(enableFiltering)

| Param | Type | Description |
| --- | --- | --- |
| enableFiltering | <code>\*</code> | any truthy value |

<a name="module_keet/createModel--module.exports+subscribe"></a>

#### module.exports.subscribe(fn)
Subscribe to the model changes, the function callback first argument
is the ```model.list``` and the second argument is ```model.listFilter```

**Kind**: instance method of [<code>module.exports</code>](#exp_module_keet/createModel--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function callback for the subscribe |

<a name="module_keet/createModel--module.exports+add"></a>

#### module.exports.add(obj)
Add new object to the model list

**Kind**: instance method of [<code>module.exports</code>](#exp_module_keet/createModel--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | new object to add into the model list |

<a name="module_keet/createModel--module.exports+update"></a>

#### module.exports.update(updateObj)
Update existing object in the model list

**Kind**: instance method of [<code>module.exports</code>](#exp_module_keet/createModel--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| updateObj | <code>Object</code> | the updated properties |

<a name="module_keet/createModel--module.exports+filter"></a>

#### module.exports.filter(prop, value)
Filter the model data by selected properties, constructor
instantiation should be apply with boolean true as argument
to enable filtering

**Kind**: instance method of [<code>module.exports</code>](#exp_module_keet/createModel--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>standard</code> | property of the object |
| value | <code>standard</code> | property value |

<a name="module_keet/createModel--module.exports+destroy"></a>

#### module.exports.destroy(destroyObj)
Removed existing object in the model list

**Kind**: instance method of [<code>module.exports</code>](#exp_module_keet/createModel--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| destroyObj | <code>Object</code> | the object ref to remove from the model |

