# PlaceholderParagraph
---

A simple colored block that represents a loading paragraph (multiple lines of text).

## Getting Started

```jsx
import PlaceholderParagraph from '../PlaceholderParagraph';

<PlaceholderParagraph>
  Hello World
</PlaceholderParagraph>
```

## Props

### children (required)

_Type_: `node`  

Children that will ONLY be rendered when ready is true.

###### Usage:

```jsx
<PlaceholderParagraph>
  <h1>foobar</h1>
</PlaceholderParagraph>
```

### className
_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's className attribute.

### lines

_Default_: `3`  
_Type_: `number`  

The number of lines, that shall be visualized by the component.

### ready

_Default_: `false`  
_Type_: `boolean`  

When ready children will be rendered, otherwise the placeholder will be shown.

###### Usage:

```jsx
<PlaceholderParagraph ready>
  <h1>foobar</h1>
</PlaceholderParagraph>
```

---
