# ProductDescription
---

Displays the description of the product or placeholders if data is not available yet.

> **Note:** The description can be HTML! It will use React's dangerouslySetInnerHTML prop.

> **Dependencies:** <br> `<PlaceholderParagraph />`

> **Dependents:** <br> `<ProductTemplate />`

## Getting Started

```
import { ProductDescription } from 'Templates/components';

<ProductDescription html="<h1>Foo</h1> Bar" isAnimating={false} />
```

## Props

### html (required)

_Type_: `string`  

Any kind of text and/or html.
If null or animating, a placeholder will be shown

###### Usage:

```
<ProductDescription html="<h1>Foo</h1> Bar" isAnimating={false} />
```

### isAnimating (required)

_Type_: `boolean`  

When animating a placeholder will be shown instead.

###### Usage:

```
<ProductDescription html="<h1>Foo</h1> Bar" isAnimating />
```
---
