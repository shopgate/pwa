/**
 *  Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import colors from 'Styles/colors';

const message = css({
  color: colors.shade6,
  fontSize: 'smaller',
  fontWeight: 500,
  margin: 0,
  textAlign: 'left',
  maxWidth: '75%',
  paddingTop: 7,
  paddingBottom: 7,
}).toString();

export default {
  message,
};
