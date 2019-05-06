import React, { Fragment } from 'react';
import { hasQuantityPicker } from '@shopgate/engage/product';
import { ProductContext } from '../../../../../../context';
import ProductQuantityPicker from './components/ProductQuantityPicker';

/**
 * The QuantityPicker component.
 * @returns {JSX}
 */
const QuantityPicker = () => (
  <Fragment>
    {hasQuantityPicker() &&
      <ProductContext.Consumer>
        {({ productId, variantId }) => (
          <ProductQuantityPicker productId={variantId || productId} />
        )}
      </ProductContext.Consumer>
    }
  </Fragment>
);

export default QuantityPicker;
