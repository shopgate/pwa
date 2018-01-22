/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const container = css({
  margin: `${variables.gap.big}px`,
}).toString();

const ratingScale = css({
  marginBottom: variables.gap.big,
});

export default {
  container,
  ratingScale,
};
