import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import { ProductGridPrice } from '@shopgate/engage/product';
import {
  PRODUCT_ITEM_PRICE,
  PRODUCT_ITEM_PRICE_BEFORE,
  PRODUCT_ITEM_PRICE_AFTER,
} from '@shopgate/engage/category';

/**
 * @returns {JSX}
 */
function ProductCardPrice({ style, product }) {
  const { id: productId } = product;

  const props = { productId };

  return (
    <div style={style}>
      <Portal name={PRODUCT_ITEM_PRICE_BEFORE} props={props} />
      <Portal name={PRODUCT_ITEM_PRICE} props={props}>
        <ProductGridPrice product={product} />
      </Portal>
      <Portal name={PRODUCT_ITEM_PRICE_AFTER} props={props} />
    </div>
  );
}

ProductCardPrice.propTypes = {
  product: PropTypes.shape().isRequired,
  style: PropTypes.shape(),
};

ProductCardPrice.defaultProps = {
  style: {},
};

export default ProductCardPrice;
