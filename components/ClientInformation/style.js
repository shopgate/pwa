/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = cxs({
  position: 'relative',
  textAlign: 'center',
  color: colors.shade9,
  fontSize: 12,
  paddingBottom: 20,
});

const unselectable = cxs({
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
  userSelect: 'none',
});

const deviceId = cxs({
  wordBreak: 'break-all',
  padding: `0 ${variables.gap.big}px`,
});

export default {
  wrapper,
  unselectable,
  deviceId,
};
