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

const ErrorText = (props) => (
  <div className={styles.error}>
    <I18n.Text string={props.validationError || props.errorText} />
  </div>
);

ErrorText.propTypes = {
  errorText: PropTypes.string,
  validationError: PropTypes.string,
};

ErrorText.defaultProps = {
  validationError: null,
  errorText: null,
};

export default ErrorText;

