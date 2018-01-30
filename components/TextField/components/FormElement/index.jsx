/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import styles from './style';

/**
 * Creates an input or a multiLine based on the type prop.
 * @param {Object} props The props.
 * @returns {JSX}
 */
const FormElement = (props) => {
  const styleType = props.multiLine ? 'multiLine' : 'input';
  return (
    <Input
      {...props}
      className={styles[styleType]}
      validateOnBlur
    />);
};

FormElement.propTypes = {
  multiLine: PropTypes.bool,
};

FormElement.defaultProps = {
  multiLine: false,
};

export default FormElement;
