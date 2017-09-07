/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

/**
 * Creates a class name for the flex-wrap property
 * @param {boolean} [value=false] TRUE for 'wrap', FALSE for 'nowrap'
 * @return {string} The class name
 */
export const wrap = (value = false) => css({
  flexWrap: value ? 'wrap' : 'nowrap',
}).toString();

export default css({
  display: 'flex',
  minWidth: '100%',
}).toString();
