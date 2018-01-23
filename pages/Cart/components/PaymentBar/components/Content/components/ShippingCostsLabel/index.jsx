/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import InfoOutlineIcon from 'Components/icons/InfoOutlineIcon';
import styles from './style';
import connect from './connector';

/**
 * The ShippingCostsLabel component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const ShippingCostsLabel = ({ isDisabled, shipping }) => {
  if (!shipping) {
    return null;
  }

  return (
    <div className={`${styles.shippingInfo} ${isDisabled ? styles.disabled : ''}`}>
      <div className={styles.shippingInfoIcon}>
        <InfoOutlineIcon />
      </div>
      <I18n.Text string="titles.shipping" />:
    </div>
  );
};

ShippingCostsLabel.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  shipping: PropTypes.number,
};

ShippingCostsLabel.defaultProps = {
  shipping: null,
};

export default connect(ShippingCostsLabel);
