/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

/**
 * @param {string} [background='#f2f2f2'] The background color.
 * @param {string} [paddingTop='100%'] The padding top value.
 * @returns {string} The compiled class names.
 */
const container = (background = '#f2f2f2', paddingTop = '100%') => css({
  position: 'relative',
  background,
  zIndex: 0,
  ':before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop,
  },
}).toString();

const image = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
}).toString();

export default {
  container,
  image,
};
