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
  textAlign: 'left',
  padding: '10px 20px',
}).toString();

const label = css({
  display: 'block',
}).toString();

const value = css({
  display: 'block',
  fontWeight: 'bold',
}).toString();

export default {
  button,
  label,
  value,
};
