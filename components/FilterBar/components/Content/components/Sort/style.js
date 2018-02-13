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
  color: 'inherit',
  outline: 0,
  marginLeft: 10,
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  justifyContent: 'center',
  height: variables.filterbar.height,
  whiteSpace: 'nowrap',
}).toString();

const selection = css({
  fontSize: '0.875rem',
  fontWeight: '500',
  lineHeight: 1,
  paddingTop: 1,
  alignSelf: 'center',
}).toString();

const icon = css({
  fontSize: '1.5rem',
}).toString();

const iconOpen = css({
  transform: 'rotate(180deg)',
}).toString();

const dropdown = css({
  position: 'absolute',
  width: '100%',
  zIndex: 2,
  top: variables.filterbar.height,
  left: 0,
  backgroundColor: colors.background,
  boxShadow: 'rgba(0, 0, 0, 0.16) 0 4px 4px',
}).toString();

const selectItem = css({
  padding: 0,
  outline: 0,
  overflow: 'hidden',
  textAlign: 'left',
  width: '100%',
  ':first-child': {
    marginTop: variables.gap.big / 2,
  },
  ':last-child': {
    marginBottom: variables.gap.big / 2,
  },
}).toString();

const selectBox = css({
  flexGrow: 2,
}).toString();

export default {
  button,
  selection,
  icon,
  iconOpen,
  dropdown,
  selectItem,
  selectBox,
};
