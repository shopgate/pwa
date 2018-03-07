# Icon
---
The Icon component is a simple component that will create a `<svg>` element.

## Getting Started

```markup
import { Icon } from 'Library/components';

<Icon content="..." viewBox="..." />
```

## Props

### content (required)

_Type_: `string`<br>

The content between the `svg` tags.

###### Usage:

```
<Icon content="..." />
```

### viewBox

_Default_: `0 0 24 24`<br>
_Type_: `string`<br>

The `viewBox` attribute of the `svg` element.

###### Usage:

```
<Icon viewBox="0 0 20 22" />
```

### className

_Default_: `''`<br>
_Type_: `string`<br>

Additional classes that can be appended to the component's `className` attribute.

###### Usage:

```
<Icon className="class1 class2" />
```

### size

_Default_: `24`<br>
_Type_: `number`<br>

The size of the `svg` element.

###### Usage:

```
<Icon size="16" />
```

---
