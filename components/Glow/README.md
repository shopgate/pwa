# Glow
---
The glow component is used to highlight elements that are being interacted with.

## Props

### color

_Default_: `colors.shade8`<br>
_Type_: `string`<br>

The color of the glow's background.

## Usage:

```markup
<Glow color="yellow">
  ...
</Glow>
```

### className

_Default_: `''`
_Type_: `string`

Additional classes that can be appended to the component's `className` attribute.

###### Usage:
```
<Glow className="class1 class2">
  ...
</Glow>
```

### styles

_Default_: `{ container: {}, glow: {} }`
_Type_: `Object`

An object of keys with styles relating to inner parts of the Glow.

###### Usage:
```
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
