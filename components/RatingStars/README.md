# RatingStars
---
The RatingStars component is a simple component that displays five stars based on a given rating value.

## Getting Started

```jsx
import RatingStars from 'Components/RatingStars';

<RatingStars value={0.5} />
```

## Props

### value (required)

_Type_: `number`  

The rating value that displays stars accordingly. It needs to be a floating number [0...1].

```jsx
// Displays 4 filled stars and 1 empty star.
<RatingStars value={0.8} />
```

### className
_Type_: `string`  
_Default_: `''`  

Additional classes that can be appended to the component's className attribute.

### display

_Type_: `'small'`, `'big'`, `'large'`, any custom defined style key.  
_Default_: `'small'` or first style key defined.  

The display style of the stars.

```jsx
// Display a bigger version of the rating stars.
<RatingStars value={0.8} display="big" />
```
