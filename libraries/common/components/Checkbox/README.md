# Checkbox
---
A simple checkbox component. It holds no state on it's own and must be controlled.

## Getting Started

```markup
import { Checkbox } from 'Library/components';

<Checkbox
  checkedIcon="X"
  uncheckedIcon="O"
  checked={someControlVariable}
/>
```

## Props

### checked

_Type_: `boolean`<br>

Defines whether the checkbox is checked or not. Used to control the checkbox. Must not be used in conjunction with the `defaultChecked` property!

###### Usage:

```
<Checkbox
  checked={this.state.checkboxIsChecked}
  ...
/>
```

### checkedIcon (required)

_Type_: `node`<br>

This is used to be shown as the checked icon.

###### Usage:

```
<Checkbox
  checkedIcon={<Checked />}
  ...
/>
```

### uncheckedIcon (required)

_Type_: `node`<br>

This is used to be shown as the unchecked icon.

###### Usage:

```
<Checkbox
  uncheckedIcon={<Unchecked />}
  ...
/>
```

### className

_Default_: `undefined`<br>
_Type_: `string`<br>

CSS class names to style the checkbox.

###### Usage:

```
<Checkbox
  className="awesome-checkbox"
  ...
/>
```

### defaultChecked

_Default_: `undefined`<br>
_Type_: `boolean`<br>

The default value for an uncontrolled checkbox. Must not be used in conjunction with the `checked` property!

###### Usage:

```
<Checkbox
  defaultChecked={false}
  ...
/>
```

### label

_Default_: `null`<br>
_Type_: `string`<br>

The label of the checkbox.

###### Usage:

```
<Checkbox
  label="I have read and agree to the privacy policy"
  ...
/>
```

### labelPosition

_Default_: `'left'`<br>
_Type_: `string`<br>

Is the label on the left or right.

###### Usage:

```
<Checkbox
  labelPosition="right"
  ...
/>
```

### name

_Default_: `undefined`<br>
_Type_: `string`<br>

If the checkbox is used in a form-tag, the name prop is used as the input-tag's name attribute.

###### Usage:

```
<Checkbox
  name="myCheckbox"
  ...
/>
```

### onCheck

_Default_: `() => {}`<br>
_Type_: `function`<br>

The callback function to be triggerd if the checkbox is clicked.
It receives a boolean indicating if the checkbox is checked.

###### Usage:

```
<Checkbox
  onCheck={checked => this.setState({ checked })}
  ...
/>
```
