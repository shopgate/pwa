/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Label from './components/Label';
import connect from './connector';
import styles from './style';

/**
 * The Shipping Info component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Shipping = ({ shipping }) => (
  <Fragment>
    {shipping && shipping.price !== null && (
      <Label className={styles.shipping} price={shipping.price} currency={shipping.currency} />
    )}
  </Fragment>
);

Shipping.propTypes = {
  shipping: PropTypes.shape(),
};

Shipping.defaultProps = {
  shipping: null,
};

export default connect(Shipping);
