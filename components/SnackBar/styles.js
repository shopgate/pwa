/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';

const drawer = css({
  width: '100%',
  background: 'black',
}).toString();

const message = css({
  color: 'white',
}).toString();

export default {
  drawer,
  message,
};
