/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  paddingTop: 60,
}).toString();

const widgetWrapper = css({
  background: colors.shade8,
}).toString();

export default {
  container,
  widgetWrapper,
};
