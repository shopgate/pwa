# DiscountBadge
---
This component will display the discount badge.

## Getting Started
```markup
import { DiscountBadge } from 'Template/components';

<DiscountBadge text="-20%" />
```

## Props

### text (required)
_Type_: `string`<br>

The text content of this component. It can be a translation string with a placeholder for the discount in it.

###### Usage:
```
<DiscountBadge text="-20%" />
```

### discount
_Type_: `number`<br>

This value will be used for the placeholder given in .

###### Usage:
```
<DiscountBadge text="SAVE {0}%" discount={20}/>
```

### className
_Default_: `''`<br>
_Type_: `string`<br>

Additional classes that can be appended to the component's className attribute.

###### Usage:
```
<DiscountBadge className="class1 class2" />
```

### display

_Type_: `'small'`, `'big'`, any custom defined style key.<br>
_Defaults_: `'small'` or first style key defined.<br>

The display style of the badge. 

```
// Display a bigger version of the discount badge.
<DiscountBadge display="big" text="-20%" />
```

---
