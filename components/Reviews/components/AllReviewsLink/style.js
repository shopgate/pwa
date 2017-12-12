/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

/**
 * Styles for a link parent container.
 * @type {string}
 */
const container = css({
  display: 'flex',
  justifyContent: 'flex-end',
  textAlign: 'right',
});

/**
 * Styles for all reviews link.
 * @type {string}
 */
const link = css({
  color: colors.primary,
  display: 'inline-block',
  textTransform: 'uppercase',
  width: 'auto',
  padding: `${variables.gap.big}px`,
  marginBottom: `-${variables.gap.big}px`,
  fontWeight: 500,
}).toString();

export {
  container,
  link,
};
