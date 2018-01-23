/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import variables from 'Styles/variables';

const { gap } = variables;

const content = css({
  fontSize: 14,
  padding: `0 ${(gap.small * 1.375)}px ${gap.big}px`,
  marginBottom: 12,
}).toString();

const label = css({
  paddingBottom: (gap.small * 1.5),
}).toString();

const cell = css({
  maxWidth: 100,
  padding: '2px 5px',
  overflowWrap: 'break-word',
}).toString();

const table = css({
  paddingTop: 2,
}).toString();

export default {
  content,
  label,
  cell,
  table,
};
