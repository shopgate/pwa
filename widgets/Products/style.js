/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const listView = css({
  background: colors.light,
  overflow: 'auto',
  '> ul > li:first-child': {
    paddingTop: 0,
  },
  '> ul > li:last-child': {
    paddingBottom: 0,
  },
}).toString();

export default {
  listView,
};
