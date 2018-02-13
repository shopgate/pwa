/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  background: colors.shade8,
  textAlign: 'center',
  height: '100%',
}).toString();

const container = css({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: '1',
  flexShrink: '0',
}).toString();

const icon = css({
  width: variables.emptyPage.icon,
}).toString();

const title = css({
  textAlign: 'center',
  paddingTop: variables.emptyPage.titleTopGap,
}).toString();

const buttonContainer = css({
  flexGrow: '0',
  padding: `${variables.emptyPage.buttonVerticalGap}px ${variables.gap.big}px`,
}).toString();

const button = css({
  width: '100%',
}).toString();

export default {
  wrapper,
  container,
  icon,
  title,
  buttonContainer,
  button,
};
