# Widgets
---

The `Widgets` component for displaying all widgets. It receives a `widgets` prop that it uses to build the individual widgets and maps them to the correct components.

> **Dependencies:**  
> `<Grid />`, `<Widget />`

## Getting Started

```jsx
import Widgets from '@shopgate/pwa-common/components/Widgets';

<Widgets background="orange" widgets={...} />
```

## Props

### background

_Type_: `string`  

The `background` prop will determine the background of the widget area.

### widgets

_Type_: `Object`  

The `widgets` prop contains all of the necessary information to build the widgets.
---
