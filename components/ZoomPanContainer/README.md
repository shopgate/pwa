# ZoomPanContainer
---
The zoom pan container is a wrapper component that makes it possible to zoom and pan its child components.

## Getting Started

```js
import { ZoomPanContainer } from 'Library/components';

<ZoomPanContainer>
  <Image src="https://placekitten.com/300/300" />
  <Image src="https://placekitten.com/300/300" />
  <Image src="https://placekitten.com/300/300" />
</ZoomPanContainer>
```

## Props

### children (required)

_Type_: `Node`<br>

The children displayed in the container. Should be passed via JSX.

### maxZoom

_Type_: `number`<br>
_Default_: `4`

The maximum zoom factor for this container.

###### Usage:

```js
<ZoomPanContainer maxZoom={3}>
  ...
</ZoomPanContainer>
```

### minZoom

_Type_: `number`<br>
_Default_: `1`

The minimum zoom factor for this container.

###### Usage:

```js
<ZoomPanContainer minZoom={1}>
  ...
</ZoomPanContainer>
```

### onZoom

_Type_: `Function`<br>

An optional callback to be executed when the zoom of the container has been changed.

###### Usage:

```js
<ZoomPanContainer onZoom={(zoom) => { /* ... */ }}>
  ...
</ZoomPanContainer>
```

### smoothness

_Type_: `number`<br>
_Default_: `200`

The transition time in ms that is applied to the pan and zoom changes.

###### Usage:

```js
<ZoomPanContainer smoothness={400}>
  ...
</ZoomPanContainer>
```

### zoomBounce

_Type_: `number`<br>
_Default_: `0.3`

The bounciness applied to the zoom when the content is being pinched. Pass `0` to disable bouncing.

###### Usage:

```js
<ZoomPanContainer zoomBounce={0.1}>
  ...
</ZoomPanContainer>
```

### zoomOnTap

_Type_: `number`<br>
_Default_: `2`

The zoom level added to the current zoom when the container is double tapped. If the container is already zoomed in,
the default zoom level (`minZoom`) is applied. 

###### Usage:

```js
<ZoomPanContainer zoomOnTap={1}>
  ...
</ZoomPanContainer>
```

--- 
