/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pickerButtonStyle from 'Components/Picker/components/Button/style';
import style from './style';

/**
 * Gets the styles for rendering a button.
 * @param {boolean} highlighted Whether the button is currently highlighted.
 * @param {boolean} disabled Whether the button is currently disabled.
 * @return {string} The style class names for the given settings.
 */
const getButtonStyles = ({ highlighted, disabled }) => {
  let buttonStyles = style.pickerButton;

  if (highlighted) {
    buttonStyles = `${buttonStyles} ${style.pickerButtonHighlighted}`;
  }

  if (disabled) {
    buttonStyles = `${buttonStyles} ${pickerButtonStyle.buttonDisabled}`;
  } else {
    buttonStyles = `${buttonStyles} ${pickerButtonStyle.button}`;
  }

  return buttonStyles;
};

/**
 * Renders a picker button for the product variant selection.
 * @param {Object} props The component props.
 * @param {function} props.openList The callback for opening the selection list.
 * @param {string} props.label The label of the picker button.
 * @param {string} props.value The selected value of the picker button to display.
 * @param {boolean} props.highlighted Whether the button is currently highlighted.
 * @param {boolean} props.disabled Whether the button is currently disabled.
 * @returns {JSX} The rendered component.
 */
const ProductVariantPickerButton = props => (
  <button className={getButtonStyles(props)} onClick={props.openList}>
    <span className={pickerButtonStyle.label}>{props.label}</span>
    {props.value && (
      <span className={pickerButtonStyle.value}>{props.value}</span>
    )}
  </button>
);

ProductVariantPickerButton.propTypes = {
  label: PropTypes.node.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  highlighted: PropTypes.bool,
  openList: PropTypes.func,
  value: PropTypes.node,
};

ProductVariantPickerButton.defaultProps = {
  disabled: false,
  highlighted: false,
  openList: () => {},
  value: null,
};

export default ProductVariantPickerButton;
