# Ripple
---
The ripple component is a **Higher Order Component** that will render a Material Design style ripple effect on any element that is clicked or touched.

> **Note:** This component should only contain one single child as it will use this as it's reference, using multiple children should be avoided and may have unexpected consequences.

## Getting Started

```jsx
import Ripple from '../Ripple';

<Ripple>
  <MyChildComponent />
</Ripple>
```

## Props

### className

_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's `className` attribute.

###### Usage:

```jsx
<Ripple className="class1 class2">
  <MyChildComponent />
</Ripple>
```

### color

_Default_: `#000`  
_Type_: `string`  

The color of the Ripple. Maps directly to the CSS color attribute.

###### Usage:

```jsx
<Ripple color="purple">
  <MyChildComponent />
</Ripple>
```

### fill

_Default_: `false`  
_Type_: `boolean`  

Setting this prop will change the behaviour of the Ripple to fill the area of the child element and to render the Ripple from the point of click/touch.

###### Usage:

```
<Ripple fill>
  <MyChildComponent />
</Ripple>
```

### overflow

_Default_: `false`  
_Type_: `boolean`  

Setting this prop will allow the Ripple effect to spill outside the boundary of the Ripple's child element.

###### Usage:

```jsx
<Ripple overflow>
  <MyChildComponent />
</Ripple>
```

### size

_Default_: `null`  
_Type_: `number`  

The size of the ripple animation.

---
