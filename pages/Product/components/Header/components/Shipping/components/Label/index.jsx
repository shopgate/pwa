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

/**
 * The Shipping Label component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Label = ({ className, price, currency }) => (
  <div className={`${className} ${styles.text}`}>
    {price > 0 ? (
      <I18n.Text string="shipping.cost">
        <I18n.Price forKey="price" price={price} currency={currency} />
      </I18n.Text>
    ) : (
      <I18n.Text string="shipping.free" />
    )}
  </div>
);

Label.propTypes = {
  currency: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  className: PropTypes.string,
};

Label.defaultProps = {
  className: '',
};

export default Label;
