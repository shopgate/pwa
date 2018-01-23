/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { css } from 'glamor';
import colors from 'Styles/colors';

/**
 * The style object for a one line text element with an ellipsis on overflow.
 */
const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

/**
 * The styles for the error message.
 */
const error = css({
  position: 'absolute',
  bottom: 2,
  fontSize: 12,
  lineHeight: '14px',
  color: colors.error,
  ...ellipsisLine,
}).toString();

export default {
  error,
};
