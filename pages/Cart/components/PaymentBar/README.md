# CartPaymentBar
---

The CartPaymentBar is added to the bottom of the cart view and shows the cart's subtotal and shipping costs.

## Getting Started

```
import { CartPaymentBar } from 'Templates/components';

<CartPaymentBar subTotal={...} shipping={...} currency="..." />
```

## Props

### subTotal

_Type_: `number`<br>
_Default_: `0`<br>

Here you can set the cart sub total amount. If you leave this out, it will be e.g. "$0.00".

###### Usage:

```
<CartPaymentBar subTotal={...} />
```

### shipping

_Type_: `number`<br>
_Default_: `null`<br>

With this prop you can set shipping costs. If you leave this out, the component will consider
shipping are "Free" shipping.

###### Usage:

```
<CartPaymentBar shipping={...} />
```

### currency

_Type_: `string`<br>
_Default_: `''`<br>

This represents the currency of the cart sub total and the shipping costs.

###### Usage:

```
<CartPaymentBar currency={...} />
```

### isDisabled

_Type_: `boolean`  
_Default_: `true`  

Tells if the CartPaymentBar shall be displayed as disabled.

###### Usage:

```
<CartPaymentBar isDisabled={true} />
```

### isOrderable

_Type_: `boolean`  
_Default_: `false`  

Tells if the CartPaymentBar related cart is orderable.

###### Usage:

```
<CartPaymentBar isOrderable={true} />
```

### isVisible

_Type_: `boolean`  
_Default_: `true`  

Tells if the CartPaymentBar is visible, or hidden.

###### Usage:

```
<CartPaymentBar isVisible={true} />
```

---
