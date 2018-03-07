# Picker
---
The Picker component is designed to be a custom select field for a given list of items.
It uses a modal-like overlay for item selection.
The Picker button and list components can be customized and injected via props.

## Getting Started
```markup
import { Picker } from 'Library/components';

<Picker
  items={['one', 'two', 'three']}
  onChange={console.log}
/>
```

## Props

### className

_Default_: `''`  
_Type_: `string`

Additional classes that are to be appended to the Picker container.

###### Usage:

```
<Picker className="class1 class2" ... />
```


### disabled

_Default_: `false`  
_Type_: `boolean`

Disables the Picker component.

###### Usage:

```
<Picker disabled ... />
```

### duration

_Default_: `300`  
_Type_: `number`

Duration of the open/close animation.

###### Usage:

```
<Picker duration={200} />
```


### buttonComponent

_Default_: `PickerButton`  
_Type_: `Node|Function`

A custom component for the Picker button can be passed here.
The custom button should have the same behavior as the default PickerButton component.


###### Usage:

```js
const myButton = ({ openList, children }) => (
  <button onTouchStart={openList}>
    {children}
  </button>
);

<Picker buttonComponent={myButton} ... />
```


### modalComponent

_Default_: `PickerModal`  
_Type_: `Node|Function`

A custom component for the Picker modal can be passed here.
The custom modal should have the same behavior as the default PickerModal component.


###### Usage:

```js
// Very simple(!) modal implementation.
const myModal = ({ onClose, isOpen, children }) => (
  <div onTouchStart={onClose}>
    {this.props.children}
  </div>
);

<Picker modalComponent={myModal} ... />
```


### listComponent

_Default_: `PickerList`  
_Type_: `Node|Function`

A custom component for the Picker list can be passed here.
The custom list should have the same behavior as the default PickerList component.


###### Usage:

```js
const myList = ({ items, onSelect, selectedIndex }) => (
  <ul>
    {items.map((item, currentIndex) =>
      {/* Selected item can be determined by comparing currentIndex with selectedIndex */}
      <li key={item.value}>
        <button disabled={item.disabled} onTouchStart={() => onSelect(item.value)}>
          {item.label}
        </button>
      </li>
    )}
  </ul>
);

<Picker listComponent={myList} ... />
```


### items

_Default_: `[]`  
_Type_: `Array`

A list of items that can be selected.

Right now these item notations are supported:

```
[
  'item',
  { value: 'item value' },
  { value: 'item value', label: 'item label' },
  { value: 'item value 2', label: 'item label 2', disabled: true },
]
```

*NOTE:* When you add an item as a string, this string will serve as it's value and label.


###### Usage:

```
<Picker items={['one', 'two', 'three']} />
```

### value

_Default_: `undefined`  
_Type_: `string|number`

The value of the item that should be selected initially.

###### Usage:

```
// This will select item 'two' initially
<Picker items={['one', 'two', 'three']} value="two" />
```

### onChange

_Default_: `undefined`  
_Type_: `Function`

A callback function that is called everytime the selection changed.
The callback takes the selected value as first and only parameter.

###### Usage:

```
<Picker
  items={['one', 'two', 'three']}
  onChange={(selectedValue) => { console.log(selectedValue) }}
/>
```

### onClose

_Default_: `undefined`  
_Type_: `Function`

A callback function that is called everytime the picker close.

###### Usage:

```
<Picker
  items={['one', 'two', 'three']}
  onClose={() => { console.log('closed') }}
/>
```

### placeholder

_Default_: `'Select ...'`  
_Type_: `string`

The default text for the component when no selection has been made.

###### Usage:

```
<Picker placeholder="Pick something" ... />
```


### label

_Default_: `''`  
_Type_: `string`

The label text for the component when an item is selected.

###### Usage:

```
<Picker label="You picked:" ... />
```
