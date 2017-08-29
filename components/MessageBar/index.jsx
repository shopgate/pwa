/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The message bar component.
 * @param {Object} props The component props.
 * @param {Array} props.messages The message content.
 * @return {JSX}
 */
const MessageBar = ({ messages }) => (
  <div className={styles.container}>
    {messages.map(({ type = 'info', message }) => (
      <div key={`${type}-${message}`} className={styles[type]}>
        {message}
      </div>
    ))}
  </div>
);

MessageBar.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
};

MessageBar.defaultProps = {
  messages: [],
};

export default MessageBar;
