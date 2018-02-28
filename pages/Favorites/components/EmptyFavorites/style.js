/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
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
  flexGrow: 1,
  padding: variables.gap.big,
  paddingBottom: variables.emptyPage.buttonVerticalGap,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
}).toString();

const iconContainer = css({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
}).toString();

const title = css({
  paddingTop: variables.emptyPage.titleTopGap,
}).toString();

export default {
  container,
  iconContainer,
  title,
};
