/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const button = css({
  display: 'block',
  width: '100%',
  padding: '10px 20px',
  outline: 'none',
  textAlign: 'left',
}).toString();

const active = css({
  button: {
    fontWeight: 'bold',
  },
}).toString();

export default {
  button,
  active,
};
