import React from 'react';
import { QuantityPicker, withProductStock } from '@shopgate/engage/product';
import { ProductContext } from '../../../../context';

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

