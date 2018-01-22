/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const messagesContainer = css({
  background: colors.light,
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
}).toString();

const messages = css({
  borderRadius: 4,
  padding: `${variables.gap.small / 2}px ${variables.gap.small}px`,
  lineHeight: 1.125,
}).toString();

export default {
  messagesContainer,
  messages,
};
