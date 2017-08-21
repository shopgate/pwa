/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cxs from 'cxs';
import { shade5, shade7 } from 'Styles/colors';
import { navigator, gap } from 'Styles/variables';

const disabled = cxs({
  color: shade5,
});

const selected = cxs({
  background: shade7,
  boxShadow: `0 -1px 0 0 ${shade7}, 0 1px 0 0 ${shade7}`,
});

const title = cxs({
  width: '100%',
  marginTop: 2,
  paddingRight: 16,
  hyphens: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
});

const grid = cxs({
  alignItems: 'center',
  minHeight: navigator.height,
  padding: `${gap.small}px 0`,
  position: 'relative',
  zIndex: 2,
});

const image = cxs({
  alignSelf: 'flex-start',
  flexShrink: 0,
  margin: `0 ${gap.big}px`,
  width: 40,
});

export default {
  disabled,
  selected,
  title,
  grid,
  image,
};
