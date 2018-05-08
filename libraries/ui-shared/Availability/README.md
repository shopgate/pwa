# Availability

This component will display the availability text label for a product.

## Getting Started

```jsx
import Availability from '../Availability';

<Availability text="Available" state="ok" />
```

## Props

### text (required)
_Type_: `string`

The text which the component shall display.

### state
_Default_: `'ok'`  
_Type_: `string`  

The state of the text. It will influence it's display color. Possible values are `'ok'`, `'warning'` and `'error'`.

###### Usage:

```jsx
<Availability text="Out of stock" state="error" />
```

### showWhenAvailable
_Default_: `false`  
_Type_: `boolean`

Tells if the component shall render the text, when the `state` indicates, that the related product is available. By default the component will only display texts with the states `'warning'` and `'error'`.

###### Usage:

```jsx
<Availability text="In stock" state="ok" showWhenAvailable />
```

### className
_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's className attribute.

###### Usage:

```jsx
<Availability className="class1 class2" />
```
---
