# ProductVariants HOC
---

ProductVariants is a higher order component, which takes care about the processing of the _getProductVariants_ pipeline response data.

Therefore it wraps a component and injects a "selection" prop that represents the current state of the product variants selection.

## Getting Started

```javascript
import { ProductVariants } from 'Library/components';
```

## Props

### variants

_Default_: `null`  
_Type_: `Array`  

The response data of the _getProductVariants_ pipeline request. This prop needs to be applied to the wrapped component.

### selection

_Default_: `null`  
_Type_: `Array|null`  

Data structure that represents the current variants selection of the user. This prop is injected into the wrapped component.

### handleSelectionUpdate

_Type_: `Function`  

Triggers a product selection update. It has two parameters ***characteristicId*** and ***characteristicValueId*** which indicate, where the user did the selection.

## Functions

##### ProductVariants 

Wraps the given component and data fields.

###### Parameters

- **WrappedComponent** {React.Component}<br>
Target component.

###### Returns
- {React.Component} - The wrapped component (props are passed)

###### Example

```javascript
import { ProductVariants } from 'Library/components';

class MyComponent extends Component {
  // ...
  
  render() {
    const { selection } = this.props;

    return (
      <ul>
        {selection.map(characteristic =>
          ...
        )}
      </ul>
    );
  }
}

export default ProductVariants(MyComponent);
```
---
