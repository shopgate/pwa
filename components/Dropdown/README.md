# Dropdown
---
This component slides it's child content up or down based on it's isOpen property.

## Getting Started

```markup
import { Dropdown } from 'Library/components';

<Dropdown isOpen={true}>
  <SomeContent />
</Dropdown>
```

## Props

### isOpen

_Default_: `undefined`<br>
_Type_: `boolean`<br>

Determines if the content of the Dropdown component is open (visible) or not.

###### Usage:

```
// This Dropdown is closed.
<Dropdown isOpen={false}>
  <SomeContent />
</Dropdown>
```
