# Image
---

Image component renders multiple image resolutions smoothly.
It will preload all resolutions and will then display always the highest currently available.

> **Dependents:** <br> `<ProductImageSlider />`

## Getting Started

```
import { Image } from 'Templates/components';

<Image src="foo/bar" alt="alt" />
```

## Props

### src

_Type_: `string`<br>

Source of the image.

###### Usage:

```
<Image src="foo/bar" alt="alt" />
```

### alt

_Default_: `''`<br>
_Type_: `string`<br>

The alternative text for the image.

###### Usage:

```
<Image src="foo/bar" alt="alt" />
```

### forcePlaceholder

_Default_: `''`<br>
_Type_: `string`<br>

If true the placeholder will be always shown, even when all images are loaded!

###### Usage:

```
<Image src="foo/bar" alt="alt" forcePlaceholder />
```

### resolutions

_Type_: `Array`<br>

Sets what resolutions and in what order they should be rendered.
Note that if higher resolution images are loaded faster it will skip the lower resolution.
Additionally you can specify if the images should be blured. Works best with low resolution images.

###### Usage:

```
<Image src="foo/bar" alt="alt" forcePlaceholder />
<Image
  src="foo/bar"
  alt="alt"
  resolutions={[
    { width: 50, height: 50, blur: 10 },
    { width: 440, height: 440, blur: 0 },
    { width: 1024, height: 1024, blur: 0 },
  ]}
/>
```
---
