/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const badge = {
  background: colors.primary,
  borderRadius: 2,
  color: colors.primaryContrast,
  paddingTop: 5,
  paddingBottom: 5,
  width: '100%',
  fontWeight: 700,
  textAlign: 'center',
  display: 'inline-block',
  lineHeight: 1,
};

/**
 * The discount badge styles that can be selected by passing the style key.
 * @type {Object}
 */
export default {
  small: css({
    ...badge,
    fontSize: '0.75rem',
  }).toString(),
  big: css({
    ...badge,
    paddingTop: 7,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: '0.875rem',
  }).toString(),
};
