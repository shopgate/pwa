/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const label = css({
  background: colors.dark,
  opacity: 0.1,
  width: '100%',
  height: 16,
  marginBottom: 12,
}).toString();

export default {
  label,
};
