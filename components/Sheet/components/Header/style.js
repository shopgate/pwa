/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const closeButton = css({
  lineHeight: 1,
  outline: 0,
  padding: 0,
  minWidth: variables.navigator.height,
  height: variables.navigator.height,
  position: 'relative',
  zIndex: 2,
}).toString();

const closeIcon = css({
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}).toString();

const title = css({
  fontSize: '1.25rem',
  fontWeight: 500,
  position: 'relative',
  alignItems: 'center',
  padding: `0 ${variables.gap.big}px`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  alignSelf: 'center',
}).toString();

export default {
  closeButton,
  closeIcon,
  title,
};
