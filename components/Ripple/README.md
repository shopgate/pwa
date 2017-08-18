# Ripple
---
The ripple component is a **Higher Order Component** that will render a Material Design style ripple effect on any element that is clicked or touched.

> **Note:** This component should only contain one single child as it will use this as it's reference, using multiple children should be avoided and may have unexpected consequences.

## Getting Started

```
import { Ripple } from 'Templates/components';

<Ripple>
  <MyChildComponent />
</Ripple>
```

## Props

### className

_Default_: `''`<br>
_Type_: `string`<br>

Additional classes that can be appended to the component's `className` attribute.

###### Usage:

```
<Ripple className="class1 class2">
  <MyChildComponent />
</Ripple>
```

### color

_Default_: `#000`<br>
_Type_: `string`<br>

The color of the Ripple. Maps directly to the CSS color attribute.

###### Usage:

```
<Ripple color="purple">
  <MyChildComponent />
</Ripple>
```

### fill

_Default_: `false`<br>
_Type_: `boolean`<br>

Setting this prop will change the behaviour of the Ripple to fill the area of the child element and to render the Ripple from the point of click/touch.

###### Usage:

```
<Ripple fill>
  <MyChildComponent />
</Ripple>
```

### overflow

_Default_: `false`<br>
_Type_: `boolean`<br>

Setting this prop will allow the Ripple effect to spill outside the boundary of the Ripple's child element.

###### Usage:

```
<Ripple overflow>
  <MyChildComponent />
</Ripple>
```
---
