# Sheet
---

The `Sheet` component is used as a page popup.

## Getting Started

```
import { Sheet } from 'Templates/components';

<Sheet title="My Sheet">
  ...
</Sheet>
```

## Props

### children

_Default_: `null`
_Type_: `node`

Children that will be rendered.

###### Usage:

```
<Sheet>
  <ChildComponent />
</Sheet>
```

### animation

_Default_:

```
{
  in: null,
  out: null,
}
```
_Type_: `Object`

An object which contains classes for the in and out animation.

###### Usage:

```
const sheetAnimation = {
  in: 'animate_in_class',
  out: 'animate_in_class'
};

<Drawer animation={sheetAnimation}>
  ...
</Drawer>
```

### onOpen

_Type_: `Function`<br>
_Default_: `() => {}`<br>

Callback function that is triggered if the Sheet is opened.

###### Usage:

```
const handleOpen = () => { ... };
```
```
<Sheet onClose={handleOpen}/>
```

### onClose

_Type_: `Function`<br>
_Default_: `() => {}`<br>

Callback function that is triggered if the Sheet is closed.

###### Usage:

```
const handleClose = () => { ... };
```
```
<Sheet onClose={handleClose}/>
```

### title

_Type_: `string`<br>
_Default_: `''`<br>

The title of the Sheet.

###### Usage:
```
<Sheet title='My Title'>
  ...
</Sheet>
```

### duration

_Type_: `number`<br>
_Default_: `300`<br>

Duration of the open/close animation, in milliseconds.

###### Usage:
```
<Sheet duration={150}>
  ...
</Sheet>
```

### isOpen

_Type_: `boolean`<br>
_Default_: `false`<br>

Prop to set the open state of the component.

###### Usage:
```
<Sheet isOpen>
  ...
</Sheet>
```

---
