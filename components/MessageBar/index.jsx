/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
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
 * @param {Object} props.classNames Styling.
 * @return {JSX}
 */
const MessageBar = ({ messages, classNames }) => (
  <div className={`${classNames.container} ${styles.container}`}>
    {messages.map(({ type = 'info', message }) => (
      <div key={`${type}-${message}`} className={`${classNames.message} ${styles[type]}`}>
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
  classNames: PropTypes.shape({
    container: PropTypes.string,
    message: PropTypes.string,
  }),
};

MessageBar.defaultProps = {
  messages: [],
  classNames: {
    container: '',
    message: '',
  },
};

export default MessageBar;
