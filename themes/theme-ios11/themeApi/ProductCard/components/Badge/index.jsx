import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import { DiscountBadge } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_DISCOUNT_BEFORE,
  PRODUCT_ITEM_DISCOUNT_AFTER,
} from '@shopgate/engage/category';
import styles from './style';

/**
 * @returns {JSX}
 */
function ProductCardBadge({ productId, style, value }) {
  const props = { productId };

  return (
    <div className={styles} style={style}>
      <Portal name={PRODUCT_ITEM_DISCOUNT_BEFORE} props={props} />
      <Portal name={PRODUCT_ITEM_DISCOUNT} props={props}>
        <DiscountBadge text={`${value}%`} />
      </Portal>
      <Portal name={PRODUCT_ITEM_DISCOUNT_AFTER} props={props} />
    </div>
  );
}

ProductCardBadge.propTypes = {
  productId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  style: PropTypes.shape(),
};

ProductCardBadge.defaultProps = {
  style: {},
};

export default ProductCardBadge;
