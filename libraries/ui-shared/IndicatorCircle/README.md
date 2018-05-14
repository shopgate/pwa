IndicatorCircle Component
---
The IndicatorCircle serves as an animated loading indicator. It shows a rotating circle in GMD style.

# Getting Started

```jsx
import IndicatorCircle from '../IndicatorCircle';

<IndicatorCircle />
<IndicatorCircle size={32} />
<IndicatorCircle color="#fff" />
```

## Props

### color

_Default_: `#5ccee3` (colors.accent)  
_Type_: `string`  

The color of the component.

### size

_Default_: `32` (variables.loadingIndicator.size)  
_Type_: `number`  

The size of the component in px.

### strokeWidth

_Default_: `3` (variables.loadingIndicator.strokeWidth)  
_Type_: `number`  

The stroke width of the component in px.
