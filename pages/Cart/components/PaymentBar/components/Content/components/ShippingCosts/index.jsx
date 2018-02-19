/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import connect from './connector';
import styles from './style';

/**
 * The ShippingCosts component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ShippingCosts = ({ currency, isDisabled, value }) => {
  if (value === null) {
    return (
      <div className={styles.shippingInfoValue}>&nbsp;</div>
    );
  }

  return (
    <div className={`${styles.shippingInfoValue} ${isDisabled ? styles.disabled : ''}`}>
      {!value && <I18n.Text string="shipping.free_short" />}
      {!!value && <I18n.Price price={value} currency={currency} />}
    </div>
  );
};

ShippingCosts.propTypes = {
  currency: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  value: PropTypes.number,
};

ShippingCosts.defaultProps = {
  value: null,
};

export default connect(ShippingCosts);
