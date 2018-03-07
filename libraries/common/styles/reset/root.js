/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

css.global('*, *:before, *:after', {
  boxSizing: 'border-box',
});

css.global('html', {
  MozOsxFontSmoothing: 'grayscale',
  WebkitFontSmoothing: 'antialiased',
  MsTextSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
  WebkitTapHighlightColor: 'transparent',
});

css.global('body', {
  margin: 0,
  WebkitTapHighlightColor: 'transparent',
});
