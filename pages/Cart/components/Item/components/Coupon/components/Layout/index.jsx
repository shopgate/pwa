/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Icon from './components/Icon';
import CouponPrice from './components/CouponPrice';
import Title from './components/Title';
import Code from './components/Code';
import Delete from './components/Delete';
import styles from './style';

/**
 * The CouponLayout component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const Layout = ({ coupon, currency, handleDelete }) => (
  <Grid className={styles.item}>
    <Grid.Item className={styles.icon}>
      <Icon />
    </Grid.Item>
    <Grid.Item className={styles.content} grow={1}>
      <Title value={coupon.label} />
      <Code value={coupon.code} />
    </Grid.Item>
    <Grid.Item className={`${styles.content} ${styles.contentLast}`} grow={1} shrink={0}>
      <Delete handleDelete={handleDelete} />
      { (coupon.savedPrice && coupon.savedPrice.value > 0) &&
        <CouponPrice currency={currency} savedPrice={coupon.savedPrice} />
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

export default Layout;
