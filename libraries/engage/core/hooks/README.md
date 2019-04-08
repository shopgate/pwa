# Shopgate ENGAGE React Hooks

This library provides you with a collecton of usefull React Hooks that you can use to build out new features in Shopgate ENGAGE.

## Content

### `useCustomRoute`

This Hook returns all necessary React elements that you need to build a custom route:

* `View` - The view component that you should wrap around your view content
* `Appbar` - The app bar component for the appropriate theme (GMD or iOS),
* `params` - The current Route's parameters.

#### Usage

```jsx
import { useCustomRoute, Route } from '@shopgate/engage/core';

function MyCustomView() {
  const { View, AppBar, params } = useCustomRoute();

  return (
    <View>
      <AppBar title="My Custom View" />
      {/* ... your custom content goes here */}
    </View>
  )
}

function MyCustomRoute() {
  return (
    <Route pattern="/my-custom-url" component={MyCustomView} />
  );
}

export default MyCustomRoute;
```
