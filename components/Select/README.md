# Select
---
The Select component is designed to be a custom select field for a given list of items.

## Getting Started

```markup
import { Select } from 'Library/components';

<Select
  items={['one', 'two', 'three']}
  onChange={console.log}
/>
```

## Props

### className

_Default_: `''`<br>
_Type_: `string`<br>

Additional classes that are to be appended to the Select container.

###### Usage:

```
<Select className="class1 class2"> ... </List>
```

### items

_Default_: `[]`<br>
_Type_: `Array`<br>

A list of items that can be selected.

Right now these item notations are supported:

```
[
  'item',
  { value: 'item value' },
  { value: 'item value', label: 'item label' },
]
```

*NOTE:* When you add an item as a string, this string will serve as it's value and label.


###### Usage:

```
<Select items={['one', 'two', 'three']} />
```

### value

_Default_: `undefined`<br>
_Type_: `string|number`<br>

The value of the item that should be selected initially.

###### Usage:

```
// This will select item 'two' initially
<Select items={['one', 'two', 'three']} value="two" />
```

### onChange

_Default_: `undefined`<br>
_Type_: `Function`<br>

A callback function that is called everytime the selection changed.
The callback takes the selected value as first and only parameter.

###### Usage:

```
<Select
  items={['one', 'two', 'three']}
  onChange={(selectedValue) => { console.log(selectedValue) }}
/>
```

### placeholder

_Default_: `'Select ...'`<br>
_Type_: `string`<br>

The default text for the component when no selection has been made.

###### Usage:

```
<Select placeholder="Please make a selection ..." />
```
