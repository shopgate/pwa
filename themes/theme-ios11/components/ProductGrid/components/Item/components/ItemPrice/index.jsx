import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_PRICE,
  PRODUCT_ITEM_PRICE_AFTER,
  PRODUCT_ITEM_PRICE_BEFORE,
} from '@shopgate/engage/category';
import { ProductGridPrice } from '@shopgate/engage/product';

/**
 * The item price component.
 * @returns {JSX}
 */
const ItemPrice = ({ display, product }) => {
  const { id: productId } = product;

  if (display && !display.price) {
    return null;
  }

  const props = {
    productId,
    location: 'productGrid',
  };

  return (
    <Fragment>
      <Portal name={PRODUCT_ITEM_PRICE_BEFORE} props={props} />
      <Portal name={PRODUCT_ITEM_PRICE} props={props}>
        <ProductGridPrice product={product} />
      </Portal>
      <Portal name={PRODUCT_ITEM_PRICE_AFTER} props={props} />
    </Fragment>
  );
};

ItemPrice.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

ItemPrice.defaultProps = {
  display: null,
};

export default ItemPrice;
