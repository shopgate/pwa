/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: 4,
}).toString();

const filterContainer = css({
  background: colors.light,
}).toString();

const clearBtn = css({
  textAlign: 'right',
}).toString();

export default {
  container,
  filterContainer,
  clearBtn,
};
