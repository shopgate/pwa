Chip
---
The Chip component is used by the ChipsLayout. It displays a simple rounded tag with an close icon.

## Usage:

```jsx
import ChipsLayout from '../ChipsLayout';
import Chip from '../Chip';

<ChipsLayout>
  <Chip>foo</Chip>
  <Chip>bar</Chip>
</ChipsLayout>
```
This will create a List of tags.

## Props

### children (required)

_Type_: `node`  

The inner content of the chip

### invert (optional)

_Type_: `boolean`  
_Default_: `false`  

If set, the chip will be displayed with an inverted background color.

### onClick (optional)

_Type_: `function (event)`  

Callback that is executed when the chip is clicked.

### onRemove (optional)

_Type_: `function (event)`  

Callback that is executed when the chip is supposed to be removed.

### removable (optional)

_Type_: `boolean`  
_Default_: `true`  

If set, the chip will include an icon to remove it.
