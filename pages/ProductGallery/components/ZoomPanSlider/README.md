# ZoomPanSlider
---

A slider component that can be used for zooming and panning of images.

> **Dependencies:**  
>`<ImageSlider />`  
>`<ZoomPanContainer />`  

## Getting Started

```jsx
import { Image } from '@shopgate/pwa-common/components/Image/';
import ZoomPanSlider from 'Pages/ProductGallery/components/ZoomPanSlider';

<ZoomPanSlider>
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
  <Image src="/foo/bar" />
</ZoomPanSlider>
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

```jsx
<ZoomPanSlider disabled>
  ...
</ZoomPanSlider>
```
### autoplay (optional)

_Type_: `bool`  
_Default_: `false`  

If autoplay is enabled, the next slider item will appear automatically after `interval`ms

###### Usage:

```jsx
<ZoomPanSlider autoplay>
  ...
</ZoomPanSlider>
```

### interval (optional)

_Type_: `number`  
_Default_: `3000`  

The time specifies how many ms the autoplay needs to wait.
If autoplay is false, this prop is ignored.

###### Usage:

```jsx
<ZoomPanSlider autoplay interval={3000}>
  ...
</ZoomPanSlider>
```
### controls (optional)

_Type_: `bool`  
_Default_: `false`  

Whether to display the control buttons or not

###### Usage:

```jsx
<ZoomPanSlider controls>
  ...
</ZoomPanSlider>
```

### indicators (optional)

_Type_: `bool`  
_Default_: `false`  

Whether to display the indicators (little dots)

###### Usage:

```jsx
<ZoomPanSlider indicators>
  ...
</ZoomPanSlider>
```

### loop (optional)

_Type_: `bool`  
_Default_: `false`  

If true then after the last item the first will appear again.
And therefore allow swiping infinitely.

###### Usage:

```jsx
<ZoomPanSlider loop>
  ...
</ZoomPanSlider>
```
