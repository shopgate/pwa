Button
---
A basic `<Button />` component without any visual effects on user interaction. For buttons with visual effects use the `ActionButton` and `RippleButton` components.

## Getting started

```jsx
import Button from 'Components/Button';

...

<Button type="primary">My button</Button>
```

## Props

See the documentation of the [`Button`](https://github.com/shopgate/pwa-common/blob/master/components/Button/README.md) component for inherited properties. Additionally, this component provides the following properties:

### className
_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's className attribute.

### flat

_Type_: `boolean`  
_Default_: `false`  

If set, the button will be rendered flat, without any background color set and using the color schemes primary color as text color.

### type

_Type_: `string`  
_Default_: `primary`  

The color scheme of the button, may be one of the following: `plain`, `primary`, `secondary` or `regular`.

`primary` and `secondary` will render the button in the primary/secondary color palette as defined in the button styles. These settings allow the rendering of flat buttons by setting the `flat` property (see below).

`regular` will always render a flat button with a dark color.

### wrapContent

_Type_: `boolean`  
_Default_: `true`  

If this prop is set, the content will get wrapped inside a padded element when rendered. This is useful for text and centered content and should be disabled if the content should span over the full size of the button.
