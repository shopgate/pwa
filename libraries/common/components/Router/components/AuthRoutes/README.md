# AuthRoutes
---

With the AuthRoutes component you can protect routes from being 
opened if the user is not logged in. In this case the user will first be redirected 
to the login page and then forwarded to the actual route after the login was successful. 
If the user is already logged in, the final route will directly show up.

> **Dependents:** <br> `<Route />`

## Getting Started

```
import React from 'react';
import { Route, AuthRoutes } from 'Library/components';

const Routes = () =>
  <App>
    <Route
      path={`${INDEX_PATH}`}
      component="Page"
    />
    <Route
    <AuthRoutes to={`${LOGIN_PATH}`}>
      <Route
        path={`${CHECKOUT_PATH}`}
        component="checkout"
      />
    </AuthRoutes>
  </App>
;
```

## Props

### children (required)

_Type_: `React.Component`<br>

Routes that should be protected by the AuthRoutes component.

###### Usage:

```
<AuthRoutes to={`${LOGIN_PATH}`}>
  <Route
    path={`${CHECKOUT_PATH}`}
    component="checkout"
  />
</AuthRoutes>
```

### isLoggedIn (required)

_Type_: `boolean`<br>

Info about the login state of the current user. Passed via the user connector.

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

### to (optional, defaults to LOGIN_PATH)

_Type_: `String`<br>

The url to which users should be redirected if they are not logged in.

###### Usage:

```
<AuthRoutes to={`${LOGIN_PATH}`}>
  <Route
    path={`${CHECKOUT_PATH}`}
    component="checkout"
  />
</AuthRoutes>
```
---