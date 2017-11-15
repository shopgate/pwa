# RatingStars
---
The RatingStars component is a simple component that displays five stars based on a given rating value.

## Getting Started

```markup
import { RatingStars } from 'Templates/components';

<RatingStars value={50} />
```

## Props

### value (required)

_Type_: `number`  

The rating value that displays stars accordingly. It needs to be a number between [0...100].

```
// Displays 4 filled stars and 1 empty star.
<RatingStars value={80} />
```
```
// Displays 4 filled stars and 1 half star.
<RatingStars value={90} />
```

### display

_Type_: `'small'`, `'big'`, `'large'`, any custom defined style key.  
_Default_: `'small'` or first style key defined.  

The display style of the stars.

```
// Display a bigger version of the rating stars.
<RatingStars value={80} display="big" />
```

### isSelectable

_Type_: `boolean`  
_Default_: `false`  

The prop to enable rating stars to be a selectable element for forms.

### onSelection

_Type_: `function`  
```
// Displays 4 filled stars and 1 empty star.
<RatingStars
    value={80}
    onSelection={event => this.setState({ value: e.target.value })}
    isSelectable
/>
```

The callback for the user selection if isSelectable is `true`. It receives the event object where the target value can be `20`, `40`, `60`, `80` or `100`.
