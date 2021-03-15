import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import styles from './style';

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @param {Array} props.messages The message content.
 * @param {Object} props.classNames Styling.
 * @return {JSX}
 */
const MessageBar = memo(({ messages, classNames }) => (
  <div
    className={classnames(styles.container, classNames.container, 'engage__message-bar')}
    role={messages.length > 0 ? 'alert' : null}
  >
    {messages.map((item) => {
      const {
        type = 'info',
        message,
        messageParams = null,
        translated,
      } = item;

      const messageOutput = !translated ? i18n.text(message, messageParams) : message;

      return (
        <div
          key={`${type}-${message}`}
          className={classnames(classNames.message, styles[type])}
        >
          <span className={styles.srOnly}>
            {`${i18n.text(`cart.message_type_${type}`)}: ${messageOutput}`}
          </span>
          <span aria-hidden>
            {messageOutput}
          </span>
        </div>
      );
    })}
  </div>
));

MessageBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  classNames: PropTypes.shape({
    container: PropTypes.string,
    message: PropTypes.string,
  }),
};

MessageBar.defaultProps = {
  classNames: {
    container: null,
    message: null,
  },
};

export default MessageBar;
