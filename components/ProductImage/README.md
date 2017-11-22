# ProductImage
---

The ProductImage component extends the Image component with a placeholder feature that shows the Placeholder template icon if the image is either undefined or could not be loaded.

> **Dependents:**  
> `<Image />`  
> `<Placeholder />` (Icon component)

## Getting Started

```jsx
import ProductImage from 'Components/ProductImage';

<ProductImage src="foo/bar" alt="alt" />
```

## Props

`ProductImage` accepts the same properties as the [`Image`](https://github.com/shopgate/pwa-common/tree/master/components/Image) component within the `@shopgate/pwa-common` repository does (with the exception of the `onError` and `onLoad` properties). For a complete list of these properties see the manual of this component.

###### Usage:

```jsx
<ProductImage src="foo/bar" alt="alt" />
```

If `src` is not provided or cannot be loaded for some reason, the placeholder icon is being displayed instead of the image.

---
