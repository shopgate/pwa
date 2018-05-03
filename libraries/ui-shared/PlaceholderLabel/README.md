# PlaceholderLabel
---

A simple colored block that represents a loading text.

## Getting Started

```jsx
import PlaceholderLabel from '../PlaceholderLabel';

<PlaceholderLabel>
  Hello World
</PlaceholderLabel>
```

## Props

### children

_Type_: `node`  

Children that will ONLY be rendered when ready is true.

###### Usage:

```jsx
<PlaceholderLabel>
  <h1>foobar</h1>
</PlaceholderLabel>
```

### ready

_Default_: `false`  
_Type_: `boolean`  

When ready children will be rendered, otherwise the placeholder will be shown.

###### Usage:

```jsx
<PlaceholderLabel ready>
  <h1>foobar</h1>
</PlaceholderLabel>
```

### className
_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's className attribute.

---
