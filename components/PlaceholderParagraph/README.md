# PlaceholderParagraph
---

A simple colored block that represents a loading paragraph (multiple lines of text).

## Getting Started

```
import { PlaceholderParagraph } from 'Templates/components';

<PlaceholderParagraph>
  Hello World
</PlaceholderParagraph>
```

## Props

### children (required)

_Type_: `node  

Children that will ONLY be rendered when ready is true.

###### Usage:

```
<PlaceholderParagraph>
  <h1>foobar</h1>
</PlaceholderParagraph>
```

### ready

_Default_: `false  
_Type_: `boolean  

When ready children will be rendered, otherwise the placeholder will be shown.

###### Usage:

```
<PlaceholderParagraph ready>
  <h1>foobar</h1>
</PlaceholderParagraph>
```
---
