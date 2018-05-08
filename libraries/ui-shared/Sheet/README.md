# Sheet
---

The `Sheet` component is used as a page popup.

## Getting Started

```jsx
import Sheet from './Sheet';

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

```jsx
<Sheet>
  <ChildComponent />
</Sheet>
```

### animation

_Default_:

```jsx
{
  in: null,
  out: null,
}
```
_Type_: `Object`  

An object which contains classes for the in and out animation.

###### Usage:

```jsx
const sheetAnimation = {
  in: 'animate_in_class',
  out: 'animate_in_class'
};

<Drawer animation={sheetAnimation}>
  ...
</Drawer>
```

### onOpen

_Type_: `Function`  
_Default_: `() => {}`  

Callback function that is triggered if the Sheet is opened.

###### Usage:

```js
const handleOpen = () => { ... };
```
```jsx
<Sheet onClose={handleOpen}/>
```

### onClose

_Type_: `Function`  
_Default_: `() => {}`  

Callback function that is triggered if the Sheet is closed.

###### Usage:

```js
const handleClose = () => { ... };
```
```jsx
<Sheet onClose={handleClose}/>
```

### title

_Type_: `string`  
_Default_: `''`  

The title of the Sheet.

###### Usage:
```jsx
<Sheet title='My Title'>
  ...
</Sheet>
```

### duration

_Type_: `number`  
_Default_: `300`  

Duration of the open/close animation, in milliseconds.

###### Usage:
```jsx
<Sheet duration={150}>
  ...
</Sheet>
```

### isOpen

_Type_: `boolean`  
_Default_: `false`  

Prop to set the open state of the component.

###### Usage:
```jsx
<Sheet isOpen>
  ...
</Sheet>
```

---
