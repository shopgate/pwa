/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const stateOk = css({
  color: colors.success,
}).toString();

const stateWarning = css({
  color: colors.warning,
}).toString();

const stateAlert = css({
  color: colors.error,
}).toString();

export default {
  stateOk,
  stateWarning,
  stateAlert,
};
