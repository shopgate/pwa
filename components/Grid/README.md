# Grid
---
The Grid component is a **Higher Order Component** that acts as a `flexbox` wrapper. The child elements will be rendered as a grid.

## Getting Started

```markup
import { Grid } from 'Library/components';

<Grid>
  <MyChildComponent />
  <MyChildComponent />
  <MyOtherChildComponent />
</Grid>
```

## Props

### component

_Default_: `ul`  
_Type_: `string`  

The HTML tag that will be used to render the component.

###### Usage:

```
<Grid component="article" />
```

### wrap

_Default_: `false`   
_Type_: `boolean`  

Applies `flex-wrap: [wrap | nowrap]` to the component.

###### Usage:

```
<Grid wrap />
```

### className

_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's `className` attribute.

###### Usage:
```
<Grid className="class1 class2" />
```
---
