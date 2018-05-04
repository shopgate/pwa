ActionButton Component
---

The ActionButton serves as a clickable Button and can also show a loading indicator based on the loading prop.

## Getting Started

```jsx
import ActionButton from '../ActionButton';

<ActionButton onClick={handleClick} />
```

## Props

### onClick (required)

_Type_: `Function`  

Accepts a callback function for the components click event.

### loading

_Type_: `boolean`  
_Default_: `false`  

Shows a loading indicator if set to true.

###### Usage:

```jsx
<ActionButton loading={true} ... />
```
---
