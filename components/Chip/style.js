/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

/**
 * Gets a basic style object for the chip layout.
 * @param {boolean} hasRemoveButton Whether this chip has a remove button.
 * @returns {Object} The style object.
 */
const chipBase = (hasRemoveButton = true) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 26,
  outline: 0,
  height: 26,
  paddingRight: variables.gap.small,
  paddingLeft: variables.gap.small * (hasRemoveButton ? 0.5 : 1),
  marginRight: 5,
  marginTop: 5,
  marginBottom: 5,
  minWidth: 0,
});

/**
 * Gets a style class for the chip layout.
 * @param {boolean} hasRemoveButton Whether this chip has a remove button.
 * @param {boolean} inverted Whether the colors of the chip are inverted.
 * @returns {string} The style class name.
 */
const chip = (hasRemoveButton = true, inverted = false) => css({
  ...chipBase(hasRemoveButton),
  backgroundColor: (inverted ? colors.accent : colors.accentContrast),
  color: (inverted ? colors.accentContrast : colors.accent),
}).toString();

const removeButton = css({
  flexShrink: 0,
  margin: 0,
  padding: 0,
}).toString();

const name = css({
  paddingLeft: (variables.gap.small * 0.5),
  paddingRight: (variables.gap.small * 0.5),
  paddingTop: 3,
  paddingBottom: 3,
  fontSize: 12,
  fontWeight: 500,
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'block',
  lineHeight: '1',
  color: 'inherit',
}).toString();

export default {
  chip,
  removeButton,
  name,
};
