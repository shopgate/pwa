# React Component
---

The `Widget` component is responsible for displaying a widget in a particular location inside the widget grid.

> **Dependencies:**  
`<Grid />`

## Getting Started

```
import { Widget } from 'Library/components';

<Widget config={...} component={...} />
```

## Props

### config (required)

_Type_: `Object`<br>

The `config` prop contains all of the necessary information to display the widget.  
This includes `col`, `row`, `width`, `height`, `type` and `settings`.

###### Usage:

```
<Widget config={...} />
```

### component

_Default_: `null`<br>
_Type_: `React Element`<br>

The component that should render inside the widget.

###### Usage:

```
<Widget component={...} />
```
---
