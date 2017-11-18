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

_Type_: `Function  
_Default_: `() => {}  

Callback function that is triggered if the Sheet is opened.

###### Usage:

```
const handleOpen = () => { ... };
```
```
<Sheet onClose={handleOpen}/>
```

### onClose

_Type_: `Function  
_Default_: `() => {}  

Callback function that is triggered if the Sheet is closed.

###### Usage:

```
const handleClose = () => { ... };
```
```
<Sheet onClose={handleClose}/>
```

### title

_Type_: `string  
_Default_: `''  

The title of the Sheet.

###### Usage:
```
<Sheet title='My Title'>
  ...
</Sheet>
```

### duration

_Type_: `number  
_Default_: `300  

Duration of the open/close animation, in milliseconds.

###### Usage:
```
<Sheet duration={150}>
  ...
</Sheet>
```

### isOpen

_Type_: `boolean  
_Default_: `false  

Prop to set the open state of the component.

###### Usage:
```
<Sheet isOpen>
  ...
</Sheet>
```

---
