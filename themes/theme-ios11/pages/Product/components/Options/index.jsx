import React from 'react';
import { PRODUCT_OPTIONS } from '@shopgate/engage/product';
import { SurroundPortals } from '@shopgate/engage/components';
import { ProductContext } from '../../context';
import Content from './components/Content';
import Option from './components/Option';
import PriceDifference from './components/PriceDifference';
import TextOption from './components/TextOption';

// Export for theme api
export { TextOption, Option as SelectOption, PriceDifference };

/**
 * The Product Options component.
 * @returns {JSX}
 */
const Options = () => (
  <ProductContext.Consumer>
    {({ productId, variantId, options }) => (
      <SurroundPortals
        portalName={PRODUCT_OPTIONS}
        portalProps={{
          productId: variantId || productId,
        }}
      >
        <Content /* props needed in connector */
          productId={variantId || productId}
          currentOptions={options}
        />
      </SurroundPortals>
    )}
  </ProductContext.Consumer>
);

export default Options;
