import React from 'react';
import PropTypes from 'prop-types';
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
    {messages.map(({ type = 'info', message }) => (
      <div key={`${type}-${message}`} className={`${classNames.message} ${styles[type]}`}>
        {message}
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
