# ContextMenu

The ContextMenu component is designed to be a freely positioned dropdown context menu,
where each menu item performs a specific task.

## Getting Started

```jsx
import ContextMenu from '../ContextMenu';

<ContextMenu>
  <ContextMenu.Item onClick={doSomething}>
    My menu item
  </ContextMenu.Item>
</ContextMenu>
```

## Props

### children

_Default_: `null`  
_Type_: `Array<ContextMenu.Item>`  

The children of the ContextMenu component should be an array of `ContextMenu.Item`s. Each `ContextMenu.Item` also supports an `onClick` handler.

###### Usage:

```jsx
<ContextMenu>
  <ContextMenu.Item onClick={doSomething}>Item #1</ContextMenu.Item>
  <ContextMenu.Item onClick={doSomething}>Item #2</ContextMenu.Item>
  <ContextMenu.Item onClick={doSomething}>Item #3</ContextMenu.Item>
</ContextMenu>
```
