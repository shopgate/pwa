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
  position: 'relative',
  textAlign: 'center',
  color: colors.shade9,
  fontSize: 12,
  paddingBottom: 20,
}).toString();

const unselectable = css({
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
}).toString();

const deviceId = css({
  wordBreak: 'break-all',
  padding: `0 ${variables.gap.big}px`,
}).toString();

export default {
  wrapper,
  unselectable,
  deviceId,
};
