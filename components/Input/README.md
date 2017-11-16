Input
---
This component will render a plain input field. You may consider to use a 
styled template component instead.

## Props
 
### autoComplete (optional)

_Type_: `boolean`<br>
_Default_: `true`

Apply the auto-complete feature to the field.

### autoCorrect (optional)

_Type_: `boolean`<br>
_Default_: `true`

Apply the auto-correct feature to the field.

### className (optional)

_Type_: `className`<br>

Any additional style classes that should be applied to the component.

### multiLine (optional)

_Type_: `boolean`<br>
_Default_: `false`

Sets the input to behave as multi line input. Multi line input behaves similar to a textarea element, except it grows to the bottom as the user types more input instead of exposing a scrolling area.

The implementation [follows Material Design guidelines](https://material.io/guidelines/components/text-fields.html#text-fields-text-field-boxes).

### onChange (optional)

_Type_: `function (value)`<br>

An optional callback that is triggered when the value of the input field
has been changed.

### onFocusChange (optional)

_Type_: `function (isFocused)`<br>

An optional callback that is called when the input field gains or loses
the current focus.

### onSanitize (optional)

_Type_: `function (value)`<br>

An optional callback that can be used to transform the value entered by the
user on the fly. The function is expected to return the sanitized value.

### onValidate (optional)

_Type_: `function (value, isInitial)`<br>

An optional callback that can be used to validate the value entered by the
user on the fly. The function is expected to return a boolean indicating
whether the value is valid.

The second parameter, `isInitial` indicates whether this is the initial
value validation that is happening in the construction/pre-mount phase of
the component. You can use this information to bypass any default value or
take care of proper `setState()` usages. 

By default, input validation will only happen if the field is blurred
(lost its focus). See `validateOnBlur` for further reference.

### password (optional)

_Type_: `boolean`<br>
_Default_: `false`

If this prop is set, the component will be rendered as a password field.

### value (optional)

_Type_: `string`<br>

The initial value of the input field. If the value of this property is modified,
the current value entered by the user is overwritten.

### validateOnBlur (optional)

_Type_: `boolean`<br>
_Default_: `true`<br>

By default, input validation will only happen if the field is blurred
(lost its focus). To enable validation while the user is typing, this property
can be set to false.

## Usage:

```markup
import { Input } from 'Library/components';

// Makes the entered value lowercase.
doSanitize = (value) => value.toLowerCase();

// Only accept values that contain the word 'Hello'.
doValidate = (value) => value.indexOf('Hello') != -1;

<Input
    onValidate={doValidate}
    onSanitize={doSanitize}
    value="Hello, World"
/>
```


