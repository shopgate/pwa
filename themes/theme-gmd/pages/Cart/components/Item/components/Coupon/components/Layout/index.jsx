import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal, Grid } from '@shopgate/engage/components';
import {
  CART_ITEM_IMAGE_BEFORE,
  CART_ITEM_IMAGE,
  CART_ITEM_IMAGE_AFTER,
  CART_ITEM_NAME_BEFORE,
  CART_ITEM_NAME,
  CART_ITEM_NAME_AFTER,
  CART_ITEM_COUPON_CODE_BEFORE,
  CART_ITEM_COUPON_CODE,
  CART_ITEM_COUPON_CODE_AFTER,
  CART_ITEM_PRICE_BEFORE,
  CART_ITEM_PRICE,
  CART_ITEM_PRICE_AFTER,
} from '@shopgate/engage/cart';
import Icon from './components/Icon';
import CouponPrice from './components/CouponPrice';
import CouponFreeShipping from './components/CouponFreeShipping';
import Title from './components/Title';
import Code from './components/Code';
import Delete from './components/Delete';
import styles from './style';

/**
 * The CouponLayout component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const Layout = ({ coupon, currency, handleDelete }, context) => (
  <Grid className={styles.item}>
    <Grid.Item className={styles.icon}>
      <Portal name={CART_ITEM_IMAGE_BEFORE} props={context} />
      <Portal name={CART_ITEM_IMAGE} props={context}>
        <Icon />
      </Portal>
      <Portal name={CART_ITEM_IMAGE_AFTER} props={context} />
    </Grid.Item>
    <Grid.Item className={styles.content} grow={1}>
      <Portal name={CART_ITEM_NAME_BEFORE} props={context} />
      <Portal name={CART_ITEM_NAME} props={context}>
        <Title value={coupon.label} />
      </Portal>
      <Portal name={CART_ITEM_NAME_AFTER} props={context} />

      <Portal name={CART_ITEM_COUPON_CODE_BEFORE} props={context} />
      <Portal name={CART_ITEM_COUPON_CODE} props={context}>
        <Code value={coupon.code} />
      </Portal>
      <Portal name={CART_ITEM_COUPON_CODE_AFTER} props={context} />
    </Grid.Item>
    <Grid.Item className={`${styles.content} ${styles.contentLast}`} grow={1} shrink={0}>
      <Delete handleDelete={handleDelete} />
      <CouponFreeShipping freeShipping={coupon.freeShipping} />
      {(coupon.savedPrice && coupon.savedPrice.value > 0) &&
        <Fragment>
          <Portal name={CART_ITEM_PRICE_BEFORE} props={context} />
          <Portal name={CART_ITEM_PRICE} props={context}>
            <CouponPrice currency={currency} savedPrice={coupon.savedPrice} />
          </Portal>
          <Portal name={CART_ITEM_PRICE_AFTER} props={context} />
        </Fragment>
        }
    </Grid.Item>
  </Grid>
);

Layout.propTypes = {
  coupon: PropTypes.shape().isRequired,
  currency: PropTypes.string.isRequired,
  handleDelete: PropTypes.func,
};

Layout.defaultProps = {
  handleDelete: () => {},
};

Layout.contextTypes = {
  cartItemId: PropTypes.string,
  type: PropTypes.string,
};

export default Layout;
