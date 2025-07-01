import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_PRICE,
} from '@shopgate/engage/category';
import { ProductGridPrice } from '@shopgate/engage/product';

/**
 * The item price component.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ItemPrice = ({ display, product }) => {
  const { id: productId } = product;

  const portalProps = useMemo(() => ({
    productId,
    location: 'productGrid',
  }), [productId]);

  if (display && !display.price) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_ITEM_PRICE} portalProps={portalProps}>
      <ProductGridPrice product={product} />
    </SurroundPortals>
  );
};

ItemPrice.propTypes = {
  product: PropTypes.shape().isRequired,
  display: PropTypes.shape(),
};

ItemPrice.defaultProps = {
  display: null,
};

export default memo(ItemPrice);
