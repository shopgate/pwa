/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * SnackBar action button.
 * @param {Object} props Props.
 * @returns {JSX}
 */
const ActionButton = props => (
  <button
    className={styles.actionButton}
    onClick={props.onClick}
  >
    <I18n.Text string={props.text} />
  </button>
);

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default ActionButton;
