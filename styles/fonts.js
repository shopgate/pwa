/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { font } = themeConfig;

css.global('body', {
  font: `${font.rootSize}px/${font.lineHeight} ${font.family}`,
});

export default font;
