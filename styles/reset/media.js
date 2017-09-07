/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

css.global('audio:not([controls])', {
  display: 'none',
  height: 0,
});

css.global('figure', {
  margin: 0,
});

css.global('iframe', {
  border: 0,
  display: 'block',
  width: '100%',
});

css.global('img, svg', {
  display: 'block',
  maxWidth: '100%',
});

css.global('progress', {
  verticalAlign: 'baseline',
});
