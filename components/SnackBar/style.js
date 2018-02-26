/**
 *  Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const drawer = css({
  width: '100%',
  padding: `${variables.gap.big}px`,
  bottom: [
    `${variables.tabBar.height}px`,
    `calc(${variables.tabBar.height}px + var(--safe-area-inset-bottom))`,
  ],
  zIndex: 5,
}).toString();

export default {
  drawer,
};
