/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const grid = css({
  padding: '0 15px',
  marginBottom: 8,
}).toString();

const gridItem = css({
  width: '50%',
  padding: '0 5px',
}).toString();

const button = css({
  width: '100%',
  ' *': {
    textAlign: 'center',
  },
}).toString();

export default {
  grid,
  gridItem,
  button,
};
