# RatingStars
---
The RatingStars component is a simple component that displays five stars based on a given rating value.

## Getting Started

```markup
import { RatingStars } from 'Templates/components';

<RatingStars value={0.5} />
```

## Props

### value (required)

_Type_: `number  

The rating value that displays stars accordingly. It needs to be a floating number [0...1].

```
// Displays 4 filled stars and 1 empty star.
<RatingStars value={0.8} />
```

### display

_Type_: `'small'`, `'big'`, `'large'`, any custom defined style key.<br>
_Defaults_: `'small'` or first style key defined.<br>

The display style of the stars. 

```
// Display a bigger version of the rating stars.
<RatingStars value={0.8} display="big" />
```

