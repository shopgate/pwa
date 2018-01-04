/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const messagesContainer = css({
  padding: variables.gap.big,
  backgroundColor: colors.light,
}).toString();

const messages = css({

  borderRadius: 4,
}).toString();

export default {
  messagesContainer,
  messages,
};
