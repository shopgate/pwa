Button Component
---

The Button component provides basic functionality for rendering generic types of buttons. 
There are no styles defined for the Button, so this component should not be utilized directly. 
Instead, one of the Button derivates provided by the template library may be used. 

## Getting Started

```
import { Button } from 'Library/components';

<Button onClick={handleClick} />
```

## Props

### className

_Default_: `''`  
_Type_: `string`

Additional classes that are to be appended to the Picker container.

###### Usage:

```
<Button className="class1 class2" ... />
```

### onClick

_Type_: `Function`  

Accepts a callback function for the components click event.

### disabled

_Type_: `boolean`  
_Default_: `false`  

Enables or disable the button.

###### Usage:

```
<Button disabled ... />
```
---
