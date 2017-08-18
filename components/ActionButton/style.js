/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import { gap } from 'Styles/variables';

const halfGapBig = gap.big / 2;

const containerBase = {
  textAlign: 'center',
};

const container = cxs({
  ...containerBase,
  margin: `${halfGapBig}px 0`,
});

const containerCircle = cxs({
  ...containerBase,
  margin: `${halfGapBig + 4}px 0`,
});

export default {
  container,
  containerCircle,
};
