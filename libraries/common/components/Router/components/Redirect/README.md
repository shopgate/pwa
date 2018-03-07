# Redirect
---

This Component redirects the user to another route as soon as the path props 
of the component matches.


## Getting Started

```
import React from 'react';
import { Route } from 'Library/components';
import Redirect from 'Library/components/router/route/Redirect';

const Routes = () =>
  <App>
    <Route
      path={`${INDEX_PATH}`}
      component="Page"
    />
    <Redirect
      path="checkout"
      to="checkout/step1"
    />
  </App>
;
```

## Props

### path (required)

_Type_: `String`<br>

Path for which the component is registered


### to (required)

_Type_: `String`<br>

Path to which the component redirects

### trampolineRedirect (required)

_Type_: `function`<br>

Function that does the actual redirect. Passed via the history connector.

---
