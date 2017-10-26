/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import TextArea from '@shopgate/pwa-common/components/TextArea';
import styles from './style';

/**
 * Creates an input or a textarea based on the type prop.
 * @param {Object} props - The props.
 * @returns {JSX}
 * @constructor
 */
const FormElement = (props) => {
  if (props.type === 'textarea') {
    return (
      <TextArea
        {...props}
        className={styles.textarea}
        validateOnBlur
      />);
  }

  return (
    <Input
      {...props}
      className={styles.input}
      validateOnBlur
    />);
};

FormElement.propTypes = {
  type: PropTypes.string,
};

FormElement.defaultProps = {
  type: 'text',
};

export default FormElement;
