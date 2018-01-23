/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';
import colors from 'Styles/colors';

const container = css({
  position: 'relative',
}).toString();

const button = css({
  display: 'block',
  fontSize: '1.5rem',
  outline: 0,
  padding: 0,
}).toString();

const overlay = css({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
}).toString();

const menu = css({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: `${variables.gap.small}px 0`,
  minWidth: 130,
  background: colors.light,
  borderRadius: 2,
  boxShadow: '0 2px 6px rgba(0, 0, 0, .4)',
}).toString();

export default {
  container,
  button,
  menu,
  overlay,
};
