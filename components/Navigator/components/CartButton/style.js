/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const button = css({
  background: colors.primary,
  fontSize: '1.5rem',
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: 0,
  width: 0,
  height: variables.navigator.height,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  transform: 'translate3d(100%, 0, 0)',
  transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1), min-width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
}).toString();

const buttonContent = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  color: colors.primaryContrast,
}).toString();

const badge = css({
  position: 'absolute',
  fontSize: '0.75rem',
  lineHeight: 1.4,
  fontWeight: 700,
  background: colors.primaryContrast,
  color: colors.primary,
  borderRadius: variables.gap.small,
  height: variables.gap.big,
  minWidth: variables.gap.big,
  paddingLeft: (variables.gap.small / 2),
  paddingRight: (variables.gap.small / 2),
  transform: 'translate3d(7px, -10px, 0)',
  boxShadow: '0 1px 1px rgba(0, 0, 0, 0.25)',
}).toString();

export default {
  button,
  buttonContent,
  badge,
};
