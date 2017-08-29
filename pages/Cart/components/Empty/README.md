# Cart Empty
---

The Cart Empty component is shown inside the cart when no products are added to the cart.
It does not take any props. It simply shows a nice little animated SVG image.

## Getting Started

```
import { CartEmpty } from 'Templates/components';

<CartEmpty />
```

## Props

### goBackHistory (required)

_Type_: `function`<br>

The Cart Empty component shows a "Continue shopping" button. This prop delivers the callback function
that is triggered by clicking on the button.

###### Usage:

```
<CartEmpty goBackHistory={() => { ... }}/>
```
---
