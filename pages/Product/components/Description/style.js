/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const content = css({
  backgroundColor: colors.shade8,
  padding: 16,
}).toString();

const about = css({
  fontWeight: 500,
}).toString();

const placeholder = css({
  height: 14,
}).toString();

export default {
  content,
  about,
  placeholder,
};
