# ProductImage
---

The ProductImage component extends the Image component with a placeholder feature that shows
the Placeholder template icon if the image is either undefined or could not be loaded.

> **Dependents:** 
<br> `<Image />`
<br> `<Placeholder />` (Icon component)

## Getting Started

```
import { ProductImage } from 'Templates/components';

<ProductImage src="foo/bar" alt="alt" />
```

## Props

`ProductImage` accepts the same properties as the `Image` library component does (with the exception of the
`onError` and `onLoad` properties). For a complete list of these
 properties see the manual of this component.

###### Usage:

```
<ProductImage src="foo/bar" alt="alt" />
```

If `src` is not provided or cannot be loaded for some reason, the placeholder icon is being displayed instead of the image.

---
