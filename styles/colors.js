/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const colors = (process.env.NODE_ENV !== 'test' && themeConfig && themeConfig.colors) ? themeConfig.colors : {};

export default {
  accent: '#5ccee3',
  accentContrast: '#fff',
  background: '#f8f8f8',
  dark: '#000',
  darkGray: '#eaeaea',
  error: '#ff0000',
  focus: '#fa5400',
  light: '#fff',
  placeholder: '#f2f2f2',
  primary: '#fa5400',
  primaryContrast: '#fff',
  shade3: '#9a9a9a',
  shade4: '#b5b5b5',
  shade5: '#ccc',
  shade6: '#656565',
  shade7: '#eaeaea',
  shade8: '#f7f7f7',
  shade9: '#8d8d8d',
  shade10: '#f4f4f4',
  shade11: '#747474',
  shade12: '#939393',
  success: '#35cc29',
  warning: '#ff9300',
  ...colors,
};
