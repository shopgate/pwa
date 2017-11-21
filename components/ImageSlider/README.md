# Image Slider
---

A styled slider component that can be used for images.

> **Dependencies:**    
`<Slider />`

## Getting Started

```
import { Image } from 'Library/components';
import { ImageSlider } from 'Templates/components';

<ImageSlider>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ImageSlider>
```

## Styling

An object with following keys can be passed as the classNames property.

### slider (optional)
Appends styling to the outer wrapper of the slider

### indicator (optional)
Appends styling to the outer wrapper of the

### activeIndicator (optional)
Appends styling to the currently active dot

### inactiveIndicator (optional)
Appends styling to all other dots

## Props

### children (required)

_Type_: `React.Node`  

Each children element is treated as a single slider item

### disabled (optional)

_Type_: `bool`  
_Default_: `false`  

Whether swiping for this slider should be allowed.

###### Usage:

```
<ImageSlider disabled>
  ...
</ImageSlider>
```

### autoplay (optional)

_Type_: `bool`  
_Default_: `false`  

If autoplay is enabled, the next slider item will appear automatically after `interval`ms

###### Usage:

```
import { Image } from 'Library/components';
import { ImageSlider } from 'Templates/components';

<ImageSlider autoplay>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ImageSlider>
```

### interval (optional)

_Type_: `number`  
_Default_: `3000`  

The time specifies how many ms the autoplay needs to wait.
If autoplay is false, this prop is ignored.

###### Usage:

```
import { Image } from 'Library/components';
import { ImageSlider } from 'Templates/components';

<ImageSlider autoplay interval={3000}>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ImageSlider>
```
### controls (optional)

_Type_: `bool`  
_Default_: `false`  

Whether to display the control buttons or not

###### Usage:

```
import { Image } from 'Library/components';
import { ImageSlider } from 'Templates/components';

<ImageSlider controls>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ImageSlider>
```

### indicators (optional)

_Type_: `bool`  
_Default_: `false`  

Whether to display the indicators (little dots)

###### Usage:

```
import { Image } from 'Library/components';
import { ImageSlider } from 'Templates/components';

<ImageSlider indicators>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ImageSlider>
```

### loop (optional)

_Type_: `bool`  
_Default_: `false`  

If true then after the last item the first will appear again.
And therefore allow swiping infinitely.

###### Usage:

```
import { Image } from 'Library/components';
import { ImageSlider } from 'Templates/components';

<ImageSlider loop>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ImageSlider>
```
