/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const shadow = '0 5px 7px rgba(0,0,0,0.09), 0 3px 6px rgba(0,0,0,0.07)';

export default css({
  boxShadow: shadow,
  margin: '5px 5px 10px',
  borderRadius: 2,
  background: colors.light,
  overflow: 'hidden',
}).toString();
