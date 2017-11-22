# ProductProperties
---

Component to display properties in a tabular layout.

> **Dependents:** <br> `<ProductTemplate />`

## Getting Started

```
import ProductProperties from './ProductProperties';

<ProductProperties properties={null} />
```

## Props

### properties

_Default_: `null`  
_Type_: `Object`  

A key-value object with product properties. If null the component is not rendered!

###### Usage:

```jsx
<ProductProperties
  properties={{
    property1: 'value1',
    foo: 'bar',
    ...
  }}
/>
```
