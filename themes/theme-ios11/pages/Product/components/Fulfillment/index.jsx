import React from 'react';
import { FulfillmentSelector } from '@shopgate/engage/product';
import { ProductContext } from '../../context';

/**
 * The Product Options component.
 * @returns {JSX}
 */
export default () => (
  <ProductContext.Consumer>
    {({ productId, variantId }) => (
      <FulfillmentSelector productCode={variantId || variantId === 0 ? variantId : productId} />
    )}
  </ProductContext.Consumer>
);
