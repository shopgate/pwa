/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';
import connect from './connector';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const ShippingCostsLabel = ({ isDisabled, shipping }) => (
  <div className={`${styles.shippingInfo} ${isDisabled ? styles.disabled : ''}`}>
    <I18n.Text string={shipping === null ? 'shipping.unknown' : 'titles.shipping'} />
    {shipping !== null ? ':' : ''}
  </div>
);

ShippingCostsLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  shipping: PropTypes.number,
};

ShippingCostsLabel.defaultProps = {
  shipping: null,
};

export default connect(ShippingCostsLabel);
