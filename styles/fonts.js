/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';

const fonts = {
  family: 'system, -apple-system, "SF Pro Display", "Helvetica Neue", "Lucida Grande"',
  rootSize: 17,
  lineHeight: 1.43,
};

css.global('body', {
  font: `${fonts.rootSize}px/${fonts.lineHeight} ${fonts.family}`,
});

export default fonts;
