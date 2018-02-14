/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const buttonDefaults = {
  display: 'block',
  width: '100%',
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  fontFamily: 'inherit',
  textAlign: 'left',
  lineHeight: 1.2,
  outline: 'none',
  background: colors.shade8,
};

const button = css({
  ...buttonDefaults,
}).toString();

const buttonDisabled = css({
  ...buttonDefaults,
  color: colors.shade4,
}).toString();

const label = css({
  display: 'block',
  fontWeight: 500,
  ':not(:only-child)': {
    fontWeight: 400,
    fontSize: '0.75rem',
    marginBottom: 4,
  },
}).toString();

const value = css({
  display: 'block',
  fontWeight: 500,
}).toString();

export default {
  button,
  buttonDisabled,
  label,
  value,
};
