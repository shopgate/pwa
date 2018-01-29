/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  display: 'flex',
  position: 'relative',
  whiteSpace: 'nowrap',
}).toString();

const disclaimer = css({
  color: 'initial',
  fontSize: 14,
  position: 'absolute',
  right: -10,
  top: 0,
}).toString();

const discounted = css({
  color: colors.primary,
}).toString();

export default {
  container,
  disclaimer,
  discounted,
};
