# Image Slider 
---

A slider component that allows putting multiple components into swipeable contexts.

> **Dependants:** <br> `<ImageSlider />`

## Getting Started

```
import { Slider } from 'Library/components';

<Slider>
  <Slider.Item>a</Slider.Item>
  <Slider.Item>b</Slider.Item>
  <Slider.Item>c</Slider.Item>
</Slider>
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

`Slider.Item` that contain the content that is swipeable.

### disabled (optional)

_Type_: `bool`<br />
_Default_: `false`<br />

Whether swiping for this slider should be allowed.

###### Usage:

```
<Slider disabled>
  ...
</Slider>
```

### autoplay (optional) 

_Type_: `bool`<br>
_Default_: `false`<br>

If autoplay is enabled, the next slider item will appear automatically after `interval`ms

###### Usage:

```
<Slider autoplay>
  <Slider.Item>
    Hello
  </Slider.Item>
  <Slider.Item>
    World
  </Slider.Item>
</Slider>
```

### interval (optional) 

_Type_: `number`<br>
_Default_: `3000`<br>

The time specifies how many ms the autoplay needs to wait.
If autoplay is false, this prop is ignored.

###### Usage:

```
<Slider autoplay interval={2000}>
  <Slider.Item>
    Hello
  </Slider.Item>
  <Slider.Item>
    World
  </Slider.Item>
</Slider>
```

### controls (optional)

_Type_: `bool`<br>
_Default_: `false`<br>

Whether to display the control buttons or not

###### Usage:

```
<Slider controls>
  <Slider.Item>
    Hello
  </Slider.Item>
  <Slider.Item>
    World
  </Slider.Item>
</Slider>
```

### indicators (optional)

_Type_: `bool`<br>
_Default_: `false`<br>

Whether to display the indicators (little dots)

###### Usage:

```
<Slider indicators>
  <Slider.Item>
    Hello
  </Slider.Item>
  <Slider.Item>
    World
  </Slider.Item>
</Slider>
```

### loop (optional)

_Type_: `bool`<br>
_Default_: `false`<br>

If true then after the last item the first will appear again. 
And therefore allow swiping infinitely.

###### Usage:

```
<Slider loop>
  <Slider.Item>
    Hello
  </Slider.Item>
  <Slider.Item>
    World
  </Slider.Item>
</Slider>
```
