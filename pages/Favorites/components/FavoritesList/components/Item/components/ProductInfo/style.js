/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const name = css({
  fontWeight: 500,
  lineHeight: 1.125,
  marginBottom: '1em',
}).toString();

const propertiesContainer = css({
  paddingRight: variables.gap.small,
  fontSize: 14,
}).toString();

const priceContainer = css({
  paddingLeft: variables.gap.small,
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  fontSize: 14,
}).toString();

const detailsRow = css({
  justifyContent: 'space-between',
  alignItems: 'flex-end',
}).toString();

export default {
  detailsRow,
  name,
  priceContainer,
  propertiesContainer,
};
