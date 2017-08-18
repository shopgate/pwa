# React Component
---

The `Widgets` component for displaying all widgets. It receives a `config` prop that it uses to build the individual widgets and maps them to the correct components.

> **Dependencies:**  
`<Grid />`, `<Widget />`

## Getting Started

```
import { Widgets } from 'Library/components';

<Widgets config={...} />
```

## Props

### config

_Type_: `Object`<br>

The `config` prop contains all of the necessary information to build the widgets.

###### Usage:

```
<Widgets config={...} />
```
---
