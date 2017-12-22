# DiscountBadge
---
This component will display the discount badge.

## Getting Started
```jsx
import DiscountBadge from 'Components/DiscountBadge';

<DiscountBadge text="-20%" />
```

## Props

### text (required)
_Type_: `string`  

The text content of this component. It can be a translation string with a placeholder for the discount in it.

###### Usage:
```jsx
<DiscountBadge text="-20%" />
```

### discount
_Type_: `number`  
_Default_: `null`  

This value will be used for the placeholder given in.

###### Usage:
```jsx
<DiscountBadge text="SAVE {0}%" discount={20}/>
```

### className
_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's className attribute.

###### Usage:
```jsx
<DiscountBadge className="class1 class2" />
```

### display

_Type_: `'small'`, `'big'`, any custom defined style key.  
_Default_: `'small'` or first style key defined.  

The display style of the badge.

```jsx
// Display a bigger version of the discount badge.
<DiscountBadge display="big" text="-20%" />
```

---
