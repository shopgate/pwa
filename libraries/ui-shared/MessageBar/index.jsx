import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The MessageBar component.
 * @param {Object} props The component props.
 * @param {Array} props.messages The message content.
 * @param {Object} props.classNames Styling.
 * @return {JSX}
 */
const MessageBar = ({ messages, classNames }) => (
  <div className={`${classNames.container} ${styles.container}`}>
    {messages.map(({
      type = 'info',
      message,
      messageParams = null,
      translated,
    }) => (
      <div key={`${type}-${message}`} className={`${classNames.message} ${styles[type]}`}>
        { translated === false ? <I18n.Text string={message} params={messageParams} /> : message }
      </div>
    ))}
  </div>
);

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
    container: '',
    message: '',
  },
};

export default MessageBar;
