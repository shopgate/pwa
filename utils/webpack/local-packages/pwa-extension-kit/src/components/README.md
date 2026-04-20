# Shopgate Connect - PWA Extension Kit - /components - Common Components
## Purpose

## Available components
### ProductCharacteristics
Component that can be used to change the UI of the characteristics/variant selection

#### Possible usage
Everywhere as a React component rendered within the PWA app.

#### Props
- `render (function)` - Render Prop [read documentation](https://reactjs.org/docs/render-props.html)
    - `disabled (bool)` - Characteristic should not be clickable 
    - `highlight (bool)` - Info if the current characteristic should be highlighted because it's the first unselected one
    - `select (function)` - Function that needs to be called to select a new value
    - `selected (string)` - Current selected characteristic
    - `id (string)` - Id of the characteristics
    - `label (string)` - Label of the characteristic
    - `values (array)` - Values of the characteristic
    
    
#### Example usage
```jsx
import React, { Component } from 'react'
import { ProductCharacteristics } from '@shopgate/pwa-extension-kit/components';

class MyComponent extends Component {
  renderer = (props) => <CustomCharacteristics {...props} />; 
  
  render() {
    return (
     <ProductCharacteristics render={this.renderer}/>
    );
  }
}

export default MyComponent;
```