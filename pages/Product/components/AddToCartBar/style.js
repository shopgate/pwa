/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: variables.gap.small,
  background: colors.light,
});

const ctaContainer = css({
  display: 'flex',
});

const dummy = css({
  display: 'block',
  minHeight: 54,
});

export default {
  container,
  ctaContainer,
  dummy,
};
