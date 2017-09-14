/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const availability = {
  marginRight: variables.gap.big,
  minWidth: 100,
};

const availabilities = {
  alert: css({
    ...availability,
    color: colors.error,
  }).toString(),
  ok: css({
    ...availability,
  }).toString(),
  warning: css({
    ...availability,
    color: colors.warning,
  }).toString(),
};

export default {
  availabilities,
};
