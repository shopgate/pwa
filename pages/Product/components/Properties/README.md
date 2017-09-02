# ProductProperties
---

Component to display properties in a tabular layout.

> **Dependents:** <br> `<ProductTemplate />`

## Getting Started

```
import { ProductProperties } from 'Templates/component';

<ProductProperties properties={null} isAnimating />
```

## Props

### isAnimating (required)

_Type_: `boolean`<br>

When animating the component is not rendered! 

###### Usage:

```
<ProductProperties properties={null} isAnimating={false} />
```

### properties 

_Default_: `null`<br>
_Type_: `Object`<br>

A key-value object with product properties.
If null the component is not rendered!

###### Usage:

```
<ProductProperties 
  properties={{
    property1: 'value1',
    foo: 'bar',
    ...
  }}
  isAnimating={false}
/>
```
