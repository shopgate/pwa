// @flow
import React, { useContext } from 'react';
import { Ellipsis } from '../../../components';
import { FulfillmentContext, type FulfillmentContextProps } from '../../locations.context';
import { productName } from './StoreListProduct.style';

/**
 * Renders the product's name.
 * @returns {JSX}
 */
function StoreListProductName() {
  const { baseProduct } : FulfillmentContextProps = useContext(FulfillmentContext);

  return (
    <div className={productName}>
      <Ellipsis>{baseProduct.name}</Ellipsis>
    </div>
  );
}

export default StoreListProductName;
