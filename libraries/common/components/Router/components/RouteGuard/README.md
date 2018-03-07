RouteGuard
---

> **Dependencies:** <br> `Library/connectors/routeGuard`

The `RouteGuard` component takes care of conditional rendering of its children
based on the current route.

If a route is changed, any component that is wrapped with a `RouteGuard` will not
render unless the original route where it was mounted became active again.

While normally the router is already taking care of when to render components,
you might want to use a `RouteGuard` in certain cirtumstances where your
component is rendered outside of the current routes root element.

An example of when to use `RouteGuard` is when you render components inside
a `Portal` (see `react-portal`) that will be visible on top of the 
DOM hierarchy at all times.

## Usage

```
import { RouteGuard } from 'Library/components';

...

<RouteGuard>
    <Portal isOpened>
        <div>
            Something that rendered in a portal 
            but only if the route where it was
            mounted is currently active.
        </div>          
    </Portal>
</RouteGuard>
```
