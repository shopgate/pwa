// @flow
import React, { useContext } from 'react';
import { Ellipsis } from '../../../components';
import { FulfillmentContext } from '../../locations.context';
import { productName } from './StoreListProduct.style';

/**
 * Renders the product's name.
 * @returns {JSX}
 */
function StoreListProductName() {
  const { baseProduct } = useContext(FulfillmentContext);
  if (!baseProduct) {
    return null;
  }

  return (
    <div className={productName}>
      <Ellipsis>{baseProduct.name}</Ellipsis>
    </div>
  );
}

export default StoreListProductName;
