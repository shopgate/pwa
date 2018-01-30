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
 * The SubTotal component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const SubTotal = ({ currency, isDisabled, value }) => (
  <div className={`${styles.totalValue} ${isDisabled ? styles.disabled : ''}`}>
    <I18n.Price price={value} currency={currency} />
  </div>
);

SubTotal.propTypes = {
  currency: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

export default connect(SubTotal);
