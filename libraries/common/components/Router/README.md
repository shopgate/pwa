# Router
---

The router component cares about the given history and changes the visible route.
The history will notify the router about url changes and the router will then notify
the matching route.

> **Dependents:** <br> `<Route />`

## Getting Started

```
import { Router, Route } from 'Library/components';
import { Foo, Bar } from './somewhere';

<Router>
  <div>
      <Route path="/category/:categoryId" component={Foo} />
      <Route path="/item/:productId" component={Bar} />
  </div>
</Router>
```

## Context

### history

_Type_: `Object`<br>

The history prop will be passed in the context to all children.

### registerRoute

_Type_: `function (route, callback, options)`<br>

Can be used to register a route. When the history object notifies the router about url changes
the passed `callback` will be executed if matched.

## Props

### children (required)

_Type_: `React.Component`<br>

Needs to be a single child! Will render the child component with the new context.

###### Usage:

```
<Router>
  <div>
      <Route path="/category/:categoryId" component={Foo} />
      <Route path="/item/:productId" component={Bar} />
  </div>
</Router>
```

### history (required)

_Type_: `Object`<br>

The history object. For more information see: https://www.npmjs.com/package/history

###### Usage:

```
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

<Router history={history}>
  <div>
      <Route path="/category/:categoryId" component={Foo} />
      <Route path="/item/:productId" component={Bar} />
  </div>
</Router>
```
---
