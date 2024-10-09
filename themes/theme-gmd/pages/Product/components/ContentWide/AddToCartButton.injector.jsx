import React from 'react';
import { ProductContext } from '@shopgate/engage/product/contexts';

export default Component => () => (
  <ProductContext.Consumer>
    {({
      conditioner,
      options,
      productId,
      variantId,
      quantity,
    }) => (
      <Component
        conditioner={conditioner}
        options={options}
        productId={variantId || productId}
        quantity={quantity}
      />
    )}
  </ProductContext.Consumer>
);
