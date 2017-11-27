# VariantSelects
---

## Getting Started

```jsx
import VariantSelects from 'Pages/Product/components/VariantSelects'

// Object with all variants
const variants = {};

<VariantSelects variants={variants}/>
```

## Props

### variants (only needed for the HOC and not available in the VariantSelects)
_Type_: `Array`  
The response data of the _getProductVariants_ pipeline request. This prop needs to be applied to the wrapped component.


### handleSelectionUpdate(variantId, valueId)

_Type_: `function`  
_Default_: `() => {}`  

Callback function that is triggered if the user selects a characteristic

###### Usage:

```jsx
const onCharacteristicUpdate = (variantId, valueId) => {...}
```
```jsx
<VariantSelects onCharacteristicUpdate={onCharacteristicUpdate}/>
```

### closeDelay

_Type_: `number`  
_Default_: `200`  

Delay after a click until the Drawer starts closing

###### Usage:

```jsx
<VariantSelects closeDelay={300}/>
```


### selection

_Type_: `Array`  
_Default_: `[]`  

Array of all characteristics

###### Usage:

```js
const data = [
 {
   id: '2',
   label: 'Size',
   value: 'Pick a',
   selected: false,
   disabled: false,
   values: [
     { id: '1', label: 'S', disabled: false, selected: false },
     { id: '2', label: 'M', disabled: false, selected: true },
     { id: '4', label: 'XS', disabled: false, selected: false },
     { id: '5', label: 'XL', disabled: false, selected: false },
   ],
 },
];
```

```jsx
<VariantSelects selection={data}/>
```
---
