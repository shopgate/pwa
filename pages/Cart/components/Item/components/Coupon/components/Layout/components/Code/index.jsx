/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';

/**
* The Coupon Code component.
* @param {Object} props The component props.
* @returns {JSX}
*/
const Code = ({ value }) => (
  <div>
    <I18n.Text string="cart.coupon_code" />: {value}
  </div>
);

Code.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Code;
