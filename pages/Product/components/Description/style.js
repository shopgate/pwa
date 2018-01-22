/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const container = css({
  backgroundColor: colors.shade8,
  fontSize: 14,
  padding: '13px 16px 16px',
}).toString();

const title = css({
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 8,
}).toString();

const content = css({
  lineHeight: 1.7,
}).toString();

const placeholder = css({
  height: 14,
}).toString();

export default {
  container,
  title,
  content,
  placeholder,
};
