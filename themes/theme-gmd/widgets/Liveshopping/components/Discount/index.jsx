import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DiscountBadge } from '@shopgate/engage/components';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_DISCOUNT,
  PRODUCT_ITEM_DISCOUNT_BEFORE,
  PRODUCT_ITEM_DISCOUNT_AFTER,
} from '@shopgate/engage/category';
import styles from './style';

/**
 * The LiveshoppingDiscount component.
 * @param {Object} props The component props.
 * @param {Object} props.productId The productId.
 * @returns {JSX}
 */
function LiveshoppingDiscount({ discount, productId }) {
  const props = { productId };

  return (
    <Fragment>
      <Portal name={PRODUCT_ITEM_DISCOUNT_BEFORE} props={props} />
      <Portal name={PRODUCT_ITEM_DISCOUNT} props={props}>
        <DiscountBadge
          text="liveshopping.discount_badge"
          discount={discount}
          display="big"
          className={styles}
        />
      </Portal>
      <Portal name={PRODUCT_ITEM_DISCOUNT_AFTER} props={props} />
    </Fragment>
  );
}

LiveshoppingDiscount.propTypes = {
  discount: PropTypes.number.isRequired,
  productId: PropTypes.string.isRequired,
};

export default LiveshoppingDiscount;
