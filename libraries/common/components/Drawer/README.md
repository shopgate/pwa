# Drawer
---
This component transitions based on it's `isOpen` property. It is intended to be used to provide an additional UI layer to a page.

## Getting Started

```markup
import { Drawer } from 'Library/components';

<Drawer isOpen={true}>
  <SomeContent />
</Drawer>
```

## Props

### className

_Default_: `''`
_Type_: `string`

Additional classes that can be appended to the component's `className` attribute.

###### Usage:
```
<Drawer className="class1 class2">
  ...
</Drawer>
```

### children

_Default_: `null`
_Type_: `node`

Children that will be rendered.

###### Usage:

```
<Drawer>
  <ChildComponent />
</Drawer>
```

### isOpen

_Default_: `false`
_Type_: `boolean`

Controls whether or not the drawer is open.

###### Usage:

```
<Drawer isOpen={true}>
  ...
</Drawer>
```

### onOpen

_Default_: `() => {}`
_Type_: `Function`

A callback function that is fired after the Drawer has been opened.

###### Usage:

```
const myFunc = () => {
  ...
};

<Drawer onOpen={myFunc}>
  ...
</Drawer>
```

### onClose

_Default_: `() => {}`
_Type_: `Function`

A callback function that is fired after the Drawer has been closed.

###### Usage:

```
const myFunc = () => {
  ...
};

<Drawer onClose={myFunc}>
  ...
</Drawer>
```

### animation

_Default_:

```
{
  duration: 300,
  easing: 'ease-out',
  from: null,
  set: null,
  to: null,
}
```
_Type_: `Object`

An object that describes the transition of the Drawer.

###### Usage:

```
const drawerAnimation = {
  from: {
    y: '100%'
  },
  to: {
    y: '0%'
  },
};

<Drawer animation={drawerAnimation}>
  ...
</Drawer>
```
