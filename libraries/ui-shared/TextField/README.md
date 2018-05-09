TextField
---
The text field component renders an input field with a floating label in material design.

## Props

### className (optional)

_Type_: `string`  

Any additional style classes that should be applied to the component.

### errorText (optional)

_Type_: `Node`  

The current error text to display. See `onValidate` for further details on when to use this property.

### hintText (optional)

_Type_: `Node`  

The hint text to display if there was no value entered by the user.

### label (optional)

_Type_: `Node`  

The label to display for the text field.

### onChange (optional)

_Type_: `function (value)`  

An optional callback that is triggered when the value of the text field has been changed.

### onSanitize (optional)

_Type_: `function (value)`  

An optional callback that can be used to transform the value entered by the user on the fly. The function is expected to return the sanitized value.

### onValidate (optional)

_Type_: `function (value)`  

An optional callback that can be used to validate the value entered by the user on the fly. The function is expected to return a boolean indicating whether the value is valid or, if the validation failed, a message indicating the error.

*Note*: The error message will only be displayed if no custom error text has been set for the `errorText` property.

By default, input validation will only happen if the field is blurred (lost its focus). See `validateOnBlur` for further reference.

### password (optional)

_Type_: `boolean`  
_Default_: `false`  

If this prop is set, the component will be rendered as a password field.

### value (optional)

_Type_: `string`  

The initial value of the text field. If the value of this property is modified, the current value entered by the user is overwritten.

## Usage:

```jsx
import TextField from '../TextField';

// Makes the entered value lowercase.
doSanitize = (value) => value.toLowerCase();

// Only accept values that contain the word 'Hello'.
doValidate = (value) => value.indexOf('Hello') != -1;

<TextField
    label="My text field"
    hintText="Enter something in UPPERCASE that contains the word 'Hello'"
    value="Hello World"
    onValidate={doValidate}
    onSanitize={doSanitize}
/>
```
