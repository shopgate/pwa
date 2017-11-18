ChipsLayout
-----------
The ChipsLayout component renders a list of Chips,
it makes sure to fit as much tags as possible without overflowing elements.
If there are overflowing elements they will be hidden and a MORE button appears.

## Props

### children (optional)

_Type_: `[Chip]`  
_Default_: `[]`   

This component does only allow to store Tags as children!

### maxRows (optional)

_Type_: `number`  
_Default_: `2`  `

Allows to set the maximum amount of allowed rows. Any item that would overflow this limit
won't be rendered!


### handleMoreButton (optional)

_Type_: `function (event)`  

Will be called if the MORE button is pressed.


## Usage:

```markup
import { Chip, ChipsLayout } from 'Templates/components';

<ChipsLayout>
  <Chip>foo</Chip>
  <Chip>bar</Chip>
</ChipsLayout>
```
