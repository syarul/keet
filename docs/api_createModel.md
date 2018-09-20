---
id: createModel
title: CreateModel
sidebar_label: CreateModel
---

## keet/CreateModel
**Example**  
```js
import { CreateModel } from 'keet'

class myModel extends CreateModel {
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

* [keet/CreateModel](#module_keet/CreateModel)
    * [.subscribe(fn)](#module_keet/CreateModel+subscribe)
    * [.add(obj)](#module_keet/CreateModel+add)
    * [.update(updateObj)](#module_keet/CreateModel+update)
    * [.filter(prop, value)](#module_keet/CreateModel+filter)
    * [.destroy(destroyObj)](#module_keet/CreateModel+destroy)

<a name="module_keet/CreateModel+subscribe"></a>

### keet/CreateModel.subscribe(fn)
Subscribe to the model changes, the function callback first argument
is the ```model.list``` and the second argument is ```model.listFilter```

**Kind**: instance method of [<code>keet/CreateModel</code>](#module_keet/CreateModel)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function callback for the subscribe |

<a name="module_keet/CreateModel+add"></a>

### keet/CreateModel.add(obj)
Add new object to the model list

**Kind**: instance method of [<code>keet/CreateModel</code>](#module_keet/CreateModel)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | new object to add into the model list |

<a name="module_keet/CreateModel+update"></a>

### keet/CreateModel.update(updateObj)
Update existing object in the model list

**Kind**: instance method of [<code>keet/CreateModel</code>](#module_keet/CreateModel)  

| Param | Type | Description |
| --- | --- | --- |
| updateObj | <code>Object</code> | the updated properties |

<a name="module_keet/CreateModel+filter"></a>

### keet/CreateModel.filter(prop, value)
Filter the model data by selected properties, constructor
instantiation should be apply with boolean true as argument
to enable filtering

**Kind**: instance method of [<code>keet/CreateModel</code>](#module_keet/CreateModel)  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>string</code> | property of the object |
| value | <code>Object</code> <code>string</code> <code>number</code> <code>Boolean</code> | property value |

<a name="module_keet/CreateModel+destroy"></a>

### keet/CreateModel.destroy(destroyObj)
Removed existing object in the model list

**Kind**: instance method of [<code>keet/CreateModel</code>](#module_keet/CreateModel)  

| Param | Type | Description |
| --- | --- | --- |
| destroyObj | <code>Object</code> | the object ref to remove from the model |

