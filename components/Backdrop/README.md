# Backdrop
---
This component transitions based on it's `isVisible` property. It is intended to be used to create a visible distinction between UI layers.

## Getting Started

```markup
import { Backdrop } from 'Library/components';

<Backdrop isVisible={true}>
  ...
</Backdrop>
```

## Props

### color

_Default_: `#000`
_Type_: `string`

The background color of the Backdrop. Will accept any valid `CSS` color value.

###### Usage:
```
<Backdrop color="red">
  ...
</Backdrop>
```

### duration

_Default_: `200`
_Type_: `number`

The transition duration.

###### Usage:

```
<Backdrop duration={300}>
  ...
</Backdrop>
```

### isVisible

_Default_: `false`
_Type_: `boolean`

Controls whether or not the Backdrop is visible.

###### Usage:

```
<Backdrop isVisible={true}>
  ...
</Backdrop>
```

### level

_Default_: `2`
_Type_: `number`

The layer of the Backdrop. Maps directly to the `z-index` style property.

###### Usage:

```
<Backdrop level={5}>
  ...
</Backdrop>
```

### onClick

_Default_: `() => {}`
_Type_: `Function`

A callback function that is fired when the Backdrop is clicked.

###### Usage:

```
const myFunc = () => {
  ...
};

<Backdrop onClick={myFunc}>
  ...
</Backdrop>
```

### opacity

_Default_: `50`
_Type_: `number`
_Value_: `[1...100]`

The opacity of the Backdrop.

###### Usage:

```
<Backdrop opacity={25}>
  ...
</Backdrop>
```
