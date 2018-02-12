/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const ctaButtonWrapper = css({
  marginTop: `-${variables.gap.big}px`,
  marginLeft: variables.gap.big,
  display: 'flex',
  alignItems: 'center',
}).toString();

const cartButton = css({
  marginLeft: 22,
}).toString();

export default {
  cartButton,
  ctaButtonWrapper,
};
