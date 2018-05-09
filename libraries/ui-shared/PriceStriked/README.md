# PriceStriked
---
This component will display a striked-through price label.

## Getting Started
```jsx
import PriceStriked from 'Components/PriceStriked';

<PriceStriked value={1337.49} currency="EUR" />
```

## Props

### value (required)
_Type_: `number`  

The amount that the component shall display as a formatted price.

###### Usage:
```
<PriceStriked value={1337.49} />
```

### currency (required)
_Type_: `string`  

The currency of the price.

###### Usage:
```
<PriceStriked currency="EUR" />
```

### className
_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's className attribute.

###### Usage:
```
<PriceStriked className="class1 class2" />
```
---
