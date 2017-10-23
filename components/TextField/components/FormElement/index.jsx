/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import styles from './style';

const FormElement = (props) => {
  if (props.type === 'textarea') {
    return (<textarea {...props} validateOnBlur />);
  } else {
    return (<Input {...props} validateOnBlur />);
  }
};

FormElement.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

FormElement.defaultProps = {
  className: styles.input,
  type: 'text',
};

export default FormElement;
