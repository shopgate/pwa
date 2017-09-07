# SelectBox
---

This is a general component used for select boxes. SelectBox component is completely
unstyled!

> **Dependents:** <br> `<FilterBar />`

## Getting Started

```
import { SelectBox } from 'Library/components';
import { ArrowDropIcon } from 'Templates/components';

<SelectBox
  items={[
    { label: 'First value', value: 'value1 },
    { label: 'Second value', value: 'value2 },
    { label: '...', value: 'value3' },
  ]}
  icon={ArrowDropIcon}
/>
```

## Styling

To style this component an object with multiple styling 'classes' can be passed.

### icon
This will be applied to the icon.

### selection
This is the styling for the span that displays the current selection.

### button
The styling for the whole button that will open/close the dropdown.

### dropdown
The wrapper of the selection list. Only visible when opened.

### selectItem
Within the dropdown each select item will get this style.

###### Usage:
```
import { css } from 'glamor';

const icon = css({ ... });
const selection = css({ ... });
const button = css({ ... });
const dropdown = css({ ... });
const selectItem = css({ ... });

const style = {
  icon,
  selection,
  button,
  dropdown,
  selectItem,
};

<SelectBox classNames={style} ... />
```

## Props

### icon (required)

_Type_: `<Icon />`

The icon will be rendered next to the current selection.

###### Usage:

```
import { ArrowDropIcon } from 'Templates/components';

<SelectBox
  items={[ ... ]}
  icon={ArrowDropIcon}
/>
```

### item (required)

_Type_: `<Component />`

A component that will be used to wrap each selection item.
This component will only receive the children prop!

###### Usage:

```
import { ArrowDropIcon, Ripple } from 'Templates/components';

const Example = (props) => (
  <Ripple fill>
    {props.children}
  </Ripple>
);

<SelectBox
  items={[ ... ]}
  item={Example}
  icon={ArrowDropIcon}
/>
```

### items (required)

_Type_: `Object[]`

`items[x].label`: `string` The label that will be displayed

`items[x].value`: `string` A unique value that identifies the selection

###### Usage

```
import { ArrowDropIcon } from 'Templates/components';

<SelectBox
  items={[
    { label: 'First value', value: 'value1 },
    { label: 'Second value', value: 'value2 },
    { label: '...', value: 'value3' },
  ]}
  icon={ArrowDropIcon}
/>
```

### classNames

_Type_: `Object`

See styling section, this can be used to style the whole component.

### defaultText

_Type_: `string`

The text that will be shown if the `initialValue` is not set.

###### Usage

```
<SelectBox
  items={[ ... ]}
  icon={ArrowDropIcon}
  defaultText="Please select..."
/>
```

### duration

_Type_: `number`
_Default_: `300`

The duration of the dropdown animation.

###### Usage

```
<SelectBox
  items={[ ... ]}
  icon={ArrowDropIcon}
  duration={500}
/>
```

### handleSelectionUpdate

_Type_: `function (newValue: number)`

Executed whenever the selection for this select box changed.
It will be called with the unique value.

###### Usage

```
<SelectBox
  items={[ ... ]}
  icon={ArrowDropIcon}
  handleSelectionUpdate={(value) => console.log(`new value: ${value}`}
/>
```

### initialValue

_Type_: `string`

When the selected value should be saved across instances this can be used
to initiate the selection. `defaultText` will be ignored when this is set.

###### Usage

```
<SelectBox
  items={[ ... ]}
  icon={ArrowDropIcon}
  initialValue="value2"
/>
```

---
