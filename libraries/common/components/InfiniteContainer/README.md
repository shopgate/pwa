# InfiniteContainer
---
The InfiniteContainer component is used to display a range of items based on the scroll position.
It uses a `loader` function, which accepts a range of items to load (`offset, limit`).
The `loader` function should be a dispatcher, that requests new `items`.
Whenever new `items` are received through prop, their data gets mapped to renderable React nodes using the `iterator` function.
Items are requested initially when the component did mount and everytime the user scrolls below a defined 
viewport `preloadMultiplier`. The number of items to load can be defined by `limit`.
This behaviour is applied as long as the defined number of `totalItems` is not reached.
The component accepts an `initialOffset` of items to load as well.
The component also supports usage of a custom `wrapper` to group the loaded items and a custom `loadingIndicator`.

## Getting Started

```js
import { InfiniteContainer } from 'Library/components';

<InfiniteContainer
  iterator={item => <div>{item.content}</div>}
  loader={someDispatcherForNewItems}
  items={listOfItemData}
  totalItems={numberOfTotalItems}
/>
```

## Props

### iterator (required)

_Type_: `Function`<br>
_Returns_: `Node`<br>

A function that receives the data of a single item and should return a renderable React node.

###### Usage:

```
<InfiniteContainer
  iterator={item => <div>{item.title}</div>}
  ...
/>
```

### loader (required)

_Type_: `Function`<br>

This function is used to request new items and accepts a range (`{number} offset`, `{number} limit`) 
of items to be requested.
Whenever this function gets triggered, new items will be received through `items` prop.

###### Usage:

```
<InfiniteContainer
  loader={someDispatcherForNewItems}
  ...
/>
```


### items (required)

_Type_: `Array`

A list of item data that runs through `iterator` and then gets displayed in the component.

###### Usage:

```
<InfiniteContainer
  items={listOfItemData}
  ...
/>
```


### totalItems (required)

_Type_: `number`

The total amount of items that can be loaded.
It is used to stop the component from performing requests if the number of loaded items already 
reached this value.

###### Usage:

```
<InfiniteContainer
  totalItems={mockData.length}
  ...
/>
```


### limit

_Type_: `number`<br>
_Default_: `40`<br>

The number of items to load when reaching a specific scroll position.

###### Usage:

```
<InfiniteContainer
  limit={40}
  ...
/>
```

### initialLimit

_Type_: `number`<br>
_Default_: `10`<br>

The number of items to show if we already have the data. 
This solves the issue that the first render of the page can be very slow 
if we already have a lot of products in the cache. 
In this case you can use initialLimit to show only a few products for the first time. 
As soon as the user scrolls more products are show according to `limit`.

###### Usage:

```
<InfiniteContainer
  initialLimit={6}
  ...
/>
```


### initialOffset

_Type_: `Array`<br>
_Default_: `[0, 20]`<br>

The offset and limit of items that should be loaded initially.
It's an array with to values.
First is the offset from where to start. This _should_ be 0 in most cases.
Second is the limit of items to load.
An initialOffset of `[5, 20]` would load 20 items starting at index 5 and ending with index 24.

###### Usage:

```
<InfiniteContainer
  initialOffset={[0, 40]}
  ...
/>
```


### loadingIndicator

_Type_: `Node`<br>
_Default_: `null`<br>

Can be any renderable React node that will be displayed at the end of the component every time items are loaded.  

###### Usage:

```
<InfiniteContainer
  loadingIndicator="Loading items ..."
  ...
/>
```

```
<InfiniteContainer
  loadingIndicator={<CustomLoadingIndicator />}
  ...
/>
```
---


### preloadMultiplier

_Type_: `number`<br>
_Default_: `2`<br>

A container/viewport based multiplier that defines the height from bottom up at which new items will be loaded.
A value of 1 equals the height of the component's scrolling container (for example the window object).

###### Usage:

```
<InfiniteContainer
  preloadMultiplier={2}
  ...
/>
```


### wrapper

_Type_: `Node|Function`<br>
_Default_: `'div'`<br>

A custom wrapper that will be used to group all of the loaded items.
It can be defined as Function or React element.

The internal function behavior looks like this and receives a prop-like Object 
containing the children to be rendered:
```
wrapper({ children });
```
The internal React element behavior looks like this:
```
React.createElement(wrapper, {}, children);
```

###### Usage:

```
// Using a simple wrapper funtion
<InfiniteContainer
  wrapper={props => <MyComponent>{props.children}</MyComponent>}
  ...
/>

// Using an React element that renders children by default
<InfiniteContainer
  wrapper={MyWrapperComponent}
  ...
/>
```
---


### viewId 
 
_Type_: `string|number`<br> 
_Default_: `null`<br> 
 
A unique id that will be used internaly to memoize and restore the last scroll position 
between two instances that show the same content. 
 
###### Usage: 
 
``` 
<InfiniteContainer 
  viewId="some-unique-category-id" 
  ... 
/> 
``` 
--- 
