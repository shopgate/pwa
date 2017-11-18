# SheetHeader
---

The `SheetHeader` component is used inside the `Sheet`.

## Getting Started

```
import { Sheet } from 'Templates/components';

<Sheet.Header title="My Sheet">
  ...
</Sheet.Header>
```

## Props

### onToggleClose

_Type_: `Function`  
_Default_: `() => {}`  

Function to be called when the close button is toggled.

###### Usage:

```
const toggleClosed = () => { ... };
```
```
<Sheet.Header onToggleClose={toggleClosed}/>
```

### title

_Type_: `string`  
_Default_: `''`  

The title of the Sheet Header.

###### Usage:
```
<Sheet.Header title='My Title'>
  ...
</Sheet.Header>
```
---
