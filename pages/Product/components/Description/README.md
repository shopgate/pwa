# ProductDescription
---

Displays the description of the product or placeholders if data is not available yet.

> **Note:** The description can be HTML! It will use React's dangerouslySetInnerHTML prop.

> **Dependencies:**   
> `<PlaceholderParagraph />`


## Getting Started

```jsx
import ProductDescription from './ProductDescription';

<ProductDescription html="<h1>Foo</h1> Bar" />
```

## Props

### html (required)

_Type_: `string`  
_Default_: `null`  

Any kind of text and/or html. If null or animating, a placeholder will be shown

###### Usage:

```jsx
<ProductDescription html="<h1>Foo</h1> Bar" />
```

---
