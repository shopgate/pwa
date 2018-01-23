/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';
import fonts from 'Styles/fonts';

const outerGap = 40;

const container = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: `calc(100vw - ${outerGap * 2}px)`,
  maxHeight: `calc(100vh - ${outerGap * 2}px)`,
  borderRadius: 2,
  boxShadow: '0 0.75em 3em 0 rgba(0, 0, 0, 0.5)',
  background: colors.light,
}).toString();

const content = css({
  padding: variables.gap.small * 3,
}).toString();

const title = css({
  fontSize: '1.25em',
  lineHeight: fonts.lineHeight,
  fontWeight: 500,
  paddingBottom: variables.gap.small,
  marginTop: '-.25em',
}).toString();

const body = css({
  color: colors.shade6,
  flexGrow: 1,
  overflow: 'auto',
}).toString();

const actions = css({
  alignSelf: 'flex-end',
  padding: variables.gap.small,
}).toString();

const innerActions = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
}).toString();

const button = css({
  marginRight: `-${variables.gap.small / 2}px`,
}).toString();

export default {
  container,
  content,
  title,
  body,
  actions,
  innerActions,
  button,
};
