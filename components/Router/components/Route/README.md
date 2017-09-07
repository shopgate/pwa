# Route
---

With the Route component it's possible to define a url path expression. When the given expression matches the current url
the Route component will render the given component with optional url parameters.

> **Dependencies:** <br> `<Router />`

## Getting Started

```
import { Router, Route } from 'Library/components';
import { Foo, Bar } from './somewhere';

<Router>
  <div>
      <Route path="/category/:categoryId" component={Foo} />
      <Route path="/item/:productId" component={Bar} />
      <Route path="/bar/baz" component="MyOnDemandImportedComponent" />
  </div>
</Router>
```

## Props

###  path (required)

_Type_: `string`<br>

The expression that defines what urls will match. See https://www.npmjs.com/package/path-to-regexp
to find out more about the syntax and rules.

###### Usage:

```
<Router>
  <div>
      <Route path="/category/:categoryId" component={Foo} />
      <Route path="/item/:productId" component={Bar} />
      <Route path="/foo/:optionalParam?" component={Bar} />
      <Route path="/noparams" component={Bar} />
  </div>
</Router>
```

### component

_Type_: `React.Component` or `string`<br>

Decides what component will be used. When a route is mounted, this component will be
mounted with the url parameters passed as `params` prop.

If the component name is passed as string, the route will attempt to import the required
module by itself. All components must be stored in `templates/view`for this purpose.
Routes defined this way will compile to separate bundles for each component for loading speed increase, 
so this is the recommended way of passing a component.

Passing the component directly by class is possible, but will not result in route based bundles 
when using webpack.  

###### Usage:

```
<Router>
  <div>
      <Route path="/foo" component={MyComponent} />
      <Route path="/bar" component="MyComponent" />
  </div>
</Router>
```
While the first route passes a component by type, the second route is provided with the name of the 
component as string and therefore produce a route based bundle when using webpack.

---
