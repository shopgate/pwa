# ProductHeader
---

Displays information related to the product.
All labels contain placeholders that are shown when data is either not there yet
or the view isAnimating.

> **Dependencies:** 
<br> `<Manufacturer />`
<br> `<DiscountBadge />`
<br> `<Price />`
<br> `<StrikedPrice />`
<br> `<Shipping />`
<br> `<PlaceholderLabel />`

> **Dependents:** <br> `<ProductTemplate />`

## Getting Started

```
import { ProductHeader } from 'Templates/components';

<ProductHeader product={...} isAnimating />
```

## Props

### isAnimating (required)

_Type_: `boolean`<br>

Should be true when parent is animating, this will cause placeholders to be displayed

###### Usage:

```
<ProductHeader isAnimating={false} />
```

### product 

_Default_: `null`<br>
_Type_: `Object`<br>

The BasicProduct object or `null` when product data is not available yet which will cause placeholders to be rendered.
> **Note:** When `isAnimating` is `true`, `product` will be ignored until animation is done!

###### Usage:

```
<ProductHeader product={...} isAnimating={false} />
```
