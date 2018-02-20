/**
 *  Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import { css } from 'glamor';
import colors from 'Styles/colors';

const actionButton = css({
  color: colors.primary,
  flexGrow: 1,
  textTransform: 'uppercase',
  textAlign: 'right',
  padding: '7px 0',
  wordBreak: 'keep-all',
  ':focus': {
    outline: 'none',
  },
}).toString();

export default {
  actionButton,
};
