Chip
---
The Chip component is used by the ChipsLayout. It displays a simple rounded tag with an close icon.

## Props

### children (required)

_Type_: `node`  

The inner content of the chip

### onRemove (optional)

_Type_: `function (event)`  

Callback that is executed when the tag is supposed to be removed.

## Usage:

```markup
import { Chip, ChipsLayout } from 'Templates/components';

<ChipsLayout>
  <Chip>foo</Chip>
  <Chip>bar</Chip>
</ChipsLayout>
```
This will create a List of tags.
