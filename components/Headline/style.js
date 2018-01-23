/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const headline = {
  fontWeight: 700,
  lineHeight: 1.17,
  paddingRight: 40,
};

const large = css({
  ...headline,
  fontSize: 34,
  margin: `${variables.gap.small}px 20px 20px`,
}).toString();

const small = css({
  ...headline,
  fontSize: 22,
  margin: '26px 20px 16px',
}).toString();

export default {
  large,
  small,
};
