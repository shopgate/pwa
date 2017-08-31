# ProductImageSlider 
---

Image slider for the product view. 

Tries to display as fast as possible the first image (featuredImage) while waiting for the actual image slider with higher resolution images.

**Behavior:**
- When product data is not available, display an image placeholder.
- When product data is available, display image for `product.featuredImageUrl` 
- When images is available, display an ImageSlider with all images.

> **Dependencies:** 
<br> `<ImageSlider />`
<br> `<Image />`
<br> `<PlaceholderImage />`

> **Dependents:** <br> `<ProductTemplate />`

## Getting Started

```
import { ProductImageSlider } from 'Templates/components';

<ProductImageSlider 
  product={...}
  images={[
    'foo/bar.png',
    'bar/foo.png',
  ]}
/>
```

## Props

### isAnimating (required)
_Type_: `boolean` <br>

When animating it will only display a placeholder.

###### Usage:

```
<ProductImageSlider isAnimating={false} />
```

### product

_Type_: `Object`<br>

Needs the featuredImageUrl string!
BasicProduct data, when null will display placeholder.
> **Note:** When `isAnimating` is `true`, `product` will be ignored until animation is done!

###### Usage:

```
<ProductImageSlider product={...} isAnimating />
```

### images 

_Type_: `string[]`<br>

Array of urls to images, when null will display placeholder.
> **Note:** When `isAnimating` is `true`, `images` will be ignored until animation is done!

###### Usage:

```
<ProductImageSlider images={['foo/bar.png']} isAnimating />
```

