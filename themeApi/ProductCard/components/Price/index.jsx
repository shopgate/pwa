import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import { ProductGridPrice } from '@shopgate/engage/product';
import {
  PRODUCT_ITEM_PRICE,
  PRODUCT_ITEM_PRICE_BEFORE,
  PRODUCT_ITEM_PRICE_AFTER,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';

/**
 * @returns {JSX}
 */
function ProductCardPrice({ productId, price, style }) {
  const props = { productId };

  return (
    <div style={style}>
      <Portal name={PRODUCT_ITEM_PRICE_BEFORE} props={props} />
      <Portal name={PRODUCT_ITEM_PRICE} props={props}>
        <ProductGridPrice price={price} />
      </Portal>
      <Portal name={PRODUCT_ITEM_PRICE_AFTER} props={props} />
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
