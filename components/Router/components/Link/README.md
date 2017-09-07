# Link
---

This component handles links to the new as well as the legacy (cake) system.
It uses `Library/classes/parsed-link/ParsedLink` to open the given link.
This will decide what to do with the link when clicked.

## Getting Started

```
import { Link } from 'Library/components';

<Link href="/item/123">
  <span>foo</span>
</Link>
```

## Props

### href (required)

_Type_: `string`<br>

Link to the old or legacy system.

###### Usage:

```
import { Link } from 'Library/components';

<Link href="/item/123">
  <span>foo</span>
</Link>
```

### children (required)

_Type_: `node`<br>

Children that will be rendered.

###### Usage:

```
import { Link } from 'Library/components';

<Link href="/item/123">
  <span>foo</span>
</Link>
```

### className

_Type_: `string`<br>
_Defaults_: `''`<br>

Styling for the underlying element.

###### Usage:

```
import { Link } from 'Library/components';
import style from './my-awesome.style';

<Link href="/item/123" className={style}>
  <span>foo</span>
</Link>
```

### tagName

_Type_: `string`<br>
_Defaults_: `null`<br>

The tag that should be used for the link.

###### Usage:

```
import { Link } from 'Library/components';
import style from './my-awesome.style';

<Link href="/item/123" tagName="a">
  Hello World
</Link>
```
---
