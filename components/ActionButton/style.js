/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const halfGapBig = variables.gap.big / 2;

const containerBase = {
  textAlign: 'center',
};

const container = css({
  ...containerBase,
  margin: `${halfGapBig}px 0`,
}).toString();

const noGapContainer = css({
  ...containerBase,
}).toString();

const containerCircle = css({
  ...containerBase,
  margin: `${halfGapBig + 4}px 0`,
}).toString();

export default {
  container,
  containerCircle,
  noGapContainer,
};
