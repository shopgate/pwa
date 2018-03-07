# NoBackgroundRender (HOC)
---

HOC that makes sure that the wrapped component is not rendered if view is in background.
A view is in background when going forward in history. The component stays in the DOM and therefore will still recieve updates.
With this HOC the component is frozen until it comes back into foreground.

## Getting Started

```
import { NoBackgroundRender } from 'Library/components';
import { Foo } from 'foo';

const MyComponent = NoBackgroundRender(Foo, 'foo');

return (
  <NoBackgroundRender path="{this.currentPath}" ... />
);
```

## Parameters

### WrappedComponent (required)

_Type_: `React.Component`

The component that should be wrapped.

### action (required)

_Type_: `string`

The action name for example `foo`. When the pathname is `/foo/bar` then the
view is active. With `/bar/foo` the view would be inactive.

## Props

All props are passed to the wrapped component!

### pathname (required)

_Type_: `string`<br>

The current url path.


---
