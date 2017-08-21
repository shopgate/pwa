/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = cxs({
  position: 'absolute',
  width: '100%',
  margin: `0 0 0 -${variables.gap.big}px`,
  top: '4px',
});

const input = cxs({
  display: 'block',
  position: 'relative',
  width: '100%',
  fontSize: '1rem',
  border: `1px ${colors.shade7} solid`,
  padding: `0 ${variables.gap.big}px`,
  background: colors.light,
  lineHeight: '46px',
  borderRadius: '2px',
  outline: 'none',
});

const overlay = cxs({
  position: 'fixed',
  left: -variables.navigator.height,
  top: variables.navigator.height,
  width: '100vw',
  height: '100vh',
  background: 'transparent',
  zIndex: 10,
});

const animation = {
  in: cxs({
    animation: 'slideInSearchBar 150ms 1 both cubic-bezier(0.25, 0.1, 0.25, 1)',
  }),
  out: cxs({
    animation: 'slideOutSearchBar 150ms 1 both ease-in',
  }),
};

cxs({
  '@keyframes slideInSearchBar': {
    '0%': {
      transform: 'translateX(100%)',
      opacity: 0.5,
    },
    '100%': { transform: 'translateX(0)' },
  },
});

cxs({
  '@keyframes slideOutSearchBar': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(100%)' },
  },
});

export default {
  container,
  input,
  animation,
  overlay,
};
