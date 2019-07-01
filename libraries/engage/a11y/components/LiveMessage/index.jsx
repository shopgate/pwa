import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '../../../components';
import styles from './styles';

/**
 * The LiveMessage component can be used to broadcast "aria-live" messages to assistive technology.
 * @param {string} message The message - i18n placeholders are supported.
 * @param {Object} params Optional params for the message.
 * @param {string} 'aria-live' The aria-live type.
 * @returns {JSX}
 */
const LiveMessage = ({ message, params, 'aria-live': ariaLive }) => (
  <div className={styles} role="log" aria-live={ariaLive}>
    <I18n.Text string={message} params={params} />
  </div>
);

LiveMessage.propTypes = {
  message: PropTypes.string.isRequired,
  'aria-live': PropTypes.string,
  params: PropTypes.shape(),
};

LiveMessage.defaultProps = {
  'aria-live': 'polite',
  params: null,
};

export default LiveMessage;
