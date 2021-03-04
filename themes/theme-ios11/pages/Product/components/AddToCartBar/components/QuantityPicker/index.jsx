import React from 'react';
import { QuantityPicker, withProductStock, ProductContext } from '@shopgate/engage/product';

export default withProductStock(props => (
  <ProductContext.Consumer>
    {({ conditioner, setQuantity }) => (
      <QuantityPicker
        conditioner={conditioner}
        setQuantity={setQuantity}
        {...props}
      />
    )}
  </ProductContext.Consumer>
));

