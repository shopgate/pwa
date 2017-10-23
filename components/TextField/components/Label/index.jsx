/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * Renders the label element.
 * @param {boolean} isFocused Whether the input component is focused.
 * @param {boolean} isFloating Whether the label is floating.
 * @param {boolean} hasErrorMessage Whether the input field has an active error message.
 * @return {JSX}
 */
const Label = (props) => {
  const labelStyles = styles.labelStyles(props.isFocused, props.isFloating, props.hasErrorMessage);

  return (
    <label
      htmlFor={props.name}
      className={labelStyles}
    >
      <I18n.Text string={props.label} />
    </label>
  );
};

Label.propTypes = {
  hasErrorMessage: PropTypes.bool,
  isFloating: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
};

Label.defaultProps = {
  name: '',
  label: '',
  isFocused: false,
  isFloating: false,
  hasErrorMessage: false,
};

export default Label;
