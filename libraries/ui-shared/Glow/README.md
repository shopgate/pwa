# Glow
---
The glow component is used to highlight elements that are being interacted with.

## Props

### children (required)

_Type_: `node`  

The inner content of the glow component.


### color

_Default_: `colors.shade8`  
_Type_: `string`  

The color of the glow's background.

## Usage:

```jsx
<Glow color="yellow">
  ...
</Glow>
```

### className

_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's `className` attribute.

###### Usage:
```jsx
<Glow className="class1 class2">
  ...
</Glow>
```

### styles

_Default_: `{ container: {}, glow: {} }`  
_Type_: `Object`  

An object of keys with styles relating to inner parts of the Glow.

###### Usage:
```jsx
const styles = {
  container: {
    ...
  },
  glow: {
    ...
  }
};

<Glow styles={styles}>
  ...
</Glow>
```
