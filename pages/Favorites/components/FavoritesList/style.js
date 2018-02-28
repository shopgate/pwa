/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.background,
  paddingTop: variables.gap.xsmall,
  paddingBottom: variables.gap.xsmall,
  marginBottom: variables.gap.xxbig, // Place for snackbar.
}).toString();

export default {
  container,
};
