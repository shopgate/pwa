/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const regularColor = '#a1a1a1';

const container = css({
  display: 'flex',
  position: 'relative',
  flexBasis: 0,
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'center',
  fontWeight: 500,
  fontSize: '0.64rem',
  height: '100%',
  padding: 0,
  '> svg': {
    flexGrow: 1,
    marginTop: 2,
  },
}).toString();

const regular = css({
  color: regularColor,
}).toString();

const highlighted = css({
  color: colors.accent,
}).toString();

const icon = css({
  flexGrow: 1,
  marginTop: 2,
}).toString();

const label = css({
  marginBottom: 2,
}).toString();

export default {
  container,
  icon,
  regular,
  highlighted,
  label,
};
