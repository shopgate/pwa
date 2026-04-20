# Shopgate Connect - PWA Extension Kit - /connectors - Data connectors
## Purpose

Connectors are [Higher Order Components](https://reactjs.org/docs/higher-order-components.html) which are made to simplify reading data or actions from PWA app by frontend components.

Connectors are meant to replace some PWA redux selectors/actions or Contexts by using them in a simpler way and hiding the logic behind gathering basic data which is proven to be commonly used by many extensions.  

## Available connectors
### withHistoryActions
Connects provided component with a wrapper behind internal PWA routing actions.

#### Possible usage
Everywhere as a React component rendered within the PWA app.

#### Props provided
- `historyPush(pathname: string, options: object[optional])` - Opens new page in a safe way. Detects link types. Internal links (deep links) which are handled by the PWA app. External links are handled by opening the in-app-browser.
    - `state (object[optional])` - Route state is a property of options and passed from history action. Is NOT the redux state. It is metadata only for the routing transition.
    - Values passed to state are defined in route action.
- `historyReplace(pathname: string, options: object[optional])` - Replaces current page with provided pathname if pathname is an internal link. If pathname is external link it works exactly as `historyPush`. If you intend to replace your current page with in-app-browser, use combination of `historyPush` and `historyPop` instead.
    - `state (object[optional])` - Route state is a property of options and  passed from history action. Is NOT the redux state. It is metadata only for the routing transition.
    - Values passed to state are defined in route action.
- `historyPop()` - Pops current page from a history stack. Works like a "back" button.

#### Example usage
```jsx
import React, { Component } from 'react'
import { withHistoryActions } from '@shopgate-ps/pwa-extension-kit/connectors';

class MyComponent extends Component 
  handleClick = () => {
    this.props.historyPush('/example', { state: { title: 'foo' });
  }
  handleDismiss = () => {
    this.props.historyPop();
  }
  
  render() {
    return (
      <Fragment>
        <button onClick={this.handleOpen}>Open page</button>
        <button onClick={this.handleDismiss}>Dismiss</button>
      </Fragment>
    );
  }
}

export default withHistoryActions(MyComponent);
```
### withPageProductId
Connector which provides `hex2Bin` decoded `productId` which is also available in the page pathname params. It's intended to be used with or without additional product selectors like `getProduct`, `getBaseProduct` depending on the extension needs.

#### Possible usage
This connector will only work while being rendered on a page which has :productId pathname param. Current pages which offer this param are:
- Product Page ('/item/:productId')
- Write review page ('/item/:productId/write-review')

#### Example usage
##### Getting productId as is
```jsx
// Page pathname where component is rendered: '/item/31323334'
import { withPageProductId } from '@shopgate-ps/pwa-extension-kit/data/connectors';

// Will produce <div>This product id is: 1234</div>
const MyComponent = ({ productId}) => (<div>This product id is: ${productId}</div);

export default withPageProductId(MyComponent);
```

##### Getting always a base product id
Some products has variants. If variant is selected by user or product page is rendered directly with selected variant (by for example deep linking), product id available in the pathname is an id of currently selected variant.
In this case, in order to read the `baseProductId` (product id of a variant's parent product), there's need to use additional PWA redux selectors.
```jsx
// Page pathname where component is rendered: '/item/313233342d76617269616e742d31'
import { connect } from 'react-redux'; // Provides connection to redux.
import { withPageProductId } from '@shopgate-ps/pwa-extension-kit/data/connectors'; // Fetches and decodes productId from a pathname
import { getBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors'; // Makes sure productId always comes from base product.

// Will produce <div>This product id is: 1234</div>
const MyComponent = ({ baseProductId }) => (<div>This product id is: ${baseProductId}</div);

// Function that maps state and given props to component props.
// State is a current redux state
// Props in this example are made by `withPageProductId` connector and pass decoded `1234-variant-1` (encoded version: `313233342d76617269616e742d31`)
const mapStateToProps = (state, props) => ({
  baseProductId: getBaseProductId(state, props)
});

// Component connected with redux only
const ConnectedComponent = connect(mapStateToProps)(MyComponent);

// ConnectedComponent wrapped with data connector.
export default withPageProductId(ConnectedComponent);
```

### withPageState
Connects provided component with a page state: `isLoading`, `isVisible`.

#### Props provided
- `isLoading (bool)` - Tells if page on which component is rendered is currently loading (usually with a visible progress bar).
- `isVisilble (bool)` - Tells if page on which component is rendered is currently visible. Returns false when page is somewhere in the background. For example if another page is pushed to the history stack, but the one where component is rendered is still mounted via the DOM caching.
- `pathname (string)` - The pathname of page on which component is rendered (as in `window.location.pathname`).
- `pattern (string)` - The pattern of a route of a page on which component is rendered. Handy for some comparison (see example usage).
- `location (string)` - The location of page on which component is rendered (as pathname but also contains query strings).
- `state (object[optional])` - Route state passed from history action. Is NOT the redux state. It is metadata only for the routing transition.
  - Values passed to state are defined in route action.

#### Example usage
```jsx
import React from 'react';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { withPageState } from '@shopgate-ps/pwa-extension-kit/connectors';
import LoadingIndicator from '...';

const MyComponent = ({ isVisible, isLoading, pattern, state }) => {
  // Returns null when component is rendered in the cart page.
  // Usually this approach is only needed in general-use portals like `app-bar.*`.
  if (pattern === CART_PATH) {
    return null;
  }
  if (!isVisible) {
    return null;
  }
  if (isLoading) {
    return <LoadingIndicator />
  }
  return <div>{state.title || 'Default title'}</div>;
}

export default withPageState(MyComponent);
```

### withUser
Connects provided component with a user data state.

#### Props provided
- `user (Object)` - User data object with following properties:
  - `isLoggedIn (bool)` - Whether the user is logged in.
  - `id (string|number|null)` - User id, null when user is logged out.
  - `email (string|null)` - User email, null when user is logged out.
  - `firstName (string|null)` - User first name, null when user is logged out.
  - `lastName (string|null)` - User last name (can contain middle name in rare edge cases), null when user is logged out.
  - `displayName (string|null)` - User name, ready to be displayed in the UI, null when user is logged out.

#### Example usage
```jsx
import { withUser } from '@shopgate-ps/pwa-extension-kit/connectors';
import User from '@shopgate-ps/pwa-extension-kit/proptypes';

const MyComponent = ({ user }) => {
  if (!user.isLoggedIn) {
    return null;
  }
  
  return <div>Hello {user.displayName}</div>
}

MyComponent.propTypes = {
  user: User.isRequired,
}

export default withUser(MyComponent);
```

### withProductContext
Connects provided component with a product context

#### Props provided
- `options (object)` - Current selected product options
- `productId (string)` - Id of the current shown product
- `variantId (string)` -  Id of the current selected variant
- `conditioner (Function)` - Helper class for ProductCharacteristic component


#### Example usage
```jsx
import React from 'react';
import { withProductContext } from '@shopgate/pwa-extension-kit/connectors';

const MyComponent = ({ options, productId, variantId, conditioner }) => {
  
  return (
    <ProductCharacteristics
        productId={productId}
        variantId={variantId}
        render={this.renderer}
        conditioner={conditioner}
        finishTimeout={200}
      />
  );
}

export default withProductContext(MyComponent);
```

### withThemeComponents
Connects provided component with some components provided by the Theme. 
Theme components are theme specific - maintain functionality with theme specific UI.


#### Props provided
- `AppBar (ReactComponent)` - <AppBar> Component from the Theme. It can be used to add our default header to your custom page.   
- `Drawer (ReactComponent)` - <Drawer> Component from the Theme. It is intended to be used to provide an additional UI layer to a page.
- `View (ReactComponent)` -  <View> Component from the Theme. Wrapper if you want to create a custom page.


#### Example usage
```jsx
import React from 'react';
import { withThemeComponents } from '@shopgate/pwa-extension-kit/connectors';

const MyComponent = ({ AppBar, View }) => {
  
  return (
    <View>
        <AppBar>
        <h1>My custom page</h1>
    </View>
  );
}

export default withThemeComponents(MyComponent);
```
