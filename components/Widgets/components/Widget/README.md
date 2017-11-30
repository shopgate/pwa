# React Component
---

The `Widget` component is responsible for displaying a widget in a particular location inside the widget grid.

> **Dependencies:**  
> `<Grid />`

## Getting Started

```jsx
import Widget from 'Components/Widgets/Widget';

<Widget config={...} component={...} />
```

## Props

### config (required)

_Type_: `Object`  

The `config` prop contains all of the necessary information to display the widget.  
This includes `col`, `row`, `width`, `height`, `type` and `settings`.

###### Usage:

```jsx
<Widget config={...} />
```

### component

_Default_: `null`  
_Type_: `React Element`  

The component that should render inside the widget.

###### Usage:

```jsx
<Widget component={...} />
```
---
