/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const header = css({
  position: 'fixed',
  height: variables.navigator.height,
  left: 0,
  top: 0,
  width: '100%',
  background: colors.light,
  zIndex: 2,
}).toString();

const grid = css({
  alignItems: 'center',
  height: '100%',
}).toString();

const title = css({
  position: 'relative',
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingLeft: variables.gap.big,
  paddingRight: variables.gap.big,
  fontSize: '1.25rem',
  fontWeight: 500,
}).toString();

const applyButton = css({
  marginRight: 4,
}).toString();

export default {
  header,
  grid,
  title,
  applyButton,
};
