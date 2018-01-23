/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

/**
 * Returns the styling based on the container height.
 * @param {number} height The maximum height for the container.
 * @returns {string}
 */
const container = height => css({
  position: 'relative',
  maxHeight: height,
  overflow: 'hidden',
  marginBottom: variables.gap.small,
}).toString();

const layout = css({
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
  padding: '7px 5px',
  overflow: 'hidden',
}).toString();

const moreButtonWrapper = css({
  position: 'absolute',
  right: 0,
  bottom: variables.gap.small * 0.5,
  marginLeft: 'auto',
  marginRight: variables.gap.small,
}).toString();

const moreButtonBase = {
  marginLeft: 'auto',
  outline: 0,
  padding: 9,
  fontSize: '0.8rem',
  fontWeight: 500,
  textTransform: 'uppercase',
};

const moreButton = css({
  ...moreButtonBase,
  color: colors.light,
}).toString();

const moreButtonInverted = css({
  ...moreButtonBase,
  color: colors.accent,
}).toString();

export default {
  container,
  layout,
  moreButtonWrapper,
  moreButton,
  moreButtonInverted,
};
