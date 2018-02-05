/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const materialShadow = 'rgba(0, 0, 0, .117647) 0 1px 6px, rgba(0, 0, 0, .117647) 0 1px 4px';

module.exports = {
  font: {
    family: 'Roboto, Arial, sans-serif',
    rootSize: 16,
    lineHeight: 1.5,
  },
  colors: {
    background: '#f8f8f8',
    light: '#fff',
    dark: '#000',
    accent: '#5ccee3',
    placeholder: '#f2f2f2',
    primary: '#fa5400',
    darkGray: '#eaeaea',
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
    error: '#ff0000',
  },
  variables: {
    materialShadow,
    gap: {
      xsmall: 4,
      small: 8,
      big: 16,
      bigger: 20,
      xbig: 32,
      xxbig: 64,
    },
    emptyPage: {
      icon: 216,
      titleTopGap: 36,
      buttonVerticalGap: 24,
    },
    navigator: {
      height: 56,
      shadow: materialShadow,
    },
    filterbar: {
      height: 48,
    },
    loadingIndicator: {
      size: 32,
      strokeWidth: 3,
    },
    paymentBar: {
      height: 78,
    },
  },
};
