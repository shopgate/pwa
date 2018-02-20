/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const container = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 0,
  flexShrink: 0,
  fontSize: '1.75rem',
  width: 44,
  height: 44,
  background: '#f0f0f0',
  borderRadius: 5,
  padding: 0,
  opacity: 1,
  transform: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  outline: 0,
  ':active svg': {
    opacity: 0.5,
  },
});

export default {
  container,
};
