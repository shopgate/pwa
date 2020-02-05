import React, { useContext } from 'react';
import { Ellipsis } from '../../../components';
import FulfillmentContext from '../context';
import { productName } from './style';

/**
 * Renders the product's name.
 * @returns {JSX}
 */
function StoreListProductName() {
  const { product } = useContext(FulfillmentContext);

  return (
    <div className={productName}>
      <Ellipsis>{product.name}</Ellipsis>
    </div>
  );
}

export default StoreListProductName;
