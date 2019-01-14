import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import ProductGridPrice from 'Components/ProductGridPrice';
import {
  PRODUCT_CARD_PRICE,
  PRODUCT_CARD_PRICE_BEFORE,
  PRODUCT_CARD_PRICE_AFTER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';

/**
 * @returns {JSX}
 */
function ProductCardPrice({ productId, price, style }) {
  const props = { productId };

  return (
    <div style={style}>
      <Portal name={PRODUCT_CARD_PRICE_BEFORE} props={props} />
      <Portal name={PRODUCT_CARD_PRICE} props={props}>
        <ProductGridPrice price={price} />
        <Portal name={PRODUCT_CARD_PRICE_AFTER} props={props} />
      </Portal>
    </div>
  );
}

ProductCardPrice.propTypes = {
  price: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  style: PropTypes.shape(),
};

ProductCardPrice.defaultProps = {
  style: {},
};

export default ProductCardPrice;
