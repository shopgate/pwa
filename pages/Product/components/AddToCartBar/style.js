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
  boxShadow: '0 0 30px rgba(0,0,0,0.1)',
});

const base = css({
  position: 'relative',
  height: 46,
});

const statusBar = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  maxWidth: '65%',
  padding: `0 ${variables.gap.small}px`,
});

const dummy = css({
  display: 'block',
  minHeight: 62,
});

export default {
  container,
  base,
  statusBar,
  dummy,
};
