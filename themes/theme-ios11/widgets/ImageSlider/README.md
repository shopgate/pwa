# Image Slider widget
---

A widget for displaying a set of images in an image slider. 

## Getting Started

First import the widgets and define the JSX component:
```
import extensions from 'Extensions';
const ImageSliderWidget = extensions['core-widgets/image-slider'];
```

Then use it in the widget grid:

```
<ImageSliderWidget settings={mySettings} />
```

## Props

### children (required)

_Type_: `React.Node`<br>

Each children element is treated as a single slider item

### settings (required) 

_Type_: `Object`<br>

The widget configuration object should be passed to the `settings` prop. (See [Widget settings](#widget-settings) section)

## Widget settings<a name="widget-settings"></a>

### autostart

_Type_: `boolean`<br>

A boolean indicating whether the slider should start automatically or not.
 
### delay 

_Type_: `number`<br>

The delay time in milliseconds between the automatic scrolling of the slider.

### pagination

_Type_: `boolean`<br>

A boolean indicating whether the pagination dots should be visible or not.

### loop

_Type_: `boolean`<br>

A boolean indicating whether the slider should loop or not.

### images

_Type_: `Array`<br>

An array of objects describing the image slides. Each slide must provide the following properties:

#### image
 
_Type_: `string`<br>
 
The absolute URL of the image slide.
 
#### link

_Type_: `string`<br />

A link connected to the image slide.

## Usage
```
const mySettings = {
    autostart: true,
    delay: 7000,
    pagination: true,
    loop: true,
    images: [
        image: "http://source.to/my-image.png",
        link: "http://link.to/my-image",
    ]
};
...
<ImageSliderWidget settings={mySettings} />
```
