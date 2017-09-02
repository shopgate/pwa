/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

export default css({
  display: 'flex',
  minHeight: 60,
  marginBottom: variables.gap.small,
  ':last-child': {
    marginBottom: variables.gap.big,
  },
}).toString();
