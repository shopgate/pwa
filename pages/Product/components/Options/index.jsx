import React from 'react';
import { PRODUCT_OPTIONS } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { ProductContext } from '../../context';
import Content from './components/Content';
import Option from './components/Option';
import TextOption from './components/TextOption';

// Export for theme api
export { TextOption, Option as SelectOption };

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
