/**
 *  Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import I18n from '@shopgate/pwa-common/components/I18n';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';

/**
 * Message component.
 * @returns {function}
 */
const Message = ({ text }) => (
  <p className={styles.message}>
    <I18n.Text string={text} />
  </p>
);

Message.propTypes = {
  text: PropTypes.string,
};

Message.defaultProps = {
  text: null,
};

export default Message;
