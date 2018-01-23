/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';
/**
 * Styles for a link parent container.
 * @type {string}
 */
const container = css({
  display: 'flex',
  justifyContent: 'flex-end',
  textAlign: 'right',
  marginTop: -variables.gap.small,
  marginBottom: -variables.gap.big,
});

export {
  container,
};
