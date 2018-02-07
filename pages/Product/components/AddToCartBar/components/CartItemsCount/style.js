/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  transition: 'opacity 200ms linear, transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.375)',
  willChange: 'transform',
});

const check = css({
  fontSize: '1.2rem',
  paddingRight: variables.gap.small,
});

export default {
  container,
  check,
};
