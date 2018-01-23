/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = css({
  padding: variables.gap.big,
}).toString();

const price = css({
  color: colors.accent,
  display: 'inline-block',
  textAlign: 'center',
  minWidth: 70,
}).toString();

const rangeSlider = {
  container: css({
    paddingTop: variables.gap.big,
    paddingBottom: variables.gap.big,
  }).toString(),

  outerRange: css({
    background: colors.darkGray,
    height: 2,
    position: 'relative',
  }).toString(),

  range: css({
    background: colors.accent,
    position: 'absolute',
    height: '100%',
    marginLeft: variables.gap.small,
    marginRight: variables.gap.small,
  }).toString(),

  handleInner: css({
    background: colors.accent,
    borderRadius: '50%',
    width: variables.gap.big,
    height: variables.gap.big,
  }).toString(),

  handleOuter: css({
  }).toString(),
};

export default {
  wrapper,
  price,
  rangeSlider,
};
