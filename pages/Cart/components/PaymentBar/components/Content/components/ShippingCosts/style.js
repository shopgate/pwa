/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const shippingInfoValue = css({
  fontSize: '0.875rem',
  color: colors.shade9,
  textAlign: 'right',
}).toString();

export default {
  disabled,
  shippingInfoValue,
};
