import React, { useContext } from 'react';
import { FulfillmentSelector } from '@shopgate/engage/product';
import { ProductContext } from '../../context';

/**
 * The Product Options component.
 * @returns {JSX}
 */
function Fulfillment() {
  const { productId, variantId } = useContext(ProductContext);

  return (
    <FulfillmentSelector productId={variantId || variantId === 0 ? variantId : productId} />
  );
}

export default Fulfillment;
