/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  position: 'absolute',
  width: '100%',
  margin: `0 0 0 -${variables.gap.big}px`,
  top: '4px',
}).toString();

const input = css({
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
}).toString();

const overlay = css({
  position: 'fixed',
  left: -variables.navigator.height,
  top: variables.navigator.height,
  width: '100vw',
  height: '100vh',
  background: 'transparent',
  zIndex: 10,
}).toString();

const slideInSearchBar = css.keyframes({
  '0%': {
    transform: 'translateX(100%)',
    opacity: 0.5,
  },
  '100%': { transform: 'translateX(0)' },
});

const slideOutSearchBar = css.keyframes({
  '0%': { transform: 'translateX(0)' },
  '100%': { transform: 'translateX(100%)' },
});

const animation = {
  in: css({
    animation: `${slideInSearchBar} 150ms 1 both cubic-bezier(0.25, 0.1, 0.25, 1)`,
  }).toString(),
  out: css({
    animation: `${slideOutSearchBar} 150ms 1 both ease-in`,
  }).toString(),
};

export default {
  container,
  input,
  animation,
  overlay,
};
