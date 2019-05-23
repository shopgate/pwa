import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import * as portals from '@shopgate/engage/cart';
import { Grid } from '@shopgate/engage/components';
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
      <Portal name={portals.CART_ITEM_IMAGE_BEFORE} props={context} />
      <Portal name={portals.CART_ITEM_IMAGE} props={context}>
        <Icon />
      </Portal>
      <Portal name={portals.CART_ITEM_IMAGE_AFTER} props={context} />
    </Grid.Item>
    <Grid.Item className={styles.content} grow={1}>
      <Portal name={portals.CART_ITEM_NAME_BEFORE} props={context} />
      <Portal name={portals.CART_ITEM_NAME} props={context}>
        <Title value={coupon.label} />
      </Portal>
      <Portal name={portals.CART_ITEM_NAME_AFTER} props={context} />

      <Portal name={portals.CART_ITEM_COUPON_CODE_BEFORE} props={context} />
      <Portal name={portals.CART_ITEM_COUPON_CODE} props={context}>
        <Code value={coupon.code} />
      </Portal>
      <Portal name={portals.CART_ITEM_COUPON_CODE_BEFORE} props={context} />
    </Grid.Item>
    <Grid.Item className={`${styles.content} ${styles.contentLast}`} grow={1} shrink={0}>
      <Delete handleDelete={handleDelete} />
      <CouponFreeShipping freeShipping={coupon.freeShipping} />
      { (coupon.savedPrice && coupon.savedPrice.value > 0) &&
        <Fragment>
          <Portal name={portals.CART_ITEM_PRICE_BEFORE} props={context} />
          <Portal name={portals.CART_ITEM_PRICE} props={context}>
            <CouponPrice currency={currency} savedPrice={coupon.savedPrice} />
          </Portal>
          <Portal name={portals.CART_ITEM_PRICE_AFTER} props={context} />
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
