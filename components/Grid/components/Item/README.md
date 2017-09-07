# GridItem
---
The GridItem component is a **Higher Order Component** that wraps other components with a container that can **grow** and **shrink**.

## Getting Started

```markup
import { Grid } from 'Library/components';

<Grid>
  <MyChildComponent />
  <Grid.Item grow>
    <MyOtherChildComponent />
  </Grid.Item>
</Grid>
```

## Props

### component

_Default_: `li`  
_Type_: `string`  

The HTML tag that will be used to render the component.

###### Usage:

```
<Grid.Item component="section" />
```

### grow

_Default_: `0`  
_Type_: `number`  

Apply the value to the `flex-grow` CSS property of the grid item.

###### Usage:

```
<Grid.Item grow={2} />
```

### shrink

_Default_: `1`  
_Type_: `number`  

Apply the value to the `flex-shrink` CSS property of the grid item.

###### Usage:

```
<Grid.Item shrink={3} />
```

### className

_Default_: `''`  
_Type_: `string`  

Additional classes that can be appended to the component's `className` attribute.

###### Usage:
```
<Grid.Item className="class1 class2" />
```
---
