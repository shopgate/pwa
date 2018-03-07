# Ellipsis

Shortens some text by a defined number of lines according to its maximum width and shortens
it with a pre-defined ellipsis text.

## Getting Started

### JSX:
```
import { Ellipsis } from 'Library/components';

<Ellipsis>{...Your very long text to be shortened...}</Ellipsis>
```

### Templates:
```
<rt-import name="Ellipsis" from="Library/components" />

<Ellipsis>{...Your very long text to be shortened...}</Ellipsis>
```

## Props

### className

_Default_: `''`<br>
_Type_: `string`<br>

Additional classes that can be appended to the component's `className` attribute.

###### Usage:

```
<Ellipsis className="class1 class2" />
```

### rows

_Type_: `number`<br>
_Default_: 3<br>

The maximum number of rows for the text.

###### Usage:

```
<Ellipsis rows={2}>{...Your very long text to be shortened...}</Ellipsis>
```

### more

_Type_: `string`<br>
_Default_: ...<br>

The ellipsis text that will be shown at the end of the last line of your
text to show that the text was trimmed.

###### Usage:

```
<Ellipsis more="...">{...Your very long text to be shortened...}</Ellipsis>
```
